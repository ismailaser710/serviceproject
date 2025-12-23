import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers } from '../services/usersignupservice'; // imported from usersignupservice

const UserSignIn = () => {
  const [usersignups, setUserSignUps] = useState([]);
  const [newUserSignUp, setNewUserSignUp] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUsers(); // matches service
      setUserSignUps(response.data.data || response.data);
    } catch (error) {
      console.error(error);
      setErrors(['Failed to fetch users. Please try again.']);
    }
  };

  const loginUser = async () => {
    const currentErrors = [];
    const { email, password } = newUserSignUp;

    if (!email.trim()) currentErrors.push('Email is required');
    if (!password.trim()) currentErrors.push('Password is required');

    const existingUser = usersignups.find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );

    if (!existingUser) currentErrors.push('Email does not exist in the database');
    else if (existingUser.password !== password) currentErrors.push('Incorrect password');

    if (currentErrors.length > 0) {
      setErrors(currentErrors);
      setLoginSuccess(false);
      return;
    }

    setNewUserSignUp({ email: '', password: '' });
    setErrors([]);
    setLoginSuccess(true);

    navigate('/home'); // Navigate to home on success
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUserSignUp((prev) => ({ ...prev, [name]: value }));
    if (errors.length > 0) setErrors([]);
    if (loginSuccess) setLoginSuccess(false);
  };

  return (
    <div className="bg-blue-200 min-h-screen flex items-center justify-center px-6">
      <div className="flex flex-col md:flex-row md:items-center md:space-x-20 max-w-5xl w-full bg-white rounded-lg shadow-lg p-8">
        <div className="flex-shrink-0 mb-8 md:mb-0">
          <h1 className="text-5xl font-extrabold text-black uppercase tracking-wide">
            SnapRent
          </h1>
        </div>

        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
            User Sign-In
          </h2>

          <input
            type="email"
            name="email"
            value={newUserSignUp.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-800"
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={newUserSignUp.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-3 mb-2 border border-gray-300 rounded focus:outline-none focus:border-blue-800"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-sm text-blue-600 hover:underline"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <button
            onClick={loginUser}
            className="w-full bg-black text-white py-3 rounded hover:bg-gray-700 mt-4 font-semibold"
          >
            Log In
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

          {loginSuccess && (
            <div className="mt-4 text-green-600 font-semibold">
              <p>Login successful! Welcome back!</p>
            </div>
          )}

          <div className="mt-6 text-center text-sm text-gray-700">
            Don’t have an account?{' '}
            <span
              onClick={() => navigate('/usersignup')}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              Sign up
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSignIn;