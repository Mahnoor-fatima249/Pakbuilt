const express = require('express');
const router = express.Router();
const { getRates, createRate, updateRate, deleteRate, seedRates } = require('../controllers/materialController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getRates);
router.post('/', protect, authorize('admin'), createRate);
router.put('/:id', protect, authorize('admin'), updateRate);
router.delete('/:id', protect, authorize('admin'), deleteRate);
router.post('/seed', seedRates);

module.exports = router;
