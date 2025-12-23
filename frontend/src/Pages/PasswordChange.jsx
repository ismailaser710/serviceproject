import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, patchUser } from '../services/usersignupservice'; // imported from usersignupservice

const PasswordChange = () => {
  const [usersignups, setUserSignUps] = useState([]);
  const [newUserSignUp, setNewUserSignUp] = useState({
    email: '',
    password: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [errors, setErrors] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUsers(); // matches service definition
      setUserSignUps(response.data.data || response.data);
    } catch (error) {
      console.error(error);
      setErrors(['Failed to fetch users. Please try again.']);
    }
  };

  const validatePasswordLength = (password) => password.length < 8 ? 'Password must be at least 8 characters long' : '';
  const validatePasswordUpperCase = (password) => !/[A-Z]/.test(password) ? 'Password must contain at least one uppercase letter' : '';
  const validatePasswordNumber = (password) => !/[0-9]/.test(password) ? 'Password must contain at least one number' : '';

  const validateNewPassword = () => {
    const currentErrors = [];
    const { newPassword, password } = newUserSignUp;

    if (!newPassword.trim()) currentErrors.push('New Password is required');

    [validatePasswordLength(newPassword), validatePasswordUpperCase(newPassword), validatePasswordNumber(newPassword)]
      .forEach(err => { if (err) currentErrors.push(err); });

    if (password === newPassword) currentErrors.push('New password cannot be the same as current password');

    return currentErrors;
  };

  const validateConfirmNewPassword = () => {
    const currentErrors = [];
    const { confirmNewPassword, newPassword } = newUserSignUp;

    if (!confirmNewPassword.trim()) currentErrors.push('Confirm New Password is required');
    if (newPassword !== confirmNewPassword) currentErrors.push('New password and confirm password do not match');

    return currentErrors;
  };

  const updateUserPassword = async (userId) => {
    setIsUpdating(true);
    try {
      await patchUser(userId, { // matches service definition
        password: newUserSignUp.newPassword,
        confirmpassword: newUserSignUp.confirmNewPassword
      });

      setErrors([]);
      setLoginSuccess(true);
      setNewUserSignUp({
        email: '',
        password: '',
        newPassword: '',
        confirmNewPassword: '',
      });

      navigate('/usersignin');
    } catch (error) {
      console.error('Password update failed:', error);
      if (error.response) setErrors([error.response.data.message || 'Failed to update password']);
      else if (error.request) setErrors(['Network error. Please check your connection.']);
      else setErrors(['An unexpected error occurred.']);
      setLoginSuccess(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const loginUser = async () => {
    const currentErrors = [];
    const { email, password } = newUserSignUp;

    if (!email.trim()) currentErrors.push('Email is required');
    if (!password.trim()) currentErrors.push('Password is required');

    const existingUser = usersignups.find(
      user => user.email.toLowerCase() === email.toLowerCase()
    );

    if (!existingUser) currentErrors.push('Email does not exist in the database');
    else {
      setCurrentUserId(existingUser._id);
      if (existingUser.password !== password) currentErrors.push('Incorrect password');
    }

    currentErrors.push(...validateNewPassword());
    currentErrors.push(...validateConfirmNewPassword());

    if (currentErrors.length > 0) {
      setErrors(currentErrors);
      setLoginSuccess(false);
      return;
    }

    await updateUserPassword(currentUserId);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUserSignUp(prev => ({ ...prev, [name]: value }));
    if (errors.length > 0) setErrors([]);
    if (loginSuccess) setLoginSuccess(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#bae6fd' }}>
      <h1 className="text-4xl font-extrabold uppercase text-black tracking-widest mb-4">SnapRent</h1>
      <div className="w-full max-w-md p-4 rounded shadow-lg bg-white mb-4">
        <p className="text-center text-gray-700 mb-4 font-semibold text-lg">User Change Password</p>

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
            placeholder="Current Password"
            className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:border-blue-800"
          />
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className="absolute right-2 top-1 text-sm text-blue-600 hover:underline"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        <div className="relative">
          <input
            type={showNewPassword ? 'text' : 'password'}
            name="newPassword"
            value={newUserSignUp.newPassword}
            onChange={handleChange}
            placeholder="New Password"
            className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:border-blue-800"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(v => !v)}
            className="absolute right-2 top-1 text-sm text-blue-600 hover:underline"
          >
            {showNewPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        <div className="relative">
          <input
            type={showConfirmNewPassword ? 'text' : 'password'}
            name="confirmNewPassword"
            value={newUserSignUp.confirmNewPassword}
            onChange={handleChange}
            placeholder="Confirm New Password"
            className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:border-blue-800"
          />
          <button
            type="button"
            onClick={() => setShowConfirmNewPassword(v => !v)}
            className="absolute right-2 top-1 text-sm text-blue-600 hover:underline"
          >
            {showConfirmNewPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        <button
          onClick={loginUser}
          disabled={isUpdating}
          className={`w-full bg-black text-white py-2 rounded hover:bg-gray-700 mt-2 ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isUpdating ? 'Updating...' : 'Update Password'}
        </button>

        {errors.length > 0 && (
          <div className="mt-4 text-red-600">
            <p className="font-semibold">Please fix the following:</p>
            <ul className="list-disc ml-5">
              {errors.map((error, index) => <li key={index}>{error}</li>)}
            </ul>
          </div>
        )}

        {loginSuccess && (
          <div className="mt-4 text-green-600 font-semibold">
            <p>Password updated successfully!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordChange;