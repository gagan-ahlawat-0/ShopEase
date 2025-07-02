const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
    },
    price: {
        type: Number,
        required: true
    }
});

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [cartItemSchema],
    totalAmount: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps:true
});

cartSchema.pre('save', (next) => {
    this.totalAmount = this.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
});

module.exports = mongoose.model('Cart', cartSchema);