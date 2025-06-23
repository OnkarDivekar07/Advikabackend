const express = require('express');
const router = express.Router();
const {
  createAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
} = require('../../controllers/DeliveryAddress/deliveryAddressController');
const authenticate = require('../../middlewares/Authentication/auth');

router.post('/',authenticate, createAddress);
router.get('/',authenticate, getAddresses);
router.put('/:id',authenticate, updateAddress);
router.delete('/:id',authenticate, deleteAddress);

module.exports = router;
