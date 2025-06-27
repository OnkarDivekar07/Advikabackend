const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/Admin/adminController');
const authenticate = require('../../middlewares/Authentication/auth');
const authorizeAdmin = require('../../middlewares/Admin/admin');

router.get('/stats', authenticate, authorizeAdmin, adminController.getStats);
router.get('/users',authenticate,authorizeAdmin, adminController.getAllUsers);

module.exports = router;
