/* =====================================================
   ExamDriller Online — app.js
   Maxh Technologies © 2026
   ===================================================== */

'use strict';

/* ── GOOGLE APPS SCRIPT URL ──────────────────────────
   After deploying your Code.gs as a Web App, paste
   the URL here (between the quotes).
   ──────────────────────────────────────────────────── */
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwkyhhnsFGLtieMWWiVaxiqhluewh3jrMr41mTSAKHSZkAGzj9qDZyU2Glf9MMfygBN/exec';

/* ── SUBJECT METADATA ──────────────────────────────── */
const SUBJECTS_META = [
  { cat_id: 2,  title: 'English Language',         file: 'eng.json',   icon: '📝', compulsory: true,  qCount: 60 },
  { cat_id: 3,  title: 'Mathematics',               file: 'maths.json', icon: '📐', compulsory: false, qCount: 40 },
  { cat_id: 4,  title: 'Physics',                   file: 'phy.json',   icon: '⚡', compulsory: false, qCount: 40 },
  { cat_id: 5,  title: 'Chemistry',                 file: 'chem.json',  icon: '🧪', compulsory: false, qCount: 40 },
  { cat_id: 6,  title: 'Biology',                   file: 'bio.json',   icon: '🌿', compulsory: false, qCount: 40 },
  { cat_id: 7,  title: 'Geography',                 file: 'geo.json',   icon: '🌍', compulsory: false, qCount: 40 },
  { cat_id: 8,  title: 'Literature in English',     file: 'lit.json',   icon: '📚', compulsory: false, qCount: 40 },
  { cat_id: 9,  title: 'Economics',                 file: 'econs.json', icon: '📊', compulsory: false, qCount: 40 },
  { cat_id: 10, title: 'Commerce',                  file: 'comm.json',  icon: '🏪', compulsory: false, qCount: 40 },
  { cat_id: 11, title: 'Accounts',                  file: 'acc.json',   icon: '🧾', compulsory: false, qCount: 40 },
  { cat_id: 12, title: 'Government',                file: 'govt.json',  icon: '🏛️', compulsory: false, qCount: 40 },
  { cat_id: 13, title: 'CRK',                       file: 'crk.json',   icon: '✝️', compulsory: false, qCount: 40 },
  { cat_id: 14, title: 'Agricultural Science',      file: 'agric.json', icon: '🌾', compulsory: false, qCount: 40 },
  { cat_id: 15, title: 'Islamic Religious Studies', file: 'irs.json',   icon: '☪️', compulsory: false, qCount: 40 },
];

const QUESTION_COUNTS = [20, 40, 60];
const TIMER_OPTIONS   = [
  { label: '30 min',  value: 1800  },
  { label: '1 hr',    value: 3600  },
  { label: '1.5 hrs', value: 5400  },
  { label: '2 hrs',   value: 7200  },
  { label: '3 hrs',   value: 10800 },
];

/* ── USER AUTH STATE ───────────────────────────────── */
let currentUser = null; // { name, email }

/* ── EXAM STATE ────────────────────────────────────── */
let examState = {
  selectedSubjects: [],
  subjectConfigs:   {},
  timerSeconds:     7200,
  questions:        [],
  answers:          {},
  currentIndex:     0,
  timeRemaining:    7200,
  timerInterval:    null,
  submitted:        false,
  subjectData:      {},
  results:          null,
};

/* ── SCREEN MANAGEMENT ─────────────────────────────── */
const screens = {
  login:    document.getElementById('screen-login'),
  register: document.getElementById('screen-register'),
  home:     document.getElementById('screen-home'),
  subjects: document.getElementById('screen-subjects'),
  config:   document.getElementById('screen-config'),
  exam:     document.getElementById('screen-exam'),
  results:  document.getElementById('screen-results'),
  review:   document.getElementById('screen-review'),
};

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
  window.scrollTo(0, 0);
}

/* ── TOAST ─────────────────────────────────────────── */
const toastEl = document.getElementById('toast');
let toastTimer = null;
function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3000);
}

/* ── LOADING OVERLAY ───────────────────────────────── */
let loadingOverlay = null;
function showLoading(msg = 'Loading…') {
  if (!loadingOverlay) {
    loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `<div class="spinner"></div><p>${msg}</p>`;
    document.body.appendChild(loadingOverlay);
  } else {
    loadingOverlay.querySelector('p').textContent = msg;
    loadingOverlay.classList.remove('hidden');
  }
}
function hideLoading() {
  if (loadingOverlay) loadingOverlay.classList.add('hidden');
}

/* ── FISHER-YATES SHUFFLE ──────────────────────────── */
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ═══════════════════════════════════════════════════════
   AUTH — LOGIN & REGISTER
   ═══════════════════════════════════════════════════════ */

/** Make a POST call to the Apps Script web app */
async function apiCall(data) {
  const res = await fetch(APPS_SCRIPT_URL, {
    method:  'POST',
    body:    JSON.stringify(data),
    headers: { 'Content-Type': 'text/plain' }, // avoid preflight CORS issue with GAS
  });
  if (!res.ok) throw new Error('Server error: ' + res.status);
  return res.json();
}

/** Save user to memory + localStorage */
function saveSession(user) {
  currentUser = user;
  try { localStorage.setItem('examdriller_user', JSON.stringify(user)); } catch (_) {}
  updateHomeGreeting();
}

