import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsFillBellFill,
} from 'react-icons/bs';
import './AdminHome.css';
import { getProducts } from '../services/productservice';
import { getUsers } from '../services/usersignupservice';
import { getOrders } from '../services/orderservice';

const AdminHome = () => {
  const navigate = useNavigate();
  const [productCount, setProductCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [error, setError] = useState(null);
  const [adminName, setAdminName] = useState('');

  useEffect(() => {
    const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
    if (adminInfo?.name) setAdminName(adminInfo.name);

    fetchProducts();
    fetchUsers();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      // Check if response.data is an array
      const products = Array.isArray(response.data) ? response.data : response.data.data;
      setProductCount(products.length);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to load products');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      const users = Array.isArray(response.data) ? response.data : response.data.data;
      setUserCount(users.length);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users');
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      const orders = Array.isArray(response.data) ? response.data : response.data.data;
      setOrderCount(orders.length);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load orders');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminInfo');
    navigate('/adminlogin');
  };

  return (
    <>
      <header className="header">
        <div className="header__left">
          <span
            className="icon_header"
            onClick={handleLogout}
            style={{ cursor: 'pointer' }}
            title="Logout"
          >
            <BsFillGrid3X3GapFill />
          </span>
          <span className="header__title">Welcome, {adminName || 'Admin'}</span>
        </div>
        <div className="header__right">
          <BsFillBellFill style={{ fontSize: '24px', cursor: 'pointer' }} />
        </div>
      </header>

      <main className="main-container">
        <div className="main-title" />
        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

        <section className="main-cards">
          <button
            type="button"
            onClick={() => navigate('/productsoptions')}
            className="card"
          >
            <div className="card-inner">
              <div>
                <p className="text-primary-p">Products</p>
                <h5>{productCount}</h5>
              </div>
              <div className="card_icon">
                <BsFillArchiveFill />
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate('/usersoptions')}
            className="card"
          >
            <div className="card-inner">
              <div>
                <p className="text-primary-p">Users</p>
                <h5>{userCount}</h5>
              </div>
              <div className="card_icon">
                <BsPeopleFill />
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate('/ordersoptions')}
            className="card"
          >
            <div className="card-inner">
              <div>
                <p className="text-primary-p">Orders</p>
                <h5>{orderCount}</h5>
              </div>
              <div className="card_icon">
                <BsFillGrid3X3GapFill />
              </div>
            </div>
          </button>
        </section>
      </main>
    </>
  );
};

export default AdminHome;