const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true
    },
    serviceType: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    plotSize: {
        type: String
    },
    budget: {
        type: String
    },
    message: {
        type: String
    },
    source: {
        type: String,
        enum: ['contact-form', 'contractor-form', 'whatsapp', 'chatbot'],
        default: 'contact-form'
    },
    status: {
        type: String,
        enum: ['new', 'contacted', 'resolved', 'archived'],
        default: 'new'
    },
    adminNotes: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', inquirySchema);
