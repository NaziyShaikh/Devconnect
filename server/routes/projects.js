const express = require('express');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  requestToJoin,
  respondToJoinRequest,
  updateProjectStatus
} = require('../controllers/projects');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getProjects);
router.get('/:id', protect, getProject);
router.post('/', protect, createProject);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);
router.post('/:id/join', protect, requestToJoin);
router.put('/:id/respond', protect, respondToJoinRequest);
router.put('/:id/status', protect, updateProjectStatus);

module.exports = router;
