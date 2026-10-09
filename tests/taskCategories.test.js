const assert = require('assert');
const {
  cloneDefaultTaskCategories,
  normalizeTaskCategories,
  resolveTaskCategoryId
} = require('../src/shared/taskCategories');

const defaults = cloneDefaultTaskCategories();
assert.deepStrictEqual(defaults.map((category) => category.name), ['工作', '课程', '学习', '生活']);
assert.strictEqual(resolveTaskCategoryId('', defaults, '学习'), 'category-study');

const renamed = normalizeTaskCategories(defaults.map((category) => (
  category.id === 'category-work' ? { ...category, name: '创作' } : category
)));
assert.strictEqual(resolveTaskCategoryId('category-work', renamed, '工作'), 'category-work');
assert.strictEqual(resolveTaskCategoryId('', renamed, '工作'), 'category-work');

const custom = normalizeTaskCategories([
  { id: 'deep-work', name: '深度工作', color: '#123456', cycleEnabled: true, focusMinutes: 40, breakMinutes: 8, active: true },
  { id: 'errands', name: '杂事', color: 'invalid', behavior: 'unknown', active: false }
]);
assert.strictEqual(custom[0].color, '#123456');
assert.strictEqual(custom[0].focusMinutes, 40);
assert.strictEqual(custom[0].breakMinutes, 8);
assert.strictEqual(custom[1].cycleEnabled, false);
assert.strictEqual(resolveTaskCategoryId('', custom, '深度工作'), 'deep-work');

console.log('taskCategories tests passed');
