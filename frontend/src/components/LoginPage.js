import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "buyer", // Default role set to Buyer
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://99pcw0nqn9.execute-api.ap-south-1.amazonaws.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: formData.role, // Role is sent based on user selection
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);

        // Store user data in localStorage for future use
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", formData.email); // Store the email from formData
        localStorage.setItem("name", data.name);

        // Navigate based on role (admin or buyer)
        if (formData.role === "admin") navigate("/admin-home");
        else navigate("/buyer");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="buyer">Buyer</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default Login;
