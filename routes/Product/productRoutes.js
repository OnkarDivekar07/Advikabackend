const express = require('express');
const router = express.Router();

const productController = require('../../controllers/Product/productController');
const validateProduct = require('../../validators/productValidator');
const validate = require('../../middlewares/validateRequest/validateRequest');
const authenticate = require('../../middlewares/Authentication/auth');
const authorizeAdmin = require('../../middlewares/Admin/admin');
const upload = require('../../uploads/multer');


// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.get('/:id/related', productController.getRelatedProducts);

// Admin-only routes
router.post(
  '/',
  authenticate,
  authorizeAdmin,
  upload.array('images', 5),
  validateProduct.validateCreateProduct,
  validate, 
  productController.createProduct
);
router.put('/:id', authenticate, authorizeAdmin,  upload.array('images', 5),validateProduct.validateUpdateProduct,validate, productController.updateProduct);
router.delete('/:id', authenticate, authorizeAdmin, productController.deleteProduct);

module.exports = router;
 