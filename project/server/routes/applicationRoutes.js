const express = require('express');
const router = express.Router();
const { submitCandidateApplication, getApplicationsByListing, getCandidateApplications } = require('../controllers/applicationController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

router.post('/:id/apply', verifyToken, checkRole('Candidate'), submitCandidateApplication);
router.get('/:id/applications', verifyToken, checkRole('Recruiter'), getApplicationsByListing);
router.get('/candidate/history', verifyToken, checkRole('Candidate'), getCandidateApplications);

module.exports = router;