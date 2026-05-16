const jwt = require('jsonwebtoken');

function verifyToken(req) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return null;
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_pathpilot_secure');
    return decoded.userId;
  } catch (err) {
    return null;
  }
}

module.exports = { verifyToken };
