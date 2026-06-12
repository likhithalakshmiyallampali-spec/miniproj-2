const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfileData } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');
const { validateRegistration } = require('../middleware/validationMiddleware');

router.post('/register', validateRegistration, registerUser);
router.post('/login', loginUser);
router.get('/profile', verifyToken, getProfileData);

module.exports = router;