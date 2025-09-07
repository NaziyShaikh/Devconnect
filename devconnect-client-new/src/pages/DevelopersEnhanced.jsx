import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../contexts/AuthContext';

const DevelopersEnhanced = () => {
  const [devs, setDevs] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDevs, setFilteredDevs] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
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
    const fetchUsers = async () => {
      try {
        const res = await API.get('/users');

        if (!user || !user._id) {
          // If no logged-in user, show all users (developers and admins)
          const allUsers = res.data;
          setDevs(allUsers);
          setFilteredDevs(allUsers);
          setAdmins(allUsers.filter(u => u.role === 'admin'));
          setFilteredAdmins(allUsers.filter(u => u.role === 'admin'));
        } else {
          // If logged-in user, filter out their own profile but include admins and other developers
          const allUsers = res.data.filter(u => u._id !== user._id);
          setDevs(allUsers);
          setFilteredDevs(allUsers);
          setAdmins(allUsers.filter(u => u.role === 'admin'));
          setFilteredAdmins(allUsers.filter(u => u.role === 'admin'));
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [user]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredDevs(devs);
    } else {
      const filtered = devs.filter(dev =>
        dev.skills?.some(skill =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        ) || dev.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDevs(filtered);
    }
  }, [searchTerm, devs]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim() === '') {
      setFilteredDevs(devs);
      return;
    }

    try {
      const res = await API.get(`/users/search/${searchTerm}`);
      setFilteredDevs(res.data);
    } catch (err) {
      console.error('Search failed:', err);
      const filtered = devs.filter(dev =>
        dev.skills?.some(skill =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        ) || dev.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDevs(filtered);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-6 p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">🎯 Developers</h2>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search developers by skill or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-r-lg hover:bg-blue-700 transition duration-200"
          >
            Search
          </button>
        </div>
      </form>

      {/* Developers Section */}
      {filteredDevs.length > 0 && (
        <>
          <h3 className="text-2xl font-semibold mb-4 text-center text-gray-800">👨‍💻 Developers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredDevs.map(dev => (
              <div key={dev._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                {/* Profile Picture Section */}
                <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                  {dev.profilePicture ? (
                    <img
                      src={dev.profilePicture}
                      alt={dev.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg ${dev.profilePicture ? 'hidden' : ''}`}>
                    {dev.name?.charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* Developer Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">{dev.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 text-center line-clamp-2">
                    {dev.bio || 'Passionate developer ready to collaborate'}
                  </p>

                  {/* Location */}
                  {dev.location && (
                    <p className="text-sm text-gray-500 mb-3 text-center flex items-center justify-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {dev.location}
                    </p>
                  )}

                  {/* Skills */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {dev.skills?.slice(0, 3).map((skill, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {skill}
                        </span>
                      ))}
                      {dev.skills?.length > 3 && (
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                          +{dev.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 flex-wrap">
                    <Link to={`/profile/${dev._id}`} className="flex-1">
                      <button className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition duration-200 text-sm font-medium">
                        View Profile
                      </button>
                    </Link>
                    {user && user._id && dev._id ? (
                      <Link to={`/chat/${dev._id}`} className="flex-1">
                        <button className="w-full bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition duration-200 text-sm font-medium">
                          Chat
                        </button>
                      </Link>
                    ) : null}
                    {user && user.role === 'admin' && dev.role === 'developer' && (
                      <button
                        onClick={() => handleDeleteDeveloper(dev._id)}
                        className="w-full bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition duration-200 text-sm font-medium"
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

      {/* Admins Section */}
      {filteredAdmins.length > 0 && (
        <>
          <h3 className="text-2xl font-semibold mb-4 text-center text-gray-800">👑 Admins</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAdmins.map(admin => (
              <div key={admin._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                {/* Profile Picture Section */}
                <div className="h-48 bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
                  {admin.profilePicture ? (
                    <img
                      src={admin.profilePicture}
                      alt={admin.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`w-32 h-32 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg ${admin.profilePicture ? 'hidden' : ''}`}>
                    {admin.name?.charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* Admin Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">{admin.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 text-center line-clamp-2">
                    {admin.bio || 'Administrator'}
                  </p>

                  {/* Location */}
                  {admin.location && (
                    <p className="text-sm text-gray-500 mb-3 text-center flex items-center justify-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {admin.location}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link to={`/profile/${admin._id}`} className="flex-1">
                      <button className="w-full bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition duration-200 text-sm font-medium">
                        View Profile
                      </button>
                    </Link>
                    {user && user._id && admin._id ? (
                      <Link to={`/chat/${admin._id}`} className="flex-1">
                        <button className="w-full bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition duration-200 text-sm font-medium">
                          Chat
                        </button>
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* No Results Message */}
      {filteredDevs.length === 0 && filteredAdmins.length === 0 && (
        <p className="text-center text-gray-500 text-lg">No developers or admins found.</p>
      )}
    </div>
  );
};

export default DevelopersEnhanced;
