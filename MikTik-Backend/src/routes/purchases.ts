const express = require('express');
const nodemailer = require('nodemailer');
const Purchase = require('../models/Purchase');
const Ticket = require('../models/Ticket');
const Notification = require('../models/Notification');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

async function sendPurchaseConfirmationEmail(buyerEmail: string, buyerName: string, ticketName: string, venue: string, qty: number, totalPaid: number, orderId: string) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
    await transporter.sendMail({
      from: `"MikTik" <${process.env.EMAIL_USER}>`,
      to: buyerEmail,
      subject: `Order confirmed: ${ticketName}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
          <h2 style="margin-bottom:8px">Your order is confirmed! 🎟️</h2>
          <p style="color:#555;margin-bottom:4px">Hi ${buyerName},</p>
          <p style="color:#555;margin-bottom:24px">
            Your purchase of <strong>${qty}x "${ticketName}"</strong> at <strong>${venue}</strong> has been confirmed.
            Payment of <strong>₪${totalPaid.toLocaleString()}</strong> is held in escrow and will be released to the seller after the event.
          </p>
          <div style="background:#f8fafc;border-radius:8px;padding:16px;margin-bottom:24px">
            <p style="margin:0;color:#64748b;font-size:14px">Order ID: <strong style="color:#1e293b">${orderId}</strong></p>
          </div>
          <p style="color:#999;font-size:12px">
            If the ticket is invalid or not delivered, you are fully protected by MikTik Buyer Guarantee.
          </p>
        </div>
      `,
    });
  } catch (err: any) {
    console.error('[Email] Failed to send purchase confirmation:', err.message);
  }
}

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

    // Send confirmation email to buyer
    const buyerUser = await User.findById(req.user.id).select('email name');
    if (buyerUser?.email) {
      sendPurchaseConfirmationEmail(
        buyerUser.email,
        buyerUser.name || 'there',
        ticket.name,
        ticket.venue,
        qty,
        totalPaid,
        purchase.orderNumber,
      );
    }

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
