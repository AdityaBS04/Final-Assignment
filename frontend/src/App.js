import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./components/MainPage";
import SignupPage from "./components/SignupPage";
import LoginPage from "./components/LoginPage";
import AdminHome from "./components/AdminDashboard/AdminHome";
import AdminAnalytics from "./components/AdminDashboard/AdminAnalytics";
import AdminProfile from "./components/AdminDashboard/AdminProfile";
import SellerHome from "./components/SellerDashboard/SellerHome";
import SellerProfile from "./components/SellerDashboard/SellerProfile";
import BuyerHome from "./components/BuyerDashboard/BuyerHome";
import BuyerProfile from "./components/BuyerDashboard/BuyerProfile";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Main Page */}
        <Route path="/" element={<MainPage />} />
        
        {/* Authentication Pages */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Admin Dashboard Pages */}
        <Route path="/admin-home" element={<AdminHome />} />
        <Route path="/admin-analytics" element={<AdminAnalytics />} />
        <Route path="/admin-profile" element={<AdminProfile />} />
        
        {/* Seller Dashboard Pages */}
        <Route path="/seller-home" element={<SellerHome />} />
        <Route path="/seller-profile" element={<SellerProfile />} />
        
        {/* Buyer Dashboard Pages */}
        <Route path="/buyer-home" element={<BuyerHome />} />
        <Route path="/buyer-profile" element={<BuyerProfile />} />
      </Routes>
    </Router>
  );
};

export default App;
