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

export const getAllJoinRequestsAdmin = async (req, res) => {
  try {
    // Check if user is admin or developer
    if (req.user.role !== 'admin' && req.user.role !== 'developer') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const projects = await Project.find({})
      .populate('requests', 'name email')
      .populate('owner', 'name')
      .select('title requests owner');

    const allRequests = [];
    projects.forEach(project => {
      project.requests.forEach(request => {
        allRequests.push({
          _id: `${project._id}_${request._id}`, // Create unique ID for frontend
          projectId: {
            _id: project._id,
            title: project.title,
            owner: project.owner
          },
          userId: {
            _id: request._id,
            name: request.name,
            email: request.email
          },
          createdAt: new Date() // You might want to add a timestamp field to the model
        });
      });
    });

    res.json(allRequests);
  } catch (err) {
    console.error('Error fetching all join requests:', err);
    res.status(500).json({ msg: 'Failed to fetch join requests' });
  }
};

export const respondToJoinRequestAdmin = async (req, res) => {
  try {
    const { requestId, action } = req.params;

    // Check if user is admin or developer
    if (req.user.role !== 'admin' && req.user.role !== 'developer') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    // Parse the requestId to get projectId and userId
    const [projectId, userId] = requestId.split('_');

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ msg: 'Project not found' });

    // Remove the request from the project's requests array
    project.requests = project.requests.filter(id => id.toString() !== userId);

    if (action === 'accept') {
      project.collaborators.push(userId);
      await createNotification(userId, 'request_response', `You were accepted to collaborate on "${project.title}"!`, ioInstance);
    } else if (action === 'reject') {
      await createNotification(userId, 'request_response', `Your request to join "${project.title}" was declined.`, ioInstance);
    }

    await project.save();
    res.json({ msg: 'Response recorded successfully' });
  } catch (err) {
    console.error('Error responding to join request:', err);
    res.status(500).json({ msg: 'Error responding to request' });
  }
};
