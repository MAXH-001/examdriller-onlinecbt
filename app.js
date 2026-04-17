/* =====================================================
   ExamDriller Online — app.js
   Maxh Technologies © 2026
   ===================================================== */

'use strict';

/* ── DEVICE ID (injected by Android via JavascriptInterface) ────── */
function getDeviceId() {
  try {
    if (window.Android && typeof window.Android.getDeviceId === 'function') {
      return window.Android.getDeviceId();
    }
  } catch (_) {}
  return 'web';
}

/* ── ACTIVATION STATE ────────────────────────────────────────────── */
var _isActivated = false; // set true after login confirms activation

function isActivated() { return _isActivated; }

function hasUsedFreeTrial() {
  try { return localStorage.getItem('ed_lite_free_used') === '1'; } catch (_) { return false; }
}
function markFreeTrialUsed() {
  try { localStorage.setItem('ed_lite_free_used', '1'); } catch (_) {}
}
function markActivated() {
  _isActivated = true;
  try { localStorage.setItem('ed_lite_activated', '1'); } catch (_) {}
}
function restoreActivationState() {
  try { return localStorage.getItem('ed_lite_activated') === '1'; } catch (_) { return false; }
}

function showActivationWall() {
  var email = currentUser ? currentUser.email : '';
  var waMsg = encodeURIComponent('Hello, I want to activate ExamDriller Lite. My email: ' + email);
  var waUrl = 'https://wa.me/2349116959509?text=' + waMsg;

  var overlay = document.createElement('div');
  overlay.id = 'activation-wall';
  overlay.style.cssText = [
    'position:fixed;inset:0;z-index:9999;',
    'background:rgba(13,31,60,0.97);',
    'display:flex;flex-direction:column;align-items:center;justify-content:center;',
    'padding:32px 24px;text-align:center;overflow-y:auto;'
  ].join('');

  overlay.innerHTML =
    '<div style="font-size:3rem;margin-bottom:16px;">🔒</div>' +
    '<h2 style="font-family:Outfit,sans-serif;font-size:1.5rem;font-weight:900;color:#fff;margin-bottom:8px;">Activate to Continue</h2>' +
    '<p style="color:rgba(255,255,255,0.6);font-size:0.9rem;line-height:1.5;max-width:300px;margin-bottom:4px;">' +
      'You have used your free trial.' +
    '</p>' +
    '<p style="color:rgba(255,255,255,0.6);font-size:0.9rem;line-height:1.5;max-width:300px;margin-bottom:20px;">' +
      'Pay <strong style="color:#f5b400;">₦900</strong> once to unlock ExamDriller Lite forever on this device.' +
    '</p>' +
    '<button onclick="if(window.Android&&window.Android.openUrl){window.Android.openUrl(\'' + waUrl + '\')}else{window.open(\'' + waUrl + '\',\'_blank\')}" ' +
      'style="display:flex;align-items:center;gap:10px;background:#25D366;color:#fff;' +
             'font-family:Outfit,sans-serif;font-weight:800;font-size:1rem;' +
             'padding:15px 28px;border-radius:12px;border:none;cursor:pointer;' +
             'box-shadow:0 4px 20px rgba(37,211,102,0.4);margin-bottom:28px;">' +
      '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z\"/><path d=\"M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.532 5.864L.057 23.882l6.196-1.448A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.371l-.358-.213-3.722.87.936-3.62-.234-.373A9.818 9.818 0 1112 21.818z\"/></svg>' +
      'Pay ₦900 via WhatsApp' +
    '</button>' +

    '<div style="width:100%;max-width:320px;margin-bottom:8px;">' +
      '<p style="color:rgba(255,255,255,0.75);font-size:0.85rem;margin-bottom:10px;font-weight:600;">Already paid? Enter your activation key:</p>' +
      '<input id="activation-key-input" type="text" ' +
        'placeholder="e.g. ED-XXXX-XXXX-XXXX" ' +
        'style="width:100%;box-sizing:border-box;padding:13px 16px;border-radius:10px;border:2px solid rgba(255,255,255,0.15);' +
               'background:rgba(255,255,255,0.08);color:#fff;font-family:Outfit,monospace;font-size:1rem;' +
               'text-align:center;letter-spacing:2px;outline:none;margin-bottom:10px;" />' +
      '<button id="btn-activate-key" ' +
        'style="width:100%;padding:14px;border-radius:10px;border:none;cursor:pointer;' +
               'background:linear-gradient(135deg,#f5b400,#e09000);color:#0a0e1a;' +
               'font-family:Outfit,sans-serif;font-weight:800;font-size:1rem;">' +
        'Activate Now' +
      '</button>' +
      '<p id="activation-key-msg" style="color:#f87171;font-size:0.8rem;margin-top:8px;min-height:18px;"></p>' +
    '</div>' +

    '<p style="color:rgba(255,255,255,0.35);font-size:0.75rem;max-width:300px;">' +
      'After payment, message us on WhatsApp and we\'ll send your activation key within minutes.' +
    '</p>';

  document.body.appendChild(overlay);

  // Auto-format key input as user types (insert dashes)
  var keyInput = document.getElementById('activation-key-input');
  keyInput.addEventListener('input', function() {
    var raw = keyInput.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    var parts = [];
    if (raw.length > 0) parts.push(raw.slice(0, 2));   // ED
    if (raw.length > 2) parts.push(raw.slice(2, 6));   // XXXX
    if (raw.length > 6) parts.push(raw.slice(6, 10));  // XXXX
    if (raw.length > 10) parts.push(raw.slice(10, 14)); // XXXX
    keyInput.value = parts.join('-');
  });

  keyInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') document.getElementById('btn-activate-key').click();
  });

  document.getElementById('btn-activate-key').addEventListener('click', async function() {
    var key = keyInput.value.trim();
    var msgEl = document.getElementById('activation-key-msg');
    if (!key || key.length < 14) {
      msgEl.textContent = 'Please enter a valid activation key.';
      msgEl.style.color = '#f87171';
      return;
    }
    var btn = document.getElementById('btn-activate-key');
    btn.textContent = 'Activating…';
    btn.disabled = true;
    msgEl.textContent = '';
    try {
      var deviceId = getDeviceId();
      var result = await apiCall({ action: 'activateWithKey', email: currentUser.email, key: key, deviceId: deviceId });
      if (result.success && result.activated) {
        markActivated();
        if (result.user) saveSession(result.user);
        msgEl.style.color = '#4ade80';
        msgEl.textContent = '✅ Activated! Enjoy ExamDriller Lite.';
        setTimeout(function() {
          var wall = document.getElementById('activation-wall');
          if (wall) wall.remove();
        }, 1500);
      } else {
        msgEl.style.color = '#f87171';
        msgEl.textContent = result.error || 'Invalid key. Check and try again.';
        btn.textContent = 'Activate Now';
        btn.disabled = false;
      }
    } catch (e) {
      msgEl.style.color = '#f87171';
      msgEl.textContent = 'Connection error. Check your internet.';
      btn.textContent = 'Activate Now';
      btn.disabled = false;
    }
  });
}

/* ── GOOGLE APPS SCRIPT URL ──────────────────────────
   After deploying your Code.gs as a Web App, paste
   the URL here (between the quotes).
   ──────────────────────────────────────────────────── */
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwkyhhnsFGLtieMWWiVaxiqhluewh3jrMr41mTSAKHSZkAGzj9qDZyU2Glf9MMfygBN/exec';

/* ── WEB BASE URL ────────────────────────────────────
   The public URL where your web version of the app is
   hosted (e.g. GitHub Pages, Netlify, your own domain).
   Quiz links and result links shared via the app will
   use this URL so they open correctly in a browser.
   Change this to your actual domain when you host it.
   ──────────────────────────────────────────────────── */
const WEB_BASE_URL = 'https://examdriller-onlinecbt.vercel.app';

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
  _quizMode:        false,
  _quizId:          null,
  _quizName:        null,
  _takerName:       null,  // name for quiz takers who aren't logged in
};

/* ── SCREEN MANAGEMENT ─────────────────────────────── */
const screens = {
  login:       document.getElementById('screen-login'),
  register:    document.getElementById('screen-register'),
  home:        document.getElementById('screen-home'),
  subjects:    document.getElementById('screen-subjects'),
  config:      document.getElementById('screen-config'),
  exam:        document.getElementById('screen-exam'),
  results:     document.getElementById('screen-results'),
  review:      document.getElementById('screen-review'),
  history:     document.getElementById('screen-history'),
  resultView:  document.getElementById('screen-result-view'),
  admin:       document.getElementById('screen-admin'),
  quizTaker:   document.getElementById('screen-quiz-taker'),
  quizResults: document.getElementById('screen-quiz-results'),
};

// Track navigation so back button works correctly
var screenHistory = [];

function showScreen(name) {
  Object.values(screens).forEach(s => { if (s) s.classList.remove('active'); });
  if (screens[name]) screens[name].classList.add('active');
  window.scrollTo(0, 0);
  // Don't stack duplicates; always keep 'home' as the base
  if (screenHistory[screenHistory.length - 1] !== name) {
    screenHistory.push(name);
  }
}

