import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, createUser } from '../services/usersignupservice'; // updated import

const UserSignUp = () => {
  const [usersignups, setUserSignUps] = useState([]);
  const [newUserSignUp, setNewUserSignUp] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phonenumber: '',
    password: '',
    confirmpassword: '',
  });
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUserSignUps(response.data.data || response.data); // handle both formats
    } catch (error) {
      console.error(error);
    }
  };

  const addUser = async () => {
    const requiredFields = ['firstname', 'lastname', 'email', 'phonenumber', 'password', 'confirmpassword'];
    const currentErrors = [];

    requiredFields.forEach(field => {
      if (!newUserSignUp[field].trim()) currentErrors.push(`${field} is required`);
    });

    if (newUserSignUp.email && !newUserSignUp.email.includes('@')) {
      currentErrors.push('Email must contain "@"');
    }

    const existingUser = usersignups.find(
      (user) => user.email.toLowerCase() === newUserSignUp.email.toLowerCase()
    );
    if (existingUser) currentErrors.push('Email is already used');

    if (newUserSignUp.phonenumber && newUserSignUp.phonenumber.length !== 11) {
      currentErrors.push('Phone number must be exactly 11 digits');
    }

    if (newUserSignUp.password !== newUserSignUp.confirmpassword) {
      currentErrors.push('Passwords do not match');
    }

    const password = newUserSignUp.password;
    if (password) {
      if (password.length < 8) currentErrors.push('Password must be at least 8 characters');
      if (!/[A-Z]/.test(password)) currentErrors.push('Password must include at least one uppercase letter');
      if (!/[0-9]/.test(password)) currentErrors.push('Password must include at least one number');
    }

    if (currentErrors.length > 0) {
      setErrors(currentErrors);
      setSuccessMessage('');
      return;
    }

    setErrors([]);

    try {
      const response = await createUser(newUserSignUp); // updated to match service
      setUserSignUps([...usersignups, response.data.data || response.data]);
      setNewUserSignUp({
        firstname: '',
        lastname: '',
        email: '',
        phonenumber: '',
        password: '',
        confirmpassword: '',
      });
      setSuccessMessage('Sign up done successfully! Welcome to our Website');

      navigate('/usersignin'); // Redirect immediately after successful signup
    } catch (error) {
      console.error(error);
      setErrors(['Failed to complete sign up. Please try again.']);
      setSuccessMessage('');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUserSignUp({ ...newUserSignUp, [name]: value });
    if (errors.length > 0) setErrors([]);
    if (successMessage) setSuccessMessage('');
  };

  return (
    <div className="bg-blue-200 min-h-screen flex items-center justify-center px-6">
      <div className="flex max-w-6xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Left side - Snaprent */}
        <div className="hidden md:flex flex-col justify-center bg-blue-800 text-white w-1/3 p-10">
          <h1 className="text-5xl font-extrabold tracking-wide mb-4">Snaprent</h1>
          <p className="text-lg font-light">
            Welcome to Snaprent! Join us and enjoy easy renting experiences.
          </p>
        </div>

        {/* Right side - SignUp form */}
        <div className="w-full md:w-2/3 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center md:text-left">User Sign-Up</h1>

          <input
            type="text"
            name="firstname"
            value={newUserSignUp.firstname}
            onChange={handleChange}
            placeholder="First Name"
            className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-800"
          />
          <input
            type="text"
            name="lastname"
            value={newUserSignUp.lastname}
            onChange={handleChange}
            placeholder="Last Name"
            className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-800"
          />
          <input
            type="email"
            name="email"
            value={newUserSignUp.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-800"
          />
          <input
            type="text"
            name="phonenumber"
            value={newUserSignUp.phonenumber}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-800"
          />

          <div className="relative mb-4">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={newUserSignUp.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-800"
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-3 top-3 text-sm text-blue-600 hover:underline"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <div className="relative mb-4">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmpassword"
              value={newUserSignUp.confirmpassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-800"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(prev => !prev)}
              className="absolute right-3 top-3 text-sm text-blue-600 hover:underline"
            >
              {showConfirmPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <button
            onClick={addUser}
            className="w-full bg-black text-white py-3 rounded hover:bg-gray-700 mt-2 font-semibold"
          >
            Register User
          </button>

          {successMessage && (
            <div className="mt-4 text-green-600 font-semibold text-center">
              {successMessage}
            </div>
          )}

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

          <div className="mt-6 text-center text-sm text-gray-700">
            Already have an account?{' '}
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => navigate('/usersignin')}
            >
              Sign in
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSignUp;