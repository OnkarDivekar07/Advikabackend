const { registerUser, loginUser, getUserProfile } = require('../../services/User/userService');



// Helper function for consistent error handling
const handleErrorResponse = (res, error, statusCode = 400) => {
  console.error(error); // Log the error for debugging purposes
  return res.status(statusCode).json({ error: error.message });
};

exports.registerUser = async (req, res) => {
  try {
    // Input validation (optional)
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ error: "Email and Password are required" });
    }

    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (err) {
    // Improved error handling
    handleErrorResponse(res, err, 400);
  }
};

exports.loginUser = async (req, res) => {
  try {
    // Input validation (optional)
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ error: "Email and Password are required" });
    }

    const result = await loginUser(req.body);
    res.status(200).json(result);
  } catch (err) {
    // Improved error handling with more context
    if (err.message.includes("Invalid credentials")) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    handleErrorResponse(res, err, 401); // Generic error handler
  }
};



exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;  // assuming req.user is populated by JWT middleware
    const profile = await getUserProfile(userId);
    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};



