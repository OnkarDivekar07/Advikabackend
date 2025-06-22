const express = require('express');
const router = express.Router();

// Import route files for different resources
const userRoutes = require('./User/userRoutes');
const productRoutes = require('./Product/productRoutes');
const cartRoutes=require('../routes/Cart/cartRoutes')
const orderRoutes=require('../routes/Order/orderRoutes')
const adminRoutes=require('../routes/Admin/admin')
const paymentRoutes=require('../routes/Payments/paymentRoutes')
const bannerRoutes=require('../routes/banner/banner')
const authRoutes =require('../routes/auth/authRoutes')

// Use specific routes for each resource
router.use('/user', userRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/order',orderRoutes);
router.use('/admin',adminRoutes)
router.use('/payment',paymentRoutes)
router.use('/banner',bannerRoutes)
router.use('/auth', authRoutes);


// Optional: Catch-all route for undefined routes (404)
router.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = router;
