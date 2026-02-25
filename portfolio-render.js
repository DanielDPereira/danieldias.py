(function () {
  const DATA_FILE = './portfolio-data.json';

  const safeText = (value) => (value ?? '').toString();

  function renderExperiences(experiences) {
    const container = document.getElementById('experience-list');
    if (!container || !Array.isArray(experiences)) return;

    container.innerHTML = experiences
      .map(
        (item) => `
          <li>
            <p>
              ${safeText(item.title)}<br>
              <a href="${safeText(item.companyUrl)}" target="_blank">${safeText(item.company)}</a> - ${safeText(item.type)}<br>
              ${safeText(item.period)}
            </p>
          </li>
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
            <a href="${safeText(item.url)}" target="_blank">&bull; ${safeText(item.title)}</a>
          </li>
        `
      )
      .join('');
  }

  function renderSkills(skills) {
    const container = document.getElementById('skills-grid-dynamic');
    if (!container || !Array.isArray(skills)) return;

    container.innerHTML = skills
      .map(
        (item) => `
          <div class="skill-card">
            <img src="${safeText(item.icon)}" alt="${safeText(item.alt)}">
            <span>${safeText(item.name)}</span>
          </div>
        `
      )
      .join('');
  }

  function renderProjects(projects) {
    const container = document.getElementById('projects-grid-dynamic');
    if (!container || !Array.isArray(projects)) return;

    container.innerHTML = projects
      .map((project) => {
        const links = Array.isArray(project.links)
          ? project.links
              .map(
                (link) => `
                  <a href="${safeText(link.url)}" target="_blank">${safeText(link.label)}</a>
                `
              )
              .join('')
          : '';

        return `
          <div class="project-card">
            <img src="${safeText(project.thumbnail)}" alt="Thumbnail do projeto" class="project-thumb">
            <h3>${safeText(project.title)}</h3>
            <p>${safeText(project.description)}</p>
            <div class="project-links">
              ${links}
            </div>
          </div>
        `;
      })
      .join('');
  }

  async function loadPortfolioData() {
    try {
      const response = await fetch(DATA_FILE);
      if (!response.ok) {
        throw new Error(`Erro ao carregar JSON: ${response.status}`);
      }

      const data = await response.json();
      renderExperiences(data.experiences);
      renderCertificates(data.certificates);
      renderSkills(data.skills);
      renderProjects(data.projects);
    } catch (error) {
      console.error('Falha ao carregar dados do portfólio:', error);
    }
  }

  document.addEventListener('DOMContentLoaded', loadPortfolioData);
})();
