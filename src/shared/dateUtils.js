'use strict';

(function exposeDateUtils(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.RizhiDateUtils = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const MIN_DATE_YEAR = 1949;
  const MIN_DATE_VALUE = '1949-01-01';

  function normalizeDate(value) {
    const text = String(value || '').trim();
    if (!text) return '';
    const match = text.match(/^(\d{4})[-/.年](\d{1,2})[-/.月](\d{1,2})日?$/);
    if (!match) return text;
    return `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`;
  }

  function normalizeStrictDate(value) {
    const normalized = normalizeDate(value);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return '';
    const [year, month, day] = normalized.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return '';
    return normalized;
  }

  function isCompleteDate(value) {
    return Boolean(normalizeStrictDate(value));
  }

  function isSelectableDate(value) {
    const normalized = normalizeStrictDate(value);
    return Boolean(normalized) && Number(normalized.slice(0, 4)) >= MIN_DATE_YEAR;
  }

  function parseLocalDate(value, options = {}) {
    const normalized = options.allowEarlierYears ? normalizeStrictDate(value) : normalizeDate(value);
    if (!(options.allowEarlierYears ? normalized : isSelectableDate(normalized))) return null;
    const [year, month, day] = normalized.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  function formatLocalDate(date) {
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0')
    ].join('-');
  }

  function shiftDate(value, offsetDays) {
    const date = parseLocalDate(value);
    if (!date) return '';
    date.setDate(date.getDate() + offsetDays);
    return formatLocalDate(date);
  }

  function weekdayFromDate(value) {
    const date = parseLocalDate(value);
    if (!date) return '';
    return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()];
  }

  function enumerateDates(startDate, endDate) {
    const start = parseLocalDate(startDate);
    const end = parseLocalDate(endDate);
    if (!start || !end || start > end) return [];

    const dates = [];
    const cursor = new Date(start);
    while (cursor <= end) {
      dates.push(formatLocalDate(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    return dates;
  }

  function formatClockDate(date) {
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  }

  function formatClockTime(date) {
    return [
      String(date.getHours()).padStart(2, '0'),
      String(date.getMinutes()).padStart(2, '0'),
      String(date.getSeconds()).padStart(2, '0')
    ].join(':');
  }

  function sanitizeDateSegmentLengths(value) {
    const text = String(value || '').trim();
    if (!text) return '';
    const parts = text.split(/[^\d]+/);

    if (parts.length > 1) {
      return [
        (parts[0] || '').slice(0, 4),
        (parts[1] || '').slice(0, 2),
        (parts[2] || '').slice(0, 2)
      ].filter((part) => part !== '').join('-');
    }

    const digits = text.replace(/\D/g, '').slice(0, 8);
    if (digits.length <= 4) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
  }

  return {
    MIN_DATE_VALUE,
    enumerateDates,
    formatClockDate,
    formatClockTime,
    formatLocalDate,
    isCompleteDate,
    isSelectableDate,
    normalizeDate,
    normalizeStrictDate,
    parseLocalDate,
    sanitizeDateSegmentLengths,
    shiftDate,
    weekdayFromDate
  };
}));
