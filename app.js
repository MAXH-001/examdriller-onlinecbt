/* =====================================================
   ExamDriller Online — app.js
   Maxh Technologies © 2025
   ===================================================== */

'use strict';

/* ── SUBJECT METADATA ──────────────────────────────── */
const SUBJECTS_META = [
  { cat_id: 2,  title: 'English Language',        file: 'eng.json',   icon: '📝', compulsory: true,  qCount: 60 },
  { cat_id: 3,  title: 'Mathematics',              file: 'maths.json', icon: '📐', compulsory: false, qCount: 40 },
  { cat_id: 4,  title: 'Physics',                  file: 'phy.json',   icon: '⚡', compulsory: false, qCount: 40 },
  { cat_id: 5,  title: 'Chemistry',                file: 'chem.json',  icon: '🧪', compulsory: false, qCount: 40 },
  { cat_id: 6,  title: 'Biology',                  file: 'bio.json',   icon: '🌿', compulsory: false, qCount: 40 },
  { cat_id: 7,  title: 'Geography',                file: 'geo.json',   icon: '🌍', compulsory: false, qCount: 40 },
  { cat_id: 8,  title: 'Literature in English',    file: 'lit.json',   icon: '📚', compulsory: false, qCount: 40 },
  { cat_id: 9,  title: 'Economics',                file: 'econs.json', icon: '📊', compulsory: false, qCount: 40 },
  { cat_id: 10, title: 'Commerce',                 file: 'comm.json',  icon: '🏪', compulsory: false, qCount: 40 },
  { cat_id: 11, title: 'Accounts',                 file: 'acc.json',   icon: '🧾', compulsory: false, qCount: 40 },
  { cat_id: 12, title: 'Government',               file: 'govt.json',  icon: '🏛️', compulsory: false, qCount: 40 },
  { cat_id: 13, title: 'CRK',                      file: 'crk.json',   icon: '✝️', compulsory: false, qCount: 40 },
  { cat_id: 14, title: 'Agricultural Science',     file: 'agric.json', icon: '🌾', compulsory: false, qCount: 40 },
  { cat_id: 15, title: 'Islamic Religious Studies',file: 'irs.json',   icon: '☪️', compulsory: false, qCount: 40 },
];

const QUESTION_COUNTS = [20, 40, 60];
const TIMER_OPTIONS   = [
  { label: '30 min', value: 1800 },
  { label: '1 hr',   value: 3600 },
  { label: '1.5 hrs',value: 5400 },
  { label: '2 hrs',  value: 7200 },
  { label: '3 hrs',  value: 10800 },
];

/* ── EXAM STATE ────────────────────────────────────── */
let examState = {
  selectedSubjects: [],   // array of cat_ids (user selection Screen 2)
  subjectConfigs: {},     // { cat_id: { filterType, filterValue, qCount } }
  timerSeconds: 7200,     // chosen timer
  questions: [],          // flat array of question objects (with cat_id, subjectTitle)
  answers: {},            // { questionIndex: 'a'|'b'|'c'|'d' }
  currentIndex: 0,
  timeRemaining: 7200,
  timerInterval: null,
  submitted: false,
  subjectData: {},        // { cat_id: fullJsonObject }
  results: null,
};

