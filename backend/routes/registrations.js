const express = require('express');
const router = express.Router();
const { registerForEvent } = require('../controllers/registrationsController');
const { verifyToken } = require('../middleware/auth');

router.post('/register', verifyToken, registerForEvent);

module.exports = router;