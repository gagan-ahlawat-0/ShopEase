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
    }
}, {
    timestamps: true,
}) 


userSchema.pre('save', async function(next) {
    if(!this.isModified('password'))    return next();

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }
    catch (err) {
        next(err);
    }
});

userSchema.methods.comparePassword = async (inputPassword) => {
    return await bcrypt.compare(inputPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);