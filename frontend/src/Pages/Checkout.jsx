import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUsers } from "../services/usersignupservice";
import { createOrder } from "../services/orderservice";
import { getProducts, patchProduct } from "../services/productservice";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState(location.state?.cartItems || []);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const [errors, setErrors] = useState([]);
  const [products, setProducts] = useState([]);

  // Fetch latest product info to get real quantities
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        const allProducts = res.data.data || res.data;
        setProducts(allProducts);

        const updatedCart = cartItems.map(item => {
          const prod = allProducts.find(p => p._id === item._id);
          return prod ? { ...item, quantityAvailable: prod.quantity } : item;
        });
        setCartItems(updatedCart);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };
    fetchProducts();
  }, []);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prevItems =>
      prevItems.map(item =>
        item._id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== id));
  };

  const handleCustomerInfoChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
    if (errors.length > 0) setErrors([]);
  };

  const verifyEmailExists = async (email) => {
    try {
      const response = await getUsers();
      const users = response.data || [];
      return users.some(user => user.email.toLowerCase() === email.toLowerCase());
    } catch (error) {
      console.error("Failed to verify email", error);
      setErrors(["Failed to verify email. Please try again later."]);
      return false;
    }
  };

  const handleCheckout = async () => {
    const currentErrors = [];

    if (!customerInfo.name.trim()) currentErrors.push("Name is required");
    if (!customerInfo.email.trim()) currentErrors.push("Email is required");
    if (!customerInfo.phone.trim()) currentErrors.push("Phone is required");
    if (!/^\d{11}$/.test(customerInfo.phone.trim()))
      currentErrors.push("Phone number must be exactly 11 digits");
    if (cartCount < 1) currentErrors.push("Your cart is empty");
    if (subtotal <= 0) currentErrors.push("Total must be greater than 0");

    if (currentErrors.length > 0) {
      setErrors(currentErrors);
      return;
    }

    const emailExists = await verifyEmailExists(customerInfo.email);
    if (!emailExists) {
      setErrors(["Email does not exist in our records. Please sign up first."]);
      return;
    }

    // Check stock availability
    for (const item of cartItems) {
      if (item.quantity > item.quantityAvailable) {
        console.error(`Quantity not available for ${item.name}. Available: ${item.quantityAvailable}`);
        setErrors([`Quantity not available for ${item.name}. Available: ${item.quantityAvailable}`]);
        return;
      }
    }

    try {
      // Reduce quantity in DB
      for (const item of cartItems) {
        const newQuantity = item.quantityAvailable - item.quantity;
        await patchProduct(item._id, { quantity: newQuantity });
      }

      await createOrder({
        name: customerInfo.name,
        phonenumber: customerInfo.phone,
        email: customerInfo.email,
        items: cartCount,
        total: subtotal
      });

      alert(`Order placed successfully! Total: EGP ${subtotal.toFixed(2)}`);
      navigate("/home");
    } catch (error) {
      console.error("Failed to place order", error);
      setErrors(["Failed to place order. Please try again later."]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-blue-100">
      <header className="flex items-center justify-between px-6 py-4 shadow bg-white relative">
        <h1 className="text-4xl font-extrabold text-black tracking-widest uppercase">
          SnapRent
        </h1>
        <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-6">
          <Link to="/home" className="text-sm">Home</Link>
          <Link to="/aboutus" className="text-sm">About</Link>
          <Link to="/services" className="text-sm">Services</Link>
          <Link to="/contactus" className="text-sm">Contact</Link>
        </div>
        <div className="relative">
          <button
            className="text-2xl"
            title="Cart"
            type="button"
            onClick={() => navigate("/checkout", { state: { cartItems } })}
          >
            🛒
          </button>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
              {cartCount}
            </span>
          )}
        </div>
      </header>

      <main className="flex-grow px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Your Cart ({cartCount})</h1>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Customer Information</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={customerInfo.name}
                      onChange={handleCustomerInfoChange}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={customerInfo.email}
                      onChange={handleCustomerInfoChange}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleCustomerInfoChange}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal ({cartCount} items)</span>
                    <span className="font-medium">EGP {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>EGP {subtotal.toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleCheckout}
                    disabled={cartCount === 0}
                    className="w-full bg-blue-600 text-white py-3 rounded-md font-bold mt-4 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Place Order (EGP {subtotal.toFixed(2)})
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:w-2/3">
              {cartItems.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                  <p className="text-gray-600 mb-4">Your cart is empty</p>
                  <Link to="/home" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item._id} className="bg-white rounded-lg shadow-sm p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-24 h-24 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <h2 className="font-medium text-lg">{item.name}</h2>
                          <p className="text-gray-600">Size: {item.size || "One Size"}</p>
                          <p className="text-gray-600">{item.quantity} / {item.quantityAvailable || "10"} units left</p>
                          <p className="text-blue-600">{item.delivery || "Standard Delivery"}</p>

                          <div className="flex items-center mt-4">
                            <button onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              className="px-3 py-1 border rounded-l-md hover:bg-gray-100">-</button>
                            <span className="px-4 py-1 border-t border-b">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="px-3 py-1 border rounded-r-md hover:bg-gray-100">+</button>
                          </div>

                          <div className="flex gap-4 mt-4">
                            <button onClick={() => removeItem(item._id)} className="text-red-500 text-sm hover:text-red-700">
                              Remove
                            </button>
                            <button className="text-blue-500 text-sm hover:text-blue-700">Wishlist</button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">EGP {(item.price * item.quantity).toFixed(2)}</p>
                          {item.quantity > 1 && (
                            <p className="text-sm text-gray-500">EGP {item.price.toFixed(2)} each</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {errors.length > 0 && (
            <div className="mt-6 max-w-4xl mx-auto text-red-600 font-semibold">
              <ul className="list-disc ml-5">
                {errors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>

      <footer className="text-center text-xs text-gray-500 py-4 border-t bg-white">
        © 2025 E-Commerce Store. All rights reserved.
      </footer>
    </div>
  );
};

export default Checkout;