/* ── SCREEN MANAGEMENT ─────────────────────────────── */
const screens = {
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
function showLoading(msg = 'Loading questions…') {
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
   SCREEN 1 — HOME
   ═══════════════════════════════════════════════════════ */
function initParticles() {
  const container = document.getElementById('particles');
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
}
initParticles();

document.getElementById('btn-start').addEventListener('click', () => {
  renderSubjectGrid();
  showScreen('subjects');
});

/* ═══════════════════════════════════════════════════════
   SCREEN 2 — SUBJECT SELECTION
   ═══════════════════════════════════════════════════════ */
document.getElementById('back-to-home').addEventListener('click', () => showScreen('home'));

function renderSubjectGrid() {
  // Always reset selection except English
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
  // Use the question_count from index.json ideally, else use approx from meta
  const counts = {2:1488,3:1087,4:1153,5:1146,6:1163,7:1013,8:592,9:1160,10:1104,11:1113,12:1114,13:1134,14:176,15:331};
  return (counts[sub.cat_id] || '—').toLocaleString();
}

function toggleSubject(catId, card) {
  const idx = examState.selectedSubjects.indexOf(catId);
  if (idx > -1) {
    // Deselect
    examState.selectedSubjects.splice(idx, 1);
    card.classList.remove('selected');
  } else {
    // Count non-english selected
    const extraCount = examState.selectedSubjects.filter(id => id !== 2).length;
    if (extraCount >= 3) {
      showToast('Maximum 4 subjects allowed');
      return;
    }
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

// Timer state
let selectedTimerSeconds = 7200;

function renderConfigScreen() {
  // Init configs
  examState.subjectConfigs = {};
  examState.selectedSubjects.forEach(catId => {
    examState.subjectConfigs[catId] = { filterType: 'random', filterValue: null, qCount: catId === 2 ? 60 : 40 };
  });

  const body = document.getElementById('config-body');
  body.innerHTML = '';

  // Subject sections (we render them but we need topics/years from data — placeholder with generic options for now)
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

  // Timer section (once, for all)
  const timerSection = document.createElement('div');
  timerSection.className = 'config-section';
  timerSection.innerHTML = `
    <div class="config-section-header">
      <span class="card-icon">⏱️</span>
      <h3>Timer</h3>
    </div>
    <div class="config-section-body">
      <label class="config-label">Exam Duration</label>
      <div class="timer-group" id="timer-group">
        ${TIMER_OPTIONS.map((opt, i) => `
          <button class="timer-opt-btn${opt.value === 7200 ? ' active' : ''}"
                  data-val="${opt.value}">${opt.label}</button>
        `).join('')}
      </div>
    </div>
  `;
  body.appendChild(timerSection);

  // Timer listeners
  document.querySelectorAll('.timer-opt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.timer-opt-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedTimerSeconds = parseInt(btn.dataset.val);
      updateConfigSummary();
    });
  });

  // Toggle + select listeners
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

  const toggles = document.querySelectorAll(`#filter-toggle-${catId} .toggle-btn`);
  const selectWrap = document.getElementById(`filter-select-${catId}`);

  toggles.forEach(btn => {
    btn.addEventListener('click', () => {
      toggles.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const type = btn.dataset.type;
      examState.subjectConfigs[catId].filterType = type;
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

    // Default to first option
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
      const data = await loadSubjectData(catId);
      const config = examState.subjectConfigs[catId];
      const sub = SUBJECTS_META.find(s => s.cat_id === catId);

      let pool = [...data.questions];

      // Apply filter
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

      // Tag with subject info and passages
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

  // Build unique subjects in order
  const seen = [];
  examState.questions.forEach(q => {
    if (!seen.includes(q._cat_id)) seen.push(q._cat_id);
  });

  seen.forEach(catId => {
    const sub = SUBJECTS_META.find(s => s.cat_id === catId);
    const btn = document.createElement('button');
    btn.className = 'tab-btn';
    btn.textContent = sub.title.split(' ')[0]; // first word only
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

  // Update counter
  document.getElementById('q-counter').textContent = `Q ${index + 1} of ${examState.questions.length}`;

  const card = document.getElementById('question-card');
  card.innerHTML = '';

  // Question number badge
  const badge = document.createElement('div');
  badge.className = 'q-num-badge';
  badge.textContent = index + 1;
  card.appendChild(badge);

  // Passage
  if (q.passage_id && q._passages && q._passages[q.passage_id]) {
    const passageBox = document.createElement('div');
    passageBox.className = 'passage-box';
    passageBox.innerHTML = `
      <button class="passage-toggle">📄 Read Passage <span>▼</span></button>
      <div class="passage-content">${q._passages[q.passage_id]}</div>
    `;
    const toggle = passageBox.querySelector('.passage-toggle');
    const content = passageBox.querySelector('.passage-content');
    toggle.addEventListener('click', () => {
      content.classList.toggle('open');
      toggle.querySelector('span').textContent = content.classList.contains('open') ? '▲' : '▼';
    });
    card.appendChild(passageBox);
  }

  // Question text
  const qText = document.createElement('div');
  qText.className = 'question-text';
  qText.innerHTML = q.question;
  card.appendChild(qText);

  // Image
  if (q.photo) {
    const img = document.createElement('img');
    img.className = 'question-image';
    img.src = `exam_image/question/${q.photo}`;
    img.alt = 'Question image';
    img.onerror = () => img.style.display = 'none';
    card.appendChild(img);
  }

  // Options
  const opts = document.createElement('div');
  opts.className = 'options-list';

  ['a', 'b', 'c', 'd', 'e'].forEach(letter => {
    const optText = q[`option_${letter}`];
    if (optText === null || optText === undefined) return;

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
}

function selectAnswer(index, letter) {
  examState.answers[index] = letter;
  renderQuestion(index); // re-render to show selection
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
  // Close palette if open
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
    btn.className = 'palette-num';
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
    else if (examState.answers[i]) btn.classList.add('answered');
  });
}

function updatePaletteHighlight() {
  updatePaletteGrid();
}

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

  if (examState.timeRemaining < 300) {
    timerEl.className = 'timer danger';
  } else if (examState.timeRemaining < 900) {
    timerEl.className = 'timer warning';
  } else {
    timerEl.className = 'timer';
  }
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
  renderResultsScreen();
  showScreen('results');
}

/* ═══════════════════════════════════════════════════════
   SCORE CALCULATION
   ═══════════════════════════════════════════════════════ */
function calculateResults() {
  const results = {};
  const subjectCount = examState.selectedSubjects.length;

  for (const catId of examState.selectedSubjects) {
    const subQuestions = examState.questions.filter(q => q._cat_id === catId);
    let correct = 0, wrong = 0, skipped = 0;

    subQuestions.forEach((q, localIdx) => {
      const globalIdx = examState.questions.indexOf(q);
      const ans = examState.answers[globalIdx];
      if (!ans) {
        skipped++;
      } else if (ans === q.correct_answer) {
        correct++;
      } else {
        wrong++;
      }
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

  // Animate score counter
  const scoreEl = document.getElementById('score-display');
  animateCounter(scoreEl, 0, totalScore, 1500);

  // Subject result cards
  const grid = document.getElementById('results-grid');
  grid.innerHTML = '';

  Object.values(bySubject).forEach(r => {
    const pct = r.total > 0 ? Math.round((r.correct / r.total) * 100) : 0;
    const card = document.createElement('div');
    card.className = 'result-card';
    card.innerHTML = `
      <span class="result-icon">${r.icon}</span>
      <div class="result-info">
        <div class="result-title">${r.title}</div>
        <div class="result-bar-wrap">
          <div class="result-bar" style="width:0%" data-pct="${pct}"></div>
        </div>
        <div class="result-stats">${r.correct} correct · ${r.wrong} wrong · ${r.skipped} skipped</div>
      </div>
      <div class="result-score">${r.scaledScore}<small>pts</small></div>
    `;
    grid.appendChild(card);

    // Animate bar
    setTimeout(() => {
      card.querySelector('.result-bar').style.width = `${pct}%`;
    }, 100);
  });
}

function animateCounter(el, from, to, duration) {
  const start = performance.now();
  function step(now) {
    const elapsed = now - start;
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
    timerInterval: null, submitted: false, subjectData: examState.subjectData, // cache
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
    let statusClass, statusLabel, statusIcon;

    if (!ans) {
      statusClass = 'status-skipped'; statusLabel = 'Skipped'; statusIcon = '⬜';
    } else if (ans === q.correct_answer) {
      statusClass = 'status-correct'; statusLabel = 'Correct'; statusIcon = '✅';
    } else {
      statusClass = 'status-wrong'; statusLabel = 'Wrong'; statusIcon = '❌';
    }

    const item = document.createElement('div');
    item.className = 'review-item';

    // Has AI explanation?
    const hasExplain = [q.core_concepts, q.step_by_step, q.common_pitfalls, q.applications].some(f => f && f.trim() !== '');

    // Options HTML
    let optsHTML = '';
    ['a','b','c','d','e'].forEach(letter => {
      const optText = q[`option_${letter}`];
      if (optText === null || optText === undefined) return;
      const isCorrect = letter === q.correct_answer;
      const isUserWrong = ans && ans === letter && letter !== q.correct_answer;
      let cls = 'review-option';
      if (isCorrect)   cls += ' correct-opt';
      if (isUserWrong) cls += ' wrong-opt';
      optsHTML += `
        <div class="${cls}">
          <span class="review-opt-letter">${letter.toUpperCase()}</span>
          <span>${optText}</span>
        </div>
      `;
    });

    // Passage
    let passageHTML = '';
    if (q.passage_id && q._passages && q._passages[q.passage_id]) {
      passageHTML = `
        <div class="passage-box" style="margin-bottom:10px;">
          <button class="passage-toggle">📄 Passage <span>▼</span></button>
          <div class="passage-content">${q._passages[q.passage_id]}</div>
        </div>
      `;
    }

    // Image
    let imgHTML = '';
    if (q.photo) {
      imgHTML = `<img class="question-image" src="exam_image/question/${q.photo}" alt="" onerror="this.style.display='none'" />`;
    }

    // AI Explanation
    let explainHTML = '';
    if (hasExplain) {
      const tabs = [
        { key: 'core',  label: 'Core Concept', val: q.core_concepts },
        { key: 'step',  label: 'Step by Step',  val: q.step_by_step },
        { key: 'pitfall',label:'Common Pitfalls',val: q.common_pitfalls },
        { key: 'app',   label: 'Applications',  val: q.applications },
      ].filter(t => t.val && t.val.trim() !== '');

      const tabBtns = tabs.map((t, ti) => `<button class="explain-tab${ti===0?' active':''}" data-key="${t.key}">${t.label}</button>`).join('');
      const firstContent = tabs[0]?.val || '';
      explainHTML = `
        <button class="explain-toggle">💡 Explain This <span>▼</span></button>
        <div class="explain-panel">
          <div class="explain-tabs">${tabBtns}</div>
          <div class="explain-content" id="explain-content-${i}">${firstContent}</div>
        </div>
      `;
    }

    item.innerHTML = `
      <div class="review-item-header">
        <span class="review-badge">${statusIcon}</span>
        <span class="review-q-num">Question ${i + 1} · ${q._subTitle}</span>
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

    // Passage toggles
    item.querySelectorAll('.passage-toggle').forEach(toggle => {
      toggle.addEventListener('click', () => {
        const content = toggle.nextElementSibling;
        content.classList.toggle('open');
        toggle.querySelector('span').textContent = content.classList.contains('open') ? '▲' : '▼';
      });
    });

    // Explain toggle
    if (hasExplain) {
      const explainToggle = item.querySelector('.explain-toggle');
      const explainPanel  = item.querySelector('.explain-panel');
      explainToggle.addEventListener('click', () => {
        explainPanel.classList.toggle('open');
        explainToggle.querySelector('span').textContent = explainPanel.classList.contains('open') ? '▲' : '▼';
      });

      // Explain tabs
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