/** Clear session */
function clearSession() {
  currentUser = null;
  try { localStorage.removeItem('examdriller_user'); } catch (_) {}
}

/** Update "Hello, Name" text on home screen */
function updateHomeGreeting() {
  const el = document.getElementById('home-greeting');
  if (el && currentUser) {
    el.textContent = `Hello, ${currentUser.name}`;
  }
}

/** On load — restore saved session or show login */
function initAuth() {
  try {
    const saved = localStorage.getItem('examdriller_user');
    if (saved) {
      currentUser = JSON.parse(saved);
      updateHomeGreeting();
      showScreen('home');
      return;
    }
  } catch (_) {}
  showScreen('login');
}

/* ── Login form ────────────────────────────────────── */
document.getElementById('btn-login').addEventListener('click', async () => {
  const email = document.getElementById('login-email').value.trim();
  if (!email) { showToast('Please enter your email address'); return; }

  if (APPS_SCRIPT_URL === 'YOUR_APPS_SCRIPT_URL') {
    // Dev shortcut: skip API and create a local guest session
    saveSession({ name: email.split('@')[0], email });
    showScreen('home');
    return;
  }

  showLoading('Signing in…');
  try {
    const result = await apiCall({ action: 'login', email });
    hideLoading();
    if (result.success) {
      saveSession(result.user);
      showScreen('home');
      showToast(`Welcome back, ${result.user.name}!`);
    } else {
      showToast(result.error || 'Account not found. Please create one.');
    }
  } catch (e) {
    hideLoading();
    showToast('Connection error. Check your internet and try again.');
    console.error(e);
  }
});

/* Allow pressing Enter in the email field */
document.getElementById('login-email').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('btn-login').click();
});

/* ── Register form ─────────────────────────────────── */
document.getElementById('btn-register').addEventListener('click', async () => {
  const name  = document.getElementById('reg-name').value.trim();
  const phone = document.getElementById('reg-phone').value.trim();
  const email = document.getElementById('reg-email').value.trim();

  if (!name || !phone || !email) { showToast('All fields are required'); return; }

  if (APPS_SCRIPT_URL === 'YOUR_APPS_SCRIPT_URL') {
    // Dev shortcut: skip API
    saveSession({ name, email });
    showScreen('home');
    showToast(`Welcome, ${name}!`);
    return;
  }

  showLoading('Creating account…');
  try {
    const result = await apiCall({ action: 'register', name, phone, email });
    hideLoading();
    if (result.success) {
      saveSession(result.user);
      showScreen('home');
      showToast(`Account created! Welcome, ${result.user.name}!`);
    } else {
      showToast(result.error || 'Registration failed. Please try again.');
    }
  } catch (e) {
    hideLoading();
    showToast('Connection error. Check your internet and try again.');
    console.error(e);
  }
});

/* ── Screen switch links ───────────────────────────── */
document.getElementById('btn-go-register').addEventListener('click', () => showScreen('register'));
document.getElementById('btn-go-login').addEventListener('click', () => showScreen('login'));

/* ── Logout ────────────────────────────────────────── */
document.getElementById('btn-logout').addEventListener('click', () => {
  clearSession();
  document.getElementById('login-email').value = '';
  showScreen('login');
});

/* ── Score submission to Google Sheets ─────────────── */
async function submitScoreToSheets(score, outOf, subjectTitles) {
  if (!currentUser || APPS_SCRIPT_URL === 'YOUR_APPS_SCRIPT_URL') return;
  try {
    await apiCall({
      action:   'saveScore',
      name:     currentUser.name,
      email:    currentUser.email,
      score,
      outOf,
      subjects: subjectTitles.join(', '),
    });
  } catch (e) {
    console.warn('Score save failed (non-critical):', e);
  }
}

/* ═══════════════════════════════════════════════════════
   SCREEN 1 — HOME
   ═══════════════════════════════════════════════════════ */
function initParticles() {
  // Particles for all three particle containers
  ['particles', 'particles-login', 'particles-register'].forEach(id => {
    const container = document.getElementById(id);
    if (!container) return;
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 8 + 3;
      p.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random() * 100}%;
        animation-duration:${Math.random() * 15 + 10}s;
        animation-delay:${Math.random() * 15}s;
      `;
      container.appendChild(p);
    }
  });
}

document.getElementById('btn-start').addEventListener('click', () => {
  renderSubjectGrid();
  showScreen('subjects');
});

/* ═══════════════════════════════════════════════════════
   SCREEN 2 — SUBJECT SELECTION
   ═══════════════════════════════════════════════════════ */
document.getElementById('back-to-home').addEventListener('click', () => showScreen('home'));

function renderSubjectGrid() {
  examState.selectedSubjects = [2]; // English always selected
  const grid = document.getElementById('subject-grid');
  grid.innerHTML = '';

  SUBJECTS_META.forEach(sub => {
    const card = document.createElement('div');
    card.className = 'subject-card' + (sub.compulsory ? ' compulsory selected' : '');
    card.dataset.catId = sub.cat_id;
    card.innerHTML = `
      <span class="card-icon">${sub.icon}</span>
      <span class="card-name">${sub.title}</span>
      <span class="card-count">${getQuestionCount(sub)} Qs</span>
      ${sub.compulsory ? '<span class="card-badge">Compulsory</span>' : ''}
    `;
    if (!sub.compulsory) {
      card.addEventListener('click', () => toggleSubject(sub.cat_id, card));
    }
    grid.appendChild(card);
  });

  updateSubjectCounter();
  updateContinueBtn();
}

function getQuestionCount(sub) {
  const counts = {2:1488,3:1087,4:1153,5:1146,6:1163,7:1013,8:592,9:1160,10:1104,11:1113,12:1114,13:1134,14:176,15:331};
  return (counts[sub.cat_id] || '—').toLocaleString();
}

function toggleSubject(catId, card) {
  const idx = examState.selectedSubjects.indexOf(catId);
  if (idx > -1) {
    examState.selectedSubjects.splice(idx, 1);
    card.classList.remove('selected');
  } else {
    const extraCount = examState.selectedSubjects.filter(id => id !== 2).length;
    if (extraCount >= 3) { showToast('Maximum 4 subjects allowed'); return; }
    examState.selectedSubjects.push(catId);
    card.classList.add('selected');
  }
  updateSubjectCounter();
  updateContinueBtn();
}

function updateSubjectCounter() {
  const extra = examState.selectedSubjects.filter(id => id !== 2).length;
  document.getElementById('subject-counter').textContent = `${extra}/3 selected`;
}

function updateContinueBtn() {
  const extra = examState.selectedSubjects.filter(id => id !== 2).length;
  document.getElementById('btn-continue-subjects').disabled = extra < 1;
}

document.getElementById('btn-continue-subjects').addEventListener('click', () => {
  renderConfigScreen();
  showScreen('config');
});

/* ═══════════════════════════════════════════════════════
   SCREEN 3 — EXAM CONFIGURATION
   ═══════════════════════════════════════════════════════ */
document.getElementById('back-to-subjects').addEventListener('click', () => showScreen('subjects'));

let selectedTimerSeconds = 7200;

function renderConfigScreen() {
  examState.subjectConfigs = {};
  examState.selectedSubjects.forEach(catId => {
    examState.subjectConfigs[catId] = { filterType: 'random', filterValue: null, qCount: catId === 2 ? 60 : 40 };
  });

  const body = document.getElementById('config-body');
  body.innerHTML = '';

  examState.selectedSubjects.forEach(catId => {
    const sub = SUBJECTS_META.find(s => s.cat_id === catId);
    const section = document.createElement('div');
    section.className = 'config-section';
    section.innerHTML = `
      <div class="config-section-header">
        <span class="card-icon">${sub.icon}</span>
        <h3>${sub.title}</h3>
      </div>
      <div class="config-section-body" id="config-body-${catId}">
        ${renderFilterBlock(sub)}
        ${renderQCountBlock(sub)}
      </div>
    `;
    body.appendChild(section);
  });

  const timerSection = document.createElement('div');
  timerSection.className = 'config-section';
  timerSection.innerHTML = `
    <div class="config-section-header">
      <span class="card-icon">⏱</span>
      <h3>Timer</h3>
    </div>
    <div class="config-section-body">
      <label class="config-label">Exam Duration</label>
      <div class="timer-group" id="timer-group">
        ${TIMER_OPTIONS.map(opt => `
          <button class="timer-opt-btn${opt.value === 7200 ? ' active' : ''}"
                  data-val="${opt.value}">${opt.label}</button>
        `).join('')}
      </div>
    </div>
  `;
  body.appendChild(timerSection);

  document.querySelectorAll('.timer-opt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.timer-opt-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedTimerSeconds = parseInt(btn.dataset.val);
      updateConfigSummary();
    });
  });

  examState.selectedSubjects.forEach(catId => {
    setupFilterListeners(catId);
    setupQCountListeners(catId);
  });

  updateConfigSummary();
}

function renderFilterBlock(sub) {
  if (sub.compulsory) {
    return `
      <div>
        <label class="config-label">Filter Type</label>
        <div class="toggle-group">
          <button class="toggle-btn active" disabled>Random</button>
        </div>
      </div>
    `;
  }
  return `
    <div>
      <label class="config-label">Filter Type</label>
      <div class="toggle-group" id="filter-toggle-${sub.cat_id}">
        <button class="toggle-btn active" data-type="random">Random</button>
        <button class="toggle-btn" data-type="year">By Year</button>
        <button class="toggle-btn" data-type="topic">By Topic</button>
      </div>
      <div id="filter-select-${sub.cat_id}" style="margin-top:10px;display:none;">
        <select class="config-select" id="filter-value-${sub.cat_id}">
          <option value="">Loading…</option>
        </select>
      </div>
    </div>
  `;
}

function renderQCountBlock(sub) {
  if (sub.compulsory) {
    return `
      <div>
        <label class="config-label">Questions</label>
        <div class="q-count-group">
          <button class="q-count-btn" disabled>60 (Fixed)</button>
        </div>
      </div>
    `;
  }
  return `
    <div>
      <label class="config-label">Number of Questions</label>
      <div class="q-count-group" id="qcount-group-${sub.cat_id}">
        ${QUESTION_COUNTS.map(n => `
          <button class="q-count-btn${n === 40 ? ' active' : ''}" data-count="${n}">${n}</button>
        `).join('')}
      </div>
    </div>
  `;
}

function setupFilterListeners(catId) {
  const sub = SUBJECTS_META.find(s => s.cat_id === catId);
  if (sub.compulsory) return;

  const toggles   = document.querySelectorAll(`#filter-toggle-${catId} .toggle-btn`);
  const selectWrap = document.getElementById(`filter-select-${catId}`);

  toggles.forEach(btn => {
    btn.addEventListener('click', () => {
      toggles.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const type = btn.dataset.type;
      examState.subjectConfigs[catId].filterType  = type;
      examState.subjectConfigs[catId].filterValue = null;

      if (type === 'random') {
        selectWrap.style.display = 'none';
      } else {
        selectWrap.style.display = 'block';
        populateFilterSelect(catId, type);
      }
      updateConfigSummary();
    });
  });
}

function setupQCountListeners(catId) {
  const sub = SUBJECTS_META.find(s => s.cat_id === catId);
  if (sub.compulsory) return;

  const btns = document.querySelectorAll(`#qcount-group-${catId} .q-count-btn`);
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      examState.subjectConfigs[catId].qCount = parseInt(btn.dataset.count);
      updateConfigSummary();
    });
  });
}