// Called by Android onBackPressed via evaluateJavascript
window.handleBackButton = function() {
  // Remove current screen from history
  if (screenHistory.length > 1) {
    screenHistory.pop();
    var prev = screenHistory[screenHistory.length - 1];
    Object.values(screens).forEach(s => { if (s) s.classList.remove('active'); });
    if (screens[prev]) screens[prev].classList.add('active');
    window.scrollTo(0, 0);
  } else {
    // Already at root (home/login) — let Android exit the app
    if (window.Android && typeof window.Android.exitApp === 'function') {
      window.Android.exitApp();
    }
  }
};

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
function showLoading(msg) {
  msg = msg || 'Loading…';
  if (!loadingOverlay) {
    loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = '<div class="spinner"></div><p>' + msg + '</p>';
    document.body.appendChild(loadingOverlay);
  } else {
    loadingOverlay.querySelector('p').textContent = msg;
    loadingOverlay.classList.remove('hidden');
  }
}
function hideLoading() {
  if (loadingOverlay) loadingOverlay.classList.add('hidden');
}

/* ── FISHER-YATES SHUFFLE (random) ────────────────── */
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
  }
  return arr;
}

/* ── SEEDED DETERMINISTIC SHUFFLE ──────────────────
   Uses mulberry32 PRNG. Same seed = same order every time.
   This ensures every student who uses the same quiz link
   gets the exact same questions.
   ──────────────────────────────────────────────────── */
function mulberry32(seed) {
  return function() {
    seed = seed + 0x6D2B79F5 | 0;
    var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function hashStr(str) {
  var h = 5381;
  for (var i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function seededShuffle(array, seed) {
  var rand = mulberry32(seed);
  var arr = [...array];
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(rand() * (i + 1));
    var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
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
  document.dispatchEvent(new Event('userSessionSaved'));
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
    el.textContent = 'Hello, ' + currentUser.name;
  }
}

/** On load — restore saved session or show login */
function initAuth() {
  if (restoreActivationState()) _isActivated = true;
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
document.getElementById('btn-login').addEventListener('click', async function() {
  const email = document.getElementById('login-email').value.trim();
  if (!email) { showToast('Please enter your email address'); return; }

  if (APPS_SCRIPT_URL === 'YOUR_APPS_SCRIPT_URL') {
    _isActivated = true;
    saveSession({ name: email.split('@')[0], email: email });
    showScreen('home');
    return;
  }

  showLoading('Signing in…');
  try {
    const deviceId = getDeviceId();
    const result = await apiCall({ action: 'login', email: email, deviceId: deviceId });
    hideLoading();

    if (result.success) {
      if (result.activated === true) markActivated();
      saveSession(result.user);
      showScreen('home');
      if (_isActivated) {
        showToast('Welcome back, ' + result.user.name + '!');
      } else {
        showToast('Free trial active. 1 quiz allowed.');
      }
    } else if (result.error === 'wrong_device') {
      const waMsg = encodeURIComponent('Hello, I need help with my ExamDriller Lite account: ' + email);
      showToast('This app is activated on another device. Contact support.');
      setTimeout(function() {
        if (window.Android && window.Android.openUrl) {
          window.Android.openUrl('https://wa.me/2349116959509?text=' + waMsg);
        } else {
          window.open('https://wa.me/2349116959509?text=' + waMsg, '_blank');
        }
      }, 2000);
    } else if (result.error === 'invalid_email') {
      showToast('Please enter a valid Gmail address.');
    } else {
      showToast('Sign in failed. Check your internet and try again.');
    }
  } catch (e) {
    hideLoading();
    showToast('Connection error. Check your internet and try again.');
    console.error(e);
  }
});

document.getElementById('login-email').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') document.getElementById('btn-login').click();
});

/* ── Register form ──────────────────────────────────── */
document.getElementById('btn-register').addEventListener('click', async function() {
  const name  = document.getElementById('reg-name').value.trim();
  const phone = document.getElementById('reg-phone').value.trim();
  const email = document.getElementById('reg-email').value.trim();

  if (!name)  { showToast('Please enter your full name'); return; }
  if (!phone) { showToast('Please enter your phone number'); return; }
  if (!email) { showToast('Please enter your email address'); return; }

  showLoading('Creating account…');
  try {
    const deviceId = getDeviceId();
    const result = await apiCall({ action: 'register', name: name, phone: phone, email: email, deviceId: deviceId });
    hideLoading();

    if (result.success) {
      if (result.activated === true) markActivated();
      saveSession(result.user);
      showScreen('home');
      showToast('Welcome, ' + result.user.name + '! 🎉');
    } else {
      showToast(result.error || 'Registration failed. Try again.');
    }
  } catch (e) {
    hideLoading();
    showToast('Connection error. Check your internet and try again.');
    console.error(e);
  }
});

document.getElementById('btn-go-register').addEventListener('click', function() { showScreen('register'); });
document.getElementById('btn-go-login').addEventListener('click', function() { showScreen('login'); });

/* ── Logout ────────────────────────────────────────── */
document.getElementById('btn-logout').addEventListener('click', function() {
  clearSession();
  document.getElementById('login-email').value = '';
  showScreen('login');
});

/* ── Score submission to Google Sheets ─────────────── */
async function submitScoreToSheets(score, outOf, subjectTitles) {
  if (APPS_SCRIPT_URL === 'YOUR_APPS_SCRIPT_URL') return;
  const name  = currentUser ? currentUser.name  : (examState._takerName || 'Guest');
  const email = currentUser ? currentUser.email : '';
  try {
    await apiCall({
      action:   'saveScore',
      name:     name,
      email:    email,
      score:    score,
      outOf:    outOf,
      subjects: subjectTitles.join(', '),
    });
  } catch (e) {
    console.warn('Score save failed (non-critical):', e);
  }
  document.dispatchEvent(new CustomEvent('quizScoreSave', { detail: { score: score, outOf: outOf } }));
}

/* ── Score history (localStorage) ──────────────────── */
function saveToHistory(entry) {
  try {
    const history = JSON.parse(localStorage.getItem('examdriller_history') || '[]');
    history.unshift(entry);
    if (history.length > 100) history.splice(100);
    localStorage.setItem('examdriller_history', JSON.stringify(history));
  } catch (e) { console.warn('History save failed:', e); }
}

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem('examdriller_history') || '[]');
  } catch (e) { return []; }
}

/* ═══════════════════════════════════════════════════════
   SCREEN 1 — HOME
   ═══════════════════════════════════════════════════════ */
function initParticles() {
  ['particles', 'particles-login', 'particles-register'].forEach(function(id) {
    const container = document.getElementById(id);
    if (!container) return;
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 8 + 3;
      p.style.cssText = 'width:' + size + 'px; height:' + size + 'px; left:' + (Math.random() * 100) + '%; animation-duration:' + (Math.random() * 15 + 10) + 's; animation-delay:' + (Math.random() * 15) + 's;';
      container.appendChild(p);
    }
  });
}

document.getElementById('btn-start').addEventListener('click', function() {
  if (!isActivated() && hasUsedFreeTrial()) {
    showActivationWall();
    return;
  }
  renderSubjectGrid();
  showScreen('subjects');
});

/* ── Join Quiz button — handles codes AND pasted URLs ─────────────── */
document.getElementById('btn-join-quiz').addEventListener('click', function() {
  var input = document.getElementById('quiz-code-input').value.trim();
  if (!input) { showToast('Enter a quiz code, result code, or paste a URL'); return; }

  // ① Result URL pasted — e.g. https://.../#result=eyJ...
  var resultMatch = input.match(/#result=([A-Za-z0-9+/=]+)/);
  if (resultMatch) {
    try {
      var data = JSON.parse(atob(resultMatch[1]));
      showResultFromLink(data);
      document.getElementById('quiz-code-input').value = '';
    } catch (e) { showToast('Invalid result link. Please check and try again.'); }
    return;
  }

  // ② Result code — RS + 8 digits
  if (/^RS\d{8}$/i.test(input)) {
    loadResultByCode(input.toUpperCase());
    document.getElementById('quiz-code-input').value = '';
    return;
  }

  // ③ Quiz URL pasted — e.g. https://.../#quiz=q_123...
  var quizMatch = input.match(/#quiz=([^&\s]+)/);
  if (quizMatch) {
    launchQuizFromLink(quizMatch[1]);
    document.getElementById('quiz-code-input').value = '';
    return;
  }

  // ④ Quiz code — ED + 8 digits (default)
  launchQuizFromCode(input);
});
document.getElementById('quiz-code-input').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') document.getElementById('btn-join-quiz').click();
});

/* ── Load result by RS code ───────────────────────────────────────── */
async function loadResultByCode(code) {
  showLoading('Looking up result…');
  try {
    const result = await apiCall({ action: 'getResult', resultCode: code });
    hideLoading();
    if (result.success) {
      showResultFromLink(result.result);
    } else {
      showToast(result.error || 'Result not found. Check the code and try again.');
    }
  } catch (e) {
    hideLoading();
    showToast('Connection error. Check your internet.');
  }
}

/* ── History button on home ─────────────────────────── */
document.getElementById('btn-history-home').addEventListener('click', function() {
  renderHistoryScreen();
  showScreen('history');
});

/* ═══════════════════════════════════════════════════════
   SCREEN: SCORE HISTORY
   ═══════════════════════════════════════════════════════ */
document.getElementById('back-history-to-home').addEventListener('click', function() { showScreen('home'); });

document.getElementById('btn-clear-history').addEventListener('click', function() {
  if (!confirm('Clear all score history? This cannot be undone.')) return;
  try { localStorage.removeItem('examdriller_history'); } catch (e) {}
  renderHistoryScreen();
  showToast('History cleared');
});

