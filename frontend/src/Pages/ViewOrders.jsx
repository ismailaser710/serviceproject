import { useState, useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { getOrders } from '../services/orderservice'; // service import

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      // Handle both possible response formats: response.data or response.data.data
      setOrders(response.data.data || response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load orders');
    }
  };

  return (
    <div className="bg-gray-800 min-h-screen flex flex-col items-center justify-center p-6 relative">
      {/* Return Link Top-Left */}
      <Link
        to="/ordersoptions"
        className="absolute top-6 left-6 flex items-center text-white hover:text-gray-400 transition cursor-pointer select-none"
      >
        <FiArrowLeft className="mr-2" size={20} />
        <span className="font-medium text-sm">Return to Orders Options</span>
      </Link>

      <h1 className="text-3xl font-bold text-white mb-6">Order List</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="overflow-x-auto w-full max-w-5xl">
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
                  <td className="py-4 px-6">{order.name || `${order.firstname || ''} ${order.lastname || ''}`}</td>
                  <td className="py-4 px-6">{order.umail || order.email}</td>
                  <td className="py-4 px-6">{order.phonenumber}</td>
                  <td className="py-4 px-6">{order.item || order.items}</td>
                  <td className="py-4 px-6">{order.total}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewOrders;