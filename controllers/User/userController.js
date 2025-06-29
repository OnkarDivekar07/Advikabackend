const { registerUser, loginUser, getUserProfile } = require('../../services/User/userService');
const CustomError = require('../../utils/customError');


exports.registerUser = async (req, res,next) => {
  try {
    // Input validation (optional)
    if (!req.body.email || !req.body.password) {
      throw new CustomError("Email and Password are required",401);
    }

    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (err) {
    // Improved error handling
    next(err)
  }
};

exports.loginUser = async (req, res,next) => {
  try {
    // Input validation (optional)
    if (!req.body.email || !req.body.password) {
      throw  new CustomError("Email and Password are required",401);
    }

    const result = await loginUser(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err)
  }
};



exports.getUserProfile = async (req, res,next) => {
  try {
    const userId = req.user.userId;  // assuming req.user is populated by JWT middleware
    const profile = await getUserProfile(userId);
    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    next(err)
  }
};



