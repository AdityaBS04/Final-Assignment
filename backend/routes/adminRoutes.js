const express = require("express");
const { addAssignmentWithFile, getAssignments, upload } = require("../controllers/adminController");

const router = express.Router();

// Route to add assignments with file upload
router.post("/add-assignment", upload.single("file"), addAssignmentWithFile);

// Route to fetch assignments by semester and subject
router.get("/get-assignments", getAssignments);

module.exports = router;
