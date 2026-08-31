const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Booking = require('../models/Booking');
const Inquiry = require('../models/Inquiry');
const { protect, authorize } = require('../middleware/auth');

router.get('/dashboard', protect, authorize('admin'), async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalBookings = await Booking.countDocuments();
        const pendingBookings = await Booking.countDocuments({ status: 'pending' });
        const totalInquiries = await Inquiry.countDocuments();
        const newInquiries = await Inquiry.countDocuments({ status: 'new' });

        const recentBookings = await Booking.find().populate('user', 'name email').sort('-createdAt').limit(5);
        const recentInquiries = await Inquiry.find().populate('user', 'name email').sort('-createdAt').limit(5);

        res.status(200).json({
            success: true,
            stats: { totalUsers, totalBookings, pendingBookings, totalInquiries, newInquiries },
            recentBookings,
            recentInquiries
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/users', protect, authorize('admin'), async (req, res) => {
    try {
        const users = await User.find().sort('-createdAt');
        res.status(200).json({ success: true, count: users.length, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.delete('/users/:id', protect, authorize('admin'), async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
