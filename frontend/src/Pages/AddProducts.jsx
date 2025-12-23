import { useState, useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { getProducts, createProduct } from '../services/productservice';

const AddProducts = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    location: '',
  });
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      const productsArray = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];
      setProducts(productsArray);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const addProduct = async (e) => {
    e.preventDefault(); // Prevent form submit reload
    const required = ['name', 'description', 'price', 'quantity', 'category', 'location'];
    const currentErrors = [];

    required.forEach(field => {
      if (!newProduct[field]?.toString().trim()) {
        currentErrors.push(`${field} is required`);
      }
    });

    if (newProduct.description.length <= 20) currentErrors.push('Description must be more than 20 characters');
    if (Number(newProduct.price) < 5) currentErrors.push('Price must be at least 5');
    if (Number(newProduct.quantity) <= 0) currentErrors.push('Quantity must be greater than 0');

    const isNameUsed = products.some(
      (product) => product.name.trim().toLowerCase() === newProduct.name.trim().toLowerCase()
    );
    if (isNameUsed) currentErrors.push('Product name is already used');

    if (currentErrors.length > 0) {
      setErrors(currentErrors);
      setSuccessMessage('');
      return;
    }

    try {
      const payload = {
        ...newProduct,
        price: Number(newProduct.price),
        quantity: Number(newProduct.quantity),
      };

      const response = await createProduct(payload);
      const addedProduct = response.data?.data || response.data;

      setProducts(prev => [...prev, addedProduct]);
      setNewProduct({
        name: '',
        description: '',
        price: '',
        quantity: '',
        category: '',
        location: '',
      });
      setSuccessMessage('Product added successfully!');
      setErrors([]);
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to add product:', error.response || error);
      setErrors(['Failed to add product. Check console for details.']);
      setSuccessMessage('');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
    if (errors.length > 0) setErrors([]);
    if (successMessage) setSuccessMessage('');
  };

  return (
    <div className="bg-gray-800 min-h-screen flex flex-col items-center justify-start p-6 relative">
      <Link
        to="/productsoptions"
        className="absolute top-6 left-6 flex items-center text-white hover:text-gray-400 transition cursor-pointer select-none"
      >
        <FiArrowLeft className="mr-2" size={20} />
        <span className="font-medium text-sm">Return to Products Options</span>
      </Link>

      <h1 className="text-3xl font-bold text-white mb-6">Product List</h1>

      <div className="overflow-x-auto w-full max-w-6xl mb-4">
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

      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full max-w-md bg-pink-600 text-white py-3 rounded hover:bg-pink-700 transition mb-6"
        >
          Add Product
        </button>
      )}

      {showAddForm && (
        <form
          onSubmit={addProduct}
          className="w-full max-w-md p-4 rounded shadow-lg bg-white mb-10"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Add New Product</h2>
          <input type="text" name="name" value={newProduct.name} onChange={handleChange} placeholder="Name" className="w-full p-2 mb-2 border border-gray-300 rounded" />
          <textarea name="description" value={newProduct.description} onChange={handleChange} placeholder="Description" className="w-full p-2 mb-2 border border-gray-300 rounded" />
          <input type="number" name="price" value={newProduct.price} onChange={handleChange} placeholder="Price" className="w-full p-2 mb-2 border border-gray-300 rounded" />
          <input type="number" name="quantity" value={newProduct.quantity} onChange={handleChange} placeholder="Quantity" className="w-full p-2 mb-2 border border-gray-300 rounded" />
          <input type="text" name="category" value={newProduct.category} onChange={handleChange} placeholder="Category" className="w-full p-2 mb-2 border border-gray-300 rounded" />
          <input type="text" name="location" value={newProduct.location} onChange={handleChange} placeholder="Location" className="w-full p-2 mb-2 border border-gray-300 rounded" />

          <button type="submit" className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 mt-2">Add Product</button>
          <button type="button" onClick={() => setShowAddForm(false)} className="w-full mt-3 text-center text-gray-600 hover:text-gray-900 underline">Cancel</button>

          {successMessage && <div className="mt-4 text-green-600 font-semibold text-center">{successMessage}</div>}
          {errors.length > 0 && (
            <div className="mt-4 text-red-600">
              <p className="font-semibold">Please fix the following:</p>
              <ul className="list-disc ml-5">{errors.map((err, i) => <li key={i}>{err}</li>)}</ul>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default AddProducts;