async function populateFilterSelect(catId, type) {
  const selectEl = document.getElementById(`filter-value-${catId}`);
  selectEl.innerHTML = '<option value="">Loading…</option>';

  try {
    const data = await loadSubjectData(catId);
    selectEl.innerHTML = '';

    if (type === 'year') {
      const years = [...new Set(data.questions.map(q => q.exam_year))].filter(Boolean).sort();
      years.forEach(y => {
        const opt = document.createElement('option');
        opt.value = y; opt.textContent = y;
        selectEl.appendChild(opt);
      });
    } else if (type === 'topic') {
      (data.topics || []).forEach(t => {
        const opt = document.createElement('option');
        opt.value = t.id; opt.textContent = t.topic;
        selectEl.appendChild(opt);
      });
    }

    if (selectEl.options.length) {
      examState.subjectConfigs[catId].filterValue = selectEl.options[0].value;
    }
    selectEl.addEventListener('change', () => {
      examState.subjectConfigs[catId].filterValue = selectEl.value;
    });
  } catch (e) {
    selectEl.innerHTML = '<option value="">Could not load options</option>';
  }
}

function updateConfigSummary() {
  let total = 0;
  examState.selectedSubjects.forEach(catId => {
    total += examState.subjectConfigs[catId]?.qCount || (catId === 2 ? 60 : 40);
  });
  const summaryEl = document.getElementById('config-summary');
  summaryEl.innerHTML = `
    <span>Total: <strong>${total} Qs</strong></span>
    <span>Score: <strong>out of 400</strong></span>
  `;
}

document.getElementById('btn-start-exam').addEventListener('click', startExam);

/* ═══════════════════════════════════════════════════════
   DATA LOADING
   ═══════════════════════════════════════════════════════ */
async function loadSubjectData(catId) {
  if (examState.subjectData[catId]) return examState.subjectData[catId];
  const sub = SUBJECTS_META.find(s => s.cat_id === catId);
  const res = await fetch(`data/${sub.file}`);
  if (!res.ok) throw new Error(`Failed to load ${sub.file}`);
  const data = await res.json();
  examState.subjectData[catId] = data;
  return data;
}

async function startExam() {
  showLoading('Loading questions…');
  try {
    const allQuestions = [];

    for (const catId of examState.selectedSubjects) {
      const data   = await loadSubjectData(catId);
      const config = examState.subjectConfigs[catId];
      const sub    = SUBJECTS_META.find(s => s.cat_id === catId);

      let pool = [...data.questions];

      if (config.filterType === 'year' && config.filterValue) {
        pool = pool.filter(q => q.exam_year === config.filterValue);
      } else if (config.filterType === 'topic' && config.filterValue) {
        pool = pool.filter(q => String(q.topic_id) === String(config.filterValue));
      }

      pool = shuffle(pool);
      const needed = config.qCount;

      if (pool.length < needed) {
        showToast(`Only ${pool.length} questions available for ${sub.title} filter.`);
      }

      const selected = pool.slice(0, Math.min(needed, pool.length));

      selected.forEach(q => {
        q._cat_id   = catId;
        q._subTitle = sub.title;
        q._subIcon  = sub.icon;
        q._passages = data.passages || {};
      });

      allQuestions.push(...selected);
    }

    examState.questions    = allQuestions;
    examState.answers      = {};
    examState.currentIndex = 0;
    examState.submitted    = false;
    examState.timerSeconds = selectedTimerSeconds;
    examState.results      = null;

    hideLoading();
    renderExamScreen();
    showScreen('exam');
    startTimer(selectedTimerSeconds);
  } catch (err) {
    hideLoading();
    showToast('Error loading questions. Check data files.');
    console.error(err);
  }
}

/* ═══════════════════════════════════════════════════════
   SCREEN 4 — EXAM
   ═══════════════════════════════════════════════════════ */
function renderExamScreen() {
  renderSubjectTabs();
  renderPaletteGrid();
  renderQuestion(examState.currentIndex);
}

