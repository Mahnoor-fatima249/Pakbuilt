const connectDB = require('../../lib/connectDB');
const User = require('../../backend/models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        await connectDB();
    } catch (error) {
        return res.status(503).json({
            success: false,
            message: 'Authentication requires database connection. Please configure MONGODB_URI in Vercel environment variables.'
        });
    }

    const { action } = req.query;

    // POST /api/auth?action=register
    if (req.method === 'POST' && action === 'register') {
        try {
            const { name, email, phone, password } = req.body;
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ success: false, message: 'Email already registered' });
            }
            const user = await User.create({ name, email, phone, password });
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
            return res.status(201).json({
                success: true, token,
                user: { id: user._id, name: user.name, email: user.email, phone: user.phone || '', role: user.role }
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    // POST /api/auth?action=login
    if (req.method === 'POST' && action === 'login') {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ success: false, message: 'Provide email and password' });
            }
            const user = await User.findOne({ email }).select('+password');
            if (!user) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
            return res.status(200).json({
                success: true, token,
                user: { id: user._id, name: user.name, email: user.email, phone: user.phone || '', role: user.role }
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    // PUT /api/auth?action=update-phone
    if (req.method === 'PUT' && action === 'update-phone') {
        try {
            const { verifyAuth } = require('../../lib/auth');
            const user = await verifyAuth(req);
            if (!user) return res.status(401).json({ success: false, message: 'Not authorized' });
            const { phone } = req.body;
            if (!phone) return res.status(400).json({ success: false, message: 'Phone number required' });
            user.phone = phone;
            await user.save();
            return res.status(200).json({ success: true, phone: user.phone, message: 'Phone number updated successfully' });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    // GET /api/auth?action=me
    if (req.method === 'GET' && action === 'me') {
        try {
            const { verifyAuth } = require('../../lib/auth');
            const user = await verifyAuth(req);
            if (!user) return res.status(401).json({ success: false, message: 'Not authorized' });
            return res.status(200).json({ success: true, user });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    // POST /api/auth?action=save-project
    if (req.method === 'POST' && action === 'save-project') {
        try {
            const { verifyAuth } = require('../../lib/auth');
            const user = await verifyAuth(req);
            if (!user) return res.status(401).json({ success: false, message: 'Not authorized' });
            user.savedProjects.push(req.body);
            await user.save();
            return res.status(200).json({ success: true, savedProjects: user.savedProjects });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    // GET /api/auth?action=saved-projects
    if (req.method === 'GET' && action === 'saved-projects') {
        try {
            const { verifyAuth } = require('../../lib/auth');
            const user = await verifyAuth(req);
            if (!user) return res.status(401).json({ success: false, message: 'Not authorized' });
            return res.status(200).json({ success: true, savedProjects: user.savedProjects });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    return res.status(400).json({ success: false, message: 'Invalid action' });
};
