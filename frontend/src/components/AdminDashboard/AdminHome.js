import React, { useState } from "react";
import axios from "axios";

const AdminHome = () => {
  const [Semester, setSemester] = useState(""); // Kept as `Semester`
  const [SubjectId, setSubjectId] = useState(""); // Kept as `SubjectId`
  const [assignment, setAssignment] = useState("");
  const [price, setPrice] = useState("");

  const handleAddAssignment = async () => {
    if (!Semester || !SubjectId || !assignment || !price) {
      alert("All fields are required.");
      return;
    }

    const requestData = { Semester, SubjectId, assignment, price };

    console.log("Sending request data:", requestData);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/add-assignment",
        requestData
      );
      console.log("Response from server:", response.data);
      alert(response.data.message);
      setSemester("");
      setSubjectId("");
      setAssignment("");
      setPrice("");
    } catch (error) {
      console.error(
        "Error adding assignment:",
        error.response ? error.response.data : error.message
      );
      alert(error.response?.data?.error || "Failed to add assignment.");
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div>
        <label>Semester:</label>
        <select value={Semester} onChange={(e) => setSemester(e.target.value)}>
          <option value="">Select Semester</option>
          <option value="1">Semester 1</option>
          <option value="2">Semester 2</option>
        </select>
      </div>
      <div>
        <label>Subject:</label>
        <select
          value={SubjectId}
          onChange={(e) => setSubjectId(e.target.value)}
        >
          <option value="">Select Subject</option>
          {Semester === "1" && (
            <>
              <option value="Maths1">Maths1</option>
              <option value="Physics">Physics</option>
            </>
          )}
          {Semester === "2" && (
            <>
              <option value="Maths2">Maths2</option>
              <option value="Chemistry">Chemistry</option>
            </>
          )}
        </select>
      </div>
      <div>
        <label>Assignment:</label>
        <input
          type="text"
          value={assignment}
          onChange={(e) => setAssignment(e.target.value)}
        />
      </div>
      <div>
        <label>Price:</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      <button onClick={handleAddAssignment}>Add Assignment</button>
    </div>
  );
};

export default AdminHome;
