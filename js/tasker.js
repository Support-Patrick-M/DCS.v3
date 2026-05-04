// ============================================================
// tasker.js — Tasker dashboard, upload, settings
// ============================================================

function taskerNav(view, el) {
  setActiveNav('s-tasker', el);
  const c = document.getElementById('tasker-content');
  if (view === 'dashboard') c.innerHTML = renderTaskerDashboard();
  if (view === 'settings')  c.innerHTML = renderChangePasswordForm('tasker');
}

// ── Dashboard ────────────────────────────────────────────────

function renderTaskerDashboard() {
  const tasks = tasksForUser(DB.session.currentUid);
  const done  = tasks.filter(t => t.status === 'done').length;
  const rows  = tasks.length
    ? tasks.map(renderTaskerRow).join('')
    : `<div class="empty-state"><div class="empty-icon">◈</div>No tasks assigned yet. Check back later.</div>`;

  return `
    <div class="page-title">My Tasks</div>
    <div class="page-sub">Assigned by admin</div>
    <div class="metrics-row">
      ${metricCard('Assigned', tasks.length)}
      ${metricCard('Completed', done)}
      ${metricCard('Pending', tasks.length - done)}
    </div>
    <div class="card">${rows}</div>`;
}

function renderTaskerRow(t) {
  const isComingSoon = t.tag === 'coming-soon';
  const isDone       = t.status === 'done';
  const progress     = isDone ? 100 : 0;

  // Tag badge
  const tagBadge = isComingSoon
    ? `<span class="badge coming-soon">Coming Soon</span>`
    : `<span class="badge task-active">Active</span>`;

  // Action: locked if coming-soon, upload if active+pending, filename if done
  let actionEl;
  if (isDone) {
    actionEl = `<span class="task-meta" style="font-size:11px">${t.uploaded}</span>`;
  } else if (isComingSoon) {
    actionEl = `<button class="btn sm" disabled title="Task not yet available" style="opacity:0.4;cursor:not-allowed">Locked</button>`;
  } else {
    actionEl = `<button class="btn sm accent" onclick="openUploadModal(${t.id})">Upload</button>`;
  }

  const pesoLine = t.peso_rate
    ? `₱${t.peso_rate}/min · ` : '';

  return `
    <div class="task-row" id="task-row-${t.id}">
      <div class="task-info">
        <div class="task-title">${t.title}</div>
        <div class="task-meta">${pesoLine}Billable: ${fmtMinutes(t.billable)}</div>
        <div class="progress-bar">
          <div class="progress-fill" id="prog-${t.id}" style="width:${progress}%"></div>
        </div>
        <div id="prog-label-${t.id}" class="prog-label" style="display:none"></div>
      </div>
      <div class="task-actions">
        ${tagBadge}
        <span class="badge ${isDone ? 'done' : 'pending'}" id="status-badge-${t.id}">${isDone ? 'done' : 'pending'}</span>
        <span id="action-${t.id}">${actionEl}</span>
      </div>
    </div>`;
}

// ── Upload modal — real file input ───────────────────────────

function openUploadModal(taskId) {
  const t = DB.tasks.find(x => x.id === taskId);
  clearPickedFile();
  showModal(`
    <div class="modal-title">Upload Video</div>
    <p class="modal-body">
      <strong>${t.title}</strong><br>
      Billable: ${fmtMinutes(t.billable)}
      ${t.peso_rate ? `&nbsp;·&nbsp; ₱${t.peso_rate}/min` : ''}
    </p>
    <label class="file-drop" for="real-file-${taskId}" id="drop-zone-${taskId}">
      <div class="file-drop-icon">⬆</div>
      <div>Click or drag a video file here</div>
      <div class="file-drop-hint">MP4, MOV, AVI, WebM — max 500 MB</div>
    </label>
    <input type="file" id="real-file-${taskId}"
      accept="video/mp4,video/quicktime,video/x-msvideo,video/webm,.mp4,.mov,.avi,.webm"
      style="display:none"
      onchange="onFileChosen(${taskId}, this)">
    <div id="file-chosen-${taskId}" class="file-chosen"></div>
    <div id="upload-prog-wrap-${taskId}" style="display:none;margin-top:10px">
      <div class="progress-bar"><div class="progress-fill" id="upload-prog-${taskId}" style="width:0%"></div></div>
      <div id="upload-prog-lbl-${taskId}" class="prog-label">0%</div>
    </div>
    <div id="upload-msg-${taskId}" style="display:none"></div>
    <div class="modal-actions" id="upload-actions-${taskId}">
      <button class="btn" onclick="closeModal()">Cancel</button>
      <button class="btn primary" id="confirm-upload-btn-${taskId}" onclick="confirmUpload(${taskId})" disabled>Upload</button>
    </div>`);

  // Drag & drop
  const drop = document.getElementById('drop-zone-' + taskId);
  drop.addEventListener('dragover', e => { e.preventDefault(); drop.style.borderColor = 'var(--accent)'; });
  drop.addEventListener('dragleave', () => { drop.style.borderColor = ''; });
  drop.addEventListener('drop', e => {
    e.preventDefault(); drop.style.borderColor = '';
    const input = document.getElementById('real-file-' + taskId);
    if (e.dataTransfer.files.length) {
      const dt = new DataTransfer();
      dt.items.add(e.dataTransfer.files[0]);
      input.files = dt.files;
      onFileChosen(taskId, input);
    }
  });
}

