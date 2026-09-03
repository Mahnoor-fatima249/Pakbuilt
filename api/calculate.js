module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'https://mahnoor-fatima249.github.io');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

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

        return res.status(200).json({
            success: true,
            estimate: {
                plotSize: marlaSize, city: cityVal, floors: floorsVal, quality,
                totalSqft: sqft, totalCost: grandTotal, greyCost: totalGrey, finishingCost: totalFinish,
                materials: { cementBags, steelTons, bricksCount, sandCft }
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