function renderHistoryScreen() {
  const body = document.getElementById('history-body');
  const history = getHistory();

  if (!history.length) {
    body.innerHTML = '<div class="history-empty"><span style="font-size:2.5rem">📋</span><p>No exam history yet.</p><p style="font-size:0.82rem;color:var(--text-muted);margin-top:4px;">Complete a practice exam or quiz to see your results here.</p></div>';
    return;
  }

  body.innerHTML = '';
  history.forEach(function(entry, idx) {
    const pct = entry.outOf > 0 ? Math.round((entry.score / entry.outOf) * 100) : 0;
    const grade = pct >= 70 ? 'grade-good' : pct >= 50 ? 'grade-ok' : 'grade-poor';
    const gradeLabel = pct >= 70 ? '✅ Good' : pct >= 50 ? '⚠️ Average' : '❌ Needs work';
    const typeLabel = entry.type === 'quiz' ? ('📝 ' + (entry.quizName || 'Quiz')) : '🎯 Practice';
    const item = document.createElement('div');
    item.className = 'history-item';
    item.innerHTML = '<div class="history-item-top">' +
        '<div class="history-item-info">' +
          '<div class="history-type-label">' + typeLabel + '</div>' +
          '<div class="history-subjects">' + (entry.subjects || '—') + '</div>' +
          '<div class="history-date">' + (entry.date || '') + '</div>' +
        '</div>' +
        '<div class="history-score-block">' +
          '<div class="history-score-num ' + grade + '">' + entry.score + '<small>/' + entry.outOf + '</small></div>' +
          '<div class="history-pct">' + pct + '%</div>' +
          '<div class="history-grade-label">' + gradeLabel + '</div>' +
        '</div>' +
      '</div>';
    body.appendChild(item);
  });
}

/* ═══════════════════════════════════════════════════════
   SCREEN 2 — SUBJECT SELECTION
   ═══════════════════════════════════════════════════════ */
document.getElementById('back-to-home').addEventListener('click', function() { showScreen('home'); });

function renderSubjectGrid() {
  examState.selectedSubjects = [2];
  const grid = document.getElementById('subject-grid');
  grid.innerHTML = '';

  SUBJECTS_META.forEach(function(sub) {
    const card = document.createElement('div');
    card.className = 'subject-card' + (sub.compulsory ? ' compulsory selected' : '');
    card.dataset.catId = sub.cat_id;
    card.innerHTML =
      '<span class="card-icon">' + sub.icon + '</span>' +
      '<span class="card-name">' + sub.title + '</span>' +
      '<span class="card-count">' + getQuestionCount(sub) + ' Qs</span>' +
      (sub.compulsory ? '<span class="card-badge">Compulsory</span>' : '');
    if (!sub.compulsory) {
      card.addEventListener('click', function() { toggleSubject(sub.cat_id, card); });
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
    const extraCount = examState.selectedSubjects.filter(function(id) { return id !== 2; }).length;
    if (extraCount >= 3) { showToast('Maximum 4 subjects allowed'); return; }
    examState.selectedSubjects.push(catId);
    card.classList.add('selected');
  }
  updateSubjectCounter();
  updateContinueBtn();
}

function updateSubjectCounter() {
  const extra = examState.selectedSubjects.filter(function(id) { return id !== 2; }).length;
  document.getElementById('subject-counter').textContent = extra + '/3 selected';
}

function updateContinueBtn() {
  const extra = examState.selectedSubjects.filter(function(id) { return id !== 2; }).length;
  document.getElementById('btn-continue-subjects').disabled = extra < 1;
}

document.getElementById('btn-continue-subjects').addEventListener('click', function() {
  renderConfigScreen();
  showScreen('config');
});

/* ═══════════════════════════════════════════════════════
   SCREEN 3 — EXAM CONFIGURATION
   ═══════════════════════════════════════════════════════ */
document.getElementById('back-to-subjects').addEventListener('click', function() { showScreen('subjects'); });

let selectedTimerSeconds = 7200;

function renderConfigScreen() {
  examState.subjectConfigs = {};
  examState.selectedSubjects.forEach(function(catId) {
    examState.subjectConfigs[catId] = { filterType: 'random', filterValue: null, qCount: catId === 2 ? 60 : 40 };
  });

  const body = document.getElementById('config-body');
  body.innerHTML = '';

  examState.selectedSubjects.forEach(function(catId) {
    const sub = SUBJECTS_META.find(function(s) { return s.cat_id === catId; });
    const section = document.createElement('div');
    section.className = 'config-section';
    section.innerHTML =
      '<div class="config-section-header">' +
        '<span class="card-icon">' + sub.icon + '</span>' +
        '<h3>' + sub.title + '</h3>' +
      '</div>' +
      '<div class="config-section-body" id="config-body-' + catId + '">' +
        renderFilterBlock(sub) +
        renderQCountBlock(sub) +
      '</div>';
    body.appendChild(section);
  });

  const timerSection = document.createElement('div');
  timerSection.className = 'config-section';
  timerSection.innerHTML =
    '<div class="config-section-header">' +
      '<span class="card-icon">⏱</span>' +
      '<h3>Timer</h3>' +
    '</div>' +
    '<div class="config-section-body">' +
      '<label class="config-label">Exam Duration</label>' +
      '<div class="timer-group" id="timer-group">' +
        TIMER_OPTIONS.map(function(opt) {
          return '<button class="timer-opt-btn' + (opt.value === 7200 ? ' active' : '') + '" data-val="' + opt.value + '">' + opt.label + '</button>';
        }).join('') +
      '</div>' +
    '</div>';
  body.appendChild(timerSection);

  document.querySelectorAll('.timer-opt-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.timer-opt-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      selectedTimerSeconds = parseInt(btn.dataset.val);
      updateConfigSummary();
    });
  });

  examState.selectedSubjects.forEach(function(catId) {
    setupFilterListeners(catId);
    setupQCountListeners(catId);
  });

  updateConfigSummary();
}

function renderFilterBlock(sub) {
  if (sub.compulsory) {
    return '<div><label class="config-label">Filter Type</label><div class="toggle-group"><button class="toggle-btn active" disabled>Random</button></div></div>';
  }
  return '<div>' +
    '<label class="config-label">Filter Type</label>' +
    '<div class="toggle-group" id="filter-toggle-' + sub.cat_id + '">' +
      '<button class="toggle-btn active" data-type="random">Random</button>' +
      '<button class="toggle-btn" data-type="year">By Year</button>' +
      '<button class="toggle-btn" data-type="topic">By Topic</button>' +
    '</div>' +
    '<div id="filter-select-' + sub.cat_id + '" style="margin-top:10px;display:none;">' +
      '<select class="config-select" id="filter-value-' + sub.cat_id + '"><option value="">Loading…</option></select>' +
    '</div>' +
  '</div>';
}

function renderQCountBlock(sub) {
  if (sub.compulsory) {
    return '<div><label class="config-label">Questions</label><div class="q-count-group"><button class="q-count-btn" disabled>60 (Fixed)</button></div></div>';
  }
  return '<div>' +
    '<label class="config-label">Number of Questions</label>' +
    '<div class="q-count-group" id="qcount-group-' + sub.cat_id + '">' +
      QUESTION_COUNTS.map(function(n) {
        return '<button class="q-count-btn' + (n === 40 ? ' active' : '') + '" data-count="' + n + '">' + n + '</button>';
      }).join('') +
    '</div>' +
  '</div>';
}

function setupFilterListeners(catId) {
  const sub = SUBJECTS_META.find(function(s) { return s.cat_id === catId; });
  if (sub.compulsory) return;

  const toggles    = document.querySelectorAll('#filter-toggle-' + catId + ' .toggle-btn');
  const selectWrap = document.getElementById('filter-select-' + catId);

  toggles.forEach(function(btn) {
    btn.addEventListener('click', function() {
      toggles.forEach(function(b) { b.classList.remove('active'); });
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
  const sub = SUBJECTS_META.find(function(s) { return s.cat_id === catId; });
  if (sub.compulsory) return;

  const btns = document.querySelectorAll('#qcount-group-' + catId + ' .q-count-btn');
  btns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      btns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      examState.subjectConfigs[catId].qCount = parseInt(btn.dataset.count);
      updateConfigSummary();
    });
  });
}

async function populateFilterSelect(catId, type) {
  const selectEl = document.getElementById('filter-value-' + catId);
  selectEl.innerHTML = '<option value="">Loading…</option>';

  try {
    const data = await loadSubjectData(catId);
    selectEl.innerHTML = '';

    if (type === 'year') {
      const years = [];
      data.questions.forEach(function(q) { if (q.exam_year && years.indexOf(q.exam_year) === -1) years.push(q.exam_year); });
      years.sort();
      years.forEach(function(y) {
        const opt = document.createElement('option');
        opt.value = y; opt.textContent = y;
        selectEl.appendChild(opt);
      });
    } else if (type === 'topic') {
      (data.topics || []).forEach(function(t) {
        const opt = document.createElement('option');
        opt.value = t.id; opt.textContent = t.topic;
        selectEl.appendChild(opt);
      });
    }

    if (selectEl.options.length) {
      examState.subjectConfigs[catId].filterValue = selectEl.options[0].value;
    }
    selectEl.addEventListener('change', function() {
      examState.subjectConfigs[catId].filterValue = selectEl.value;
    });
  } catch (e) {
    selectEl.innerHTML = '<option value="">Could not load options</option>';
  }
}

function updateConfigSummary() {
  let total = 0;
  examState.selectedSubjects.forEach(function(catId) {
    total += examState.subjectConfigs[catId] ? examState.subjectConfigs[catId].qCount : (catId === 2 ? 60 : 40);
  });
  const summaryEl = document.getElementById('config-summary');
  summaryEl.innerHTML = '<span>Total: <strong>' + total + ' Qs</strong></span><span>Score: <strong>out of 400</strong></span>';
}

document.getElementById('btn-start-exam').addEventListener('click', function() {
  if (!isActivated() && hasUsedFreeTrial()) {
    showActivationWall();
    return;
  }
  startExam();
});

