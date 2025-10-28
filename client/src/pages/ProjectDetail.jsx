import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joinMessage, setJoinMessage] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const res = await axios.get(`/api/projects/${id}`);
      setProject(res.data.data);
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRequest = async () => {
    if (!selectedRole) {
      alert('Please select a role');
      return;
    }

    try {
      const response = await axios.post(`/api/projects/${id}/join`, {
        role: selectedRole,
        message: joinMessage || 'I would like to join this project.'
      });
      alert('Join request sent successfully!');
      fetchProject(); // Refresh to show updated requests
    } catch (error) {
      console.error('Error sending join request:', error);
      alert(error.response?.data?.message || 'Failed to send join request');
    }
  };

  const handleRespondToRequest = async (requestId, status) => {
    try {
      await axios.put(`/api/projects/${id}/respond`, {
        requestId,
        status
      });
      fetchProject(); // Refresh to show updated status
    } catch (error) {
      console.error('Error responding to join request:', error);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      await axios.put(`/api/projects/${id}/status`, {
        status: newStatus
      });
      fetchProject(); // Refresh to show updated status
    } catch (error) {
      console.error('Error updating project status:', error);
    }
  };

  const isOwner = project?.owner._id === user?._id;
  const isCollaborator = project?.collaborators.some(collab => collab.user._id === user?._id);
  const hasRequested = project?.joinRequests.some(req => req.user._id === user?._id);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-gray-500">Project not found.</p>
          <button
            onClick={() => navigate('/projects')}
            className="mt-4 text-blue-600 hover:text-blue-500"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
              <p className="text-gray-600 mt-2">By {project.owner ? project.owner.name : 'Unknown Owner'}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 text-sm rounded-full ${
                project.status === 'Idea' ? 'bg-yellow-100 text-yellow-800' :
                project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {project.status}
              </span>
              {(isOwner || isCollaborator) && (
                <select
                  value={project.status}
                  onChange={(e) => handleUpdateStatus(e.target.value)}
                  className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Idea">Idea</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              )}
            </div>
          </div>

          <p className="text-gray-700 mb-6">{project.description}</p>

          {/* Tech Stack */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Required Roles */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Required Roles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.requiredRoles.map((role, index) => (
                <div
                  key={index}
                  className={`p-3 border rounded-lg ${
                    role.filled ? 'border-green-200 bg-green-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{role.role}</span>
                    <span className={`px-2 py-1 text-xs rounded ${
                      role.filled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {role.filled ? 'Filled' : 'Open'}
                    </span>
                  </div>
                  {role.filled && role.filledBy && (
                    <p className="text-sm text-gray-600 mt-1">
                      Filled by: {role.filledBy.name}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Collaborators */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Team Members</h3>
          <div className="space-y-3">
            {/* Owner */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {project.owner ? project.owner.name.charAt(0).toUpperCase() : '?'}
                </div>
                <div className="ml-3">
                  <p className="font-medium">{project.owner ? project.owner.name : 'Unknown Owner'}</p>
                  <p className="text-sm text-gray-600">Project Owner</p>
                </div>
              </div>
            </div>

            {/* Collaborators */}
            {project.collaborators.map((collab, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {collab.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">{collab.user.name}</p>
                    <p className="text-sm text-gray-600">{collab.role}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  Joined {new Date(collab.joinedAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Join Requests (for owners) */}
        {isOwner && project.joinRequests.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Join Requests</h3>
            <div className="space-y-4">
              {project.joinRequests.map((request, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {request.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">{request.user.name}</p>
                        <p className="text-sm text-gray-600">Applying for: {request.role}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {request.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleRespondToRequest(request._id, 'accepted')}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRespondToRequest(request._id, 'rejected')}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className={`px-2 py-1 text-xs rounded ${
                          request.status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {request.status}
                        </span>
                      )}
                    </div>
                  </div>
                  {request.message && (
                    <p className="text-sm text-gray-600 mt-2">{request.message}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Join Project (for non-owners) */}
        {!isOwner && !isCollaborator && !hasRequested && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Join This Project</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose a role...</option>
                  {project.requiredRoles
                    .filter(role => !role.filled)
                    .map((role, index) => (
                      <option key={index} value={role.role}>{role.role}</option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (Optional)
                </label>
                <textarea
                  value={joinMessage}
                  onChange={(e) => setJoinMessage(e.target.value)}
                  placeholder="Tell us why you'd like to join..."
                  rows={3}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={handleJoinRequest}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                Send Join Request
              </button>
            </div>
          </div>
        )}

        {/* Already requested */}
        {hasRequested && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <p className="text-yellow-800">You have already sent a join request for this project.</p>
          </div>
        )}

        {/* Already joined */}
        {isCollaborator && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <p className="text-green-800">You are a collaborator on this project!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
