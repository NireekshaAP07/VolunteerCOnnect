const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ─── In-Memory Database ───────────────────────────────────────────────────────
const db = {
  users: {},          // keyed by Firebase UID
  events: [],
  registrations: [],
  attendance: [],
  nextEventId: 3,
};

// Seed sample events
db.events.push(
  {
    id: 1,
    title: 'Beach Cleanup Drive',
    description: 'Join us for a massive beach cleanup drive at Marine Drive. We aim to collect over 500kg of plastic waste and ensure it is recycled properly. Volunteers will be provided with gloves, bags, and refreshments.',
    category: 'Environment',
    location_name: 'Marine Drive, Mumbai',
    date_time: '2026-05-15T08:00:00',
    volunteers_required: 50,
    volunteers_joined: 32,
    skills_required: 'None required',
    perks: 'Certificate of Participation, Reward Points',
    food_provided: true,
    contact_details: 'contact@greenearth.org',
    ngo_id: 'sample-ngo-1',
    ngo_name: 'Green Earth Foundation',
    points: 40,
    image: 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&q=80&w=800',
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Teaching Kids at NGO',
    description: 'Help educate underprivileged children in Dharavi. Join our dedicated educators in making a lasting difference in young lives through interactive learning.',
    category: 'Education',
    location_name: 'Dharavi, Mumbai',
    date_time: '2026-05-18T10:30:00',
    volunteers_required: 20,
    volunteers_joined: 8,
    skills_required: 'Teaching, Communication',
    perks: 'Certificate, Lunch Provided',
    food_provided: true,
    contact_details: 'info@shiksha.org',
    ngo_id: 'sample-ngo-2',
    ngo_name: 'Shiksha Help',
    points: 60,
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800',
    created_at: new Date().toISOString(),
  }
);

// ─── Gemini Helper ────────────────────────────────────────────────────────────
async function enhanceWithGemini(title, description) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return { description, category: 'Community' };
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const [descRes, catRes] = await Promise.all([
      model.generateContent(
        `Improve this volunteering event description to be engaging and professional. Keep it under 150 words.\n\nTitle: ${title}\nOriginal: ${description}\n\nImproved description:`
      ),
      model.generateContent(
        `Categorize this volunteering event into EXACTLY ONE of: Education, Health, Environment, Relief, Animals, Community.\n\nTitle: ${title}\nDescription: ${description}\n\nCategory (single word only):`
      ),
    ]);

    return {
      description: descRes.response.text().trim(),
      category: catRes.response.text().trim().split('\n')[0],
    };
  } catch (e) {
    console.log('Gemini skipped:', e.message);
    return { description, category: 'Community' };
  }
}

// ─── Health ───────────────────────────────────────────────────────────────────
app.get('/', (req, res) => res.json({ message: 'VolunteerConnect API running 🚀' }));
app.get('/health', (req, res) => res.json({ status: 'healthy' }));

// ─── USER ROUTES ──────────────────────────────────────────────────────────────
// Create or update user profile (called on signup)
app.post('/api/users', (req, res) => {
  const { uid, name, email, role } = req.body;
  if (!uid || !email) return res.status(400).json({ error: 'uid and email are required' });

  db.users[uid] = {
    uid,
    name: name || '',
    email,
    role: role || 'volunteer',
    points: db.users[uid]?.points || 0,
    created_at: db.users[uid]?.created_at || new Date().toISOString(),
  };
  res.status(201).json(db.users[uid]);
});

