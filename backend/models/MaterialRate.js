const mongoose = require('mongoose');

const materialRateSchema = new mongoose.Schema({
    material: {
        type: String,
        required: true,
        enum: ['cement', 'steel', 'bricks', 'sand', 'gravel', 'tiles', 'paint', 'plumbing', 'electrical']
    },
    unit: {
        type: String,
        required: true
    },
    priceMin: {
        type: Number,
        required: true
    },
    priceMax: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: true,
        enum: ['lahore', 'karachi', 'islamabad', 'rawalpindi', 'faisalabad', 'all']
    },
    brand: {
        type: String,
        default: 'Standard'
    },
    trend: {
        type: String,
        enum: ['up', 'down', 'stable'],
        default: 'stable'
    },
    trendPercent: {
        type: Number,
        default: 0
    },
    note: {
        type: String
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

materialRateSchema.index({ material: 1, city: 1 });

module.exports = mongoose.model('MaterialRate', materialRateSchema);
