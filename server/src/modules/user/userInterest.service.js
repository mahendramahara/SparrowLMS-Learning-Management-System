const UserInterest = require('./userInterest.model');

// In-memory fallback cache for demo users (e.g., Aarav Gurung)
const demoInterestCache = new Map();

const ACTION_WEIGHTS = {
  search: 2.0,
  view_course: 4.0,
  watch_video: 8.0,
  complete_lesson: 12.0,
};

/**
 * Calculates exponential time decay factor based on half-life formula:
 * DecayFactor = e^(-lambda * deltaDays) where lambda = ln(2) / halfLifeDays
 */
const calculateDecayedScore = (previousScore, lastDate, halfLifeDays = 14) => {
  if (!previousScore || previousScore <= 0) return 0;
  const now = new Date().getTime();
  const past = new Date(lastDate || now).getTime();
  const deltaDays = Math.max(0, (now - past) / (1000 * 60 * 60 * 24));
  const lambda = Math.LN2 / halfLifeDays;
  return Number((previousScore * Math.exp(-lambda * deltaDays)).toFixed(4));
};

/**
 * Records a user learning interaction and updates category affinity scores with decay
 */
const recordInteraction = async (userId, payload) => {
  const {
    category = 'Software Architecture',
    action = 'view_course',
    courseId,
    courseTitle,
    durationMinutes = 10,
    completedPercentage = 25,
    keyword,
    isDemo = false,
  } = payload;

  const actionPoints = ACTION_WEIGHTS[action] || 3.0;

  // Handle demo users using memory store
  if (isDemo || userId.startsWith('demo_')) {
    let demoData = demoInterestCache.get(userId) || {
      userId,
      preferredTopics: ['Software Architecture', 'Media Engineering', 'Cybersecurity'],
      preferredSkillLevel: 'intermediate',
      categoryAffinities: [
        {
          category: 'Software Architecture',
          score: 14.5,
          interactionCount: 6,
          lastInteracted: new Date(),
        },
        {
          category: 'Media Engineering',
          score: 12.0,
          interactionCount: 4,
          lastInteracted: new Date(),
        },
        { category: 'Cybersecurity', score: 8.2, interactionCount: 3, lastInteracted: new Date() },
      ],
      watchHistory: [],
      searchKeywords: [],
      decayHalfLifeDays: 14,
    };

    // Apply decay and boost
    let found = false;
    demoData.categoryAffinities = demoData.categoryAffinities.map(item => {
      const decayed = calculateDecayedScore(
        item.score,
        item.lastInteracted,
        demoData.decayHalfLifeDays
      );
      if (item.category.toLowerCase() === category.toLowerCase()) {
        found = true;
        return {
          category: item.category,
          score: Number((decayed + actionPoints).toFixed(2)),
          interactionCount: item.interactionCount + 1,
          lastInteracted: new Date(),
        };
      }
      return { ...item, score: decayed };
    });

    if (!found) {
      demoData.categoryAffinities.push({
        category,
        score: actionPoints,
        interactionCount: 1,
        lastInteracted: new Date(),
      });
    }

    if (courseId && courseTitle) {
      demoData.watchHistory.unshift({
        courseId,
        courseTitle,
        category,
        timeSpentSeconds: durationMinutes * 60,
        completedPercentage,
        timestamp: new Date(),
      });
      demoData.watchHistory = demoData.watchHistory.slice(0, 10);
    }

    if (keyword) {
      demoData.searchKeywords.unshift({
        keyword: keyword.toLowerCase().trim(),
        count: 1,
        lastSearched: new Date(),
      });
    }

    demoInterestCache.set(userId, demoData);
    return demoData;
  }

  // Handle real registered users in MongoDB
  try {
    let userInterest = await UserInterest.findOne({ userId });

    if (!userInterest) {
      userInterest = new UserInterest({
        userId,
        preferredTopics: [category],
        categoryAffinities: [
          {
            category,
            score: actionPoints,
            interactionCount: 1,
            lastInteracted: new Date(),
          },
        ],
      });
    } else {
      let categoryMatch = false;
      userInterest.categoryAffinities = userInterest.categoryAffinities.map(aff => {
        const decayed = calculateDecayedScore(
          aff.score,
          aff.lastInteracted,
          userInterest.decayHalfLifeDays
        );

        if (aff.category.toLowerCase() === category.toLowerCase()) {
          categoryMatch = true;
          return {
            category: aff.category,
            score: Number((decayed + actionPoints).toFixed(2)),
            interactionCount: aff.interactionCount + 1,
            lastInteracted: new Date(),
          };
        }
        return {
          category: aff.category,
          score: decayed,
          interactionCount: aff.interactionCount,
          lastInteracted: aff.lastInteracted,
        };
      });

      if (!categoryMatch) {
        userInterest.categoryAffinities.push({
          category,
          score: actionPoints,
          interactionCount: 1,
          lastInteracted: new Date(),
        });
      }
    }

    if (courseId && courseTitle) {
      userInterest.watchHistory.unshift({
        courseId,
        courseTitle,
        category,
        timeSpentSeconds: durationMinutes * 60,
        completedPercentage,
        timestamp: new Date(),
      });
      userInterest.watchHistory = userInterest.watchHistory.slice(0, 20);
    }

    if (keyword) {
      const kw = keyword.toLowerCase().trim();
      const existingKw = userInterest.searchKeywords.find(k => k.keyword === kw);
      if (existingKw) {
        existingKw.count += 1;
        existingKw.lastSearched = new Date();
      } else {
        userInterest.searchKeywords.unshift({
          keyword: kw,
          count: 1,
          lastSearched: new Date(),
        });
      }
      userInterest.searchKeywords = userInterest.searchKeywords.slice(0, 20);
    }

    await userInterest.save();
    return userInterest;
  } catch (err) {
    console.error('UserInterest DB error:', err.message);
    return null;
  }
};