/* ═══════════════════════════════════════════════════════
   DATA LOADING
   ═══════════════════════════════════════════════════════ */
async function loadSubjectData(catId) {
  if (examState.subjectData[catId]) return examState.subjectData[catId];
  const sub = SUBJECTS_META.find(function(s) { return s.cat_id === catId; });
  const data = await new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'data/' + sub.file, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      if (xhr.status === 200 || xhr.status === 0) {
        resolve(xhr.response);
      } else {
        reject(new Error('Failed to load ' + sub.file));
      }
    };
    xhr.onerror = function() { reject(new Error('Failed to load ' + sub.file)); };
    xhr.send();
  });
  examState.subjectData[catId] = data;
  return data;
}

async function startExam() {
  showLoading('Loading questions…');
  try {
    const allQuestions = [];

    // Determine the correct timer to use
    // In quiz mode, the quiz's timer is already set in examState.timerSeconds
    // In practice mode, use the user-selected timer
    const timerToUse = examState._quizMode ? examState.timerSeconds : selectedTimerSeconds;

    for (var ci = 0; ci < examState.selectedSubjects.length; ci++) {
      const catId  = examState.selectedSubjects[ci];
      const data   = await loadSubjectData(catId);
      const config = examState.subjectConfigs[catId];
      const sub    = SUBJECTS_META.find(function(s) { return s.cat_id === catId; });

      let pool = [...data.questions];

      // Apply year filter from quiz config
      if (examState._quizMode && examState._quizYearFilter) {
        pool = pool.filter(function(q) { return String(q.exam_year) === String(examState._quizYearFilter); });
        if (pool.length === 0) {
          // Fallback: no questions for that year, use all
          pool = [...data.questions];
          showToast('No ' + examState._quizYearFilter + ' questions found for ' + sub.title + ' — using all years');
        }
      } else if (config.filterType === 'year' && config.filterValue) {
        pool = pool.filter(function(q) { return q.exam_year === config.filterValue; });
      } else if (config.filterType === 'topic' && config.filterValue) {
        pool = pool.filter(function(q) { return String(q.topic_id) === String(config.filterValue); });
      }

      // Use seeded shuffle in quiz mode (same questions every time for same quiz)
      // Use random shuffle in practice mode
      if (examState._quizMode && examState._quizId) {
        pool = seededShuffle(pool, hashStr(examState._quizId + String(catId)));
      } else {
        pool = shuffle(pool);
      }

      const needed   = config.qCount;
      const selected = pool.slice(0, Math.min(needed, pool.length));

      if (pool.length < needed) {
        showToast('Only ' + pool.length + ' questions available for ' + sub.title + ' with this filter.');
      }

      selected.forEach(function(q) {
        q._cat_id   = catId;
        q._subTitle = sub.title;
        q._subIcon  = sub.icon;
        q._passages = data.passages || {};
      });

      allQuestions.push.apply(allQuestions, selected);
    }

    examState.questions    = allQuestions;
    examState.answers      = {};
    examState.currentIndex = 0;
    examState.submitted    = false;
    examState.timerSeconds = timerToUse;
    examState.results      = null;

    hideLoading();
    renderExamScreen();
    showScreen('exam');
    startTimer(timerToUse);
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
  examState.questions.forEach(function(q) {
    if (seen.indexOf(q._cat_id) === -1) seen.push(q._cat_id);
  });

  seen.forEach(function(catId) {
    const sub = SUBJECTS_META.find(function(s) { return s.cat_id === catId; });
    const btn = document.createElement('button');
    btn.className = 'tab-btn';
    btn.textContent = sub.title.split(' ')[0];
    btn.dataset.catId = catId;
    btn.addEventListener('click', function() { jumpToSubject(catId); });
    tabsEl.appendChild(btn);
  });

  updateActiveTab();
}

function updateActiveTab() {
  const current = examState.questions[examState.currentIndex];
  document.querySelectorAll('.tab-btn').forEach(function(btn) {
    btn.classList.toggle('active', parseInt(btn.dataset.catId) === (current ? current._cat_id : -1));
  });
}

function jumpToSubject(catId) {
  const idx = examState.questions.findIndex(function(q) { return q._cat_id === catId; });
  if (idx > -1) navigateTo(idx);
}

function renderQuestion(index) {
  const q = examState.questions[index];
  if (!q) return;

  document.getElementById('q-counter').textContent = 'Q ' + (index + 1) + ' of ' + examState.questions.length;

  const card = document.getElementById('question-card');
  card.innerHTML = '';

  const badge = document.createElement('div');
  badge.className = 'q-num-badge';
  badge.textContent = index + 1;
  card.appendChild(badge);

  if (q.passage_id && q._passages && q._passages[q.passage_id]) {
    const passageBox = document.createElement('div');
    passageBox.className = 'passage-box';
    passageBox.innerHTML =
      '<button class="passage-toggle">Read Passage <span>&#9660;</span></button>' +
      '<div class="passage-content">' + q._passages[q.passage_id] + '</div>';
    const toggle  = passageBox.querySelector('.passage-toggle');
    const content = passageBox.querySelector('.passage-content');
    toggle.addEventListener('click', function() {
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
    img.src       = 'exam_images/question/' + q.photo;
    img.alt       = 'Question image';
    img.onerror   = function() { img.style.display = 'none'; };
    card.appendChild(img);
  }

  const opts = document.createElement('div');
  opts.className = 'options-list';

  ['a', 'b', 'c', 'd', 'e'].forEach(function(letter) {
    const optText = q['option_' + letter];
    if (optText === null || optText === undefined || String(optText).trim() === '') return;

    const btn = document.createElement('button');
    btn.className = 'option-btn' + (examState.answers[index] === letter ? ' selected' : '');
    btn.innerHTML = '<span class="option-letter">' + letter.toUpperCase() + '</span><span>' + optText + '</span>';
    btn.addEventListener('click', function() { selectAnswer(index, letter); });
    opts.appendChild(btn);
  });

  card.appendChild(opts);
  updateNavButtons();
  updateActiveTab();
  updatePaletteHighlight();

  if (window.MathJax && window.MathJax.typesetPromise) {
    window.MathJax.typesetPromise([card]).catch(function() {});
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

document.getElementById('btn-prev').addEventListener('click', function() { navigateTo(examState.currentIndex - 1); });
document.getElementById('btn-next').addEventListener('click', function() { navigateTo(examState.currentIndex + 1); });

/* ── PALETTE ───────────────────────────────────────── */
document.getElementById('btn-palette-toggle').addEventListener('click', function() {
  document.getElementById('palette-panel').classList.toggle('open');
});

function renderPaletteGrid() {
  const grid = document.getElementById('palette-grid');
  grid.innerHTML = '';
  examState.questions.forEach(function(_, i) {
    const btn = document.createElement('button');
    btn.className  = 'palette-num';
    btn.textContent = i + 1;
    btn.dataset.idx = i;
    btn.addEventListener('click', function() { navigateTo(i); });
    grid.appendChild(btn);
  });
  updatePaletteHighlight();
}

function updatePaletteGrid() {
  document.querySelectorAll('.palette-num').forEach(function(btn) {
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
  examState.timerInterval = setInterval(function() {
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
  timerEl.textContent = (String(mins).length < 2 ? '0' + mins : String(mins)) + ':' + (String(secs).length < 2 ? '0' + secs : String(secs));

  if      (examState.timeRemaining < 300)  timerEl.className = 'timer danger';
  else if (examState.timeRemaining < 900)  timerEl.className = 'timer warning';
  else                                      timerEl.className = 'timer';
}

/* ── SUBMIT ────────────────────────────────────────── */
document.getElementById('btn-submit-exam').addEventListener('click', function() {
  const unanswered = examState.questions.length - Object.keys(examState.answers).length;
  if (Object.keys(examState.answers).length === 0) {
    showToast('Please answer at least 1 question before submitting');
    return;
  }
  document.getElementById('modal-submit-msg').textContent =
    unanswered > 0
      ? 'You have ' + unanswered + ' unanswered question' + (unanswered > 1 ? 's' : '') + '. Are you sure?'
      : 'All questions answered. Submit now?';
  document.getElementById('modal-submit').classList.remove('hidden');
});

document.getElementById('modal-cancel').addEventListener('click', function() {
  document.getElementById('modal-submit').classList.add('hidden');
});

document.getElementById('modal-confirm').addEventListener('click', function() {
  document.getElementById('modal-submit').classList.add('hidden');
  submitExam();
});

function submitExam() {
  if (examState.submitted) return;
  examState.submitted = true;
  clearInterval(examState.timerInterval);
  examState.results = calculateResults();

  // Free trial tracking — after first exam, mark trial as used
  if (!isActivated()) {
    markFreeTrialUsed();
  }

  const { totalScore } = examState.results;
  const subjectTitles  = examState.selectedSubjects.map(function(id) {
    const s = SUBJECTS_META.find(function(m) { return m.cat_id === id; });
    return s ? s.title : '';
  });

  // Save score to Sheets in background
  submitScoreToSheets(totalScore, 400, subjectTitles);

  // Save to local history
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }) +
                  ' ' + now.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' });
  saveToHistory({
    type:      examState._quizMode ? 'quiz' : 'practice',
    quizName:  examState._quizName || '',
    subjects:  subjectTitles.join(', '),
    score:     totalScore,
    outOf:     400,
    date:      dateStr,
  });

  renderResultsScreen();
  showScreen('results');
}

/* ═══════════════════════════════════════════════════════
   SCORE CALCULATION
   ═══════════════════════════════════════════════════════ */
function calculateResults() {
  const results      = {};
  const subjectCount = examState.selectedSubjects.length;

  examState.selectedSubjects.forEach(function(catId) {
    const subQuestions = examState.questions.filter(function(q) { return q._cat_id === catId; });
    let correct = 0, wrong = 0, skipped = 0;

    subQuestions.forEach(function(q) {
      const globalIdx = examState.questions.indexOf(q);
      const ans       = examState.answers[globalIdx];
      if (!ans)                          skipped++;
      else if (ans === q.correct_answer) correct++;
      else                               wrong++;
    });

    const total = subQuestions.length;
    const sub   = SUBJECTS_META.find(function(s) { return s.cat_id === catId; });

    results[catId] = {
      title:       sub.title,
      icon:        sub.icon,
      correct:     correct,
      wrong:       wrong,
      skipped:     skipped,
      total:       total,
      scaledScore: total > 0 ? Math.round((correct / total) * (400 / subjectCount)) : 0,
    };
  });

  const totalScore = Object.values(results).reduce(function(sum, r) { return sum + r.scaledScore; }, 0);
  return { bySubject: results, totalScore: totalScore };
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

  Object.values(bySubject).forEach(function(r) {
    const pct  = r.total > 0 ? Math.round((r.correct / r.total) * 100) : 0;
    const card = document.createElement('div');
    card.className = 'result-card';
    card.innerHTML =
      '<span class="result-icon">' + r.icon + '</span>' +
      '<div class="result-info">' +
        '<div class="result-title">' + r.title + '</div>' +
        '<div class="result-bar-wrap">' +
          '<div class="result-bar" style="width:0%" data-pct="' + pct + '"></div>' +
        '</div>' +
        '<div class="result-stats">' + r.correct + ' correct &middot; ' + r.wrong + ' wrong &middot; ' + r.skipped + ' skipped</div>' +
      '</div>' +
      '<div class="result-score">' + r.scaledScore + '<small>pts</small></div>';
    grid.appendChild(card);
    setTimeout(function() { card.querySelector('.result-bar').style.width = pct + '%'; }, 100);
  });

  // Show share button only in quiz mode
  const shareBanner = document.getElementById('result-share-banner');
  if (examState._quizMode && examState._quizId) {
    shareBanner.classList.remove('hidden');
  } else {
    shareBanner.classList.add('hidden');
  }
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

/* ── Share result ───────────────────────────────────── */
function makeResultLink(quizId, quizName, takerName, score, outOf) {
  try {
    const data = { quizId: quizId, quizName: quizName, name: takerName, score: score, outOf: outOf, ts: Date.now() };
    return WEB_BASE_URL + '/#result=' + btoa(JSON.stringify(data));
  } catch (e) {
    return WEB_BASE_URL;
  }
}

document.getElementById('btn-share-result').addEventListener('click', async function() {
  if (!examState.results) return;
  const takerName = currentUser ? currentUser.name : (examState._takerName || 'Student');
  const score     = examState.results.totalScore;
  const outOf     = 400;
  const quizName  = examState._quizName || 'Quiz';

  showLoading('Generating share link…');
  let resultCode = '';
  try {
    const saved = await apiCall({ action: 'saveResult', quizName: quizName, name: takerName, score: score, outOf: outOf, ts: Date.now() });
    if (saved.success) resultCode = saved.resultCode;
  } catch (e) { /* non-critical */ }
  hideLoading();

  const link = makeResultLink(examState._quizId || '', quizName, takerName, score, outOf);
  const codeEl = document.getElementById('share-result-code-display');
  const codeRow = document.getElementById('share-result-code-row');
  if (codeEl) codeEl.textContent = resultCode || '—';
  if (codeRow) codeRow.style.display = resultCode ? '' : 'none';
  document.getElementById('share-result-link-display').textContent = link;
  document.getElementById('modal-share-result').classList.remove('hidden');
});

document.getElementById('btn-copy-result-link').addEventListener('click', function() {
  const txt = document.getElementById('share-result-link-display').textContent;
  navigator.clipboard.writeText(txt).catch(function() {
    const el = document.createElement('textarea');
    el.value = txt; document.body.appendChild(el); el.select();
    document.execCommand('copy'); document.body.removeChild(el);
  });
  showToast('Result link copied!');
});

document.getElementById('btn-copy-result-code').addEventListener('click', function() {
  const txt = document.getElementById('share-result-code-display').textContent;
  if (!txt || txt === '—') return;
  navigator.clipboard.writeText(txt).catch(function() {
    const el = document.createElement('textarea');
    el.value = txt; document.body.appendChild(el); el.select();
    document.execCommand('copy'); document.body.removeChild(el);
  });
  showToast('Result code copied!');
});

document.getElementById('btn-close-share-modal').addEventListener('click', function() {
  document.getElementById('modal-share-result').classList.add('hidden');
});

/* ── New exam / back button behaviour ─────────────────── */
document.getElementById('btn-review').addEventListener('click', function() {
  renderReviewScreen('all');
  showScreen('review');
});

document.getElementById('btn-new-exam').addEventListener('click', function() {
  clearInterval(examState.timerInterval);
  const cachedData = examState.subjectData;
  examState = {
    selectedSubjects: [], subjectConfigs: {}, timerSeconds: 7200,
    questions: [], answers: {}, currentIndex: 0, timeRemaining: 7200,
    timerInterval: null, submitted: false, subjectData: cachedData,
    results: null, _quizMode: false, _quizId: null, _quizName: null, _takerName: null,
  };
  selectedTimerSeconds = 7200;
  // If not logged in (quiz taker), go back to the quiz taker screen (no home)
  if (!currentUser) {
    showScreen('login');
  } else {
    showScreen('home');
  }
});

/* ═══════════════════════════════════════════════════════
   SCREEN 6 — REVIEW
   ═══════════════════════════════════════════════════════ */
document.getElementById('back-to-results').addEventListener('click', function() { showScreen('results'); });

document.querySelectorAll('.filter-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    renderReviewScreen(btn.dataset.filter);
  });
});

function renderReviewScreen(filter) {
  const body = document.getElementById('review-body');
  body.innerHTML = '';

  let questions = examState.questions.map(function(q, i) { return { q: q, i: i }; });

  if (filter === 'correct') {
    questions = questions.filter(function(item) { return examState.answers[item.i] === item.q.correct_answer; });
  } else if (filter === 'wrong') {
    questions = questions.filter(function(item) { return examState.answers[item.i] && examState.answers[item.i] !== item.q.correct_answer; });
  } else if (filter === 'skipped') {
    questions = questions.filter(function(item) { return !examState.answers[item.i]; });
  }

  if (questions.length === 0) {
    body.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:40px 20px;">No questions in this category.</p>';
    return;
  }

  questions.forEach(function(item) {
    const q   = item.q;
    const i   = item.i;
    const ans = examState.answers[i];
    let statusClass, statusLabel, statusMark;

    if (!ans) {
      statusClass = 'status-skipped'; statusLabel = 'Skipped'; statusMark = '—';
    } else if (ans === q.correct_answer) {
      statusClass = 'status-correct'; statusLabel = 'Correct'; statusMark = '&#10003;';
    } else {
      statusClass = 'status-wrong';   statusLabel = 'Wrong';   statusMark = '&#10007;';
    }

    const reviewItem = document.createElement('div');
    reviewItem.className = 'review-item';

    const hasExplain = [q.core_concepts, q.step_by_step, q.common_pitfalls, q.applications].some(function(f) { return f && f.trim() !== ''; });

    let optsHTML = '';
    ['a','b','c','d','e'].forEach(function(letter) {
      const optText = q['option_' + letter];
      if (optText === null || optText === undefined || String(optText).trim() === '') return;
      const isCorrect   = letter === q.correct_answer;
      const isUserWrong = ans && ans === letter && letter !== q.correct_answer;
      let cls = 'review-option';
      if (isCorrect)    cls += ' correct-opt';
      if (isUserWrong)  cls += ' wrong-opt';
      optsHTML += '<div class="' + cls + '"><span class="review-opt-letter">' + letter.toUpperCase() + '</span><span>' + optText + '</span></div>';
    });

    let passageHTML = '';
    if (q.passage_id && q._passages && q._passages[q.passage_id]) {
      passageHTML = '<div class="passage-box" style="margin-bottom:10px;"><button class="passage-toggle">Read Passage <span>&#9660;</span></button><div class="passage-content">' + q._passages[q.passage_id] + '</div></div>';
    }

    let imgHTML = '';
    if (q.photo) {
      imgHTML = '<img class="question-image" src="exam_images/question/' + q.photo + '" alt="" onerror="this.style.display=\'none\'" />';
    }

    let explainHTML = '';
    if (hasExplain) {
      const tabs = [
        { key: 'core',    label: 'Core Concept',   val: q.core_concepts   },
        { key: 'step',    label: 'Step by Step',    val: q.step_by_step    },
        { key: 'pitfall', label: 'Common Pitfalls', val: q.common_pitfalls },
        { key: 'app',     label: 'Applications',    val: q.applications    },
      ].filter(function(t) { return t.val && t.val.trim() !== ''; });

      const tabBtns     = tabs.map(function(t, ti) { return '<button class="explain-tab' + (ti===0?' active':'') + '" data-key="' + t.key + '">' + t.label + '</button>'; }).join('');
      const firstContent = tabs[0] ? tabs[0].val : '';
      explainHTML =
        '<button class="explain-toggle">Explain This <span>&#9660;</span></button>' +
        '<div class="explain-panel">' +
          '<div class="explain-tabs">' + tabBtns + '</div>' +
          '<div class="explain-content" id="explain-content-' + i + '">' + firstContent + '</div>' +
        '</div>';
    }

    reviewItem.innerHTML =
      '<div class="review-item-header">' +
        '<span class="review-badge ' + statusClass + '-badge">' + statusMark + '</span>' +
        '<span class="review-q-num">Question ' + (i + 1) + ' &middot; ' + q._subTitle + '</span>' +
        '<span class="status-badge ' + statusClass + '">' + statusLabel + '</span>' +
      '</div>' +
      '<div class="review-item-body">' +
        passageHTML +
        '<div class="review-question-text">' + q.question + '</div>' +
        imgHTML +
        '<div class="review-options">' + optsHTML + '</div>' +
        explainHTML +
      '</div>';

    body.appendChild(reviewItem);

    reviewItem.querySelectorAll('.passage-toggle').forEach(function(toggle) {
      toggle.addEventListener('click', function() {
        const content = toggle.nextElementSibling;
        content.classList.toggle('open');
        toggle.querySelector('span').innerHTML = content.classList.contains('open') ? '&#9650;' : '&#9660;';
      });
    });

    if (hasExplain) {
      const explainToggle = reviewItem.querySelector('.explain-toggle');
      const explainPanel  = reviewItem.querySelector('.explain-panel');
      explainToggle.addEventListener('click', function() {
        explainPanel.classList.toggle('open');
        explainToggle.querySelector('span').innerHTML = explainPanel.classList.contains('open') ? '&#9650;' : '&#9660;';
      });

      reviewItem.querySelectorAll('.explain-tab').forEach(function(tab) {
        tab.addEventListener('click', function() {
          reviewItem.querySelectorAll('.explain-tab').forEach(function(t) { t.classList.remove('active'); });
          tab.classList.add('active');
          const key = tab.dataset.key;
          const map = { core: q.core_concepts, step: q.step_by_step, pitfall: q.common_pitfalls, app: q.applications };
          reviewItem.querySelector('#explain-content-' + i).textContent = map[key] || '';
        });
      });
    }
  });
}

/* ═══════════════════════════════════════════════════════
   SHARED RESULT VIEW (#result=...)
   ═══════════════════════════════════════════════════════ */
function getResultFromHash() {
  const match = location.hash.match(/^#result=(.+)$/);
  if (!match) return null;
  try { return JSON.parse(atob(match[1])); } catch (e) { return null; }
}

function showResultFromLink(data) {
  const card = document.getElementById('result-view-card');
  const pct  = data.outOf > 0 ? Math.round((data.score / data.outOf) * 100) : 0;
  const grade = pct >= 70 ? '#16a34a' : pct >= 50 ? '#d97706' : '#dc2626';
  const gradeEmoji = pct >= 70 ? '🎉' : pct >= 50 ? '📈' : '📚';

  card.innerHTML =
    '<div class="result-view-title">' + (data.quizName || 'Quiz Result') + '</div>' +
    '<div class="result-view-name">' + (data.name || 'Student') + '</div>' +
    '<div class="result-view-score-circle" style="border-color:' + grade + '; color:' + grade + ';">' +
      '<span class="result-view-score-num">' + data.score + '</span>' +
      '<span class="result-view-score-denom">/ ' + (data.outOf || 400) + '</span>' +
    '</div>' +
    '<div class="result-view-pct" style="color:' + grade + ';">' + gradeEmoji + ' ' + pct + '%</div>' +
    '<p class="result-view-footer">Practice with ExamDriller Online to improve your score!</p>' +
    '<button class="btn-auth" onclick="location.hash=\'\'; location.reload();" style="margin-top:16px;">Try a Quiz</button>';

  showScreen('resultView');
}

/* ═══════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════ */
initParticles();

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

  let calcExpr   = '';
  let calcInput  = '0';
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

  toggleBtn.addEventListener('click', function() {
    overlay.classList.contains('hidden') ? openCalc() : closeCalc();
  });
  closeBtn.addEventListener('click', closeCalc);

  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeCalc();
  });

  function updateDisplay() {
    exprEl.textContent  = calcExpr;
    resultEl.textContent = calcInput;
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
      calcExpr = ''; calcInput = '0'; justEvaled = false;
    } else if (action === 'del') {
      if (justEvaled) { calcInput = '0'; justEvaled = false; return updateDisplay(); }
      calcInput = calcInput.length > 1 ? calcInput.slice(0, -1) : '0';
    } else if (action === 'sqrt') {
      const n = parseFloat(calcInput);
      if (!isNaN(n) && n >= 0) {
        calcExpr = '√(' + calcInput + ')';
        calcInput = String(parseFloat(Math.sqrt(n).toFixed(10)));
        justEvaled = true;
      } else {
        calcInput = 'Error';
      }
    } else if (action === 'equals') {
      if (!calcExpr && calcInput === '0') return;
      const full = calcExpr + calcInput;
      try {
        var ans = Function('"use strict"; return (' + toJsExpr(full) + ')')();
        if (!isFinite(ans)) { calcInput = 'Error'; calcExpr = ''; }
        else {
          calcExpr = full + ' =';
          calcInput = String(parseFloat(ans.toFixed(10)));
          justEvaled = true;
        }
      } catch (_) {
        calcInput = 'Error'; calcExpr = ''; justEvaled = true;
      }
    } else if (['+', '−', '×', '÷'].indexOf(val) > -1) {
      if (calcInput === 'Error') { calcInput = '0'; calcExpr = ''; }
      if (justEvaled) { justEvaled = false; }
      const lastChar = calcExpr.slice(-1);
      if (['+','−','×','÷'].indexOf(lastChar) > -1) {
        calcExpr = calcExpr.slice(0, -1) + val;
      } else {
        calcExpr += calcInput + val;
        calcInput = '0';
      }
    } else {
      if (justEvaled) { calcExpr = ''; calcInput = '0'; justEvaled = false; }
      if (val === '.') {
        if (calcInput.indexOf('.') === -1) calcInput += '.';
        return updateDisplay();
      }
      calcInput = calcInput === '0' ? val : calcInput + val;
      if (calcInput.length > 15) return;
    }
    updateDisplay();
  }

  document.querySelectorAll('.calc-btn').forEach(function(btn) {
    btn.addEventListener('click', function() { handleKey(btn); });
  });

  document.addEventListener('keydown', function(e) {
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
    if (['equals','del','clear'].indexOf(k) > -1) {
      handleKey({ dataset: { action: k } });
    } else {
      handleKey({ dataset: { val: k } });
    }
  });

  updateDisplay();
})();

/* ═══════════════════════════════════════════════════════
   ADMIN MODULE — chinonsoikebunna@gmail.com
   ═══════════════════════════════════════════════════════ */

const ADMIN_EMAIL = 'chinonsoikebunna@gmail.com';

screens.admin       = document.getElementById('screen-admin');
screens.quizTaker   = document.getElementById('screen-quiz-taker');
screens.quizResults = document.getElementById('screen-quiz-results');

let adminState = {
  selectedSubjects: [],
  qCount:     40,
  timer:      5400,
  yearFilter: '',
  quizzes:    [],
};

function injectAdminButton() {
  if (document.getElementById('btn-admin')) return;
  const btn = document.createElement('button');
  btn.id = 'btn-admin';
  btn.className = 'btn-admin';
  btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/><line x1="18" y1="11" x2="18" y2="17"/><line x1="15" y1="14" x2="21" y2="14"/></svg> Admin Panel';
  btn.addEventListener('click', function() { openAdminDashboard(); });
  const cta = document.getElementById('btn-start');
  cta.parentNode.insertBefore(btn, cta.nextSibling);
}

function checkAdminAccess() {
  if (currentUser && currentUser.email.toLowerCase() === ADMIN_EMAIL) {
    injectAdminButton();
  } else {
    const existing = document.getElementById('btn-admin');
    if (existing) existing.remove();
  }
}

async function openAdminDashboard() {
  showScreen('admin');
  renderAdminSubjectPicker();
  document.getElementById('admin-quizzes-list').innerHTML = '<p class="admin-empty-msg">Loading quizzes…</p>';
  document.getElementById('admin-all-keys-list').innerHTML = '<p class="admin-empty-msg">Loading keys…</p>';
  try {
    const result = await apiCall({ action: 'getQuizzes', email: currentUser.email });
    if (result.success) {
      adminState.quizzes = result.quizzes;
      renderAdminQuizList();
    } else {
      document.getElementById('admin-quizzes-list').innerHTML =
        '<p class="admin-empty-msg">' + (result.error || 'Failed to load quizzes.') + '</p>';
    }
  } catch (e) {
    document.getElementById('admin-quizzes-list').innerHTML =
      '<p class="admin-empty-msg">Connection error. Check internet.</p>';
  }
  // Load existing keys
  loadAdminKeys();
}

function renderAdminSubjectPicker() {
  adminState.selectedSubjects = [];
  const picker = document.getElementById('admin-subject-picker');
  picker.innerHTML = '';
  SUBJECTS_META.forEach(function(sub) {
    const btn = document.createElement('button');
    btn.className = 'admin-sub-btn';
    btn.dataset.catId = sub.cat_id;
    btn.innerHTML = '<span>' + sub.icon + '</span> ' + sub.title;
    btn.addEventListener('click', function() {
      const idx = adminState.selectedSubjects.indexOf(sub.cat_id);
      if (idx > -1) {
        adminState.selectedSubjects.splice(idx, 1);
        btn.classList.remove('selected');
      } else {
        if (adminState.selectedSubjects.length >= 4) { showToast('Max 4 subjects'); return; }
        adminState.selectedSubjects.push(sub.cat_id);
        btn.classList.add('selected');
      }
    });
    picker.appendChild(btn);
  });
}

/* ═══════════════════════════════════════════════════════
   ADMIN — ACTIVATION KEYS
   ═══════════════════════════════════════════════════════ */
var adminKeyCount = 1;

document.querySelectorAll('#admin-key-count-group .toggle-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    document.querySelectorAll('#admin-key-count-group .toggle-btn').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    adminKeyCount = parseInt(btn.dataset.count);
  });
});

