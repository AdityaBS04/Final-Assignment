import React from "react";
import { useNavigate } from "react-router-dom";
import './MainPage.css';


const MainPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Welcome to AssignSell</h1>
      <button onClick={() => navigate("/signup")}>Sign Up</button>
      <button onClick={() => navigate("/login")}>Log In</button>
    </div>
  );
};

export default MainPage;