// Get user profile
app.get('/api/users/:uid', (req, res) => {
  const user = db.users[req.params.uid];
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// ─── EVENT ROUTES ─────────────────────────────────────────────────────────────
// List all events (with optional ngo_id filter)
app.get('/api/events', (req, res) => {
  const { ngo_id } = req.query;
  let events = db.events;
  if (ngo_id) events = events.filter(e => e.ngo_id === ngo_id);
  res.json(events);
});

// Get single event
app.get('/api/events/:id', (req, res) => {
  const event = db.events.find(e => e.id === parseInt(req.params.id));
  if (!event) return res.status(404).json({ error: 'Event not found' });
  res.json(event);
});

// Create event (NGO only)
app.post('/api/events', async (req, res) => {
  const {
    title, description, location_name, date_time,
    volunteers_required, skills_required, perks,
    food_provided, contact_details, ngo_id, ngo_name,
  } = req.body;

  if (!title || !description || !location_name || !date_time || !ngo_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const { description: enhancedDesc, category } = await enhanceWithGemini(title, description);

  const event = {
    id: db.nextEventId++,
    title,
    description: enhancedDesc,
    category,
    location_name,
    date_time,
    volunteers_required: parseInt(volunteers_required) || 10,
    volunteers_joined: 0,
    skills_required: skills_required || '',
    perks: perks || '',
    food_provided: Boolean(food_provided),
    contact_details: contact_details || '',
    ngo_id,
    ngo_name: ngo_name || '',
    points: Math.min(100, Math.max(20, Math.floor((parseInt(volunteers_required) || 10) * 0.5 + 20))),
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=800',
    created_at: new Date().toISOString(),
  };

  db.events.push(event);
  res.status(201).json(event);
});

// ─── REGISTRATION ROUTES ──────────────────────────────────────────────────────
// Register volunteer for event
app.post('/api/registrations', (req, res) => {
  const { user_id, event_id } = req.body;
  if (!user_id || !event_id) return res.status(400).json({ error: 'user_id and event_id required' });

  const alreadyRegistered = db.registrations.find(
    r => r.user_id === user_id && r.event_id === parseInt(event_id)
  );
  if (alreadyRegistered) return res.status(409).json({ error: 'Already registered for this event' });

  const event = db.events.find(e => e.id === parseInt(event_id));
  if (!event) return res.status(404).json({ error: 'Event not found' });

  const reg = {
    id: db.registrations.length + 1,
    user_id,
    event_id: parseInt(event_id),
    registered_at: new Date().toISOString(),
  };
  db.registrations.push(reg);
  event.volunteers_joined = (event.volunteers_joined || 0) + 1;

  res.status(201).json(reg);
});

// Get registrations (by user or event)
app.get('/api/registrations', (req, res) => {
  const { user_id, event_id } = req.query;
  let result = db.registrations;
  if (user_id) result = result.filter(r => r.user_id === user_id);
  if (event_id) result = result.filter(r => r.event_id === parseInt(event_id));
  res.json(result);
});

// ─── ATTENDANCE + POINTS ──────────────────────────────────────────────────────
// NGO verifies attendance → awards points to volunteer
app.post('/api/attendance/verify', (req, res) => {
  const { user_id, event_id } = req.body;

  const event = db.events.find(e => e.id === parseInt(event_id));
  if (!event) return res.status(404).json({ error: 'Event not found' });

  const alreadyVerified = db.attendance.find(
    a => a.user_id === user_id && a.event_id === parseInt(event_id)
  );
  if (alreadyVerified) return res.status(409).json({ error: 'Already verified' });

  if (db.users[user_id]) {
    db.users[user_id].points = (db.users[user_id].points || 0) + event.points;
  }

  const record = {
    id: db.attendance.length + 1,
    user_id,
    event_id: parseInt(event_id),
    verified_at: new Date().toISOString(),
    points_awarded: event.points,
  };
  db.attendance.push(record);

  res.json({
    success: true,
    points_awarded: event.points,
    total_points: db.users[user_id]?.points || event.points,
  });
});

// Get attendance records
app.get('/api/attendance', (req, res) => {
  const { user_id, event_id } = req.query;
  let result = db.attendance;
  if (user_id) result = result.filter(a => a.user_id === user_id);
  if (event_id) result = result.filter(a => a.event_id === parseInt(event_id));
  res.json(result);
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ VolunteerConnect API running on http://localhost:${PORT}`));