const express = require("express");
const { addAssignment } = require("../controllers/adminController");

const router = express.Router();

// Route to add an assignment
router.post("/add-assignment", addAssignment);

module.exports = router;
