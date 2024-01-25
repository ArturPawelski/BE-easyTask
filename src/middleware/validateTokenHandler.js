const jwt = require('jsonwebtoken');

const validateToken = async (req, res, next) => {
  let token;

  try {
    let authHeader = req.headers.Authorization || req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer')) {
      token = authHeader.split(' ')[1];

      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: 'user is not authorized' });
        }
        req.token = token;
        req.user = decoded.user;
        next();
      });
    } else {
      res.status(401).json({ message: 'user is not authorized or token is missing' });
    }
  } catch (error) {
    return res.sendStatus(401);
  }
};

module.exports = validateToken;
