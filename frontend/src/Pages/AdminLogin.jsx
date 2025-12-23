import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { getAdmins } from '../services/adminloginservice';

const AdminLogin = () => {
  const navigate = useNavigate();

  const [admins, setAdmins] = useState([]);
  const [loginForm, setLoginForm] = useState({
    name: '',
    password: '',
  });
  const [errors, setErrors] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await getAdmins();
      setAdmins(response.data);
    } catch (err) {
      console.error(err);
      setErrors(['Failed to fetch admin data. Please try again.']);
    }
  };

  const loginAdmin = (e) => {
    e.preventDefault();
    const { name, password } = loginForm;
    const currentErrors = [];

    if (!name.trim() && !password.trim()) {
      currentErrors.push('Admin Name and Password are required');
    } else if (!name.trim()) {
      currentErrors.push('Admin Name is required');
    } else if (!password.trim()) {
      currentErrors.push('Password is required');
    }

    if (currentErrors.length > 0) {
      setErrors(currentErrors);
      setLoginSuccess(false);
      return;
    }

    const existingAdmin = admins.find((a) => a.name === name);

    if (!existingAdmin) {
      currentErrors.push('Invalid Admin Name');
      setErrors(currentErrors);
      setLoginSuccess(false);
      return;
    }

    if (existingAdmin.password !== password) {
      currentErrors.push('Invalid Password');
      setErrors(currentErrors);
      setLoginSuccess(false);
      return;
    }

    localStorage.setItem(
      'adminInfo',
      JSON.stringify({
        id: existingAdmin._id,
        name: existingAdmin.name,
      })
    );

    setLoginForm({ name: '', password: '' });
    setErrors([]);
    setLoginSuccess(true);

    navigate('/adminhome');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors.length > 0) setErrors([]);
    if (loginSuccess) setLoginSuccess(false);
  };

  return (
    <div className="bg-gray-800 min-h-screen flex flex-col items-center justify-center relative px-4 py-6">
      {/* Return to Dashboard Button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="absolute top-4 left-4 text-white hover:text-gray-400 flex items-center space-x-2"
      >
        <FiArrowLeft size={24} />
        <span className="text-sm">Return to Dashboard</span>
      </button>

      <h1 className="text-3xl font-bold text-white mb-4">Admin Login</h1>

      <form
        onSubmit={loginAdmin}
        className="w-full max-w-md p-6 rounded shadow-lg bg-white mb-4"
      >
        <input
          type="text"
          name="name"
          value={loginForm.name}
          onChange={handleChange}
          placeholder="Admin Name"
          className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:border-blue-800"
        />

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={loginForm.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:border-blue-800"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1 text-sm text-blue-600 hover:underline"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-700 mt-2"
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
            Login successful! Welcome Admin!
          </div>
        )}
      </form>
    </div>
  );
};

export default AdminLogin;

