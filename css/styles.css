/* ============================================================
   VCS — Video Collection System · styles.css
   Aesthetic: Industrial Utility · DM Sans + DM Mono
   ============================================================ */

/* ── Reset ──────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── Tokens ──────────────────────────────────────────────── */
:root {
  /* Palette — warm off-white with dark ink */
  --ink:         #14130F;
  --ink-2:       #3D3B35;
  --ink-3:       #7A7870;
  --ink-4:       #B0AEA8;
  --surface:     #FAFAF7;
  --surface-2:   #F2F1EC;
  --surface-3:   #E8E7E0;
  --border:      rgba(20,19,15,0.10);
  --border-2:    rgba(20,19,15,0.18);

  /* Accents */
  --accent:      #D4500A;   /* burnt orange — action */
  --accent-bg:   #FDF0E8;
  --green:       #2A7A4B;
  --green-bg:    #E6F5ED;
  --amber:       #A05A00;
  --amber-bg:    #FFF3DC;
  --red:         #B02020;
  --red-bg:      #FCEAEA;
  --blue:        #1A5FAA;
  --blue-bg:     #E6F0FB;

  /* Tags */
  --tag-soon-bg:    #FFF3DC;
  --tag-soon-color: #A05A00;
  --tag-soon-border:rgba(160,90,0,0.25);
  --tag-active-bg:  #E6F5ED;
  --tag-active-color:#2A7A4B;

  /* Type */
  --font:      'DM Sans', sans-serif;
  --font-mono: 'DM Mono', monospace;

  /* Radii */
  --r-sm: 4px;
  --r-md: 8px;
  --r-lg: 12px;
  --r-xl: 16px;
}

body {
  font-family: var(--font);
  font-size: 14px;
  color: var(--ink);
  background: var(--surface-2);
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
}

/* ── Screen system ───────────────────────────────────────── */
.screen { display: none; min-height: 100vh; }
.screen.active { display: flex; flex-direction: column; }

/* ── Login ───────────────────────────────────────────────── */
#s-login { background: var(--ink); }
#s-login.active { display: flex; }

.login-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background:
    radial-gradient(ellipse 60% 50% at 20% 80%, rgba(212,80,10,0.18) 0%, transparent 60%),
    radial-gradient(ellipse 50% 40% at 80% 20%, rgba(212,80,10,0.10) 0%, transparent 55%),
    var(--ink);
}

.login-box { width: 100%; max-width: 340px; }

.login-logo {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 2rem;
}
.login-logo-icon {
  width: 44px;
  height: 44px;
  background: var(--accent);
  color: #fff;
  border-radius: var(--r-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}
.login-title  { font-size: 22px; font-weight: 600; color: #fff; letter-spacing: -0.3px; }
.login-sub    { font-size: 12px; color: rgba(255,255,255,0.45); margin-top: 1px; }

.login-card {
  background: rgba(255,255,255,0.06);
  border: 0.5px solid rgba(255,255,255,0.12);
  border-radius: var(--r-xl);
  padding: 1.5rem;
  backdrop-filter: blur(12px);
}
.login-card label { color: rgba(255,255,255,0.55); }
.login-card input {
  background: rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.14);
  color: #fff;
}
.login-card input::placeholder { color: rgba(255,255,255,0.28); }
.login-card input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(212,80,10,0.20);
  outline: none;
}

.login-hint {
  margin-top: 14px;
  font-size: 11px;
  color: rgba(255,255,255,0.28);
  text-align: center;
  font-family: var(--font-mono);
}
.login-hint span { color: rgba(255,255,255,0.5); }

/* ── App shell ───────────────────────────────────────────── */
#s-tasker.active, #s-admin.active { display: flex; flex-direction: column; }

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  height: 52px;
  background: var(--ink);
  position: sticky;
  top: 0;
  z-index: 20;
  flex-shrink: 0;
}

.header-logo {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.5px;
  font-family: var(--font-mono);
}