document.getElementById('btn-generate-key').addEventListener('click', async function() {
  var note = document.getElementById('admin-key-note').value.trim();
  showLoading('Generating key(s)…');
  try {
    var result = await apiCall({ action: 'generateKey', email: currentUser.email, note: note, count: adminKeyCount });
    hideLoading();
    if (!result.success) { showToast(result.error || 'Failed to generate keys'); return; }

    var outputEl = document.getElementById('admin-keys-output');
    var listEl   = document.getElementById('admin-keys-list');
    outputEl.style.display = 'block';
    listEl.innerHTML = '';

    result.keys.forEach(function(key) {
      var row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:10px;' +
        'background:var(--bg-primary);border:1.5px solid var(--border);border-radius:10px;padding:10px 14px;';
      row.innerHTML =
        '<span style="font-family:Outfit,monospace;font-size:1rem;font-weight:800;color:var(--accent-gold);letter-spacing:2px;">' + key + '</span>' +
        '<button style="padding:6px 14px;border-radius:8px;border:none;background:var(--bg-navy);color:#fff;font-size:0.8rem;font-weight:600;cursor:pointer;">Copy</button>';
      row.querySelector('button').addEventListener('click', function() {
        navigator.clipboard.writeText(key).catch(function() {
          var el = document.createElement('textarea');
          el.value = key; document.body.appendChild(el); el.select();
          document.execCommand('copy'); document.body.removeChild(el);
        });
        showToast('Key copied: ' + key);
      });
      listEl.appendChild(row);
    });

    document.getElementById('admin-key-note').value = '';
    loadAdminKeys(); // refresh all-keys list
  } catch (e) {
    hideLoading();
    showToast('Connection error. Try again.');
  }
});

