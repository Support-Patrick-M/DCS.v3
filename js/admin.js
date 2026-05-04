// ============================================================
// admin.js — Admin: dashboard, manage tasks, manage users, settings
// ============================================================

function adminNav(view, el) {
  setActiveNav('s-admin', el);
  const c = document.getElementById('admin-content');
  if (view === 'dashboard')    c.innerHTML = renderAdminDashboard();
  if (view === 'manage-task')  c.innerHTML = renderManageTask();
  if (view === 'users')        c.innerHTML = renderManageUsers();
  if (view === 'videos')       c.innerHTML = renderUploadedVideos();
  if (view === 'settings')     c.innerHTML = renderChangePasswordForm('admin');
}

// ── Dashboard ─────────────────────────────────────────────────

function renderAdminDashboard() {
  const total   = DB.tasks.length;
  const done    = DB.tasks.filter(t => t.status === 'done').length;
  const taskers = getTaskers().length;
  const comingSoon = DB.tasks.filter(t => t.tag === 'coming-soon').length;

  const rows = DB.tasks.length
    ? DB.tasks.map(t => `
      <div class="task-row">
        <div class="task-info">
          <div class="task-title">${t.title}</div>
          <div class="task-meta">
            ₱${t.peso_rate}/min · Billable: ${fmtMinutes(t.billable)} ·
            Assigned: ${t.assignedUsers.join(', ')}
            ${t.uploaded ? ` · ${t.uploaded}` : ''}
          </div>
        </div>
        <div class="task-actions">
          <span class="badge ${t.tag === 'coming-soon' ? 'coming-soon' : 'task-active'}">
            ${t.tag === 'coming-soon' ? 'Coming Soon' : 'Active'}
          </span>
          <span class="badge ${t.status}">${t.status}</span>
        </div>
      </div>`).join('')
    : `<div class="empty-state"><div class="empty-icon">◈</div>No tasks yet.</div>`;

  return `
    <div class="page-title">Dashboard</div>
    <div class="page-sub">Overview of the system</div>
    <div class="metrics-row">
      ${metricCard('Total Tasks', total)}
      ${metricCard('Completed', done)}
      ${metricCard('Taskers', taskers)}
      ${metricCard('Coming Soon', comingSoon)}
    </div>
    <div class="section-hd"><div class="section-title">All Tasks</div></div>
    <div class="card">${rows}</div>`;
}

// ── Manage Tasks ───────────────────────────────────────────────
// Flow from flowchart:
//  1. List all tasks with tag controls (Coming Soon / Active)
//  2. Assign Task to Tasker section at bottom

