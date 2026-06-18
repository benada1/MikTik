const express = require('express');
const Purchase = require('../models/Purchase');
const Ticket = require('../models/Ticket');
const Notification = require('../models/Notification');
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

    const purchase = new Purchase({
      buyer: req.user.id,
      ticket: ticketId,
      quantity: qty,
      priceEach: ticket.price,
      fee,
      totalPaid,
      status: 'confirmed',
    });
    purchase.orderNumber = `ORD-${purchase._id.toString().slice(-6).toUpperCase()}`;
    await purchase.save();

    // Notify buyer: purchase confirmed
    await Notification.create({
      user: req.user.id,
      type: 'ticket_purchased',
      title: 'Purchase confirmed',
      message: `You bought ${qty}x "${ticket.name}" at ${ticket.venue} for ₪${totalPaid.toLocaleString()}.`,
      link: '/buyer-dashboard',
      relatedId: purchase._id,
    });

    // Notify seller: their ticket was sold
    if (ticket.seller) {
      await Notification.create({
        user: ticket.seller,
        type: 'ticket_sold',
        title: 'Ticket sold!',
        message: `${qty}x "${ticket.name}" was just purchased. You'll receive ₪${(ticket.price * qty * 0.95).toLocaleString()} after the buyer confirms receipt.`,
        link: '/seller-dashboard',
        relatedId: purchase._id,
      });
    }

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
