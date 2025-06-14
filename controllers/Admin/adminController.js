const adminService = require('../../services/Admin/adminService');

exports.getStats = async (req, res) => {
  try {
    const stats = await adminService.getAdminStats();
    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
