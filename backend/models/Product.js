const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Worker',
        required: true,
    },
    ratings: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
    },
    reviews: [
        {
            user: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Worker',
            },
            comment: { 
                type: String, 
                required: true,
            },
            rating: { 
                type: Number, 
                min: 0, 
                max: 5, 
                required: true,
            },
            createdAt: { 
                type: Date, 
                default: Date.now,
            },
        },
    ],
    isArchived: {
        type: Boolean,
        default: false,
    },
    availableCount: {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Product', productSchema);
