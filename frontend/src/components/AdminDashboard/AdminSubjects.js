import React, { useState } from "react";

const AdminSubjects = () => {
  const [semester, setSemester] = useState(1);
  const [subjectName, setSubjectName] = useState("");
  const [subjects, setSubjects] = useState([]);

  const fetchSubjects = async () => {
    try {
      const response = await fetch(`/api/admin/subjects/${semester}`);
      const data = await response.json();
      setSubjects(data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const addSubject = async () => {
    try {
      const response = await fetch("/api/admin/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          semester,
          subjectId: subjectName.replace(/\s+/g, "_").toUpperCase(),
          subjectName,
        }),
      });

      if (response.ok) {
        fetchSubjects();
        setSubjectName("");
      } else {
        alert("Failed to add subject");
      }
    } catch (error) {
      console.error("Error adding subject:", error);
    }
  };

  return (
    <div>
      <h1>Manage Subjects</h1>
      <label>Semester:</label>
      <select onChange={(e) => setSemester(Number(e.target.value))}>
        {[1, 2].map((sem) => (
          <option key={sem} value={sem}>
            Semester {sem}
          </option>
        ))}
      </select>
      <button onClick={fetchSubjects}>Load Subjects</button>

      <h3>Add Subject</h3>
      <input
        type="text"
        value={subjectName}
        onChange={(e) => setSubjectName(e.target.value)}
        placeholder="Enter Subject Name"
      />
      <button onClick={addSubject}>Add Subject</button>

      <h3>Subjects</h3>
      <ul>
        {subjects.map((subject) => (
          <li key={subject.subjectId}>{subject.subjectName}</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSubjects;
