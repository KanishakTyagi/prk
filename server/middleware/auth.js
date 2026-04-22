const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header('Authorization');

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const tokenPart = token.split(' ')[1]; // Extract token from "Bearer <token>"
    if (!tokenPart) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    const decoded = jwt.verify(tokenPart, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
