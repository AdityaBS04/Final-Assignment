import React from "react";
import { Link } from "react-router-dom";
import './BuyerHome.css';

const BuyerHome = () => {
  const subjects = ["Science", "Math", "Social", "English", "Hindi"];

  const handleSubjectClick = (subject) => {
    console.log(`Buyer clicked on ${subject}`);
    // Navigate to the assignments available for purchase
  };

  return (
    <div>
      <nav className="navbar">
        <h1 className="navbar-brand">AssignSell</h1>
        <ul className="navbar-links">
          <li><Link to="/buyer-home">Home</Link></li>
          <li><Link to="/buyer-profile">Profile</Link></li>
        </ul>
      </nav>
      <h2>Buyer Dashboard</h2>
      <h3>Subjects</h3>
      <div>
        {subjects.map((subject) => (
          <button
            key={subject}
            onClick={() => handleSubjectClick(subject)}
            style={{ margin: "10px", padding: "10px" }}
          >
            {subject}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BuyerHome;