function renderManageTask() {
  const taskerOpts = getTaskers()
    .filter(([,v]) => !v.disabled)
    .map(([k,v]) => `<option value="${k}">${v.display} (${k})</option>`)
    .join('');

  const taskRows = DB.tasks.map(t => {
    const isComingSoon = t.tag === 'coming-soon';
    return `
      <div class="mtask-row" id="mtrow-${t.id}">
        <div class="task-info">
          <div class="task-title">${t.title}</div>
          <div class="task-meta">₱${t.peso_rate}/min · Billable: ${fmtMinutes(t.billable)} · Assigned: ${t.assignedUsers.join(', ')}</div>
        </div>
        <div class="mtask-tag-actions">
          <span class="badge ${isComingSoon ? 'coming-soon' : 'task-active'}" id="tag-badge-${t.id}">
            ${isComingSoon ? 'Coming Soon' : 'Active'}
          </span>
          ${isComingSoon
            ? `<button class="btn xs accent" onclick="setTaskTag(${t.id},'active')">Make Active</button>`
            : `<button class="btn xs" onclick="setTaskTag(${t.id},'coming-soon')">Mark Coming Soon</button>`
          }
          <button class="btn xs danger" onclick="promptDeleteTask(${t.id}, '${t.title.replace(/'/g,"\\'")}')">Delete</button>
        </div>
      </div>`;
  }).join('') || `<div class="empty-state"><div class="empty-icon">◈</div>No tasks yet. Create one below.</div>`;

  return `
    <div class="page-title">Manage Tasks</div>
    <div class="page-sub">Tag tasks and assign them to taskers</div>

    <!-- ── Task tag list ── -->
    <div class="section-hd">
      <div class="section-title">Task Status Tags</div>
    </div>
    <div class="info-box">
      <strong>Coming Soon</strong> — upload button is disabled for taskers.<br>
      <strong>Active</strong> — upload button is enabled; taskers can submit video.
    </div>
    <div class="card" style="margin-bottom:1.75rem">${taskRows}</div>

    <!-- ── Assign task form ── -->
    <div class="section-hd">
      <div class="section-title">Assign Task to Tasker</div>
    </div>
    <div class="card" style="max-width:520px">
      <div class="form-section-title">New Task Details</div>
      <div class="form-row">
        <div class="field">
          <label>Task Title</label>
          <input type="text" id="at-title" placeholder="e.g. Drone footage batch B">
        </div>
        <div class="field">
          <label>Peso Rate / Minute (₱)</label>
          <input type="number" id="at-peso" placeholder="e.g. 25" min="0" step="0.5">
        </div>
      </div>
      <div class="field">
        <label>Billable Hours / Minutes</label>
        <input type="number" id="at-billable" placeholder="Total minutes (e.g. 90)" min="1">
      </div>

      <div class="divider"></div>
      <div class="form-section-title">Assign To</div>

      <div class="radio-group" id="assign-radio-group">
        <label class="radio-opt">
          <input type="radio" name="assign-mode" value="everyone" checked onchange="toggleAssignFields()">
          <div>
            <div class="radio-opt-lbl">Everyone</div>
            <div class="radio-opt-desc">System assigns to all active taskers in the database.</div>
          </div>
        </label>
        <label class="radio-opt">
          <input type="radio" name="assign-mode" value="section" onchange="toggleAssignFields()">
          <div>
            <div class="radio-opt-lbl">Multiple Sections</div>
            <div class="radio-opt-desc">Filter by Section_ID (e.g. tasker1, tasker2).</div>
          </div>
        </label>
        <label class="radio-opt">
          <input type="radio" name="assign-mode" value="specific" onchange="toggleAssignFields()">
          <div>
            <div class="radio-opt-lbl">Specific User</div>
            <div class="radio-opt-desc">Admin searches and selects individual User_ID.</div>
          </div>
        </label>
      </div>

      <div id="assign-section-field" style="display:none;margin-top:12px" class="field">
        <label>Section IDs (comma separated)</label>
        <input type="text" id="at-sections" placeholder="e.g. section_1, section_2">
      </div>
      <div id="assign-specific-field" style="display:none;margin-top:12px" class="field">
        <label>Select Tasker</label>
        <select id="at-specific"><option value="">-- choose --</option>${taskerOpts}</select>
      </div>

      <div id="assign-msg" style="display:none;margin-top:8px"></div>
      <div class="form-actions" style="margin-top:1rem">
        <button class="btn primary" onclick="doAssignTask()">Assign Task</button>
        <button class="btn" onclick="adminNav('dashboard', document.querySelector('#s-admin .nav-item'))">Cancel</button>
      </div>
      <div style="margin-top:10px">
        <div id="tag-note" class="info-box" style="margin:0;font-size:11px">
          ℹ New tasks are automatically tagged <strong>Coming Soon</strong>. Go to the list above to make them Active when ready.
        </div>
      </div>
    </div>`;
}

function toggleAssignFields() {
  const mode = document.querySelector('input[name="assign-mode"]:checked').value;
  document.getElementById('assign-section-field').style.display  = mode === 'section'  ? 'block' : 'none';
  document.getElementById('assign-specific-field').style.display = mode === 'specific' ? 'block' : 'none';
}

function doAssignTask() {
  const title    = document.getElementById('at-title').value.trim();
  const billable = document.getElementById('at-billable').value;
  const peso     = document.getElementById('at-peso').value;
  const mode     = document.querySelector('input[name="assign-mode"]:checked').value;
  clearMsg('assign-msg');
  if (!title) { showMsg('assign-msg', 'Please enter a task title.'); return; }

  const sections    = mode === 'section'  ? document.getElementById('at-sections').value  : '';
  const specificUid = mode === 'specific' ? document.getElementById('at-specific').value  : '';
  if (mode === 'specific' && !specificUid) { showMsg('assign-msg', 'Please select a user.'); return; }

  const assignedUsers = resolveAssignedUsers(mode, sections, specificUid);
  if (!assignedUsers.length) { showMsg('assign-msg', 'No active taskers match the selection.'); return; }

  taskCreate({ title, billable, peso_rate: parseFloat(peso)||0, assignTo: mode, assignedUsers });
  showMsg('assign-msg', `✓ Task created and tagged "Coming Soon". Assigned to: ${assignedUsers.join(', ')}`, 'success');
  setTimeout(() => adminNav('manage-task', document.querySelectorAll('#s-admin .nav-item')[1]), 1400);
}

