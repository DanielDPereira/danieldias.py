export function applyRevealAttributes() {
  const immediateTargets = [
    { selector: '.hero-content', direction: 'left', baseDelay: 60 },
    { selector: '.hero-side', direction: 'right', baseDelay: 140 },
    { selector: '#sobre .section-card', direction: 'left', baseDelay: 40 },
    { selector: '#formacao .section-card', direction: 'right', baseDelay: 40 },
    { selector: '#experiencias .section-card', direction: 'left', baseDelay: 40 },
    { selector: '#skills .section-card', direction: 'right', baseDelay: 40 },
    { selector: '#projetos .section-card', direction: 'left', baseDelay: 40 },
    { selector: '#certificados .section-card', direction: 'right', baseDelay: 40 },
    { selector: '#contato .section-card', direction: 'left', baseDelay: 40 }
  ];

  immediateTargets.forEach(({ selector, direction, baseDelay }) => {
    const element = document.querySelector(selector);
    if (!element) return;
    element.dataset.reveal = direction;
    element.style.setProperty('--reveal-delay', `${baseDelay}ms`);
  });

  const staggerTargets = [
    '.stat-card',
    '.education-item',
    '.timeline-item',
    '.skill-card',
    '.project-card',
    '.certificates-list li',
    '.contact-actions .btn'
  ];

  staggerTargets.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.dataset.reveal = 'up';
      const delay = Math.min(index * 90, 600);
      element.style.setProperty('--reveal-delay', `${delay}ms`);
    });
  });
}

export function initScrollReveal() {
  const revealElements = Array.from(document.querySelectorAll('[data-reveal]'));
  if (!revealElements.length) return;

  const supportsMatchMedia = typeof window.matchMedia === 'function';
  const reducedMotion = supportsMatchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const supportsIntersectionObserver = typeof window.IntersectionObserver === 'function';

  if (reducedMotion || !supportsIntersectionObserver) {
    revealElements.forEach((element) => element.classList.add('revealed'));
    return;
  }

  document.documentElement.classList.add('reveal-enabled');
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      });
    },
    {
      root: null,
      threshold: 0.02,
      rootMargin: '0px 0px -4% 0px'
    }
  );

  revealElements.forEach((element) => {
    const elementHeight = element.getBoundingClientRect().height;
    const isVeryTallElement = elementHeight > viewportHeight * 1.6;

    if (isVeryTallElement) {
      element.classList.add('revealed');
      return;
    }

    revealObserver.observe(element);
  });

  window.setTimeout(() => {
    revealElements.forEach((element) => {
      if (!element.classList.contains('revealed')) {
        element.classList.add('revealed');
      }
    });
  }, 1800);
}
