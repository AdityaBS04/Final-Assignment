const express = require('express');
const { getAssignments, purchaseAssignment } = require('../controllers/assignmentController');
const router = express.Router();

router.get('/get-assignments', getAssignments);
router.post('/purchase-assignment', purchaseAssignment);

module.exports = router;
