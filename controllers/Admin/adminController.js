const adminService = require('../../services/Admin/adminService');

exports.getStats = async (req, res,next) => {
  try {
    const stats = await adminService.getAdminStats();
    res.status(200).json(stats);
  } catch (err) {
     next(err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await adminService.getAllUsersWithStats();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};
