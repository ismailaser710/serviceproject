import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { getProducts, patchProduct } from '../services/productservice';

const EditProducts = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const [editProductData, setEditProductData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    location: '',
  });

  const [checkedFields, setCheckedFields] = useState({
    name: false,
    description: false,
    price: false,
    quantity: false,
    category: false,
    location: false,
  });

  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

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
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const handleEditClick = (product) => {
    setEditingProductId(product._id);
    setShowEditForm(true);

    setEditProductData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      quantity: product.quantity || '',
      category: product.category || '',
      location: product.location || '',
    });

    setCheckedFields({
      name: false,
      description: false,
      price: false,
      quantity: false,
      category: false,
      location: false,
    });

    setErrors([]);
    setSuccessMessage('');
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setCheckedFields((prev) => ({ ...prev, [name]: checked }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProductData((prev) => ({ ...prev, [name]: value }));
  };

  const validateAndPatch = async () => {
    const fieldsToUpdate = Object.keys(checkedFields).filter(
      (field) => checkedFields[field]
    );

    if (fieldsToUpdate.length === 0) {
      setErrors(['Please select at least one field to update.']);
      return;
    }

    const validationErrors = [];

    fieldsToUpdate.forEach((field) => {
      const value = editProductData[field]?.toString().trim();

      if (!value && field !== 'quantity') {
        validationErrors.push(`${field} is required.`);
      }

      if (field === 'price' && (isNaN(value) || Number(value) < 5)) {
        validationErrors.push('Price must be at least 5.');
      }

      if (field === 'quantity' && (isNaN(value) || Number(value) < 0)) {
        validationErrors.push('Quantity must be 0 or greater.');
      }

      if (field === 'description' && value.length <= 20) {
        validationErrors.push('Description must be longer than 20 characters.');
      }

      // NEW: Check if name already exists (excluding current product)
      if (
        field === 'name' &&
        products.some(
          (p) => p.name === value && p._id !== editingProductId
        )
      ) {
        validationErrors.push('Name is already used.');
      }
    });

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const patchData = {};
    fieldsToUpdate.forEach((field) => {
      if (field === 'price') patchData[field] = Number(editProductData[field]);
      else if (field === 'quantity') patchData[field] = Number(editProductData[field]);
      else patchData[field] = editProductData[field].trim();
    });

    try {
      await patchProduct(editingProductId, patchData);
      setSuccessMessage('Product updated successfully.');
      setErrors([]);
      setShowEditForm(false);
      setEditingProductId(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      setErrors(['Failed to update product.']);
    }
  };

  return (
    <div className="bg-gray-800 min-h-screen p-6 relative">
      <button
        onClick={() => navigate('/productsoptions')}
        className="absolute top-4 left-4 text-white flex items-center gap-2"
      >
        <AiOutlineArrowLeft size={24} />
        <span>Return to Products Options</span>
      </button>

      <h1 className="text-3xl font-bold text-white text-center mb-6">
        Product List
      </h1>

      <div className="overflow-x-auto max-w-6xl mx-auto">
        <table className="w-full bg-white rounded shadow">
          <thead className="bg-black text-white">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Description</th>
              <th className="p-3">Price</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Category</th>
              <th className="p-3">Location</th>
              <th className="p-3">Edit</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-4">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id} className="border-b">
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">{product.description}</td>
                  <td className="p-3">{product.price}</td>
                  <td className="p-3">{product.quantity}</td>
                  <td className="p-3">{product.category}</td>
                  <td className="p-3">{product.location}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleEditClick(product)}
                      className="bg-yellow-400 px-4 py-2 rounded"
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
        <div className="bg-white max-w-2xl mx-auto mt-8 p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-4 text-center">Edit Product</h2>

          {Object.keys(editProductData).map((field) => (
            <div key={field} className="flex items-center mb-3">
              <input
                type="checkbox"
                name={field}
                checked={checkedFields[field]}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <input
                type="text"
                name={field}
                value={editProductData[field]}
                onChange={handleChange}
                disabled={!checkedFields[field]}
                placeholder={field}
                className="flex-grow p-2 border rounded"
              />
            </div>
          ))}

          <button
            onClick={validateAndPatch}
            className="w-full bg-yellow-400 py-2 rounded mt-4"
          >
            Update Product
          </button>

          {errors.length > 0 && (
            <ul className="text-red-600 mt-4 list-disc ml-5">
              {errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          )}

          {successMessage && (
            <p className="text-green-600 mt-4 font-semibold">
              {successMessage}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default EditProducts;