const MaterialRate = require('../models/MaterialRate');

exports.getRates = async (req, res) => {
    try {
        const { city, material } = req.query;
        let filter = {};
        if (city) filter.city = city;
        if (material) filter.material = material;

        const rates = await MaterialRate.find(filter).sort('material');
        res.status(200).json({ success: true, count: rates.length, rates });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createRate = async (req, res) => {
    try {
        const rate = await MaterialRate.create(req.body);
        res.status(201).json({ success: true, rate });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateRate = async (req, res) => {
    try {
        const rate = await MaterialRate.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!rate) {
            return res.status(404).json({ success: false, message: 'Rate not found' });
        }
        res.status(200).json({ success: true, rate });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteRate = async (req, res) => {
    try {
        const rate = await MaterialRate.findByIdAndDelete(req.params.id);
        if (!rate) {
            return res.status(404).json({ success: false, message: 'Rate not found' });
        }
        res.status(200).json({ success: true, message: 'Rate deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.seedRates = async (req, res) => {
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
        res.status(200).json({ success: true, message: `${rates.length} rates seeded`, rates });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
