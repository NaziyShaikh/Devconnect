import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchStats();
      fetchUsers();
      fetchProjects();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/admin/stats');
      setStats(res.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/admin/users');
      console.log('Fetched users:', res.data.data);
      setUsers(res.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to refresh users list. Please refresh the page.');
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/api/admin/projects');
      setProjects(res.data.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId) => {
    try {
      await axios.put(`/api/admin/users/${userId}/block`);
      fetchUsers(); // Refresh users list
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        console.log('Deleting user:', userId);
        const response = await axios.delete(`/api/admin/users/${userId}`);
        console.log('Delete response:', response.data);

        if (response.data.success) {
          alert('User deleted successfully');
          // Immediately remove user from local state
          setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
          fetchStats(); // Refresh stats
        } else {
          alert(`Error: ${response.data.message}`);
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        if (error.response && error.response.data && error.response.data.message) {
          alert(`Error: ${error.response.data.message}`);
        } else {
          alert('Failed to delete user. Please try again.');
        }
      }
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(`/api/admin/projects/${projectId}`);
        fetchProjects(); // Refresh projects list
        fetchStats(); // Refresh stats
      } catch (error) {
        console.error('Error deleting project:', error);
      }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
        }}
      ></div>

      <div className="relative max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-12 bg-white shadow-xl rounded-2xl p-8 border border-gray-100 animate-fade-in-up">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-3 animate-slide-in-left">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-purple-600">Admin</span> Dashboard
              </h1>
              <p className="text-lg text-gray-600 animate-slide-in-left" style={{animationDelay: '0.2s'}}>
                Manage users, projects, and platform analytics
              </p>
            </div>
            <div className="flex items-center space-x-4 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
                <div className="text-sm text-gray-500">Admin Session</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <div className="bg-white shadow-xl rounded-xl p-6 mb-8 border border-gray-100 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
          <nav className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-8">
            {[
              { key: 'stats', label: 'Statistics', icon: '📊' },
              { key: 'users', label: 'User Management', icon: '👥' },
              { key: 'projects', label: 'Project Oversight', icon: '📁' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`group flex items-center px-6 py-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:shadow-md'
                }`}
              >
                <span className="mr-3 text-lg">{tab.icon}</span>
                <span className="group-hover:scale-105 transition-transform duration-200">{tab.label}</span>
                {activeTab === tab.key && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="animate-fade-in-up" style={{animationDelay: '0.8s'}}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white overflow-hidden shadow-xl rounded-xl border border-gray-100 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 group">
                <div className="p-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-6 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          Total Users
                        </dt>
                        <dd className="text-4xl font-extrabold text-gray-900 mb-1">
                          {stats.totalUsers || 0}
                        </dd>
                        <dd className="text-xs text-gray-400">
                          Registered accounts
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow-xl rounded-xl border border-gray-100 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 group">
                <div className="p-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-6 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          Developers
                        </dt>
                        <dd className="text-4xl font-extrabold text-gray-900 mb-1">
                          {stats.totalDevelopers || 0}
                        </dd>
                        <dd className="text-xs text-gray-400">
                          Active developers
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow-xl rounded-xl border border-gray-100 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 group">
                <div className="p-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-6 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          Total Projects
                        </dt>
                        <dd className="text-4xl font-extrabold text-gray-900 mb-1">
                          {stats.totalProjects || 0}
                        </dd>
                        <dd className="text-xs text-gray-400">
                          All projects created
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow-xl rounded-xl border border-gray-100 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 group">
                <div className="p-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-6 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          Active Projects
                        </dt>
                        <dd className="text-4xl font-extrabold text-gray-900 mb-1">
                          {stats.activeProjects || 0}
                        </dd>
                        <dd className="text-xs text-gray-400">
                          Currently active
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
            <div className="px-8 py-6 border-b border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                User Management
              </h3>
              <p className="text-gray-600 mt-1">Manage user accounts and permissions</p>
            </div>
            <ul className="divide-y divide-gray-100">
              {users.map((user, index) => (
                <li key={user._id} className="px-8 py-6 hover:bg-gray-50 transition-colors duration-200 animate-fade-in-up" style={{animationDelay: `${1 + index * 0.1}s`}}>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center mb-4 lg:mb-0">
                      <div className="flex-shrink-0 h-16 w-16">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-xl">
                            {user.name?.charAt(0).toUpperCase() || '?'}
                          </span>
                        </div>
                      </div>
                      <div className="ml-6">
                        <div className="text-lg font-bold text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {user.email}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'admin' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}>
                          {user.role === 'admin' ? '👑' : '👤'} {user.role}
                        </span>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          user.isBlocked ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-green-100 text-green-800 border border-green-200'
                        }`}>
                          {user.isBlocked ? '🚫 Blocked' : '✅ Active'}
                        </span>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleBlockUser(user._id)}
                          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 ${
                            user.isBlocked
                              ? 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
                              : 'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg'
                          }`}
                        >
                          {user.isBlocked ? '🔓 Unblock' : '🚫 Block'}
                        </button>
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                          >
                            🗑️ Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {users.length === 0 && (
              <div className="text-center py-16">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No users found</h3>
                <p className="text-gray-600">Users will appear here once they register on the platform.</p>
              </div>
            )}
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
            <div className="px-8 py-6 border-b border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <svg className="w-6 h-6 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Project Oversight
              </h3>
              <p className="text-gray-600 mt-1">Monitor and manage all projects on the platform</p>
            </div>
            <ul className="divide-y divide-gray-100">
              {projects.map((project, index) => (
                <li key={project._id} className="px-8 py-6 hover:bg-gray-50 transition-colors duration-200 animate-fade-in-up" style={{animationDelay: `${1 + index * 0.1}s`}}>
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1 mb-4 lg:mb-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <h4 className="text-lg font-bold text-gray-900 mr-3">{project.title}</h4>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            project.status === 'Idea' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                            project.status === 'In Progress' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                            'bg-green-100 text-green-800 border border-green-200'
                          }`}>
                            {project.status === 'Idea' ? '💡' : project.status === 'In Progress' ? '🚀' : '✅'} {project.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(project.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {project.description}
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm text-gray-500 mb-2 sm:mb-0 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          By {project.owner ? `${project.owner.name} (${project.owner.email})` : 'Unknown Owner'}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                            {project.collaborators?.length || 0} collaborators
                          </span>
                          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                            {project.techStack?.length || 0} technologies
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 lg:ml-6">
                      <button
                        onClick={() => handleDeleteProject(project._id)}
                        className="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                      >
                        🗑️ Delete Project
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {projects.length === 0 && (
              <div className="text-center py-16">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
                <p className="text-gray-600">Projects will appear here once users start creating them.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
  );
};

export default AdminDashboard;
