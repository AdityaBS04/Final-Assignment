import React, { useState, useEffect } from "react";
import axios from "axios";

const BuyerHome = () => {
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [assignments, setAssignments] = useState([]);

  const handleFetchAssignments = async () => {
    if (!semester || !subject) {
      alert("Please select both semester and subject.");
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/api/assignments/get-assignments", {
        params: { Semester: semester, SubjectId: subject },
      });
      setAssignments(response.data.assignments);
    } catch (error) {
      console.error("Error fetching assignments:", error.response?.data || error.message);
      alert("Failed to fetch assignments.");
    }
  };

  return (
    <div>
      <h1>Buyer Dashboard</h1>
      <div>
        <label>Semester:</label>
        <select value={semester} onChange={(e) => setSemester(e.target.value)}>
          <option value="">Select Semester</option>
          <option value="1">Semester 1</option>
          <option value="2">Semester 2</option>
        </select>
      </div>
      <div>
        <label>Subject:</label>
        <select value={subject} onChange={(e) => setSubject(e.target.value)}>
          <option value="">Select Subject</option>
          {semester === "1" && (
            <>
              <option value="Maths1">Maths1</option>
              <option value="Physics">Physics</option>
            </>
          )}
          {semester === "2" && (
            <>
              <option value="Maths2">Maths2</option>
              <option value="Chemistry">Chemistry</option>
            </>
          )}
        </select>
      </div>
      <button onClick={handleFetchAssignments}>Fetch Assignments</button>

      <div>
        <h2>Assignments</h2>
        {assignments.length > 0 ? (
          <ul>
            {assignments.map((assignment, index) => (
              <li key={index}>
                <strong>{assignment.assignment}</strong> - ${assignment.price}
              </li>
            ))}
          </ul>
        ) : (
          <p>No assignments found for the selected subject.</p>
        )}
      </div>
    </div>
  );
};

export default BuyerHome;
