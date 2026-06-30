const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

// Cinematic boot sequence
const bootCount = $('.boot-count');
const bootStart = performance.now();
const runBoot = now => {
  const progress = Math.min((now - bootStart) / 1600, 1);
  bootCount.textContent = `${String(Math.round(progress * 100)).padStart(3, '0')}%`;
  if (progress < 1) requestAnimationFrame(runBoot);
  else setTimeout(() => document.body.classList.add('booted'), 220);
};
if (matchMedia('(prefers-reduced-motion: reduce)').matches) document.body.classList.add('booted');
else requestAnimationFrame(runBoot);

// Live system clock
const clock = $('#clock');
const tick = () => {
  const now = new Date();
  clock.textContent = `${now.toLocaleTimeString('en-GB', {
    hour12: false,
    timeZone: 'Asia/Kolkata'
  })} IST`;
};
tick();
setInterval(tick, 1000);

// Mobile navigation
const menuToggle = $('.menu-toggle');
const nav = $('.nav');
menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
$$('.nav a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

// Switchable visual spectrum
const spectrumSwitch = $('.spectrum-switch');
let spectrum = 1;
spectrumSwitch.addEventListener('click', () => {
  document.body.classList.remove('spectrum-2', 'spectrum-3');
  spectrum = spectrum === 3 ? 1 : spectrum + 1;
  if (spectrum > 1) document.body.classList.add(`spectrum-${spectrum}`);
  spectrumSwitch.textContent = `SPECTRUM_0${spectrum}`;
  matrixColor = getComputedStyle(document.body).getPropertyValue('--acid').trim();
});

// Reveal and count-up effects
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    if (entry.target.classList.contains('stats-grid')) animateStats();
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });
$$('.reveal').forEach(el => observer.observe(el));

let statsDone = false;
function animateStats() {
  if (statsDone) return;
  statsDone = true;
  $$('[data-count]').forEach(el => {
    const end = Number(el.dataset.count);
    const start = performance.now();
    const duration = 1200;
    const decimals = Number(el.dataset.decimals || 0);
    const update = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = (end * eased).toFixed(progress === 1 ? decimals : 0);
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  });
}

// Active section in navigation
const sections = $$('section[id]');
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    $$('.nav a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-42% 0px -52%' });
sections.forEach(section => sectionObserver.observe(section));

// Custom cursor and magnetic call-to-action buttons
const dot = $('.cursor-dot');
const ring = $('.cursor-ring');
let mouseX = -100, mouseY = -100, ringX = -100, ringY = -100;
window.addEventListener('mousemove', event => {
  mouseX = event.clientX; mouseY = event.clientY;
  dot.style.left = `${mouseX}px`; dot.style.top = `${mouseY}px`;
});
const animateCursor = () => {
  ringX += (mouseX - ringX) * .16;
  ringY += (mouseY - ringY) * .16;
  ring.style.left = `${ringX}px`; ring.style.top = `${ringY}px`;
  requestAnimationFrame(animateCursor);
};
animateCursor();
$$('a, button, .case, input, .timeline-card').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// Holographic tilt on experience cards
$$('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', event => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    card.style.transform = `rotateX(${-y * 6}deg) rotateY(${x * 7}deg) translateZ(5px)`;
  });
  card.addEventListener('mouseleave', () => card.style.transform = '');
});

