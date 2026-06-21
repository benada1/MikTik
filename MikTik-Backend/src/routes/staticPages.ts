const express = require('express');
const StaticPage = require('../models/StaticPage');
const authMiddleware = require('../middleware/auth');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

const DEFAULT_CONTENT: Record<string, string> = {
  'privacy-policy': `Privacy Policy

Last updated: June 2025

1. Information We Collect
MikTik collects information you provide directly to us, such as your name, email address, and payment information when you create an account or make a transaction. We also collect information automatically when you use our services, including log data, device information, and usage data.

2. How We Use Your Information
We use the information we collect to:
- Provide, maintain, and improve our services
- Process transactions and send related information
- Send promotional communications (you may opt out at any time)
- Respond to comments, questions, and customer service requests
- Monitor and analyze usage patterns

3. Information Sharing
We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our platform, provided they agree to keep this information confidential.

4. Data Security
We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.

5. Cookies
We use cookies and similar tracking technologies to track activity on our platform and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.

6. Your Rights
You have the right to access, update, or delete the information we hold about you. You may also object to processing of your personal information and request data portability.

7. Contact Us
If you have any questions about this Privacy Policy, please contact us at support@miktik.co.il.`,

  'terms-of-service': `Terms of Service

Last updated: June 2025

1. Acceptance of Terms
By accessing and using MikTik, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.

2. Description of Service
MikTik is a peer-to-peer ticket marketplace that allows users to buy and sell event tickets. All transactions are protected by our escrow system, ensuring funds are only released when the buyer confirms receipt.

3. User Accounts
You must register for an account to use most features of MikTik. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.

4. Seller Requirements
To list tickets for sale, you must apply for and be approved as a seller. By becoming a seller, you agree to:
- List only tickets you legally own
- Provide accurate and complete ticket information
- Transfer tickets promptly upon purchase
- Honor all completed sales

5. Buyer Protections
MikTik offers buyer protection on all eligible transactions. If you do not receive the tickets you purchased, or if the tickets are materially different from the listing, you may be eligible for a refund.

6. Prohibited Activities
Users are prohibited from:
- Listing counterfeit or invalid tickets
- Creating multiple accounts to circumvent restrictions
- Manipulating prices or engaging in fraudulent activity
- Harassing or threatening other users

7. Fees and Payments
MikTik charges a service fee on completed transactions. All fees are clearly displayed before you confirm a purchase or listing.

8. Dispute Resolution
In the event of a dispute between buyers and sellers, MikTik provides a mediation service through our Dispute Center. Our team will review the case and make a final decision.

9. Limitation of Liability
MikTik is not liable for any indirect, incidental, special, or consequential damages resulting from your use of the platform.

10. Changes to Terms
We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.

11. Contact Us
For questions about these Terms of Service, contact us at support@miktik.co.il.`,
};

// GET /api/static-pages/:slug — public
router.get('/:slug', async (req: any, res: any) => {
  try {
    const { slug } = req.params;
    if (!DEFAULT_CONTENT[slug]) return res.status(404).json({ error: 'Page not found' });

    const page = await StaticPage.findOne({ slug });
    if (!page) {
      return res.json({ slug, content: DEFAULT_CONTENT[slug], updatedAt: null });
    }
    res.json({ slug: page.slug, content: page.content, updatedAt: page.updatedAt });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/static-pages/:slug — admin only
router.put('/:slug', authMiddleware, requireAdmin, async (req: any, res: any) => {
  try {
    const { slug } = req.params;
    const { content } = req.body;
    if (!DEFAULT_CONTENT[slug]) return res.status(404).json({ error: 'Page not found' });
    if (typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const page = await StaticPage.findOneAndUpdate(
      { slug },
      { content: content.trim(), updatedBy: req.user.id },
      { new: true, upsert: true }
    );
    res.json({ slug: page.slug, content: page.content, updatedAt: page.updatedAt });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
