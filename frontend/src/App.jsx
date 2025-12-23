import {
  Dashboard,
  AdminLogin,
  AdminHome,
  ProductsOptions,
  ViewProducts,
  DeleteProducts,
  EditProducts,
  AddProducts,
  UsersOptions,
  ViewUsers,
  DeleteUsers,
  EditUsers,
  AddUsers,
  Checkout,
  OrdersOptions,
  ViewOrders,
  DeleteOrders,
  EditOrders,
  AddOrders,
  Services,
  UserSignUp,
  UserSignIn,
  PasswordChange,
  UserDelete,
  AboutUs,
  ContactUs,
  Home,
  ProductDetails,
  NotFound,
} from "./Pages";

import { Route, Routes, Navigate } from "react-router-dom";

const App = () => {
  return (
    <div>
      <Routes>
        {/* Redirect / to /dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/adminhome" element={<AdminHome />} />
        <Route path="/productsoptions" element={<ProductsOptions />} />
        <Route path="/viewproducts" element={<ViewProducts />} />
        <Route path="/deleteproducts" element={<DeleteProducts />} />
        <Route path="/editproducts" element={<EditProducts />} />
        <Route path="/addproducts" element={<AddProducts />} />
        <Route path="/usersoptions" element={<UsersOptions />} />
        <Route path="/viewusers" element={<ViewUsers />} />
        <Route path="/deleteusers" element={<DeleteUsers />} />
        <Route path="/editusers" element={<EditUsers />} />
        <Route path="/addusers" element={<AddUsers />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/usersignup" element={<UserSignUp />} />
        <Route path="/usersignin" element={<UserSignIn />} />
        <Route path="/passwordchange" element={<PasswordChange />} />
        <Route path="/userdelete" element={<UserDelete />} />
        <Route path="/home" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/notfound" element={<NotFound />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/ordersoptions" element={<OrdersOptions />} />
        <Route path="/vieworders" element={<ViewOrders />} />
        <Route path="/deleteorders" element={<DeleteOrders />} />
        <Route path="/editorders" element={<EditOrders />} />
        <Route path="/addorders" element={<AddOrders />} />

        {/* Catch all unknown paths */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;



