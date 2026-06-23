const express = require('express');
const Review = require('../models/Review');
const Purchase = require('../models/Purchase');
const Seller = require('../models/Seller');
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// POST /api/reviews — submit a rating for a purchase
router.post('/', authMiddleware, async (req: any, res: any) => {
  try {
    const { purchaseId, rating, comment } = req.body;
    if (!purchaseId || !rating) return res.status(400).json({ error: 'purchaseId and rating are required' });
    if (rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be between 1 and 5' });

    const purchase = await Purchase.findById(purchaseId).populate('ticket', 'seller');
    if (!purchase) return res.status(404).json({ error: 'Purchase not found' });
    if (purchase.buyer.toString() !== req.user.id) return res.status(403).json({ error: 'Not your purchase' });

    const sellerId = purchase.ticket?.seller;
    if (!sellerId) return res.status(400).json({ error: 'Seller not found on ticket' });

    const existing = await Review.findOne({ purchase: purchaseId });
    if (existing) return res.status(409).json({ error: 'You already reviewed this purchase' });

    const review = await Review.create({
      buyer: req.user.id,
      seller: sellerId,
      ticket: purchase.ticket?._id,
      purchase: purchaseId,
      rating: Number(rating),
      comment: comment?.trim() || '',
    });

    // Update seller's average rating
    const allReviews = await Review.find({ seller: sellerId });
    const avg = allReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / allReviews.length;
    await Seller.findOneAndUpdate(
      { user: sellerId },
      { rating: Math.round(avg * 10) / 10, totalReviews: allReviews.length }
    );

    // Mark the review_prompt notification as read
    await Notification.findOneAndUpdate(
      { user: req.user.id, type: 'review_prompt', relatedId: purchase._id },
      { read: true }
    );

    res.status(201).json({ review });
  } catch (err: any) {
    if (err.code === 11000) return res.status(409).json({ error: 'You already reviewed this purchase' });
    console.error('Review error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/reviews/check/:purchaseId — check if buyer already reviewed
router.get('/check/:purchaseId', authMiddleware, async (req: any, res: any) => {
  try {
    const review = await Review.findOne({ purchase: req.params.purchaseId, buyer: req.user.id });
    res.json({ reviewed: !!review });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
