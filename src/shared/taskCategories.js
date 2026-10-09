(function initTaskCategories(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.RizhiTaskCategories = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const DEFAULT_TASK_CATEGORIES = Object.freeze([
    Object.freeze({ id: 'category-work', name: '工作', color: '#2e8f65', cycleEnabled: true, focusMinutes: 50, breakMinutes: 10, active: true }),
    Object.freeze({ id: 'category-course', name: '课程', color: '#a86bc9', cycleEnabled: true, focusMinutes: 50, breakMinutes: 10, active: true }),
    Object.freeze({ id: 'category-study', name: '学习', color: '#b9892e', cycleEnabled: true, focusMinutes: 50, breakMinutes: 10, active: true }),
    Object.freeze({ id: 'category-life', name: '生活', color: '#7aa35e', cycleEnabled: false, focusMinutes: 50, breakMinutes: 10, active: true })
  ]);

  const LEGACY_CATEGORY_IDS = Object.freeze({
    工作: 'category-work',
    课程: 'category-course',
    学习: 'category-study',
    生活: 'category-life'
  });

  function clean(value) {
    return String(value == null ? '' : value).trim();
  }

  function cloneDefaultTaskCategories() {
    return DEFAULT_TASK_CATEGORIES.map((category) => ({ ...category }));
  }

  function normalizeColor(value, fallback = '#2e8f65') {
    const color = clean(value);
    return /^#[0-9a-f]{6}$/i.test(color) ? color.toLowerCase() : fallback;
  }

  function normalizeMinutes(value, fallback) {
    const minutes = Number(value);
    return Number.isFinite(minutes) && minutes >= 1 ? Math.min(1440, Math.round(minutes)) : fallback;
  }

  function normalizeTaskCategories(value) {
    const source = Array.isArray(value) ? value : cloneDefaultTaskCategories();
    const seenIds = new Set();
    const seenNames = new Set();
    const normalized = [];

    source.forEach((category, index) => {
      if (!category || typeof category !== 'object') return;
      const name = clean(category.name).slice(0, 20);
      if (!name) return;

      const requestedId = clean(category.id) || `category-custom-${index + 1}`;
      let id = requestedId;
      let suffix = 2;
      while (seenIds.has(id)) {
        id = `${requestedId}-${suffix}`;
        suffix += 1;
      }

      const nameKey = name.toLocaleLowerCase('zh-CN');
      if (seenNames.has(nameKey)) return;
      seenIds.add(id);
      seenNames.add(nameKey);
      normalized.push({
        id,
        name,
        color: normalizeColor(category.color, DEFAULT_TASK_CATEGORIES[index % DEFAULT_TASK_CATEGORIES.length].color),
        cycleEnabled: typeof category.cycleEnabled === 'boolean'
          ? category.cycleEnabled
          : category.behavior === 'focus' || category.behavior === 'course',
        focusMinutes: normalizeMinutes(category.focusMinutes, 50),
        breakMinutes: normalizeMinutes(category.breakMinutes, 10),
        active: category.active !== false
      });
    });

    return normalized.length ? normalized : cloneDefaultTaskCategories();
  }

  function legacyTaskTypeToCategoryId(value) {
    return LEGACY_CATEGORY_IDS[clean(value)] || '';
  }

  function resolveTaskCategoryId(value, categories, legacyType = '') {
    const normalized = normalizeTaskCategories(categories);
    const requested = clean(value);
    const byId = normalized.find((category) => category.id === requested);
    if (byId) return byId.id;

    const typeName = clean(legacyType || value);
    const byName = normalized.find((category) => category.name.toLocaleLowerCase('zh-CN') === typeName.toLocaleLowerCase('zh-CN'));
    if (byName) return byName.id;

    const legacyId = legacyTaskTypeToCategoryId(typeName);
    if (legacyId && normalized.some((category) => category.id === legacyId)) return legacyId;
    return (normalized.find((category) => category.active) || normalized[0] || {}).id || '';
  }

  return {
    DEFAULT_TASK_CATEGORIES,
    cloneDefaultTaskCategories,
    legacyTaskTypeToCategoryId,
    normalizeTaskCategories,
    resolveTaskCategoryId
  };
}));
