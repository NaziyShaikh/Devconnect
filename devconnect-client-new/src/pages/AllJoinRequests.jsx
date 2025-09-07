import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import API from '../api/axios';

const AllJoinRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllRequests();
  }, []);

  const fetchAllRequests = async () => {
    try {
      setLoading(true);
      const res = await API.get('/join-requests/all');
      setRequests(res.data);
    } catch (err) {
      console.error('Error fetching join requests:', err);
      setError('Failed to load join requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId, action) => {
    try {
      await API.put(`/join-requests/${requestId}/${action}`);
      // Remove the request from the list
      setRequests(requests.filter(req => req._id !== requestId));
    } catch (err) {
      console.error(`Error ${action}ing request:`, err);
      setError(`Failed to ${action} request`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading join requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button
            onClick={fetchAllRequests}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">All Join Requests</h1>

          {requests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No join requests found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {request.projectId?.title || 'Unknown Project'}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        <span className="font-medium">Requester:</span> {request.userId?.name || 'Unknown User'}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Email:</span> {request.userId?.email || 'N/A'}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Project Owner:</span> {request.projectId?.owner?.name || 'Unknown'}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Requested on: {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleAction(request._id, 'accept')}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleAction(request._id, 'reject')}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
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

export default AllJoinRequests;