function setTaskTag(taskId, tag) {
  taskSetTag(taskId, tag);
  // Re-render the manage task view in place
  adminNav('manage-task', document.querySelectorAll('#s-admin .nav-item')[1]);
}

// ── Delete task ────────────────────────────────────────────────

function promptDeleteTask(taskId, title) {
  showModal(`
    <div class="modal-title">Delete Task</div>
    <p class="modal-body">
      Permanently delete <strong>${title}</strong>?<br>
      <span style="color:var(--color-text-danger, #a32d2d);font-size:12px">This action cannot be undone.</span>
    </p>
    <div class="modal-actions">
      <button class="btn" onclick="closeModal()">Cancel</button>
      <button class="btn danger" onclick="confirmDeleteTask(${taskId})">Delete</button>
    </div>`);
}

function confirmDeleteTask(taskId) {
  taskDelete(taskId);
  closeModal();
  adminNav('manage-task', document.querySelectorAll('#s-admin .nav-item')[1]);
}

// ── Manage Users ───────────────────────────────────────────────
// Three sub-actions: Create, Active/Disable, Update Password

function renderManageUsers() {
  const taskers = getTaskers();

  const rows = taskers.map(([uid, acc]) => `
    <div class="task-row">
      <div class="task-info">
        <div class="task-title">${acc.display} <span style="font-size:11px;color:var(--ink-3);font-family:var(--font-mono)">(${uid})</span></div>
        <div class="task-meta">Section: ${acc.section || '—'}</div>
      </div>
      <div class="task-actions">
        <span class="badge ${acc.disabled ? 'disabled' : 'active'}" id="status-chip-${uid}">
          ${acc.disabled ? 'Disabled' : 'Active'}
        </span>
        <button class="btn sm ${acc.disabled ? '' : 'danger'}" onclick="promptToggleDisable('${uid}')">
          ${acc.disabled ? 'Enable' : 'Disable'}
        </button>
        <button class="btn sm" onclick="showUpdatePasswordModal('${uid}')">
          Update Password
        </button>
      </div>
    </div>`).join('') || `<div class="empty-state"><div class="empty-icon">◉</div>No taskers found.</div>`;

  return `
    <div class="page-title">Manage Users</div>
    <div class="page-sub">Create accounts, activate/disable, update passwords</div>

    <div class="section-hd">
      <div class="section-title">Tasker Accounts</div>
      <button class="btn sm accent" onclick="showCreateUserModal()">+ Create User</button>
    </div>
    <div class="card">${rows}</div>`;
}

// ── Create user modal ──────────────────────────────────────────
function showCreateUserModal() {
  showModal(`
    <div class="modal-title">Create New User</div>
    <div class="field"><label>Username</label><input type="text" id="nu-user" placeholder="e.g. tasker3"></div>
    <div class="field"><label>Display Name</label><input type="text" id="nu-display" placeholder="e.g. Tasker Three"></div>
    <div class="field">
      <label>Role</label>
      <select id="nu-role"><option value="tasker">Tasker</option><option value="admin">Admin</option></select>
    </div>
    <div class="field"><label>Password</label><input type="password" id="nu-pass" placeholder="Initial password"></div>
    <div id="cu-msg" style="display:none"></div>
    <div class="modal-actions">
      <button class="btn" onclick="closeModal()">Cancel</button>
      <button class="btn primary" onclick="doCreateUser()">Create</button>
    </div>`);
}

function doCreateUser() {
  const username = document.getElementById('nu-user').value.trim();
  const display  = document.getElementById('nu-display').value.trim();
  const role     = document.getElementById('nu-role').value;
  const password = document.getElementById('nu-pass').value;
  clearMsg('cu-msg');
  if (!username || !display || !password) { showMsg('cu-msg', 'All fields are required.'); return; }
  const r = userCreate({ username, display, role, password });
  if (!r.ok) { showMsg('cu-msg', r.error); return; }
  closeModal();
  adminNav('users', document.querySelectorAll('#s-admin .nav-item')[2]);
}

// ── Toggle disable ─────────────────────────────────────────────
function promptToggleDisable(uid) {
  const acc = DB.accounts[uid];
  showModal(`
    <div class="modal-title">${acc.disabled ? 'Enable' : 'Disable'} Account</div>
    <p class="modal-body">${acc.disabled ? 'Re-enable' : 'Disable'} account for <strong>${acc.display}</strong>?</p>
    <div class="modal-actions">
      <button class="btn" onclick="closeModal()">Cancel</button>
      <button class="btn primary" onclick="confirmToggleDisable('${uid}')">Confirm</button>
    </div>`);
}