.role-chip {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  padding: 3px 9px;
  border-radius: 20px;
}
.role-chip.admin  { background: rgba(212,80,10,0.25); color: #FF9B6A; border: 0.5px solid rgba(212,80,10,0.4); }
.role-chip.tasker { background: rgba(42,122,75,0.25);  color: #6FD49A; border: 0.5px solid rgba(42,122,75,0.4); }

.header-left  { display: flex; align-items: center; gap: 12px; }
.header-right { display: flex; align-items: center; gap: 10px; }
.user-label   { font-size: 12px; color: rgba(255,255,255,0.45); font-family: var(--font-mono); }

.app-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* ── Sidebar ─────────────────────────────────────────────── */
.sidebar {
  width: 196px;
  flex-shrink: 0;
  background: var(--surface);
  border-right: 0.5px solid var(--border);
  padding: 1rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: var(--r-md);
  font-size: 13px;
  color: var(--ink-3);
  cursor: pointer;
  transition: background 0.12s, color 0.12s;
  user-select: none;
}
.nav-item:hover  { background: var(--surface-2); color: var(--ink); }
.nav-item.active { background: var(--surface-2); color: var(--ink); font-weight: 500; }
.nav-icon { font-size: 11px; opacity: 0.6; flex-shrink: 0; }

/* ── Main content ────────────────────────────────────────── */
.content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  background: var(--surface-2);
}

/* ── Section header ──────────────────────────────────────── */
.section-hd {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}
.section-title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--ink-3);
}
.page-title {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.3px;
  margin-bottom: 4px;
}
.page-sub {
  font-size: 13px;
  color: var(--ink-3);
  margin-bottom: 1.5rem;
}

/* ── Metric grid ─────────────────────────────────────────── */
.metrics-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 1.75rem;
}
.metric-card {
  background: var(--surface);
  border: 0.5px solid var(--border);
  border-radius: var(--r-lg);
  padding: 1.1rem 1.25rem;
  position: relative;
  overflow: hidden;
}
.metric-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: var(--accent);
  opacity: 0.5;
}
.metric-lbl { font-size: 11px; color: var(--ink-3); text-transform: uppercase; letter-spacing: 0.5px; }
.metric-val { font-size: 28px; font-weight: 600; margin-top: 4px; letter-spacing: -1px; font-family: var(--font-mono); }

/* ── Card ────────────────────────────────────────────────── */
.card {
  background: var(--surface);
  border: 0.5px solid var(--border);
  border-radius: var(--r-lg);
  padding: 1.25rem;
}
.card + .card, .card + .section-hd { margin-top: 1.5rem; }

/* ── Task rows ───────────────────────────────────────────── */
.task-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 0.5px solid var(--border);
  gap: 12px;
  transition: background 0.1s;
}
.task-row:last-child { border-bottom: none; padding-bottom: 0; }
.task-row:first-child { padding-top: 0; }

.task-info  { flex: 1; min-width: 0; }
.task-title { font-size: 14px; font-weight: 500; }
.task-meta  { font-size: 11px; color: var(--ink-3); margin-top: 3px; font-family: var(--font-mono); }
.task-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; padding-top: 2px; }

/* ── Progress bar ────────────────────────────────────────── */
.progress-bar {
  height: 3px;
  background: var(--surface-3);
  border-radius: 2px;
  margin-top: 8px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: var(--accent);
  border-radius: 2px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.prog-label { font-size: 10px; color: var(--ink-4); margin-top: 3px; font-family: var(--font-mono); }

/* ── Badges ──────────────────────────────────────────────── */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}
.badge.pending  { background: var(--amber-bg);   color: var(--amber); }
.badge.done     { background: var(--green-bg);   color: var(--green); }
.badge.active   { background: var(--green-bg);   color: var(--green); }
.badge.disabled { background: var(--surface-3);  color: var(--ink-3); }
.badge.coming-soon { background: var(--tag-soon-bg); color: var(--tag-soon-color); border: 0.5px solid var(--tag-soon-border); }
.badge.task-active { background: var(--tag-active-bg); color: var(--tag-active-color); }

/* ── Buttons ─────────────────────────────────────────────── */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: var(--r-md);
  border: 0.5px solid var(--border-2);
  background: transparent;
  color: var(--ink);
  font-size: 13px;
  font-family: var(--font);
  font-weight: 500;
  cursor: pointer;
  transition: background 0.13s, opacity 0.13s, border-color 0.13s;
  white-space: nowrap;
  flex-shrink: 0;
}
.btn:hover    { background: var(--surface-3); }
.btn.primary  { background: var(--ink); color: #fff; border-color: transparent; }
.btn.primary:hover { opacity: 0.85; background: var(--ink); }
.btn.accent   { background: var(--accent); color: #fff; border-color: transparent; }
.btn.accent:hover { opacity: 0.85; background: var(--accent); }
.btn.danger   { color: var(--red); border-color: rgba(176,32,32,0.25); }
.btn.danger:hover { background: var(--red-bg); }
.btn.ghost    { border-color: rgba(255,255,255,0.18); color: rgba(255,255,255,0.7); background: transparent; }
.btn.ghost:hover  { background: rgba(255,255,255,0.08); color: #fff; }
.btn.sm       { padding: 5px 10px; font-size: 12px; }
.btn.xs       { padding: 3px 8px; font-size: 11px; }
.btn.full-w   { width: 100%; }

/* ── Form elements ───────────────────────────────────────── */
.field { margin-bottom: 14px; }
label {
  display: block;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--ink-3);
  margin-bottom: 5px;
}
input[type="text"],
input[type="password"],
input[type="number"],
select,
textarea {
  width: 100%;
  padding: 8px 11px;
  border: 0.5px solid var(--border-2);
  border-radius: var(--r-md);
  font-size: 13px;
  font-family: var(--font);
  background: var(--surface);
  color: var(--ink);
  transition: border-color 0.15s, box-shadow 0.15s;
  appearance: none;
}
input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-bg);
}
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-actions { display: flex; gap: 8px; margin-top: 6px; }
.form-section-title {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--ink-3);
  margin-bottom: 1rem;
  padding-bottom: 8px;
  border-bottom: 0.5px solid var(--border);
}
.mt-sm { margin-top: 8px; }

