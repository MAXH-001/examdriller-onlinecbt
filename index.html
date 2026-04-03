<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>ExamDriller — Activate</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet"/>
<style>
:root {
  --bg:#f0f2f7; --surface:#ffffff; --navy:#0c1f4a; --navy-mid:#1a3a7c;
  --blue:#2563eb; --blue-soft:#eff4ff; --blue-border:#c7d7fd;
  --border:#e4e8f0; --border2:#d1d8e8; --text:#0f172a; --text2:#4b5a73; --text3:#8fa0bb;
  --green:#047857; --green-soft:#f0fdf8; --green-border:#a7f3d0;
  --red:#b91c1c; --red-soft:#fff5f5; --red-border:#fecaca;
  --amber:#b45309; --amber-soft:#fffbeb; --amber-border:#fde68a;
  --orange:#c2410c; --orange-soft:#fff7ed; --orange-border:#fed7aa;
  --radius-sm:8px; --radius:12px; --radius-lg:16px;
  --shadow-xs:0 1px 2px rgba(12,31,74,.06); --shadow-sm:0 2px 8px rgba(12,31,74,.08);
  --mono:'JetBrains Mono',monospace; --sans:'Inter',sans-serif;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body{height:100%;overflow:hidden;}
body{font-family:var(--sans);background:var(--bg);color:var(--text);display:flex;flex-direction:column;align-items:center;}
body::before{content:'';position:fixed;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--navy) 0%,var(--blue) 60%,#60a5fa 100%);z-index:100;}

.wrap{width:100%;max-width:440px;height:100%;overflow-y:auto;padding:22px 16px 32px;scrollbar-width:none;-ms-overflow-style:none;}
.wrap::-webkit-scrollbar{display:none;}

/* Brand */
.brand{display:flex;flex-direction:column;align-items:center;text-align:center;margin-bottom:22px;animation:fadeUp .35s ease both;}
.brand-mark{display:inline-flex;align-items:center;gap:9px;margin-bottom:14px;}
.brand-icon{width:32px;height:32px;background:linear-gradient(140deg,var(--navy),var(--blue));border-radius:8px;display:flex;align-items:center;justify-content:center;}
.brand-icon svg{width:17px;height:17px;fill:#fff;}
.brand-name{font-size:15px;font-weight:800;color:var(--navy);letter-spacing:-.3px;}
.brand-title{font-size:21px;font-weight:800;color:var(--navy);letter-spacing:-.5px;line-height:1.25;margin-bottom:7px;}
.brand-title em{font-style:normal;color:var(--blue);}
.brand-sub{font-size:13px;color:var(--text2);line-height:1.6;max-width:290px;}

/* Step indicator bar */
.steps-bar{display:flex;align-items:center;justify-content:center;gap:0;margin-bottom:20px;animation:fadeUp .36s ease both;}
.step-pill{display:flex;align-items:center;gap:6px;}
.step-dot{width:24px;height:24px;border-radius:50%;background:var(--border2);color:var(--text3);font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;transition:background .3s,color .3s;}
.step-dot.active{background:var(--navy);color:#fff;}
.step-dot.done{background:var(--green);color:#fff;}
.step-pill-label{font-size:11px;font-weight:600;color:var(--text3);transition:color .3s;}
.step-pill-label.active{color:var(--navy);}
.step-pill-label.done{color:var(--green);}
.step-line{width:28px;height:2px;background:var(--border);margin:0 4px;transition:background .3s;}
.step-line.done{background:var(--green);}

/* Page transitions */
.page{display:none;animation:fadeUp .3s ease both;}
.page.active{display:block;}

/* Cards */
.card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);margin-bottom:10px;overflow:hidden;}

/* Payment header */
.pay-header{display:flex;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid var(--border);background:linear-gradient(135deg,var(--navy) 0%,var(--navy-mid) 100%);}
.pay-avatar{width:38px;height:38px;border-radius:10px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.14);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.pay-avatar svg{width:20px;height:20px;fill:rgba(255,255,255,.88);}
.pay-bank-name{font-size:13px;font-weight:700;color:#fff;}
.pay-bank-sub{font-size:11px;color:rgba(255,255,255,.5);margin-top:2px;}
.pay-body{padding:14px 16px;}

.acct-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding-bottom:13px;margin-bottom:13px;border-bottom:1px solid var(--border);}
.acct-meta-label{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.8px;color:var(--text3);margin-bottom:4px;}
.acct-number{font-family:var(--mono);font-size:18px;font-weight:700;color:var(--navy);letter-spacing:2px;}
.acct-name{font-size:11px;color:var(--text2);margin-top:3px;font-weight:500;}

.copy-btn{display:inline-flex;align-items:center;gap:5px;background:var(--blue-soft);border:1px solid var(--blue-border);color:var(--blue);border-radius:var(--radius-sm);padding:8px 13px;font-size:12px;font-weight:600;cursor:pointer;font-family:var(--sans);transition:background .15s,color .15s;white-space:nowrap;flex-shrink:0;}
.copy-btn svg{width:12px;height:12px;flex-shrink:0;}
.copy-btn:hover{background:var(--blue-border);}
.copy-btn.done{background:var(--green-soft);border-color:var(--green-border);color:var(--green);}

.amount-row{display:flex;align-items:center;justify-content:space-between;background:var(--blue-soft);border:1px solid var(--blue-border);border-radius:var(--radius);padding:11px 14px;}
.amt-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:var(--blue);margin-bottom:3px;}
.amt-value{font-size:25px;font-weight:800;color:var(--navy);letter-spacing:-1px;line-height:1;}
.amt-value sup{font-size:13px;font-weight:600;color:var(--text2);vertical-align:top;margin-top:4px;display:inline-block;}
.amt-right{text-align:right;font-size:11px;color:var(--text2);line-height:1.7;font-weight:500;}

/* Primary button */
.primary-btn{width:100%;padding:13px;background:linear-gradient(135deg,var(--navy) 0%,var(--blue) 100%);color:#fff;border:none;border-radius:var(--radius-sm);font-family:var(--sans);font-size:14px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:opacity .15s,transform .12s;box-shadow:0 3px 12px rgba(37,99,235,.28);}
.primary-btn:hover:not(:disabled){opacity:.91;transform:translateY(-1px);}
.primary-btn:active:not(:disabled){transform:translateY(0);opacity:1;}
.primary-btn:disabled{opacity:.45;cursor:not-allowed;}
.primary-btn.green{background:linear-gradient(135deg,#065f46 0%,var(--green) 100%);}

.spin{width:15px;height:15px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .65s linear infinite;display:none;flex-shrink:0;}
@keyframes spin{to{transform:rotate(360deg);}}

/* Countdown page — redesigned */
.countdown-wrap{display:flex;flex-direction:column;align-items:center;padding:28px 20px 24px;text-align:center;}

/* Dark hero band */
.cd-hero{width:100%;background:linear-gradient(160deg,var(--navy) 0%,#0f2d6b 100%);border-radius:var(--radius);padding:28px 20px 24px;display:flex;flex-direction:column;align-items:center;margin-bottom:14px;position:relative;overflow:hidden;}
.cd-hero::before{content:'';position:absolute;top:-40px;right:-40px;width:130px;height:130px;background:radial-gradient(circle,rgba(96,165,250,.18) 0%,transparent 70%);pointer-events:none;}
.cd-hero::after{content:'';position:absolute;bottom:-30px;left:-30px;width:100px;height:100px;background:radial-gradient(circle,rgba(37,99,235,.14) 0%,transparent 70%);pointer-events:none;}

/* Ring container */
.cd-ring-wrap{position:relative;width:120px;height:120px;margin-bottom:18px;}
.cd-glow{position:absolute;inset:8px;border-radius:50%;background:radial-gradient(circle,rgba(96,165,250,.22) 0%,transparent 70%);animation:cdPulse 2s ease-in-out infinite;}
@keyframes cdPulse{0%,100%{transform:scale(.9);opacity:.5;}50%{transform:scale(1.15);opacity:1;}}
.countdown-ring{position:absolute;top:0;left:0;width:120px;height:120px;filter:drop-shadow(0 0 6px rgba(96,165,250,.5));}
.cd-num-center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;}
.countdown-num{font-size:42px;font-weight:800;color:#fff;font-family:var(--mono);line-height:1;}
.cd-secs-label{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:rgba(255,255,255,.45);margin-top:2px;}

/* Dots loader */
.cd-dots{display:flex;gap:5px;margin-bottom:14px;}
.cd-dot{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.35);}
.cd-dot:nth-child(1){animation:cdDotBlink 1.2s ease-in-out infinite 0s;}
.cd-dot:nth-child(2){animation:cdDotBlink 1.2s ease-in-out infinite .2s;}
.cd-dot:nth-child(3){animation:cdDotBlink 1.2s ease-in-out infinite .4s;}
@keyframes cdDotBlink{0%,80%,100%{opacity:.3;transform:scale(1);}40%{opacity:1;transform:scale(1.4);}}

.countdown-title{font-size:15px;font-weight:700;color:#fff;margin-bottom:5px;}
.countdown-sub{font-size:12px;color:rgba(255,255,255,.55);line-height:1.65;max-width:240px;}

/* Tip strip — clean inline */
.countdown-tip{display:flex;align-items:flex-start;gap:10px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:var(--radius-sm);padding:11px 13px;margin-top:0;font-size:12px;color:rgba(255,255,255,.75);line-height:1.65;width:100%;text-align:left;}
.cd-tip-icon{font-size:15px;flex-shrink:0;margin-top:1px;}
.countdown-tip strong{color:#fff;font-weight:700;}

/* Verify page */
.verify-head{padding:14px 16px 0;}
.verify-title{font-size:14px;font-weight:700;color:var(--navy);margin-bottom:3px;}
.verify-desc{font-size:12px;color:var(--text2);line-height:1.6;}
.verify-body{padding:12px 16px 16px;}
.field-label{display:block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:var(--text3);margin-bottom:6px;}
.field-input{width:100%;background:var(--bg);border:1.5px solid var(--border2);border-radius:var(--radius-sm);color:var(--text);font-family:var(--mono);font-size:14px;padding:10px 13px;outline:none;letter-spacing:.4px;margin-bottom:10px;transition:border-color .15s,box-shadow .15s,background .15s;}
.field-input:focus{border-color:var(--blue);background:var(--surface);box-shadow:0 0 0 3px rgba(37,99,235,.10);}
.field-input::placeholder{color:var(--text3);font-style:italic;}

/* Result */
.result-box{margin-top:12px;border-radius:var(--radius);padding:13px 14px;display:none;}
.result-box.show{display:block;}
.result-box.success{background:var(--green-soft);border:1.5px solid var(--green-border);}
.result-box.error{background:var(--red-soft);border:1.5px solid var(--red-border);}
.result-box.warning{background:var(--amber-soft);border:1.5px solid var(--amber-border);}
.result-head{display:flex;align-items:center;gap:8px;margin-bottom:5px;}
.result-icon{font-size:15px;line-height:1;}
.result-title{font-size:13px;font-weight:700;}
.result-box.success .result-title{color:var(--green);}
.result-box.error .result-title{color:var(--red);}
.result-box.warning .result-title{color:var(--amber);}
.result-msg{font-size:12px;color:var(--text2);line-height:1.65;}

/* Payer strip */
.payer-strip{display:flex;gap:8px;margin-top:10px;padding-top:10px;border-top:1px solid rgba(0,0,0,.06);}
.payer-cell{flex:1;background:rgba(255,255,255,.7);border:1px solid rgba(0,0,0,.06);border-radius:var(--radius-sm);padding:8px 10px;}
.payer-cell-label{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.7px;color:var(--text3);margin-bottom:3px;}
.payer-cell-value{font-size:12px;font-weight:700;color:var(--navy);word-break:break-word;}
.payer-cell-value.is-amount{font-family:var(--mono);font-size:14px;color:var(--green);}
.payer-cell-value.is-low{color:var(--red);}

/* Keys */
.keys-section{margin-top:12px;}
.keys-heading{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--text3);margin-bottom:8px;}
.key-card{background:var(--surface);border:1.5px solid var(--green-border);border-radius:var(--radius);padding:12px 13px;margin-bottom:8px;box-shadow:var(--shadow-xs);}
.key-card-top{display:flex;align-items:center;gap:7px;margin-bottom:8px;}
.key-index{width:17px;height:17px;border-radius:50%;background:var(--green);color:#fff;font-size:9px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.key-card-label{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.8px;color:var(--text3);}
.key-value{font-family:var(--mono);font-size:15px;font-weight:700;color:var(--navy);letter-spacing:2px;word-break:break-all;margin-bottom:10px;padding:8px 10px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);}
.key-actions{display:flex;gap:7px;}
.key-copy-btn{flex:1;display:inline-flex;align-items:center;justify-content:center;gap:5px;background:var(--blue-soft);border:1px solid var(--blue-border);color:var(--blue);border-radius:var(--radius-sm);padding:8px 10px;font-size:12px;font-weight:600;cursor:pointer;font-family:var(--sans);transition:background .15s,color .15s;}
.key-copy-btn svg{width:12px;height:12px;flex-shrink:0;}
.key-copy-btn:hover{background:var(--blue-border);}
.key-copy-btn.done{background:var(--green-soft);border-color:var(--green-border);color:var(--green);}
.wa-btn{flex:1;display:inline-flex;align-items:center;justify-content:center;gap:5px;background:#e9fdf0;border:1px solid #a3e6bc;color:#15803d;border-radius:var(--radius-sm);padding:8px 10px;font-size:12px;font-weight:600;text-decoration:none;font-family:var(--sans);transition:background .15s;white-space:nowrap;}
.wa-btn svg{width:13px;height:13px;flex-shrink:0;}
.wa-btn:hover{background:#d1fae5;}

/* Notice boxes */
.notice{border-radius:var(--radius);padding:12px 14px;font-size:12px;line-height:1.7;margin-top:10px;}
.notice.urgent{background:var(--orange-soft);border:1.5px solid var(--orange-border);color:var(--orange);}
.notice.info{background:var(--blue-soft);border:1.5px solid var(--blue-border);color:#1d4ed8;}
.notice strong{font-weight:700;}
.notice-title{font-size:12px;font-weight:700;margin-bottom:4px;display:flex;align-items:center;gap:6px;}

/* Key instruction */
.key-instruction{margin-top:6px;padding:8px 10px;background:rgba(255,255,255,.55);border:1px solid rgba(0,0,0,.05);border-radius:var(--radius-sm);font-size:11px;color:var(--text2);line-height:1.65;}

/* Footer */
.footer{text-align:center;margin-top:18px;font-size:11px;color:var(--text3);letter-spacing:.2px;}

@keyframes fadeUp{from{opacity:0;transform:translateY(9px);}to{opacity:1;transform:translateY(0);}}
@media(max-width:380px){.acct-number{font-size:15px;}.amt-value{font-size:21px;}.key-value{font-size:12px;letter-spacing:1.5px;}.payer-strip{flex-direction:column;}}
</style>
</head>
<body>
<div class="wrap">

  <!-- Brand -->
  <div class="brand">
    <div class="brand-mark">
      <div class="brand-icon">
        <svg viewBox="0 0 24 24"><path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6zm7 1.5L18.5 9H13V3.5zM8 13h8v1.5H8V13zm0 3h5v1.5H8V16zm0-6h3v1.5H8V10z"/></svg>
      </div>
      <span class="brand-name">ExamDriller</span>
    </div>
    <div class="brand-title">Get Your <em>Activation Key</em></div>
    <p class="brand-sub">Pay via PalmPay, enter your Session ID, and receive your key instantly.</p>
  </div>

  <!-- Steps bar -->
  <div class="steps-bar" id="stepsBar">
    <div class="step-pill">
      <div class="step-dot active" id="sd1">1</div>
      <div class="step-pill-label active" id="sl1">Pay</div>
    </div>
    <div class="step-line" id="line1"></div>
    <div class="step-pill">
      <div class="step-dot" id="sd2">2</div>
      <div class="step-pill-label" id="sl2">Wait</div>
    </div>
    <div class="step-line" id="line2"></div>
    <div class="step-pill">
      <div class="step-dot" id="sd3">3</div>
      <div class="step-pill-label" id="sl3">Verify</div>
    </div>
    <div class="step-line" id="line3"></div>
    <div class="step-pill">
      <div class="step-dot" id="sd4">4</div>
      <div class="step-pill-label" id="sl4">Key</div>
    </div>
  </div>

  <!-- PAGE 1: Payment details -->
  <div class="page active" id="page1">
    <div class="card">
      <div class="pay-header">
        <div class="pay-avatar">
          <svg viewBox="0 0 24 24"><path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>
        </div>
        <div>
          <div class="pay-bank-name">PalmPay</div>
          <div class="pay-bank-sub">Transfer to this account number</div>
        </div>
      </div>
      <div class="pay-body">
        <div class="acct-row">
          <div>
            <div class="acct-meta-label">Account Number</div>
            <div class="acct-number">9116959509</div>
            <div class="acct-name">CHINONSO VICTOR</div>
          </div>
          <button class="copy-btn" id="acctCopyBtn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            Copy
          </button>
        </div>
        <div class="amount-row">
          <div>
            <div class="amt-label">Amount to Pay</div>
            <div class="amt-value"><sup>₦</sup>2,000</div>
          </div>
          <div class="amt-right">One-time payment<br>Per activation key</div>
        </div>
      </div>
    </div>

    <button class="primary-btn" style="margin-top:6px;" onclick="startCountdown()">
      ✅ I've Paid — Verify Payment
    </button>
    <div class="footer">© 2026 Maxh Technologies · ExamDriller</div>
  </div>

  <!-- PAGE 2: Countdown -->
  <div class="page" id="page2">
    <div class="card" style="overflow:visible;">
      <div class="countdown-wrap">
        <div class="cd-hero">
          <!-- Glow + Ring -->
          <div class="cd-ring-wrap">
            <div class="cd-glow"></div>
            <svg class="countdown-ring" viewBox="0 0 120 120">
              <!-- Track -->
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="6"/>
              <!-- Progress arc -->
              <circle cx="60" cy="60" r="52" fill="none"
                stroke="url(#cdGrad)" stroke-width="6"
                stroke-dasharray="327" stroke-dashoffset="0"
                stroke-linecap="round" transform="rotate(-90 60 60)"
                id="countdownRing"/>
              <defs>
                <linearGradient id="cdGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#60a5fa"/>
                  <stop offset="100%" stop-color="#2563eb"/>
                </linearGradient>
              </defs>
            </svg>
            <div class="cd-num-center">
              <span class="countdown-num" id="countdownNum">10</span>
              <span class="cd-secs-label">secs</span>
            </div>
          </div>

          <!-- Dots -->
          <div class="cd-dots">
            <div class="cd-dot"></div>
            <div class="cd-dot"></div>
            <div class="cd-dot"></div>
          </div>

          <div class="countdown-title">Confirming your payment…</div>
          <div class="countdown-sub">Please wait while we allow time for the payment to register on our end.</div>

          <!-- Tip inline -->
          <div class="countdown-tip" style="margin-top:16px;">
            <span class="cd-tip-icon">💡</span>
            <span><strong>Tip:</strong> Have your <strong>Session ID</strong> ready from your PalmPay notification — you'll need it on the next screen.</span>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">© 2026 Maxh Technologies · ExamDriller</div>
  </div>

  <!-- PAGE 3: Enter Transaction ID -->
  <div class="page" id="page3">
    <div class="card">
      <div class="verify-head">
        <div class="verify-title">Verify Your Payment</div>
        <div class="verify-desc">Copy the Session ID from your PalmPay notification and paste it below.</div>
      </div>
      <div class="verify-body">
        <label class="field-label" for="txInput">PalmPay Session ID</label>
        <input type="text" class="field-input" id="txInput"
          placeholder="e.g. 6031tenta001"
          autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"/>
        <button class="primary-btn" id="mainBtn">
          <span class="spin" id="spinner"></span>
          <span id="btnLabel">Get Activation Key</span>
        </button>

        <div class="result-box" id="resultBox">
          <div class="result-head">
            <span class="result-icon" id="rIcon"></span>
            <span class="result-title" id="rTitle"></span>
          </div>
          <div class="result-msg" id="rMsg"></div>
          <div class="payer-strip" id="payerStrip" style="display:none;">
            <div class="payer-cell">
              <div class="payer-cell-label">Sender</div>
              <div class="payer-cell-value" id="payerName">—</div>
            </div>
            <div class="payer-cell">
              <div class="payer-cell-label">Amount Paid</div>
              <div class="payer-cell-value is-amount" id="payerAmount">—</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">© 2026 Maxh Technologies · ExamDriller</div>
  </div>

  <!-- PAGE 4: Key delivered -->
  <div class="page" id="page4">
    <div class="card">
      <div class="verify-body">

        <div class="payer-strip" id="page4PayerStrip" style="display:none;margin-top:0;padding-top:0;border-top:none;margin-bottom:12px;">
          <div class="payer-cell">
            <div class="payer-cell-label">Sender</div>
            <div class="payer-cell-value" id="page4Name">—</div>
          </div>
          <div class="payer-cell">
            <div class="payer-cell-label">Amount Paid</div>
            <div class="payer-cell-value is-amount" id="page4Amount">—</div>
          </div>
        </div>

        <div class="keys-section">
          <div class="keys-heading">🎉 Your Activation Key(s)</div>
          <div id="keysList"></div>
          <div class="key-instruction">
            Open <strong>ExamDriller</strong> → tap <strong>Enter Code</strong> → paste your key. Each key unlocks one device.
          </div>
        </div>

        <!-- Urgent notice -->
        <div class="notice urgent" style="margin-top:14px;">
          <div class="notice-title">⚠️ Use Your Key Immediately!</div>
          Keys are valid and should be activated <strong>right away</strong>. Do not delay — screenshot or copy your key now before closing this page.
        </div>

        <!-- Retrieval notice -->
        <div class="notice info" style="margin-top:10px;">
          <div class="notice-title">🔄 Need to Retrieve Your Key Later?</div>
          If you lose your key, you can always come back to this page, enter your <strong>Session ID</strong> again, and your key will be shown to you.
        </div>

        <button class="primary-btn green" style="margin-top:14px;" onclick="goRetrieve()">
          🔍 Retrieve Key with Session ID
        </button>

      </div>
    </div>
    <div class="footer">© 2026 Maxh Technologies · ExamDriller</div>
  </div>

</div>

<script>
const GAS_URL = "https://script.google.com/macros/s/AKfycbxsPD8sa97pA_xM1kBE8JY-xzZrraPixBeqbQSvEAkCR1nVsvoOw8-Td5ie2pu6x3oe/exec";

const ICON_COPY  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px;flex-shrink:0"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
const ICON_CHECK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px;flex-shrink:0"><polyline points="20 6 9 17 4 12"/></svg>`;
const ICON_WA    = `<svg viewBox="0 0 24 24" fill="currentColor" style="width:13px;height:13px;flex-shrink:0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

/* ── Step bar ── */
function setStep(n) {
  for (let i = 1; i <= 4; i++) {
    const dot = document.getElementById('sd' + i);
    const lbl = document.getElementById('sl' + i);
    dot.className = 'step-dot' + (i < n ? ' done' : i === n ? ' active' : '');
    lbl.className = 'step-pill-label' + (i < n ? ' done' : i === n ? ' active' : '');
    if (i < 4) {
      document.getElementById('line' + i).className = 'step-line' + (i < n ? ' done' : '');
    }
  }
}

function showPage(n) {
  for (let i = 1; i <= 4; i++) {
    document.getElementById('page' + i).classList.remove('active');
  }
  document.getElementById('page' + n).classList.add('active');
  setStep(n);
  window.scrollTo(0, 0);
}

/* ── Copy account number ── */
document.getElementById('acctCopyBtn').addEventListener('click', function () {
  navigator.clipboard.writeText('9116959509').then(() => {
    this.innerHTML = `${ICON_CHECK} Copied`;
    this.classList.add('done');
    setTimeout(() => { this.innerHTML = `${ICON_COPY} Copy`; this.classList.remove('done'); }, 2000);
  });
});

/* ── Countdown ── */
function startCountdown() {
  showPage(2);
  let secs = 10;
  const numEl  = document.getElementById('countdownNum');
  const ring   = document.getElementById('countdownRing');
  const total  = 327; // 2π×52

  const tick = () => {
    numEl.textContent = secs;
    ring.style.strokeDashoffset = total - (total * secs / 10);
    if (secs <= 0) { showPage(3); document.getElementById('txInput').focus(); return; }
    secs--;
    setTimeout(tick, 1000);
  };
  tick();
}

/* ── Verify ── */
document.getElementById('txInput').addEventListener('keydown', e => { if (e.key === 'Enter') getKey(); });
document.getElementById('mainBtn').addEventListener('click', getKey);

async function getKey() {
  const txId = document.getElementById('txInput').value.trim();
  if (!txId || txId.length < 5) {
    showResult('error', '❌', 'Invalid Session ID', 'Please paste the full Session ID from your PalmPay notification.');
    return;
  }
  setLoading(true);
  hideResult();
  try {
    const resp = await fetch(`${GAS_URL}?action=scrapeAndClaim&sessionId=${encodeURIComponent(txId)}`);
    if (!resp.ok) {
      let e = ''; try { const j = await resp.json(); e = j.detail || j.message || ''; } catch {}
      showResult('error', '🌐', 'Server Error', `Server error (HTTP ${resp.status}). ${e} Please try again.`);
      return;
    }
    handleResponse(await resp.json(), txId);
  } catch (err) {
    showResult('error', '🌐', 'Connection Failed', 'Could not reach the server. Check your connection and try again. Error: ' + (err.message || ''));
  } finally {
    setLoading(false);
  }
}

function handleResponse(data, txId) {
  if (data.status !== 'ok') {
    const msgs = {
      already_claimed: ['warning', '⚠️', 'Already Used', 'This Session ID has already been used. Each payment can only be claimed once.'],
      not_found:       ['error',   '⏳', 'Payment Not Found', `Session ID <strong>${esc(txId)}</strong> was not found. If you just transferred, wait 1–2 minutes and try again.`],
      no_keys_available:['error',  '😔', 'No Keys Available', 'Your payment is confirmed but keys are temporarily out. Contact admin — a key will be sent shortly.'],
      invalid_txid:    ['error',   '❌', 'Invalid Session ID', 'Please copy the Session ID directly from your PalmPay notification.'],
    };
    const m = msgs[data.message] || ['error', '❌', 'Error', data.message || 'Something went wrong. Please try again.'];
    showResult(...m);
    return;
  }

  if (data.eligible === false) {
    if (data.sender || data.amount) showPayerStrip(data.sender, data.amount, false);
    showResult('warning', '⚠️', 'Insufficient Payment', 'This payment is below the required <strong>₦2,000</strong>. No activation key will be issued.');
    return;
  }

  // Success — go to page 4
  const keys = data.keys || [];
  goToKeyPage(keys, data.sender, data.amount);
}

function goToKeyPage(keys, sender, amount) {
  // Fill payer strip
  if (sender || amount) {
    document.getElementById('page4PayerStrip').style.display = 'flex';
    document.getElementById('page4Name').textContent   = sender || 'Unknown';
    document.getElementById('page4Amount').textContent = amount ? '₦' + fmt(amount) : '—';
  }

  // Render keys
  const list = document.getElementById('keysList');
  list.innerHTML = keys.map((k, i) => `
    <div class="key-card">
      <div class="key-card-top">
        <div class="key-index">${i + 1}</div>
        <div class="key-card-label">Activation Key</div>
      </div>
      <div class="key-value">${esc(k)}</div>
      <div class="key-actions">
        <button class="key-copy-btn" data-key="${escAttr(k)}">${ICON_COPY} Copy Key</button>
        <a class="wa-btn" href="${buildWaUrl(k)}" target="_blank" rel="noopener">${ICON_WA} WhatsApp</a>
      </div>
    </div>
  `).join('');

  list.querySelectorAll('.key-copy-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      navigator.clipboard.writeText(this.dataset.key).then(() => {
        this.innerHTML = `${ICON_CHECK} Used`;
        this.classList.add('done');
        this.disabled = true;
        this.style.cursor = 'default';
      });
    });
  });

  showPage(4);
}

function goRetrieve() {
  document.getElementById('txInput').value = '';
  hideResult();
  showPage(3);
}

/* ── Payer strip (page 3) ── */
function showPayerStrip(name, amount, eligible) {
  document.getElementById('payerStrip').style.display = 'flex';
  document.getElementById('payerName').textContent = name || 'Unknown';
  const el = document.getElementById('payerAmount');
  el.textContent = amount !== undefined ? '₦' + fmt(amount) : '—';
  el.className   = 'payer-cell-value is-amount' + (eligible ? '' : ' is-low');
}

/* ── UI helpers ── */
function showResult(type, icon, title, msg) {
  const box = document.getElementById('resultBox');
  box.className = `result-box ${type} show`;
  document.getElementById('rIcon').textContent  = icon;
  document.getElementById('rTitle').textContent = title;
  document.getElementById('rMsg').innerHTML     = msg;
  box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideResult() {
  document.getElementById('resultBox').className = 'result-box';
  document.getElementById('payerStrip').style.display = 'none';
}

function setLoading(on) {
  document.getElementById('mainBtn').disabled      = on;
  document.getElementById('spinner').style.display = on ? 'block' : 'none';
  document.getElementById('btnLabel').textContent  = on ? 'Checking…' : 'Get Activation Key';
  document.getElementById('txInput').disabled      = on;
}

function buildWaUrl(key) {
  const msg = `🎓 *ExamDriller Activation Key*\n\nYour key: *${key}*\n\nTo activate: Open ExamDriller → tap *Enter Code* → paste your key.\n\nPowered by Maxh Technologies`;
  return `https://wa.me/?text=${encodeURIComponent(msg)}`;
}

function fmt(n)     { return Number(n).toLocaleString('en-NG'); }
function esc(s)     { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
function escAttr(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
</script>
</body>
</html>
