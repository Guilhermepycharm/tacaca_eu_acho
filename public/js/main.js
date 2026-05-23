const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
);

revealElements.forEach((el) => revealObserver.observe(el));

const heroBg = document.getElementById('hero-bg');
const nav = document.getElementById('nav');
const backToTop = document.getElementById('back-to-top');
const scrollProgress = document.getElementById('scroll-progress');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let scrollScheduled = false;

function handleScroll() {
  if (!scrollScheduled) {
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;

      // para o parallax quando o hero saiu da tela
      if (heroBg && !prefersReducedMotion && scrollY < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
      }

      if (nav) {
        nav.classList.toggle('scrolled', scrollY > 50);
      }

      // back-to-top
      if (backToTop) {
        backToTop.classList.toggle('visible', scrollY > 600);
      }

      // scroll progress
      if (scrollProgress) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        scrollProgress.style.width = docHeight > 0 ? `${(scrollY / docHeight) * 100}%` : '0%';
      }

      scrollScheduled = false;
    });
    scrollScheduled = true;
  }
}

window.addEventListener('scroll', handleScroll, { passive: true });

// back-to-top click
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

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

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // fecha o menu se clicar fora
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !navToggle.contains(e.target)) {
      closeMenu();
    }
  });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const hash = anchor.getAttribute('href');
    if (hash === '#') return;

    const target = document.querySelector(hash);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// nav active section
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav__links a');
if (sections.length && navLinksAll.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinksAll.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { threshold: 0.3 });
  sections.forEach(s => sectionObserver.observe(s));
}

// quiz
(function() {
  const container = document.getElementById('quiz-container');
  if (!container) return;

  const questions = container.querySelectorAll('.quiz__question');
  const result = document.getElementById('quiz-result');
  const restartBtn = document.getElementById('quiz-restart');
  const currentEl = document.getElementById('quiz-current');
  let current = 0;
  let score = 0;

  function showQuestion(index) {
    questions.forEach(q => q.classList.remove('active'));
    questions[index].classList.add('active');
    if (currentEl) currentEl.textContent = index + 1;
  }

  function showResult() {
    questions.forEach(q => q.classList.remove('active'));
    const total = questions.length;
    const pct = score / total;
    const scoreEl = result.querySelector('.quiz__score');
    const msgEl = result.querySelector('.quiz__message');
    scoreEl.textContent = `${score}/${total}`;
    if (pct === 1) {
      msgEl.textContent = 'Perfeito! Você é um expert em tacacá!';
    } else if (pct >= 0.6) {
      msgEl.textContent = 'Mandou bem! Conhece bastante sobre tacacá.';
    } else {
      msgEl.textContent = 'Pode aprender mais! Leia as seções acima.';
    }
    result.hidden = false;
  }

  questions.forEach((q) => {
    const answer = parseInt(q.dataset.answer);
    const options = q.querySelectorAll('.quiz__option');
    options.forEach((btn) => {
      btn.addEventListener('click', () => {
        const picked = parseInt(btn.dataset.option);
        // disable all options
        options.forEach(o => o.disabled = true);
        // mark correct/wrong
        options[answer].classList.add('correct');
        if (picked !== answer) {
          btn.classList.add('wrong');
        } else {
          score++;
        }
        // next question after delay
        setTimeout(() => {
          current++;
          if (current < questions.length) {
            showQuestion(current);
          } else {
            showResult();
          }
        }, 800);
      });
    });
  });

  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      current = 0;
      score = 0;
      result.hidden = true;
      questions.forEach(q => {
        q.querySelectorAll('.quiz__option').forEach(btn => {
          btn.disabled = false;
          btn.classList.remove('correct', 'wrong');
        });
      });
      showQuestion(0);
    });
  }
})();
