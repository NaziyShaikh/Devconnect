import { useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import FileUploader from '../components/FileUploader';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    bio: '', 
    skills: '', 
    experience: '', 
    github: '', 
    portfolio: '', 
    resume: '',
    profilePicture: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      // Update profile information
      const profileData = {
        bio: form.bio,
        skills: form.skills.split(',').map(s => s.trim()).filter(s => s),
        experience: form.experience,
        github: form.github,
        portfolio: form.portfolio,
        resume: form.resume
      };
      
      await API.put('/users/update', profileData);
      navigate('/developers');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update profile');
    }
  };

  const handleProfilePictureUpload = async (url) => {
    try {
      await API.put('/users/update-picture', { profilePicture: url });
      setForm({ ...form, profilePicture: url });
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update profile picture');
    }
  };

  const handleResumeUpload = async (url) => {
    setForm({ ...form, resume: url });
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Setup Your Profile</h2>
      {error && <p className="mb-4 text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Profile Picture Upload */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Profile Picture</h3>
          {form.profilePicture && (
            <img 
              src={form.profilePicture} 
              alt="Profile" 
              className="w-24 h-24 rounded-full object-cover mb-2"
            />
          )}
          <FileUploader 
            onUpload={handleProfilePictureUpload}
            label="Upload Profile Picture"
            accept=".jpg,.jpeg,.png"
            uploadType="image"
          />
        </div>

        <textarea
          placeholder="Bio"
          value={form.bio}
          onChange={e => setForm({ ...form, bio: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded resize-none"
          rows={4}
        />
        
        <input
          placeholder="Skills (comma separated)"
          value={form.skills}
          onChange={e => setForm({ ...form, skills: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded"
        />
        
        <input
          placeholder="Experience"
          value={form.experience}
          onChange={e => setForm({ ...form, experience: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded"
        />
        
        <input
          placeholder="GitHub Link"
          value={form.github}
          onChange={e => setForm({ ...form, github: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded"
        />
        
        <input
          placeholder="Portfolio Link"
          value={form.portfolio}
          onChange={e => setForm({ ...form, portfolio: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded"
        />
        
        {/* Resume Upload */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Resume</h3>
          {form.resume && (
            <p className="text-sm text-blue-600 mb-2">
              Resume uploaded: <a href={form.resume} target="_blank" rel="noopener noreferrer" className="underline">View Resume</a>
            </p>
          )}
          <FileUploader 
            onUpload={handleResumeUpload}
            label="Upload Resume (PDF)"
            accept=".pdf"
            uploadType="resume"
          />
        </div>

        <button
          type="submit"
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default ProfileSetup;
