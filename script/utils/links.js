import { safeText } from './text.js';

export function createExternalLink(url, label, className = '') {
  if (!url || url === '#') {
    return `<span class="disabled-link ${className}">${safeText(label)}</span>`;
  }

  return `<a href="${safeText(url)}" target="_blank" rel="noopener noreferrer" class="${className}">${safeText(label)}</a>`;
}

function getProjectLinkIcon(label, url) {
  const normalizedLabel = safeText(label).toLowerCase();
  const normalizedUrl = safeText(url).toLowerCase();

  if (normalizedLabel.includes('reposit') || normalizedUrl.includes('github.com')) {
    return 'ri-github-fill';
  }

  if (normalizedLabel.includes('linkedin') || normalizedUrl.includes('linkedin.com')) {
    return 'ri-linkedin-box-fill';
  }

  return 'ri-external-link-line';
}

export function createProjectLinkButton(link) {
  const url = safeText(link?.url);
  const label = safeText(link?.label);
  const iconClass = getProjectLinkIcon(label, url);
  const content = `<i class="${iconClass}" aria-hidden="true"></i> ${label}`;

  if (!url || url === '#') {
    return `<span class="disabled-link btn btn-ghost project-link">${content}</span>`;
  }

  return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="btn btn-ghost project-link">${content}</a>`;
}
