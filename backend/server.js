const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/bookings', require('./routes/booking'));
app.use('/api/inquiries', require('./routes/inquiry'));
app.use('/api/materials', require('./routes/material'));
app.use('/api/admin', require('./routes/admin'));

app.get('/api/calculate', (req, res) => {
    try {
        const { plotSize, constructionType, city, floors } = req.query;
        const marlaSize = parseInt(plotSize) || 5;
        const cityVal = city || 'lahore';
        const floorsVal = parseInt(floors) || 2;
        const quality = constructionType || 'a_category';

        let sqft = marlaSize * 225 * floorsVal;
        let cityMultiplier = 1.0;
        if (cityVal === 'islamabad' || cityVal === 'rawalpindi') cityMultiplier = 1.08;
        if (cityVal === 'karachi') cityMultiplier = 1.05;
        if (cityVal === 'faisalabad') cityMultiplier = 0.95;

        let greyRate = 2400;
        let finishRate = 2200;
        if (quality === 'grey') finishRate = 0;
        if (quality === 'premium') finishRate = 4500;

        let totalGrey = sqft * greyRate * cityMultiplier;
        let totalFinish = sqft * finishRate * cityMultiplier;
        let grandTotal = totalGrey + totalFinish;

        let cementBags = Math.round((sqft / 1000) * 450);
        let steelTons = parseFloat(((sqft / 1000) * 3.5).toFixed(1));
        let bricksCount = Math.round((sqft / 1000) * 10000);
        let sandCft = Math.round((sqft / 1000) * 3000);

        res.json({
            success: true,
            estimate: {
                plotSize: marlaSize,
                city: cityVal,
                floors: floorsVal,
                quality,
                totalSqft: sqft,
                totalCost: grandTotal,
                greyCost: totalGrey,
                finishingCost: totalFinish,
                materials: { cementBags, steelTons, bricksCount, sandCft }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
