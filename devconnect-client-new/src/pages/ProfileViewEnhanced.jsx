import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../contexts/AuthContext';
import FileUploader from '../components/FileUploader';

const ProfileViewEnhanced = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingPicture, setEditingPicture] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get(`/users/${user._id}`);
        setProfile(res.data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user && user._id) {
      fetchProfile();
    }
  }, [user]);

  const handleEditProfile = () => {
    navigate('/profile-setup');
  };

  const handlePictureClick = () => {
    setEditingPicture(true);
    fileInputRef.current?.click();
  };

  const handlePictureChange = async (url) => {
    try {
      await API.put('/users/update-picture', { image: url });
      setProfile(prev => ({ ...prev, profilePicture: url }));
      setEditingPicture(false);
    } catch (err) {
      console.error('Failed to update profile picture:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center mt-10">
        <p className="text-xl text-gray-600">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-6 p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Profile Header with Editable Picture */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-48 relative cursor-pointer" onClick={handlePictureClick}>
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            {profile.profilePicture ? (
              <img 
                src={profile.profilePicture} 
                alt={profile.name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {profile.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={async e => {
              if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                // Use FileUploader component or API to upload file and get URL
                // For simplicity, assuming FileUploader has a method to upload and return URL
                // Here, you might want to integrate FileUploader or implement upload logic
                // For now, just simulate upload and update
                const url = await uploadFileAndGetUrl(file);
                handlePictureChange(url);
              }
            }} 
          />
        </div>

        {/* Profile Content */}
        <div className="pt-20 px-6 pb-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">{profile.name}</h1>
            <p className="text-gray-600 mt-2">{profile.email}</p>
          </div>

          <div className="flex justify-center mb-6">
            <button 
              onClick={handleEditProfile}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Edit Profile
            </button>
          </div>

          {/* Bio Section */}
          {profile.bio && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">About Me</h3>
              <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
            </div>
          )}

          {/* Skills Section */}
          {profile.skills && profile.skills.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience Section */}
          {profile.experience && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Experience</h3>
              <p className="text-gray-600">{profile.experience}</p>
            </div>
          )}

          {/* Location Section */}
          {profile.location && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Location</h3>
              <p className="text-gray-600 flex items-center">
                <svg className="w-5 h-5 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {profile.location}
              </p>
            </div>
          )}

          {/* Links Section */}
          {(profile.github || profile.portfolio) && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Links</h3>
              <div className="space-y-2">
                {profile.github && (
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700">GitHub:</span>
                    <a 
                      href={profile.github} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline ml-2"
                    >
                      {profile.github}
                    </a>
                  </div>
                )}
                {profile.portfolio && (
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700">Portfolio:</span>
                    <a 
                      href={profile.portfolio} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline ml-2"
                    >
                      {profile.portfolio}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Resume Section */}
          {profile.resume && (
            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Resume</h3>
              <a 
                href={profile.resume} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Resume
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileViewEnhanced;

// Helper function to upload file and get URL (to be implemented)
async function uploadFileAndGetUrl(file) {
  // Implement file upload logic here, e.g., using FileUploader or direct API call
  // For now, return a placeholder or throw error
  throw new Error('File upload not implemented');
}
=======
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

const Developers = () => {
  const [devs, setDevs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDevs, setFilteredDevs] = useState([]);

  useEffect(() => {
    API.get('/users')
      .then(res => {
        setDevs(res.data);
        setFilteredDevs(res.data);
      });
  }, []);

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

      {/* Developers Grid */}
      {filteredDevs.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No developers found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <div className="flex gap-2">
                  <Link to={`/profile/${dev._id}`} className="flex-1">
                    <button className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition duration-200 text-sm font-medium">
                      View Profile
                    </button>
                  </Link>
                  <Link to={`/chat/${dev._id}`} className="flex-1">
                    <button className="w-full bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition duration-200 text-sm font-medium">
                      Chat
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Developers;
>>>>
