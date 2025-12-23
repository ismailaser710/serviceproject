import { useState, useEffect } from 'react';
import { getUsers, deleteUser } from '../services/usersignupservice'; // imported from usersignupservice

const UserDelete = () => {
  const [usersignups, setUserSignUps] = useState([]);
  const [newUserSignUp, setNewUserSignUp] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [userDeleted, setUserDeleted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUsers(); // matches service
      setUserSignUps(response.data.data || response.data);
    } catch (error) {
      console.error(error);
      setErrors(['Failed to fetch users. Please try again later.']);
    }
  };

  const handleDeleteUser = async () => {
    const currentErrors = [];

    if (!newUserSignUp.email.trim()) currentErrors.push('Email is required');
    if (!newUserSignUp.password.trim()) currentErrors.push('Password is required');

    const existingUser = usersignups.find(
      user => user.email.toLowerCase() === newUserSignUp.email.toLowerCase()
    );

    if (!existingUser) currentErrors.push('Email does not exist in the database');
    if (existingUser && existingUser.password !== newUserSignUp.password) currentErrors.push('Incorrect password');

    if (currentErrors.length > 0) {
      setErrors(currentErrors);
      setUserDeleted(false);
      return;
    }

    setErrors([]);
    setIsDeleting(true);
    try {
      await deleteUser(existingUser._id); // matches service

      setNewUserSignUp({ email: '', password: '' });
      setUserDeleted(true);

      await fetchUsers();

      // Redirect to /usersignup page after delete
      window.location.href = '/usersignup';
    } catch (error) {
      console.error('Error deleting user:', error);
      setErrors(['Error deleting user. Please try again later.']);
      setUserDeleted(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUserSignUp({ ...newUserSignUp, [name]: value });
    if (userDeleted) setUserDeleted(false);
    if (errors.length > 0) setErrors([]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#bae6fd' }}>
      <h1 className="text-4xl font-extrabold uppercase text-black tracking-widest mb-4">SnapRent</h1>

      <div className="w-full max-w-md p-4 rounded shadow-lg bg-white mb-4">
        <p className="text-center text-gray-700 mb-4 font-semibold text-lg">User Delete</p>

        <input
          type="email"
          name="email"
          value={newUserSignUp.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:border-blue-800"
        />

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={newUserSignUp.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:border-blue-800"
          />
          <button
            type="button"
            onClick={() => setShowPassword(prev => !prev)}
            className="absolute right-2 top-1 text-sm text-blue-600 hover:underline"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        <button
          onClick={handleDeleteUser}
          disabled={isDeleting}
          className={`w-full bg-black text-white py-2 rounded hover:bg-gray-700 mt-2 ${
            isDeleting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>

        {errors.length > 0 && (
          <div className="mt-4 text-red-600">
            <p className="font-semibold">Please fix the following:</p>
            <ul className="list-disc ml-5">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {userDeleted && (
          <div className="mt-4 text-green-600 font-semibold">
            <p>User Deleted Successfully! Redirecting to Users Signups Page...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDelete;