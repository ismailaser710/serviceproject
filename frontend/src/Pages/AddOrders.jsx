import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { getOrders, createOrder } from '../services/orderservice';
import { getUsers } from '../services/usersignupservice';

const AddOrders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [newOrder, setNewOrder] = useState({
    name: '',
    email: '',
    phonenumber: '',
    items: '',
    total: '',
  });
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchUsers();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      setOrders(response.data); // Axios returns data inside response.data
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data); // Axios returns data inside response.data
    } catch (error) {
      console.error(error);
    }
  };

  const validateForm = () => {
    const currentErrors = [];

    if (!newOrder.name.trim()) currentErrors.push('Name is required');
    if (!newOrder.email.trim()) currentErrors.push('Email is required');
    if (!newOrder.phonenumber.trim()) currentErrors.push('Phone number is required');
    if (!newOrder.items.trim()) currentErrors.push('Items is required');
    if (!newOrder.total.trim()) currentErrors.push('Total is required');

    const emailExists = users.some(
      user => user.email.toLowerCase() === newOrder.email.toLowerCase()
    );
    if (!emailExists) currentErrors.push('Email does not exist in the user database');

    if (newOrder.phonenumber.length !== 11) {
      currentErrors.push('Phone number must be exactly 11 digits');
    }

    if (Number(newOrder.items) < 1) {
      currentErrors.push('Items must be at least 1');
    }

    if (Number(newOrder.total) <= 0) {
      currentErrors.push('Total must be greater than 0');
    }

    return currentErrors;
  };

  const addOrder = async () => {
    const validationErrors = validateForm();

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setSuccessMessage('');
      return;
    }

    setErrors([]);

    try {
      const response = await createOrder(newOrder); // service call
      setOrders([...orders, response.data]); // use response.data
      setNewOrder({
        name: '',
        email: '',
        phonenumber: '',
        items: '',
        total: '',
      });
      setSuccessMessage('Order added successfully!');
      setShowAddForm(false);
    } catch (error) {
      console.error(error);
      setErrors(['Failed to add order. Please try again.']);
      setSuccessMessage('');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewOrder(prev => ({
      ...prev,
      [name]: value,
    }));

    if (errors.length > 0) setErrors([]);
    if (successMessage) setSuccessMessage('');
  };

  return (
    <div className="bg-gray-800 min-h-screen flex flex-col items-center justify-start p-6 relative">
      {/* Back Button */}
      <button
        onClick={() => navigate('/ordersoptions')}
        className="absolute top-4 left-4 text-white hover:text-gray-400 flex items-center space-x-2"
      >
        <AiOutlineArrowLeft size={24} />
        <span className="text-sm">Return to Orders Options</span>
      </button>

      <h1 className="text-3xl font-bold text-white mb-6">Order List</h1>

      {/* Order Table */}
      <div className="overflow-x-auto w-full max-w-6xl mb-4">
        <table className="w-full bg-white rounded shadow">
          <thead className="bg-black text-white">
            <tr>
              <th className="py-3 px-6 text-left">Order ID</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Phone Number</th>
              <th className="py-3 px-6 text-left">Items</th>
              <th className="py-3 px-6 text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">No orders found.</td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order._id || order.id} className="border-b border-gray-200">
                  <td className="py-4 px-6">{order._id || order.id}</td>
                  <td className="py-4 px-6">{order.name}</td>
                  <td className="py-4 px-6">{order.email}</td>
                  <td className="py-4 px-6">{order.phonenumber}</td>
                  <td className="py-4 px-6">{order.items}</td>
                  <td className="py-4 px-6">{order.total}</td>
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
          Add Order
        </button>
      )}

      {showAddForm && (
        <div className="w-full max-w-md p-4 rounded shadow-lg bg-white mb-10">
          <h2 className="text-2xl font-bold mb-4 text-center">Add New Order</h2>
          <input
            type="text"
            name="name"
            value={newOrder.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full p-2 mb-2 border border-gray-300 rounded"
          />
          <input
            type="email"
            name="email"
            value={newOrder.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 mb-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="phonenumber"
            value={newOrder.phonenumber}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full p-2 mb-2 border border-gray-300 rounded"
          />
          <input
            type="number"
            name="items"
            value={newOrder.items}
            onChange={handleChange}
            placeholder="Items"
            className="w-full p-2 mb-2 border border-gray-300 rounded"
          />
          <input
            type="number"
            name="total"
            value={newOrder.total}
            onChange={handleChange}
            placeholder="Total"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />

          <button
            onClick={addOrder}
            className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700"
          >
            Add Order
          </button>

          <button
            onClick={() => {
              setShowAddForm(false);
              setErrors([]);
              setSuccessMessage('');
              setNewOrder({ name: '', email: '', phonenumber: '', items: '', total: '' });
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

export default AddOrders;
