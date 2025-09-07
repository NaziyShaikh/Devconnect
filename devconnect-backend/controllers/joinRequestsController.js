import Project from '../models/Project.js';
import { createNotification } from './notificationController.js';

// Store io instance for real-time notifications
let ioInstance = null;

export const setIoInstance = (io) => {
  ioInstance = io;
};

export const getAllJoinRequests = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.id })
      .populate('requests', 'name email')
      .select('title requests');

    const allRequests = [];
    projects.forEach(project => {
      project.requests.forEach(request => {
        allRequests.push({
          projectId: project._id,
          projectTitle: project.title,
          userId: request._id,
          userName: request.name,
          userEmail: request.email
        });
      });
    });

    res.json(allRequests);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch join requests' });
  }
};

export const respondToJoinRequest = async (req, res) => {
  try {
    const { projectId, userId, accept } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ msg: 'Project not found' });

    if (!project.owner.equals(req.user.id))
      return res.status(403).json({ msg: 'Only owner can respond' });

    project.requests = project.requests.filter(id => id.toString() !== userId);

    if (accept) {
      project.collaborators.push(userId);
      await createNotification(userId, 'request_response', 'You were accepted to collaborate!', ioInstance);
    }

    await project.save();
    res.json({ msg: 'Response recorded' });
  } catch (err) {
    res.status(500).json({ msg: 'Error responding to request' });
  }
};
