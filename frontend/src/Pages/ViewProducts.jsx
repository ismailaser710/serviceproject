import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { getProducts } from '../services/productservice'; // service import

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      // Handle both possible response formats: response.data or response.data.data
      setProducts(response.data.data || response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load products');
    }
  };

  return (
    <div className="bg-gray-800 min-h-screen flex flex-col items-center justify-center p-6 relative">
      {/* Return Icon and Label in Top-Left */}
      <button
        onClick={() => navigate('/productsoptions')}
        className="absolute top-4 left-4 text-white hover:text-gray-400 flex items-center space-x-2"
      >
        <AiOutlineArrowLeft size={24} />
        <span className="text-sm">Return to Products Options</span>
      </button>

      <h1 className="text-3xl font-bold text-white mb-6">Product List</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="overflow-x-auto w-full max-w-6xl">
        <table className="w-full bg-white rounded shadow">
          <thead className="bg-black text-white">
            <tr>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Description</th>
              <th className="py-3 px-6 text-left">Price</th>
              <th className="py-3 px-6 text-left">Quantity</th>
              <th className="py-3 px-6 text-left">Category</th>
              <th className="py-3 px-6 text-left">Location</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">No products found.</td>
              </tr>
            ) : (
              products.map(product => (
                <tr key={product._id || product.id} className="border-b border-gray-200">
                  <td className="py-4 px-6">{product.name}</td>
                  <td className="py-4 px-6">{product.description}</td>
                  <td className="py-4 px-6">{product.price}</td>
                  <td className="py-4 px-6">{product.quantity}</td>
                  <td className="py-4 px-6">{product.category}</td>
                  <td className="py-4 px-6">{product.location}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewProducts;