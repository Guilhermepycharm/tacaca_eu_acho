const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const heroBg = document.getElementById('hero-bg');
const nav = document.getElementById('nav');
const backToTop = document.getElementById('back-to-top');
const scrollProgress = document.getElementById('scroll-progress');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let scrollScheduled = false;

const NAV_SCROLL_THRESHOLD = 50;
const BACK_TO_TOP_THRESHOLD = 600;
const QUIZ_ADVANCE_DELAY = 800;

function handleScroll() {
  if (scrollScheduled) return;
  scrollScheduled = true;

  requestAnimationFrame(() => {
    const scrollY = window.scrollY;

    if (heroBg && !prefersReducedMotion && scrollY < window.innerHeight) {
      heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
    }

    if (nav) {
      nav.classList.toggle('scrolled', scrollY > NAV_SCROLL_THRESHOLD);
    }

    if (backToTop) {
      backToTop.classList.toggle('visible', scrollY > BACK_TO_TOP_THRESHOLD);
    }

    if (scrollProgress) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.style.width = docHeight > 0 ? `${(scrollY / docHeight) * 100}%` : '0%';
    }

    scrollScheduled = false;
  });
}

window.addEventListener('scroll', handleScroll, { passive: true });

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// menu mobile
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

if (navToggle && navLinks) {
  function closeMenu() {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', e => {
    if (navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !navToggle.contains(e.target)) {
      closeMenu();
    }
  });
}

// seção ativa no nav
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav__links a');
const SECTION_OBSERVER_THRESHOLD = 0.3;

if (sections.length && navLinksAll.length) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinksAll.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { threshold: SECTION_OBSERVER_THRESHOLD });
  sections.forEach(s => sectionObserver.observe(s));
}

// quiz
const quizContainer = document.getElementById('quiz-container');

if (quizContainer) {
  const questions = quizContainer.querySelectorAll('.quiz__question');
  const quizResult = document.getElementById('quiz-result');
  const restartBtn = document.getElementById('quiz-restart');
  const currentEl = document.getElementById('quiz-current');
  let current = 0;
  let score = 0;

  const optionsByQuestion = Array.from(questions).map(q =>
    q.querySelectorAll('.quiz__option')
  );

  function showQuestion(index) {
    questions.forEach(q => q.classList.remove('active'));
    questions[index].classList.add('active');
    if (currentEl) currentEl.textContent = index + 1;
  }

  function showResult() {
    questions.forEach(q => q.classList.remove('active'));
    const total = questions.length;
    const pct = score / total;

    quizResult.querySelector('.quiz__score').textContent = `${score}/${total}`;

    const msgEl = quizResult.querySelector('.quiz__message');
    if (pct === 1) {
      msgEl.textContent = 'Perfeito! Você é um expert em tacacá!';
    } else if (pct >= 0.6) {
      msgEl.textContent = 'Mandou bem! Conhece bastante sobre tacacá.';
    } else {
      msgEl.textContent = 'Pode aprender mais! Leia as seções acima.';
    }

    quizResult.hidden = false;
  }

  questions.forEach((q, qi) => {
    const answer = parseInt(q.dataset.answer, 10);
    const options = optionsByQuestion[qi];

    options.forEach(btn => {
      btn.addEventListener('click', () => {
        const picked = parseInt(btn.dataset.option, 10);

        options.forEach(o => { o.disabled = true; });
        options[answer].classList.add('correct');
        if (picked !== answer) {
          btn.classList.add('wrong');
        } else {
          score++;
        }

        setTimeout(() => {
          current++;
          if (current < questions.length) {
            showQuestion(current);
          } else {
            showResult();
          }
        }, QUIZ_ADVANCE_DELAY);
      });
    });
  });

  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      current = 0;
      score = 0;
      quizResult.hidden = true;

      optionsByQuestion.forEach(options => {
        options.forEach(btn => {
          btn.disabled = false;
          btn.classList.remove('correct', 'wrong');
        });
      });

      showQuestion(0);
    });
  }
}
