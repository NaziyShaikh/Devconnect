import { useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import FileUploader from '../components/FileUploader';

const CreateProject = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', techStack: [], rolesNeeded: [], status: 'Idea', image: '' });
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await API.post('/projects', form);
      navigate('/projects');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to post project');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-900">Post a Project Idea</h2>
      {error && <p className="mb-6 text-center text-red-600 font-semibold">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          placeholder="Title"
          onChange={e => setForm({ ...form, title: e.target.value })}
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-400 transition"
          required
        />
        <textarea
          placeholder="Description"
          onChange={e => setForm({ ...form, description: e.target.value })}
          className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-4 focus:ring-green-400 transition"
          rows={5}
          required
        />
        <input
          placeholder="Tech Stack (comma separated)"
          onChange={e => setForm({ ...form, techStack: e.target.value.split(',').map(s => s.trim()) })}
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-400 transition"
          required
        />
        <input
          placeholder="Roles Needed (comma separated)"
          onChange={e => setForm({ ...form, rolesNeeded: e.target.value.split(',').map(s => s.trim()) })}
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-400 transition"
          required
        />
        <select
          value={form.status}
          onChange={e => setForm({ ...form, status: e.target.value })}
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-400 transition"
        >
          <option value="Idea">Idea</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <FileUploader onUpload={url => setForm({ ...form, image: url })} />
        <button
          type="submit"
          className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300"
        >
          Post Project
        </button>
      </form>
      </div>
    </div>
  );
};

export default CreateProject;
