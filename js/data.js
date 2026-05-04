// ============================================================
// data.js — Central state store
// ============================================================

const DB = {
  accounts: {
    admin:   { role: 'admin',  display: 'Admin User',  section: null,       disabled: false },
    tasker1: { role: 'tasker', display: 'Tasker One',  section: 'section_1', disabled: false },
    tasker2: { role: 'tasker', display: 'Tasker Two',  section: 'section_2', disabled: false }
  },

  passwords: {
    admin:   'admin123',
    tasker1: 'pass123',
    tasker2: 'pass123'
  },

  // task.tag: 'active' | 'coming-soon'
  tasks: [
    {
      id: 1, title: 'Drone footage batch A',
      billable: 120, peso_rate: 25,
      assignTo: 'everyone', assignedUsers: ['tasker1','tasker2'],
      uploaded: null, status: 'pending', tag: 'active'
    },
    {
      id: 2, title: 'Street interview series',
      billable: 90, peso_rate: 30,
      assignTo: 'specific', assignedUsers: ['tasker1'],
      uploaded: null, status: 'pending', tag: 'coming-soon'
    },
    {
      id: 3, title: 'Product showcase clips',
      billable: 60, peso_rate: 20,
      assignTo: 'section', assignedUsers: ['tasker2'],
      uploaded: 'showcase_final.mp4', status: 'done', tag: 'active'
    }
  ],

  taskIdCounter: 4,

  session: { currentUid: null, currentUser: null, currentRole: null }
};

// ── Auth ──────────────────────────────────────────────────

function authLogin(username, password) {
  const acc = DB.accounts[username];
  if (!acc) return { ok: false, error: 'Unknown username.' };
  if (DB.passwords[username] !== password) return { ok: false, error: 'Incorrect password.' };
  if (acc.disabled) return { ok: false, error: 'Account disabled. Contact admin.' };
  DB.session.currentUid  = username;
  DB.session.currentUser = acc.display;
  DB.session.currentRole = acc.role;
  return { ok: true, role: acc.role };
}

function authLogout() {
  DB.session.currentUid = DB.session.currentUser = DB.session.currentRole = null;
}

function authChangePassword(uid, oldPw, newPw, confirmPw) {
  if (DB.passwords[uid] !== oldPw) return { ok: false, error: 'Old password is incorrect.' };
  if (!newPw) return { ok: false, error: 'New password cannot be empty.' };
  if (newPw !== confirmPw) return { ok: false, error: 'Passwords do not match.' };
  DB.passwords[uid] = newPw;
  return { ok: true };
}

// ── Tasks ─────────────────────────────────────────────────

function tasksForUser(uid) {
  return DB.tasks.filter(t => t.assignedUsers.includes(uid));
}

function taskCreate({ title, billable, peso_rate, assignTo, assignedUsers }) {
  const task = {
    id: DB.taskIdCounter++, title,
    billable: parseInt(billable) || 60,
    peso_rate: parseFloat(peso_rate) || 0,
    assignTo, assignedUsers,
    uploaded: null, status: 'pending', tag: 'coming-soon'
  };
  DB.tasks.push(task);
  return task;
}

function taskSetTag(taskId, tag) {
  const t = DB.tasks.find(x => x.id === taskId);
  if (t) { t.tag = tag; return true; }
  return false;
}

function taskDelete(taskId) {
  const idx = DB.tasks.findIndex(x => x.id === taskId);
  if (idx === -1) return false;
  DB.tasks.splice(idx, 1);
  return true;
}

function taskUpload(taskId, filename) {
  const t = DB.tasks.find(x => x.id === taskId);
  if (!t) return false;
  t.uploaded = filename;
  t.status   = 'done';
  return true;
}

function resolveAssignedUsers(mode, sectionsInput, specificUid) {
  const active = Object.entries(DB.accounts)
    .filter(([, v]) => v.role === 'tasker' && !v.disabled);
  if (mode === 'everyone') return active.map(([k]) => k);
  if (mode === 'section') {
    const secs = sectionsInput.split(',').map(s => s.trim()).filter(Boolean);
    return active.filter(([, v]) => secs.includes(v.section)).map(([k]) => k);
  }
  if (mode === 'specific') return specificUid ? [specificUid] : [];
  return [];
}

// ── Users ─────────────────────────────────────────────────

function userCreate({ username, display, role, password }) {
  if (DB.accounts[username]) return { ok: false, error: 'Username already exists.' };
  DB.accounts[username] = { role, display, section: role === 'tasker' ? 'section_new' : null, disabled: false };
  DB.passwords[username] = password;
  return { ok: true };
}

function userToggleDisable(uid) {
  if (!DB.accounts[uid]) return false;
  DB.accounts[uid].disabled = !DB.accounts[uid].disabled;
  return true;
}

function userUpdatePassword(uid, newPw) {
  if (!DB.accounts[uid]) return { ok: false, error: 'User not found.' };
  if (!newPw) return { ok: false, error: 'Password cannot be empty.' };
  DB.passwords[uid] = newPw;
  return { ok: true };
}

function getTaskers() {
  return Object.entries(DB.accounts).filter(([, v]) => v.role === 'tasker');
}
