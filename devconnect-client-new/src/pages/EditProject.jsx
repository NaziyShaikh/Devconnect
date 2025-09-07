import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../contexts/AuthContext';

const EditProject = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    techStack: [],
    rolesNeeded: [],
    status: 'Idea',
    image: '',
    banner: ''
  });
  const [error, setError] = useState('');

  const fetchProject = useCallback(async () => {
    try {
      const res = await API.get(`/projects/${id}`);
      const project = res.data;

      // Check if user is the owner
      if (project.owner._id !== user?.id) {
        navigate('/my-projects');
        return;
      }

      setForm({
        title: project.title || '',
        description: project.description || '',
        techStack: project.techStack || [],
        rolesNeeded: project.rolesNeeded || [],
        status: project.status || 'Idea',
        image: project.image || '',
        banner: project.banner || ''
      });
    } catch (err) {
      console.error('Failed to fetch project:', err);
      navigate('/my-projects');
    } finally {
      setLoading(false);
    }
  }, [id, user?.id, navigate]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await API.put(`/projects/${id}`, form);
      navigate('/my-projects');
    } catch (err) {
      console.error('Failed to update project:', err);
      setError(err.response?.data?.msg || 'Failed to update project');
    } finally {
      setSaving(false);
    }
  };

  const handleTechStackChange = (e) => {
    const value = e.target.value;
    if (value && !form.techStack.includes(value)) {
      setForm({ ...form, techStack: [...form.techStack, value] });
      e.target.value = '';
    }
  };

  const removeTechStack = (tech) => {
    setForm({ ...form, techStack: form.techStack.filter(t => t !== tech) });
  };

  const handleRolesChange = (e) => {
    const value = e.target.value;
    if (value && !form.rolesNeeded.includes(value)) {
      setForm({ ...form, rolesNeeded: [...form.rolesNeeded, value] });
      e.target.value = '';
    }
  };

  const removeRole = (role) => {
    setForm({ ...form, rolesNeeded: form.rolesNeeded.filter(r => r !== role) });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Edit Project</h2>
            <button
              onClick={() => navigate('/my-projects')}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300"
            >
              Cancel
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter project title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 resize-none"
                placeholder="Describe your project"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tech Stack
              </label>
              <input
                type="text"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleTechStackChange(e))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add technology (press Enter)"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {form.techStack.map((tech, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechStack(tech)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Roles Needed
              </label>
              <input
                type="text"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleRolesChange(e))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add role (press Enter)"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {form.rolesNeeded.map((role, index) => (
                  <span
                    key={index}
                    className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {role}
                    <button
                      type="button"
                      onClick={() => removeRole(role)}
                      className="text-purple-600 hover:text-purple-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Idea">Idea</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Updating...' : 'Update Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProject;
