const express = require('express');
const router = express.Router();
const { createInquiry, getMyInquiries, getAllInquiries, updateInquiryStatus, deleteInquiry } = require('../controllers/inquiryController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', createInquiry);
router.get('/my', protect, getMyInquiries);
router.get('/all', protect, authorize('admin'), getAllInquiries);
router.put('/:id/status', protect, authorize('admin'), updateInquiryStatus);
router.delete('/:id', protect, authorize('admin'), deleteInquiry);

module.exports = router;
