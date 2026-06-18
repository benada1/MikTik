const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const SellerApplication = require('../models/SellerApplication');
const Seller = require('../models/Seller');
const User = require('../models/User');
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req: any, _file: any, cb: any) => cb(null, uploadsDir),
  filename: (_req: any, file: any, cb: any) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `id-${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req: any, file: any, cb: any) => {
    const allowed = ['.pdf', '.png', '.jpg', '.jpeg'];
    if (allowed.includes(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, PNG, and JPG files are allowed'));
    }
  },
});

// POST /api/seller-applications — level-1 users only
router.post('/', authMiddleware, upload.single('idImage'), async (req: any, res: any) => {
  try {
    if (req.user.permissionLevel !== 1) {
      if (req.file) fs.unlinkSync(req.file.path);
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
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(409).json({ error: 'You already have a pending application' });
      }
      if (existing.status === 'approved') {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(409).json({ error: 'Your application was already approved' });
      }

      // Rejected — allow resubmit; keep old ID image if no new one uploaded
      const idImageUrl = req.file ? `/uploads/${req.file.filename}` : existing.idImageUrl;
      if (req.file && existing.idImageUrl) {
        const oldPath = path.join(process.cwd(), existing.idImageUrl);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      existing.fullName = fullName.trim();
      existing.phone = phone.trim();
      existing.idNumber = idNumber.trim();
      existing.dateOfBirth = new Date(dateOfBirth);
      existing.address = { street: street?.trim() || '', city: city.trim(), country: country?.trim() || 'Israel' };
      existing.bio = bio?.trim() || '';
      existing.idImageUrl = idImageUrl;
      existing.status = 'pending';
      existing.rejectionReason = '';
      existing.reviewedAt = undefined;
      await existing.save();
      return res.json({ application: existing });
    }

    // New application — ID image required
    if (!req.file) {
      return res.status(400).json({ error: 'ID document image is required' });
    }

    const application = await SellerApplication.create({
      user: req.user.id,
      fullName: fullName.trim(),
      phone: phone.trim(),
      idNumber: idNumber.trim(),
      dateOfBirth: new Date(dateOfBirth),
      address: { street: street?.trim() || '', city: city.trim(), country: country?.trim() || 'Israel' },
      bio: bio?.trim() || '',
      idImageUrl: `/uploads/${req.file.filename}`,
    });

    res.status(201).json({ application });
  } catch (err: any) {
    if (req.file) fs.unlinkSync(req.file.path);
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
    const applications = await SellerApplication.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json({ applications });
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
          idImageUrl: application.idImageUrl,
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
