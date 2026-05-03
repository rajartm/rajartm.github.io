// ===========================
// SCROLL PROGRESS BAR + NAV
// ===========================
const progressBar = document.getElementById('progress-bar');
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (scrolled / maxScroll * 100) + '%';
  navbar.classList.toggle('scrolled', scrolled > 20);
});

// ===========================
// SMOOTH SCROLL FOR NAV
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===========================
// SCROLL REVEAL
// ===========================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal, .reveal-delay').forEach(el => {
  revealObserver.observe(el);
});

// ===========================
// ANIMATED COUNTERS
// ===========================
function animateCounter(el, target, duration) {
  const start = performance.now();
  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  }
  requestAnimationFrame(tick);
}

const statsRow = document.querySelector('.stats-row');
let countersRun = false;
if (statsRow) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersRun) {
        countersRun = true;
        entry.target.querySelectorAll('.stat-num').forEach(el => {
          animateCounter(el, parseInt(el.dataset.target, 10), 1800);
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  statsObserver.observe(statsRow);
}

// ===========================
// MODALS
// ===========================
function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  // Focus the close button for accessibility
  modal.querySelector('.modal-close').focus();
}

function closeModal(modal) {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

// Open via card click
document.querySelectorAll('[data-modal]').forEach(card => {
  card.addEventListener('click', () => openModal(card.dataset.modal));
});

// Open contact modal via button
const openContactBtn = document.getElementById('open-contact-modal');
if (openContactBtn) {
  openContactBtn.addEventListener('click', () => openModal('modal-contact'));
}

// Close via backdrop click
document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal(modal);
  });
  modal.querySelector('.modal-close').addEventListener('click', () => closeModal(modal));
});

// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.open').forEach(m => closeModal(m));
  }
});
