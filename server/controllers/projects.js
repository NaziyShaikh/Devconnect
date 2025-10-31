const Project = require('../models/Project');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Get all projects
// @route   GET /api/projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ isActive: true })
      .populate('owner', 'name profile')
      .populate('joinRequests.user', 'name profile')
      .populate('collaborators.user', 'name profile')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name profile')
      .populate('joinRequests.user', 'name profile')
      .populate('collaborators.user', 'name profile');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create project
// @route   POST /api/projects
exports.createProject = async (req, res) => {
  try {
    req.body.owner = req.user.id;

    // Generate slug from title
    if (req.body.title) {
      req.body.slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }

    const project = await Project.create(req.body);

    await project.populate('owner', 'name profile');

    // Create notifications for all users except the project owner
    try {
      const users = await User.find({ _id: { $ne: req.user.id }, isBlocked: false }).select('_id');
      console.log(`Creating notifications for ${users.length} users about new project: ${project.title}`);

      const notificationPromises = users.map(user =>
        Notification.create({
          recipient: user._id,
          type: 'project_update',
          title: 'New Project Posted',
          message: `${req.user.name} posted a new project: ${project.title}`,
          relatedId: project._id,
          relatedModel: 'Project'
        })
      );
      const notifications = await Promise.all(notificationPromises);
      console.log(`Created ${notifications.length} project notifications`);

      // Emit real-time notifications
      notifications.forEach(notification => {
        console.log(`Emitting project notification to user: ${notification.recipient}`);
        global.io.to(`user_${notification.recipient}`).emit('new-notification', notification);
      });
    } catch (notificationError) {
      console.error('Error creating project notifications:', notificationError);
      // Don't fail project creation if notifications fail
    }

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
exports.updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check ownership
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project'
      });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('owner', 'name profile');

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check ownership or admin role
    if (project.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this project'
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Request to join project
// @route   POST /api/projects/:id/join
exports.requestToJoin = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if already requested
    const existingRequest = project.joinRequests.find(
      request => request.user.toString() === req.user.id
    );

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You have already sent a join request for this project'
      });
    }

    project.joinRequests.push({
      user: req.user.id,
      role: req.body.role,
      message: req.body.message
    });

    await project.save();
    await project.populate('joinRequests.user', 'name profile');

    // Create notification for the project owner
    try {
      console.log(`Creating join request notification for project owner: ${project.owner}`);
      const notification = await Notification.create({
        recipient: project.owner,
        type: 'project_join_request',
        title: 'New Join Request',
        message: `${req.user.name} wants to join your project "${project.title}"`,
        relatedId: project._id,
        relatedModel: 'Project'
      });
      console.log('Join request notification created:', notification._id);

      // Emit real-time notification
      console.log(`Emitting join request notification to user: ${project.owner}`);
      global.io.to(`user_${project.owner}`).emit('new-notification', notification);
    } catch (notificationError) {
      console.error('Error creating join request notification:', notificationError);
      // Don't fail the join request if notification creation fails
    }

    res.json({
      success: true,
      message: 'Join request sent successfully',
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Respond to join request
// @route   PUT /api/projects/:id/respond
exports.respondToJoinRequest = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check ownership
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to respond to join requests'
      });
    }

    const requestIndex = project.joinRequests.findIndex(
      request => request._id.toString() === req.body.requestId
    );

    if (requestIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Join request not found'
      });
    }

    const joinRequest = project.joinRequests[requestIndex];

    if (req.body.status === 'accepted') {
      // Add to collaborators
      project.collaborators.push({
        user: joinRequest.user,
        role: joinRequest.role
      });

      // Update required roles if needed
      const roleIndex = project.requiredRoles.findIndex(
        role => role.role === joinRequest.role && !role.filled
      );

      if (roleIndex !== -1) {
        project.requiredRoles[roleIndex].filled = true;
        project.requiredRoles[roleIndex].filledBy = joinRequest.user;
      }
    }

    // Update request status
    project.joinRequests[requestIndex].status = req.body.status;

    await project.save();
    await project.populate('joinRequests.user', 'name profile');
    await project.populate('collaborators.user', 'name profile');

    // Create notification for the user who made the join request
    try {
      console.log(`Creating join request response notification for user: ${joinRequest.user}`);
      const notificationType = req.body.status === 'accepted' ? 'project_join_approved' : 'project_join_rejected';
      const notificationTitle = req.body.status === 'accepted' ? 'Join Request Approved' : 'Join Request Rejected';
      const notificationMessage = req.body.status === 'accepted'
        ? `Your join request for "${project.title}" has been approved!`
        : `Your join request for "${project.title}" has been rejected.`;

      const notification = await Notification.create({
        recipient: joinRequest.user,
        type: notificationType,
        title: notificationTitle,
        message: notificationMessage,
        relatedId: project._id,
        relatedModel: 'Project'
      });
      console.log('Join request response notification created:', notification._id);

      // Emit real-time notification
      console.log(`Emitting join request response notification to user: ${joinRequest.user}`);
      global.io.to(`user_${joinRequest.user}`).emit('new-notification', notification);
    } catch (notificationError) {
      console.error('Error creating join request response notification:', notificationError);
      // Don't fail the response if notification creation fails
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update project status
// @route   PUT /api/projects/:id/status
exports.updateProjectStatus = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check ownership or collaborator
    const isOwner = project.owner.toString() === req.user.id;
    const isCollaborator = project.collaborators.some(
      collab => collab.user.toString() === req.user.id
    );

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update project status'
      });
    }

    project.status = req.body.status;
    await project.save();

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
