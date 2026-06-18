const express = require('express');
const Report = require('../models/Report');
const Purchase = require('../models/Purchase');
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/auth');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// POST /api/reports — create a report tied to a real order
router.post('/', authMiddleware, async (req: any, res: any) => {
  try {
    const { orderId, reason } = req.body;
    if (!orderId?.trim() || !reason?.trim()) {
      return res.status(400).json({ error: 'orderId and reason are required' });
    }

    const purchase = await Purchase.findOne({
      orderNumber: orderId.trim().toUpperCase(),
      buyer: req.user.id,
    }).populate('ticket', 'name');

    if (!purchase) {
      return res.status(400).json({ error: 'No order with that ID found on your account' });
    }

    const existing = await Report.findOne({ purchase: purchase._id, status: { $ne: 'closed' } });
    if (existing) {
      return res.status(400).json({ error: 'An open report already exists for this order' });
    }

    const report = await Report.create({
      user: req.user.id,
      purchase: purchase._id,
      orderId: purchase.orderNumber,
      eventName: purchase.ticket?.name || '',
      reason: reason.trim(),
    });

    res.status(201).json({ report });
  } catch (err: any) {
    console.error('Report create error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/reports/my — authenticated user's own reports (all statuses)
router.get('/my', authMiddleware, async (req: any, res: any) => {
  try {
    const reports = await Report.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ reports });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/reports — admin: all reports except closed
router.get('/', authMiddleware, requireAdmin, async (req: any, res: any) => {
  try {
    const reports = await Report.find({ status: { $ne: 'closed' } })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json({ reports });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/reports/:id/status — admin: update status and optional adminNote
router.patch('/:id/status', authMiddleware, requireAdmin, async (req: any, res: any) => {
  try {
    const { status, adminNote } = req.body;
    if (!['open', 'pending', 'closed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const update: any = { status };
    if (adminNote !== undefined) update.adminNote = adminNote;
    const report = await Report.findByIdAndUpdate(req.params.id, update, { new: true }).populate('user', 'name email');
    if (!report) return res.status(404).json({ error: 'Report not found' });

    const statusLabels: Record<string, string> = { open: 'Open', pending: 'Under review', closed: 'Closed' };
    const noteText = adminNote ? ` Admin note: ${adminNote}` : '';
    await Notification.create({
      user: report.user._id,
      type: 'report_updated',
      title: 'Dispute status updated',
      message: `Your dispute for order ${report.orderId} is now "${statusLabels[status] || status}".${noteText}`,
      link: '/dispute-center',
      relatedId: report._id,
    });

    res.json({ report });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
