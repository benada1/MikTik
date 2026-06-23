const express = require('express');
const authMiddleware = require('../middleware/auth');
const { requireAdmin } = require('../middleware/auth');
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const Purchase = require('../models/Purchase');
const Report = require('../models/Report');

const router = express.Router();

// GET /api/admin/stats — platform overview stats (admin only)
router.get('/stats', authMiddleware, requireAdmin, async (_req: any, res: any) => {
  try {
    const [totalUsers, totalSellers, activeTickets, openReports, totalPurchases, revenueAgg] = await Promise.all([
      User.countDocuments({ permissionLevel: 1 }),
      User.countDocuments({ permissionLevel: { $gte: 2 } }),
      Ticket.countDocuments({ status: 'active' }),
      Report.countDocuments({ status: { $ne: 'closed' } }),
      Purchase.countDocuments(),
      Purchase.aggregate([
        { $match: { status: { $in: ['confirmed', 'pending'] } } },
        { $group: { _id: null, total: { $sum: '$totalPaid' }, fees: { $sum: '$fee' } } },
      ]),
    ]);

    const revenue = revenueAgg[0] || { total: 0, fees: 0 };

    res.json({
      totalUsers,
      totalSellers,
      activeTickets,
      openReports,
      totalPurchases,
      totalRevenue: revenue.total,
      totalFees: revenue.fees,
    });
  } catch (err: any) {
    console.error('Admin stats error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
