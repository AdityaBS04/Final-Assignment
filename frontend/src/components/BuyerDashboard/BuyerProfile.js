import React, { useEffect, useState } from "react";
import axios from "axios";

const BuyerProfilePage = () => {
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
        // Make API request to fetch user assignments
        const response = await axios.get(
          "http://99pcw0nqn9.execute-api.ap-south-1.amazonaws.com/api/assignments/user-assignments",
          {
            params: { email: userEmail },
          }
        );

        // Set assignments from API response
        setAssignments(response.data.assignments || []);
      } catch (error) {
        console.error("Error fetching assignments:", error);
        alert("Failed to fetch assignments. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  // Open PDF in a new tab
  const handleOpenPDF = (url) => {
    try {
      if (!url) {
        alert("The file URL is not available.");
        return;
      }

      // Decode and sanitize the URL
      const decodedUrl = decodeURIComponent(url); // Decode URL parts
      const sanitizedUrl = decodedUrl.startsWith("https://")
        ? decodedUrl
        : `https://${decodedUrl}`;

      // Open the sanitized URL in a new tab
      window.open(sanitizedUrl, "_blank");
    } catch (error) {
      console.error("Error opening the PDF:", error);
      alert("Failed to open the file. Please try again.");
    }
  };

  return (
    <div>
      <h1>My Purchased Assignments</h1>
      {isLoading ? (
        <p>Loading assignments...</p>
      ) : assignments.length > 0 ? (
        <ul>
          {assignments.map((assignment) => (
            <li key={assignment.assignmentId}>
              {assignment.assignmentName}{" "}
              <button
                onClick={() => handleOpenPDF(assignment.signedUrl)}
              >
                Open PDF
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No assignments found. Please purchase assignments to see them here.</p>
      )}
    </div>
  );
};

export default BuyerProfilePage;