function onFileChosen(taskId, input) {
  const file = input.files[0];
  if (!file) return;
  const allowed = ['video/mp4','video/quicktime','video/x-msvideo','video/webm'];
  if (!allowed.includes(file.type)) {
    showMsg('upload-msg-' + taskId, 'Unsupported type. Use MP4, MOV, AVI, or WebM.');
    document.getElementById('upload-msg-' + taskId).style.display = 'block'; return;
  }
  if (file.size > 500 * 1024 * 1024) {
    showMsg('upload-msg-' + taskId, 'File too large. Max 500 MB.');
    document.getElementById('upload-msg-' + taskId).style.display = 'block'; return;
  }
  const mb = (file.size / 1024 / 1024).toFixed(1);
  document.getElementById('file-chosen-' + taskId).textContent = `Selected: ${file.name} (${mb} MB)`;
  document.getElementById('confirm-upload-btn-' + taskId).removeAttribute('disabled');
  clearMsg('upload-msg-' + taskId);
  _pickedFile = file.name;
}

function confirmUpload(taskId) {
  const input = document.getElementById('real-file-' + taskId);
  const file  = input && input.files[0];

  document.getElementById('confirm-upload-btn-' + taskId).disabled = true;
  const cancelBtn = document.getElementById('upload-actions-' + taskId)?.querySelector('.btn');
  if (cancelBtn) cancelBtn.disabled = true;

  const progWrap = document.getElementById('upload-prog-wrap-' + taskId);
  const progBar  = document.getElementById('upload-prog-' + taskId);
  const progLbl  = document.getElementById('upload-prog-lbl-' + taskId);
  progWrap.style.display = 'block';

  const filename = file ? file.name : (getPickedFile() || 'video.mp4');

  // Animated simulation (replace with real fetch/XHR in production)
  let pct = 0;
  const iv = setInterval(() => {
    pct = Math.min(pct + Math.random() * 15, 100);
    const p = Math.round(pct);
    progBar.style.width   = p + '%';
    progLbl.textContent   = p + '%';
    if (pct >= 100) {
      clearInterval(iv);
      taskUpload(taskId, filename);
      showMsg('upload-msg-' + taskId, '✓ Uploaded successfully!', 'success');
      document.getElementById('upload-msg-' + taskId).style.display = 'block';
      document.getElementById('upload-actions-' + taskId).innerHTML =
        '<button class="btn primary" onclick="closeModal();taskerNav(\'dashboard\',document.querySelector(\'#s-tasker .nav-item\'))">Done</button>';
      // Refresh row inline
      const row = document.getElementById('task-row-' + taskId);
      if (row) {
        document.getElementById('status-badge-' + taskId).className = 'badge done';
        document.getElementById('status-badge-' + taskId).textContent = 'done';
        document.getElementById('action-' + taskId).innerHTML = `<span class="task-meta">${filename}</span>`;
        document.getElementById('prog-' + taskId).style.width = '100%';
      }
    }
  }, 60);
}

// ── Settings password change ─────────────────────────────────
function submitTaskerPasswordChange() {
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
