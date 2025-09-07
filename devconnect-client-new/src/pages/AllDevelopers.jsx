import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../contexts/AuthContext";

const AllDevelopers = () => {
  const [users, setUsers] = useState([]);
  const { user } = useAuth();

  const handleDeleteDeveloper = async (userId) => {
    if (window.confirm('Are you sure you want to delete this developer? This action cannot be undone.')) {
      try {
        await axios.delete(`/admin/users/${userId}`);
        setUsers(users.filter(u => u._id !== userId));
        alert('Developer deleted successfully');
      } catch (error) {
        console.error('Error deleting developer:', error);
        alert('Failed to delete developer');
      }
    }
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        // Only fetch users if admin is logged in
        if (user && user.role === 'admin') {
          const res = await axios.get("/users");
          // Filter to show only developers
          const developers = res.data.filter(u => u.role === 'developer');
          setUsers(developers);
        }
      } catch (error) {
        console.error('Error fetching developers:', error);
      }
    };
    fetch();
  }, [user]);

  // Don't render anything if user is not admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto mt-8 text-center">
        <h2 className="text-2xl font-bold mb-4">👩‍💻 Developers</h2>
        <p className="text-gray-600">Access restricted to administrators only.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">👩‍💻 Developers</h2>
      {users.length === 0 ? (
        <p className="text-gray-600">No developers found.</p>
      ) : (
        users.map(user => (
          <div key={user._id} className="border p-4 rounded mb-4 bg-white shadow-sm">
            <h3 className="text-xl font-semibold">{user.name}</h3>
            <p className="text-gray-700 mb-2">{user.bio}</p>
            <p className="text-sm mt-1 text-gray-600">
              <strong>Skills:</strong> {user.skills?.join(", ") || 'Not specified'} <br />
              <strong>Experience:</strong> {user.experience || 'Not specified'}
            </p>
            {user.github && (
              <a href={user.github} target="_blank" rel="noreferrer" className="text-blue-600 underline mt-2 inline-block">
                GitHub Profile
              </a>
            )}
            <button
              onClick={() => handleDeleteDeveloper(user._id)}
              className="ml-4 mt-2 px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
            >
              Delete Developer
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default AllDevelopers;
