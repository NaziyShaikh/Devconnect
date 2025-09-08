import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { fetchCurrentUser, user } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    // If user is already logged in, redirect to developers page
    if (user) {
      navigate('/developers');
    }
  }, [user, navigate]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      console.log('🚀 Attempting login with:', { email: form.email, password: '[HIDDEN]' });
      const res = await API.post('/auth/login', form, { withCredentials: true });
      console.log('✅ Login response:', res.data);

      if (res.data.user) {
        // Set user immediately from login response
        setUser(res.data.user);
        console.log('👤 User set from login response:', res.data.user);
        navigate('/developers');
      } else {
        setError('Login failed: No user data received');
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      const errorMessage = err.response?.data?.msg || 'Login failed. Please check your credentials and try again.';
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:flex w-full md:w-1/2 bg-gradient-to-r from-blue-500 to-indigo-700 items-center justify-center p-10">
        <div className="text-white text-center max-w-md">
          <h1 className="text-6xl font-extrabold mb-6">Welcome to DevConnect</h1>
          <p className="text-2xl font-semibold">Your ideas become reality</p>
        </div>
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-10 shadow-lg rounded-lg mx-4 md:mx-0 mt-10 md:mt-0">
        <div className="w-full max-w-md">
          <h2 className="text-4xl font-extrabold mb-8 text-gray-900 text-center">Login</h2>
          {error && <p className="mb-6 text-red-600 text-center font-semibold">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-400 transition"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-400 transition"
              required
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-300 font-semibold text-lg"
            >
              Login
            </button>
          </form>
          <p className="mt-8 text-center text-gray-700">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 hover:underline font-semibold">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
