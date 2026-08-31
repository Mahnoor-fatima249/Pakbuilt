const jwt = require('jsonwebtoken');
const User = require('../backend/models/User');

function getToken(req) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
        return authHeader.split(' ')[1];
    }
    return null;
}

async function verifyAuth(req) {
    const token = getToken(req);
    if (!token) return null;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        return user;
    } catch (error) {
        return null;
    }
}

function isAdmin(user) {
    return user && user.role === 'admin';
}

module.exports = { verifyAuth, isAdmin };