/* ── Radio group ─────────────────────────────────────────── */
.radio-group { display: flex; flex-direction: column; gap: 8px; margin-top: 6px; }
.radio-opt {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  font-size: 13px;
  cursor: pointer;
  padding: 8px 10px;
  border-radius: var(--r-md);
  border: 0.5px solid var(--border);
  transition: border-color 0.12s, background 0.12s;
}
.radio-opt:hover { background: var(--surface-2); border-color: var(--border-2); }
.radio-opt input[type="radio"] { margin-top: 2px; accent-color: var(--accent); flex-shrink: 0; }
.radio-opt-lbl  { font-weight: 500; }
.radio-opt-desc { font-size: 11px; color: var(--ink-3); margin-top: 1px; }

/* ── File drop ───────────────────────────────────────────── */
.file-drop {
  display: block;
  border: 1.5px dashed var(--border-2);
  border-radius: var(--r-lg);
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  color: var(--ink-3);
  font-size: 13px;
  transition: border-color 0.15s, background 0.15s;
}
.file-drop:hover { border-color: var(--accent); background: var(--accent-bg); color: var(--ink); }
.file-drop-icon { font-size: 28px; margin-bottom: 8px; opacity: 0.5; }
.file-drop-hint { font-size: 11px; margin-top: 4px; opacity: 0.7; }
.file-chosen { font-size: 12px; color: var(--ink-3); margin-top: 8px; font-family: var(--font-mono); min-height: 18px; }

/* ── Modal ───────────────────────────────────────────────── */
#modal-layer { position: fixed; inset: 0; z-index: 100; pointer-events: none; }
.modal-bg {
  position: absolute; inset: 0;
  background: rgba(20,19,15,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  pointer-events: all;
  animation: fadein 0.15s ease;
}
@keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
.modal {
  background: var(--surface);
  border-radius: var(--r-xl);
  border: 0.5px solid var(--border);
  padding: 1.75rem;
  width: 420px;
  max-width: 95vw;
  box-shadow: 0 16px 48px rgba(20,19,15,0.18);
  animation: slideup 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes slideup { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
.modal-title  { font-size: 16px; font-weight: 600; margin-bottom: 8px; letter-spacing: -0.2px; }
.modal-body   { font-size: 13px; color: var(--ink-2); margin-bottom: 1.25rem; line-height: 1.6; }
.modal-body strong { color: var(--ink); }
.modal-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 1.25rem; }

/* ── Messages ────────────────────────────────────────────── */
.msg-error {
  font-size: 12px;
  color: var(--red);
  padding: 8px 11px;
  background: var(--red-bg);
  border: 0.5px solid rgba(176,32,32,0.2);
  border-radius: var(--r-md);
  margin-top: 8px;
}
.msg-success {
  font-size: 12px;
  color: var(--green);
  padding: 8px 11px;
  background: var(--green-bg);
  border-radius: var(--r-md);
  margin-top: 8px;
}

/* ── Manage task — task list item ────────────────────────── */
.mtask-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 0.5px solid var(--border);
  gap: 12px;
}
.mtask-row:last-child { border-bottom: none; padding-bottom: 0; }
.mtask-row:first-child { padding-top: 0; }
.mtask-tag-actions { display: flex; align-items: center; gap: 6px; }

/* ── Info box ────────────────────────────────────────────── */
.info-box {
  background: var(--blue-bg);
  border: 0.5px solid rgba(26,95,170,0.2);
  border-radius: var(--r-md);
  padding: 10px 12px;
  font-size: 12px;
  color: var(--blue);
  margin-bottom: 14px;
  line-height: 1.5;
}

/* ── Empty state ─────────────────────────────────────────── */
.empty-state {
  text-align: center;
  padding: 2.5rem 1rem;
  color: var(--ink-4);
  font-size: 13px;
}
.empty-icon { font-size: 28px; margin-bottom: 8px; opacity: 0.4; }

/* ── Divider ─────────────────────────────────────────────── */
.divider { height: 0.5px; background: var(--border); margin: 1.25rem 0; }

/* ── Loading ─────────────────────────────────────────────── */
.loading-state { font-size: 13px; color: var(--ink-4); padding: 2rem 0; }

/* ── Assign task sub-section ─────────────────────────────── */
.sub-panel {
  background: var(--surface-2);
  border: 0.5px solid var(--border);
  border-radius: var(--r-md);
  padding: 1rem 1.1rem;
  margin-top: 12px;
}
.sub-panel-title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--ink-3);
  margin-bottom: 10px;
}

