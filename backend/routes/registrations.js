const express = require('express');
const router = express.Router();
const { registerForEvent, getRegistrations } = require('../controllers/registrationsController');
const { verifyToken } = require('../middleware/auth');

router.post('/register', verifyToken, registerForEvent);
router.get('/registrations', verifyToken, getRegistrations);

module.exports = router;