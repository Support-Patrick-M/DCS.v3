// ============================================================
// ui.js — Shared UI utilities
// ============================================================

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}

function showModal(html) {
  let layer = document.getElementById('modal-layer');
  layer.innerHTML = `<div class="modal-bg" onclick="handleModalBg(event)"><div class="modal">${html}</div></div>`;
}
function closeModal() { document.getElementById('modal-layer').innerHTML = ''; }
function handleModalBg(e) { if (e.target.classList.contains('modal-bg')) closeModal(); }

function showMsg(id, text, type = 'error') {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.display = 'block';
  el.className = type === 'success' ? 'msg-success' : 'msg-error';
  el.textContent = text;
}
function clearMsg(id) {
  const el = document.getElementById(id);
  if (el) { el.style.display = 'none'; el.textContent = ''; }
}

function setActiveNav(scope, el) {
  document.querySelectorAll(`#${scope} .nav-item`).forEach(n => n.classList.remove('active'));
  if (el) el.classList.add('active');
}

function fmtMinutes(min) {
  const h = Math.floor(min / 60), m = min % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

// Picked file state for upload modal
let _pickedFile = null;
function getPickedFile()  { return _pickedFile; }
function clearPickedFile(){ _pickedFile = null; }
