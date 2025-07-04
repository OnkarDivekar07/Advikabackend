const jwt = require('jsonwebtoken');

const generateToken = (userId,role) => {
  return jwt.sign({ userId,role }, process.env.JWT_SECRET, {
    expiresIn: '1h', // Set token expiration time (can be adjusted)
  });
};

module.exports = generateToken;