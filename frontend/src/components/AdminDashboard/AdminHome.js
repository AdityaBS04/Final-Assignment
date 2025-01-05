import React, { useState } from "react";
import axios from "axios";

const AdminHome = () => {
  const [Semester, setSemester] = useState("");
  const [SubjectId, setSubjectId] = useState("");
  const [assignment, setAssignment] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState(null);

  const handleAddAssignment = async () => {
    if (!Semester || !SubjectId || !assignment || !price || !file) {
      alert("All fields and a file are required.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("Semester", Semester);
      formData.append("SubjectId", SubjectId);
      formData.append("assignment", assignment);
      formData.append("price", price);
      formData.append("file", file);

      const response = await axios.post(
        "http://localhost:5000/api/admin/add-assignment",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(response.data.message);
      setSemester("");
      setSubjectId("");
      setAssignment("");
      setPrice("");
      setFile(null);
    } catch (error) {
      console.error(
        "Error adding assignment:",
        error.response ? error.response.data : error.message
      );
      alert(error.response?.data?.message || "Failed to add assignment.");
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
          <option value="3">Semester 3</option>
          <option value="4">Semester 4</option>
          <option value="6">Semester 6</option>
        </select>
      </div>
      <div>
        <label>Subject:</label>
        <select
          value={SubjectId}
          onChange={(e) => setSubjectId(e.target.value)}
        >
          <option value="">Select Subject</option>
          {/* Add subject options dynamically as needed */}
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
      <div>
        <label>Upload File:</label>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      </div>
      <button onClick={handleAddAssignment}>Add Assignment</button>
    </div>
  );
};

export default AdminHome;
