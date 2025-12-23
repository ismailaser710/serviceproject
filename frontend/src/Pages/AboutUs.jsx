import { useState } from 'react'; 
import { Link } from 'react-router-dom';

function AboutUs() {
  const [showStory, setShowStory] = useState(false);

  const handleToggleStory = () => {
    setShowStory(!showStory);
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: '#fec278' }} className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="flex items-center justify-between px-6 py-4 shadow bg-white relative">
        <h1 className="text-4xl font-extrabold text-black tracking-widest uppercase">SnapRent</h1>

        {/* Centered nav items */}
        <nav className="absolute left-1/2 transform -translate-x-1/2 flex space-x-6">
          <Link to="/home" className="text-sm">Home</Link>
          <Link to="/aboutus" className="text-sm">About</Link>
          <a href="/services" className="text-sm">Services</a>
          <a href="contactus" className="text-sm">Contact</a>
        </nav>

        {/* Cart Icon */}
        <div className="relative">
          <button className="text-2xl">🛒</button>
          {/* Cart count can be added here if needed */}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">
        {/* Top Section */}
        <section
          style={{
            backgroundColor: '#dbeafe',
            padding: '60px 20px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '40px',
          }}
        >
          {/* Text */}
          <div style={{ flex: '1 1 300px', maxWidth: '500px' }}>
            <h1
              style={{
                fontSize: '2.5rem',
                fontWeight: '600',
                marginBottom: '10px',
                color: '#1e293b',
              }}
            >
              About SNAPRENT
            </h1>
            <p
              style={{
                fontSize: '1.125rem',
                lineHeight: '1.7',
                color: '#334155',
              }}
            >
              SnapRent is a rental platform for modern living. We empower people
              to access high-quality products without the need to buy. From tools
              to tech and fashion to furniture—SnapRent helps you rent smarter
              and live better.
            </p>
          </div>

          {/* Image */}
          <div style={{ flex: '1 1 300px', maxWidth: '400px' }}>
            <img
              src="/pic1.jpg"
              alt="SnapRent team"
              style={{ width: '100%', borderRadius: '12px' }}
            />
          </div>
        </section>

        {/* Bottom Section */}
        <section
          style={{
            paddingTop: '60px',
            paddingBottom: '60px',
            paddingLeft: '30px',
            paddingRight: '60px',
            maxWidth: '900px',
            margin: '0 auto',
            color: '#1e293b',
          }}
        >
          <h2
            style={{
              fontSize: '1.75rem',
              fontWeight: '600',
              marginBottom: '20px',
            }}
          >
            Welcome to SnapRent – Rent Smarter, Live Better
          </h2>
          <p style={{ fontSize: '1.125rem', lineHeight: '1.8' }}>
            Our platform connects renters with a wide variety of items—from
            electronics and tools to fashion and gear—all available at affordable
            rental rates. With SnapRent, you enjoy flexibility, sustainability,
            and freedom from clutter.
          </p>

          {/* Toggle Button */}
          <button
            onClick={handleToggleStory}
            style={{
              marginTop: '30px',
              backgroundColor: '#1e293b',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            {showStory ? 'Read Less' : 'Read More'}
          </button>

          {/* Hidden Story */}
          {showStory && (
            <div style={{ marginTop: '30px' }}>
              <h3
                style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  marginBottom: '10px',
                }}
              >
                Our Story
              </h3>
              <p style={{ fontSize: '1.125rem', lineHeight: '1.7' }}>
                Founded in 2025, SnapRent began with a simple idea: Why buy when
                you can rent? Whether you’re a traveler needing gear, a
                professional testing equipment, or someone who loves variety
                without clutter, we’re here to make life easier—and lighter on
                your wallet.
              </p>
              <p
                style={{
                  fontSize: '1.125rem',
                  lineHeight: '1.7',
                  marginTop: '10px',
                }}
              >
                Join thousands of satisfied renters and lenders in our community.
                Start exploring today!
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-500 py-4 border-t bg-white">
        © 2025 E-Commerce Store. All rights reserved.
      </footer>
    </div>
  );
}

export default AboutUs;