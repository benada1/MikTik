const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const Ticket = require('../models/Ticket');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req: any, _file: any, cb: any) => cb(null, uploadsDir),
  filename: (_req: any, file: any, cb: any) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
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

// GET /api/tickets
router.get('/', async (req: any, res: any) => {
  try {
    const { category, city, maxPrice, verified, instant, sort, search, limit } = req.query;

    const query: any = { status: 'active' };

    if (category && category !== 'All') query.category = category;
    if (city && city !== 'All Cities') query.city = city;
    if (maxPrice) query.price = { $lte: Number(maxPrice) };
    if (verified === 'true') query.verified = true;
    if (instant === 'true') query.instant = true;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } },
      ];
    }

    let sortObj: any = { createdAt: -1 };
    if (sort === 'price-asc') sortObj = { price: 1 };
    if (sort === 'price-desc') sortObj = { price: -1 };
    if (sort === 'popular') sortObj = { views: -1 };

    let q = Ticket.find(query).sort(sortObj);
    if (limit) q = q.limit(Number(limit));

    const tickets = await q;
    res.json({ tickets });
  } catch (err: any) {
    console.error('Get tickets error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/tickets/my — authenticated seller's own listings
router.get('/my', authMiddleware, async (req: any, res: any) => {
  try {
    const tickets = await Ticket.find({ seller: req.user.id }).sort({ createdAt: -1 });
    res.json({ tickets });
  } catch (err: any) {
    console.error('Get my tickets error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/tickets/:id — only the seller can delete their own listing
router.delete('/:id', authMiddleware, async (req: any, res: any) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    if (ticket.seller?.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    await ticket.deleteOne();
    if (ticket.files?.length) {
      ticket.files.forEach((f: string) => {
        const fullPath = path.join(process.cwd(), f);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      });
    }
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/tickets/:id
router.get('/:id', async (req: any, res: any) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    res.json({ ticket });
  } catch {
    res.status(404).json({ error: 'Ticket not found' });
  }
});

// POST /api/tickets (authenticated, multipart/form-data)
router.post('/', authMiddleware, upload.array('files', 5), async (req: any, res: any) => {
  try {
    const { name, category, date, venue, city, section, row, qty, price, originalPrice, description, instant } = req.body;

    if (!name || !category || !date || !venue || !city || !price) {
      if (req.files) {
        (req.files as any[]).forEach((f: any) => fs.unlinkSync(f.path));
      }
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const user = await User.findById(req.user.id).select('name');

    const filePaths = ((req.files as any[]) || []).map(
      (f: any) => `/uploads/${f.filename}`
    );

    const ticket = await Ticket.create({
      name: name.trim(),
      category,
      date: new Date(date),
      venue: venue.trim(),
      city: city.trim(),
      section: section?.trim() || '',
      row: row?.trim() || '',
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : Number(price),
      available: qty ? Number(qty) : 1,
      description: description?.trim() || '',
      seller: req.user.id,
      sellerName: user?.name || 'Unknown',
      sellerRating: 0,
      sellerReviews: 0,
      sellerSince: new Date().getFullYear().toString(),
      verified: false,
      instant: instant === 'true',
      files: filePaths,
    });

    res.status(201).json({ ticket });
  } catch (err: any) {
    if (req.files) {
      (req.files as any[]).forEach((f: any) => {
        if (fs.existsSync(f.path)) fs.unlinkSync(f.path);
      });
    }
    console.error('Create ticket error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
