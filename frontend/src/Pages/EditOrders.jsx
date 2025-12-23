import { useState, useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { getOrders, patchOrder } from '../services/orderservice';
import { getUsers } from '../services/usersignupservice';

const EditOrders = () => {
  const [orders, setOrders] = useState([]);
  const [usersignups, setUserSignUps] = useState([]);

  const [editOrderData, setEditOrderData] = useState({
    name: '',
    email: '',
    phonenumber: '',
    items: '',
    total: '',
  });

  const [checkedFields, setCheckedFields] = useState({
    name: false,
    email: false,
    phonenumber: false,
    items: false,
    total: false,
  });

  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState(null);

  // =========================
  // Fetch Orders & Users
  // =========================
  useEffect(() => {
    fetchOrders();
    fetchUsers();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      console.log('Orders response:', response.data);

      const ordersArray = Array.isArray(response.data)
        ? response.data
        : response.data?.data || response.data?.orders || [];

      setOrders(ordersArray);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      console.log('Users response:', response.data);

      const usersArray = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      setUserSignUps(usersArray);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  // =========================
  // Edit Button Click
  // =========================
  const handleEditClick = (order) => {
    setEditingOrderId(order._id);
    setShowEditForm(true);

    setEditOrderData({
      name: order.name || '',
      email: order.email || '',
      phonenumber: order.phonenumber || '',
      items: String(order.items || ''),
      total: String(order.total || ''),
    });

    setCheckedFields({
      name: false,
      email: false,
      phonenumber: false,
      items: false,
      total: false,
    });

    setErrors([]);
    setSuccessMessage('');
  };

  // =========================
  // Checkbox Change
  // =========================
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setCheckedFields((prev) => ({ ...prev, [name]: checked }));
  };

  // =========================
  // Input Change
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditOrderData((prev) => ({ ...prev, [name]: value }));
    if (errors.length) setErrors([]);
    if (successMessage) setSuccessMessage('');
  };

  // =========================
  // Validate & PATCH
  // =========================
  const validateAndPatch = async () => {
    const fieldsToUpdate = Object.entries(checkedFields)
      .filter(([_, checked]) => checked)
      .map(([field]) => field);

    if (!fieldsToUpdate.length) {
      setErrors(['Please select at least one field to update.']);
      return;
    }

    const validationErrors = [];

    fieldsToUpdate.forEach((field) => {
      const value = editOrderData[field]?.trim();

      if (!value) validationErrors.push(`${field} is required.`);

      if (field === 'email') {
        if (!value.includes('@'))
          validationErrors.push('Email must contain "@"');
        else if (
          !usersignups.some(
            (u) => u.email.toLowerCase() === value.toLowerCase()
          )
        )
          validationErrors.push('Email does not exist in users database');
      }

      if (field === 'phonenumber' && value.length !== 11)
        validationErrors.push('Phone number must be exactly 11 digits');

      if (field === 'items' && (isNaN(value) || Number(value) < 1))
        validationErrors.push('Items must be at least 1');

      if (field === 'total' && (isNaN(value) || Number(value) <= 0))
        validationErrors.push('Total must be greater than 0');
    });

    if (validationErrors.length) {
      setErrors(validationErrors);
      return;
    }

    const patchData = {};
    fieldsToUpdate.forEach((field) => {
      patchData[field] =
        field === 'items' || field === 'total'
          ? Number(editOrderData[field])
          : editOrderData[field].trim();
    });

    try {
      await patchOrder(editingOrderId, patchData);
      setSuccessMessage('Order updated successfully!');
      setErrors([]);
      setShowEditForm(false);
      fetchOrders();
    } catch (err) {
      console.error(err);
      setErrors(['Failed to update order. Please try again.']);
    }
  };

  return (
    <div className="bg-gray-800 min-h-screen flex flex-col items-center p-6 relative">
      <Link
        to="/ordersoptions"
        className="absolute top-6 left-6 flex items-center text-white hover:text-gray-400"
      >
        <FiArrowLeft className="mr-2" size={20} />
        <span className="text-sm font-medium">Return to Orders Options</span>
      </Link>

      <h1 className="text-3xl font-bold text-white mb-6">Order List</h1>

      <div className="overflow-x-auto w-full max-w-6xl mb-6">
        <table className="w-full bg-white rounded shadow">
          <thead className="bg-black text-white">
            <tr>
              <th className="py-3 px-6 text-left">Order ID</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Phone</th>
              <th className="py-3 px-6 text-left">Items</th>
              <th className="py-3 px-6 text-left">Total</th>
              <th className="py-3 px-6 text-left">Edit</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-white">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="py-4 px-6 break-all">{order._id}</td>
                  <td className="py-4 px-6">{order.name}</td>
                  <td className="py-4 px-6">{order.email}</td>
                  <td className="py-4 px-6">{order.phonenumber}</td>
                  <td className="py-4 px-6">{order.items}</td>
                  <td className="py-4 px-6">{order.total}</td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleEditClick(order)}
                      className="bg-yellow-400 px-4 py-2 rounded hover:bg-yellow-500"
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
        <div className="w-full max-w-2xl bg-white p-6 rounded shadow mb-10">
          <h2 className="text-2xl font-bold mb-4 text-center">Edit Order</h2>

          {['name', 'email', 'phonenumber', 'items', 'total'].map((field) => (
            <div key={field} className="mb-3 flex items-center">
              <input
                type="checkbox"
                name={field}
                checked={checkedFields[field]}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <label className="mr-3 font-semibold capitalize">{field}</label>
              <input
                type={
                  field === 'email'
                    ? 'email'
                    : field === 'items' || field === 'total'
                    ? 'number'
                    : 'text'
                }
                name={field}
                value={editOrderData[field]}
                onChange={handleChange}
                disabled={!checkedFields[field]}
                className={`flex-grow p-2 border rounded ${
                  checkedFields[field]
                    ? 'border-gray-400'
                    : 'bg-gray-100 cursor-not-allowed'
                }`}
              />
            </div>
          ))}

          <button
            onClick={validateAndPatch}
            className="w-full bg-yellow-400 py-2 rounded hover:bg-yellow-500 mt-4"
          >
            Update Order
          </button>

          <button
            onClick={() => {
              setShowEditForm(false);
              setErrors([]);
              setSuccessMessage('');
            }}
            className="w-full mt-3 text-gray-600 underline"
          >
            Cancel
          </button>

          {errors.length > 0 && (
            <ul className="mt-4 text-red-600 list-disc ml-5">
              {errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          )}

          {successMessage && (
            <div className="mt-4 text-green-600 font-semibold text-center">
              {successMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EditOrders;