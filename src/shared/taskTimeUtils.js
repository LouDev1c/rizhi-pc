'use strict';

(function exposeTaskTimeUtils(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.RizhiTaskTimeUtils = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  function formatTimeRangeInput(value) {
    const digits = String(value || '').trim().replace(/\D/g, '').slice(0, 8);
    if (!digits) return '';
    if (digits.length < 2) return digits;

    const startHour = digits.slice(0, 2);
    if (digits.length === 2) return `${startHour}:`;
    if (digits.length < 4) return `${startHour}:${digits.slice(2)}`;
    const start = `${startHour}:${digits.slice(2, 4)}`;
    if (digits.length === 4) return `${start}-`;
    if (digits.length < 6) return `${start}-${digits.slice(4)}`;
    if (digits.length === 6) return `${start}-${digits.slice(4, 6)}:`;
    return `${start}-${digits.slice(4, 6)}:${digits.slice(6, 8)}`;
  }

  function isValidClockPart(hour, minute) {
    return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
  }

  function extractTimeRangeFromInput(value) {
    const match = formatTimeRangeInput(value).match(/^(\d{2}):(\d{2})-(\d{2}):(\d{2})$/);
    if (!match) return null;
    const startHour = Number(match[1]);
    const startMinute = Number(match[2]);
    const endHour = Number(match[3]);
    const endMinute = Number(match[4]);
    if (!isValidClockPart(startHour, startMinute) || !isValidClockPart(endHour, endMinute)) return null;

    return {
      startTime: `${match[1]}:${match[2]}`,
      endTime: `${match[3]}:${match[4]}`
    };
  }

  function timeToMinutes(value) {
    const match = String(value || '').trim().match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return null;
    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    if (hours > 23 || minutes > 59) return null;
    return hours * 60 + minutes;
  }

  function rangeToComparableIntervals(startTime, endTime) {
    const start = timeToMinutes(startTime);
    const end = timeToMinutes(endTime);
    if (start === null || end === null || start === end) return [];
    if (end > start) return [[start, end], [start + 1440, end + 1440]];
    return [[start, end + 1440], [start - 1440, end]];
  }

  function inputRangeToComparableIntervals(value) {
    const timeRange = extractTimeRangeFromInput(value);
    return timeRange ? rangeToComparableIntervals(timeRange.startTime, timeRange.endTime) : [];
  }

  function rangesOverlap(firstIntervals, secondIntervals) {
    return firstIntervals.some(([firstStart, firstEnd]) => (
      secondIntervals.some(([secondStart, secondEnd]) => firstStart < secondEnd && secondStart < firstEnd)
    ));
  }

  function normalizeTime(value) {
    return value && /^\d{1,2}:\d{2}$/.test(value) ? value.padStart(5, '0') : '99:99';
  }

  return {
    extractTimeRangeFromInput,
    formatTimeRangeInput,
    inputRangeToComparableIntervals,
    isValidClockPart,
    normalizeTime,
    rangesOverlap,
    rangeToComparableIntervals,
    timeToMinutes
  };
}));