function confirmToggleDisable(uid) {
  userToggleDisable(uid);
  closeModal();
  adminNav('users', document.querySelectorAll('#s-admin .nav-item')[2]);
}

// ── Update user password (admin action) ───────────────────────
function showUpdatePasswordModal(uid) {
  const acc = DB.accounts[uid];
  showModal(`
    <div class="modal-title">Update Password</div>
    <p class="modal-body">Set a new password for <strong>${acc.display}</strong> (${uid}).</p>
    <div class="field"><label>New Password</label><input type="password" id="upw-new" placeholder="New password"></div>
    <div class="field"><label>Confirm Password</label><input type="password" id="upw-confirm" placeholder="Confirm password"></div>
    <div id="upw-msg" style="display:none"></div>
    <div class="modal-actions">
      <button class="btn" onclick="closeModal()">Cancel</button>
      <button class="btn primary" onclick="doUpdateUserPassword('${uid}')">Update</button>
    </div>`);
}

function doUpdateUserPassword(uid) {
  const newPw  = document.getElementById('upw-new').value;
  const confPw = document.getElementById('upw-confirm').value;
  clearMsg('upw-msg');
  if (!newPw)          { showMsg('upw-msg', 'Password cannot be empty.'); return; }
  if (newPw !== confPw){ showMsg('upw-msg', 'Passwords do not match.'); return; }
  const r = userUpdatePassword(uid, newPw);
  if (!r.ok) { showMsg('upw-msg', r.error); return; }
  showMsg('upw-msg', 'Password updated!', 'success');
  setTimeout(closeModal, 1000);
}

// ── Admin settings password change ────────────────────────────
function submitAdminPasswordChange() {
  const r = authChangePassword(
    DB.session.currentUid,
    document.getElementById('pw-old').value,
    document.getElementById('pw-new').value,
    document.getElementById('pw-confirm').value
  );
  if (!r.ok) { showMsg('pw-msg', r.error); return; }
  showMsg('pw-msg', 'Password updated!', 'success');
  ['pw-old','pw-new','pw-confirm'].forEach(id => document.getElementById(id).value = '');
}

// ── Uploaded Videos ────────────────────────────────────────────

let _videoFilter = { user: 'all', task: 'all' };

function renderUploadedVideos() {
  // Collect all completed uploads across tasks
  const allUploads = DB.tasks
    .filter(t => t.status === 'done' && t.uploaded)
    .flatMap(t =>
      t.assignedUsers.map(uid => ({
        taskId:    t.id,
        taskTitle: t.title,
        billable:  t.billable,
        peso_rate: t.peso_rate,
        filename:  t.uploaded,
        uid,
        display:   DB.accounts[uid]?.display || uid
      }))
    );

  // Build filter options
  const users = [...new Set(allUploads.map(u => u.uid))];
  const tasks = [...new Set(allUploads.map(u => u.taskId))];

  const userOpts = `<option value="all">All Users</option>` +
    users.map(uid => `<option value="${uid}" ${_videoFilter.user===uid?'selected':''}>${DB.accounts[uid]?.display||uid}</option>`).join('');
  const taskOpts = `<option value="all">All Tasks</option>` +
    tasks.map(tid => {
      const t = DB.tasks.find(x => x.id === tid);
      return `<option value="${tid}" ${_videoFilter.task==tid?'selected':''}>${t?.title||tid}</option>`;
    }).join('');

  // Apply filters
  const filtered = allUploads.filter(u => {
    const byUser = _videoFilter.user === 'all' || u.uid === _videoFilter.user;
    const byTask = _videoFilter.task === 'all' || u.taskId == _videoFilter.task;
    return byUser && byTask;
  });

  const cards = filtered.length
    ? filtered.map(u => `
      <div class="video-card" onclick="openVideoPlayer('${u.filename}', '${u.taskTitle}', '${u.display}', ${u.billable}, ${u.peso_rate})">
        <div class="video-thumb">
          <div class="video-play-icon">▶</div>
          <div class="video-filename">${u.filename}</div>
        </div>
        <div class="video-card-body">
          <div class="video-card-title">${u.taskTitle}</div>
          <div class="video-card-meta">
            <span>👤 ${u.display}</span>
            <span>⏱ ${fmtMinutes(u.billable)}</span>
            <span>₱${u.peso_rate}/min</span>
          </div>
        </div>
      </div>`).join('')
    : `<div class="empty-state"><div class="empty-icon">▶</div>No uploaded videos match the filter.</div>`;

  return `
    <div class="page-title">Uploaded Videos</div>
    <div class="page-sub">${allUploads.length} video${allUploads.length !== 1 ? 's' : ''} uploaded total</div>

    <!-- Filters -->
    <div class="video-filters card" style="margin-bottom:1.25rem">
      <div class="video-filter-row">
        <div class="field" style="margin:0;flex:1">
          <label>Filter by User</label>
          <select onchange="setVideoFilter('user', this.value)">${userOpts}</select>
        </div>
        <div class="field" style="margin:0;flex:1">
          <label>Filter by Task</label>
          <select onchange="setVideoFilter('task', this.value)">${taskOpts}</select>
        </div>
        <button class="btn sm" style="align-self:flex-end" onclick="setVideoFilter('reset')">Clear</button>
      </div>
      <div style="font-size:11px;color:var(--ink-3);margin-top:8px">
        Showing <strong>${filtered.length}</strong> of <strong>${allUploads.length}</strong> uploads
      </div>
    </div>

    <!-- Video grid -->
    <div class="video-grid">${cards}</div>`;
}

