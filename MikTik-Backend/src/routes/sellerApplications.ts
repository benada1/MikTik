const express = require('express');
const SellerApplication = require('../models/SellerApplication');
const Seller = require('../models/Seller');
const User = require('../models/User');
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// POST /api/seller-applications — level-1 users only
router.post('/', authMiddleware, async (req: any, res: any) => {
  try {
    if (req.user.permissionLevel !== 1) {
      return res.status(400).json({ error: 'Only regular users can apply to become a seller' });
    }

    const { fullName, phone, idNumber, dateOfBirth, street, city, country, bio } = req.body;

    if (!fullName?.trim()) return res.status(400).json({ error: 'Full name is required' });
    if (!phone?.trim()) return res.status(400).json({ error: 'Phone number is required' });
    if (!idNumber?.trim()) return res.status(400).json({ error: 'ID number is required' });
    if (!dateOfBirth) return res.status(400).json({ error: 'Date of birth is required' });
    if (!city?.trim()) return res.status(400).json({ error: 'City is required' });

    const existing = await SellerApplication.findOne({ user: req.user.id });

    if (existing) {
      if (existing.status === 'pending') {
        return res.status(409).json({ error: 'You already have a pending application' });
      }
      if (existing.status === 'approved') {
        return res.status(409).json({ error: 'Your application was already approved' });
      }

      // Rejected — allow resubmit
      existing.fullName = fullName.trim();
      existing.phone = phone.trim();
      existing.idNumber = idNumber.trim();
      existing.dateOfBirth = new Date(dateOfBirth);
      existing.address = { street: street?.trim() || '', city: city.trim(), country: country?.trim() || 'Israel' };
      existing.bio = bio?.trim() || '';
      existing.status = 'pending';
      existing.rejectionReason = '';
      existing.reviewedAt = undefined;
      await existing.save();
      return res.json({ application: existing });
    }

    const application = await SellerApplication.create({
      user: req.user.id,
      fullName: fullName.trim(),
      phone: phone.trim(),
      idNumber: idNumber.trim(),
      dateOfBirth: new Date(dateOfBirth),
      address: { street: street?.trim() || '', city: city.trim(), country: country?.trim() || 'Israel' },
      bio: bio?.trim() || '',
    });

    res.status(201).json({ application });
  } catch (err: any) {
    console.error('Seller application error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/seller-applications/my
router.get('/my', authMiddleware, async (req: any, res: any) => {
  try {
    const application = await SellerApplication.findOne({ user: req.user.id });
    res.json({ application });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/seller-applications — admin only
router.get('/', authMiddleware, authMiddleware.requireAdmin, async (req: any, res: any) => {
  try {
    const { page: pageParam, status } = req.query;
    const limit = 15;
    const page = Math.max(1, Number(pageParam) || 1);
    const skip = (page - 1) * limit;

    const query: any = {};
    if (status && status !== 'all') query.status = status;

    const [applications, total] = await Promise.all([
      SellerApplication.find(query)
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      SellerApplication.countDocuments(query),
    ]);

    res.json({ applications, total, pages: Math.ceil(total / limit) || 1, page });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/seller-applications/:id/approve — admin only
router.patch('/:id/approve', authMiddleware, authMiddleware.requireAdmin, async (req: any, res: any) => {
  try {
    const application = await SellerApplication.findById(req.params.id).populate('user', 'name email');
    if (!application) return res.status(404).json({ error: 'Application not found' });

    application.status = 'approved';
    application.reviewedAt = new Date();
    application.rejectionReason = '';
    await application.save();

    // Create or update the Seller profile with all submitted details
    await Seller.findOneAndUpdate(
      { user: application.user._id },
      {
        user: application.user._id,
        fullName: application.fullName,
        email: application.user.email,
        phone: application.phone,
        idNumber: application.idNumber,
        dateOfBirth: application.dateOfBirth,
        address: application.address,
        bio: application.bio,
        location: application.address.city,
        verification: {
          status: 'verified',
          submittedAt: application.createdAt,
          reviewedAt: new Date(),
        },
        active: true,
      },
      { upsert: true, new: true }
    );

    await User.findByIdAndUpdate(application.user._id, { permissionLevel: 2 });

    await Notification.create({
      user: application.user._id,
      type: 'seller_approved',
      title: 'Seller application approved!',
      message: "Congratulations! You're now a verified seller on MikTik. You can start listing tickets right away.",
      link: '/sell',
      relatedId: application._id,
    });

    res.json({ application });
  } catch (err: any) {
    console.error('Approve error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/seller-applications/:id/reject — admin only
router.patch('/:id/reject', authMiddleware, authMiddleware.requireAdmin, async (req: any, res: any) => {
  try {
    const application = await SellerApplication.findById(req.params.id);
    if (!application) return res.status(404).json({ error: 'Application not found' });

    application.status = 'rejected';
    application.reviewedAt = new Date();
    application.rejectionReason = req.body.reason?.trim() || '';
    await application.save();

    const reason = application.rejectionReason
      ? ` Reason: ${application.rejectionReason}`
      : ' You may resubmit with updated information.';
    await Notification.create({
      user: application.user,
      type: 'seller_rejected',
      title: 'Seller application rejected',
      message: `Your seller application was not approved.${reason}`,
      link: '/become-seller',
      relatedId: application._id,
    });

    res.json({ application });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/seller-applications/:id/revoke — admin only
router.patch('/:id/revoke', authMiddleware, authMiddleware.requireAdmin, async (req: any, res: any) => {
  try {
    const application = await SellerApplication.findById(req.params.id).populate('user', 'name email');
    if (!application) return res.status(404).json({ error: 'Application not found' });
    if (application.status !== 'approved') {
      return res.status(400).json({ error: 'Can only revoke approved sellers' });
    }

    application.status = 'revoked';
    application.reviewedAt = new Date();
    application.rejectionReason = req.body.reason?.trim() || '';
    await application.save();

    await User.findByIdAndUpdate(application.user._id, { permissionLevel: 1 });

    await Seller.findOneAndUpdate(
      { user: application.user._id },
      { active: false }
    );

    const reason = application.rejectionReason
      ? ` Reason: ${application.rejectionReason}`
      : '';
    await Notification.create({
      user: application.user._id,
      type: 'seller_rejected',
      title: 'Seller access revoked',
      message: `Your seller access has been revoked by an admin.${reason} You may reapply if you believe this was a mistake.`,
      link: '/become-seller',
      relatedId: application._id,
    });

    res.json({ application });
  } catch (err: any) {
    console.error('Revoke error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
