import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { getUsers, patchUser } from '../services/usersignupservice';

const EditUsers = () => {
  const [usersignups, setUserSignUps] = useState([]);
  const [editUserData, setEditUserData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phonenumber: '',
    password: '',
    confirmpassword: '',
  });
  const [checkedFields, setCheckedFields] = useState({
    firstname: false,
    lastname: false,
    email: false,
    phonenumber: false,
    password: false,
    confirmpassword: false,
  });
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUserSignUps(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = (user) => {
    setEditingUserId(user._id);
    setShowEditForm(true);
    setEditUserData({
      firstname: user.firstname || '',
      lastname: user.lastname || '',
      email: user.email || '',
      phonenumber: user.phonenumber || '',
      password: '',
      confirmpassword: '',
    });
    setCheckedFields({
      firstname: false,
      lastname: false,
      email: false,
      phonenumber: false,
      password: false,
      confirmpassword: false,
    });
    setErrors([]);
    setSuccessMessage('');
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    if (name === 'confirmpassword' && !checkedFields.password) return;
    setCheckedFields((prev) => ({ ...prev, [name]: checked }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditUserData((prev) => ({ ...prev, [name]: value }));
    if (errors.length > 0) setErrors([]);
    if (successMessage) setSuccessMessage('');
  };

  const validateAndPatch = async () => {
    const fieldsToUpdate = Object.entries(checkedFields)
      .filter(([_, checked]) => checked)
      .map(([field]) => field);

    if (fieldsToUpdate.length === 0) {
      setErrors(['Please check at least one field to update.']);
      setSuccessMessage('');
      return;
    }

    const validationErrors = [];

    if (checkedFields.password && !checkedFields.confirmpassword) {
      validationErrors.push('If you check password, you must also check confirm password.');
    }

    fieldsToUpdate.forEach((field) => {
      const val = editUserData[field].trim();
      if (!val) validationErrors.push(`${field} is required`);

      if (field === 'email') {
        if (!val.includes('@')) validationErrors.push('Email must contain "@"');
        else if (
          usersignups.some(
            (u) => u.email.toLowerCase() === val.toLowerCase() && u._id !== editingUserId
          )
        )
          validationErrors.push('Email is already used');
      }

      if (field === 'phonenumber' && val.length !== 11) {
        validationErrors.push('Phone number must be exactly 11 digits');
      }

      if (field === 'password') {
        if (val.length < 8) validationErrors.push('Password must be at least 8 characters');
        if (!/[A-Z]/.test(val)) validationErrors.push('Password must include at least one uppercase letter');
        if (!/[0-9]/.test(val)) validationErrors.push('Password must include at least one number');
      }
    });

    if (checkedFields.password && checkedFields.confirmpassword) {
      if (editUserData.password !== editUserData.confirmpassword) {
        validationErrors.push('Passwords do not match');
      }
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setSuccessMessage('');
      return;
    }

    const patchData = {};
    fieldsToUpdate.forEach((field) => {
      if (field !== 'confirmpassword') patchData[field] = editUserData[field].trim();
    });

    try {
      await patchUser(editingUserId, patchData);
      setSuccessMessage('User updated successfully!');
      setErrors([]);
      setShowEditForm(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
      setErrors(['Failed to update user. Please try again.']);
      setSuccessMessage('');
    }
  };

  return (
    <div className="bg-gray-800 min-h-screen flex flex-col items-center justify-start p-6 relative">
      <Link
        to="/usersoptions"
        className="absolute top-6 left-6 flex items-center text-white hover:text-gray-400 transition cursor-pointer select-none"
      >
        <FiArrowLeft className="mr-2" size={20} />
        <span className="font-medium text-sm">Return to User Options</span>
      </Link>

      <h1 className="text-3xl font-bold text-white mb-6">User List</h1>

      <div className="overflow-x-auto w-full max-w-6xl mb-6">
        <table className="w-full bg-white rounded shadow">
          <thead className="bg-black text-white">
            <tr>
              <th className="py-3 px-6 text-left">First Name</th>
              <th className="py-3 px-6 text-left">Last Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Phone Number</th>
              <th className="py-3 px-6 text-left">Password</th>
              <th className="py-3 px-6 text-left">Edit</th>
            </tr>
          </thead>
          <tbody>
            {usersignups.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-white">
                  No users found.
                </td>
              </tr>
            ) : (
              usersignups.map((user) => (
                <tr key={user._id} className="border-b border-gray-200">
                  <td className="py-4 px-6">{user.firstname}</td>
                  <td className="py-4 px-6">{user.lastname}</td>
                  <td className="py-4 px-6">{user.email}</td>
                  <td className="py-4 px-6">{user.phonenumber}</td>
                  <td className="py-4 px-6">{user.password}</td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleEditClick(user)}
                      className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showEditForm && (
        <div className="w-full max-w-2xl p-6 rounded shadow-lg bg-white mb-10">
          <h2 className="text-2xl font-bold mb-4 text-center">Edit User</h2>

          {['firstname', 'lastname', 'email', 'phonenumber', 'password', 'confirmpassword'].map(
            (field) => {
              const label =
                field === 'firstname'
                  ? 'First Name'
                  : field === 'lastname'
                  ? 'Last Name'
                  : field === 'email'
                  ? 'Email'
                  : field === 'phonenumber'
                  ? 'Phone Number'
                  : field === 'password'
                  ? 'Password'
                  : 'Confirm Password';

              const type =
                field === 'password'
                  ? showPassword
                    ? 'text'
                    : 'password'
                  : field === 'confirmpassword'
                  ? showConfirmPassword
                    ? 'text'
                    : 'password'
                  : 'text';

              return (
                <div key={field} className="mb-3 flex items-center">
                  <input
                    type="checkbox"
                    id={`checkbox-${field}`}
                    name={field}
                    checked={checkedFields[field]}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                    disabled={field === 'confirmpassword' && !checkedFields.password}
                  />
                  <label htmlFor={`checkbox-${field}`} className="mr-3 font-semibold">
                    {label}
                  </label>
                  <input
                    type={type}
                    name={field}
                    value={editUserData[field]}
                    onChange={handleChange}
                    disabled={!checkedFields[field]}
                    placeholder={label}
                    className={`flex-grow p-2 border rounded ${
                      checkedFields[field]
                        ? 'border-gray-400'
                        : 'border-gray-200 bg-gray-100 cursor-not-allowed'
                    }`}
                  />
                  {(field === 'password' || field === 'confirmpassword') && checkedFields[field] && (
                    <button
                      type="button"
                      onClick={() =>
                        field === 'password'
                          ? setShowPassword((v) => !v)
                          : setShowConfirmPassword((v) => !v)
                      }
                      className="ml-2 text-blue-600 text-sm"
                    >
                      {field === 'password' ? (showPassword ? 'Hide' : 'Show') : showConfirmPassword ? 'Hide' : 'Show'}
                    </button>
                  )}
                </div>
              );
            }
          )}

          <button
            onClick={validateAndPatch}
            className="w-full bg-yellow-400 text-black py-2 rounded hover:bg-yellow-500 mt-4"
          >
            Update User
          </button>

          <button
            onClick={() => {
              setShowEditForm(false);
              setErrors([]);
              setSuccessMessage('');
            }}
            className="w-full mt-3 text-center text-gray-600 hover:text-gray-900 underline"
            type="button"
          >
            Cancel
          </button>

          {errors.length > 0 && (
            <div className="mt-4 text-red-600">
              <p className="font-semibold">Please fix the following:</p>
              <ul className="list-disc ml-5">
                {errors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EditUsers;