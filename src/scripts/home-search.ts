import { slugify } from '../lib/slugify';

export function initHomeSearch(): void {
  const form = document.getElementById('home-search-form') as HTMLFormElement | null;
  const input = document.getElementById('home-search-input') as HTMLInputElement | null;
  const datalist = document.getElementById('home-search-options') as HTMLDataListElement | null;
  const feedback = document.getElementById('home-search-feedback');

  if (!form || !input || !datalist || !feedback) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const query = input.value.trim();
    if (query === '') return;

    const querySlug = slugify(query);
    const option = Array.from(datalist.options).find((opt) => slugify(opt.value) === querySlug);

    if (!option) {
      feedback.textContent = `Aucun résultat pour « ${query} ». Choisissez une suggestion dans la liste.`;
      feedback.hidden = false;
      return;
    }

    feedback.hidden = true;

    if (option.dataset.type === 'city' && option.dataset.slug) {
      window.location.href = `/cgp/par-ville/${option.dataset.slug}/`;
    } else if (option.dataset.type === 'department' && option.dataset.code) {
      window.location.href = `/cgp/par-departement/${option.dataset.code}/`;
    }
  });
}