/* ── Responsive ──────────────────────────────────────────── */
@media (max-width: 640px) {
  .metrics-row { grid-template-columns: 1fr 1fr; }
  .sidebar { width: 160px; }
  .content { padding: 1.25rem; }
}
@media (max-width: 480px) {
  .app-body { flex-direction: column; }
  .sidebar { width: 100%; flex-direction: row; overflow-x: auto; padding: 0.5rem; border-right: none; border-bottom: 0.5px solid var(--border); }
  .nav-item { white-space: nowrap; }
}

/* ── Uploaded Videos ──────────────────────────────────────── */
.video-filters .video-filter-row {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 14px;
}

.video-card {
  background: var(--surface);
  border: 0.5px solid var(--border);
  border-radius: var(--r-lg);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
}
.video-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(20,19,15,0.1);
  border-color: var(--border-2);
}

.video-thumb {
  background: var(--ink);
  height: 130px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
}
.video-thumb::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, rgba(212,80,10,0.2) 0%, transparent 70%);
}
.video-play-icon {
  font-size: 28px;
  color: rgba(255,255,255,0.9);
  z-index: 1;
  width: 50px;
  height: 50px;
  background: rgba(212,80,10,0.8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, transform 0.15s;
}
.video-card:hover .video-play-icon {
  background: var(--accent);
  transform: scale(1.08);
}
.video-filename {
  font-size: 10px;
  color: rgba(255,255,255,0.4);
  font-family: var(--font-mono);
  z-index: 1;
  max-width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.video-card-body { padding: 10px 12px 12px; }
.video-card-title { font-size: 13px; font-weight: 500; margin-bottom: 5px; }
.video-card-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 11px;
  color: var(--ink-3);
  font-family: var(--font-mono);
}

/* ── Video player modal ───────────────────────────────────── */
.video-player-wrap {
  background: var(--ink);
  border-radius: var(--r-md);
  overflow: hidden;
  margin-bottom: 14px;
}

.video-player-screen {
  height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: radial-gradient(ellipse at center, rgba(212,80,10,0.15) 0%, transparent 65%), var(--ink);
}
.video-player-icon {
  font-size: 32px;
  color: rgba(255,255,255,0.7);
  width: 60px;
  height: 60px;
  background: rgba(212,80,10,0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.video-player-filename {
  font-size: 11px;
  color: rgba(255,255,255,0.5);
  font-family: var(--font-mono);
}

.video-player-controls {
  padding: 10px 12px;
  background: rgba(0,0,0,0.3);
}
.vpc-bar {
  height: 4px;
  background: rgba(255,255,255,0.15);
  border-radius: 2px;
  margin-bottom: 8px;
  overflow: hidden;
}
.vpc-fill {
  height: 100%;
  background: var(--accent);
  border-radius: 2px;
  width: 0%;
  transition: width 0.1s linear;
}
.vpc-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.vpc-btn {
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  background: rgba(212,80,10,0.8);
  border: none;
  border-radius: var(--r-sm);
  padding: 4px 10px;
  cursor: pointer;
  font-family: var(--font);
  transition: background 0.12s;
}
.vpc-btn:hover { background: var(--accent); }
.vpc-time { font-size: 10px; color: rgba(255,255,255,0.45); font-family: var(--font-mono); }

/* ── Video detail rows ────────────────────────────────────── */
.video-details {
  background: var(--surface-2);
  border-radius: var(--r-md);
  padding: 10px 12px;
  margin-bottom: 4px;
}
.vd-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  border-bottom: 0.5px solid var(--border);
  font-size: 12px;
}
.vd-row:last-child { border-bottom: none; }
.vd-lbl { color: var(--ink-3); }
.vd-val { font-weight: 500; font-family: var(--font-mono); }
