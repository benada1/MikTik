const cron = require('node-cron');
const Purchase = require('../models/Purchase');
const Ticket = require('../models/Ticket');
const Notification = require('../models/Notification');
const Review = require('../models/Review');

// Runs daily at 9:00 AM to send event reminders and expired listing alerts.
function scheduleNotifications() {
  cron.schedule('0 9 * * *', async () => {
    try {
      await sendEventReminders();
      await sendExpiredListingAlerts();
      await sendReviewPrompts();
    } catch (err) {
      console.error('Notification scheduler error:', err);
    }
  });
  console.log('Notification scheduler started (runs daily at 09:00)');
}

async function sendEventReminders() {
  const now = new Date();

  // 7-day window: tickets whose date falls between exactly 7 and 8 days from now
  const weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() + 7);
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 1);

  // 1-day window: tickets whose date falls between exactly 1 and 2 days from now
  const dayStart = new Date(now);
  dayStart.setDate(dayStart.getDate() + 1);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

  for (const [windowStart, windowEnd, type, title, buildMsg] of [
    [
      weekStart,
      weekEnd,
      'event_reminder_week',
      'Event in 7 days',
      (t: any) => `${t.name} at ${t.venue} is coming up next week. Make sure you're ready!`,
    ],
    [
      dayStart,
      dayEnd,
      'event_reminder_day',
      'Event tomorrow!',
      (t: any) => `${t.name} at ${t.venue} is tomorrow. Don't miss it!`,
    ],
  ] as const) {
    const tickets = await Ticket.find({
      date: { $gte: windowStart, $lt: windowEnd },
      status: { $ne: 'sold' },
    });

    if (!tickets.length) continue;

    const ticketIds = tickets.map((t: any) => t._id);
    const purchases = await Purchase.find({
      ticket: { $in: ticketIds },
      status: { $ne: 'cancelled' },
    });

    for (const purchase of purchases) {
      const ticket = tickets.find((t: any) => t._id.equals(purchase.ticket));
      if (!ticket) continue;

      const already = await Notification.findOne({ type, relatedId: purchase._id });
      if (already) continue;

      await Notification.create({
        user: purchase.buyer,
        type,
        title,
        message: buildMsg(ticket),
        link: `/ticket/${ticket._id}`,
        relatedId: purchase._id,
      });
    }
  }
}

async function sendExpiredListingAlerts() {
  const now = new Date();

  // Active tickets whose event date has already passed
  const expired = await Ticket.find({
    status: 'active',
    available: { $gt: 0 },
    date: { $lt: now },
  });

  for (const ticket of expired) {
    const already = await Notification.findOne({ type: 'ticket_expired', relatedId: ticket._id });
    if (already) continue;

    await Notification.create({
      user: ticket.seller,
      type: 'ticket_expired',
      title: 'Listing expired',
      message: `Your listing "${ticket.name}" at ${ticket.venue} passed its event date without being fully sold.`,
      link: '/seller-dashboard',
      relatedId: ticket._id,
    });
  }
}

async function sendReviewPrompts() {
  const now = new Date();
  // Yesterday's events: date between 24h and 48h ago
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  const twoDaysAgo = new Date(yesterday);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 1);

  const tickets = await Ticket.find({ date: { $gte: twoDaysAgo, $lt: yesterday } });
  if (!tickets.length) return;

  const ticketIds = tickets.map((t: any) => t._id);
  const purchases = await Purchase.find({
    ticket: { $in: ticketIds },
    status: 'confirmed',
  }).populate('ticket', 'name seller');

  for (const purchase of purchases) {
    if (!purchase.ticket) continue;
    const already = await Notification.findOne({ type: 'review_prompt', relatedId: purchase._id });
    if (already) continue;
    const reviewed = await Review.findOne({ purchase: purchase._id });
    if (reviewed) continue;

    await Notification.create({
      user: purchase.buyer,
      type: 'review_prompt',
      title: 'How was your experience?',
      message: `Rate your experience for "${purchase.ticket.name}". Your feedback helps other buyers.`,
      link: '/buyer-dashboard',
      relatedId: purchase._id,
    });
  }
}

module.exports = { scheduleNotifications };
