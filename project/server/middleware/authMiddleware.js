const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.verifyToken = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authorization access rejected, token sequence missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'GLOBAL_EMBEDDED_SIGNING_KEY_PARAMETER');
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Owner data allocation not discovered matching payload signatures' });
    }
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Credential parsing operation collapsed, token non-compliant' });
  }
};

exports.checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Operational clearance privilege validation error: insufficient permissions' });
    }
    next();
  }
};