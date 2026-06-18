type Lang = 'en' | 'he';

const translations: Record<Lang, Record<string, string>> = {
  en: {
    // Navbar
    'nav.marketplace': 'Marketplace',
    'nav.sell': 'Sell Tickets',
    'nav.becomeSeller': 'Become a Seller',
    'nav.myTickets': 'My Tickets',
    'nav.signIn': 'Sign in',
    'nav.getStarted': 'Get started',

    // Hero
    'hero.badge': "Israel's most trusted ticket marketplace",
    'hero.title1': 'Buy & sell tickets',
    'hero.title2': 'with full confidence',
    'hero.subtitle':
      'Escrow-protected payments, AI fraud detection, and ID-verified sellers. The safest way to buy and sell tickets for events across Israel.',
    'hero.browseTickets': 'Browse tickets',
    'hero.sellTickets': 'Sell your tickets',
    'hero.trust.payments': 'Trusted payments',
    'hero.trust.ai': 'AI fraud detection',
    'hero.trust.transfer': 'Instant transfer',

    // Stats
    'stats.ticketsSold': 'Tickets sold',
    'stats.satisfactionRate': 'Satisfaction rate',
    'stats.fraudLosses': 'Fraud losses',
    'stats.support': 'Support',

    // Categories section
    'section.categories.title': 'Browse by category',
    'section.categories.sub': 'Find tickets for every type of event',
    'section.viewAll': 'View all',
    'category.sports': 'Sports',
    'category.concerts': 'Concerts',
    'category.theater': 'Theater',
    'category.festivals': 'Festivals',
    'category.comedy': 'Comedy',
    'category.standup': 'Stand-Up',

    // Featured events section
    'section.featured.title': 'Featured events',
    'section.featured.sub': 'Hand-picked verified listings',
    'event.verified': 'Verified',

    // Event categories (used on cards)
    'category.concert': 'Concert',
    'category.sports_card': 'Sports',
    'category.festival': 'Festival',
    'category.theatre': 'Theater',

    // Month abbreviations
    'month.mar': 'Mar',
    'month.apr': 'Apr',

    // Event names / venues / cities
    'event.1.name': 'Tel Aviv Music Festival',
    'event.1.venue': 'Yarkon Park',
    'event.1.city': 'Tel Aviv',
    'event.5.name': 'Maccabi TLV vs Real Madrid',
    'event.5.venue': 'Menora Mivtachim Arena',
    'event.5.city': 'Tel Aviv',
    'event.3.name': 'Habima – The Dybbuk',
    'event.3.venue': 'Habima National Theatre',
    'event.3.city': 'Tel Aviv',
    'event.4.name': 'InDNegev Festival 2025',
    'event.4.venue': 'Negev Desert',
    'event.4.city': 'Beer Sheva',

    // How it works
    'howItWorks.title': 'How it works',
    'howItWorks.sub': 'Our escrow system protects buyers and sellers at every step.',
    'step.1.title': 'Find your event',
    'step.1.desc': 'Browse thousands of verified listings — concerts, sports, theater, and more.',
    'step.2.title': 'Pay securely',
    'step.2.desc': 'Payment held in escrow — released only after you confirm receipt.',
    'step.3.title': 'Get your tickets',
    'step.3.desc': 'Seller transfers tickets. You confirm. Funds release. Done.',

    // Features
    'features.title': 'Everything you need',
    'features.sub': 'Designed to eliminate fraud and protect every transaction.',
    'feature.escrow.title': 'Escrow Protection',
    'feature.escrow.desc': 'Payment held securely until you confirm ticket receipt. Zero risk.',
    'feature.sellers.title': 'Verified Sellers',
    'feature.sellers.desc': 'Every seller is ID-verified and rated by real buyers.',
    'feature.transfer.title': 'Instant Transfer',
    'feature.transfer.desc': 'Digital tickets transferred automatically on payment confirmation.',
    'feature.payments.title': 'Secure Payments',
    'feature.payments.desc': 'All transactions encrypted. Cards, PayPal & bank transfer supported.',
    'feature.dispute.title': 'Dispute Resolution',
    'feature.dispute.desc': 'Our team mediates any issues fast. Full buyer protection on every order.',
    'feature.ratings.title': 'Seller Ratings',
    'feature.ratings.desc': 'Transparent reviews and ratings to buy with confidence.',

    // CTA
    'cta.title': 'Join 50,000+ Israelis trading safely',
    'cta.sub': 'Sign up in seconds and start buying or selling with full fraud protection.',
    'cta.createAccount': 'Create free account',
    'cta.browse': 'Browse tickets',

    // Footer
    'footer.tagline': "Israel's most secure ticket marketplace. Every transaction escrow-protected.",
    'footer.escrow': 'Escrow protected · ID verified',
    'footer.copyright': '© 2025 MikTik. All rights reserved.',
    'footer.licensed': 'Secure ticket exchange · Licensed in Israel',
    'footer.section.marketplace': 'Marketplace',
    'footer.section.support': 'Support',
    'footer.section.account': 'Account',
    'footer.browseTickets': 'Browse Tickets',
    'footer.sellTickets': 'Sell Tickets',
    'footer.becomeSeller': 'Become a Seller',
    'footer.myPurchases': 'My Purchases',
    'footer.myListings': 'My Listings',
    'footer.disputeCenter': 'Dispute Center',
    'footer.wallet': 'Wallet & Payments',
    'footer.howItWorks': 'How It Works',
    'footer.safetyGuide': 'Safety Guide',
    'footer.signIn': 'Sign In',
    'footer.register': 'Register',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
  },

  he: {
    // Navbar
    'nav.marketplace': 'שוק',
    'nav.sell': 'מכור כרטיסים',
    'nav.becomeSeller': 'הפוך למוכר',
    'nav.myTickets': 'הכרטיסים שלי',
    'nav.signIn': 'כניסה',
    'nav.getStarted': 'התחל',

    // Hero
    'hero.badge': 'שוק הכרטיסים המהימן ביותר בישראל',
    'hero.title1': 'קנה ומכור כרטיסים',
    'hero.title2': 'בביטחון מלא',
    'hero.subtitle':
      'תשלומים מוגנים בנאמנות, זיהוי הונאות בבינה מלאכותית ומוכרים עם אימות זהות. הדרך הבטוחה ביותר לקנות ולמכור כרטיסים לאירועים ברחבי ישראל.',
    'hero.browseTickets': 'עיין בכרטיסים',
    'hero.sellTickets': 'מכור את הכרטיסים שלך',
    'hero.trust.payments': 'תשלומים מהימנים',
    'hero.trust.ai': 'זיהוי הונאות בבינה מלאכותית',
    'hero.trust.transfer': 'העברה מיידית',

    // Stats
    'stats.ticketsSold': 'כרטיסים נמכרו',
    'stats.satisfactionRate': 'שיעור שביעות רצון',
    'stats.fraudLosses': 'הפסדי הונאה',
    'stats.support': 'תמיכה',

    // Categories section
    'section.categories.title': 'עיין לפי קטגוריה',
    'section.categories.sub': 'מצא כרטיסים לכל סוג אירוע',
    'section.viewAll': 'הצג הכל',
    'category.sports': 'ספורט',
    'category.concerts': 'קונצרטים',
    'category.theater': 'תיאטרון',
    'category.festivals': 'פסטיבלים',
    'category.comedy': 'קומדיה',
    'category.standup': 'סטנד-אפ',

    // Featured events section
    'section.featured.title': 'אירועים מובחרים',
    'section.featured.sub': 'מודעות מאומתות שנבחרו בקפידה',
    'event.verified': 'מאומת',

    // Event categories (used on cards)
    'category.concert': 'קונצרט',
    'category.sports_card': 'ספורט',
    'category.festival': 'פסטיבל',
    'category.theatre': 'תיאטרון',

    // Month abbreviations
    'month.mar': "מרץ",
    'month.apr': "אפר׳",

    // Event names / venues / cities
    'event.1.name': 'פסטיבל המוזיקה של תל אביב',
    'event.1.venue': 'פארק הירקון',
    'event.1.city': 'תל אביב',
    'event.5.name': 'מכבי תל אביב נגד ריאל מדריד',
    'event.5.venue': 'מנורה מבטחים אריינה',
    'event.5.city': 'תל אביב',
    'event.3.name': 'הבימה – הדיבוק',
    'event.3.venue': 'תיאטרון הבימה הלאומי',
    'event.3.city': 'תל אביב',
    'event.4.name': 'פסטיבל ינגב 2025',
    'event.4.venue': 'מדבר הנגב',
    'event.4.city': 'באר שבע',

    // How it works
    'howItWorks.title': 'איך זה עובד',
    'howItWorks.sub': 'מערכת הנאמנות שלנו מגינה על קונים ומוכרים בכל שלב.',
    'step.1.title': 'מצא את האירוע שלך',
    'step.1.desc': 'עיין באלפי מודעות מאומתות — קונצרטים, ספורט, תיאטרון ועוד.',
    'step.2.title': 'שלם בבטחה',
    'step.2.desc': 'התשלום מוחזק בנאמנות — משוחרר רק לאחר שאתה מאשר קבלה.',
    'step.3.title': 'קבל את הכרטיסים שלך',
    'step.3.desc': 'המוכר מעביר את הכרטיסים. אתה מאשר. הכספים משוחררים. סיום.',

    // Features
    'features.title': 'כל מה שאתה צריך',
    'features.sub': 'נועד לחסל הונאות ולהגן על כל עסקה.',
    'feature.escrow.title': 'הגנת נאמנות',
    'feature.escrow.desc': 'התשלום מוחזק בבטחה עד שאתה מאשר קבלת הכרטיס. אפס סיכון.',
    'feature.sellers.title': 'מוכרים מאומתים',
    'feature.sellers.desc': 'כל מוכר עובר אימות זהות ומדורג על ידי קונים אמיתיים.',
    'feature.transfer.title': 'העברה מיידית',
    'feature.transfer.desc': 'כרטיסים דיגיטליים מועברים אוטומטית עם אישור התשלום.',
    'feature.payments.title': 'תשלומים מאובטחים',
    'feature.payments.desc': 'כל העסקאות מוצפנות. נתמכות כרטיסי אשראי, PayPal והעברה בנקאית.',
    'feature.dispute.title': 'פתרון סכסוכים',
    'feature.dispute.desc': 'הצוות שלנו מגשר על כל בעיה במהירות. הגנת קונה מלאה בכל הזמנה.',
    'feature.ratings.title': 'דירוגי מוכרים',
    'feature.ratings.desc': 'ביקורות ודירוגים שקופים לקנייה בביטחון.',

    // CTA
    'cta.title': 'הצטרף ל-50,000+ ישראלים שסוחרים בבטחה',
    'cta.sub': 'הירשם תוך שניות והתחל לקנות או למכור עם הגנה מלאה מפני הונאות.',
    'cta.createAccount': 'צור חשבון חינמי',
    'cta.browse': 'עיין בכרטיסים',

    // Footer
    'footer.tagline': 'שוק הכרטיסים המאובטח ביותר בישראל. כל עסקה מוגנת בנאמנות.',
    'footer.escrow': 'מוגן בנאמנות · אומת זהות',
    'footer.copyright': '© 2025 MikTik. כל הזכויות שמורות.',
    'footer.licensed': 'מסחר כרטיסים מאובטח · מורשה בישראל',
    'footer.section.marketplace': 'שוק',
    'footer.section.support': 'תמיכה',
    'footer.section.account': 'חשבון',
    'footer.browseTickets': 'עיין בכרטיסים',
    'footer.sellTickets': 'מכור כרטיסים',
    'footer.becomeSeller': 'הפוך למוכר',
    'footer.myPurchases': 'הרכישות שלי',
    'footer.myListings': 'המודעות שלי',
    'footer.disputeCenter': 'מרכז סכסוכים',
    'footer.wallet': 'ארנק ותשלומים',
    'footer.howItWorks': 'איך זה עובד',
    'footer.safetyGuide': 'מדריך בטיחות',
    'footer.signIn': 'כניסה',
    'footer.register': 'הרשמה',
    'footer.privacy': 'מדיניות פרטיות',
    'footer.terms': 'תנאי שימוש',
  },
};

export type { Lang };
export { translations };
