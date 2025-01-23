import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BuyerHome = () => {
  const [semester, setSemester] = useState("");
  const [subject, setSubjectId] = useState("");
  const [assignments, setAssignments] = useState([]);
  const navigate = useNavigate();

  const userEmail = "buyer@example.com"; // Replace with logged-in user's email in a real app

  // Load the Razorpay script dynamically
  useEffect(() => {
    const loadRazorpayScript = () => {
      if (!document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => {
          console.log("Razorpay script loaded");
        };
        script.onerror = () => {
          console.error("Failed to load Razorpay script");
        };
        document.body.appendChild(script);
      }
    };

    loadRazorpayScript();
  }, []);

  const handleFetchAssignments = async () => {
    if (!semester || !subject) {
      alert("Please select both semester and subject.");
      return;
    }

    try {
      const response = await axios.get("https://pdut3urkc4.execute-api.ap-south-1.amazonaws.com/api/assignments/get-assignments", {
        params: { Semester: semester, SubjectId: subject },
      });
      setAssignments(response.data.assignments);
    } catch (error) {
      console.error("Error fetching assignments:", error.response?.data || error.message);
      alert("Failed to fetch assignments.");
    }
  };

  const handleBuyAssignment = async (assignmentId, price, assignmentName) => {
    try {
      // Check if Razorpay is available
      if (typeof window.Razorpay === "undefined") {
        alert("Razorpay SDK not loaded. Please refresh the page.");
        return;
      }

      // Create an order on the backend
      const orderResponse = await axios.post("http://localhost:5000/api/payment/create-order", {
        amount: price * 100, // Razorpay expects the amount in paise (INR * 100)
        assignmentId,
        assignmentName,
        userEmail,
      });

      const { order } = orderResponse.data;

      // Open Razorpay payment gateway
      const options = {
        key: "rzp_test_f0vYM20dHpb0QA", // Replace with your Razorpay Key ID
        amount: order.amount,
        currency: order.currency,
        name: "Assignment Purchase",
        description: `Purchase ${assignmentName}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            // Verify payment on the backend
            await axios.post("http://localhost:5000/api/payment/verify-payment", {
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              assignmentId,
              userEmail,
            });
            alert("Payment successful! Assignment purchased.");
            navigate("/dashboard"); // Redirect to user's dashboard
          } catch (error) {
            console.error("Error verifying payment:", error.response?.data || error.message);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          email: userEmail,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error during purchase:", error.response?.data || error.message);
      alert("Failed to initiate payment. Please try again.");
    }
  };

  return (
    <div>
      <h1>Buyer Dashboard</h1>
      <button onClick={() => navigate("/buyer-profile")}>Go to My Purchased Assignments</button>
      <div>
        <label>Semester:</label>
        <select value={semester} onChange={(e) => setSemester(e.target.value)}>
          <option value="">Select Semester</option>
          {/* Add semester options as needed */}
          <option value="1">Semester 1</option>
          <option value="2">Semester 2</option>
          <option value="3">Semester 3</option>
          <option value="4">Semester 4</option>
          <option value="6">Semester 6</option>
        </select>
      </div>
      <div>
        <label>Subject:</label>
        <select value={subject} onChange={(e) => setSubjectId(e.target.value)}>
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
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {assignments.map((assignment) => (
              <div
                key={assignment.assignmentId}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  margin: "10px",
                  width: "200px",
                }}
              >
                <h3>{assignment.assignmentName}</h3>
                <p>Price: ${assignment.price}</p>
                <button
                  onClick={() =>
                    handleBuyAssignment(assignment.assignmentId, assignment.price, assignment.assignmentName)
                  }
                >
                  Buy
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No assignments found for the selected subject.</p>
        )}
      </div>
    </div>
  );
};

export default BuyerHome;
