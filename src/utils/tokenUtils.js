require('dotenv').config();
const jwt = require('jsonwebtoken');

const generateToken = (email) => {
  return jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.VERIFICATION_EXPIRES });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

module.exports = {
  generateToken,
  verifyToken,
};