function setVideoFilter(key, val) {
  if (key === 'reset') {
    _videoFilter = { user: 'all', task: 'all' };
  } else {
    _videoFilter[key] = val;
  }
  // Re-render keeping the nav highlight on Uploaded Videos
  document.getElementById('admin-content').innerHTML = renderUploadedVideos();
}

function openVideoPlayer(filename, taskTitle, uploaderName, billable, pesoRate) {
  // Calculate estimated earnings
  const earnings = ((billable / 60) * pesoRate).toFixed(2);

  showModal(`
    <div class="modal-title">▶ ${taskTitle}</div>

    <!-- Video player area -->
    <div class="video-player-wrap">
      <div class="video-player-screen">
        <div class="video-player-icon">▶</div>
        <div class="video-player-filename">${filename}</div>
        <div style="font-size:11px;color:rgba(255,255,255,.4);margin-top:4px">
          (Connect backend to stream real video files)
        </div>
      </div>
      <div class="video-player-controls">
        <div class="vpc-bar">
          <div class="vpc-fill" id="vpc-fill"></div>
        </div>
        <div class="vpc-row">
          <div style="display:flex;gap:8px;align-items:center">
            <button class="vpc-btn" onclick="togglePlay(this)">▶ Play</button>
            <span class="vpc-time" id="vpc-time">0:00 / ${fmtMinutes(billable)}</span>
          </div>
          <span class="vpc-time">${filename}</span>
        </div>
      </div>
    </div>

    <!-- Details -->
    <div class="video-details">
      <div class="vd-row"><span class="vd-lbl">Uploaded by</span><span class="vd-val">${uploaderName}</span></div>
      <div class="vd-row"><span class="vd-lbl">Task</span><span class="vd-val">${taskTitle}</span></div>
      <div class="vd-row"><span class="vd-lbl">Billable time</span><span class="vd-val">${fmtMinutes(billable)}</span></div>
      <div class="vd-row"><span class="vd-lbl">Rate</span><span class="vd-val">₱${pesoRate}/min</span></div>
      <div class="vd-row"><span class="vd-lbl">Est. earnings</span><span class="vd-val" style="color:var(--green);font-weight:600">₱${earnings}</span></div>
    </div>

    <div class="modal-actions">
      <button class="btn" onclick="closeModal()">Close</button>
    </div>`);

  // Simulate playback progress for demo
  let playing = false, pct = 0, iv = null;
  window._playerState = { playing, pct, iv };
}

function togglePlay(btn) {
  const fill = document.getElementById('vpc-fill');
  const time = document.getElementById('vpc-time');
  if (!window._playerState) return;
  const s = window._playerState;

  if (s.playing) {
    clearInterval(s.iv);
    s.playing = false;
    btn.textContent = '▶ Play';
  } else {
    s.playing = true;
    btn.textContent = '⏸ Pause';
    s.iv = setInterval(() => {
      s.pct = Math.min(s.pct + 0.4, 100);
      if (fill) fill.style.width = s.pct + '%';
      const elapsed = Math.floor(s.pct / 100 * 90); // demo: 90 sec total
      const m = Math.floor(elapsed / 60), sec = elapsed % 60;
      if (time) time.textContent = `${m}:${sec.toString().padStart(2,'0')} / 1:30`;
      if (s.pct >= 100) { clearInterval(s.iv); s.playing = false; btn.textContent = '↺ Replay'; s.pct = 0; }
    }, 80);
  }
}
