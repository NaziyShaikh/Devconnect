import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    myProjects: 0,
    joinedProjects: 0,
    pendingRequests: 0
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [projectsRes, usersRes] = await Promise.all([
        axios.get('/api/projects'),
        axios.get('/api/users')
      ]);

      const projects = projectsRes.data.data;
      const myProjects = projects.filter(p => p.owner._id === user.id);
      const joinedProjects = projects.filter(p =>
        p.collaborators.some(c => c.user._id === user.id)
      );
      const pendingRequests = projects.reduce((acc, p) =>
        acc + p.joinRequests.filter(r => r.user._id === user.id && r.status === 'pending').length, 0
      );

      setStats({
        myProjects: myProjects.length,
        joinedProjects: joinedProjects.length,
        pendingRequests
      });

      setRecentProjects(projects.slice(0, 3));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
        }}
      ></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12 bg-white shadow-xl rounded-2xl p-8 border border-gray-100 animate-fade-in-up">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-3 animate-slide-in-left">
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">{user?.name}</span>! 👋
              </h1>
              <p className="text-lg text-gray-600 animate-slide-in-left" style={{animationDelay: '0.2s'}}>
                Here's what's happening with your projects and collaborations.
              </p>
            </div>
            <div className="flex items-center space-x-4 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
                <div className="text-sm text-gray-500">Today</div>
              </div>
            </div>
          </div>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
        <div className="bg-white rounded-xl shadow-xl p-8 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100 group">
          <div className="flex items-center">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 mr-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">My Projects</p>
              <p className="text-4xl font-extrabold text-gray-900 mt-1">{stats.myProjects}</p>
              <p className="text-xs text-gray-400 mt-1">Projects you own</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-8 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100 group">
          <div className="flex items-center">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 mr-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Joined Projects</p>
              <p className="text-4xl font-extrabold text-gray-900 mt-1">{stats.joinedProjects}</p>
              <p className="text-xs text-gray-400 mt-1">Active collaborations</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-8 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100 group">
          <div className="flex items-center">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-100 to-yellow-200 mr-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Pending Requests</p>
              <p className="text-4xl font-extrabold text-gray-900 mt-1">{stats.pendingRequests}</p>
              <p className="text-xs text-gray-400 mt-1">Awaiting approval</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-xl p-8 mb-12 border border-gray-100 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Quick Actions</h2>
          <p className="text-gray-600">Jump into your most common tasks</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/create-project"
            className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-2"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="p-3 bg-white bg-opacity-20 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-1">Create Project</h3>
              <p className="text-sm text-blue-100">Start a new collaboration</p>
            </div>
          </Link>
          <Link
            to="/projects"
            className="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6 hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-2"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="p-3 bg-white bg-opacity-20 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-1">Browse Projects</h3>
              <p className="text-sm text-purple-100">Find collaboration opportunities</p>
            </div>
          </Link>
          <Link
            to="/profile"
            className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-2"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="p-3 bg-white bg-opacity-20 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-1">Update Profile</h3>
              <p className="text-sm text-green-100">Manage your information</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100 animate-fade-in-up" style={{animationDelay: '1s'}}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Recent Projects</h2>
            <p className="text-gray-600">Your latest project activity</p>
          </div>
          <Link to="/projects" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors duration-200 mt-4 sm:mt-0">
            <span>View all projects</span>
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {recentProjects.length > 0 ? (
          <div className="space-y-6">
            {recentProjects.map((project, index) => (
              <div key={project._id} className="border border-gray-100 rounded-xl p-6 hover:shadow-lg hover:border-gray-200 transition-all duration-300 group animate-fade-in-up" style={{animationDelay: `${1.2 + index * 0.1}s`}}>
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start">
                  <div className="flex-1 mb-4 lg:mb-0">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                        <Link to={`/projects/${project._id}`} className="hover:underline">
                          {project.title}
                        </Link>
                      </h3>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ml-4 flex-shrink-0 ${
                        project.status === 'Idea' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                        project.status === 'In Progress' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                        'bg-green-100 text-green-800 border border-green-200'
                      }`}>
                        {project.status === 'Idea' ? '💡' : project.status === 'In Progress' ? '🚀' : '✅'} {project.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center text-sm text-gray-500 mb-3 sm:mb-0">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>By {project.owner.name}</span>
                      </div>
                      <Link
                        to={`/projects/${project._id}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-semibold hover:underline transition-colors duration-200"
                      >
                        <span>View Details</span>
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                  <div className="lg:ml-8 lg:flex-shrink-0">
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.slice(0, 4).map((tech, index) => (
                        <span key={index} className="px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 text-xs rounded-lg border border-blue-200 font-medium">
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 4 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg border border-gray-200 font-medium">
                          +{project.techStack.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No projects yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">Start your journey by creating your first project or exploring exciting opportunities from the community.</p>
            <Link
              to="/create-project"
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Your First Project
            </Link>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
