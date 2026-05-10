// ============================================================
//  api-client.js — MongoDB Backend API Client
//  Video Collection System · vcs-v2
//
//  HOW TO USE:
//  1. Deploy your backend to Render.com (see mongodb-guide.html)
//  2. Replace the API_BASE URL below with your Render URL
//  3. This file is already loaded in index.html before other scripts
// ============================================================

// ┌─────────────────────────────────────────────────────────┐
// │  PASTE YOUR RENDER BACKEND URL HERE                     │
// │  e.g. https://vcs-backend.onrender.com/api              │
// └─────────────────────────────────────────────────────────┘
const API_BASE = 'https://vcs-backend.onrender.com/api'; // ← replace this

// Set to true once your backend is live on Render.
// While false, the app runs entirely on local in-memory data (no database).
const API_ENABLED = false; // ← change to true when backend is ready

// =============================================================
//  Core request helper
// =============================================================
async function apiRequest(path, { method = 'GET', body = null } = {}) {
  const url = `${API_BASE}${path}`;
  const options = { method, headers: {} };

  if (body) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${response.status}`);
  }
  return response.json();
}

// =============================================================
//  Task API calls
// =============================================================

/** Get ALL tasks (admin view) */
async function apiGetAllTasks() {
  if (!API_ENABLED) return DB.tasks;
  return apiRequest('/tasks');
}

/** Get tasks assigned to a specific user (tasker view) */
async function apiGetMyTasks(uid) {
  if (!API_ENABLED) return tasksForUser(uid);
  return apiRequest(`/tasks/mine/${encodeURIComponent(uid)}`);
}

/** Create a new task */
async function apiCreateTask(taskData) {
  if (!API_ENABLED) return taskCreate(taskData);
  const created = await apiRequest('/tasks', { method: 'POST', body: taskData });
  DB.tasks.push(created); // keep local state in sync
  return created;
}

/** Update a task (tag, status, uploaded filename, etc.) */
async function apiUpdateTask(taskId, updates) {
  if (!API_ENABLED) {
    const t = DB.tasks.find(x => x.id == taskId);
    if (t) Object.assign(t, updates);
    return t;
  }
  return apiRequest(`/tasks/${taskId}`, { method: 'PATCH', body: updates });
}

/** Delete a task */
async function apiDeleteTask(taskId) {
  if (!API_ENABLED) return taskDelete(taskId);
  await apiRequest(`/tasks/${taskId}`, { method: 'DELETE' });
  // Remove from local state too
  const idx = DB.tasks.findIndex(x => x.id == taskId);
  if (idx !== -1) DB.tasks.splice(idx, 1);
  return true;
}

// =============================================================
//  User API calls
// =============================================================

/** Get all users (admin) */
async function apiGetUsers() {
  if (!API_ENABLED) return DB.accounts;
  return apiRequest('/users');
}

/** Create a new user */
async function apiCreateUser(userData) {
  if (!API_ENABLED) return userCreate(userData);
  return apiRequest('/users', { method: 'POST', body: userData });
}

/** Toggle user enabled/disabled */
async function apiToggleUser(uid) {
  if (!API_ENABLED) return userToggleDisable(uid);
  return apiRequest(`/users/${uid}/toggle`, { method: 'PATCH' });
}

/** Admin updates a user's password */
async function apiAdminUpdatePassword(uid, newPassword) {
  if (!API_ENABLED) return userUpdatePassword(uid, newPassword);
  return apiRequest(`/users/${uid}/password`, { method: 'PATCH', body: { newPassword } });
}

// =============================================================
//  Video upload (multipart — uses XMLHttpRequest for progress)
// =============================================================

/**
 * Upload a video file with real-time progress callback.
 * @param {string|number} taskId
 * @param {File} file
 * @param {function} onProgress  — called with 0–100
 * @returns {Promise<{filename, url}>}
 */
async function apiUploadVideo(taskId, file, onProgress = null) {
  if (!API_ENABLED) {
    // Simulate progress locally
    return new Promise((resolve) => {
      let pct = 0;
      const iv = setInterval(() => {
        pct = Math.min(pct + Math.random() * 18, 100);
        if (onProgress) onProgress(Math.round(pct));
        if (pct >= 100) {
          clearInterval(iv);
          const filename = file ? file.name : 'video.mp4';
          taskUpload(taskId, filename);
          resolve({ filename, url: null });
        }
      }, 60);
    });
  }

  // Real upload via XHR (supports progress events)
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('task_id', taskId);
    formData.append('video', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE}/tasks/${taskId}/upload`);

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          taskUpload(taskId, data.filename); // sync local state
          resolve(data);
        } else {
          reject(new Error(data.message || `Upload failed (${xhr.status})`));
        }
      } catch {
        reject(new Error('Invalid server response'));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(formData);
  });
}

// =============================================================
//  One-time setup — creates MongoDB collections / indexes
//  Visit: https://your-render-url.onrender.com/api/setup
// =============================================================
async function apiSetup() {
  return apiRequest('/setup');
}
