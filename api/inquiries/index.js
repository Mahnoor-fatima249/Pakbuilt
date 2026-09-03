const connectDB = require('../../lib/connectDB');
const Inquiry = require('../../backend/models/Inquiry');
const { verifyAuth, isAdmin } = require('../../lib/auth');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'https://mahnoor-fatima249.github.io');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try { await connectDB(); } catch (e) {
        return res.status(503).json({
            success: false,
            message: 'Inquiries require database connection. Please configure MONGODB_URI in Vercel environment variables.'
        });
    }

    const { action } = req.query;

    // POST /api/inquiries?action=create
    if (req.method === 'POST' && action === 'create') {
        try {
            const user = await verifyAuth(req);
            const inquiry = await Inquiry.create({
                user: user ? user._id : undefined,
                ...req.body
            });
            return res.status(201).json({ success: true, inquiry });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    // GET /api/inquiries?action=my
    if (req.method === 'GET' && action === 'my') {
        try {
            const user = await verifyAuth(req);
            if (!user) return res.status(401).json({ success: false, message: 'Not authorized' });
            const inquiries = await Inquiry.find({ user: user._id }).sort('-createdAt');
            return res.status(200).json({ success: true, inquiries });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    // GET /api/inquiries?action=all (admin)
    if (req.method === 'GET' && action === 'all') {
        try {
            const user = await verifyAuth(req);
            if (!isAdmin(user)) return res.status(403).json({ success: false, message: 'Admin only' });
            const inquiries = await Inquiry.find().populate('user', 'name email').sort('-createdAt');
            return res.status(200).json({ success: true, count: inquiries.length, inquiries });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    // PUT /api/inquiries?action=status&id=xxx
    if (req.method === 'PUT' && action === 'status') {
        try {
            const user = await verifyAuth(req);
            if (!isAdmin(user)) return res.status(403).json({ success: false, message: 'Admin only' });
            const { id } = req.query;
            const inquiry = await Inquiry.findByIdAndUpdate(id, { status: req.body.status, adminNotes: req.body.adminNotes }, { new: true });
            if (!inquiry) return res.status(404).json({ success: false, message: 'Not found' });
            return res.status(200).json({ success: true, inquiry });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    // DELETE /api/inquiries?action=delete&id=xxx
    if (req.method === 'DELETE' && action === 'delete') {
        try {
            const user = await verifyAuth(req);
            if (!isAdmin(user)) return res.status(403).json({ success: false, message: 'Admin only' });
            const { id } = req.query;
            await Inquiry.findByIdAndDelete(id);
            return res.status(200).json({ success: true, message: 'Deleted' });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    return res.status(400).json({ success: false, message: 'Invalid action' });
};
