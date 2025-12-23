import React from "react";
import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
  const cartCount = 0; // static as placeholder
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-blue-100">
      {/* Navbar */}
      <header className="flex items-center justify-between px-6 py-4 shadow bg-white relative">
        <h1 className="text-4xl font-extrabold text-black tracking-widest uppercase">SnapRent</h1>

        {/* Centered nav items */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-6">
          <Link to="/home" className="text-sm">Home</Link>
          <Link to="/aboutus" className="text-sm">About</Link>
          <Link to="/services" className="text-sm">Services</Link>
          <Link to="/contactus" className="text-sm">Contact</Link>
        </div>

        {/* Cart Icon */}
        <div className="relative">
          <button
            className="text-2xl"
            title="Go to checkout"
            type="button"
            onClick={() => navigate('/checkout')} // optional: navigate to checkout
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

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center">
        <h2 className="text-6xl font-bold text-black">Item Not Found</h2>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-500 py-4 border-t bg-white">
        © 2025 SnapRent. All rights reserved.
      </footer>
    </div>
  );
};

export default NotFound;
