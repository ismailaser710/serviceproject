import { useState, useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { getUsers } from '../services/usersignupservice'; // Service import

const ViewUsers = () => {
  const [usersignups, setUserSignUps] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      // Handle both possible response formats: response.data or response.data.data
      setUserSignUps(response.data.data || response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load users');
    }
  };

  return (
    <div className="bg-gray-800 min-h-screen flex flex-col items-center justify-center p-6 relative">
      {/* Return Link Top-Left */}
      <Link
        to="/usersoptions"
        className="absolute top-6 left-6 flex items-center text-white hover:text-gray-400 transition cursor-pointer select-none"
      >
        <FiArrowLeft className="mr-2" size={20} />
        <span className="font-medium text-sm">Return to User Options</span>
      </Link>

      <h1 className="text-3xl font-bold text-white mb-6">User List</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="overflow-x-auto w-full max-w-5xl">
        <table className="w-full bg-white rounded shadow">
          <thead className="bg-black text-white">
            <tr>
              <th className="py-3 px-6 text-left">First Name</th>
              <th className="py-3 px-6 text-left">Last Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Phone Number</th>
              <th className="py-3 px-6 text-left">Password</th>
            </tr>
          </thead>
          <tbody>
            {usersignups.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">No users found.</td>
              </tr>
            ) : (
              usersignups.map(user => (
                <tr key={user._id || user.id} className="border-b border-gray-200">
                  <td className="py-4 px-6">{user.firstname}</td>
                  <td className="py-4 px-6">{user.lastname}</td>
                  <td className="py-4 px-6">{user.email}</td>
                  <td className="py-4 px-6">{user.phonenumber}</td>
                  <td className="py-4 px-6">{user.password}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewUsers;