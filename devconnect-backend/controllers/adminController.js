import User from '../models/User.js';
import Project from '../models/Project.js';

const reports = []; // In-memory; can be switched to MongoDB if needed

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch users' });
  }
};

export const blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.blocked = !user.blocked;
    await user.save();

    res.json({ msg: `User ${user.blocked ? 'blocked' : 'unblocked'}` });
  } catch (err) {
    res.status(500).json({ msg: 'Error blocking user' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'User deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete user' });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching projects' });
  }
};

export const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete project' });
  }
};

export const reportContent = (req, res) => {
  const { itemId, type, reason } = req.body;
  reports.push({ itemId, type, reason, reportedBy: req.user.id, date: new Date() });
  res.json({ msg: 'Content reported' });
};

export const getReports = (req, res) => {
  res.json(reports);
};