async function loadAdminKeys() {
  var container = document.getElementById('admin-all-keys-list');
  if (!container) return;
  try {
    var result = await apiCall({ action: 'getKeys', email: currentUser.email });
    if (!result.success) { container.innerHTML = '<p class="admin-empty-msg">Could not load keys.</p>'; return; }
    renderAdminKeys(result.keys);
  } catch (e) {
    container.innerHTML = '<p class="admin-empty-msg">Connection error.</p>';
  }
}

function renderAdminKeys(keys) {
  var container = document.getElementById('admin-all-keys-list');
  if (!keys.length) { container.innerHTML = '<p class="admin-empty-msg">No keys generated yet.</p>'; return; }
  container.innerHTML = '';
  keys.slice().reverse().forEach(function(k) {
    var used    = k.usedBy ? true : false;
    var row     = document.createElement('div');
    row.style.cssText = 'padding:10px 12px;border-radius:10px;margin-bottom:8px;border:1.5px solid ' +
      (used ? 'var(--border)' : 'rgba(212,144,10,0.4)') + ';background:' +
      (used ? 'var(--bg-primary)' : 'rgba(212,144,10,0.06)') + ';';

    row.innerHTML =
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">' +
        '<span style="font-family:Outfit,monospace;font-size:0.9rem;font-weight:800;letter-spacing:1px;color:' +
          (used ? 'var(--text-muted)' : 'var(--accent-gold)') + ';">' + k.key + '</span>' +
        '<span style="font-size:0.7rem;font-weight:700;padding:3px 8px;border-radius:20px;background:' +
          (used ? 'rgba(220,38,38,0.1)' : 'rgba(22,163,74,0.1)') + ';color:' +
          (used ? 'var(--wrong)' : 'var(--correct)') + ';">' +
          (used ? '✗ Used' : '✓ Available') +
        '</span>' +
      '</div>' +
      (k.note    ? '<div style="font-size:0.78rem;color:var(--text-secondary);margin-top:4px;">📝 ' + k.note + '</div>' : '') +
      (k.usedBy  ? '<div style="font-size:0.75rem;color:var(--text-muted);margin-top:3px;">👤 ' + k.usedBy + '</div>' : '') +
      '<div style="font-size:0.72rem;color:var(--text-muted);margin-top:3px;">📅 ' + k.generatedAt + '</div>';

    container.appendChild(row);
  });
}

