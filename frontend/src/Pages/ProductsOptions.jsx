import { useNavigate } from 'react-router-dom';
import { AiOutlineArrowLeft } from 'react-icons/ai';

const ProductsOptions = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-800 min-h-screen flex flex-col items-center justify-center relative px-4 py-6">
      {/* Return Icon and Label in Top-Left */}
      <button
        onClick={() => navigate('/adminhome')}
        className="absolute top-4 left-4 text-white hover:text-gray-400 flex items-center space-x-2"
      >
        <AiOutlineArrowLeft size={24} />
        <span className="text-sm">Return to Admin Home</span>
      </button>

      {/* Page Title */}
      <h1 className="text-3xl font-bold text-white mb-6">Admin Options for Products</h1>

      {/* Buttons */}
      <div className="w-full max-w-md p-6 bg-white rounded shadow-lg flex flex-col space-y-4">
        <button
          onClick={() => navigate('/viewproducts')}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          View Products
        </button>
        <button
          onClick={() => navigate('/deleteproducts')}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
        >
          Delete Product
        </button>
        <button
          onClick={() => navigate('/editproducts')}
          className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
        >
          Edit Product
        </button>
        <button
          onClick={() => navigate('/addproducts')}
          className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600"
        >
          Add Product
        </button>
      </div>
    </div>
  );
};

export default ProductsOptions;