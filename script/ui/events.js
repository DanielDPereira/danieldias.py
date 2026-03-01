import { closeProjectModal, hasMultipleSlides, isModalOpen, moveSlide } from './modal.js';

function bindModalCloseEvents() {
  const modal = document.getElementById('project-modal');
  const closeButton = document.getElementById('modal-close');

  if (closeButton) {
    closeButton.addEventListener('click', closeProjectModal);
  }

  if (modal) {
    modal.addEventListener('click', (event) => {
      const target = event.target;
      if (target instanceof HTMLElement && target.dataset.closeModal === 'true') {
        closeProjectModal();
      }
    });
  }
}

function bindKeyboardEvents() {
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeProjectModal();
      return;
    }

    if (!isModalOpen() || !hasMultipleSlides()) return;

    if (event.key === 'ArrowLeft') {
      moveSlide(-1);
    }

    if (event.key === 'ArrowRight') {
      moveSlide(1);
    }
  });
}

function bindMobileMenuEvents() {
  const menuButton = document.getElementById('menu-btn');
  const siteNav = document.getElementById('site-nav');

  if (!menuButton || !siteNav) return;

  menuButton.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!expanded));
    siteNav.classList.toggle('open');
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

export function attachGlobalEvents() {
  bindModalCloseEvents();
  bindKeyboardEvents();
  bindMobileMenuEvents();
}
