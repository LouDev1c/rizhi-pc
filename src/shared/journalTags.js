'use strict';

(function exposeJournalTags(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.RizhiJournalTags = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const DEFAULT_JOURNAL_TAGS = [
    { id: 'legacy-1', color: '#9ca3af', shortName: '低', fullName: '状态较低，需要复盘和调整的日子' },
    { id: 'legacy-2', color: '#60a5fa', shortName: '缓', fullName: '节奏偏缓但仍有推进的日子' },
    { id: 'legacy-3', color: '#34d399', shortName: '稳', fullName: '整体平稳、按计划进行的日子' },
    { id: 'legacy-4', color: '#f59e0b', shortName: '好', fullName: '状态较好、完成度较高的日子' },
    { id: 'legacy-5', color: '#ef4444', shortName: '亮', fullName: '高光日、值得特别标记的日子' }
  ];
  const LEGACY_RATING_TO_TAG_ID = {
    '一星': 'legacy-1',
    '二星': 'legacy-2',
    '三星': 'legacy-3',
    '四星': 'legacy-4',
    '五星': 'legacy-5'
  };

  function normalizeJournalTagId(value) {
    return String(value || '').trim();
  }

  function legacyRatingToTagId(value) {
    return LEGACY_RATING_TO_TAG_ID[normalizeJournalTagId(value)] || '';
  }

  return {
    DEFAULT_JOURNAL_TAGS,
    legacyRatingToTagId,
    normalizeJournalTagId
  };
}));