function renderSubjectTabs() {
  const tabsEl = document.getElementById('subject-tabs');
  tabsEl.innerHTML = '';

  const seen = [];
  examState.questions.forEach(q => {
    if (!seen.includes(q._cat_id)) seen.push(q._cat_id);
  });

  seen.forEach(catId => {
    const sub = SUBJECTS_META.find(s => s.cat_id === catId);
    const btn = document.createElement('button');
    btn.className = 'tab-btn';
    btn.textContent = sub.title.split(' ')[0];
    btn.dataset.catId = catId;
    btn.addEventListener('click', () => jumpToSubject(catId));
    tabsEl.appendChild(btn);
  });

  updateActiveTab();
}

function updateActiveTab() {
  const current = examState.questions[examState.currentIndex];
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.catId) === current?._cat_id);
  });
}

function jumpToSubject(catId) {
  const idx = examState.questions.findIndex(q => q._cat_id === catId);
  if (idx > -1) navigateTo(idx);
}

function renderQuestion(index) {
  const q = examState.questions[index];
  if (!q) return;

  document.getElementById('q-counter').textContent = `Q ${index + 1} of ${examState.questions.length}`;

  const card = document.getElementById('question-card');
  card.innerHTML = '';

  const badge = document.createElement('div');
  badge.className = 'q-num-badge';
  badge.textContent = index + 1;
  card.appendChild(badge);

  // Passage
  if (q.passage_id && q._passages && q._passages[q.passage_id]) {
    const passageBox = document.createElement('div');
    passageBox.className = 'passage-box';
    passageBox.innerHTML = `
      <button class="passage-toggle">Read Passage <span>&#9660;</span></button>
      <div class="passage-content">${q._passages[q.passage_id]}</div>
    `;
    const toggle  = passageBox.querySelector('.passage-toggle');
    const content = passageBox.querySelector('.passage-content');
    toggle.addEventListener('click', () => {
      content.classList.toggle('open');
      toggle.querySelector('span').innerHTML = content.classList.contains('open') ? '&#9650;' : '&#9660;';
    });
    card.appendChild(passageBox);
  }

  const qText = document.createElement('div');
  qText.className = 'question-text';
  qText.innerHTML = q.question;
  card.appendChild(qText);

  if (q.photo) {
    const img = document.createElement('img');
    img.className = 'question-image';
    img.src       = `exam_images/question/${q.photo}`;
    img.alt       = 'Question image';
    img.onerror   = () => img.style.display = 'none';
    card.appendChild(img);
  }

  const opts = document.createElement('div');
  opts.className = 'options-list';

  ['a', 'b', 'c', 'd', 'e'].forEach(letter => {
    const optText = q[`option_${letter}`];
    if (optText === null || optText === undefined || String(optText).trim() === '') return;

    const btn = document.createElement('button');
    btn.className = 'option-btn' + (examState.answers[index] === letter ? ' selected' : '');
    btn.innerHTML = `<span class="option-letter">${letter.toUpperCase()}</span><span>${optText}</span>`;
    btn.addEventListener('click', () => selectAnswer(index, letter));
    opts.appendChild(btn);
  });

  card.appendChild(opts);
  updateNavButtons();
  updateActiveTab();
  updatePaletteHighlight();

  // Re-render any LaTeX math in the question
  if (window.MathJax && window.MathJax.typesetPromise) {
    window.MathJax.typesetPromise([card]).catch(() => {});
  }
}

function selectAnswer(index, letter) {
  examState.answers[index] = letter;
  renderQuestion(index);
  updatePaletteGrid();
}

function updateNavButtons() {
  document.getElementById('btn-prev').disabled = examState.currentIndex === 0;
  document.getElementById('btn-next').disabled = examState.currentIndex === examState.questions.length - 1;
}

function navigateTo(index) {
  if (index < 0 || index >= examState.questions.length) return;
  examState.currentIndex = index;
  renderQuestion(index);
  document.getElementById('palette-panel').classList.remove('open');
}

document.getElementById('btn-prev').addEventListener('click', () => navigateTo(examState.currentIndex - 1));
document.getElementById('btn-next').addEventListener('click', () => navigateTo(examState.currentIndex + 1));

/* ── PALETTE ───────────────────────────────────────── */
document.getElementById('btn-palette-toggle').addEventListener('click', () => {
  document.getElementById('palette-panel').classList.toggle('open');
});

function renderPaletteGrid() {
  const grid = document.getElementById('palette-grid');
  grid.innerHTML = '';
  examState.questions.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.className  = 'palette-num';
    btn.textContent = i + 1;
    btn.dataset.idx = i;
    btn.addEventListener('click', () => navigateTo(i));
    grid.appendChild(btn);
  });
  updatePaletteHighlight();
}

function updatePaletteGrid() {
  document.querySelectorAll('.palette-num').forEach(btn => {
    const i = parseInt(btn.dataset.idx);
    btn.classList.remove('answered', 'current');
    if (i === examState.currentIndex) btn.classList.add('current');
    else if (examState.answers[i])    btn.classList.add('answered');
  });
}

function updatePaletteHighlight() { updatePaletteGrid(); }

/* ── TIMER ─────────────────────────────────────────── */
const timerEl = document.getElementById('timer');

