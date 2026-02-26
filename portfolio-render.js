(function () {
  const DATA_FILE = './portfolio-data.json';

  let currentProject = null;
  let currentSlide = 0;

  const safeText = (value) => (value ?? '').toString();

  function createExternalLink(url, label, className = '') {
    if (!url || url === '#') {
      return `<span class="disabled-link ${className}">${safeText(label)}</span>`;
    }

    return `<a href="${safeText(url)}" target="_blank" rel="noopener noreferrer" class="${className}">${safeText(label)}</a>`;
  }

  function renderProfile(profile) {
    if (!profile) return;

    const heroEyebrow = document.getElementById('hero-eyebrow');
    const heroTitle = document.getElementById('hero-title');
    const heroDescription = document.getElementById('hero-description');
    const brandName = document.getElementById('brand-name');
    const heroActions = document.getElementById('hero-actions');
    const socialsList = document.getElementById('socials-list');
    const statsGrid = document.getElementById('stats-grid');
    const contactActions = document.getElementById('contact-actions');
    const contactMessage = document.getElementById('contact-message');
    const footerText = document.getElementById('footer-text');
    const footerSocials = document.getElementById('footer-socials');

    if (brandName) brandName.textContent = safeText(profile.name);
    if (heroEyebrow) heroEyebrow.textContent = safeText(profile.heroEyebrow);
    if (heroTitle) heroTitle.textContent = safeText(profile.heroTitle || profile.name);
    if (heroDescription) heroDescription.textContent = safeText(profile.heroDescription);
    if (contactMessage) contactMessage.textContent = safeText(profile.contactMessage);
    if (footerText) footerText.textContent = safeText(profile.footerText);

    const ctaButtons = Array.isArray(profile.cta)
      ? profile.cta
          .map((button) => {
            const typeClass = button.type === 'ghost' ? 'btn btn-ghost' : 'btn btn-primary';
            const target = button.url?.startsWith('#') ? '' : 'target="_blank" rel="noopener noreferrer"';
            return `<a href="${safeText(button.url)}" class="${typeClass}" ${target}>${safeText(button.label)}</a>`;
          })
          .join('')
      : '';

    if (heroActions) heroActions.innerHTML = ctaButtons;

    const socialButtons = Array.isArray(profile.socials)
      ? profile.socials
          .map(
            (social) =>
              `<a href="${safeText(social.url)}" target="_blank" rel="noopener noreferrer" aria-label="${safeText(social.label)}"><i class="${safeText(social.icon)}"></i></a>`
          )
          .join('')
      : '';

    if (socialsList) socialsList.innerHTML = socialButtons;
    if (footerSocials) footerSocials.innerHTML = socialButtons;

    if (statsGrid && Array.isArray(profile.stats)) {
      statsGrid.innerHTML = profile.stats
        .map(
          (stat) => `
            <article class="stat-card">
              <strong>${safeText(stat.value)}</strong>
              <span>${safeText(stat.label)}</span>
            </article>
          `
        )
        .join('');
    }

    const contactButtons = [
      profile.email
        ? `<a class="btn btn-primary" href="mailto:${safeText(profile.email)}"><i class="ri-mail-send-line"></i> Enviar e-mail</a>`
        : '',
      profile.cvUrl
        ? `<a class="btn btn-ghost" href="${safeText(profile.cvUrl)}" target="_blank" rel="noopener noreferrer"><i class="ri-file-download-line"></i> Baixar CV</a>`
        : ''
    ].join('');

    if (contactActions) contactActions.innerHTML = contactButtons;
  }

  function renderAbout(about) {
    const container = document.getElementById('about-content');
    if (!container || !about) return;

    const paragraphs = Array.isArray(about.paragraphs)
      ? about.paragraphs.map((text) => `<p>${safeText(text)}</p>`).join('')
      : '';

    const highlights = Array.isArray(about.highlights)
      ? `
        <div class="chip-list">
          ${about.highlights.map((item) => `<span class="chip">${safeText(item)}</span>`).join('')}
        </div>
      `
      : '';

    container.innerHTML = `
      <p class="lead">${safeText(about.greeting)}</p>
      ${paragraphs}
      ${highlights}
    `;
  }

  function renderExperiences(experiences) {
    const container = document.getElementById('experience-list');
    if (!container || !Array.isArray(experiences)) return;

    container.innerHTML = experiences
      .map((item) => {
        const achievements = Array.isArray(item.achievements)
          ? item.achievements.map((achievement) => `<li>${safeText(achievement)}</li>`).join('')
          : '';

        const technologies = Array.isArray(item.technologies)
          ? item.technologies.map((tech) => `<span class="chip">${safeText(tech)}</span>`).join('')
          : '';

        return `
          <article class="timeline-item">
            <header>
              <h3>${safeText(item.title)}</h3>
              <p class="muted">${safeText(item.period)} • ${safeText(item.type)} • ${safeText(item.location)}</p>
              ${createExternalLink(item.companyUrl, item.company, 'company-link')}
            </header>
            <p>${safeText(item.description)}</p>
            <ul class="achievements">${achievements}</ul>
            <div class="chip-list">${technologies}</div>
          </article>
        `;
      })
      .join('');
  }

  function renderEducation(education) {
    const container = document.getElementById('education-list');
    if (!container || !Array.isArray(education)) return;

    container.innerHTML = education
      .map((item) => {
        const details = Array.isArray(item.details)
          ? item.details.map((detail) => `<li>${safeText(detail)}</li>`).join('')
          : '';

        return `
          <article class="education-item">
            <header>
              <h3 class="education-degree">${safeText(item.degree)}</h3>
              <p class="education-institution muted">${safeText(item.institution)}</p>
              <p class="muted">${safeText(item.period)}</p>
              <p class="muted">${safeText(item.type)}${item.issuer ? ` • ${safeText(item.issuer)}` : ''}</p>
            </header>
            <p>${safeText(item.description)}</p>
            ${details ? `<ul class="achievements">${details}</ul>` : ''}
          </article>
        `;
      })
      .join('');
  }

  function renderSkills(skills) {
    const container = document.getElementById('skills-grid');
    if (!container || !Array.isArray(skills)) return;

    container.innerHTML = skills
      .map(
        (item) => `
          <article class="skill-card">
            <img src="${safeText(item.icon)}" alt="${safeText(item.alt)}" loading="lazy">
            <h3>${safeText(item.name)}</h3>
            <p>${safeText(item.category || 'Tecnologia')}</p>
          </article>
        `
      )
      .join('');
  }

  function renderCertificates(certificates) {
    const container = document.getElementById('certificates-list');
    if (!container || !Array.isArray(certificates)) return;

    container.innerHTML = certificates
      .map(
        (item) => `
          <li>
            ${createExternalLink(item.url, item.title, 'certificate-link')}
          </li>
        `
      )
      .join('');
  }

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

  function renderProjects(projects) {
    const container = document.getElementById('projects-grid');
    if (!container || !Array.isArray(projects)) return;

    container.innerHTML = projects.map((project, index) => buildProjectCard(project, index)).join('');

    container.querySelectorAll('[data-project-index]').forEach((item) => {
      item.addEventListener('click', (event) => {
        const index = Number(event.currentTarget.getAttribute('data-project-index'));
        openProjectModal(projects[index]);
      });
    });
  }

  function updateSlider() {
    if (!currentProject) return;

    const slider = document.getElementById('modal-slider');
    if (!slider) return;

    const images = Array.isArray(currentProject.images) && currentProject.images.length
      ? currentProject.images
      : [currentProject.thumbnail];

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
      previousButton.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + images.length) % images.length;
        updateSlider();
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % images.length;
        updateSlider();
      });
    }

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        currentSlide = Number(dot.getAttribute('data-slide-index'));
        updateSlider();
      });
    });
  }

  function openProjectModal(project) {
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
      ? project.links
          .map((link) => createExternalLink(link.url, link.label, 'btn btn-primary'))
          .join('')
      : '';

    updateSlider();

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    if (!modal) return;

    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    currentProject = null;
    currentSlide = 0;
  }

  function attachGlobalEvents() {
    const modal = document.getElementById('project-modal');
    const closeButton = document.getElementById('modal-close');
    const menuButton = document.getElementById('menu-btn');
    const siteNav = document.getElementById('site-nav');

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

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeProjectModal();
      }

      if (!currentProject) return;

      const images = Array.isArray(currentProject.images) && currentProject.images.length
        ? currentProject.images
        : [currentProject.thumbnail];

      if (event.key === 'ArrowLeft' && images.length > 1) {
        currentSlide = (currentSlide - 1 + images.length) % images.length;
        updateSlider();
      }

      if (event.key === 'ArrowRight' && images.length > 1) {
        currentSlide = (currentSlide + 1) % images.length;
        updateSlider();
      }
    });

    if (menuButton && siteNav) {
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
  }

  async function loadPortfolioData() {
    try {
      const response = await fetch(DATA_FILE);
      if (!response.ok) {
        throw new Error(`Erro ao carregar JSON: ${response.status}`);
      }

      const data = await response.json();

      renderProfile(data.profile);
      renderAbout(data.about);
      renderEducation(data.education);
      renderExperiences(data.experiences);
      renderSkills(data.skills);
      renderProjects(data.projects);
      renderCertificates(data.certificates);
      attachGlobalEvents();
    } catch (error) {
      console.error('Falha ao carregar dados do portfólio:', error);
    }
  }

  document.addEventListener('DOMContentLoaded', loadPortfolioData);
})();
