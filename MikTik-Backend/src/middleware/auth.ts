const jwt = require('jsonwebtoken');

const authMiddleware = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization as string | undefined;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

const requireLevel = (minLevel: number) => (req: any, res: any, next: any) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  if ((req.user.permissionLevel ?? 1) < minLevel) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  next();
};

const requireAdmin = requireLevel(3);
const requireSeller = requireLevel(2);

module.exports = authMiddleware;
module.exports.requireAdmin = requireAdmin;
module.exports.requireSeller = requireSeller;
module.exports.requireLevel = requireLevel;
