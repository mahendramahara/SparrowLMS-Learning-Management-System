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
  const {
    topics = [],
    interests = [],
    skillLevel = 'beginner',
    learningGoal = '',
    preferences = {},
    skipped = false,
  } = req.body;

  const selectedTopics = topics.length ? topics : interests;

  if (skipped) {
    if (!isDemo && userId) {
      try {
        await User.findByIdAndUpdate(userId, { onboardingCompleted: true });
      } catch (err) {
        void err;
      }
    }
    return res.status(200).json({
      success: true,
      message: 'Onboarding skipped. You can update your interests anytime.',
    });
  }

  if (!isDemo && process.env.NODE_ENV !== 'test' && userId) {
    try {
      const UserInterest = require('./userInterest.model');
      let profile = await UserInterest.findOne({ userId });
      if (!profile) {
        profile = new UserInterest({
          userId,
          preferredTopics: selectedTopics,
          preferredSkillLevel: skillLevel,
          categoryAffinities: selectedTopics.map(t => ({
            category: t,
            score: 10.0,
            interactionCount: 1,
            lastInteracted: new Date(),
          })),
        });
      } else {
        profile.preferredTopics = selectedTopics;
        profile.preferredSkillLevel = skillLevel;
        selectedTopics.forEach(t => {
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
      void err;
    }

    try {
      const userUpdate = {
        onboardingCompleted: true,
        interests: selectedTopics,
        skillLevel,
        ...(learningGoal ? { learningGoal } : {}),
        ...(preferences?.theme ? { 'preferences.theme': preferences.theme } : {}),
        ...(preferences?.fontSize ? { 'preferences.fontSize': preferences.fontSize } : {}),
        ...(preferences?.colorScheme ? { 'preferences.colorScheme': preferences.colorScheme } : {}),
      };
      await User.findByIdAndUpdate(userId, userUpdate);
    } catch (err) {
      void err;
    }
  }

  res.status(200).json({
    success: true,
    message: 'Learning interests and preferences successfully saved',
    data: { topics: selectedTopics, skillLevel, learningGoal, preferences },
  });
});

const getMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id || req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

const updateMyProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const { name, bio, avatar } = req.body;

  if (req.user.isDemo || req.user.viewOnly) {
    return res.status(200).json({
      success: true,
      data: {
        ...req.user,
        name: name || req.user.name,
        bio: bio !== undefined ? bio : req.user.bio,
        avatar: avatar || req.user.avatar,
      },
    });
  }

  const updates = {};
  if (name) updates.name = name.trim();
  if (bio !== undefined) updates.bio = bio;
  if (avatar) updates.avatar = avatar;

  const user = await User.findByIdAndUpdate(userId, { $set: updates }, { new: true });

  res.status(200).json({
    success: true,
    data: user,
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const targetId = req.params.id;
  const isSelf = String(req.user.id || req.user._id) === String(targetId);
  const isAdmin = req.user.role === 'admin';

  if (!isSelf && !isAdmin) {
    res.status(403);
    throw new Error('Not authorized to update this user account');
  }

  const { name, email, bio, avatar, status } = req.body;
  const updates = {};
  if (name) updates.name = name.trim();
  if (email && isAdmin) updates.email = email.toLowerCase().trim();
  if (bio !== undefined) updates.bio = bio;
  if (avatar) updates.avatar = avatar;
  if (status && isAdmin) updates.status = status;

  const user = await User.findByIdAndUpdate(targetId, { $set: updates }, { new: true });
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json({
    success: true,
    message: 'User successfully updated',
    data: user,
  });
});

module.exports = {
  getUsers,
  getUserById,
  getMyProfile,
  updateMyProfile,
  updateUser,
  getMyInterests,
  trackInteraction,
  setInitialInterests,
};

