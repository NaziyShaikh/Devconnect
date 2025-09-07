import User from '../models/User.js';

export const updateProfile = async (req, res) => {
  try {
    const updates = req.body;

    // Only update provided fields, preserve others
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update only the fields that are provided in the request
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined && updates[key] !== null) {
        user[key] = updates[key];
      }
    });

    await user.save();
    res.json(user.toObject({ transform: (doc, ret) => { delete ret.password; return ret; } }));
  } catch (err) {
    res.status(500).json({ msg: 'Error updating profile' });
  }
};

// New endpoint for updating profile picture
export const updateProfilePicture = async (req, res) => {
  try {
    const { profilePicture } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.profilePicture = profilePicture;
    await user.save();

    res.json({
      msg: 'Profile picture updated successfully',
      profilePicture: user.profilePicture
    });
  } catch (err) {
    res.status(500).json({ msg: 'Error updating profile picture' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(404).json({ msg: 'User not found' });
  }
};

export const listDevelopers = async (req, res) => {
  try {
    const users = await User.find({ role: 'developer' }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to load users' });
  }
};

export const listAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to load users' });
  }
};

export const searchDevelopers = async (req, res) => {
  try {
    const skill = req.params.skill;
    const users = await User.find({
      skills: { $regex: skill, $options: 'i' },
      role: 'developer'
    }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Search failed' });
  }
};
