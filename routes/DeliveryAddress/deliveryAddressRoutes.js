const express = require('express');
const router = express.Router();
const {
  createAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
} = require('../../controllers/DeliveryAddress/deliveryAddressController');
const authenticate = require('../../middlewares/Authentication/auth');

const  adressvalidation= require("../../validators/addressValidator")
const  validateRequest=require("../../middlewares/validateRequest/validateRequest")


router.post('/',authenticate,adressvalidation.createAddressValidator,validateRequest, createAddress);
router.get('/',authenticate, getAddresses);
router.put('/:id',authenticate,adressvalidation.updateAddressValidator,validateRequest, updateAddress);
router.delete('/:id',authenticate, deleteAddress);

module.exports = router;
