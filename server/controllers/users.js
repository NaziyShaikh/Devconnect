const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ isBlocked: false })
      .select('-password')
      .populate('profile')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('profile');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
exports.updateProfile = async (req, res) => {
  try {
    console.log('Profile update request:', req.body);
    console.log('User ID from token:', req.user?.id);

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const fieldsToUpdate = {
      'profile.bio': req.body.bio,
      'profile.skills': req.body.skills,
      'profile.experience': req.body.experience,
      'profile.github': req.body.github,
      'profile.portfolio': req.body.portfolio,
      'profile.avatar': req.body.avatar,
      'profile.phone': req.body.phone,
      'profile.location': req.body.location,
      'profile.website': req.body.website,
      'profile.linkedin': req.body.linkedin,
      'profile.twitter': req.body.twitter
    };

    console.log('Fields to update:', fieldsToUpdate);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: fieldsToUpdate },
      { new: true, runValidators: true }
    ).select('-password').populate('profile');

    console.log('Updated user:', user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Search users by skills
// @route   GET /api/users/search
exports.searchUsers = async (req, res) => {
  try {
    const { skills, experience } = req.query;
    let query = { isBlocked: false };

    if (skills) {
      const skillsArray = skills.split(',').map(skill => skill.trim());
      query['profile.skills'] = { $in: skillsArray.map(skill => new RegExp(skill, 'i')) };
    }

    if (experience) {
      query['profile.experience'] = experience;
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