document.querySelectorAll('#admin-qcount-group .toggle-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    document.querySelectorAll('#admin-qcount-group .toggle-btn').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    adminState.qCount = parseInt(btn.dataset.count);
  });
});

document.querySelectorAll('#admin-timer-group .toggle-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    document.querySelectorAll('#admin-timer-group .toggle-btn').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    adminState.timer = parseInt(btn.dataset.val);
  });
});

document.getElementById('admin-year-filter').addEventListener('change', function() {
  adminState.yearFilter = this.value;
});

/* ── Generate quiz link ──────────────────────────────── */
document.getElementById('btn-generate-quiz').addEventListener('click', async function() {
  const name = document.getElementById('admin-quiz-name').value.trim();
  if (!name)                                    { showToast('Please enter a quiz name'); return; }
  if (adminState.selectedSubjects.length === 0) { showToast('Select at least one subject'); return; }

  showLoading('Creating quiz…');
  try {
    const result = await apiCall({
      action:     'createQuiz',
      email:      currentUser.email,
      name:       name,
      subjects:   adminState.selectedSubjects,
      qCount:     adminState.qCount,
      timer:      adminState.timer,
      yearFilter: adminState.yearFilter,
    });
    hideLoading();
    if (!result.success) { showToast(result.error || 'Failed to create quiz'); return; }

    const link = WEB_BASE_URL + '/#quiz=' + result.quizId;
    const quizCodeEl = document.getElementById('quiz-code-display');
    if (quizCodeEl) quizCodeEl.textContent = result.quizCode || '';
    document.getElementById('quiz-link-display').textContent = link;
    document.getElementById('modal-quiz-link').classList.remove('hidden');

    document.getElementById('admin-quiz-name').value = '';
    document.getElementById('admin-year-filter').value = '';
    adminState.selectedSubjects = [];
    adminState.yearFilter = '';
    document.querySelectorAll('.admin-sub-btn').forEach(function(b) { b.classList.remove('selected'); });

    const listResult = await apiCall({ action: 'getQuizzes', email: currentUser.email });
    if (listResult.success) { adminState.quizzes = listResult.quizzes; renderAdminQuizList(); }
  } catch (e) {
    hideLoading();
    showToast('Connection error. Try again.');
  }
});

document.getElementById('btn-copy-link').addEventListener('click', function() {
  const txt = document.getElementById('quiz-link-display').textContent;
  navigator.clipboard.writeText(txt).catch(function() {
    const el = document.createElement('textarea');
    el.value = txt; document.body.appendChild(el); el.select();
    document.execCommand('copy'); document.body.removeChild(el);
  });
  showToast('Link copied!');
});

document.getElementById('btn-copy-quiz-code').addEventListener('click', function() {
  const txt = document.getElementById('quiz-code-display').textContent;
  if (!txt) return;
  navigator.clipboard.writeText(txt).catch(function() {
    const el = document.createElement('textarea');
    el.value = txt; document.body.appendChild(el); el.select();
    document.execCommand('copy'); document.body.removeChild(el);
  });
  showToast('Quiz code copied!');
});

document.getElementById('btn-close-link-modal').addEventListener('click', function() {
  document.getElementById('modal-quiz-link').classList.add('hidden');
});

function renderAdminQuizList() {
  const container = document.getElementById('admin-quizzes-list');
  if (!adminState.quizzes.length) {
    container.innerHTML = '<p class="admin-empty-msg">No quizzes created yet.</p>';
    return;
  }
  container.innerHTML = '';
  adminState.quizzes.forEach(function(quiz) {
    const subNames = quiz.subjects.map(function(id) {
      const s = SUBJECTS_META.find(function(m) { return m.cat_id === id; });
      return s ? s.icon + ' ' + s.title : id;
    }).join(', ');

    const yearLabel = quiz.yearFilter ? ('📅 Year: ' + quiz.yearFilter) : '📅 All Years';

    const item = document.createElement('div');
    item.className = 'quiz-list-item';
    item.innerHTML =
      '<div class="quiz-item-name">' + quiz.name + '</div>' +
      '<div class="quiz-item-meta">' +
        '<span>📚 ' + subNames + '</span>' +
        '<span>📝 ' + quiz.qCount + ' Qs/subject</span>' +
        '<span>⏱ ' + adminFormatSeconds(quiz.timer) + '</span>' +
        '<span>' + yearLabel + '</span>' +
        '<span>🗓 ' + quiz.createdAt + '</span>' +
      '</div>' +
      '<div class="quiz-item-actions">' +
        '<button class="btn-quiz-link"   data-id="' + quiz.id + '">🔗 Share</button>' +
        '<button class="btn-quiz-scores" data-id="' + quiz.id + '" data-name="' + quiz.name + '">📊 Scores</button>' +
        '<button class="btn-quiz-delete" data-id="' + quiz.id + '">🗑 Delete</button>' +
      '</div>';
    container.appendChild(item);
  });

  container.querySelectorAll('.btn-quiz-link').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const quiz = adminState.quizzes.find(function(q) { return q.id === btn.dataset.id; });
      const link = WEB_BASE_URL + '/#quiz=' + btn.dataset.id;
      const quizCodeEl = document.getElementById('quiz-code-display');
      if (quizCodeEl && quiz) quizCodeEl.textContent = quiz.quizCode || '';
      document.getElementById('quiz-link-display').textContent = link;
      document.getElementById('modal-quiz-link').classList.remove('hidden');
    });
  });

  container.querySelectorAll('.btn-quiz-scores').forEach(function(btn) {
    btn.addEventListener('click', function() { showQuizResults(btn.dataset.id, btn.dataset.name); });
  });

  container.querySelectorAll('.btn-quiz-delete').forEach(function(btn) {
    btn.addEventListener('click', async function() {
      if (!confirm('Delete this quiz and all its scores?')) return;
      showLoading('Deleting…');
      try {
        await apiCall({ action: 'deleteQuiz', email: currentUser.email, quizId: btn.dataset.id });
        hideLoading();
        adminState.quizzes = adminState.quizzes.filter(function(q) { return q.id !== btn.dataset.id; });
        renderAdminQuizList();
        showToast('Quiz deleted');
      } catch (e) {
        hideLoading();
        showToast('Delete failed. Try again.');
      }
    });
  });
}

