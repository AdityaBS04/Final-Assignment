import React, { useState } from "react";
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
          <option value="3">Semester 3</option>
          <option value="4">Semester 4</option>
          <option value="6">Semester 6</option>
        </select>
      </div>
      <div>
        <label>Subject:</label>
        <select value={subject} onChange={(e) => setSubject(e.target.value)}>
          <option value="">Select Subject</option>
          {semester === "1" && (
            <>
            <option value="Maths1">Maths1</option>
            <option value="EPD">EPD</option>
            <option value="Mechanics">Mechanical</option>
            <option value="Python">Python</option>
            <option value="Physics">Physics</option>
            </>
          )}
          {semester === "2" && (
            <>
              <option value="Maths2">Maths2</option>
              <option value="EEE">EEE</option>
              <option value="Mechanical">Mechanical</option>
              <option value="C">C</option>
              <option value="Chemistry">Chemistry</option>
            </>
          )}
          {semester === "3" && (
            <>
              <option value="Statistics">SDS</option>
              <option value="Automata and Formal Language">Automata and Formal Language</option>
              <option value="Data Structures">Data Structures</option>
              <option value="Digital Design and Componenets">Digital Design and Componenets</option>
              <option value="Web Technology">Web Tech</option>
            </>
          )}
          {semester === "4" && (
            <>
              <option value="Linear Algebra">Linear Algebra</option>
              <option value="Data Algorithms">Data Algorithms</option>
              <option value="Operating System">Operating System</option>
              <option value="MicroProcessor and Architecture">MicroProcessor and Architecture</option>
              <option value="Computer Networks">Computer Networks</option>
            </>
          )}
          {semester === "6" && (
            <>
              <option value="Cloud Computing">Cloud Computing</option>
              <option value="OOPS">OOPS</option>
              <option value="Complier Design">Complier Design</option>
              <option value="Elective1">Elective1</option>
              <option value="Elective2">Elective2</option>
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
