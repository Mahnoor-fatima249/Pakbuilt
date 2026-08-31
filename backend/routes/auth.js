const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, saveProject, getSavedProjects } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/save-project', protect, saveProject);
router.get('/saved-projects', protect, getSavedProjects);

module.exports = router;
