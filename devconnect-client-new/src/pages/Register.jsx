import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'developer' });
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await API.post('/auth/register', form, { withCredentials: true });
      console.log('Registration response:', res.data);

      if (res.data.user) {
        navigate('/login');
      } else {
        setError('Registration failed: No user data');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:flex w-full md:w-1/2 bg-gradient-to-r from-green-400 to-blue-600 items-center justify-center p-10">
        <div className="text-white text-center max-w-md">
          <h1 className="text-6xl font-extrabold mb-6">Welcome to DevConnect</h1>
          <p className="text-2xl font-semibold">Your ideas become reality</p>
        </div>
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-10 shadow-lg rounded-lg mx-4 md:mx-0 mt-10 md:mt-0">
        <div className="w-full max-w-md">
          <h2 className="text-4xl font-extrabold mb-8 text-gray-900 text-center">Register</h2>
          {error && <p className="mb-6 text-red-600 text-center font-semibold">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-400 transition"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-400 transition"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-400 transition"
              required
            />
            <select
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
              className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-400 transition"
            >
              <option value="developer">Developer</option>
              <option value="admin">Admin</option>
            </select>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300 font-semibold text-lg"
            >
              Register
            </button>
          </form>
          <p className="mt-8 text-center text-gray-700">
            Already have an account?{' '}
            <Link to="/login" className="text-green-600 hover:underline font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
