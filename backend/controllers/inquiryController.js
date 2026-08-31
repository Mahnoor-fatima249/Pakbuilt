const Inquiry = require('../models/Inquiry');

exports.createInquiry = async (req, res) => {
    try {
        const inquiry = await Inquiry.create({
            user: req.user ? req.user.id : undefined,
            ...req.body
        });
        res.status(201).json({ success: true, inquiry });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getMyInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find({ user: req.user.id }).sort('-createdAt');
        res.status(200).json({ success: true, inquiries });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find().populate('user', 'name email').sort('-createdAt');
        res.status(200).json({ success: true, count: inquiries.length, inquiries });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateInquiryStatus = async (req, res) => {
    try {
        const inquiry = await Inquiry.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status, adminNotes: req.body.adminNotes },
            { new: true }
        );
        if (!inquiry) {
            return res.status(404).json({ success: false, message: 'Inquiry not found' });
        }
        res.status(200).json({ success: true, inquiry });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteInquiry = async (req, res) => {
    try {
        const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
        if (!inquiry) {
            return res.status(404).json({ success: false, message: 'Inquiry not found' });
        }
        res.status(200).json({ success: true, message: 'Inquiry deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
