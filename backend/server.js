const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./utils/database.js')
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: err.message,
    });
});

app.use('/api/*', (req, res) => {
    res.status(404).json({message: 'API route not found'});
});

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;