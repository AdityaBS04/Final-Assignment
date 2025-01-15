import React, { useEffect, useState } from "react";
import axios from "axios";
import { Document, Page, pdfjs } from "react-pdf";

// Configure PDF.js worker using the CDN
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.min.js`;

const BuyerProfilePage = () => {
  const [assignments, setAssignments] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);

  // Fetch user assignments on component mount
  useEffect(() => {
    const fetchAssignments = async () => {
      const userEmail = localStorage.getItem("email"); // Retrieve email from localStorage

      if (!userEmail) {
        console.error("Email not found in localStorage.");
        alert("Email is not available.");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/api/assignments/user-assignments",
          {
            params: { email: userEmail },
          }
        );
        setAssignments(response.data.assignments);
      } catch (error) {
        console.error("Error fetching assignments:", error);
        alert("Failed to fetch assignments.");
      }
    };
    fetchAssignments();
  }, []);

  const handleViewPDF = (url) => {
    setSelectedPdf(url);
  };

  return (
    <div>
      <h1>My Purchased Assignments</h1>
      <div>
        {assignments.length > 0 ? (
          <ul>
            {assignments.map((assignment) => (
              <li key={assignment.assignmentId}>
                {assignment.assignmentName}{" "}
                <button onClick={() => handleViewPDF(assignment.signedUrl)}>
                  View PDF
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No assignments found.</p>
        )}
      </div>
      {selectedPdf && (
        <div>
          <h2>PDF Viewer</h2>
          <div
            style={{
              width: "600px",
              height: "800px",
              border: "1px solid black",
              overflow: "hidden",
            }}
          >
            <Document
              file={{
                url: selectedPdf,
                httpHeaders: {
                  // If required, pass additional headers for signed URLs
                  Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                },
              }}
              onLoadError={(error) => console.error("Error loading PDF:", error)}
            >
              <Page pageNumber={1} />
            </Document>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerProfilePage;