function startTimer(seconds) {
  examState.timeRemaining = seconds;
  clearInterval(examState.timerInterval);
  examState.timerInterval = setInterval(() => {
    examState.timeRemaining--;
    updateTimerDisplay();
    if (examState.timeRemaining <= 0) {
      clearInterval(examState.timerInterval);
      showToast("Time's up! Submitting your exam…");
      setTimeout(submitExam, 1500);
    }
  }, 1000);
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const mins = Math.floor(examState.timeRemaining / 60);
  const secs = examState.timeRemaining % 60;
  timerEl.textContent = `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;

  if      (examState.timeRemaining < 300)  timerEl.className = 'timer danger';
  else if (examState.timeRemaining < 900)  timerEl.className = 'timer warning';
  else                                      timerEl.className = 'timer';
}

/* ── SUBMIT ────────────────────────────────────────── */
document.getElementById('btn-submit-exam').addEventListener('click', () => {
  const unanswered = examState.questions.length - Object.keys(examState.answers).length;
  if (Object.keys(examState.answers).length === 0) {
    showToast('Please answer at least 1 question before submitting');
    return;
  }
  document.getElementById('modal-submit-msg').textContent =
    unanswered > 0
      ? `You have ${unanswered} unanswered question${unanswered > 1 ? 's' : ''}. Are you sure?`
      : 'All questions answered. Submit now?';
  document.getElementById('modal-submit').classList.remove('hidden');
});

document.getElementById('modal-cancel').addEventListener('click', () => {
  document.getElementById('modal-submit').classList.add('hidden');
});

document.getElementById('modal-confirm').addEventListener('click', () => {
  document.getElementById('modal-submit').classList.add('hidden');
  submitExam();
});

function submitExam() {
  if (examState.submitted) return;
  examState.submitted = true;
  clearInterval(examState.timerInterval);
  examState.results = calculateResults();

  // Send score to Google Sheets in the background
  const { totalScore } = examState.results;
  const subjectTitles  = examState.selectedSubjects.map(id => SUBJECTS_META.find(s => s.cat_id === id)?.title || '');
  submitScoreToSheets(totalScore, 400, subjectTitles);

  renderResultsScreen();
  showScreen('results');
}

/* ═══════════════════════════════════════════════════════
   SCORE CALCULATION
   ═══════════════════════════════════════════════════════ */
function calculateResults() {
  const results      = {};
  const subjectCount = examState.selectedSubjects.length;

  for (const catId of examState.selectedSubjects) {
    const subQuestions = examState.questions.filter(q => q._cat_id === catId);
    let correct = 0, wrong = 0, skipped = 0;

    subQuestions.forEach(q => {
      const globalIdx = examState.questions.indexOf(q);
      const ans       = examState.answers[globalIdx];
      if (!ans)                          skipped++;
      else if (ans === q.correct_answer) correct++;
      else                               wrong++;
    });

    const total = subQuestions.length;
    const sub   = SUBJECTS_META.find(s => s.cat_id === catId);

    results[catId] = {
      title:       sub.title,
      icon:        sub.icon,
      correct,
      wrong,
      skipped,
      total,
      scaledScore: total > 0 ? Math.round((correct / total) * (400 / subjectCount)) : 0,
    };
  }

  const totalScore = Object.values(results).reduce((sum, r) => sum + r.scaledScore, 0);
  return { bySubject: results, totalScore };
}

/* ═══════════════════════════════════════════════════════
   SCREEN 5 — RESULTS
   ═══════════════════════════════════════════════════════ */
function renderResultsScreen() {
  const { bySubject, totalScore } = examState.results;

  const scoreEl = document.getElementById('score-display');
  animateCounter(scoreEl, 0, totalScore, 1500);

  const grid = document.getElementById('results-grid');
  grid.innerHTML = '';

  Object.values(bySubject).forEach(r => {
    const pct  = r.total > 0 ? Math.round((r.correct / r.total) * 100) : 0;
    const card = document.createElement('div');
    card.className = 'result-card';
    card.innerHTML = `
      <span class="result-icon">${r.icon}</span>
      <div class="result-info">
        <div class="result-title">${r.title}</div>
        <div class="result-bar-wrap">
          <div class="result-bar" style="width:0%" data-pct="${pct}"></div>
        </div>
        <div class="result-stats">${r.correct} correct &middot; ${r.wrong} wrong &middot; ${r.skipped} skipped</div>
      </div>
      <div class="result-score">${r.scaledScore}<small>pts</small></div>
    `;
    grid.appendChild(card);
    setTimeout(() => { card.querySelector('.result-bar').style.width = `${pct}%`; }, 100);
  });
}

function animateCounter(el, from, to, duration) {
  const start = performance.now();
  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(from + (to - from) * eased);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

document.getElementById('btn-review').addEventListener('click', () => {
  renderReviewScreen('all');
  showScreen('review');
});

document.getElementById('btn-new-exam').addEventListener('click', () => {
  clearInterval(examState.timerInterval);
  examState = {
    selectedSubjects: [], subjectConfigs: {}, timerSeconds: 7200,
    questions: [], answers: {}, currentIndex: 0, timeRemaining: 7200,
    timerInterval: null, submitted: false, subjectData: examState.subjectData,
    results: null,
  };
  selectedTimerSeconds = 7200;
  showScreen('home');
});

/* ═══════════════════════════════════════════════════════
   SCREEN 6 — REVIEW
   ═══════════════════════════════════════════════════════ */
document.getElementById('back-to-results').addEventListener('click', () => showScreen('results'));

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderReviewScreen(btn.dataset.filter);
  });
});

function renderReviewScreen(filter) {
  const body = document.getElementById('review-body');
  body.innerHTML = '';

  let questions = examState.questions.map((q, i) => ({ q, i }));

  if (filter === 'correct') {
    questions = questions.filter(({ q, i }) => examState.answers[i] === q.correct_answer);
  } else if (filter === 'wrong') {
    questions = questions.filter(({ q, i }) => examState.answers[i] && examState.answers[i] !== q.correct_answer);
  } else if (filter === 'skipped') {
    questions = questions.filter(({ q, i }) => !examState.answers[i]);
  }

  if (questions.length === 0) {
    body.innerHTML = `<p style="text-align:center;color:var(--text-muted);padding:40px 20px;">No questions in this category.</p>`;
    return;
  }

  questions.forEach(({ q, i }) => {
    const ans = examState.answers[i];
    let statusClass, statusLabel, statusMark;

    if (!ans) {
      statusClass = 'status-skipped'; statusLabel = 'Skipped'; statusMark = '—';
    } else if (ans === q.correct_answer) {
      statusClass = 'status-correct'; statusLabel = 'Correct'; statusMark = '&#10003;';
    } else {
      statusClass = 'status-wrong';   statusLabel = 'Wrong';   statusMark = '&#10007;';
    }

    const item = document.createElement('div');
    item.className = 'review-item';

    const hasExplain = [q.core_concepts, q.step_by_step, q.common_pitfalls, q.applications].some(f => f && f.trim() !== '');

    let optsHTML = '';
    ['a','b','c','d','e'].forEach(letter => {
      const optText = q[`option_${letter}`];
      if (optText === null || optText === undefined || String(optText).trim() === '') return;
      const isCorrect  = letter === q.correct_answer;
      const isUserWrong = ans && ans === letter && letter !== q.correct_answer;
      let cls = 'review-option';
      if (isCorrect)    cls += ' correct-opt';
      if (isUserWrong)  cls += ' wrong-opt';
      optsHTML += `
        <div class="${cls}">
          <span class="review-opt-letter">${letter.toUpperCase()}</span>
          <span>${optText}</span>
        </div>
      `;
    });

    let passageHTML = '';
    if (q.passage_id && q._passages && q._passages[q.passage_id]) {
      passageHTML = `
        <div class="passage-box" style="margin-bottom:10px;">
          <button class="passage-toggle">Read Passage <span>&#9660;</span></button>
          <div class="passage-content">${q._passages[q.passage_id]}</div>
        </div>
      `;
    }

    let imgHTML = '';
    if (q.photo) {
      imgHTML = `<img class="question-image" src="exam_images/question/${q.photo}" alt="" onerror="this.style.display='none'" />`;
    }

    let explainHTML = '';
    if (hasExplain) {
      const tabs = [
        { key: 'core',    label: 'Core Concept',   val: q.core_concepts  },
        { key: 'step',    label: 'Step by Step',    val: q.step_by_step   },
        { key: 'pitfall', label: 'Common Pitfalls', val: q.common_pitfalls },
        { key: 'app',     label: 'Applications',    val: q.applications   },
      ].filter(t => t.val && t.val.trim() !== '');

      const tabBtns    = tabs.map((t, ti) => `<button class="explain-tab${ti===0?' active':''}" data-key="${t.key}">${t.label}</button>`).join('');
      const firstContent = tabs[0]?.val || '';
      explainHTML = `
        <button class="explain-toggle">Explain This <span>&#9660;</span></button>
        <div class="explain-panel">
          <div class="explain-tabs">${tabBtns}</div>
          <div class="explain-content" id="explain-content-${i}">${firstContent}</div>
        </div>
      `;
    }

    item.innerHTML = `
      <div class="review-item-header">
        <span class="review-badge ${statusClass}-badge">${statusMark}</span>
        <span class="review-q-num">Question ${i + 1} &middot; ${q._subTitle}</span>
        <span class="status-badge ${statusClass}">${statusLabel}</span>
      </div>
      <div class="review-item-body">
        ${passageHTML}
        <div class="review-question-text">${q.question}</div>
        ${imgHTML}
        <div class="review-options">${optsHTML}</div>
        ${explainHTML}
      </div>
    `;

    body.appendChild(item);

    item.querySelectorAll('.passage-toggle').forEach(toggle => {
      toggle.addEventListener('click', () => {
        const content = toggle.nextElementSibling;
        content.classList.toggle('open');
        toggle.querySelector('span').innerHTML = content.classList.contains('open') ? '&#9650;' : '&#9660;';
      });
    });

    if (hasExplain) {
      const explainToggle = item.querySelector('.explain-toggle');
      const explainPanel  = item.querySelector('.explain-panel');
      explainToggle.addEventListener('click', () => {
        explainPanel.classList.toggle('open');
        explainToggle.querySelector('span').innerHTML = explainPanel.classList.contains('open') ? '&#9650;' : '&#9660;';
      });

      item.querySelectorAll('.explain-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          item.querySelectorAll('.explain-tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          const key = tab.dataset.key;
          const map = { core: q.core_concepts, step: q.step_by_step, pitfall: q.common_pitfalls, app: q.applications };
          item.querySelector(`#explain-content-${i}`).textContent = map[key] || '';
        });
      });
    }
  });
}

