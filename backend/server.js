require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./utils/db-connection.js');
const limiter = require('./utils/rateLimit.js');
const authRoutes = require('./routes/auth-routes.js');
const userRoutes = require('./routes/user-routes.js');
const productRoutes = require('./routes/product-routes.js');
const orderRoutes = require('./routes/order-routes.js');
const cartRoutes = require('./routes/cart-routes.js');

const app = express();

connectDB();

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);


// app.all('/api/*', (req, res) => {
//   res.status(404).json({ message: 'API route not found' });
// });

// app.all('*', (req, res) => {
//   res.status(404).json({ message: 'API route not found' });
// });


app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

process.on('SIGINT', () => {
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = app;
