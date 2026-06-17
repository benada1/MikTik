const express = require('express');
const Purchase = require('../models/Purchase');
const Ticket = require('../models/Ticket');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// POST /api/purchases  — buy a ticket
router.post('/', authMiddleware, async (req: any, res: any) => {
  try {
    const { ticketId, quantity } = req.body;
    const qty = Math.max(1, Number(quantity) || 1);

    if (!ticketId) return res.status(400).json({ error: 'ticketId is required' });

    const ticket = await Ticket.findById(ticketId);
    if (!ticket || ticket.status !== 'active') {
      return res.status(404).json({ error: 'Ticket is not available' });
    }
    if (ticket.available < qty) {
      return res.status(400).json({ error: `Only ${ticket.available} ticket(s) remaining` });
    }
    if (ticket.seller && ticket.seller.toString() === req.user.id) {
      return res.status(400).json({ error: 'You cannot buy your own ticket' });
    }

    const fee = Math.round(ticket.price * qty * 0.05);
    const totalPaid = ticket.price * qty + fee;

    // Decrement stock; mark sold when depleted
    ticket.available -= qty;
    if (ticket.available === 0) ticket.status = 'sold';
    await ticket.save();

    const purchase = await Purchase.create({
      buyer: req.user.id,
      ticket: ticketId,
      quantity: qty,
      priceEach: ticket.price,
      fee,
      totalPaid,
      status: 'confirmed',
    });

    res.status(201).json({ purchase });
  } catch (err: any) {
    console.error('Purchase error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/purchases/my  — authenticated buyer's order history
router.get('/my', authMiddleware, async (req: any, res: any) => {
  try {
    const purchases = await Purchase.find({ buyer: req.user.id })
      .populate('ticket')
      .sort({ createdAt: -1 });
    res.json({ purchases });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
