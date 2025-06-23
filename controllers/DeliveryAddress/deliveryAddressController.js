// controllers/deliveryAddress.controller.js
const deliveryService = require('../../services/DeliveryAddress/deliveryAddress.service');

// Create Address
exports.createAddress = async (req, res) => {
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
    console.error(err);
    res.status(500).json({ error: 'Failed to create address' });
  }
};

// Get All Addresses by User
exports.getAddresses = async (req, res) => {
  try {
    const userId = req.user.userId;
    const addresses = await deliveryService.getAddressesByUserId(userId);
    res.json(addresses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
};

// Update Address
exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAddress = await deliveryService.updateAddressById(id, req.body);
    res.json(updatedAddress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update address' });
  }
};

// Delete Address
exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    await deliveryService.deleteAddressById(id);
    res.json({ message: 'Address deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete address' });
  }
};
