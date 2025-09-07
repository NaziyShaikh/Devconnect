import { useState, useEffect } from 'react';
import API from '../api/axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [reports, setReports] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersRes, projectsRes, reportsRes] = await Promise.all([
          API.get('/admin/users'),
          API.get('/admin/projects'),
          API.get('/admin/reports')
        ]);

        setUsers(usersRes.data);
        setProjects(projectsRes.data);
        setReports(reportsRes.data);

        // Separate developers from users
        const devs = usersRes.data.filter(u => u.role === 'developer');
        setDevelopers(devs);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const blockUser = async id => {
    try {
      await API.put(`/admin/users/${id}/block`);
      setUsers(u => u.map(x => x._id === id ? { ...x, blocked: !x.blocked } : x));
      // Update developers list if the blocked user is a developer
      setDevelopers(d => d.map(x => x._id === id ? { ...x, blocked: !x.blocked } : x));
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  };

  const deleteUser = async id => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await API.delete(`/admin/users/${id}`);
        setUsers(u => u.filter(user => user._id !== id));
        setDevelopers(d => d.filter(dev => dev._id !== id));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const delProject = async id => {
    try {
      await API.delete(`/admin/projects/${id}`);
      setProjects(p => p.filter(pj => pj._id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const resolveReport = async id => {
    try {
      await API.delete(`/admin/reports/${id}`);
      setReports(r => r.filter(re => re._id !== id));
    } catch (error) {
      console.error('Error resolving report:', error);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProjects = projects.filter(project =>
    project?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto mt-6 p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-300 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-6 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="text-sm text-gray-600">
          Total Users: {users.length} | Projects: {projects.length} | Reports: {reports.length}
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search users, projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {['overview', 'users', 'projects', 'reports'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">👥 Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">{users.length}</p>
            <p className="text-sm text-gray-600 mt-1">
              {developers.length} developers, {users.filter(u => u.role === 'client').length} clients
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">📁 Projects</h3>
            <p className="text-3xl font-bold text-green-600">{projects.length}</p>
            <p className="text-sm text-gray-600 mt-1">
              {projects.filter(p => p?.status === 'active').length} active
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🚨 Reports</h3>
            <p className="text-3xl font-bold text-red-600">{reports.length}</p>
            <p className="text-sm text-gray-600 mt-1">Pending resolution</p>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">All Users</h2>
          {filteredUsers.length === 0 ? (
            <p className="text-gray-600">No users found.</p>
          ) : (
            filteredUsers.map(user => (
              <div key={user._id} className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Role: <span className={`px-2 py-1 rounded text-xs ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'developer' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>{user.role}</span>
                      {user.blocked && <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 rounded text-xs">Blocked</span>}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => blockUser(user._id)}
                      className={`px-3 py-1 rounded text-white text-sm ${
                        user.blocked ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      {user.blocked ? 'Unblock' : 'Block'}
                    </button>
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">All Projects</h2>
          {filteredProjects.length === 0 ? (
            <p className="text-gray-600">No projects found.</p>
          ) : (
            filteredProjects.map(project => (
              <div key={project?._id} className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{project?.title}</h3>
                    <p className="text-sm text-gray-600">{project?.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Status: <span className={`px-2 py-1 rounded text-xs ${
                        project?.status === 'active' ? 'bg-green-100 text-green-800' :
                        project?.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>{project?.status}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => delProject(project?._id)}
                    className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
                  >
                    Delete Project
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Reported Content</h2>
          {reports.length === 0 ? (
            <p className="text-gray-600">No reports found.</p>
          ) : (
            reports.map(report => (
              <div key={report._id} className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{report.type}</h3>
                    <p className="text-sm text-gray-600">{report.reason}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Reported by: {report.reportedBy?.name || 'Unknown'}
                    </p>
                  </div>
                  <button
                    onClick={() => resolveReport(report._id)}
                    className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-sm"
                  >
                    Resolve
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
