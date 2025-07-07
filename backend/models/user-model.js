const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        requied: [true, 'Name is required.'],
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters.']
    },
    email: {
        type:String,
        requied:[true, 'Email is required.'],
        trim:true,
        unique:true,
        match:[/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Enter a valid email.']
    },
    password: {
        type:String,
        required:true,
        minlength:8,
    },
    role: {
        type:String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    address: {
        flatNo:String,
        street:String,
        city:String,
        state:String,
        pinCode:String,
        country:String,
    },
    contactNo: String,
    profileImage: String,
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
    }]
}, {
    timestamps: true,
}) 

module.exports = mongoose.model('User', userSchema);