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
          {Semester === "1" && (
            <>
              <option value="Maths1">Maths1</option>
              <option value="EPD">EPD</option>
              <option value="Mechanics">Mechanical</option>
              <option value="Python">Python</option>
              <option value="Physics">Physics</option>
            </>
          )}
          {Semester === "2" && (
            <>
              <option value="Maths2">Maths2</option>
              <option value="EEE">EEE</option>
              <option value="Mechanical">Mechanical</option>
              <option value="C">C</option>
              <option value="Chemistry">Chemistry</option>
            </>
          )}
          {Semester === "3" && (
            <>
              <option value="Statistics">SDS</option>
              <option value="Automata and Formal Language">Automata and Formal Language</option>
              <option value="Data Structures">Data Structures</option>
              <option value="Digital Design and Componenets">Digital Design and Componenets</option>
              <option value="Web Technology">Web Tech</option>
            </>
          )}
          {Semester === "4" && (
            <>
              <option value="Linear Algebra">Linear Algebra</option>
              <option value="Data Algorithms">Data Algorithms</option>
              <option value="Operating System">Operating System</option>
              <option value="MicroProcessor and Architecture">MicroProcessor and Architecture</option>
              <option value="Computer Networks">Computer Networks</option>
            </>
          )}
          {Semester === "6" && (
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
      <div>
        <label>Assignment:</label>
        <input
          type="text"
          value={assignment}
          onChange={(e) => setAssignment(e.target.value)}
        />
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
