const jwt = require('jsonwebtoken');
const User= require('../model/User');

const authMiddleware = async(req, res, next) => {
  const token = req.cookies.jwt; // The token should be in the header

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user= await User.findById(decoded.id).select("-password");;
    req.user = user; // Attach user data to the request
    next(); // Proceed to the next middleware or route
  } catch (err) {
    console.error("JWT Verification failed",err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
