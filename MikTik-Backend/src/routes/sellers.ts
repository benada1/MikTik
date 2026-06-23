const express = require('express');
const Seller = require('../models/Seller');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /api/sellers/me — current seller's commission rate
router.get('/me', authMiddleware, async (req: any, res: any) => {
  try {
    const seller = await Seller.findOne({ user: req.user.id }).select('commissionRate');
    if (!seller) return res.status(404).json({ error: 'Seller profile not found' });
    res.json({ commissionRate: seller.commissionRate });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/sellers/by-user/:userId — get a seller's commission rate (admin only)
router.get('/by-user/:userId', authMiddleware, authMiddleware.requireAdmin, async (req: any, res: any) => {
  try {
    const seller = await Seller.findOne({ user: req.params.userId }).select('commissionRate');
    if (!seller) return res.status(404).json({ error: 'Seller not found' });
    res.json({ commissionRate: seller.commissionRate });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/sellers/by-user/:userId/commission — update seller commission rate (admin only)
router.patch('/by-user/:userId/commission', authMiddleware, authMiddleware.requireAdmin, async (req: any, res: any) => {
  try {
    const { commissionRate } = req.body;
    if (commissionRate === undefined || commissionRate === null || commissionRate < 0 || commissionRate > 100) {
      return res.status(400).json({ error: 'Commission rate must be between 0 and 100' });
    }
    const seller = await Seller.findOneAndUpdate(
      { user: req.params.userId },
      { commissionRate: Number(commissionRate) },
      { new: true }
    );
    if (!seller) return res.status(404).json({ error: 'Seller not found' });
    res.json({ commissionRate: seller.commissionRate });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
