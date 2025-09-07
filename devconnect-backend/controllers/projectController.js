import Project from '../models/Project.js';
import { createNotification } from './notificationController.js';

// Store io instance for real-time notifications
let ioInstance = null;

export const setIoInstance = (io) => {
  ioInstance = io;
};

export const createProject = async (req, res) => {
  try {
    // Handle form data with file upload
    const projectData = { ...req.body, owner: req.user.id };

    // Parse JSON fields that come as strings from form data
    if (projectData.techStack && typeof projectData.techStack === 'string') {
      try {
        projectData.techStack = JSON.parse(projectData.techStack);
      } catch (e) {
        projectData.techStack = [];
      }
    }

    if (projectData.rolesNeeded && typeof projectData.rolesNeeded === 'string') {
      try {
        projectData.rolesNeeded = JSON.parse(projectData.rolesNeeded);
      } catch (e) {
        projectData.rolesNeeded = [];
      }
    }

    // Handle file upload if present
    if (req.file) {
      // Upload to Cloudinary using buffer
      const cloudinary = (await import('../utils/cloudinary.js')).default;
      const result = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, {
        folder: 'devconnect-projects',
        resource_type: 'auto'
      });
      projectData.image = result.secure_url;
    }

    const project = new Project(projectData);
    await project.save();

    // Notify all developers about new project posting
    await createNotification(null, 'project_posted', `New project "${project.title}" posted by ${req.user.name}`, ioInstance);

    res.status(201).json(project);
  } catch (err) {
    console.error('Project creation error:', err.message, err.stack);
    res.status(500).json({ msg: 'Failed to create project', error: err.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate('owner', 'name');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching projects' });
  }
};

export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name')
      .populate('collaborators', 'name')
      .populate('requests', 'name');
    res.json(project);
  } catch (err) {
    res.status(404).json({ msg: 'Project not found' });
  }
};

export const requestJoin = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: 'Not found' });

    if (project.requests.includes(req.user.id))
      return res.status(400).json({ msg: 'Already requested' });

    project.requests.push(req.user.id);
    await project.save();

    await createNotification(project.owner, 'join_request', 'New join request on your project', ioInstance);

    res.json({ msg: 'Request sent' });
  } catch (err) {
    res.status(500).json({ msg: 'Join request failed' });
  }
};

export const respondToRequest = async (req, res) => {
  try {
    const { userId, accept } = req.body;
    const project = await Project.findById(req.params.id);
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

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: 'Project not found' });

    if (!project.owner.equals(req.user.id))
      return res.status(403).json({ msg: 'Only owner can update project' });

    // Update allowed fields
    const allowedFields = ['title', 'description', 'techStack', 'rolesNeeded', 'status', 'image', 'banner'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });

    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ msg: 'Project update failed' });
  }
};

export const updateProjectStatus = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: 'Project not found' });

    if (!project.owner.equals(req.user.id))
      return res.status(403).json({ msg: 'Only owner can update status' });

    project.status = req.body.status;
    await project.save();

    res.json({ msg: 'Status updated' });
  } catch (err) {
    res.status(500).json({ msg: 'Status update failed' });
  }
};
