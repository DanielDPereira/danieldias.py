import { safeText } from '../utils/text.js';

export function renderProfile(profile) {
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

  const linkedin = Array.isArray(profile.socials)
    ? profile.socials.find((social) => safeText(social.label).toLowerCase() === 'linkedin')
    : null;

  const contactButtons = [
    linkedin?.url
      ? `<a class="btn btn-primary" href="${safeText(linkedin.url)}" target="_blank" rel="noopener noreferrer"><i class="ri-linkedin-fill"></i> Conecte-se comigo!</a>`
      : '',
    profile.email
      ? `<a class="btn btn-ghost" href="mailto:${safeText(profile.email)}"><i class="ri-mail-send-line"></i> Enviar e-mail</a>`
      : ''
  ].join('');

  if (contactActions) contactActions.innerHTML = contactButtons;
}
