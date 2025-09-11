import Profile from '../models/Profile.js';
import User from '../models/User.js';

// Create or Update profile
export const createOrUpdateProfile = async (req, res) => {
  const { bio, skills, github, portfolio, experience, location, role, profilePicture, resume } = req.body;

  const profileFields = {
    user: req.user._id,
    bio,
    skills,
    github,
    portfolio,
    experience,
    location,
    role,
    profilePicture,
    resume
  };

  try {
    let profile = await Profile.findOne({ user: req.user._id });

    if (profile) {
      // Update
      profile = await Profile.findOneAndUpdate(
        { user: req.user._id },
        { $set: profileFields },
        { new: true }
      );
      return res.json(profile);
    }

    // Create
    profile = new Profile(profileFields);
    await profile.save();
    res.status(201).json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get my profile
export const getMyProfile = async (req, res) => {
  const profile = await Profile.findOne({ user: req.user._id }).populate('user', ['username', 'email']);
  if (!profile) return res.status(404).json({ message: 'Profile not found' });
  res.json(profile);
};

// Get all profiles
export const getAllProfiles = async (req, res) => {
  const profiles = await Profile.find().populate('user', ['username', 'email']);
  res.json(profiles);
};

// Get profile by user ID
export const getProfileByUserId = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId }).populate('user', ['username', 'email']);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete my profile
export const deleteMyProfile = async (req, res) => {
  await Profile.findOneAndDelete({ user: req.user._id });
  res.json({ message: 'Profile deleted' });
};
