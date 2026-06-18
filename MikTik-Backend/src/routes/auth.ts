const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const router = express.Router();

const signToken = (userId: string, permissionLevel: number) =>
  jwt.sign({ id: userId, permissionLevel }, process.env.JWT_SECRET as string, { expiresIn: '7d' });

// POST /api/auth/register
router.post('/register', async (req: any, res: any) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim()) return res.status(400).json({ error: 'Name is required' });
    if (!email?.trim()) return res.status(400).json({ error: 'Email is required' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }
    if (!password) return res.status(400).json({ error: 'Password is required' });
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({
        error: 'An account with this email already exists. Please sign in instead.',
        code: 'EMAIL_EXISTS',
      });
    }

    const user = await User.create({ name: name.trim(), email, password });
    const token = signToken(user._id.toString(), user.permissionLevel);

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, permissionLevel: user.permissionLevel },
    });
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(409).json({
        error: 'An account with this email already exists. Please sign in instead.',
        code: 'EMAIL_EXISTS',
      });
    }
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = signToken(user._id.toString(), user.permissionLevel);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, permissionLevel: user.permissionLevel } });
  } catch {
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// GET /api/auth/me  (protected)
router.get('/me', authMiddleware, async (req: any, res: any) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    const userData = { id: user._id, name: user.name, email: user.email, permissionLevel: user.permissionLevel };
    const response: any = { user: userData };
    // Issue a fresh token if permissionLevel was changed since last login
    if (user.permissionLevel !== req.user.permissionLevel) {
      response.token = signToken(user._id.toString(), user.permissionLevel);
    }
    res.json(response);
  } catch {
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req: any, res: any) => {
  try {
    const { email } = req.body;
    if (!email?.trim()) return res.status(400).json({ error: 'Email is required' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    // Always respond with success to prevent email enumeration
    if (!user) return res.json({ message: 'If that email exists, a reset link has been sent.' });

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${rawToken}`;

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });

      try {
        await transporter.sendMail({
          from: `"MikTik" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: 'Reset your MikTik password',
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
              <h2 style="margin-bottom:8px">Reset your password</h2>
              <p style="color:#555;margin-bottom:24px">
                Click the button below to set a new password. This link expires in <strong>1 hour</strong>.
              </p>
              <a href="${resetUrl}" style="display:inline-block;background:#4f46e5;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">
                Reset password
              </a>
              <p style="color:#999;font-size:12px;margin-top:24px">
                If you didn't request this, you can safely ignore this email.
              </p>
            </div>
          `,
        });
        console.log(`[Email] Reset email sent to ${user.email}`);
      } catch (emailErr: any) {
        console.error('[Email] Failed to send reset email:', emailErr.message);
        // Still log the link so it can be used in dev even if email fails
        console.log(`[DEV fallback] Reset link: ${resetUrl}`);
      }
    } else {
      console.log(`\n[DEV] Password reset link for ${user.email}:\n${resetUrl}\n`);
    }

    res.json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req: any, res: any) => {
  try {
    const { token, password } = req.body;
    if (!token) return res.status(400).json({ error: 'Reset token is required' });
    if (!password) return res.status(400).json({ error: 'Password is required' });
    if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) return res.status(400).json({ error: 'Reset link is invalid or has expired.' });

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: 'Password updated successfully. You can now sign in.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// POST /api/auth/google
router.post('/google', async (req: any, res: any) => {
  try {
    const { credential, access_token } = req.body;

    let email: string, name: string | undefined, googleId: string;

    if (access_token) {
      const r = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      if (!r.ok) return res.status(401).json({ error: 'Invalid Google access token' });
      const info: any = await r.json();
      if (!info.email) return res.status(401).json({ error: 'Could not retrieve email from Google' });
      email = info.email;
      name = info.name;
      googleId = info.id;
    } else if (credential) {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        return res.status(401).json({ error: 'Invalid Google token' });
      }
      email = payload.email;
      name = payload.name;
      googleId = payload.sub;
    } else {
      return res.status(400).json({ error: 'Google credential or access_token is required' });
    }

    let user = await User.findOne({ $or: [{ googleId }, { email: email.toLowerCase() }] });
    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
      user = await User.create({ name: name || email.split('@')[0], email: email.toLowerCase(), googleId });
    }

    const token = signToken(user._id.toString(), user.permissionLevel);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, permissionLevel: user.permissionLevel } });
  } catch (err: any) {
    console.error('Google auth error:', err);
    res.status(500).json({ error: 'Google authentication failed' });
  }
});

module.exports = router;