/**
 * Returns user interest profile with ranked affinities for adaptive recommendation
 */
const getUserInterests = async (userId, isDemo = false) => {
  if (isDemo || userId.startsWith('demo_')) {
    const cached = demoInterestCache.get(userId);
    if (cached) return cached;
    return {
      userId,
      preferredTopics: ['Software Architecture', 'Media Engineering', 'Cybersecurity'],
      preferredSkillLevel: 'intermediate',
      categoryAffinities: [
        {
          category: 'Software Architecture',
          score: 14.5,
          interactionCount: 6,
          lastInteracted: new Date(),
        },
        {
          category: 'Media Engineering',
          score: 12.0,
          interactionCount: 4,
          lastInteracted: new Date(),
        },
        { category: 'Cybersecurity', score: 8.2, interactionCount: 3, lastInteracted: new Date() },
      ],
      watchHistory: [
        {
          courseId: 'course-01',
          courseTitle: 'Distributed Video Processing with FFmpeg and HLS Streaming',
          category: 'Media Engineering',
          timeSpentSeconds: 2400,
          completedPercentage: 65,
          timestamp: new Date(),
        },
      ],
      searchKeywords: [{ keyword: 'hls streaming', count: 3, lastSearched: new Date() }],
    };
  }

  try {
    const interest = await UserInterest.findOne({ userId });
    if (!interest) {
      return {
        userId,
        preferredTopics: ['Software Architecture', 'Media Engineering'],
        preferredSkillLevel: 'intermediate',
        categoryAffinities: [],
        watchHistory: [],
        searchKeywords: [],
      };
    }
    // Sort affinities by score descending
    interest.categoryAffinities.sort((a, b) => b.score - a.score);
    return interest;
  } catch (err) {
    console.error('Failed to fetch UserInterest:', err.message);
    return null;
  }
};

module.exports = {
  recordInteraction,
  getUserInterests,
  calculateDecayedScore,
};
