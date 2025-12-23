import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProducts } from "../services/productservice";

// Fallback images imports
import img1 from '../assets/1.png';
import img2 from '../assets/2.png';
import img3 from '../assets/3.png';
import img4 from '../assets/4.png';
import img5 from '../assets/5.png';
import img6 from '../assets/6.png';
import img7 from '../assets/7.png';
import img8 from '../assets/8.png';
import img9 from '../assets/9.png';
import img10 from '../assets/10.png';
import img11 from '../assets/11.png';
import img12 from '../assets/12.png';

const fallbackImages = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      console.log("Products from API:", response.data);
      setProducts(response.data.data || response.data || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item._id === product._id);
      if (existingItem) {
        return prevItems.map(item =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prevItems,
        {
          ...product,
          quantity: 1,
          imageUrl: product.imageUrl || fallbackImages[products.indexOf(product) % fallbackImages.length]
        }
      ];
    });
  };

  const handleCartClick = () => {
    navigate('/checkout', { state: { cartItems } });
  };

  const handleSearchButtonClick = () => {
    const trimmedQuery = searchQuery.trim();
    setActiveSearch(trimmedQuery);

    if (!trimmedQuery) return;

    const matchedProducts = products.filter(product =>
      product.category?.toLowerCase().includes(trimmedQuery.toLowerCase()) ||
      product.location?.toLowerCase().includes(trimmedQuery.toLowerCase())
    );

    if (matchedProducts.length === 0) {
      navigate("/notfound");
    }
  };

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-blue-100">
      {/* Navbar */}
      <header className="flex items-center justify-between px-6 py-4 shadow bg-white relative">
        <h1 className="text-4xl font-extrabold text-black tracking-widest uppercase">SnapRent</h1>

        <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-6">
          <Link to="/home" className="text-sm">Home</Link>
          <Link to="/aboutus" className="text-sm">About</Link>
          <Link to="/services" className="text-sm">Services</Link>
          <Link to="/contactus" className="text-sm">Contact</Link>
        </div>

        <div className="flex items-center space-x-4 relative">
          <input
            type="text"
            placeholder="Search locations or categories..."
            className="border border-gray-300 rounded px-2 py-1 text-sm w-72"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <button
            onClick={handleSearchButtonClick}
            className="text-xl bg-gray-200 rounded px-2 py-1 hover:bg-gray-300"
            title="Search"
          >
            🔍
          </button>

          <div className="relative">
            <button onClick={handleCartClick} className="text-2xl" title="Go to checkout">🛒</button>
            {totalCartItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {totalCartItems}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Product Grid */}
      <main className="flex-grow px-6 py-10">
        {loading ? (
          <p className="text-center text-gray-700">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-700">No products available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products
              .filter(product =>
                !activeSearch ||
                product.category?.toLowerCase().includes(activeSearch.toLowerCase()) ||
                product.location?.toLowerCase().includes(activeSearch.toLowerCase())
              )
              .map((product) => (
                <div
                  key={product._id}
                  className="border rounded-lg p-4 text-center shadow-sm hover:shadow-md transition bg-white"
                >
                  <Link to={`/product/${product._id}`}>
                    <img
                      src={product.imageUrl || fallbackImages[products.indexOf(product) % fallbackImages.length]}
                      alt={product.name || "Product"}
                      className="w-full h-40 object-contain mb-4 mx-auto"
                    />
                    <h2 className="text-sm font-medium">{product.name || "Unnamed Product"}</h2>
                    <p className="text-gray-600">${product.price || "N/A"}</p>
                  </Link>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="mt-2 px-4 py-1 bg-black text-white text-sm rounded hover:bg-gray-800"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
          </div>
        )}
      </main>

      <footer className="text-center text-xs text-gray-500 py-4 border-t bg-white">
        © 2025 SnapRent. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
