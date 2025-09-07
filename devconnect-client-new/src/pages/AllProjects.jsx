import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../contexts/AuthContext';

const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    API.get('/projects')
      .then(res => setProjects(res.data));
  }, []);

  const handleRequestJoin = async (projectId) => {
    try {
      await API.post(`/projects/${projectId}/request`);
      // Refresh projects to show updated status
      const res = await API.get('/projects');
      setProjects(res.data);
      alert('Request sent successfully!');
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to send request');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">📁 Project Collaboration Hub</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map(p => (
            <div key={p?._id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">{p?.title}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  p?.status === 'Idea' ? 'bg-blue-100 text-blue-800' :
                  p?.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {p?.status}
                </span>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-3">{p?.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex flex-wrap gap-1">
                  <span className="text-sm font-medium text-gray-700">Tech Stack:</span>
                  {p?.techStack?.map((tech, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1">
                  <span className="text-sm font-medium text-gray-700">Roles Needed:</span>
                  {p?.rolesNeeded?.map((role, index) => (
                    <span key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              {user && p?.owner?._id === user.id ? (
                <Link
                  to={`/projects/${p._id}/requests`}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg text-center block"
                >
                  Manage Requests ({p?.requests?.length || 0})
                </Link>
              ) : (
                <button
                  onClick={() => handleRequestJoin(p._id)}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Request to Join
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllProjects;
