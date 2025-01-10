const express = require("express");
const { createOrder } = require("../controllers/paymentController");

const router = express.Router();

// Route to create a Razorpay order
router.post("/create-order", createOrder);

module.exports = router;
