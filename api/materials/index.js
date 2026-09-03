const connectDB = require('../../lib/connectDB');
const MaterialRate = require('../../backend/models/MaterialRate');
const { verifyAuth, isAdmin } = require('../../lib/auth');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'https://mahnoor-fatima249.github.io');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try { await connectDB(); } catch (e) {
        return res.status(200).json({ success: true, count: 0, rates: [], message: 'Database not configured' });
    }

    const { action } = req.query;

    // GET /api/materials
    if (req.method === 'GET' && !action) {
        try {
            const { city, material } = req.query;
            let filter = {};
            if (city) filter.city = city;
            if (material) filter.material = material;
            const rates = await MaterialRate.find(filter).sort('material');
            return res.status(200).json({ success: true, count: rates.length, rates });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    // POST /api/materials?action=create (admin)
    if (req.method === 'POST' && action === 'create') {
        try {
            const user = await verifyAuth(req);
            if (!isAdmin(user)) return res.status(403).json({ success: false, message: 'Admin only' });
            const rate = await MaterialRate.create(req.body);
            return res.status(201).json({ success: true, rate });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    // PUT /api/materials?action=update&id=xxx (admin)
    if (req.method === 'PUT' && action === 'update') {
        try {
            const user = await verifyAuth(req);
            if (!isAdmin(user)) return res.status(403).json({ success: false, message: 'Admin only' });
            const { id } = req.query;
            const rate = await MaterialRate.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
            if (!rate) return res.status(404).json({ success: false, message: 'Not found' });
            return res.status(200).json({ success: true, rate });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    // DELETE /api/materials?action=delete&id=xxx (admin)
    if (req.method === 'DELETE' && action === 'delete') {
        try {
            const user = await verifyAuth(req);
            if (!isAdmin(user)) return res.status(403).json({ success: false, message: 'Admin only' });
            const { id } = req.query;
            await MaterialRate.findByIdAndDelete(id);
            return res.status(200).json({ success: true, message: 'Deleted' });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    // POST /api/materials?action=seed
    if (req.method === 'POST' && action === 'seed') {
        try {
            const defaultRates = [
                { material: 'cement', unit: 'per bag', priceMin: 1320, priceMax: 1400, city: 'lahore', brand: 'Fauji/Lucky', trend: 'stable', trendPercent: 0 },
                { material: 'cement', unit: 'per bag', priceMin: 1350, priceMax: 1420, city: 'karachi', brand: 'Bestway', trend: 'up', trendPercent: 1.2 },
                { material: 'steel', unit: 'per ton', priceMin: 275000, priceMax: 285000, city: 'lahore', brand: 'Amreli/Ittefaq', trend: 'up', trendPercent: 2.4 },
                { material: 'steel', unit: 'per ton', priceMin: 278000, priceMax: 288000, city: 'karachi', brand: 'Amreli', trend: 'up', trendPercent: 2.8 },
                { material: 'bricks', unit: 'per 1000', priceMin: 14000, priceMax: 16500, city: 'lahore', brand: 'Awal', trend: 'up', trendPercent: 1.5 },
                { material: 'bricks', unit: 'per 1000', priceMin: 13500, priceMax: 15500, city: 'karachi', brand: 'Awal', trend: 'stable', trendPercent: 0.3 },
                { material: 'sand', unit: 'per CFT', priceMin: 45, priceMax: 55, city: 'lahore', brand: 'Ravi/Chenab', trend: 'down', trendPercent: -0.8 },
                { material: 'sand', unit: 'per CFT', priceMin: 50, priceMax: 60, city: 'karachi', brand: 'Sindh', trend: 'stable', trendPercent: 0.2 }
            ];
            await MaterialRate.deleteMany({});
            const rates = await MaterialRate.insertMany(defaultRates);
            return res.status(200).json({ success: true, message: `${rates.length} rates seeded`, rates });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    return res.status(400).json({ success: false, message: 'Invalid action' });
};
