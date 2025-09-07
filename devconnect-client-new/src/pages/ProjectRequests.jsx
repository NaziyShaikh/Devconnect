import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';

const ProjectRequests = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  const fetchProject = async () => {
    const res = await API.get(`/projects/${id}`);
    setProject(res.data);
  };

  useEffect(() => { fetchProject(); }, []);

  const handleAction = async (userId, action) => {
    await API.patch(`/projects/${id}/respond`, { userId, accept: action === 'accept' });
    fetchProject();
  };

  if (!project) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading project requests...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-3xl mx-auto p-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Project Collaboration Requests</h2>
          <h3 className="text-xl font-semibold mb-4 text-gray-700">{project.title}</h3>

          {project.requests.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">No collaboration requests yet.</p>
              <p className="text-gray-400 text-sm mt-2">Developers interested in joining will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {project.requests.map(u => (
                <div key={u._id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">{u.name?.charAt(0)?.toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{u.name}</p>
                        <p className="text-sm text-gray-500">Wants to collaborate on your project</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAction(u._id, 'accept')}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleAction(u._id, 'reject')}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
                      >
                        Reject
                      </button>
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

export default ProjectRequests;
