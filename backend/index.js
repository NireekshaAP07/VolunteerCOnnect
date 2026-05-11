const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const usersColl = db.collection('users');
const eventsColl = db.collection('events');
const regsColl = db.collection('registrations');
const attendanceColl = db.collection('attendance');

// Helper to get consistent event details for attendance
const getEventDetails = (eventData) => ({
  title: eventData?.title || 'Unknown Event',
  description: eventData?.description || '',
  date_time: eventData?.date_time || null,
  ngo_name: eventData?.ngo_name || 'VolunteerConnect',
  custom_appreciation: eventData?.custom_appreciation || null,
});

// (Sample data is now handled via the frontend or manual entry in Firestore)

// ─── Gemini Helper ────────────────────────────────────────────────────────────
async function enhanceWithGemini(title, description) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return { description, category: 'Community' };
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

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

app.post('/api/ai/enhance', async (req, res) => {
  const text = req.body?.text?.trim();
  if (!text) return res.status(400).json({ detail: 'Text is required' });

  const { description } = await enhanceWithGemini('Draft Event', text);
  res.json({ improved_text: description, category: null });
});

// ─── USER ROUTES ──────────────────────────────────────────────────────────────
// Create or update user profile (called on signup)
app.post('/api/users', async (req, res) => {
  try {
    const { uid, name, email, role } = req.body;
    if (!uid || !email) return res.status(400).json({ error: 'uid and email are required' });

    const userDoc = usersColl.doc(uid);
    const existing = await userDoc.get();

    const userData = {
      uid,
      name: name || '',
      email,
      role: role || 'volunteer',
      points: existing.exists ? (existing.data().points || 0) : 0,
      updated_at: new Date().toISOString(),
    };

    if (!existing.exists) {
      userData.created_at = new Date().toISOString();
    }

    await userDoc.set(userData, { merge: true });
    res.status(201).json(userData);
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ error: 'Failed to save user' });
  }
});

