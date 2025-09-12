import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../contexts/AuthContext';

const ProfileView = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userId } = useParams();

  const isOwnProfile = !userId || userId === (user?._id || user?.id);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔍 ProfileView - Fetching profile...');
        console.log('   userId from URL:', userId);
        console.log('   user from context:', user);
        console.log('   user._id:', user?._id);
        console.log('   isOwnProfile:', isOwnProfile);

        // If userId is provided in URL, fetch that user's profile
        // Otherwise, fetch the logged-in user's profile
        // Fix: Use user._id or user.id consistently for logged-in user
        const profileId = userId || user?._id || user?.id;

        console.log('   profileId to fetch:', profileId);

        if (!profileId) {
          console.log('❌ No profileId available');
          if (!user) {
            setError('Please log in to view your profile.');
          } else {
            setError('No user ID provided. Please try again.');
          }
          setLoading(false);
          return;
        }

        // Use profileId variable here instead of userId || 'me'
        console.log('🚀 Making API call to:', `/profiles/${profileId}`);
        const res = await API.get(`/profiles/${profileId}`);
        console.log('✅ Profile fetched successfully:', res.data);
        setProfile(res.data);
      } catch (err) {
        // Use console.warn for 404 errors as they're expected for users without profiles
        if (err.response?.status === 404) {
          console.warn('⚠️ Profile not found:', err.response?.data?.message || 'Profile does not exist');
        } else {
          console.error('❌ Failed to fetch profile:', err);
          console.error('   Error response:', err.response);
          console.error('   Error status:', err.response?.status);
          console.error('   Error data:', err.response?.data);
        }

        if (err.response?.status === 401) {
          setError('Authentication required. Please log in to view profiles.');
        } else if (err.response?.status === 404) {
          // If it's the user's own profile and it doesn't exist, redirect to profile setup
          if (isOwnProfile) {
            console.log('👤 User profile not found, redirecting to profile setup');
            navigate('/profile-setup');
            return;
          } else {
            // For other users' profiles, show a user-friendly message
            setError('This user hasn\'t created their profile yet. They may still be setting up their information.');
          }
        } else {
          setError('Failed to load profile. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, userId, isOwnProfile]);

  const handleEditProfile = () => {
    navigate('/profile-setup');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
              <p className="mt-4 text-gray-600 font-medium">Loading profile...</p>
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

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
              <div className="text-gray-600 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <p className="text-gray-800 font-medium">Profile not found</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-400 to-purple-500 p-8 text-white">
          <div className="flex items-center space-x-6">
            {profile.profilePicture ? (
              <img
                src={profile.profilePicture}
                alt={profile.user?.name || 'Profile'}
                className="w-24 h-24 rounded-full object-cover border-4 border-white"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-white bg-opacity-20 flex items-center justify-center border-4 border-white">
                <span className="text-3xl text-white">{profile.user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold">{profile.user?.name || 'User'}</h1>
              <p className="text-blue-100">{profile.role || 'Developer'}</p>
              {profile.location && (
                <p className="text-blue-100 mt-1">📍 {profile.location}</p>
              )}
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Action Buttons */}
          <div className="flex justify-between items-start mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Profile Details</h2>
            {isOwnProfile && (
              <button 
                onClick={handleEditProfile}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Edit Profile
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Bio Section */}
            <div className="md:col-span-2">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">About</h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed">
                  {profile.bio || 'No bio provided yet.'}
                </p>
              </div>
            </div>

            {/* Skills Section */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Skills</h3>
              {profile.skills && profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No skills listed yet.</p>
              )}
            </div>

            {/* Experience Section */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Experience</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">
                  {profile.experience || 'No experience provided yet.'}
                </p>
              </div>
            </div>

            {/* Links Section */}
            <div className="md:col-span-2">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Links & Contact</h3>
              <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                {profile.github && (
                  <div className="flex items-center">
                    <span className="w-24 font-medium text-gray-700">GitHub:</span>
                    <a 
                      href={profile.github} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {profile.github}
                    </a>
                  </div>
                )}
                {profile.portfolio && (
                  <div className="flex items-center">
                    <span className="w-24 font-medium text-gray-700">Portfolio:</span>
                    <a 
                      href={profile.portfolio} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {profile.portfolio}
                    </a>
                  </div>
                )}
                {profile.user?.email && (
                  <div className="flex items-center">
                    <span className="w-24 font-medium text-gray-700">Email:</span>
                    <span className="text-gray-700">{profile.user.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Resume Section */}
          {profile.resume && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Resume</h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <a 
                  href={profile.resume} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  <span className="mr-2">📄</span>
                  View Resume
                </a>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};



export default ProfileView;
