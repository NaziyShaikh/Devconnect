import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: [],
    requiredRoles: []
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [techInput, setTechInput] = useState('');
  const [roleInput, setRoleInput] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddTech = () => {
    if (techInput.trim() && !formData.techStack.includes(techInput.trim())) {
      setFormData({
        ...formData,
        techStack: [...formData.techStack, techInput.trim()]
      });
      setTechInput('');
    }
  };

  const handleRemoveTech = (techToRemove) => {
    setFormData({
      ...formData,
      techStack: formData.techStack.filter(tech => tech !== techToRemove)
    });
  };

  const validRoles = ['Frontend', 'Backend', 'Fullstack', 'Designer', 'DevOps', 'Mobile'];

  const handleAddRole = () => {
    const trimmedRole = roleInput.trim();
    if (trimmedRole && validRoles.includes(trimmedRole) && !formData.requiredRoles.some(role => role.role === trimmedRole)) {
      setFormData({
        ...formData,
        requiredRoles: [...formData.requiredRoles, { role: trimmedRole, filled: false }]
      });
      setRoleInput('');
    } else if (trimmedRole && !validRoles.includes(trimmedRole)) {
      setMessage('Please select a valid role: Frontend, Backend, Fullstack, Designer, DevOps, or Mobile');
    }
  };

  const handleRemoveRole = (roleToRemove) => {
    setFormData({
      ...formData,
      requiredRoles: formData.requiredRoles.filter(role => role.role !== roleToRemove)
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const res = await axios.post('/api/upload', formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setFormData({
        ...formData,
        image: res.data.data.url
      });
    } catch (error) {
      setMessage('Failed to upload image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await axios.post('/api/projects', formData);
      setMessage('Project created successfully!');
      setTimeout(() => {
        navigate(`/projects/${res.data.data._id}`);
      }, 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Project</h1>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {message && (
                <div className={`p-4 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {message}
                </div>
              )}

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Project Title *
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter project title"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Project Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  required
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your project idea, goals, and what you're looking to build..."
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Project Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {formData.image && (
                  <div className="mt-2">
                    <img src={formData.image} alt="Project" className="w-32 h-24 object-cover rounded" />
                  </div>
                )}
              </div>

              {/* Tech Stack */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Technology Stack
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(tech)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    placeholder="Add a technology (e.g., React, Node.js, MongoDB)..."
                    className="flex-1 border-gray-300 rounded-l-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                  />
                  <button
                    type="button"
                    onClick={handleAddTech}
                    className="px-4 py-2 border border-l-0 border-gray-300 bg-gray-50 rounded-r-md hover:bg-gray-100"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Required Roles */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Roles
                </label>
                <p className="text-sm text-gray-500 mb-3">
                  Specify the roles you're looking for (e.g., Frontend Developer, Backend Developer, Designer)
                </p>
                <div className="space-y-2 mb-3">
                  {formData.requiredRoles.map((role, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>{role.role}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveRole(role.role)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex">
                  <select
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                    className="flex-1 border-gray-300 rounded-l-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a role...</option>
                    {validRoles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddRole}
                    className="px-4 py-2 border border-l-0 border-gray-300 bg-gray-50 rounded-r-md hover:bg-gray-100"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/projects')}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
