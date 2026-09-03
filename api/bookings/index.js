const connectDB = require('../../lib/connectDB');
const Booking = require('../../backend/models/Booking');
const { verifyAuth, isAdmin } = require('../../lib/auth');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'https://mahnoor-fatima249.github.io');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try { await connectDB(); } catch (e) {
        return res.status(503).json({
            success: false,
            message: 'Bookings require database connection. Please configure MONGODB_URI in Vercel environment variables.'
        });
    }

    const { action } = req.query;

    // POST /api/bookings?action=create
    if (req.method === 'POST' && action === 'create') {
        try {
            const user = await verifyAuth(req);
            const booking = await Booking.create({
                user: user ? user._id : undefined,
                ...req.body
            });
            return res.status(201).json({ success: true, booking });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    // GET /api/bookings?action=my
    if (req.method === 'GET' && action === 'my') {
        try {
            const user = await verifyAuth(req);
            if (!user) return res.status(401).json({ success: false, message: 'Not authorized' });
            const bookings = await Booking.find({ user: user._id }).sort('-createdAt');
            return res.status(200).json({ success: true, bookings });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    // GET /api/bookings?action=all (admin)
    if (req.method === 'GET' && action === 'all') {
        try {
            const user = await verifyAuth(req);
            if (!isAdmin(user)) return res.status(403).json({ success: false, message: 'Admin only' });
            const bookings = await Booking.find().populate('user', 'name email').sort('-createdAt');
            return res.status(200).json({ success: true, count: bookings.length, bookings });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    // PUT /api/bookings?action=status&id=xxx
    if (req.method === 'PUT' && action === 'status') {
        try {
            const user = await verifyAuth(req);
            if (!isAdmin(user)) return res.status(403).json({ success: false, message: 'Admin only' });
            const { id } = req.query;
            const booking = await Booking.findByIdAndUpdate(id, { status: req.body.status }, { new: true });
            if (!booking) return res.status(404).json({ success: false, message: 'Not found' });
            return res.status(200).json({ success: true, booking });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    // DELETE /api/bookings?action=delete&id=xxx
    if (req.method === 'DELETE' && action === 'delete') {
        try {
            const user = await verifyAuth(req);
            if (!isAdmin(user)) return res.status(403).json({ success: false, message: 'Admin only' });
            const { id } = req.query;
            await Booking.findByIdAndDelete(id);
            return res.status(200).json({ success: true, message: 'Deleted' });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    return res.status(400).json({ success: false, message: 'Invalid action' });
};
