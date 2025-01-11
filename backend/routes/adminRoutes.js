const express = require("express");
const { addAssignmentWithFile, getAssignments, upload } = require("../controllers/adminController");

const router = express.Router();


router.post("/add-assignment", upload.single("file"), addAssignmentWithFile);
router.get("/get-assignments", getAssignments);

module.exports = router;
