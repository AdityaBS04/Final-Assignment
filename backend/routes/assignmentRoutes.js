const express = require("express");
const { getAssignments } = require("../controllers/assignmentController");
const router = express.Router();

// Route to fetch assignments by semester and subject
router.get("/get-assignments", getAssignments);

module.exports = router;
