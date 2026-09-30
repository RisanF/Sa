/* ==========================================
   main.js – ATHEEQ Technical Institute
========================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- NAVBAR SCROLL ---- */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  /* ---- HAMBURGER MENU ---- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  let overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  function openMenu() {
    navLinks && navLinks.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    navLinks && navLinks.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', openMenu);
  overlay.addEventListener('click', closeMenu);
  document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', closeMenu));

  /* ---- HERO SLIDER ---- */
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('#hero-dots .dot');
  let current = 0;
  let timer;

  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current] && dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current] && dots[current].classList.add('active');
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 5000);
  }

  if (slides.length) {
    const prevBtn = document.getElementById('hero-prev');
    const nextBtn = document.getElementById('hero-next');
    if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); startTimer(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); startTimer(); });
    dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); startTimer(); }));
    startTimer();
  }

  /* ---- SCROLL REVEAL ---- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('show'), i * 80);
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObs.observe(el));

  /* ---- ANIMATED COUNTERS ---- */
  const counters = document.querySelectorAll('.stat-number[data-target]');
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCount(e.target);
        counterObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObs.observe(c));

  function animateCount(el) {
    const target = +el.dataset.target;
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const update = () => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current).toLocaleString();
      if (current < target) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  /* ---- GALLERY SLIDER ---- */
  const track = document.getElementById('gallery-track');
  const galleryDots = document.querySelectorAll('#gallery-dots .dot');
  const galleryItems = document.querySelectorAll('.gallery-item');
  let gCurrent = 0;
  const visibleCount = window.innerWidth <= 600 ? 1 : window.innerWidth <= 900 ? 2 : 3;

  function updateGallery(idx) {
    idx = Math.max(0, Math.min(idx, galleryItems.length - visibleCount));
    gCurrent = idx;
    if (track) {
      const itemWidth = galleryItems[0] ? galleryItems[0].offsetWidth + 16 : 0;
      track.style.transform = `translateX(-${idx * itemWidth}px)`;
    }
    galleryDots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }

  const gPrev = document.getElementById('gallery-prev');
  const gNext = document.getElementById('gallery-next');
  if (gPrev) gPrev.addEventListener('click', () => updateGallery(gCurrent - 1));
  if (gNext) gNext.addEventListener('click', () => updateGallery(gCurrent + 1));
  galleryDots.forEach((d, i) => d.addEventListener('click', () => updateGallery(i)));

  /* ---- LIGHTBOX ---- */
  window.openLightbox = function (idx) {
    const lb = document.getElementById('lightbox');
    const lbContent = document.getElementById('lightbox-content');
    const items = document.querySelectorAll('.gallery-item');
    if (lb && lbContent && items[idx]) {
      lbContent.innerHTML = items[idx].innerHTML;
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };
  window.closeLightbox = function () {
    const lb = document.getElementById('lightbox');
    if (lb) lb.classList.remove('open');
    document.body.style.overflow = '';
  };

  /* ---- MULTI-TAB FORM LOGIC (Course, Repair, Tool) ---- */
  const formTabs = document.querySelectorAll('.form-tab');
  const formPanels = document.querySelectorAll('.form-panel');

  function switchTab(tabTarget) {
    if (!tabTarget) return;
    formTabs.forEach(tab => {
      const isActive = tab.getAttribute('data-tab') === tabTarget;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    formPanels.forEach(panel => {
      const isTarget = panel.id === `panel-${tabTarget}`;
      panel.classList.toggle('active', isTarget);
    });
  }

  if (formTabs.length) {
    formTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-tab');
        switchTab(target);
      });
    });

    // Auto-select tab based on URL parameters or hash
    const urlParams = new URLSearchParams(window.location.search);
    const typeParam = urlParams.get('type') || window.location.hash.replace('#', '');
    if (typeParam && ['course', 'repair', 'tool'].includes(typeParam)) {
      switchTab(typeParam);
    }
  }

  /* ---- TAB FORM SUBMISSIONS ---- */
  const formsToHandle = [
    { id: 'course-form', successId: 'course-form-success', defaultBtn: 'Submit Course Application' },
    { id: 'repair-form', successId: 'repair-form-success', defaultBtn: 'Submit Repair Request' },
    { id: 'tool-form', successId: 'tool-form-success', defaultBtn: 'Submit Tool Inquiry' }
  ];

  formsToHandle.forEach(f => {
    const formEl = document.getElementById(f.id);
    const successEl = document.getElementById(f.successId);
    if (formEl) {
      formEl.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = formEl.querySelector('.form-submit');
        if (btn) {
          btn.textContent = 'Submitting...';
          btn.disabled = true;
        }
        setTimeout(() => {
          formEl.reset();
          if (successEl) successEl.style.display = 'block';
          if (btn) {
            btn.textContent = f.defaultBtn;
            btn.disabled = false;
          }
          setTimeout(() => {
            if (successEl) successEl.style.display = 'none';
          }, 6000);
        }, 1000);
      });
    }
  });

  /* ---- ACTIVE NAV LINK ---- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === currentPage);
  });

});