/* ═══════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════ */
initParticles();
initAuth();

/* ═══════════════════════════════════════════════════════
   FLOATING CALCULATOR
   ═══════════════════════════════════════════════════════ */
(function () {
  const overlay   = document.getElementById('calc-overlay');
  const toggleBtn = document.getElementById('btn-calc-toggle');
  const closeBtn  = document.getElementById('calc-close');
  const exprEl    = document.getElementById('calc-expr');
  const resultEl  = document.getElementById('calc-result');

  if (!overlay || !toggleBtn) return;

  let calcExpr   = '';   // full expression string e.g. "12÷3+"
  let calcInput  = '0';  // current number being typed
  let justEvaled = false;

  function openCalc() {
    overlay.classList.remove('hidden');
    overlay.classList.add('show');
    toggleBtn.classList.add('active');
  }
  function closeCalc() {
    overlay.classList.add('hidden');
    overlay.classList.remove('show');
    toggleBtn.classList.remove('active');
  }

  toggleBtn.addEventListener('click', () => {
    overlay.classList.contains('hidden') ? openCalc() : closeCalc();
  });
  closeBtn.addEventListener('click', closeCalc);

  /* Close when tapping outside the panel */
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeCalc();
  });

  function updateDisplay() {
    exprEl.textContent  = calcExpr;
    resultEl.textContent = calcInput;
    /* Shrink font for long numbers */
    const len = calcInput.length;
    resultEl.style.fontSize = len > 12 ? '1.1rem' : len > 8 ? '1.5rem' : '2rem';
  }

  function toJsExpr(str) {
    return str.replace(/÷/g, '/').replace(/×/g, '*').replace(/−/g, '-');
  }

  function handleKey(btn) {
    const action = btn.dataset.action;
    const val    = btn.dataset.val;

    if (action === 'clear') {
      calcExpr   = '';
      calcInput  = '0';
      justEvaled = false;

    } else if (action === 'del') {
      if (justEvaled) { calcInput = '0'; justEvaled = false; return updateDisplay(); }
      calcInput = calcInput.length > 1 ? calcInput.slice(0, -1) : '0';

    } else if (action === 'sqrt') {
      const n = parseFloat(calcInput);
      if (!isNaN(n) && n >= 0) {
        calcExpr   = `√(${calcInput})`;
        calcInput  = String(parseFloat(Math.sqrt(n).toFixed(10)));
        justEvaled = true;
      } else {
        calcInput = 'Error';
      }

    } else if (action === 'equals') {
      if (!calcExpr && calcInput === '0') return;
      const full = calcExpr + calcInput;
      try {
        // eslint-disable-next-line no-new-func
        let ans = Function('"use strict"; return (' + toJsExpr(full) + ')')();
        if (!isFinite(ans)) { calcInput = 'Error'; calcExpr = ''; }
        else {
          calcExpr   = full + ' =';
          calcInput  = String(parseFloat(ans.toFixed(10)));
          justEvaled = true;
        }
      } catch (_) {
        calcInput  = 'Error';
        calcExpr   = '';
        justEvaled = true;
      }

    } else if (['+', '−', '×', '÷'].includes(val)) {
      if (calcInput === 'Error') { calcInput = '0'; calcExpr = ''; }
      if (justEvaled) { justEvaled = false; }
      /* Replace trailing operator if user taps another */
      const lastChar = calcExpr.slice(-1);
      if (['+','−','×','÷'].includes(lastChar)) {
        calcExpr = calcExpr.slice(0, -1) + val;
      } else {
        calcExpr += calcInput + val;
        calcInput = '0';
      }

    } else {
      /* Digit or decimal */
      if (justEvaled) { calcExpr = ''; calcInput = '0'; justEvaled = false; }
      if (val === '.') {
        if (!calcInput.includes('.')) calcInput += '.';
        return updateDisplay();
      }
      calcInput = calcInput === '0' ? val : calcInput + val;
      /* Cap length */
      if (calcInput.length > 15) return;
    }
    updateDisplay();
  }

  document.querySelectorAll('.calc-btn').forEach(btn => {
    btn.addEventListener('click', () => handleKey(btn));
  });

  /* Keyboard support when calculator is open */
  document.addEventListener('keydown', e => {
    if (overlay.classList.contains('hidden')) return;
    const map = {
      '0':'0','1':'1','2':'2','3':'3','4':'4',
      '5':'5','6':'6','7':'7','8':'8','9':'9',
      '.':'.', '+':'+', '-':'−', '*':'×', '/':'÷',
      'Enter':'equals', '=':'equals',
      'Backspace':'del', 'Escape':'clear',
    };
    const k = map[e.key];
    if (!k) return;
    e.preventDefault();
    if (['equals','del','clear'].includes(k)) {
      handleKey({ dataset: { action: k } });
    } else if (['+','−','×','÷'].includes(k)) {
      handleKey({ dataset: { val: k } });
    } else {
      handleKey({ dataset: { val: k } });
    }
  });

  updateDisplay();
})();
