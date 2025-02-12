const express = require('express');
const { getAssignments, purchaseAssignment,fetchUserAssignments } = require('../controllers/assignmentController');
const { createOrder } = require("../controllers/assignmentController");
const router = express.Router();


router.get('/get-assignments', getAssignments);
router.post('/purchase-assignment', purchaseAssignment);
router.post("/create-order", createOrder);
router.get("/user-assignments", fetchUserAssignments);


module.exports = router;
