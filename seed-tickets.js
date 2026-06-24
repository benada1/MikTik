const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/miktik';

const ticketSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true, enum: ['Concert', 'Sports', 'Theater', 'Festival', 'Comedy', 'Other'] },
  date: { type: Date, required: true },
  startTime: { type: String, default: '' },
  venue: { type: String, required: true },
  city: { type: String, required: true },
  section: { type: String, default: '' },
  row: { type: String, default: '' },
  seat: { type: String, default: '' },
  seatDetails: [{ section: String, row: String, seat: String }],
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  available: { type: Number, required: true, default: 1 },
  description: { type: String, default: '' },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sellerName: { type: String },
  sellerRating: { type: Number, default: 0 },
  sellerReviews: { type: Number, default: 0 },
  sellerSince: { type: String },
  verified: { type: Boolean, default: false },
  instant: { type: Boolean, default: false },
  bundleOnly: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'sold', 'pending'], default: 'active' },
  files: [{ type: String }],
}, { timestamps: true });

const userSchema = new mongoose.Schema({ name: String, email: String });

const Ticket = mongoose.model('Ticket', ticketSchema);
const User = mongoose.model('User', userSchema);

async function seed() {
  await mongoose.connect(MONGO_URI);

  const user = await User.findOne({ email: 'shellijineli@gmail.com' });
  if (!user) {
    console.log('User not found!');
    process.exit(1);
  }
  console.log('Found user:', user.name, user._id.toString());

  const now = new Date();
  const future = (daysAhead) => new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);

  const tickets = [
    { name: 'Imagine Dragons Live', category: 'Concert', date: future(10), startTime: '21:00', venue: 'Menora Mivtachim Arena', city: 'Tel Aviv', section: 'A', row: '3', seat: '14', price: 280, originalPrice: 350, available: 2, description: 'Floor seats, amazing view', verified: true, instant: true },
    { name: 'Metallica World Tour', category: 'Concert', date: future(15), startTime: '20:30', venue: 'Yarkon Park', city: 'Tel Aviv', section: 'Pit', row: '', seat: '', price: 420, originalPrice: 480, available: 1, description: 'Standing pit area', verified: false, instant: false },
    { name: 'Maccabi Tel Aviv vs Hapoel Jerusalem', category: 'Sports', date: future(7), startTime: '19:00', venue: 'Menora Mivtachim Arena', city: 'Tel Aviv', section: 'East Stand', row: '12', seat: '22', price: 150, originalPrice: 180, available: 4, description: 'Basketball league game', verified: true, instant: true },
    { name: 'Beitar Jerusalem vs Maccabi Haifa', category: 'Sports', date: future(12), startTime: '18:30', venue: 'Teddy Stadium', city: 'Jerusalem', section: 'South', row: '5', seat: '8', price: 90, originalPrice: 120, available: 3, description: 'Rival derby, great atmosphere', verified: false, instant: false },
    { name: 'Habima Theater - Hamlet', category: 'Theater', date: future(20), startTime: '20:00', venue: 'Habima National Theater', city: 'Tel Aviv', section: 'Balcony', row: '2', seat: '11', price: 180, originalPrice: 220, available: 2, description: 'Classic production, excellent seats', verified: true, instant: false },
    { name: 'Jerusalem Theater - The Cherry Orchard', category: 'Theater', date: future(25), startTime: '19:30', venue: 'Jerusalem Theater', city: 'Jerusalem', section: 'Main Hall', row: '7', seat: '5', price: 160, originalPrice: 200, available: 1, description: 'Award-winning performance', verified: false, instant: true },
    { name: 'TomorrowLand Israel Edition', category: 'Festival', date: future(30), startTime: '12:00', venue: 'HaYarkon Park', city: 'Tel Aviv', section: 'General', row: '', seat: '', price: 350, originalPrice: 400, available: 5, description: 'Full day EDM festival', verified: true, instant: true },
    { name: 'Jazz & Blues Night Festival', category: 'Festival', date: future(18), startTime: '18:00', venue: 'Sultan Pool', city: 'Jerusalem', section: 'VIP', row: '', seat: '', price: 250, originalPrice: 300, available: 2, description: 'VIP area with best sound', verified: true, instant: false },
    { name: 'Ido Rosenberg Stand-Up', category: 'Comedy', date: future(8), startTime: '21:30', venue: 'Zappa Club', city: 'Tel Aviv', section: 'Table', row: '', seat: '', price: 120, originalPrice: 150, available: 2, description: 'Sold out show, tickets hard to find', verified: false, instant: true },
    { name: 'Avi Maoz Comedy Night', category: 'Comedy', date: future(14), startTime: '21:00', venue: 'Culture Palace', city: 'Haifa', section: 'Row B', row: 'B', seat: '9', price: 95, originalPrice: 120, available: 3, description: 'Great show, close to stage', verified: false, instant: false },
    { name: 'DJ Tiesto Live Set', category: 'Concert', date: future(22), startTime: '23:00', venue: 'The Block', city: 'Tel Aviv', section: 'Dance Floor', row: '', seat: '', price: 200, originalPrice: 240, available: 1, description: 'Rare club performance', verified: true, instant: true },
    { name: 'Tel Aviv Marathon - Running Bib', category: 'Sports', date: future(45), startTime: '07:00', venue: 'Rabin Square', city: 'Tel Aviv', section: 'Wave B', row: '', seat: '', price: 80, originalPrice: 100, available: 1, description: 'Official entry bib, wave B start', verified: false, instant: true },
    { name: 'Haifa Symphony Orchestra', category: 'Other', date: future(35), startTime: '20:00', venue: 'Haifa Auditorium', city: 'Haifa', section: 'Front Rows', row: '3', seat: '17', price: 140, originalPrice: 180, available: 2, description: 'Beethoven & Mozart program', verified: true, instant: false },
    { name: 'Cirque du Soleil - ECHO', category: 'Other', date: future(40), startTime: '18:00', venue: 'Exhibition Center', city: 'Tel Aviv', section: 'Category 1', row: '4', seat: '20', price: 320, originalPrice: 380, available: 2, description: 'Best seats in category 1', verified: true, instant: true },
    { name: 'Asaf Avidan Acoustic Tour', category: 'Concert', date: future(28), startTime: '21:00', venue: 'Zappa Herzliya', city: 'Herzliya', section: 'Standing', row: '', seat: '', price: 190, originalPrice: 230, available: 3, description: 'Intimate acoustic set, one of a kind', verified: false, instant: false },
    { name: 'Omer Adam Summer Concert', category: 'Concert', date: future(50), startTime: '21:00', venue: 'Caesarea Amphitheater', city: 'Caesarea', section: 'B', row: '8', seat: '3', price: 310, originalPrice: 360, available: 2, description: 'Outdoor amphitheater, magical night', verified: true, instant: true },
    { name: 'Tel Aviv Pride Parade Party', category: 'Festival', date: future(60), startTime: '14:00', venue: 'Charles Clore Park', city: 'Tel Aviv', section: 'VIP Tent', row: '', seat: '', price: 180, originalPrice: 220, available: 6, description: 'VIP area with full bar', verified: true, instant: true },
    { name: 'Maccabi Haifa Champions League', category: 'Sports', date: future(9), startTime: '21:45', venue: 'Sammy Ofer Stadium', city: 'Haifa', section: 'North Stand', row: '4', seat: '15', price: 220, originalPrice: 260, available: 2, description: 'European night at Sammy Ofer', verified: true, instant: false },
    { name: 'The Lion King Musical', category: 'Theater', date: future(55), startTime: '19:30', venue: 'Cameri Theater', city: 'Tel Aviv', section: 'Orchestra', row: '5', seat: '12', price: 240, originalPrice: 280, available: 2, description: 'Best show in town, orchestra seats', verified: true, instant: true },
    { name: 'Lior Shlein Comedy Special', category: 'Comedy', date: future(17), startTime: '21:00', venue: 'Beit Mapa', city: 'Tel Aviv', section: 'General', row: 'C', seat: '7', price: 110, originalPrice: 140, available: 1, description: 'Last available ticket for this show', verified: false, instant: true },
  ];

  let created = 0;
  for (const t of tickets) {
    const seatDetails = t.seat ? [{ section: t.section, row: t.row, seat: t.seat }] : [];
    await Ticket.create({
      ...t,
      seller: user._id,
      sellerName: user.name,
      sellerRating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
      sellerReviews: Math.floor(Math.random() * 50) + 5,
      sellerSince: '2024',
      seatDetails,
    });
    created++;
    console.log('Created:', t.name);
  }

  console.log('\nDone! Created', created, 'tickets for', user.name, '(' + user.email + ')');
  await mongoose.disconnect();
}

seed().catch(e => { console.error(e); process.exit(1); });
