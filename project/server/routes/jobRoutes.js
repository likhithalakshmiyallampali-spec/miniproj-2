const express = require('express');
const router = express.Router();
const { getAllJobs, getRecruiterMetrics, createJobPosting, updateJobPosting, deleteJobPosting, saveJobAction, removeSavedJobAction } = require('../controllers/jobController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');
const { validateJobInput } = require('../middleware/validationMiddleware');

router.get('/', getAllJobs);
router.get('/recruiter/metrics', verifyToken, checkRole('Recruiter'), getRecruiterMetrics);
router.post('/', verifyToken, checkRole('Recruiter'), validateJobInput, createJobPosting);
router.put('/:id', verifyToken, checkRole('Recruiter'), validateJobInput, updateJobPosting);
router.delete('/:id', verifyToken, checkRole('Recruiter'), deleteJobPosting);

router.post('/:id/save', verifyToken, checkRole('Candidate'), saveJobAction);
router.delete('/:id/save', verifyToken, checkRole('Candidate'), removeSavedJobAction);

module.exports = router;