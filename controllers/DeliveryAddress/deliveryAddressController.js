// controllers/deliveryAddress.controller.js
const deliveryService = require('../../services/DeliveryAddress/deliveryAddress.service');

// Create Address
exports.createAddress = async (req, res, next) => {
  try {
    const userId = req.user.userId; // assumes auth middleware added this
    const data = {
      ...req.body,
      user: {
        connect: { id: userId }
      }
    };
    const address = await deliveryService.createAddress(data);
    res.status(201).json(address);
  } catch (err) {
    next(err)
  }
};

// Get All Addresses by User
exports.getAddresses = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const addresses = await deliveryService.getAddressesByUserId(userId);
    res.json(addresses);
  } catch (err) {
    next(err)
  }
};

// Update Address
exports.updateAddress = async (req, res,next) => {
  try {
    const { id } = req.params;
    const updatedAddress = await deliveryService.updateAddressById(id, req.body);
    res.json(updatedAddress);
  } catch (err) {
    next(err)
  }
};

// Delete Address
exports.deleteAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deliveryService.deleteAddressById(id);
    res.json({ message: 'Address deleted successfully' });
  } catch (err) {
    next(err)
  }
};
