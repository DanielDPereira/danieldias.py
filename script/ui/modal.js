import { createProjectLinkButton } from '../utils/links.js';
import { safeText } from '../utils/text.js';

let currentProject = null;
let currentSlide = 0;

function getCurrentProjectImages() {
  if (!currentProject) return [];
  return Array.isArray(currentProject.images) && currentProject.images.length
    ? currentProject.images
    : [currentProject.thumbnail];
}

function updateSlider() {
  if (!currentProject) return;

  const slider = document.getElementById('modal-slider');
  if (!slider) return;

  const images = getCurrentProjectImages();

  const imageSlides = images
    .map(
      (image, index) => `
        <div class="slide ${index === currentSlide ? 'active' : ''}">
          <img src="${safeText(image)}" alt="Imagem ${index + 1} do projeto ${safeText(currentProject.title)}">
        </div>
      `
    )
    .join('');

  const controls = images.length > 1
    ? `
      <button class="slider-btn prev" id="slide-prev" aria-label="Imagem anterior"><i class="ri-arrow-left-s-line"></i></button>
      <button class="slider-btn next" id="slide-next" aria-label="Próxima imagem"><i class="ri-arrow-right-s-line"></i></button>
      <div class="slider-dots" id="slider-dots">
        ${images
          .map(
            (_, index) =>
              `<button class="dot ${index === currentSlide ? 'active' : ''}" data-slide-index="${index}" aria-label="Ir para imagem ${index + 1}"></button>`
          )
          .join('')}
      </div>
    `
    : '';

  slider.innerHTML = `<div class="slides-wrap">${imageSlides}</div>${controls}`;

  const previousButton = document.getElementById('slide-prev');
  const nextButton = document.getElementById('slide-next');
  const dots = slider.querySelectorAll('[data-slide-index]');

  if (previousButton) {
    previousButton.addEventListener('click', () => moveSlide(-1));
  }

  if (nextButton) {
    nextButton.addEventListener('click', () => moveSlide(1));
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      currentSlide = Number(dot.getAttribute('data-slide-index'));
      updateSlider();
    });
  });
}

export function moveSlide(direction) {
  const images = getCurrentProjectImages();
  if (images.length <= 1) return;

  currentSlide = (currentSlide + direction + images.length) % images.length;
  updateSlider();
}

export function hasMultipleSlides() {
  return getCurrentProjectImages().length > 1;
}

export function isModalOpen() {
  return currentProject !== null;
}

export function openProjectModal(project) {
  if (!project) return;
  currentProject = project;
  currentSlide = 0;

  const modal = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDescription = document.getElementById('modal-description');
  const modalTech = document.getElementById('modal-tech');
  const modalMeta = document.getElementById('modal-meta');
  const modalLinks = document.getElementById('modal-links');

  if (!modal || !modalTitle || !modalDescription || !modalTech || !modalMeta || !modalLinks) return;

  modalTitle.textContent = safeText(project.title);
  modalDescription.textContent = safeText(project.longDescription || project.description);
  modalMeta.textContent = `${safeText(project.category)} • ${safeText(project.year)} • ${safeText(project.status)}`;

  modalTech.innerHTML = Array.isArray(project.technologies)
    ? project.technologies.map((tech) => `<span class="chip">${safeText(tech)}</span>`).join('')
    : '';

  modalLinks.innerHTML = Array.isArray(project.links)
    ? project.links.map((link) => createProjectLinkButton(link)).join('')
    : '';

  updateSlider();

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

export function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  if (!modal) return;

  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  currentProject = null;
  currentSlide = 0;
}