// Get user profile
app.get('/api/users/:uid', async (req, res) => {
  try {
    const doc = await usersColl.doc(req.params.uid).get();
    if (!doc.exists) return res.status(404).json({ error: 'User not found' });
    res.json(doc.data());
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// ─── EVENT ROUTES ─────────────────────────────────────────────────────────────
// List all events (with optional ngo_id filter)
app.get('/api/events', async (req, res) => {
  try {
    const { ngo_id } = req.query;
    let query = eventsColl;
    if (ngo_id) query = query.where('ngo_id', '==', ngo_id);
    
    const snapshot = await query.get();
    const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get single event
app.get('/api/events/:id', async (req, res) => {
  try {
    const doc = await eventsColl.doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Event not found' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// Create event (NGO only)
app.post('/api/events', async (req, res) => {
  try {
    const {
      title, description, location_name, date_time,
      volunteers_required, skills_required, perks,
      food_provided, contact_details, ngo_id, ngo_name, custom_appreciation,
    } = req.body;

    if (!title || !description || !location_name || !date_time || !ngo_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { description: enhancedDesc, category } = await enhanceWithGemini(title, description);

    const event = {
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
      custom_appreciation: custom_appreciation || null,
      points: Math.min(100, Math.max(20, Math.floor((parseInt(volunteers_required) || 10) * 0.5 + 20))),
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=800',
      created_at: new Date().toISOString(),
    };

    const docRef = await eventsColl.add(event);
    res.status(201).json({ id: docRef.id, ...event });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Update event (NGO owner only)
app.put('/api/events/:id', async (req, res) => {
  try {
    const docRef = eventsColl.doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ error: 'Event not found' });
    const event = doc.data();

    const {
      title, description, location_name, date_time,
      volunteers_required, skills_required, perks,
      food_provided, contact_details, ngo_id, ngo_name,
      custom_appreciation,
    } = req.body;

    if (ngo_id && event.ngo_id !== ngo_id) {
      return res.status(403).json({ error: 'You do not have permission to edit this event' });
    }

    const shouldReEnhance = title && description && (title !== event.title || description !== event.description);
    const enhanced = shouldReEnhance
      ? await enhanceWithGemini(title, description)
      : { description: description ?? event.description, category: event.category };

    const updates = {
      title: title ?? event.title,
      description: enhanced.description,
      category: enhanced.category ?? event.category,
      location_name: location_name ?? event.location_name,
      date_time: date_time ?? event.date_time,
      volunteers_required: parseInt(volunteers_required, 10) || event.volunteers_required,
      skills_required: skills_required ?? event.skills_required,
      perks: perks ?? event.perks,
      food_provided: typeof food_provided === 'boolean' ? food_provided : event.food_provided,
      contact_details: contact_details ?? event.contact_details,
      ngo_id: ngo_id ?? event.ngo_id,
      ngo_name: ngo_name ?? event.ngo_name,
      custom_appreciation: custom_appreciation ?? event.custom_appreciation ?? null,
      updated_at: new Date().toISOString(),
    };

    await docRef.update(updates);
    res.json({ id: req.params.id, ...updates });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// ─── REGISTRATION ROUTES ──────────────────────────────────────────────────────
// Register volunteer for event
app.post('/api/registrations', async (req, res) => {
  try {
    const { user_id, event_id } = req.body;
    if (!user_id || !event_id) return res.status(400).json({ error: 'user_id and event_id required' });

    const existing = await regsColl
      .where('user_id', '==', user_id)
      .where('event_id', '==', event_id)
      .get();

    if (!existing.empty) return res.status(409).json({ error: 'Already registered for this event' });

    const eventDoc = eventsColl.doc(event_id);
    const event = await eventDoc.get();
    if (!event.exists) return res.status(404).json({ error: 'Event not found' });

    const reg = {
      user_id,
      event_id,
      registered_at: new Date().toISOString(),
    };
    
    await regsColl.add(reg);
    await eventDoc.update({
      volunteers_joined: admin.firestore.FieldValue.increment(1)
    });

    res.status(201).json(reg);
  } catch (error) {
    res.status(500).json({ error: 'Failed to register' });
  }
});

// Get registrations (by user or event)
app.get('/api/registrations', async (req, res) => {
  try {
    const { user_id, event_id } = req.query;
    let query = regsColl;
    if (user_id) query = query.where('user_id', '==', user_id);
    if (event_id) query = query.where('event_id', '==', event_id);
    
    const snapshot = await query.get();
    res.json(snapshot.docs.map(doc => doc.data()));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});

// ─── ATTENDANCE + POINTS ──────────────────────────────────────────────────────
app.post('/api/attendance/checkin', async (req, res) => {
  try {
    const { user_id } = req.query;
    const { event_id } = req.body;

    if (!user_id || !event_id) return res.status(400).json({ error: 'user_id and event_id required' });

    const eventDoc = await eventsColl.doc(event_id).get();
    if (!eventDoc.exists) return res.status(404).json({ error: 'Event not found' });

    const existing = await attendanceColl
      .where('user_id', '==', user_id)
      .where('event_id', '==', event_id)
      .get();

    if (!existing.empty && existing.docs[0].data().check_in) {
      return res.status(409).json({ detail: 'Already checked in' });
    }

    const record = {
      user_id,
      event_id,
      check_in: new Date().toISOString(),
      check_out: null,
      verified_by_ngo: false,
      event_details: getEventDetails(eventDoc.data()),
    };

    if (existing.empty) {
      await attendanceColl.add(record);
    } else {
      await existing.docs[0].ref.update(record);
    }

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: 'Failed to check in' });
  }
});

app.post('/api/attendance/checkout', async (req, res) => {
  try {
    const { user_id } = req.query;
    const { event_id } = req.body;

    const existing = await attendanceColl
      .where('user_id', '==', user_id)
      .where('event_id', '==', event_id)
      .get();

    if (existing.empty || !existing.docs[0].data().check_in) {
      return res.status(400).json({ detail: 'Must check in first' });
    }
    const recordDoc = existing.docs[0];
    if (recordDoc.data().check_out) return res.status(409).json({ detail: 'Already checked out' });

    await recordDoc.ref.update({
      check_out: new Date().toISOString(),
      verified_by_ngo: true
    });

    const userDoc = usersColl.doc(user_id);
    await userDoc.update({
      points: admin.firestore.FieldValue.increment(10)
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check out' });
  }
});

// NGO verifies attendance → awards points to volunteer
app.post('/api/attendance/verify', async (req, res) => {
  try {
    const { user_id, event_id } = req.body;

    const eventDoc = await eventsColl.doc(event_id).get();
    if (!eventDoc.exists) return res.status(404).json({ error: 'Event not found' });
    const event = eventDoc.data();

    const existing = await attendanceColl
      .where('user_id', '==', user_id)
      .where('event_id', '==', event_id)
      .get();

    const existingRecord = existing.empty ? null : existing.docs[0];
    if (existingRecord?.data().verified_at) return res.status(409).json({ error: 'Already verified' });

    const userDoc = usersColl.doc(user_id);
    await userDoc.update({
      points: admin.firestore.FieldValue.increment(event.points)
    });

    const verifiedRecord = {
      user_id,
      event_id,
      check_in: existingRecord?.data().check_in || new Date().toISOString(),
      check_out: existingRecord?.data().check_out || new Date().toISOString(),
      verified_at: new Date().toISOString(),
      verified_by_ngo: true,
      points_awarded: event.points,
      event_details: getEventDetails(event),
    };

    if (existingRecord) {
      await existingRecord.ref.update(verifiedRecord);
    } else {
      await attendanceColl.add(verifiedRecord);
    }

    res.json({ success: true, points_awarded: event.points });
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify attendance' });
  }
});

// Get attendance records
app.get('/api/attendance', async (req, res) => {
  try {
    const { user_id, event_id } = req.query;
    let query = attendanceColl;
    if (user_id) query = query.where('user_id', '==', user_id);
    if (event_id) query = query.where('event_id', '==', event_id);
    
    const snapshot = await query.get();
    res.json(snapshot.docs.map(doc => doc.data()));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
});

app.get('/api/auth/leaderboard', async (req, res) => {
  try {
    const snapshot = await usersColl
      .where('role', '==', 'volunteer')
      .orderBy('points', 'desc')
      .limit(10)
      .get();

    const volunteers = snapshot.docs.map(doc => doc.data());
    res.json({ volunteers });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

app.get('/api/auth/public-profile/:uid', async (req, res) => {
  try {
    const userDoc = await usersColl.doc(req.params.uid).get();
    if (!userDoc.exists) return res.status(404).json({ error: 'User not found' });
    const user = userDoc.data();

    const attendanceSnap = await attendanceColl
      .where('user_id', '==', req.params.uid)
      .get();

    const impact_history = attendanceSnap.docs
      .map(doc => doc.data())
      .filter(record => record.check_out || record.verified_at);

    res.json({
      name: user.name || 'Volunteer',
      points: user.points || 0,
      role: user.role || 'volunteer',
      impact_history,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch public profile' });
  }
});

app.post('/api/chat', async (req, res) => {
  const message = req.body?.message?.trim();
  if (!message) return res.status(400).json({ error: 'Message cannot be empty' });

  if (!process.env.GEMINI_API_KEY) {
    return res.json({
      response: 'I can help with events, registration, and volunteering tips. Add a `GEMINI_API_KEY` to enable richer AI responses locally.',
    });
  }

  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    const result = await model.generateContent(
      `You are a helpful assistant for VolunteerConnect. Answer briefly and clearly.\n\nUser: ${message}`
    );
    res.json({ response: result.response.text().trim() });
  } catch (error) {
    console.error('Chat failed detailed error:', error);
    res.status(500).json({ error: 'Chat service unavailable' });
  }
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ VolunteerConnect API running on http://localhost:${PORT}`));
