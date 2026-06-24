const express = require('express');
const jwt = require('jsonwebtoken');
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

// GET /api/sellers/me/profile — seller fetches their own editable profile data
router.get('/me/profile', authMiddleware, async (req: any, res: any) => {
  try {
    const seller = await Seller.findOne({ user: req.user.id })
      .select('fullName bio description location socialLinks rating totalReviews totalSales verification createdAt');
    if (!seller) return res.status(404).json({ error: 'Seller profile not found' });
    const User = require('../models/User');
    const user = await User.findById(req.user.id).select('name');
    res.json({
      name: seller.fullName || user?.name || '',
      bio: seller.bio || '',
      description: seller.description || '',
      location: seller.location || '',
      socialLinks: seller.socialLinks ?? {},
      verified: seller.verification?.status === 'verified',
      rating: seller.totalReviews >= 5 ? seller.rating : null,
      totalReviews: seller.totalReviews,
      totalSales: seller.totalSales,
      ratingVisible: seller.totalReviews >= 5,
      memberSince: new Date(seller.createdAt).getFullYear().toString(),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/sellers/me/profile — seller updates their own profile
router.patch('/me/profile', authMiddleware, async (req: any, res: any) => {
  try {
    const { bio, description, location, instagram, twitter } = req.body;
    const update: Record<string, any> = {};

    if (bio !== undefined) {
      if (typeof bio !== 'string' || bio.length > 160)
        return res.status(400).json({ error: 'Bio must be 160 characters or fewer' });
      update.bio = bio.trim();
    }
    if (description !== undefined) {
      if (typeof description !== 'string' || description.length > 1000)
        return res.status(400).json({ error: 'Description must be 1000 characters or fewer' });
      update.description = description.trim();
    }
    if (location !== undefined) update.location = String(location).trim().slice(0, 100);
    if (instagram !== undefined) update['socialLinks.instagram'] = String(instagram).trim().slice(0, 100);
    if (twitter !== undefined) update['socialLinks.twitter'] = String(twitter).trim().slice(0, 100);

    const seller = await Seller.findOneAndUpdate(
      { user: req.user.id },
      { $set: update },
      { new: true }
    );
    if (!seller) return res.status(404).json({ error: 'Seller profile not found' });

    res.json({
      bio: seller.bio,
      description: seller.description,
      location: seller.location,
      socialLinks: seller.socialLinks,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/sellers/profile/:userId — public seller profile page
router.get('/profile/:userId', async (req: any, res: any) => {
  try {
    const { userId } = req.params;
    const User = require('../models/User');
    const Ticket = require('../models/Ticket');
    const Review = require('../models/Review');
    const Purchase = require('../models/Purchase');

    const [seller, user] = await Promise.all([
      Seller.findOne({ user: userId }),
      User.findById(userId).select('name'),
    ]);
    if (!seller || !user) return res.status(404).json({ error: 'Seller not found' });

    const ratingVisible = seller.totalReviews >= 5;

    const [activeListings, reviews] = await Promise.all([
      Ticket.find({ seller: userId, status: 'active' })
        .select('name category date venue city price available')
        .sort({ createdAt: -1 })
        .limit(20),
      Review.find({ seller: userId })
        .populate('buyer', 'name')
        .populate('ticket', 'name')
        .sort({ createdAt: -1 }),
    ]);

    // Determine eligible purchases for the requesting user (optional auth)
    let eligiblePurchases: any[] = [];
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const decoded: any = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
        const buyerId = decoded.id;
        const now = new Date();

        const userPurchases = await Purchase.find({ buyer: buyerId, status: 'confirmed' })
          .populate('ticket', 'name seller date');

        const sellerPurchases = userPurchases.filter(
          (p: any) => p.ticket?.seller?.toString() === userId
        );

        for (const purchase of sellerPurchases) {
          const ticketDate = purchase.ticket?.date;
          if (ticketDate && new Date(ticketDate) < now) {
            const already = await Review.findOne({ purchase: purchase._id });
            if (!already) {
              eligiblePurchases.push({
                purchaseId: purchase._id,
                ticketName: purchase.ticket?.name || 'Event',
              });
            }
          }
        }
      } catch (_) {
        // Invalid token — skip eligible purchases
      }
    }

    res.json({
      seller: {
        id: userId,
        name: seller.fullName || user.name,
        bio: seller.bio || '',
        description: seller.description || '',
        location: seller.location || seller.address?.city || '',
        socialLinks: seller.socialLinks ?? {},
        verified: seller.verification?.status === 'verified',
        rating: ratingVisible ? seller.rating : null,
        totalReviews: seller.totalReviews,
        totalSales: seller.totalSales,
        ratingVisible,
        memberSince: new Date(seller.createdAt).getFullYear().toString(),
        activeListings: activeListings.map((t: any) => ({
          id: t._id,
          name: t.name,
          category: t.category,
          date: t.date,
          venue: t.venue,
          city: t.city,
          price: t.price,
          available: t.available,
        })),
        reviews: reviews.map((r: any) => ({
          id: r._id,
          buyerName: r.buyer?.name || 'Anonymous',
          rating: r.rating,
          comment: r.comment,
          ticketName: r.ticket?.name || '',
          date: r.createdAt,
        })),
        eligiblePurchases,
      },
    });
  } catch (err: any) {
    console.error('Seller profile error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
