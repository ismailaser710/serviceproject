import { useState, useEffect } from 'react';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { getUsers, createUser } from '../services/usersignupservice';

const AddUsers = () => {
  const navigate = useNavigate();

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
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUserSignUps(response.data); // use response.data
    } catch (error) {
      console.error(error);
    }
  };

  const validateForm = () => {
    const requiredFields = ['firstname', 'lastname', 'email', 'phonenumber', 'password', 'confirmpassword'];
    const currentErrors = [];

    requiredFields.forEach(field => {
      if (!newUserSignUp[field].trim()) {
        currentErrors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
      }
    });

    if (newUserSignUp.email && !newUserSignUp.email.includes('@')) {
      currentErrors.push('Email must contain "@"');
    }

    const existingUser = usersignups.find(
      user => user.email.toLowerCase() === newUserSignUp.email.toLowerCase()
    );
    if (existingUser) {
      currentErrors.push('Email is already used');
    }

    if (newUserSignUp.phonenumber && newUserSignUp.phonenumber.length !== 11) {
      currentErrors.push('Phone number must be exactly 11 digits');
    }

    if (newUserSignUp.password !== newUserSignUp.confirmpassword) {
      currentErrors.push('Passwords do not match');
    }

    const password = newUserSignUp.password;
    if (password) {
      if (password.length < 8) {
        currentErrors.push('Password must be at least 8 characters');
      }
      if (!/[A-Z]/.test(password)) {
        currentErrors.push('Password must include at least one uppercase letter');
      }
      if (!/[0-9]/.test(password)) {
        currentErrors.push('Password must include at least one number');
      }
    }

    return currentErrors;
  };

  const addUser = async () => {
    const validationErrors = validateForm();

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setSuccessMessage('');
      return;
    }

    setErrors([]);

    try {
      const response = await createUser(newUserSignUp); // service call
      setUserSignUps([...usersignups, response.data]); // use response.data
      setNewUserSignUp({
        firstname: '',
        lastname: '',
        email: '',
        phonenumber: '',
        password: '',
        confirmpassword: '',
      });
      setSuccessMessage('User added successfully!');
      setShowAddForm(false);
      setShowPassword(false);
      setShowConfirmPassword(false);
    } catch (error) {
      console.error(error);
      setErrors(['Failed to add user. Please try again.']);
      setSuccessMessage('');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUserSignUp(prev => ({
      ...prev,
      [name]: value,
    }));

    if (errors.length > 0) setErrors([]);
    if (successMessage) setSuccessMessage('');
  };

  return (
    <div className="bg-gray-800 min-h-screen flex flex-col items-center justify-start p-6 relative">
      <button
        onClick={() => navigate('/usersoptions')}
        className="absolute top-4 left-4 text-white hover:text-gray-400 flex items-center space-x-2"
      >
        <AiOutlineArrowLeft size={24} />
        <span className="text-sm">Return to Users Options</span>
      </button>

      <h1 className="text-3xl font-bold text-white mb-6">User List</h1>

      <div className="overflow-x-auto w-full max-w-6xl mb-4">
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

      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full max-w-md bg-pink-600 text-white py-3 rounded hover:bg-pink-700 transition mb-6"
        >
          Add User
        </button>
      )}

      {showAddForm && (
        <div className="w-full max-w-md p-4 rounded shadow-lg bg-white mb-10">
          <h2 className="text-2xl font-bold mb-4 text-center">Add New User</h2>
          <input
            type="text"
            name="firstname"
            value={newUserSignUp.firstname}
            onChange={handleChange}
            placeholder="First Name"
            className="w-full p-2 mb-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="lastname"
            value={newUserSignUp.lastname}
            onChange={handleChange}
            placeholder="Last Name"
            className="w-full p-2 mb-2 border border-gray-300 rounded"
          />
          <input
            type="email"
            name="email"
            value={newUserSignUp.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 mb-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="phonenumber"
            value={newUserSignUp.phonenumber}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full p-2 mb-2 border border-gray-300 rounded"
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={newUserSignUp.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-2 mb-2 border border-gray-300 rounded"
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-2 top-2 text-sm text-blue-600"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmpassword"
              value={newUserSignUp.confirmpassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full p-2 mb-2 border border-gray-300 rounded"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(prev => !prev)}
              className="absolute right-2 top-2 text-sm text-blue-600"
            >
              {showConfirmPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <button
            onClick={addUser}
            className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 mt-2"
          >
            Add User
          </button>

          <button
            onClick={() => {
              setShowAddForm(false);
              setErrors([]);
              setSuccessMessage('');
              setNewUserSignUp({
                firstname: '',
                lastname: '',
                email: '',
                phonenumber: '',
                password: '',
                confirmpassword: '',
              });
              setShowPassword(false);
              setShowConfirmPassword(false);
            }}
            className="w-full mt-3 text-center text-gray-600 hover:text-gray-900 underline"
            type="button"
          >
            Cancel
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
        </div>
      )}
    </div>
  );
};

export default AddUsers;
