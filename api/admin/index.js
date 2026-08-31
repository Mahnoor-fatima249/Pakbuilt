const connectDB = require('../../lib/connectDB');
const User = require('../../backend/models/User');
const Booking = require('../../backend/models/Booking');
const Inquiry = require('../../backend/models/Inquiry');
const { verifyAuth, isAdmin } = require('../../lib/auth');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try { await connectDB(); } catch (e) {
        return res.status(500).json({ success: false, message: 'Database connection failed' });
    }

    const { action } = req.query;

    // GET /api/admin?action=dashboard
    if (req.method === 'GET' && action === 'dashboard') {
        try {
            const user = await verifyAuth(req);
            if (!isAdmin(user)) return res.status(403).json({ success: false, message: 'Admin only' });

            const totalUsers = await User.countDocuments();
            const totalBookings = await Booking.countDocuments();
            const pendingBookings = await Booking.countDocuments({ status: 'pending' });
            const totalInquiries = await Inquiry.countDocuments();
            const newInquiries = await Inquiry.countDocuments({ status: 'new' });
            const recentBookings = await Booking.find().populate('user', 'name email').sort('-createdAt').limit(5);
            const recentInquiries = await Inquiry.find().populate('user', 'name email').sort('-createdAt').limit(5);

            return res.status(200).json({
                success: true,
                stats: { totalUsers, totalBookings, pendingBookings, totalInquiries, newInquiries },
                recentBookings, recentInquiries
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    // GET /api/admin?action=users
    if (req.method === 'GET' && action === 'users') {
        try {
            const user = await verifyAuth(req);
            if (!isAdmin(user)) return res.status(403).json({ success: false, message: 'Admin only' });
            const users = await User.find().sort('-createdAt');
            return res.status(200).json({ success: true, count: users.length, users });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    // DELETE /api/admin?action=deleteUser&id=xxx
    if (req.method === 'DELETE' && action === 'deleteUser') {
        try {
            const user = await verifyAuth(req);
            if (!isAdmin(user)) return res.status(403).json({ success: false, message: 'Admin only' });
            const { id } = req.query;
            await User.findByIdAndDelete(id);
            return res.status(200).json({ success: true, message: 'User deleted' });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    return res.status(400).json({ success: false, message: 'Invalid action' });
};
