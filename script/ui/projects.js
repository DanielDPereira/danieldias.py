import { openProjectModal } from './modal.js';
import { safeText } from '../utils/text.js';

function buildProjectCard(project, index) {
  const technologies = Array.isArray(project.technologies)
    ? project.technologies.slice(0, 3).map((tech) => `<span class="chip">${safeText(tech)}</span>`).join('')
    : '';

  return `
    <article class="project-card" data-project-index="${index}">
      <img src="${safeText(project.thumbnail)}" alt="Thumbnail do projeto ${safeText(project.title)}" loading="lazy">
      <div class="project-body">
        <p class="project-meta">${safeText(project.category)} • ${safeText(project.year)}</p>
        <h3>${safeText(project.title)}</h3>
        <p>${safeText(project.description)}</p>
        <div class="chip-list">${technologies}</div>
      </div>
      <button class="btn btn-ghost project-open" data-project-index="${index}">Ver detalhes</button>
    </article>
  `;
}

function normalizeValue(value) {
  return safeText(value).toLowerCase();
}

function extractUniqueValues(projects, field) {
  const values = projects
    .map((project) => safeText(project[field]).trim())
    .filter(Boolean);

  return [...new Set(values)].sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

function extractUniqueTechnologies(projects) {
  const values = projects.flatMap((project) => {
    if (!Array.isArray(project.technologies)) return [];
    return project.technologies.map((technology) => safeText(technology).trim());
  }).filter(Boolean);

  return [...new Set(values)].sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

function buildOptions(values, allLabel) {
  const options = [`<option value="">${allLabel}</option>`];
  values.forEach((value) => {
    options.push(`<option value="${safeText(value)}">${safeText(value)}</option>`);
  });

  return options.join('');
}

function ensureFilterControls(container, categoryOptions, technologyOptions) {
  const sectionCard = container.closest('.section-card');
  if (!(sectionCard instanceof HTMLElement)) return null;

  const existing = sectionCard.querySelector('.projects-filters');
  if (existing instanceof HTMLElement) return existing;

  const filters = document.createElement('div');
  filters.className = 'projects-filters';
  filters.innerHTML = `
    <label class="projects-filter-field projects-filter-search" for="project-search-input">
      <span>Buscar projeto</span>
      <input id="project-search-input" type="search" placeholder="Ex: Python, IA, dashboard..." autocomplete="off">
    </label>

    <label class="projects-filter-field" for="project-category-select">
      <span>Categoria</span>
      <select id="project-category-select">
        ${buildOptions(categoryOptions, 'Todas as categorias')}
      </select>
    </label>

    <label class="projects-filter-field" for="project-technology-select">
      <span>Tecnologia</span>
      <select id="project-technology-select">
        ${buildOptions(technologyOptions, 'Todas as tecnologias')}
      </select>
    </label>

    <button type="button" class="btn btn-ghost projects-filter-reset" id="project-filter-reset">
      Limpar
    </button>

    <p class="projects-filter-results" id="projects-filter-results" aria-live="polite"></p>
  `;

  sectionCard.insertBefore(filters, container);
  return filters;
}

export function renderProjects(projects) {
  const container = document.getElementById('projects-grid');
  if (!container || !Array.isArray(projects)) return;

  const categoryOptions = extractUniqueValues(projects, 'category');
  const technologyOptions = extractUniqueTechnologies(projects);
  const filters = ensureFilterControls(container, categoryOptions, technologyOptions);

  const searchInput = filters?.querySelector('#project-search-input');
  const categorySelect = filters?.querySelector('#project-category-select');
  const technologySelect = filters?.querySelector('#project-technology-select');
  const resetButton = filters?.querySelector('#project-filter-reset');
  const resultsText = filters?.querySelector('#projects-filter-results');

  const renderFilteredProjects = () => {
    const searchTerm = normalizeValue(searchInput instanceof HTMLInputElement ? searchInput.value : '');
    const selectedCategory = normalizeValue(categorySelect instanceof HTMLSelectElement ? categorySelect.value : '');
    const selectedTechnology = normalizeValue(technologySelect instanceof HTMLSelectElement ? technologySelect.value : '');

    const filteredProjects = projects
      .map((project, index) => ({ project, index }))
      .filter(({ project }) => {
        const title = normalizeValue(project.title);
        const description = normalizeValue(project.description);
        const longDescription = normalizeValue(project.longDescription);
        const category = normalizeValue(project.category);
        const year = normalizeValue(project.year);
        const status = normalizeValue(project.status);
        const technologies = Array.isArray(project.technologies)
          ? project.technologies.map((technology) => normalizeValue(technology))
          : [];

        const matchesSearch = !searchTerm
          || title.includes(searchTerm)
          || description.includes(searchTerm)
          || longDescription.includes(searchTerm)
          || category.includes(searchTerm)
          || year.includes(searchTerm)
          || status.includes(searchTerm)
          || technologies.some((technology) => technology.includes(searchTerm));

        const matchesCategory = !selectedCategory || category === selectedCategory;
        const matchesTechnology = !selectedTechnology || technologies.includes(selectedTechnology);

        return matchesSearch && matchesCategory && matchesTechnology;
      });

    if (!filteredProjects.length) {
      container.innerHTML = '<p class="projects-empty">Nenhum projeto encontrado com os filtros selecionados.</p>';
    } else {
      container.innerHTML = filteredProjects
        .map(({ project, index }) => buildProjectCard(project, index))
        .join('');
    }

    if (resultsText instanceof HTMLElement) {
      const total = projects.length;
      const count = filteredProjects.length;
      resultsText.textContent = `${count} de ${total} projetos exibidos`;
    }
  };

  renderFilteredProjects();

  if (searchInput instanceof HTMLInputElement) {
    searchInput.addEventListener('input', renderFilteredProjects);
  }

  if (categorySelect instanceof HTMLSelectElement) {
    categorySelect.addEventListener('change', renderFilteredProjects);
  }

  if (technologySelect instanceof HTMLSelectElement) {
    technologySelect.addEventListener('change', renderFilteredProjects);
  }

  if (resetButton instanceof HTMLButtonElement) {
    resetButton.addEventListener('click', () => {
      if (searchInput instanceof HTMLInputElement) searchInput.value = '';
      if (categorySelect instanceof HTMLSelectElement) categorySelect.value = '';
      if (technologySelect instanceof HTMLSelectElement) technologySelect.value = '';
      renderFilteredProjects();
    });
  }

  container.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const trigger = target.closest('[data-project-index]');
    if (!(trigger instanceof HTMLElement)) return;

    const index = Number(trigger.dataset.projectIndex);
    const selectedProject = projects[index];
    if (selectedProject) {
      openProjectModal(selectedProject);
    }
  });
}
