import React, { useState, useEffect } from "react";

const AdminAssignments = () => {
  const [semester, setSemester] = useState(1);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [assignmentName, setAssignmentName] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch(`/api/admin/subjects/${semester}`);
        const data = await response.json();
        setSubjects(data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchSubjects();
  }, [semester]);

  const addAssignment = async () => {
    if (!selectedSubject) return alert("Select a subject first");
    try {
      const response = await fetch("/api/admin/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          semester,
          subjectId: selectedSubject.subjectId,
          assignmentName,
          price,
        }),
      });

      if (response.ok) {
        alert("Assignment added successfully");
        setAssignmentName("");
        setPrice("");
      } else {
        alert("Failed to add assignment");
      }
    } catch (error) {
      console.error("Error adding assignment:", error);
    }
  };

  return (
    <div>
      <h1>Manage Assignments</h1>
      <label>Semester:</label>
      <select onChange={(e) => setSemester(Number(e.target.value))}>
        {[1, 2].map((sem) => (
          <option key={sem} value={sem}>
            Semester {sem}
          </option>
        ))}
      </select>

      <div>
        <h3>Subjects</h3>
        <ul>
          {subjects.map((subject) => (
            <li
              key={subject.subjectId}
              onClick={() => setSelectedSubject(subject)}
              style={{ cursor: "pointer" }}
            >
              {subject.subjectName}
            </li>
          ))}
        </ul>
      </div>

      {selectedSubject && (
        <div>
          <h3>Add Assignment to {selectedSubject.subjectName}</h3>
          <input
            type="text"
            placeholder="Assignment Name"
            value={assignmentName}
            onChange={(e) => setAssignmentName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <button onClick={addAssignment}>Add Assignment</button>
        </div>
      )}
    </div>
  );
};

export default AdminAssignments;
