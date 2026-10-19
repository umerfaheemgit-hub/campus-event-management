const express = require('express');
const router = express.Router();
const { getAllEvents, getEventById, createEvent, updateEvent } = require('../controllers/eventsController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.post('/', verifyToken, requireAdmin, createEvent);
router.put('/:id', verifyToken, requireAdmin, updateEvent);

module.exports = router;