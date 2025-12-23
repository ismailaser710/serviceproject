import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUsers } from "../services/usersignupservice";
import { getOrderById } from "../services/orderservice";
import emailjs from "@emailjs/browser";

const ContactUs = () => {
  const [usersignups, setUserSignUps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [orderInfo, setOrderInfo] = useState(null);
  const [orderStatus, setOrderStatus] = useState(""); // "found" or "notfound"

  /* =========================
     Fetch registered users
  ========================== */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        setUserSignUps(response.data?.data || response.data || []); 
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setUserSignUps([]);
      }
    };
    fetchUsers();
  }, []);

  /* =========================
     Validation
  ========================== */
  const validate = async (formObject) => {
    const newErrors = {};
    setOrderInfo(null);
    setOrderStatus("");

    if (!formObject.name?.trim()) newErrors.name = "Please fill out this field";
    if (!formObject.email?.trim()) newErrors.email = "Please fill out this field";
    if (!formObject.orderId?.trim()) newErrors.orderId = "Please fill out this field";
    if (!formObject.category?.trim()) newErrors.category = "Please select a category";
    if (!formObject.message?.trim()) {
      newErrors.message = "Please fill out this field";
    } else if (formObject.message.trim().length <= 10) {
      newErrors.message = "Message must be longer than 10 characters";
    }

    // Email must exist
    if (
      formObject.email &&
      !usersignups.some(
        (user) => user.email?.toLowerCase() === formObject.email.toLowerCase()
      )
    ) {
      newErrors.email =
        "Email is not registered. Please enter a registered email.";
    }

    // Order ID must exist
    if (formObject.orderId) {
      try {
        const res = await getOrderById(formObject.orderId);
        const order = res.data || res.data?.data;
        if (!order || Object.keys(order).length === 0) {
          newErrors.orderId = "Order ID not found. Please enter a valid order ID.";
          setOrderStatus("notfound");
        } else {
          setOrderInfo(order);
          setOrderStatus("found");
        }
      } catch (err) {
        newErrors.orderId = "Order ID not found. Please enter a valid order ID.";
        setOrderStatus("notfound");
      }
    }

    return newErrors;
  };

  /* =========================
     Submit Handler
  ========================== */
  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setSuccessMessage("");

    const formData = new FormData(event.target);
    const formObject = Object.fromEntries(formData);

    const validationErrors = await validate(formObject);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setLoading(false);
      return;
    }

    try {
      await emailjs.send(
        "service_dxb7bgj",
        "template_qlavvwh",
        {
          name: formObject.name,
          email: formObject.email,
          orderId: formObject.orderId,
          category: formObject.category,
          message: formObject.message,
        },
        "RKDrmpGU7VWnOSvIs"
      );

      setSuccessMessage("Inquiry sent successfully!");
      event.target.reset();
      setErrors({});
      setOrderInfo(null);
      setOrderStatus("");
    } catch (err) {
      console.error(err);
      setErrors({ submit: "Failed to send inquiry. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const ErrorMessage = ({ message }) =>
    message ? <p className="mt-1 text-sm text-red-600 font-medium">{message}</p> : null;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-blue-200">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 shadow bg-white relative">
        <h1 className="text-4xl font-extrabold tracking-widest uppercase">
          SnapRent
        </h1>
        <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-6">
          <Link to="/home">Home</Link>
          <Link to="/aboutus">About</Link>
          <Link to="/services">Services</Link>
          <Link to="/contactus">Contact</Link>
        </div>
      </header>

      {/* Form */}
      <main className="flex-grow flex justify-center items-center p-5">
        <form
          onSubmit={onSubmit}
          noValidate
          className="max-w-xl w-full bg-white p-10 rounded-xl shadow-md"
        >
          <h2 className="text-3xl font-extrabold text-center mb-8 uppercase">
            Contact Customer Support
          </h2>

          {/* Name */}
          <label className="block font-semibold mb-2">Full Name</label>
          <input
            name="name"
            type="text"
            className={`w-full h-12 border-2 rounded-lg px-4 ${
              errors.name ? "border-red-600" : "border-gray-300"
            }`}
          />
          <ErrorMessage message={errors.name} />

          {/* Email */}
          <label className="block font-semibold mt-6 mb-2">Email</label>
          <input
            name="email"
            type="email"
            className={`w-full h-12 border-2 rounded-lg px-4 ${
              errors.email ? "border-red-600" : "border-gray-300"
            }`}
          />
          <ErrorMessage message={errors.email} />

          {/* Order ID */}
          <label className="block font-semibold mt-6 mb-2">Order ID</label>
          <input
            name="orderId"
            type="text"
            className={`w-full h-11 border-2 rounded-lg px-4 ${
              errors.orderId ? "border-red-600" : "border-gray-300"
            }`}
          />
          <ErrorMessage message={errors.orderId} />

          {/* Show order info */}
          {orderStatus === "found" && orderInfo ? (
            <p className="text-green-600 mt-1">
              Order found: {orderInfo.name} - Total: EGP {orderInfo.total}
            </p>
          ) : orderStatus === "notfound" ? (
            <p className="text-red-600 mt-1">Order not found</p>
          ) : null}

          {/* Inquiry Type */}
          <label className="block font-semibold mt-6 mb-2">Inquiry Type</label>
          <select
            name="category"
            defaultValue=""
            className={`w-full h-11 border-2 rounded-lg px-4 ${
              errors.category ? "border-red-600" : "border-gray-300"
            }`}
          >
            <option value="" disabled>
              Select category
            </option>
            <option value="product">Product Question</option>
            <option value="shipping">Shipping & Delivery</option>
            <option value="returns">Returns & Refunds</option>
            <option value="other">Other</option>
          </select>
          <ErrorMessage message={errors.category} />

          {/* Message */}
          <label className="block font-semibold mt-6 mb-2">Message</label>
          <textarea
            name="message"
            rows="5"
            className={`w-full border-2 rounded-lg px-4 pt-3 ${
              errors.message ? "border-red-600" : "border-gray-300"
            }`}
          />
          <ErrorMessage message={errors.message} />

          {errors.submit && <p className="text-red-600 mt-2">{errors.submit}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 mt-8 bg-green-600 text-white rounded-lg uppercase tracking-widest disabled:opacity-50"
          >
            {loading ? "Sending..." : "Submit Inquiry"}
          </button>

          {successMessage && (
            <div className="mt-4 text-green-600 font-semibold text-center">
              {successMessage}
            </div>
          )}
        </form>
      </main>

      {/* Footer */}
      <footer className="bg-white text-center py-6">
        &copy; {new Date().getFullYear()} SnapRent. All rights reserved.
      </footer>
    </div>
  );
};

export default ContactUs;