import React from "react";
import './AdminHome.css';

const AdminHome = ({ showAssignments }) => {
  const subjects = ["Science", "Math", "Social", "English", "Hindi"];
  return (
    <div>
      <h2>Main Subjects</h2>
      <ul>
        {subjects.map((subject) => (
          <li key={subject} onClick={() => showAssignments(subject)}>
            {subject}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminHome;
