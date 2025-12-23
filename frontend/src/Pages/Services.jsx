import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Services = () => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0); // Add cart count state if needed

  const tools = [
    {
      title: 'Change Password',
      description: 'Change password to protect your account.',
      link: '/passwordchange',
    },
    {
      title: 'Delete User',
      description: 'Erase user account permanently.',
    },
    {
      title: 'Log Out',
      description: 'Log out to exit account.',
    }
  ];

  // Handle click on tools without a link, specifically "Log Out" and "Delete User"
  const handleToolClick = (toolTitle) => {
    if (toolTitle === "Log Out") {
      window.open('/usersignin', '_blank');
    } else if (toolTitle === "Delete User") {
      navigate('/userdelete');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-blue-100">
      {/* Navbar */}
      <header className="flex items-center justify-between px-6 py-4 shadow bg-white relative">
        <h1 className="text-4xl font-extrabold text-black tracking-widest uppercase">SnapRent</h1>

        {/* Centered nav items */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-6">
          <Link to="/home" className="text-sm">Home</Link>
          <Link to="/aboutus" className="text-sm">About</Link>
          <Link to="/services" className="text-sm font-semibold underline">Services</Link>
          <Link to="/contactus" className="text-sm">Contact</Link>
        </div>

        {/* Cart Icon on right */}
        <div className="relative">
          <button className="text-2xl">🛒</button>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
              {cartCount}
            </span>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow flex flex-col items-center p-8">
        <div className="max-w-3xl w-full py-12">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Access your data through tools
          </h2>

          <div className="flex flex-col gap-6">
            {tools.map((tool, index) =>
              tool.link ? (
                <Link
                  to={tool.link}
                  key={index}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 hover:-translate-y-1 block"
                >
                  <h3 className="text-xl font-semibold mb-3 text-green-600">{tool.title}</h3>
                  <p className="text-gray-600">{tool.description}</p>
                </Link>
              ) : (
                <div
                  key={index}
                  onClick={() => handleToolClick(tool.title)}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 hover:-translate-y-1 cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleToolClick(tool.title);
                  }}
                >
                  <h3 className="text-xl font-semibold mb-3 text-green-600">{tool.title}</h3>
                  <p className="text-gray-600">{tool.description}</p>
                </div>
              )
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-500 py-4 border-t bg-white">
        © 2025 E-Commerce Store. All rights reserved.
      </footer>
    </div>
  );
};

export default Services;