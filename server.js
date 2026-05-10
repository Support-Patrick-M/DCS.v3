// ============================================================
//  server.js — VCS Backend API
//  Runs on Render.com, connects to MongoDB Atlas
// ============================================================

const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// ── CORS ─────────────────────────────────────────────────────
// Allows your GitHub Pages site to talk to this server
const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
app.use(cors({ origin: allowedOrigin }));

// ── Connect to MongoDB Atlas ──────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ ERROR: MONGODB_URI environment variable is not set!');
  console.error('   Go to Render → your service → Environment → add MONGODB_URI');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

// ── Schemas (blueprints for your data) ────────────────────────

const taskSchema = new mongoose.Schema({
  title:         { type: String, required: true },
  billable:      { type: Number, default: 60 },
  peso_rate:     { type: Number, default: 0 },
  assignTo:      { type: String, default: 'everyone' },
  assignedUsers: [String],
  status:        { type: String, default: 'pending' },
  tag:           { type: String, default: 'coming-soon' },
  uploaded:      { type: String, default: null },
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  display:  { type: String, required: true },
  role:     { type: String, enum: ['admin', 'tasker'], default: 'tasker' },
  section:  { type: String, default: null },
  disabled: { type: Boolean, default: false },
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);
const User = mongoose.model('User', userSchema);

// ── Health check ──────────────────────────────────────────────
// Visit https://your-render-url.onrender.com/ to confirm it works
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: '✅ VCS Backend is running!' });
});

// ── Setup route: seeds default users ─────────────────────────
// Visit /api/setup ONCE after first deploy
app.get('/api/setup', async (req, res) => {
  try {
    const count = await User.countDocuments();
    if (count > 0) {
      return res.json({ status: 'ok', message: 'Already set up. Users exist.' });
    }
    await User.insertMany([
      { username: 'admin',   password: 'admin123', display: 'Admin User',  role: 'admin' },
      { username: 'tasker1', password: 'pass123',  display: 'Tasker One',  role: 'tasker', section: 'section_1' },
      { username: 'tasker2', password: 'pass123',  display: 'Tasker Two',  role: 'tasker', section: 'section_2' },
    ]);
    res.json({ status: 'ok', message: '✅ Default users created! admin/admin123, tasker1/pass123' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// =============================================================
//  AUTH ROUTES
// =============================================================

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ status: 'error', message: 'Username and password required.' });

    const user = await User.findOne({ username });
    if (!user)
      return res.status(401).json({ status: 'error', message: 'Unknown username.' });
    if (user.password !== password)
      return res.status(401).json({ status: 'error', message: 'Incorrect password.' });
    if (user.disabled)
      return res.status(403).json({ status: 'error', message: 'Account disabled. Contact admin.' });

    res.json({
      status: 'ok',
      user: {
        uid:     user._id,
        username: user.username,
        display: user.display,
        role:    user.role,
        section: user.section,
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// PATCH /api/auth/change-password
app.patch('/api/auth/change-password', async (req, res) => {
  try {
    const { username, oldPassword, newPassword } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found.' });
    if (user.password !== oldPassword)
      return res.status(401).json({ status: 'error', message: 'Old password is incorrect.' });
    user.password = newPassword;
    await user.save();
    res.json({ status: 'ok', message: 'Password updated.' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// =============================================================
//  TASK ROUTES
// =============================================================

// GET /api/tasks — all tasks (admin)
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json({ status: 'ok', tasks });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// GET /api/tasks/mine/:username — tasks for one tasker
app.get('/api/tasks/mine/:username', async (req, res) => {
  try {
    const tasks = await Task.find({ assignedUsers: req.params.username }).sort({ createdAt: -1 });
    res.json({ status: 'ok', tasks });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST /api/tasks — create task
app.post('/api/tasks', async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.json({ status: 'ok', task });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// PATCH /api/tasks/:id — update tag, status, uploaded filename
app.patch('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ status: 'error', message: 'Task not found.' });
    res.json({ status: 'ok', task });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// DELETE /api/tasks/:id
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ status: 'ok', message: 'Task deleted.' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// =============================================================
//  USER ROUTES
// =============================================================

// GET /api/users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json({ status: 'ok', users });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST /api/users — create user
app.post('/api/users', async (req, res) => {
  try {
    const { username, display, role, password, section } = req.body;
    const exists = await User.findOne({ username });
    if (exists) return res.status(409).json({ status: 'error', message: 'Username already exists.' });
    const user = await User.create({ username, display, role, password, section: section || null });
    res.json({ status: 'ok', user: { ...user.toObject(), password: undefined } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// PATCH /api/users/:username/toggle — enable/disable
app.patch('/api/users/:username/toggle', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found.' });
    user.disabled = !user.disabled;
    await user.save();
    res.json({ status: 'ok', disabled: user.disabled });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// PATCH /api/users/:username/password — admin resets a user's password
app.patch('/api/users/:username/password', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found.' });
    user.password = req.body.newPassword;
    await user.save();
    res.json({ status: 'ok', message: 'Password updated.' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// =============================================================
//  Start server
// =============================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 VCS Backend running on port ${PORT}`);
});
