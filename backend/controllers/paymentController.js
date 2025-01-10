const Razorpay = require("razorpay");
const dotenv = require("dotenv");

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Controller function to create an order
const createOrder = async (req, res) => {
  try {
    const { amount } = req.body; // Amount in paise (e.g., ₹100 = 10000 paise)

    const options = {
      amount: amount, // Amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({ order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
};

module.exports = {
  createOrder,
};
