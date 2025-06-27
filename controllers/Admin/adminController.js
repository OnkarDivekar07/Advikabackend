const adminService = require('../../services/Admin/adminService');

exports.getStats = async (req, res) => {
  try {
    const stats = await adminService.getAdminStats();
    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await adminService.getAllUsersWithStats();
    res.status(200).json(users);
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ error: err.message });
  }
};