function adminFormatSeconds(s) {
  if (s < 3600) return (s / 60) + ' min';
  const h = s / 3600;
  return h + ' hr' + (h > 1 ? 's' : '');
}

async function showQuizResults(quizId, quizName) {
  document.getElementById('quiz-results-title').textContent = (quizName || 'Quiz') + ' — Results';
  showScreen('quizResults');
  const body = document.getElementById('quiz-results-body');
  body.innerHTML = '<div class="no-scores-msg">Loading scores…</div>';
  try {
    const result = await apiCall({ action: 'getQuizScores', email: currentUser.email, quizId: quizId });
    if (!result.success) { body.innerHTML = '<div class="no-scores-msg">' + result.error + '</div>'; return; }
    if (!result.scores.length) {
      body.innerHTML = '<div class="no-scores-msg">No submissions yet for this quiz.</div>';
      return;
    }
    const sorted = [...result.scores].sort(function(a, b) { return b.score - a.score; });
    const rows = sorted.map(function(s, i) {
      return '<tr><td class="score-rank">#' + (i + 1) + '</td><td>' + s.name + '</td><td>' + (s.email || '—') + '</td><td><strong>' + s.score + '</strong> / ' + s.outOf + '</td><td>' + s.pct + '</td><td>' + s.submittedAt + '</td></tr>';
    }).join('');
    body.innerHTML = '<div style="overflow-x:auto;"><table class="scores-table"><thead><tr><th>#</th><th>Name</th><th>Email</th><th>Score</th><th>%</th><th>Submitted</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
  } catch (e) {
    body.innerHTML = '<div class="no-scores-msg">Connection error loading scores.</div>';
  }
}

document.getElementById('back-admin-to-home').addEventListener('click', function() { showScreen('home'); });
document.getElementById('back-quiz-results').addEventListener('click', function() { showScreen('admin'); });

/* ═══════════════════════════════════════════════════════
   QUIZ TAKER — Handle #quiz=<id> links AND quiz codes
   ═══════════════════════════════════════════════════════ */
function getQuizIdFromHash() {
  const match = location.hash.match(/^#quiz=(.+)$/);
  return match ? match[1] : null;
}

/* ── Load quiz by ED code (e.g. ED47382910) ─────────────── */
async function launchQuizFromCode(rawCode) {
  const code = rawCode.trim().toUpperCase();
  if (!code) { showToast('Please enter a quiz code'); return; }

  showLoading('Looking up quiz…');
  try {
    const result = await apiCall({ action: 'getQuizByCode', quizCode: code });
    hideLoading();
    if (result.success) {
      launchQuizFromLink(result.quiz.id);
    } else {
      showToast(result.error || 'Quiz code not found');
    }
  } catch (e) {
    hideLoading();
    showToast('Connection error. Check your internet.');
  }
}

async function launchQuizFromLink(quizId) {
  // Quiz takers DON'T need to be logged in — just show the quiz directly
  showScreen('quizTaker');
  document.getElementById('quiz-taker-title').textContent = 'Loading Quiz…';
  const body = document.getElementById('quiz-taker-body');
  body.innerHTML = '<p style="text-align:center;padding:32px;color:var(--text-muted);">Loading quiz…</p>';

  try {
    const result = await apiCall({ action: 'getQuiz', quizId: quizId });
    if (!result.success) {
      body.innerHTML = '<div class="quiz-intro-card"><h3>Quiz Not Found</h3><p style="color:var(--text-muted);margin-top:8px;">' + (result.error || 'This quiz does not exist.') + '</p></div>';
      return;
    }
    const quiz = result.quiz;

    // Check 24-hour expiry
    if (quiz.createdAt) {
      const created = new Date(quiz.createdAt).getTime();
      if (!isNaN(created)) {
        const diffHrs = (Date.now() - created) / (1000 * 60 * 60);
        if (diffHrs > 24) {
          document.getElementById('quiz-taker-title').textContent = 'Quiz Expired';
          body.innerHTML =
            '<div class="quiz-intro-card">' +
              '<div style="font-size:2.5rem;text-align:center;margin-bottom:12px;">⏰</div>' +
              '<h3 style="text-align:center;">This Quiz Has Expired</h3>' +
              '<p style="color:var(--text-muted);margin-top:8px;text-align:center;">Quiz links are valid for 24 hours only. Please contact the quiz creator for a new link.</p>' +
            '</div>';
          return;
        }
      }
    }

    document.getElementById('quiz-taker-title').textContent = quiz.name;

    const subNames = quiz.subjects.map(function(id) {
      const s = SUBJECTS_META.find(function(m) { return m.cat_id === id; });
      return s ? s.icon + ' ' + s.title : id;
    }).join(' · ');

    const yearInfo = quiz.yearFilter ? ('<span>📅 Year: ' + quiz.yearFilter + '</span>') : '';

    body.innerHTML =
      '<div class="quiz-intro-card">' +
        '<h3>' + quiz.name + '</h3>' +
        '<div class="quiz-intro-meta">' +
          '<span>📚 ' + subNames + '</span>' +
          '<span>📝 ' + quiz.qCount + ' questions per subject</span>' +
          '<span>⏱ ' + adminFormatSeconds(quiz.timer) + '</span>' +
          yearInfo +
        '</div>' +
        '<div class="form-group" style="margin-bottom:12px;">' +
          '<label class="form-label">Your Full Name</label>' +
          '<input type="text" id="quiz-taker-name" class="form-input" placeholder="e.g. Chukwuemeka Obi" autocomplete="name" />' +
        '</div>' +
        '<button class="btn-primary" id="btn-begin-quiz" style="width:100%;">Begin Quiz</button>' +
      '</div>';

    document.getElementById('quiz-taker-name').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') document.getElementById('btn-begin-quiz').click();
    });

    document.getElementById('btn-begin-quiz').addEventListener('click', function() {
      const takerName = document.getElementById('quiz-taker-name').value.trim();
      if (!takerName) { showToast('Please enter your name to continue'); return; }

      examState.selectedSubjects = quiz.subjects;
      examState.subjectConfigs   = {};
      quiz.subjects.forEach(function(catId) {
        examState.subjectConfigs[catId] = { filterType: 'random', filterValue: null, qCount: quiz.qCount };
      });
      examState.timerSeconds   = quiz.timer;     // ← Quiz timer correctly set here
      examState.timeRemaining  = quiz.timer;
      examState._quizMode      = true;
      examState._quizId        = quiz.id;
      examState._quizName      = quiz.name;
      examState._takerName     = takerName;
      examState._quizYearFilter = quiz.yearFilter || '';

      showScreen('exam');
      startExam();                               // ← startExam() now respects examState.timerSeconds in quiz mode
    });

  } catch (e) {
    body.innerHTML = '<div class="quiz-intro-card"><h3>Connection Error</h3><p style="color:var(--text-muted);margin-top:8px;">Could not load quiz. Check your internet.</p></div>';
  }
}

/* ── Save quiz score after exam submission ───────────── */
document.addEventListener('quizScoreSave', async function(e) {
  const score  = e.detail.score;
  const outOf  = e.detail.outOf;
  if (!examState._quizMode || !examState._quizId) return;
  const name  = currentUser ? currentUser.name  : (examState._takerName || 'Guest');
  const email = currentUser ? currentUser.email : '';
  try {
    await apiCall({
      action:   'saveQuizScore',
      quizId:   examState._quizId,
      quizName: examState._quizName || '',
      name:     name,
      email:    email,
      score:    score,
      outOf:    outOf,
    });
  } catch (e) {
    console.warn('Quiz score save failed:', e);
  }
  examState._quizMode  = false;
  examState._quizId    = null;
  examState._quizName  = null;
  examState._takerName = null;
});

/* ── Check admin, restore pending quiz after login ──── */
document.addEventListener('userSessionSaved', function() {
  checkAdminAccess();
  const pendingQuizId = sessionStorage.getItem('pendingQuizId');
  if (pendingQuizId) {
    sessionStorage.removeItem('pendingQuizId');
    launchQuizFromLink(pendingQuizId);
  }
});

/* ── Boot ─────────────────────────────────────────────── */
setTimeout(function() {
  // Priority 1: #result= link — show shared result card
  const resultData = getResultFromHash();
  if (resultData) {
    showResultFromLink(resultData);
    return;
  }

  // Priority 2: #quiz= link — launch quiz (no login needed)
  const quizId = getQuizIdFromHash();
  if (quizId) {
    launchQuizFromLink(quizId);
    return;
  }

  // Priority 3: normal app init
  initAuth();
  checkAdminAccess();
}, 150);