// Controlled glitch pulse and simulated packet telemetry
const glitch = $('.glitch');
setInterval(() => {
  glitch.classList.add('glitching');
  setTimeout(() => glitch.classList.remove('glitching'), 700);
}, 4200);
const packetCount = $('#packet-count');
let packets = 2481;
setInterval(() => {
  packets += Math.floor(Math.random() * 9) + 1;
  packetCount.textContent = String(packets).padStart(5, '0');
}, 1150);
$$('.magnetic').forEach(el => {
  el.addEventListener('mousemove', event => {
    const rect = el.getBoundingClientRect();
    el.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * .12}px, ${(event.clientY - rect.top - rect.height / 2) * .12}px)`;
  });
  el.addEventListener('mouseleave', () => el.style.transform = '');
});

// Ambient matrix field
const canvas = $('#matrix');
const ctx = canvas.getContext('2d');
let matrixColor = getComputedStyle(document.body).getPropertyValue('--acid').trim();
let columns = [];
function sizeCanvas() {
  const dpr = Math.min(devicePixelRatio, 2);
  canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
  canvas.style.width = `${innerWidth}px`; canvas.style.height = `${innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  columns = Array.from({ length: Math.ceil(innerWidth / 28) }, () => Math.random() * -50);
}
sizeCanvas();
window.addEventListener('resize', sizeCanvas);
function drawMatrix() {
  ctx.fillStyle = 'rgba(5,8,6,.12)'; ctx.fillRect(0, 0, innerWidth, innerHeight);
  ctx.fillStyle = matrixColor; ctx.font = '11px monospace';
  columns.forEach((y, i) => {
    ctx.fillText(Math.random() > .5 ? '1' : '0', i * 28, y * 18);
    columns[i] = y * 18 > innerHeight && Math.random() > .985 ? 0 : y + 1;
  });
  requestAnimationFrame(drawMatrix);
}
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) drawMatrix();

// Interactive terminal
const terminalForm = $('#terminal-form');
const terminalOutput = $('#terminal-output');
const commands = {
  help: '<span class="response">available: skills, education, projects, status, contact, clear</span>',
  skills: '<span class="response">python // c // java-basic // linux // windows // networking // nmap // burp-suite // wireshark</span>',
  education: '<span class="response">cyber security @ Supreme Institute of Management &amp; Technology // SGPA 7.95 // 2024-2028</span>',
  projects: '<span class="response">[01] antivirus signature scanner // [02] packet sniffer &amp; ARP spoof detector</span>',
  status: '<span class="response">security admin associate L1 intern @ Infotact Solutions // open to learning opportunities</span>',
  contact: '<span class="response">email: soumadeeppal33@gmail.com // github: souma2005-cys</span>'
};
terminalForm.addEventListener('submit', event => {
  event.preventDefault();
  const input = $('#command');
  const command = input.value.trim().toLowerCase();
  if (!command) return;
  const request = document.createElement('p');
  request.innerHTML = `<span class="prompt">visitor@blacksite:~$</span> ${command.replace(/[<>]/g, '')}`;
  terminalOutput.appendChild(request);
  if (command === 'clear') terminalOutput.innerHTML = '';
  else {
    const response = document.createElement('p');
    response.innerHTML = commands[command] || '<span class="response">command not found. type \'help\' to inspect available commands.</span>';
    terminalOutput.appendChild(response);
  }
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
  input.value = '';
});

// Project dossier modal
const caseDialog = $('#case-dialog');
const caseData = {
  '01': {
    title: 'BASIC ANTIVIRUS SIGNATURE SCANNER',
    summary: 'A Python-based antivirus simulation built to identify suspicious files with signature-based detection.',
    objective: 'Turn core malware-detection concepts into a working defensive utility.',
    method: 'Generate SHA-256 hashes, compare them against a malware signature database, scan files automatically, and isolate matches.',
    outcome: 'Implemented automated file scanning and quarantine behavior for suspicious files.'
  },
  '02': {
    title: 'PACKET SNIFFER & ARP SPOOF DETECTOR',
    summary: 'A real-time network monitoring tool for capturing packets and identifying suspicious ARP behavior.',
    objective: 'Improve network visibility and identify potential IP-to-MAC mapping manipulation.',
    method: 'Capture and analyze traffic, track IP-to-MAC address mappings, and compare changes over time.',
    outcome: 'Generated security alerts when suspicious ARP activity was detected.'
  },
  '03': {
    title: 'CYBER HYGIENE & AWARENESS PROGRAM',
    summary: 'A 120-hour experiential learning program in cyber hygiene and cyber awareness through MY Bharat.',
    objective: 'Build strong foundations in safe internet usage, digital protection, and responsible digital citizenship.',
    method: 'Studied phishing, malware, password security, online privacy, cybercrime prevention, and data protection.',
    outcome: 'Strengthened practical understanding of secure online behavior and information security fundamentals.'
  }
};
$$('.case').forEach(card => {
  const openCase = () => {
    const data = caseData[card.dataset.case];
    $('.dialog-index span').textContent = `00${card.dataset.case}`;
    $('.case-dialog h3').textContent = data.title;
    $('.dialog-summary').textContent = data.summary;
    $('.dialog-objective').textContent = data.objective;
    $('.dialog-method').textContent = data.method;
    $('.dialog-outcome').textContent = data.outcome;
    caseDialog.showModal();
  };
  card.addEventListener('click', openCase);
  card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') openCase(); });
});
$('.dialog-close').addEventListener('click', () => caseDialog.close());
caseDialog.addEventListener('click', event => { if (event.target === caseDialog) caseDialog.close(); });

// Copy email with graceful fallback
$('.copy-email').addEventListener('click', async event => {
  const email = event.currentTarget.dataset.email;
  try { await navigator.clipboard.writeText(email); }
  catch { window.location.href = `mailto:${email}`; return; }
  const toast = $('.toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
});
