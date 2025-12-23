import { useState, useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { getOrders, deleteOrder } from '../services/orderservice';

const DeleteOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  /* =========================
     Fetch Orders
  ========================== */
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      console.log('Orders response:', response.data);

      // Handle multiple possible formats from backend
      const ordersArray = Array.isArray(response.data)
        ? response.data
        : response.data?.data || response.data?.orders || [];

      setOrders(ordersArray);
      setError(null);
    } catch (err) {
      console.error('Failed to load orders:', err);
      setError('Failed to load orders');
    }
  };

  /* =========================
     Delete Order
  ========================== */
  const handleDeleteOrder = async (id) => {
    try {
      await deleteOrder(id);
      setOrders((prevOrders) =>
        prevOrders.filter((order) => (order._id || order.id) !== id)
      );
      setError(null);
    } catch (err) {
      console.error('Failed to delete order:', err);
      setError('Failed to delete order');
    }
  };

  return (
    <div className="bg-gray-800 min-h-screen flex flex-col items-center justify-center p-6 relative">
      {/* Return Link */}
      <Link
        to="/ordersoptions"
        className="absolute top-6 left-6 flex items-center text-white hover:text-gray-400 transition"
      >
        <FiArrowLeft className="mr-2" size={20} />
        <span className="font-medium text-sm">Return to Orders Options</span>
      </Link>

      <h1 className="text-3xl font-bold text-white mb-6">Order List</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="overflow-x-auto w-full max-w-6xl">
        <table className="w-full bg-white rounded shadow">
          <thead className="bg-black text-white">
            <tr>
              <th className="py-3 px-6 text-left">Order ID</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Phone Number</th>
              <th className="py-3 px-6 text-left">Items</th>
              <th className="py-3 px-6 text-left">Total</th>
              <th className="py-3 px-6 text-left">Delete</th>
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
              orders.map((order) => {
                const orderId = order._id || order.id; // support multiple ID formats
                return (
                  <tr key={orderId} className="border-b border-gray-200">
                    <td className="py-4 px-6">{orderId}</td>
                    <td className="py-4 px-6">
                      {order.name || `${order.firstname || ''} ${order.lastname || ''}`}
                    </td>
                    <td className="py-4 px-6">{order.email || order.umail}</td>
                    <td className="py-4 px-6">{order.phonenumber}</td>
                    <td className="py-4 px-6">{order.items || order.item}</td>
                    <td className="py-4 px-6">{order.total}</td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleDeleteOrder(orderId)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeleteOrders;
