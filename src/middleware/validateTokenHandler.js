const jwt = require('jsonwebtoken');
const userDataService = require('../services/user/userDataService');
const validateToken = async (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: 'User is not authorized or token is missing' });
  }

  const isTokenInvalidated = await userDataService.findInvalidatedToken({ token });
  if (isTokenInvalidated) {
    return res.status(401).json({ message: 'This session has expired. Please login' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'User is not authorized' });
    }
    req.token = token;
    req.user = decoded.user;
    next();
  });
};

module.exports = validateToken;
