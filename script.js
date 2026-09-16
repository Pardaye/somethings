const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const floatingHearts = document.getElementById('floatingHearts');
const mainHeart = document.getElementById('mainHeart');
const finalMessage = document.getElementById('finalMessage');
const messageEls = [...document.querySelectorAll('[data-message]')];
const startTrigger = document.getElementById('startTrigger');
const messageStack = document.getElementById('messageStack');
const tapHint = document.getElementById('tapHint');

let experienceStarted = false;
let streamTimer = null;

function safeNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function createFloatingHeart(x = null) {
  if (!floatingHearts) return;

  const heart = document.createElement('span');
  heart.className = 'heart-particle';

  const size = safeNumber(14, 28);
  const duration = safeNumber(4.8, 9.5);
  const drift = safeNumber(-38, 38);
  const spin = safeNumber(-28, 28);

  heart.style.setProperty('--size', `${size}px`);
  heart.style.setProperty('--drift', `${drift}px`);
  heart.style.setProperty('--duration', `${duration}s`);
  heart.style.setProperty('--spin', `${spin}deg`);
  heart.style.left = `${x !== null ? x : safeNumber(8, 92)}%`;
  heart.style.bottom = '-6vh';

  floatingHearts.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, duration * 1000 + 150);
}

function createBurstAt(x, y) {
  if (!floatingHearts) return;

  const rect = document.body.getBoundingClientRect();
  const px = ((x - rect.left) / rect.width) * 100;
  const py = ((y - rect.top) / rect.height) * 100;

  for (let i = 0; i < 18; i += 1) {
    const heart = document.createElement('span');
    heart.className = 'heart-particle';

    const size = safeNumber(12, 26);
    const duration = safeNumber(1.1, 2.3);
    const driftX = safeNumber(-40, 40);
    const spin = safeNumber(-32, 32);

    heart.style.setProperty('--size', `${size}px`);
    heart.style.setProperty('--duration', `${duration}s`);
    heart.style.setProperty('--drift', `${driftX}px`);
    heart.style.setProperty('--spin', `${spin}deg`);
    heart.style.left = `${Math.max(6, Math.min(94, px + safeNumber(-10, 10)))}%`;
    heart.style.bottom = `${Math.max(18, Math.min(82, py + safeNumber(-14, 12)))}%`;
    heart.style.animation = `heartFloat ${duration}s ease-in forwards`;
    heart.style.opacity = '0';

    floatingHearts.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, duration * 1000 + 150);
  }
}

function showMessageSequence() {
  if (!messageEls.length) return;

  const [first, second] = messageEls;
  messageStack.classList.add('visible');

  setTimeout(() => {
    first.classList.add('visible');
  }, 200);

  setTimeout(() => {
    first.classList.remove('visible');
    second.classList.add('visible');
  }, 2500);
}

function typeWriter(element, text, speed = 80) {
  element.textContent = '';
  let i = 0;

  const caret = document.createElement('span');
  caret.className = 'caret';
  caret.textContent = '▌';

  const tick = () => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i += 1;
      setTimeout(tick, speed);
    } else {
      element.appendChild(caret);
    }
  };

  tick();
}

function revealFinalMessage() {
  const text = 'I Love You, Munisa ❤️';
  finalMessage.classList.add('visible');
  typeWriter(finalMessage, text, 90);
}

function startFloatingStream() {
  if (reducedMotion || !floatingHearts) return;

  if (streamTimer) {
    clearInterval(streamTimer);
  }

  const loop = () => {
    for (let i = 0; i < 2; i += 1) {
      createFloatingHeart();
    }
  };

  loop();
  streamTimer = setInterval(loop, 1200);
}

function startExperience() {
  if (experienceStarted) return;
  experienceStarted = true;

  const appShell = document.querySelector('.app-shell');
  if (appShell) {
    appShell.classList.add('is-started');
  }

  if (startTrigger) {
    startTrigger.classList.add('is-started');
    startTrigger.setAttribute('aria-label', 'Romantik animatsiya ishlayapti');
  }

  if (tapHint) {
    tapHint.style.display = 'none';
  }

  const rect = startTrigger.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  for (let i = 0; i < 20; i += 1) {
    setTimeout(() => {
      createBurstAt(centerX + safeNumber(-18, 18), centerY + safeNumber(-10, 18));
    }, i * 60);
  }

  startFloatingStream();
  showMessageSequence();

  setTimeout(() => {
    if (mainHeart) {
      mainHeart.style.animation = 'heartbeat 1.7s ease-in-out infinite';
      mainHeart.style.transform = 'rotate(-45deg) scale(1.04)';
    }
  }, 300);

  setTimeout(() => {
    revealFinalMessage();
  }, 9000);
}

if (startTrigger) {
  startTrigger.addEventListener('click', startExperience);
}

if (reducedMotion) {
  if (tapHint) tapHint.textContent = 'Yurakni bos';
}
