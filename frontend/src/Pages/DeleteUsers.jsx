import { useState, useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { getUsers, deleteUser } from '../services/usersignupservice';

const DeleteUsers = () => {
  const [usersignups, setUserSignUps] = useState([]);
  const [error, setError] = useState(null);

  /* =========================
     Fetch Users
  ========================== */
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      // Updated: API Gateway returns users directly in response.data
      setUserSignUps(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err) {
      console.error('Failed to load users:', err);
      setError('Failed to load users');
    }
  };

  /* =========================
     Delete User
  ========================== */
  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      setUserSignUps((prevUsers) =>
        prevUsers.filter((user) => user._id !== id)
      );
      setError(null);
    } catch (err) {
      console.error('Failed to delete user:', err);
      setError('Failed to delete user');
    }
  };

  return (
    <div className="bg-gray-800 min-h-screen flex flex-col items-center justify-center p-6 relative">
      {/* Return Link */}
      <Link
        to="/usersoptions"
        className="absolute top-6 left-6 flex items-center text-white hover:text-gray-400 transition"
      >
        <FiArrowLeft className="mr-2" size={20} />
        <span className="font-medium text-sm">
          Return to User Options
        </span>
      </Link>

      <h1 className="text-3xl font-bold text-white mb-6">User List</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="overflow-x-auto w-full max-w-6xl">
        <table className="w-full bg-white rounded shadow">
          <thead className="bg-black text-white">
            <tr>
              <th className="py-3 px-6 text-left">First Name</th>
              <th className="py-3 px-6 text-left">Last Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Phone Number</th>
              <th className="py-3 px-6 text-left">Password</th>
              <th className="py-3 px-6 text-left">Delete</th>
            </tr>
          </thead>

          <tbody>
            {usersignups.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No users found.
                </td>
              </tr>
            ) : (
              usersignups.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-200"
                >
                  <td className="py-4 px-6">{user.firstname}</td>
                  <td className="py-4 px-6">{user.lastname}</td>
                  <td className="py-4 px-6">{user.email}</td>
                  <td className="py-4 px-6">{user.phonenumber}</td>
                  <td className="py-4 px-6">{user.password}</td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeleteUsers;