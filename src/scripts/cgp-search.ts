function normalizeForSearch(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

export function initCgpSearch(): void {
  const grid = document.getElementById('cgp-grid');
  const searchInput = document.getElementById('cgp-search-input') as HTMLInputElement | null;
  const departmentSelect = document.getElementById('cgp-department-select') as HTMLSelectElement | null;
  const citySelect = document.getElementById('cgp-city-select') as HTMLSelectElement | null;
  const resetButton = document.getElementById('cgp-reset-button') as HTMLButtonElement | null;
  const resultsCount = document.getElementById('cgp-results-count');
  const noResults = document.getElementById('cgp-no-results');

  if (!grid || !searchInput || !departmentSelect || !citySelect || !resetButton || !resultsCount) {
    return;
  }

  const cards = Array.from(grid.querySelectorAll<HTMLElement>('[data-search]'));

  function applyFilters(): void {
    const tokens = normalizeForSearch(searchInput!.value)
      .split(/\s+/)
      .filter((token) => token !== '');
    const department = departmentSelect!.value;
    const city = citySelect!.value;

    let visibleCount = 0;

    for (const card of cards) {
      const haystack = card.dataset.search ?? '';
      const matchesText = tokens.every((token) => haystack.includes(token));
      const matchesDepartment = department === '' || card.dataset.department === department;
      const matchesCity = city === '' || card.dataset.city === city;
      const isVisible = matchesText && matchesDepartment && matchesCity;

      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    }

    resultsCount!.textContent =
      visibleCount === 1 ? '1 CGP trouvé' : `${visibleCount} CGP trouvés`;

    if (noResults) {
      noResults.hidden = visibleCount !== 0;
    }
  }

  let debounceTimer: ReturnType<typeof setTimeout> | undefined;
  searchInput.addEventListener('input', () => {
    if (debounceTimer !== undefined) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(applyFilters, 120);
  });

  departmentSelect.addEventListener('change', applyFilters);
  citySelect.addEventListener('change', applyFilters);

  resetButton.addEventListener('click', () => {
    searchInput.value = '';
    departmentSelect.value = '';
    citySelect.value = '';
    applyFilters();
  });

  applyFilters();
}
