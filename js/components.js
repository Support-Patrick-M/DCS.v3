// ============================================================
// components.js — Shared component renderers
// ============================================================

function metricCard(label, value) {
  return `<div class="metric-card"><div class="metric-lbl">${label}</div><div class="metric-val">${value}</div></div>`;
}

function renderChangePasswordForm(role) {
  const cancelFn = role === 'admin'
    ? `adminNav('dashboard', document.querySelector('#s-admin .nav-item'))`
    : `taskerNav('dashboard', document.querySelector('#s-tasker .nav-item'))`;
  const submitFn = role === 'admin' ? 'submitAdminPasswordChange()' : 'submitTaskerPasswordChange()';
  return `
    <div class="page-title">Settings</div>
    <div class="page-sub">Manage your account</div>
    <div class="card" style="max-width:440px">
      <div class="form-section-title">Change Password</div>
      <div class="field"><label>Old Password</label><input type="password" id="pw-old" placeholder="Current password"></div>
      <div class="field"><label>New Password</label><input type="password" id="pw-new" placeholder="New password"></div>
      <div class="field"><label>Confirm New Password</label><input type="password" id="pw-confirm" placeholder="Confirm new password"></div>
      <div id="pw-msg" style="display:none"></div>
      <div class="form-actions">
        <button class="btn primary" onclick="${submitFn}">Update Password</button>
        <button class="btn" onclick="${cancelFn}">Cancel</button>
      </div>
    </div>`;
}
