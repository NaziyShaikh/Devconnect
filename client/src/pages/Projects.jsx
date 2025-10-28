import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [techFilter, setTechFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/api/projects');
      // Filter out projects owned by blocked users
      const filteredProjects = res.data.data.filter(project =>
        project.owner && !project.owner.isBlocked
      );
      setProjects(filteredProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTech = !techFilter || project.techStack.some(tech =>
      tech.toLowerCase().includes(techFilter.toLowerCase())
    );
    const matchesStatus = !statusFilter || project.status === statusFilter;

    return matchesSearch && matchesTech && matchesStatus;
  });

  const handleJoinRequest = async (projectId) => {
    try {
      const response = await axios.post(`/api/projects/${projectId}/join`, {
        role: 'Developer', // Default role, could be made selectable
        message: 'I would like to join this project.'
      });

      if (response.data.success) {
        alert('Join request sent successfully! The project owner will review your request.');
        // Refresh projects to show updated join requests
        fetchProjects();
      } else {
        alert(response.data.message || 'Failed to send join request');
      }
    } catch (error) {
      console.error('Error sending join request:', error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert('Failed to send join request. Please try again.');
      }
    }
  };

  const isOwner = (project) => project.owner && project.owner._id === user?.id;
  const hasRequested = (project) => project.joinRequests.some(req => req.user && req.user._id === user?.id);
  const isCollaborator = (project) => project.collaborators.some(collab => collab.user && collab.user._id === user?.id);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
        }}
      ></div>

      <div className="relative max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 bg-white shadow-sm rounded-lg p-6 animate-fade-in-up">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2 animate-slide-in-left">Discover Projects</h1>
            <p className="text-gray-600 animate-slide-in-left text-sm lg:text-base" style={{animationDelay: '0.2s'}}>Find exciting projects to collaborate on and build your portfolio</p>
          </div>
          <Link
            to="/create-project"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg font-semibold animate-pulse-subtle text-sm lg:text-base"
          >
            + Create New Project
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white shadow-xl rounded-xl p-8 mb-8 border border-gray-100 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            <div className="space-y-2">
              <label htmlFor="search" className="block text-sm font-semibold text-gray-700 flex items-center">
                <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search Projects
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title or description..."
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 lg:px-4 py-2 lg:py-3 transition-all duration-200 text-sm lg:text-base"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="tech" className="block text-sm font-semibold text-gray-700 flex items-center">
                <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Technology Stack
              </label>
              <input
                type="text"
                id="tech"
                value={techFilter}
                onChange={(e) => setTechFilter(e.target.value)}
                placeholder="e.g., React, Node.js..."
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 lg:px-4 py-2 lg:py-3 transition-all duration-200 text-sm lg:text-base"
              />
            </div>
            <div className="space-y-2 md:col-span-2 lg:col-span-1">
              <label htmlFor="status" className="block text-sm font-semibold text-gray-700 flex items-center">
                <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Project Status
              </label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 lg:px-4 py-2 lg:py-3 transition-all duration-200 text-sm lg:text-base"
              >
                <option value="">All Statuses</option>
                <option value="Idea">💡 Idea</option>
                <option value="In Progress">🚀 In Progress</option>
                <option value="Completed">✅ Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="bg-white shadow-xl rounded-xl p-12 text-center border border-gray-100">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-500">Try adjusting your filters or create a new project to get started.</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project, index) => (
              <div key={project._id} className="bg-white shadow-xl rounded-xl p-6 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 group animate-fade-in-up" style={{animationDelay: `${0.4 + index * 0.1}s`}}>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">{project.title}</h3>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    project.status === 'Idea' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                    project.status === 'In Progress' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                    'bg-green-100 text-green-800 border border-green-200'
                  }`}>
                    {project.status === 'Idea' ? '💡' : project.status === 'In Progress' ? '🚀' : '✅'} {project.status}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Tech Stack
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.slice(0, 3).map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-lg border border-blue-200 font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 3 && (
                      <span className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg border border-gray-200 font-medium">
                        +{project.techStack.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Required Roles */}
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Looking for
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.requiredRoles.map((role, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 text-xs rounded-lg font-medium ${
                          role.filled ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
                        }`}
                      >
                        {role.filled ? '✅' : '🔍'} {role.role}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-100 gap-3">
                  <div className="text-sm text-gray-500 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {project.owner ? project.owner.name : 'Unknown Owner'}
                  </div>
                  <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    <Link
                      to={`/projects/${project._id}`}
                      className="text-blue-600 hover:text-blue-700 text-sm font-semibold hover:underline transition-colors duration-200 flex items-center px-3 py-1 rounded-md hover:bg-blue-50"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </Link>
                    {!isOwner(project) && !isCollaborator(project) && !hasRequested(project) && (
                      <button
                        onClick={() => handleJoinRequest(project._id)}
                        className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 lg:px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 text-sm font-semibold transform hover:scale-105 transition-all duration-200 shadow-md"
                      >
                        Join
                      </button>
                    )}
                    {hasRequested(project) && (
                      <span className="text-yellow-600 text-sm font-semibold flex items-center px-3 py-1 rounded-md bg-yellow-50">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Pending
                      </span>
                    )}
                    {isCollaborator(project) && (
                      <span className="text-green-600 text-sm font-semibold flex items-center px-3 py-1 rounded-md bg-green-50">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Joined
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
  );
};

export default Projects;
