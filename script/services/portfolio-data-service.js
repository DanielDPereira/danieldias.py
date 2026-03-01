import { DATA_FILE } from '../config/constants.js';

export async function loadPortfolioData() {
  const response = await fetch(DATA_FILE);

  if (!response.ok) {
    throw new Error(`Erro ao carregar JSON: ${response.status}`);
  }

  return response.json();
}
