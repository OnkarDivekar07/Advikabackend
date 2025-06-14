const express = require('express');
const router = express.Router();

const productController = require('../../controllers/product/productController');


const authenticate = require('../../middlewares/Authentication/auth');
const authorizeAdmin = require('../../middlewares/Admin/admin');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Admin-only routes
router.post('/', authenticate, authorizeAdmin, productController.createProduct);
router.put('/:id', authenticate, authorizeAdmin, productController.updateProduct);
router.delete('/:id', authenticate, authorizeAdmin, productController.deleteProduct);

module.exports = router;
