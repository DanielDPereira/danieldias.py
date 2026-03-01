import { renderAbout } from './ui/about.js';
import { renderCertificates } from './ui/certificates.js';
import { renderEducation } from './ui/education.js';
import { attachGlobalEvents } from './ui/events.js';
import { renderExperiences } from './ui/experiences.js';
import { renderProfile } from './ui/profile.js';
import { renderProjects } from './ui/projects.js';
import { applyRevealAttributes, initScrollReveal } from './ui/reveal.js';
import { renderSkills } from './ui/skills.js';
import { loadPortfolioData } from './services/portfolio-data-service.js';

async function bootstrapPortfolio() {
  try {
    const data = await loadPortfolioData();

    renderProfile(data.profile);
    renderAbout(data.about);
    renderEducation(data.education);
    renderExperiences(data.experiences);
    renderSkills(data.skills);
    renderProjects(data.projects);
    renderCertificates(data.certificates);
    applyRevealAttributes();
    initScrollReveal();
    attachGlobalEvents();
  } catch (error) {
    console.error('Falha ao carregar dados do portfólio:', error);
  }
}

document.addEventListener('DOMContentLoaded', bootstrapPortfolio);
