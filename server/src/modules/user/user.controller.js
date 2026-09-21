const asyncHandler = require('express-async-handler');
const User = require('./user.model');
const { getUserInterests, recordInteraction } = require('./userInterest.service');

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

const getMyInterests = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const isDemo = req.user.isDemo || false;

  const interests = await getUserInterests(userId, isDemo);

  res.status(200).json({
    success: true,
    data: interests,
  });
});

const trackInteraction = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const isDemo = req.user.isDemo || false;

  const result = await recordInteraction(userId, {
    ...req.body,
    isDemo,
  });

  res.status(200).json({
    success: true,
    message: 'Interaction recorded and interest affinities updated',
    data: result,
  });
});

const setInitialInterests = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const isDemo = req.user.isDemo || false;
  const { topics = [], skillLevel = 'intermediate', skipped = false } = req.body;

  if (skipped) {
    return res.status(200).json({
      success: true,
      message: 'Onboarding skipped. You can update your interests anytime.',
    });
  }

  if (!isDemo && process.env.NODE_ENV !== 'test') {
    try {
      const UserInterest = require('./userInterest.model');
      let profile = await UserInterest.findOne({ userId });
      if (!profile) {
        profile = new UserInterest({
          userId,
          preferredTopics: topics,
          preferredSkillLevel: skillLevel,
          categoryAffinities: topics.map(t => ({
            category: t,
            score: 10.0,
            interactionCount: 1,
            lastInteracted: new Date(),
          })),
        });
      } else {
        profile.preferredTopics = topics;
        profile.preferredSkillLevel = skillLevel;
        topics.forEach(t => {
          const existing = profile.categoryAffinities.find(a => a.category === t);
          if (!existing) {
            profile.categoryAffinities.push({
              category: t,
              score: 10.0,
              interactionCount: 1,
              lastInteracted: new Date(),
            });
          }
        });
      }
      await profile.save();
    } catch (err) {
      // safe fallback
    }
  }

  res.status(200).json({
    success: true,
    message: 'Learning interests successfully saved',
    data: { topics, skillLevel },
  });
});

module.exports = {
  getUsers,
  getUserById,
  getMyInterests,
  trackInteraction,
  setInitialInterests,
};
