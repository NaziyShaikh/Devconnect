import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../contexts/AuthContext';

const Developers = () => {
  const [devs, setDevs] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDevs, setFilteredDevs] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const handleDeleteDeveloper = async (userId) => {
    if (window.confirm('Are you sure you want to delete this developer? This action cannot be undone.')) {
      try {
        await API.delete(`/admin/users/${userId}`);
        setDevs(devs.filter(d => d._id !== userId));
        setFilteredDevs(filteredDevs.filter(d => d._id !== userId));
        alert('Developer deleted successfully');
      } catch (error) {
        console.error('Error deleting developer:', error);
        alert('Failed to delete developer');
      }
    }
  };

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        setLoading(true);
        const res = await API.get('/users');

        console.log('All users data:', res.data); // Debug log

        // Separate developers and admins
        const developers = res.data.filter(u => u.role === 'developer');
        const admins = res.data.filter(u => u.role === 'admin');

        console.log('Developers found:', developers.length);
        console.log('Admins found:', admins.length);
        console.log('Admin details:', admins);

        setDevs(developers);
        setFilteredDevs(developers);
        setAdmins(admins);
        setFilteredAdmins(admins);
        setError(null);
      } catch (err) {
        console.error('Error fetching developers:', err);
        setError('Failed to load developers. Please try again later.');
        setDevs([]);
        setFilteredDevs([]);
        setAdmins([]);
        setFilteredAdmins([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDevelopers();
  }, [user]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredDevs(devs);
      setFilteredAdmins(admins);
    } else {
      const filtered = devs.filter(dev =>
        dev.skills?.some(skill =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        ) || dev.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const filteredAdmin = admins.filter(admin =>
        admin.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDevs(filtered);
      setFilteredAdmins(filteredAdmin);
    }
  }, [searchTerm, devs, admins]);

  if (loading) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Registered Developers
              </span>
            </h1>
            <p className="text-lg text-gray-600">Connect with talented developers in our community</p>
          </div>
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
              <p className="mt-4 text-gray-600 font-medium">Loading developers...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Registered Developers
              </span>
            </h1>
            <p className="text-lg text-gray-600">Connect with talented developers in our community</p>
          </div>
          <div className="text-center py-20">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
              <div className="text-red-600 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-red-800 font-medium mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Registered Developers
            </span>
          </h1>
          <p className="text-lg text-gray-600">Connect with talented developers in our community</p>
        </div>

        {/* Search Form */}
        <div className="mb-12">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search developers by skill or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-transparent text-lg shadow-sm"
              />
            </div>
          </div>
        </div>

      {/* Developers Grid */}
      {filteredDevs.length === 0 && filteredAdmins.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-500 text-lg">No developers or admins found.</p>
        </div>
      ) : (
        <>
          {filteredDevs.length > 0 && (
            <>
              <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Developers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {filteredDevs.map(dev => (
                  <div key={dev._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300">
                    <div className="bg-gradient-to-r from-blue-400 to-purple-500 h-48 flex items-center justify-center">
                      {dev.profilePicture ? (
                        <img
                          src={dev.profilePicture}
                          alt={dev.name}
                          className="w-32 h-32 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-4xl text-gray-600">{dev.name?.charAt(0)?.toUpperCase()}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{dev.name}</h3>
                      <p className="text-gray-600 mb-2">{dev.bio || 'No bio available'}</p>
                      <p className="text-sm text-gray-600 mb-2">{dev.location || 'No location provided'}</p>

                      {/* Skills */}
                      {dev.skills && dev.skills.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm font-semibold text-gray-700 mb-1">Skills:</p>
                          <div className="flex flex-wrap gap-1">
                            {dev.skills.slice(0, 3).map(skill => (
                              <span key={skill} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                {skill}
                              </span>
                            ))}
                            {dev.skills.length > 3 && (
                              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                                +{dev.skills.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Experience */}
                      {dev.experience && (
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-semibold">💼</span> {dev.experience}
                        </p>
                      )}

                      {/* GitHub/Portfolio */}
                      <div className="mb-3">
                        {dev.github && (
                          <a
                            href={dev.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm mr-3"
                          >
                            GitHub
                          </a>
                        )}
                        {dev.portfolio && (
                          <a
                            href={dev.portfolio}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Portfolio
                          </a>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 flex-wrap">
                        <Link to={`/profile/${dev._id}`}>
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 text-sm">
                            View Profile
                          </button>
                        </Link>
                        <Link to={`/chat/${dev._id}`}>
                          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 text-sm">
                            Message
                          </button>
                        </Link>
                        {user && user.role === 'admin' && dev.role === 'developer' && (
                          <button
                            onClick={() => handleDeleteDeveloper(dev._id)}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200 text-sm"
                          >
                            Delete Developer
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {filteredAdmins.length > 0 && (
            <>
              <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Admins</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAdmins.map(admin => (
                  <div key={admin._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300">
                    <div className="bg-gradient-to-r from-red-400 to-pink-500 h-48 flex items-center justify-center">
                      {admin.profilePicture ? (
                        <img
                          src={admin.profilePicture}
                          alt={admin.name}
                          className="w-32 h-32 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-4xl text-gray-600">{admin.name?.charAt(0)?.toUpperCase()}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{admin.name}</h3>
                      <p className="text-gray-600 mb-2">{admin.bio || 'No bio available'}</p>
                      <p className="text-sm text-gray-600 mb-2">{admin.location || 'No location provided'}</p>

                      {/* Action Buttons */}
                      <div className="flex gap-2 flex-wrap">
                        <Link to={`/profile/${admin._id}`}>
                          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200 text-sm">
                            View Profile
                          </button>
                        </Link>
                        <Link to={`/chat/${admin._id}`}>
                          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 text-sm">
                            Message
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
      </div>
    </div>
  );
};

export default Developers;
