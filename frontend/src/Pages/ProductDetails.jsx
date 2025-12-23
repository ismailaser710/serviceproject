import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProducts, getProductById } from "../services/productservice";

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

const fallbackImages = [
  img1, img2, img3, img4, img5, img6,
  img7, img8, img9, img10, img11, img12
];

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [productIndex, setProductIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allProductsRes = await getProducts();
        const allProducts = allProductsRes.data.data || allProductsRes.data;
        const index = allProducts.findIndex(p => p._id === id);
        setProductIndex(index);

        const productRes = await getProductById(id);
        const singleProduct = productRes.data.data || productRes.data;
        setProduct(singleProduct);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!product) return <p className="text-center mt-10 text-red-500">Product not found.</p>;

  const imageToShow = product.imageUrl || fallbackImages[
    (productIndex !== null && productIndex >= 0)
      ? productIndex % fallbackImages.length
      : 0
  ];

  return (
    <div className="min-h-screen flex flex-col bg-blue-200">
      {/* Navbar */}
      <header className="flex items-center justify-between px-6 py-4 shadow bg-white relative">
        <h1 className="text-4xl font-extrabold text-black tracking-widest uppercase">SnapRent</h1>
        <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-6">
          <Link to="/home" className="text-sm">Home</Link>
          <Link to="/aboutus" className="text-sm">About</Link>
          <Link to="/services" className="text-sm">Services</Link>
          <Link to="/contactus" className="text-sm">Contact</Link>
        </div>
      </header>

      {/* Product Detail Content */}
      <main className="flex-grow flex flex-col md:flex-row items-center justify-center p-10">
        <img
          src={imageToShow}
          alt={product.name}
          className="w-80 h-80 object-contain mb-6 md:mb-0 md:mr-10"
        />
        <div className="max-w-xl">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-xl font-semibold mb-2 text-gray-800">${product.price}</p>

          <p className="text-gray-700 mb-4">
            <strong>Description:</strong><br />
            {product.description}
          </p>

          <p className="text-gray-600 mb-1"><strong>Category:</strong> {product.category}</p>
          <p className="text-gray-600 mb-1"><strong>Quantity:</strong> {product.quantity}</p>
          <p className="text-gray-600 mb-4"><strong>Location:</strong> {product.location}</p>

          <div className="mt-4">
            <Link to="/home" className="text-sm text-blue-600 hover:underline">← Back to Home</Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-500 py-4 border-t bg-white">
        © 2025 SnapRent. All rights reserved.
      </footer>
    </div>
  );
};

export default ProductDetails;
