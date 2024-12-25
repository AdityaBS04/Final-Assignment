import React from "react";
import './SellerHome.css';

const SellerHome = () => {
  const subjects = ["Science", "Math", "Social", "English", "Hindi"];
  return (
    <div>
      <h2>Select a Subject to Sell Assignments</h2>
      <ul>
        {subjects.map((subject) => (
          <li key={subject}>{subject}</li>
        ))}
      </ul>
    </div>
  );
};

export default SellerHome;
