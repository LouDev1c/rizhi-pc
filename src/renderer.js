const pageTitle = document.querySelector('#pageTitle');
const appIconLink = document.querySelector('link[rel="icon"]');
const brandMark = document.querySelector('.brand-mark');
const systemTime = document.querySelector('#systemTime');
const navItems = document.querySelectorAll('.nav-item');
const pages = {
  tasks: document.querySelector('#tasksPage'),
  profile: document.querySelector('#profilePage'),
  records: document.querySelector('#recordsPage'),
  settings: document.querySelector('#settingsPage')
};
const TASK_TYPES = ['工作', '课程', '学习', '生活'];
const TASK_SUMMARY_TYPES = [...TASK_TYPES, '未分配'];
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
const MIN_DATE_YEAR = 1949;
const MIN_DATE_VALUE = '1949-01-01';
const emptyState = document.querySelector('#emptyState');
const taskWorkspace = document.querySelector('#taskWorkspace');
const taskList = document.querySelector('#taskList');
const taskDurationSummary = document.querySelector('#taskDurationSummary');
const statusBox = document.querySelector('#statusBox');
const manualTaskButton = document.querySelector('#manualTaskButton');
const importFileButton = document.querySelector('#importFileButton');
const backToCurrentTaskButton = document.querySelector('#backToCurrentTaskButton');
const reusePreviousButton = document.querySelector('#reusePreviousButton');
const importMoreButton = document.querySelector('#importMoreButton');
const taskDateFilter = document.querySelector('#taskDateFilter');
const journalDate = document.querySelector('#journalDate');
const journalTag = document.querySelector('#journalTag');
const journalTagPaletteButton = document.querySelector('#journalTagPaletteButton');
const journalTagPalette = document.querySelector('#journalTagPalette');
const journalContent = document.querySelector('#journalContent');
const saveJournalButton = document.querySelector('#saveJournalButton');
const journalSaveState = document.querySelector('#journalSaveState');
const journalFilterModeButton = document.querySelector('#journalFilterModeButton');
const journalTagFilter = document.querySelector('#journalTagFilter');
const journalTagFilterPaletteButton = document.querySelector('#journalTagFilterPaletteButton');
const journalTagFilterPalette = document.querySelector('#journalTagFilterPalette');
const journalTagFilterField = document.querySelector('#journalTagFilterField');
const journalViewDateField = document.querySelector('#journalViewDateField');
const journalViewDate = document.querySelector('#journalViewDate');
const journalList = document.querySelector('#journalList');
const dataFilePath = document.querySelector('#dataFilePath');
const settingsFilePath = document.querySelector('#settingsFilePath');
const chooseDataPathButton = document.querySelector('#chooseDataPathButton');
const openDataPathButton = document.querySelector('#openDataPathButton');
const journalTagSettingsList = document.querySelector('#journalTagSettingsList');
const addJournalTagButton = document.querySelector('#addJournalTagButton');
const deleteDayDate = document.querySelector('#deleteDayDate');
const openDeleteDayButton = document.querySelector('#openDeleteDayButton');
const openResetButton = document.querySelector('#openResetButton');
const resetModal = document.querySelector('#resetModal');
const resetTitle = document.querySelector('#resetTitle');
const resetDescription = document.querySelector('#resetDescription');
const closeResetModalButton = document.querySelector('#closeResetModalButton');
const cancelResetButton = document.querySelector('#cancelResetButton');
const confirmResetButton = document.querySelector('#confirmResetButton');
const resetConfirmCheck = document.querySelector('#resetConfirmCheck');
const resetConfirmText = document.querySelector('#resetConfirmText');
const resetPathList = document.querySelector('#resetPathList');
const taskEditModal = document.querySelector('#taskEditModal');
const taskEditForm = document.querySelector('#taskEditForm');
const taskEditTitle = document.querySelector('#taskEditTitle');
const closeTaskEditModalButton = document.querySelector('#closeTaskEditModalButton');
const cancelTaskEditButton = document.querySelector('#cancelTaskEditButton');
const taskDetails = document.querySelector('#taskDetails');
const taskStatus = document.querySelector('#taskStatus');
const profileStatsStartDate = document.querySelector('#profileStatsStartDate');
const profileStatsPeriod = document.querySelector('#profileStatsPeriod');
const profileStatsSummary = document.querySelector('#profileStatsSummary');
const profileStatsRangeText = document.querySelector('#profileStatsRangeText');
const profileStatsPie = document.querySelector('#profileStatsPie');
const profileStatsBars = document.querySelector('#profileStatsBars');
const importChoiceModal = document.querySelector('#importChoiceModal');
const closeImportChoiceModalButton = document.querySelector('#closeImportChoiceModalButton');
const manualScheduleButton = document.querySelector('#manualScheduleButton');
const fileScheduleButton = document.querySelector('#fileScheduleButton');
const manualDailyPlanButton = document.querySelector('#manualDailyPlanButton');
const scheduleTableModal = document.querySelector('#scheduleTableModal');
const closeScheduleTableModalButton = document.querySelector('#closeScheduleTableModalButton');
const termStartDate = document.querySelector('#termStartDate');
const termEndDate = document.querySelector('#termEndDate');
const scheduleTableBody = document.querySelector('#scheduleTableBody');
const addScheduleRowButton = document.querySelector('#addScheduleRowButton');
const cancelScheduleTableButton = document.querySelector('#cancelScheduleTableButton');
const saveScheduleTableButton = document.querySelector('#saveScheduleTableButton');
const dailyPlanTableModal = document.querySelector('#dailyPlanTableModal');
const closeDailyPlanTableModalButton = document.querySelector('#closeDailyPlanTableModalButton');
const dailyPlanSingleDay = document.querySelector('#dailyPlanSingleDay');
const dailyPlanSingleDateRow = document.querySelector('#dailyPlanSingleDateRow');
const dailyPlanRangeRow = document.querySelector('#dailyPlanRangeRow');
const dailyPlanDate = document.querySelector('#dailyPlanDate');
const dailyPlanStartDate = document.querySelector('#dailyPlanStartDate');
const dailyPlanEndDate = document.querySelector('#dailyPlanEndDate');
const dailyPlanTableBody = document.querySelector('#dailyPlanTableBody');
const addDailyPlanRowButton = document.querySelector('#addDailyPlanRowButton');
const cancelDailyPlanTableButton = document.querySelector('#cancelDailyPlanTableButton');
const saveDailyPlanTableButton = document.querySelector('#saveDailyPlanTableButton');
const journalViewModal = document.querySelector('#journalViewModal');
const journalViewTitle = document.querySelector('#journalViewTitle');
const journalViewContent = document.querySelector('#journalViewContent');
const closeJournalViewModalButton = document.querySelector('#closeJournalViewModalButton');
const closeJournalViewButton = document.querySelector('#closeJournalViewButton');
const classDuration = document.querySelector('#classDuration');
const classBreakLength = document.querySelector('#classBreakLength');
const workFocusLength = document.querySelector('#workFocusLength');
const workBreakLength = document.querySelector('#workBreakLength');
const breakReminder = document.querySelector('#breakReminder');
const tutorialButton = document.querySelector('#tutorialButton');
const tutorialConfirmModal = document.querySelector('#tutorialConfirmModal');
const tutorialConfirmNoButton = document.querySelector('#tutorialConfirmNoButton');
const tutorialNoButton = document.querySelector('#tutorialNoButton');
const tutorialYesButton = document.querySelector('#tutorialYesButton');
const tutorialOverlay = document.querySelector('#tutorialOverlay');
const tutorialHighlight = document.querySelector('#tutorialHighlight');
const tutorialArrow = document.querySelector('#tutorialArrow');
const tutorialArrowLine = document.querySelector('#tutorialArrowLine');
const tutorialCard = document.querySelector('#tutorialCard');
const tutorialCounter = document.querySelector('#tutorialCounter');
const tutorialTitle = document.querySelector('#tutorialTitle');
const tutorialText = document.querySelector('#tutorialText');
const tutorialPrevButton = document.querySelector('#tutorialPrevButton');
const tutorialNextButton = document.querySelector('#tutorialNextButton');
const tutorialCloseButton = document.querySelector('#tutorialCloseButton');
const versionBadge = document.querySelector('#versionBadge');

let tasks = [];
let journals = [];
let profile = {};
let storagePaths = {
  dataFilePath: '',
  settingsFilePath: '',
  legacyStorageKeys: ['whbr.tasks', 'whbr.journals']
};
let editingTaskId = '';
let draggedTaskId = '';
let deleteMode = 'all';
let highlightedTaskId = '';
let currentEffectiveNow = new Date();
let lastReminderCheckValue = null;
let statusTimer = null;
let tutorialStepIndex = 0;
let previousTutorialPage = 'tasks';
let appliedJournalTagFilter = '';
let journalFilterMode = 'all';
let committedProfileStatsStartDate = '';
const firedReminderKeys = new Set();
const activePlanningDates = new Set();
const dateInputControllers = new WeakMap();
const MISSED_REMINDER_BACKLOG_LIMIT_MINUTES = 2;
const tutorialSteps = [
  {
    page: 'tasks',
    targetSelector: '#importMoreButton',
    title: '批量创建任务',
    text: '点击这个按钮，可手动填写或导入文件生成课表，也可以复用前一天或填写每日安排内容。'
  },
  {
    page: 'records',
    targetSelector: '.journal-editor .section-head',
    title: '每日生活记录',
    text: '每日记录用于写下当天的活动、状态和复盘内容，帮助你保留每天的生活脉络。'
  },
  {
    page: 'records',
    targetSelector: '#journalFilterModeButton',
    title: '记录列表',
    text: '这个按钮有三档：显示全部、日期记录、标签记录。显示全部会列出所有记录，日期记录会按选定日期筛选，标签记录会按色块标签筛选；点击记录条即可查看当天详情。'
  },
  {
    page: 'profile',
    targetSelector: '.profile-dashboard .panel',
    scrollBlock: 'start',
    title: '自律统计',
    text: '这里可以按本日、本周、本月、本季度和本年查看任务安排、完成评价和各类投入时间。'
  },
  {
    page: 'settings',
    targetSelector: '.settings-data-panel',
    title: '数据文件',
    text: '个人记录与软件设置会存放在这里显示的文件夹中。可以选择新的保存文件夹，也可以直接打开本地文件夹做备份或迁移。'
  },
  {
    page: 'settings',
    targetSelector: '.settings-tags-panel',
    title: '标签',
    text: '标签用纯色块标记每日记录。可以新增、删除和调整颜色，并用简称与全称说明每种日子的含义。'
  },
  {
    page: 'settings',
    targetSelector: '.settings-reminder-panel',
    title: '周期设置',
    text: '课程、工作和学习的提醒周期在这里调整，日织会按这些信息提醒你专注、休息或活动身体。'
  },
  {
    page: 'tasks',
    targetSelector: '#backToCurrentTaskButton',
    title: '定位按钮',
    text: '左下角按钮可以回到任务页并定位到当前正在进行的安排，查看其他日期或滚动列表后也能一键回到现在。'
  },
  {
    page: 'tasks',
    title: '教程已结束',
    text: '教程已结束，祝使用愉快。'
  }
];

navItems.forEach((item) => {
  item.addEventListener('click', () => {
    if (item.dataset.page === 'tasks') {
      goToCurrentTask();
      return;
    }
    showPage(item.dataset.page);
  });
});

document.querySelectorAll('.date-step-button').forEach((button) => {
  button.addEventListener('mousedown', (event) => event.preventDefault());
  button.addEventListener('click', handleDateStepButton);
});

if (tutorialButton) tutorialButton.addEventListener('click', openTutorialConfirmModal);
if (tutorialConfirmNoButton) tutorialConfirmNoButton.addEventListener('click', closeTutorialConfirmModal);
if (tutorialNoButton) tutorialNoButton.addEventListener('click', closeTutorialConfirmModal);
if (tutorialYesButton) tutorialYesButton.addEventListener('click', startTutorial);
if (tutorialPrevButton) tutorialPrevButton.addEventListener('click', showPreviousTutorialStep);
if (tutorialNextButton) tutorialNextButton.addEventListener('click', showNextTutorialStep);
if (tutorialCloseButton) tutorialCloseButton.addEventListener('click', finishTutorial);
tutorialConfirmModal.addEventListener('click', (event) => {
  if (event.target === tutorialConfirmModal) closeTutorialConfirmModal();
});
window.addEventListener('resize', () => {
  if (!tutorialOverlay.classList.contains('hidden')) positionTutorialOverlay();
});
document.addEventListener('click', closeTagPalettesOnOutsideClick);

backToCurrentTaskButton.addEventListener('click', goToCurrentTask);
if (manualTaskButton) manualTaskButton.addEventListener('click', openImportChoiceModal);
reusePreviousButton.addEventListener('click', reusePreviousDay);
if (importFileButton) importFileButton.addEventListener('click', openImportChoiceModal);
importMoreButton.addEventListener('click', openImportChoiceModal);
window.addEventListener('keydown', (event) => {
  if (isSaveShortcut(event) && canSaveJournalWithShortcut()) {
    event.preventDefault();
    saveSelectedJournal();
    return;
  }

  if (event.key === 'Escape' && !resetModal.classList.contains('hidden')) {
    closeResetModal();
  }
  if (event.key === 'Escape' && !taskEditModal.classList.contains('hidden')) {
    closeTaskEditModal();
  }
  if (event.key === 'Escape' && !importChoiceModal.classList.contains('hidden')) {
    closeImportChoiceModal();
  }
  if (event.key === 'Escape' && !scheduleTableModal.classList.contains('hidden')) {
    closeScheduleTableModal();
  }
  if (event.key === 'Escape' && !dailyPlanTableModal.classList.contains('hidden')) {
    closeDailyPlanTableModal();
  }
  if (event.key === 'Escape' && !journalViewModal.classList.contains('hidden')) {
    closeJournalViewModal();
  }
  if (event.key === 'Escape' && !tutorialConfirmModal.classList.contains('hidden')) {
    closeTutorialConfirmModal();
  }
});

function isSaveShortcut(event) {
  return !event.repeat && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's';
}

function canSaveJournalWithShortcut() {
  if (!pages.records.classList.contains('active')) return false;
  return [
    resetModal,
    taskEditModal,
    importChoiceModal,
    scheduleTableModal,
    dailyPlanTableModal,
    journalViewModal,
    tutorialConfirmModal
  ].every((modal) => modal.classList.contains('hidden'));
}

if (importFileButton) {
  importFileButton.addEventListener('dragover', handleDragOver);
  importFileButton.addEventListener('dragleave', handleDragLeave);
  importFileButton.addEventListener('drop', handleDrop);
}
importMoreButton.addEventListener('dragover', handleDragOver);
importMoreButton.addEventListener('dragleave', handleDragLeave);
importMoreButton.addEventListener('drop', handleDrop);
registerDateInput(taskDateFilter, { onCommit: renderTasks });
registerDateInput(profileStatsStartDate, {
  onCommit: (date) => {
    committedProfileStatsStartDate = date;
    renderProfileStats();
  }
});
if (profileStatsPeriod) profileStatsPeriod.addEventListener('change', renderProfileStats);
registerDateInput(journalDate, { onCommit: renderSelectedJournal });
if (journalTag) journalTag.addEventListener('change', () => renderTagPicker(journalTag, journalTagPaletteButton, journalTagPalette));
if (journalTagFilter) {
  journalTagFilter.addEventListener('change', () => {
    renderTagPicker(journalTagFilter, journalTagFilterPaletteButton, journalTagFilterPalette);
    if (journalFilterMode === 'tag') {
      appliedJournalTagFilter = normalizeJournalTagId(journalTagFilter.value);
      renderJournalList();
    }
  });
}
if (journalTagPaletteButton) journalTagPaletteButton.addEventListener('click', () => toggleTagPalette(journalTagPalette));
if (journalTagFilterPaletteButton) journalTagFilterPaletteButton.addEventListener('click', () => toggleTagPalette(journalTagFilterPalette));
if (journalFilterModeButton) journalFilterModeButton.addEventListener('click', cycleJournalFilterMode);
saveJournalButton.addEventListener('click', saveSelectedJournal);
registerDateInput(journalViewDate, {
  onCommit: () => {
    if (journalFilterMode === 'date') renderJournalList();
  }
});
registerDateInput(deleteDayDate);
registerDateInput(termStartDate);
registerDateInput(termEndDate);
registerDateInput(dailyPlanDate);
registerDateInput(dailyPlanStartDate, { onCommit: constrainDailyPlanEndDate });
registerDateInput(dailyPlanEndDate);
chooseDataPathButton.addEventListener('click', chooseDataPath);
if (openDataPathButton) openDataPathButton.addEventListener('click', openDataPath);
if (addJournalTagButton) addJournalTagButton.addEventListener('click', addJournalTag);
openDeleteDayButton.addEventListener('click', openDeleteDayModal);
openResetButton.addEventListener('click', openResetModal);
closeResetModalButton.addEventListener('click', closeResetModal);
cancelResetButton.addEventListener('click', closeResetModal);
resetConfirmCheck.addEventListener('change', () => {
  confirmResetButton.disabled = !resetConfirmCheck.checked;
});
confirmResetButton.addEventListener('click', confirmReset);
resetModal.addEventListener('click', (event) => {
  if (event.target === resetModal) closeResetModal();
});
taskEditForm.addEventListener('submit', saveTaskEdit);
closeTaskEditModalButton.addEventListener('click', closeTaskEditModal);
cancelTaskEditButton.addEventListener('click', closeTaskEditModal);
taskEditModal.addEventListener('click', (event) => {
  if (event.target === taskEditModal) closeTaskEditModal();
});
closeImportChoiceModalButton.addEventListener('click', closeImportChoiceModal);
manualScheduleButton.addEventListener('click', () => openScheduleTableModal());
fileScheduleButton.addEventListener('click', importScheduleFile);
manualDailyPlanButton.addEventListener('click', openDailyPlanTableModal);
importChoiceModal.addEventListener('click', (event) => {
  if (event.target === importChoiceModal) closeImportChoiceModal();
});
closeScheduleTableModalButton.addEventListener('click', closeScheduleTableModal);
cancelScheduleTableButton.addEventListener('click', closeScheduleTableModal);
addScheduleRowButton.addEventListener('click', () => addScheduleTableRow());
saveScheduleTableButton.addEventListener('click', saveScheduleTable);
scheduleTableModal.addEventListener('click', (event) => {
  if (event.target === scheduleTableModal) closeScheduleTableModal();
});
closeDailyPlanTableModalButton.addEventListener('click', closeDailyPlanTableModal);
cancelDailyPlanTableButton.addEventListener('click', closeDailyPlanTableModal);
addDailyPlanRowButton.addEventListener('click', () => addDailyPlanRow());
saveDailyPlanTableButton.addEventListener('click', saveDailyPlanTable);
if (dailyPlanSingleDay) dailyPlanSingleDay.addEventListener('change', syncDailyPlanDateMode);
if (dailyPlanStartDate) dailyPlanStartDate.addEventListener('change', constrainDailyPlanEndDate);
if (dailyPlanEndDate) dailyPlanEndDate.addEventListener('change', constrainDailyPlanEndDate);
dailyPlanTableModal.addEventListener('click', (event) => {
  if (event.target === dailyPlanTableModal) closeDailyPlanTableModal();
});
closeJournalViewModalButton.addEventListener('click', closeJournalViewModal);
closeJournalViewButton.addEventListener('click', closeJournalViewModal);
journalViewModal.addEventListener('click', (event) => {
  if (event.target === journalViewModal) closeJournalViewModal();
});
[classDuration, classBreakLength, workFocusLength, workBreakLength, breakReminder].forEach((input) => {
  input.addEventListener('change', saveProfileFromForm);
});

async function refreshSystemTime() {
  const now = await getEffectiveNow();
  currentEffectiveNow = now;
  const weekday = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][now.getDay()];
  systemTime.textContent = `${formatClockDate(now)} ${weekday} ${formatClockTime(now)}`;
  updateTaskTemporalView();
  if (pages.profile.classList.contains('active')) renderProfileStats();
  checkDueReminders(now);
}

function openTutorialConfirmModal() {
  previousTutorialPage = currentPageKey();
  tutorialConfirmModal.classList.remove('hidden');
  tutorialYesButton.focus();
}

function closeTutorialConfirmModal() {
  tutorialConfirmModal.classList.add('hidden');
}

async function startTutorial() {
  closeTutorialConfirmModal();
  tutorialStepIndex = 0;
  tutorialOverlay.classList.remove('hidden');
  await showTutorialStep();
}

async function showTutorialStep() {
  const step = tutorialSteps[tutorialStepIndex];
  if (!step) return;

  showPage(step.page);
  if (step.page === 'tasks') renderTasks();
  if (step.page === 'records') {
    renderJournalList();
    renderSelectedJournal();
  }

  await waitForPaint();
  scrollTutorialTargetIntoView(step);
  await waitForPaint();

  tutorialCounter.textContent = tutorialStepIndex < tutorialSteps.length - 1
    ? `第 ${tutorialStepIndex + 1} / ${tutorialSteps.length - 1} 步`
    : '';
  tutorialTitle.textContent = step.title;
  tutorialText.textContent = step.text;
  tutorialPrevButton.disabled = tutorialStepIndex === 0;
  tutorialPrevButton.classList.toggle('hidden', tutorialStepIndex === tutorialSteps.length - 1);
  tutorialNextButton.classList.toggle('hidden', tutorialStepIndex === tutorialSteps.length - 1);
  tutorialCloseButton.classList.toggle('hidden', tutorialStepIndex !== tutorialSteps.length - 1);

  positionTutorialOverlay();
}

async function showPreviousTutorialStep() {
  if (tutorialStepIndex <= 0) return;
  tutorialStepIndex -= 1;
  await showTutorialStep();
}

async function showNextTutorialStep() {
  if (tutorialStepIndex >= tutorialSteps.length - 1) return;
  tutorialStepIndex += 1;
  await showTutorialStep();
}

function finishTutorial() {
  tutorialOverlay.classList.add('hidden');
  showPage('tasks');
  renderTasks({ scrollToCurrent: true, forceScroll: true });
}

function scrollTutorialTargetIntoView(step) {
  const target = getTutorialTarget(step);
  if (!target) return;
  target.scrollIntoView({ block: step.scrollBlock || 'center', inline: 'center' });
}

function positionTutorialOverlay() {
  const step = tutorialSteps[tutorialStepIndex];
  const target = getTutorialTarget(step);

  if (!step || !target) {
    tutorialHighlight.classList.add('hidden');
    tutorialArrow.classList.add('hidden');
    return;
  }

  const rect = target.getBoundingClientRect();
  const padding = 8;
  tutorialHighlight.classList.remove('hidden');
  tutorialArrow.classList.remove('hidden');
  tutorialHighlight.style.left = `${Math.max(0, rect.left - padding)}px`;
  tutorialHighlight.style.top = `${Math.max(0, rect.top - padding)}px`;
  tutorialHighlight.style.width = `${Math.min(window.innerWidth, rect.width + padding * 2)}px`;
  tutorialHighlight.style.height = `${Math.min(window.innerHeight, rect.height + padding * 2)}px`;

  const cardRect = tutorialCard.getBoundingClientRect();
  const cardCenter = {
    x: cardRect.left + cardRect.width / 2,
    y: cardRect.top + cardRect.height / 2
  };
  const targetPoint = closestPointOnRect(rect, cardCenter);
  const startPoint = closestPointOnRect(cardRect, targetPoint);

  tutorialArrow.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);
  tutorialArrowLine.setAttribute('x1', String(startPoint.x));
  tutorialArrowLine.setAttribute('y1', String(startPoint.y));
  tutorialArrowLine.setAttribute('x2', String(targetPoint.x));
  tutorialArrowLine.setAttribute('y2', String(targetPoint.y));
}

function closestPointOnRect(rect, point) {
  const clampedX = Math.max(rect.left, Math.min(point.x, rect.right));
  const clampedY = Math.max(rect.top, Math.min(point.y, rect.bottom));
  const distances = [
    { x: clampedX, y: rect.top, value: Math.abs(point.y - rect.top) },
    { x: clampedX, y: rect.bottom, value: Math.abs(point.y - rect.bottom) },
    { x: rect.left, y: clampedY, value: Math.abs(point.x - rect.left) },
    { x: rect.right, y: clampedY, value: Math.abs(point.x - rect.right) }
  ];
  return distances.sort((a, b) => a.value - b.value)[0];
}

function getTutorialTarget(step) {
  if (!step || !step.targetSelector) return null;
  return document.querySelector(step.targetSelector);
}

function currentPageKey() {
  return Object.entries(pages).find(([, page]) => page.classList.contains('active'))?.[0] || 'tasks';
}

function handleDateStepButton(event) {
  const button = event.currentTarget;
  const input = document.querySelector(`#${button.dataset.dateStepFor}`);
  const offsetDays = Number(button.dataset.dateStep);
  if (!input || !Number.isFinite(offsetDays)) return;

  const currentDate = committedDateInputValue(input) || formatLocalDate(currentEffectiveNow || new Date());
  const nextDate = shiftDate(currentDate, offsetDays);
  if (!nextDate || !isSelectableDate(nextDate)) return;

  setDateInputValue(input, nextDate, { trigger: true });
  input.blur();
  button.blur();
}

function registerDateInput(input, options = {}) {
  if (!input) return;

  input.min = MIN_DATE_VALUE;
  input.max = '9999-12-31';
  input.dataset.dateInput = 'managed';

  const controller = {
    committed: isSelectableDate(input.value) ? normalizeDate(input.value) : '',
    onCommit: typeof options.onCommit === 'function' ? options.onCommit : null
  };
  dateInputControllers.set(input, controller);

  input.addEventListener('input', () => sanitizeDateInputValue(input));
  input.addEventListener('change', () => {
    if (document.activeElement === input) {
      sanitizeDateInputValue(input);
      return;
    }
    commitDateInput(input);
  });
  input.addEventListener('blur', () => commitDateInput(input));
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      input.blur();
    }
  });
}

function sanitizeDateInputValue(input) {
  const sanitized = sanitizeDateSegmentLengths(input.value);
  if (sanitized !== input.value) {
    input.value = sanitized;
  }
}

function commitDateInput(input) {
  if (!input) return false;

  sanitizeDateInputValue(input);
  const controller = dateInputControllers.get(input);
  const normalizedDate = normalizeDate(input.value);

  if (!isSelectableDate(normalizedDate)) {
    input.value = fallbackDateInputValue(input);
    return false;
  }

  input.value = normalizedDate;
  const previousDate = controller ? controller.committed : '';
  if (controller) controller.committed = normalizedDate;
  if (controller && controller.onCommit && previousDate !== normalizedDate) {
    controller.onCommit(normalizedDate);
  }
  return true;
}

function setDateInputValue(input, date, options = {}) {
  if (!input) return false;
  const normalizedDate = normalizeDate(date);
  if (!isSelectableDate(normalizedDate)) return false;

  input.value = normalizedDate;
  const controller = dateInputControllers.get(input);
  const previousDate = controller ? controller.committed : '';
  if (controller) {
    controller.committed = normalizedDate;
    if (options.trigger && controller.onCommit && previousDate !== normalizedDate) {
      controller.onCommit(normalizedDate);
    }
  }
  return true;
}

function committedDateInputValue(input) {
  const controller = dateInputControllers.get(input);
  if (controller && isSelectableDate(controller.committed)) return controller.committed;
  const normalizedDate = normalizeDate(input && input.value);
  return isSelectableDate(normalizedDate) ? normalizedDate : '';
}

function fallbackDateInputValue(input) {
  return committedDateInputValue(input) || formatLocalDate(currentEffectiveNow || new Date());
}

function sanitizeDateSegmentLengths(value) {
  const text = clean(value);
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

async function importScheduleFile() {
  setStatus('请选择要导入的课表文件，仅支持 xlsx、xls、csv 或 tsv。', '');
  closeImportChoiceModal();

  try {
    const selectedFile = await window.whbr.selectAndParseFile({ kind: 'schedule' });
    if (selectedFile.canceled) {
      setStatus('已取消导入。', '', 2500);
      return;
    }

    const result = await parseSelectedImportFile(selectedFile);

    if (result.message) {
      setStatus(result.message, result.status === 'ok' ? 'hidden' : '');
    }

    if (result.error) {
      setStatus(result.error, '');
      return;
    }

    if (!validateImportKind(result)) return;

    await handleParsedImport(result);
  } catch (error) {
    setStatus(`导入失败：${error.message}`, '');
  }
}

async function importDroppedFile(file) {
  setStatus(`已忽略 ${file && file.name ? file.name : '拖入的文件'}。每日安排不再支持文件导入，请在“批量创建任务”中选择“填写安排内容”。`, '', 6000);
}

async function parseSelectedImportFile(file) {
  const fileName = file.fileName || file.filePath.split(/[\\/]/).pop();
  const ext = fileName.split('.').pop().toLowerCase();
  const isScheduleUnsupported = !['xlsx', 'xls', 'csv', 'tsv'].includes(ext);

  if (isScheduleUnsupported) {
    return {
      canceled: false,
      error: '课表入口目前只支持 xlsx、xls、csv 或 tsv 文件。PDF 课表暂不在 v0.2.0 支持范围内。',
      filePath: file.filePath,
      fileName,
      tasks: []
    };
  }

  setStatus(`已选择 ${fileName}，正在读取文件……`, '');
  await waitForPaint();

  setStatus('正在转化中……正在读取课表文件。', '');
  await waitForPaint();

  const result = await window.whbr.parseFilePath(file.filePath);

  setStatus('正在整理课表文件解析结果，准备预填课表。', '');
  await waitForPaint();

  return result;
}

function validateImportKind(result) {
  const importedTasks = Array.isArray(result.tasks) ? result.tasks : [];
  const hasTimetable = hasImportedTimetable(result);
  const isTable = result.sourceType === 'table';

  if (!isTable) {
    setStatus('课表入口目前只支持 xlsx、xls、csv 或 tsv 文件。', '');
    return false;
  }

  if (!hasTimetable) {
    setStatus(importedTasks.length > 0
      ? '这个文件看起来是每日安排，不是学期课表。每日安排请使用“填写安排内容”。'
      : '没有识别到课表网格。请上传包含周一至周日列的课表文件。', '');
    return false;
  }

  return true;
}

function hasImportedTimetable(result) {
  const rows = result && result.timetableTemplate && Array.isArray(result.timetableTemplate.rows)
    ? result.timetableTemplate.rows
    : [];
  return rows.length > 0;
}

function waitForPaint() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  });
}

async function handleParsedImport(result) {
  const importedTasks = Array.isArray(result.tasks) ? result.tasks : [];
  openScheduleTableModal(result.timetableTemplate || templateFromScheduleTasks(importedTasks), result);
}

function openImportChoiceModal() {
  const hasSchedule = hasScheduleTemplate();
  manualScheduleButton.textContent = hasSchedule ? '查看/修改课表' : '手动添加课表';
  fileScheduleButton.textContent = hasSchedule ? '更新课表文件' : '导入课表文件';
  importChoiceModal.classList.remove('hidden');
}

function hasScheduleTemplate() {
  const template = normalizedProfile().scheduleTemplate;
  if (template && Array.isArray(template.rows) && template.rows.length > 0) return true;
  return tasks.some((task) => task.type === '课程' && task.source === 'schedule-template');
}

function closeImportChoiceModal() {
  importChoiceModal.classList.add('hidden');
}

function openScheduleTableModal(prefillTemplate = null, importResult = null) {
  closeImportChoiceModal();
  const template = normalizedProfile().scheduleTemplate || null;
  const hasTemplate = template && Array.isArray(template.rows) && template.rows.length > 0;
  const prefillRows = prefillTemplate && Array.isArray(prefillTemplate.rows) ? prefillTemplate.rows : [];
  const rowsToUse = prefillRows.length > 0
    ? prefillRows
    : hasTemplate
      ? template.rows
      : null;
  const today = taskDateFilter.value || formatLocalDate(currentEffectiveNow);
  setDateInputValue(termStartDate, template && template.termStartDate ? template.termStartDate : today);
  setDateInputValue(termEndDate, template && template.termEndDate ? template.termEndDate : today);
  document.querySelector('#scheduleTableTitle').textContent = hasTemplate || prefillTemplate ? '查看/修改学期课表' : '填写学期课表';
  saveScheduleTableButton.textContent = hasTemplate ? '保存并更新课程安排' : '生成课程安排';
  scheduleTableBody.innerHTML = '';
  if (rowsToUse) {
    rowsToUse.forEach((row) => addScheduleTableRow(row.timeRange, row.courses, row.sectionLabel));
  } else {
    addScheduleTableRow('08:00-09:40');
    addScheduleTableRow('10:00-11:40');
    addScheduleTableRow('14:00-15:40');
  }
  if (importResult) {
    const message = prefillRows.length > 0
      ? `已预填 ${prefillRows.length} 行课表。请补充或校对时间段，确认后再生成课程安排。`
      : '没有从文件中识别出稳定的课表网格。请在表格中手动填写课程和时间段。';
    setStatus(importResult.message ? `${importResult.message} ${message}` : message, '', prefillRows.length > 0 ? 5000 : 0);
  }
  scheduleTableModal.classList.remove('hidden');
}

function closeScheduleTableModal() {
  scheduleTableModal.classList.add('hidden');
}

function addScheduleTableRow(timeRange = '', courses = [], sectionLabel = '') {
  const row = document.createElement('tr');
  const timeCell = document.createElement('td');
  const timeInput = document.createElement('input');
  timeInput.type = 'text';
  timeInput.inputMode = 'numeric';
  timeInput.maxLength = 11;
  timeInput.dataset.role = 'schedule-time';
  timeInput.dataset.sectionLabel = sectionLabel || '';
  timeInput.title = sectionLabel ? `${sectionLabel}，请填写具体时间，如 08:00-09:40` : '请填写具体时间，如 08:00-09:40';
  timeInput.value = formatTimeRangeInput(timeRange);
  timeInput.addEventListener('input', () => {
    timeInput.value = formatTimeRangeInput(timeInput.value);
  });
  timeCell.appendChild(timeInput);
  row.appendChild(timeCell);

  for (let index = 0; index < 7; index += 1) {
    const cell = document.createElement('td');
    const input = document.createElement('input');
    input.type = 'text';
    input.dataset.role = 'schedule-course';
    input.value = courses[index] || '';
    cell.appendChild(input);
    row.appendChild(cell);
  }

  const actionCell = document.createElement('td');
  actionCell.className = 'row-action-cell';
  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'delete-table-row';
  deleteButton.textContent = '-';
  deleteButton.setAttribute('aria-label', '删除这一行课表');
  deleteButton.title = '删除这一行';
  deleteButton.addEventListener('click', () => {
    row.remove();
    if (!scheduleTableBody.querySelector('tr')) {
      addScheduleTableRow();
      return;
    }
    refreshScheduleTableGuidance();
  });
  actionCell.appendChild(deleteButton);
  row.appendChild(actionCell);

  scheduleTableBody.appendChild(row);
  refreshScheduleTableGuidance();
}

function refreshScheduleTableGuidance() {
  Array.from(scheduleTableBody.querySelectorAll('tr')).forEach((row, rowIndex) => {
    const timeInput = row.querySelector('input[data-role="schedule-time"]');
    const courseInputs = Array.from(row.querySelectorAll('input[data-role="schedule-course"]'));
    if (timeInput) {
      timeInput.placeholder = timeInput.dataset.sectionLabel
        ? `${timeInput.dataset.sectionLabel}时间`
        : rowIndex === 0 ? '08:00-09:40' : '';
    }
    courseInputs.forEach((input) => {
      input.placeholder = rowIndex === 0 ? '课程名称' : '';
    });
  });
}

function readScheduleTemplateFromTable() {
  const rows = Array.from(scheduleTableBody.querySelectorAll('tr'))
    .map((row) => {
      const inputs = Array.from(row.querySelectorAll('input'));
      const timeRange = formatTimeRangeInput(inputs[0].value);
      const courses = inputs.slice(1, 8).map((input) => clean(input.value));
      return {
        timeRange,
        courses
      };
    })
    .filter((row) => row.timeRange && row.courses.some(Boolean));

  return {
    termStartDate: normalizeDate(termStartDate.value),
    termEndDate: normalizeDate(termEndDate.value),
    rows
  };
}

function buildTasksFromScheduleTemplate(template, dates) {
  const newTasks = [];

  template.rows.forEach((row, rowIndex) => {
    const timeRange = extractTimeRangeFromInput(row.timeRange);
    dates.forEach((date) => {
      const weekdayIndex = parseLocalDate(date).getDay();
      const courseIndex = weekdayIndex === 0 ? 6 : weekdayIndex - 1;
      const title = clean(row.courses[courseIndex]);
      if (!title) return;

      newTasks.push({
        id: `course-${Date.now()}-${rowIndex}-${date}`,
        title,
        startTime: timeRange ? timeRange.startTime : '',
        endTime: timeRange ? timeRange.endTime : '',
        date,
        weekday: weekdayFromDate(date),
        location: '',
        type: '课程',
        planDetails: '',
        details: '',
        status: '未评价',
        rawText: row.timeRange,
        sheetName: '手动课表',
        source: 'schedule-template',
        order: nextOrderForDate(date) + rowIndex * 10,
        isDraft: !timeRange
      });
    });
  });

  return newTasks;
}

function templateFromScheduleTasks(taskItems) {
  const rows = [];

  taskItems.forEach((task) => {
    const weekday = normalizeWeekday(task.weekday);
    const weekdayIndex = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'].indexOf(weekday);
    const title = clean(task.title);
    if (weekdayIndex < 0 || !title) return;

    const timeRange = task.startTime && task.endTime ? `${task.startTime}-${task.endTime}` : '';
    let row = rows.find((item) => item.timeRange === timeRange);
    if (!row) {
      row = {
        timeRange,
        courses: Array(7).fill('')
      };
      rows.push(row);
    }

    row.courses[weekdayIndex] = [row.courses[weekdayIndex], title].filter(Boolean).join(' / ');
  });

  return { rows };
}

async function saveScheduleTable() {
  commitDateInput(termStartDate);
  commitDateInput(termEndDate);
  const dates = enumerateDates(termStartDate.value, termEndDate.value);
  if (dates.length === 0) {
    setStatus('请填写有效的学期开始和结束日期。', '');
    return;
  }

  const template = readScheduleTemplateFromTable();
  const conflictedRows = markScheduleTimeConflicts(template.rows);
  if (conflictedRows.size > 0) {
    setStatus('课表时间段存在重叠冲突，已标红对应行。请修改后再生成课程安排。', '');
    return;
  }

  const newTasks = buildTasksFromScheduleTemplate(template, dates);

  if (template.rows.length === 0) {
    setStatus('课表里还没有可保存的课程。请至少填写一个时间段和课程名称。', '');
    return;
  }

  profile = {
    ...normalizedProfile(),
    scheduleTemplate: template
  };
  tasks = mergeTasks(removeGeneratedScheduleTasks(tasks), newTasks);
  setDateInputValue(taskDateFilter, dates[0]);
  activePlanningDates.add(dates[0]);
  await saveState();
  closeScheduleTableModal();
  renderAll();
  setStatus(`已生成 ${newTasks.length} 条课程安排。`, 'hidden');
}

function markScheduleTimeConflicts(rows) {
  const conflictedIndexes = findConflictingRangeIndexes(rows);
  Array.from(scheduleTableBody.querySelectorAll('tr')).forEach((row, index) => {
    const input = row.querySelector('input[data-role="schedule-time"]');
    if (!input) return;
    const conflicted = conflictedIndexes.has(index);
    input.classList.toggle('time-conflict', conflicted);
    row.classList.toggle('schedule-row-conflict', conflicted);
    input.title = conflicted
      ? '这个时间段与课表中的其他时间段冲突，请修改后再生成课程安排。'
      : input.dataset.sectionLabel ? `${input.dataset.sectionLabel}，请填写具体时间，如 08:00-09:40` : '请填写具体时间，如 08:00-09:40';
  });
  return conflictedIndexes;
}

function openDailyPlanTableModal() {
  closeImportChoiceModal();
  const defaultDate = taskDateFilter.value || formatLocalDate(currentEffectiveNow);
  dailyPlanSingleDay.checked = true;
  setDateInputValue(dailyPlanDate, defaultDate);
  setDateInputValue(dailyPlanStartDate, defaultDate);
  setDateInputValue(dailyPlanEndDate, defaultDate);
  syncDailyPlanDateMode();
  dailyPlanTableBody.innerHTML = '';
  addDailyPlanRow('09:00-11:30');
  addDailyPlanRow('14:00-17:30');
  dailyPlanTableModal.classList.remove('hidden');
}

function closeDailyPlanTableModal() {
  dailyPlanTableModal.classList.add('hidden');
}

function addDailyPlanRow(timeRange = '') {
  const row = document.createElement('tr');
  const timeCell = document.createElement('td');
  const timeInput = document.createElement('input');
  timeInput.type = 'text';
  timeInput.placeholder = '09:00-11:30';
  timeInput.value = timeRange;
  timeCell.appendChild(timeInput);

  const titleCell = document.createElement('td');
  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.placeholder = '做什么事';
  titleCell.appendChild(titleInput);

  const planCell = document.createElement('td');
  const planInput = document.createElement('input');
  planInput.type = 'text';
  planInput.placeholder = '具体要做什么，可不填';
  planCell.appendChild(planInput);

  const typeCell = document.createElement('td');
  typeCell.appendChild(createTypeSelect('工作'));

  row.append(timeCell, titleCell, planCell, typeCell);
  dailyPlanTableBody.appendChild(row);
}

function syncDailyPlanDateMode() {
  const singleDay = Boolean(dailyPlanSingleDay && dailyPlanSingleDay.checked);
  dailyPlanSingleDateRow.classList.toggle('hidden', !singleDay);
  dailyPlanRangeRow.classList.toggle('hidden', singleDay);

  if (singleDay) {
    setDateInputValue(dailyPlanDate, dailyPlanDate.value || dailyPlanStartDate.value || taskDateFilter.value || formatLocalDate(currentEffectiveNow));
    return;
  }

  const fallbackDate = dailyPlanDate.value || taskDateFilter.value || formatLocalDate(currentEffectiveNow);
  setDateInputValue(dailyPlanStartDate, dailyPlanStartDate.value || fallbackDate);
  setDateInputValue(dailyPlanEndDate, dailyPlanEndDate.value || dailyPlanStartDate.value);
  constrainDailyPlanEndDate();
}

function constrainDailyPlanEndDate() {
  if (!dailyPlanStartDate || !dailyPlanEndDate) return;
  const startDate = normalizeDate(dailyPlanStartDate.value);
  dailyPlanEndDate.min = startDate || '';
  if (startDate && normalizeDate(dailyPlanEndDate.value) && normalizeDate(dailyPlanEndDate.value) < startDate) {
    setDateInputValue(dailyPlanEndDate, startDate);
  }
}

async function saveDailyPlanTable() {
  const dates = selectedDailyPlanDates();
  if (dates.length === 0) {
    setStatus('请先选择有效的安排日期。', '');
    return;
  }

  const planRows = Array.from(dailyPlanTableBody.querySelectorAll('tr'))
    .map((row, index) => {
      const timeInput = row.querySelector('td:nth-child(1) input');
      const titleInput = row.querySelector('td:nth-child(2) input');
      const planInput = row.querySelector('td:nth-child(3) input');
      const typeSelect = row.querySelector('select');
      const timeRange = extractTimeRangeFromInput(timeInput.value);
      const title = clean(titleInput.value);
      const planDetails = clean(planInput.value);
      if (!timeRange || !title) return null;

      return {
        title,
        planDetails,
        timeRange,
        type: normalizeTaskType(typeSelect.value, title),
        index
      };
    })
    .filter(Boolean);

  if (planRows.length === 0) {
    setStatus('请至少填写一条有效的时间段和任务。', '');
    return;
  }

  const orderCounters = new Map();
  const newTasks = [];
  dates.forEach((date) => {
    planRows.forEach((planRow) => {
      newTasks.push({
        id: `daily-${Date.now()}-${date}-${planRow.index}`,
        title: planRow.title,
        startTime: planRow.timeRange.startTime,
        endTime: planRow.timeRange.endTime,
        date,
        weekday: weekdayFromDate(date),
        location: '',
        type: planRow.type,
        planDetails: planRow.planDetails,
        details: '',
        status: '未评价',
        rawText: '',
        sheetName: '手动安排',
        order: nextOrderForDate(date, orderCounters) + planRow.index * 10,
        isDraft: false
      });
    });
  });

  tasks = mergeTasks(tasks, newTasks);
  setDateInputValue(taskDateFilter, dates[0]);
  dates.forEach((date) => activePlanningDates.add(date));
  await saveState();
  closeDailyPlanTableModal();
  renderAll();
  setStatus(dates.length === 1
    ? `已生成 ${newTasks.length} 条当日安排。`
    : `已生成 ${dates[0]} 至 ${dates[dates.length - 1]} 的 ${newTasks.length} 条安排。`, 'hidden');
}

function selectedDailyPlanDates() {
  commitDateInput(dailyPlanDate);
  commitDateInput(dailyPlanStartDate);
  commitDateInput(dailyPlanEndDate);
  if (dailyPlanSingleDay && dailyPlanSingleDay.checked) {
    const date = normalizeDate(dailyPlanDate.value);
    return date ? [date] : [];
  }

  constrainDailyPlanEndDate();
  return enumerateDates(normalizeDate(dailyPlanStartDate.value), normalizeDate(dailyPlanEndDate.value));
}

function handleDragOver(event) {
  event.preventDefault();
  event.currentTarget.classList.add('drag-over');
}

function handleDragLeave(event) {
  event.currentTarget.classList.remove('drag-over');
}

function handleDrop(event) {
  event.preventDefault();
  event.currentTarget.classList.remove('drag-over');

  const file = event.dataTransfer.files && event.dataTransfer.files[0];
  if (!file) return;
  importDroppedFile(file);
}

function renderTasks(options = {}) {
  const selectedDate = clean(taskDateFilter.value);
  const visibleTasks = selectedDate
    ? tasks.filter((task) => isRenderableTask(task) && normalizeDate(task.date) === selectedDate)
    : tasks.filter(isRenderableTask);
  renderTaskDurationSummary(visibleTasks);
  emptyState.classList.add('hidden');
  taskWorkspace.classList.remove('hidden');
  taskList.innerHTML = '';

  const sortedTasks = sortTasksForDisplay(visibleTasks);
  const conflictingTaskIds = findConflictingTaskIds(sortedTasks);

  sortedTasks.forEach((task) => {
    const card = document.createElement('article');
    card.className = 'task-card';
    const hasTimeConflict = conflictingTaskIds.has(task.id);
    if (hasTimeConflict) {
      card.classList.add('task-time-conflict');
      card.title = '这个时间段与同一天的其他任务冲突，请修改开始或结束时间。';
    }
    card.dataset.taskId = task.id;
    card.addEventListener('dragover', handleTaskDragOver);
    card.addEventListener('drop', handleTaskDrop);

    const time = document.createElement('div');
    time.className = 'task-time task-time-editor';
    time.classList.toggle('task-time-conflict-text', hasTimeConflict);
    const startInput = createInlineInput('time', task.startTime, '开始时间');
    startInput.classList.add('time-input');
    startInput.classList.toggle('time-conflict', hasTimeConflict);
    const separator = document.createElement('span');
    separator.textContent = '-';
    const endInput = createInlineInput('time', task.endTime, '结束时间');
    endInput.classList.add('time-input');
    endInput.classList.toggle('time-conflict', hasTimeConflict);
    startInput.addEventListener('blur', () => updateTaskField(task.id, 'startTime', startInput.value));
    endInput.addEventListener('blur', () => updateTaskField(task.id, 'endTime', endInput.value));
    time.append(startInput, separator, endInput);

    const body = document.createElement('div');
    body.className = 'task-body-editor';
    const title = createInlineInput('text', task.title, '任务条目');
    title.className = 'inline-field task-title-input';
    title.addEventListener('blur', () => updateTaskField(task.id, 'title', title.value));
    title.addEventListener('keydown', blurOnEnter);
    const meta = document.createElement('div');
    meta.className = 'task-meta';
    const typeSelect = createTypeSelect(task.type || inferTaskType(task.title));
    typeSelect.addEventListener('change', () => updateTaskField(task.id, 'type', typeSelect.value));
    meta.appendChild(typeSelect);
    const locationText = formatMeta(task);
    if (locationText) {
      const location = document.createElement('span');
      location.textContent = locationText;
      meta.appendChild(location);
    }
    const planDetails = document.createElement('textarea');
    planDetails.className = 'inline-field task-plan-input';
    planDetails.placeholder = '事前计划：具体要做什么';
    planDetails.value = task.planDetails || '';
    planDetails.addEventListener('blur', () => updateTaskField(task.id, 'planDetails', planDetails.value));
    body.append(title);
    body.appendChild(meta);
    body.appendChild(planDetails);

    const actions = document.createElement('div');
    actions.className = 'task-card-actions';
    const deleteButton = document.createElement('button');
    deleteButton.className = 'task-delete-button';
    deleteButton.type = 'button';
    deleteButton.setAttribute('aria-label', '删除条目');
    deleteButton.textContent = '×';
    deleteButton.addEventListener('click', () => deleteTask(task.id));
    const detailButton = document.createElement('button');
    detailButton.className = `task-action-button status-${statusClass(task.status)}`;
    detailButton.type = 'button';
    detailButton.textContent = hasTaskDetail(task) ? '查看详情' : '填写详情';
    detailButton.addEventListener('click', () => openTaskEditModal(task.id, 'details'));
    const dragHandle = document.createElement('div');
    dragHandle.className = 'drag-handle';
    dragHandle.draggable = true;
    dragHandle.title = '长按拖动调整顺序';
    dragHandle.textContent = '≡';
    dragHandle.addEventListener('dragstart', (event) => handleTaskDragStart(event, task.id));
    dragHandle.addEventListener('dragend', handleTaskDragEnd);
    actions.append(deleteButton, detailButton, dragHandle);

    card.append(time, body, actions);
    taskList.appendChild(card);
  });

  taskList.appendChild(createAddTaskRow());
  updateTaskTemporalView({
    scrollToCurrent: Boolean(options.scrollToCurrent),
    forceScroll: Boolean(options.forceScroll)
  });
}

function renderTaskDurationSummary(dayTasks) {
  if (!taskDurationSummary) return;

  const minutesByType = sumTaskMinutesByType(dayTasks);
  const parts = TASK_SUMMARY_TYPES
    .filter((type) => minutesByType[type] > 0)
    .map((type) => `${type}：${formatDurationHours(minutesByType[type])}`);

  taskDurationSummary.innerHTML = '';
  parts.forEach((part) => {
    const item = document.createElement('span');
    item.textContent = part;
    taskDurationSummary.appendChild(item);
  });
  taskDurationSummary.classList.toggle('hidden', parts.length === 0);
}

function renderProfileStats() {
  if (!profileStatsSummary || !profileStatsBars || !profileStatsPie || !profileStatsStartDate || !profileStatsPeriod) return;

  if (!committedProfileStatsStartDate) {
    committedProfileStatsStartDate = formatLocalDate(currentEffectiveNow || new Date());
  }
  if (!profileStatsStartDate.value || document.activeElement !== profileStatsStartDate) {
    setDateInputValue(profileStatsStartDate, committedProfileStatsStartDate);
  }

  const range = dateRangeForProfileStats(
    profileStatsPeriod.value || 'week',
    committedProfileStatsStartDate
  );
  const rangeDates = enumerateDates(range.start, range.end);
  const rangeTasks = tasks.filter((task) => {
    const date = normalizeDate(task.date);
    return isRenderableTask(task) && date && date >= range.start && date <= range.end;
  });
  const scheduledDates = new Set(rangeTasks.map((task) => normalizeDate(task.date)).filter(Boolean));
  const evaluatedTasks = rangeTasks.filter(hasTaskDetail);
  const minutesByType = sumTaskMinutesByType(rangeTasks);
  const totalMinutes = Object.values(minutesByType).reduce((sum, minutes) => sum + minutes, 0);
  const averageDenominator = Math.max(scheduledDates.size, 1);

  if (profileStatsRangeText) {
    profileStatsRangeText.textContent = `${range.start} 至 ${range.end}`;
  }

  profileStatsSummary.innerHTML = '';
  [
    ['安排天数', `${scheduledDates.size} 天`, `范围内共 ${rangeDates.length} 天`],
    ['安排任务', `${rangeTasks.length} 个`, '可显示在任务页的条目'],
    ['已评价任务', `${evaluatedTasks.length} 个`, `${formatPercent(evaluatedTasks.length, rangeTasks.length)} 已评价`],
    ['总安排时长', formatDurationHours(totalMinutes), `平均值按 ${scheduledDates.size || 0} 个有安排的日期计算`]
  ].forEach(([label, value, helper]) => {
    const card = document.createElement('div');
    card.className = 'stat-card';
    const title = document.createElement('span');
    title.textContent = label;
    const strong = document.createElement('strong');
    strong.textContent = value;
    const note = document.createElement('small');
    note.textContent = helper;
    card.append(title, strong, note);
    profileStatsSummary.appendChild(card);
  });

  profileStatsBars.innerHTML = '';
  profileStatsPie.innerHTML = '';
  const averageByType = TASK_SUMMARY_TYPES
    .map((type) => ({
      type,
      minutes: (minutesByType[type] || 0) / averageDenominator
    }))
    .filter((item) => item.minutes > 0);
  const maxAverage = Math.max(...averageByType.map((item) => item.minutes), 1);

  if (averageByType.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'stats-empty muted';
    empty.textContent = '这个范围内还没有可统计的任务安排。';
    profileStatsBars.appendChild(empty);
    renderProfileStatsPie([]);
    return;
  }

  renderProfileStatsPie(averageByType);

  averageByType.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'stats-bar-row';
    const label = document.createElement('span');
    label.className = 'stats-bar-label';
    label.textContent = item.type;
    const track = document.createElement('div');
    track.className = 'stats-bar-track';
    const fill = document.createElement('div');
    fill.className = `stats-bar-fill type-${normalizeTaskTypeForClass(item.type)}`;
    fill.style.width = `${Math.max(6, (item.minutes / maxAverage) * 100)}%`;
    track.appendChild(fill);
    const value = document.createElement('span');
    value.className = 'stats-bar-value';
    value.textContent = formatDurationHours(item.minutes);
    row.append(label, track, value);
    profileStatsBars.appendChild(row);
  });
}

function renderProfileStatsPie(items) {
  if (!profileStatsPie) return;
  profileStatsPie.innerHTML = '';

  const total = items.reduce((sum, item) => sum + item.minutes, 0);
  const pie = document.createElement('div');
  pie.className = 'stats-pie';

  if (total <= 0) {
    pie.classList.add('stats-pie-empty');
    pie.textContent = '暂无';
    profileStatsPie.appendChild(pie);
    return;
  }

  let cursor = 0;
  const segments = items.map((item) => {
    const start = cursor;
    cursor += (item.minutes / total) * 100;
    return `${taskTypeColor(item.type)} ${start}% ${cursor}%`;
  });
  pie.style.background = `conic-gradient(${segments.join(', ')})`;
  pie.setAttribute('aria-label', `平均每日任务时长占比：${items.map((item) => `${item.type}${formatPercent(item.minutes, total)}`).join('，')}`);

  const legend = document.createElement('div');
  legend.className = 'stats-pie-legend';
  items.forEach((item) => {
    const row = document.createElement('span');
    const swatch = document.createElement('i');
    swatch.style.background = taskTypeColor(item.type);
    const text = document.createElement('span');
    text.textContent = `${item.type} ${formatPercent(item.minutes, total)}`;
    row.append(swatch, text);
    legend.appendChild(row);
  });

  profileStatsPie.append(pie, legend);
}

function renderAll() {
  populateJournalTagSelects();
  renderJournalTagSettings();
  renderTasks();
  renderJournalList();
  renderSelectedJournal();
  renderProfileStats();
}

function showPage(page) {
  navItems.forEach((navItem) => {
    navItem.classList.toggle('active', navItem.dataset.page === page);
  });
  Object.values(pages).forEach((section) => section.classList.remove('active'));
  pages[page].classList.add('active');
  pageTitle.textContent = pageTitleFor(page);
  if (page === 'profile') renderProfileStats();
}

async function goToCurrentTask() {
  const now = await getEffectiveNow();
  currentEffectiveNow = now;
  const date = formatLocalDate(now);
  setDateInputValue(taskDateFilter, date);
  activePlanningDates.add(date);
  showPage('tasks');
  renderTasks({ scrollToCurrent: true, forceScroll: true });
}

function mergeTasks(currentTasks, importedTasks) {
  const taskMap = new Map(currentTasks.map((task) => [taskIdentity(task), task]));
  const orderCounters = new Map();
  const normalized = importedTasks.map((task, index) => {
    const date = normalizeDate(task.date);
    const order = Number.isFinite(Number(task.order))
      ? Number(task.order)
      : nextOrderForDate(date, orderCounters);

    return {
      id: task.id || `task-${Date.now()}-${index}`,
      title: clean(task.title),
      startTime: clean(task.startTime),
      endTime: clean(task.endTime),
      date,
      weekday: clean(task.weekday),
      location: clean(task.location),
      type: normalizeTaskType(task.type, task.title),
      planDetails: clean(task.planDetails),
      details: clean(task.details),
      status: clean(task.status) || '未评价',
      rawText: clean(task.rawText),
      sheetName: clean(task.sheetName),
      source: clean(task.source),
      order,
      isDraft: Boolean(task.isDraft)
    };
  });

  normalized.forEach((task) => {
    taskMap.set(taskIdentity(task), task);
  });

  return Array.from(taskMap.values());
}

function beginManualPlanning() {
  const selectedDate = ensureSelectedDate();
  activePlanningDates.add(selectedDate);
  renderTasks();
}

async function addTaskForSelectedDate() {
  const date = ensureSelectedDate();
  activePlanningDates.add(date);
  const task = createBlankTask(date);
  tasks = mergeTasks(tasks, [task]);
  await saveState();
  renderTasks();

  requestAnimationFrame(() => {
    const titleInput = taskList.querySelector(`[data-task-id="${task.id}"] .task-title-input`);
    if (titleInput) titleInput.focus();
  });
}

async function reusePreviousDay() {
  closeImportChoiceModal();
  const date = ensureSelectedDate();
  const previousDate = shiftDate(date, -1);
  const previousTasks = sortTasksForDisplay(tasks.filter((task) => {
    return isRenderableTask(task) && normalizeDate(task.date) === previousDate;
  }));

  if (previousTasks.length === 0) {
    activePlanningDates.add(date);
    renderTasks();
    setStatus(`前一天 ${previousDate} 没有可复用的安排。`, '', 5000);
    return;
  }

  const clones = previousTasks.map((task, index) => ({
    id: `reuse-${Date.now()}-${index}`,
    title: clean(task.title),
    startTime: clean(task.startTime),
    endTime: clean(task.endTime),
    date,
    weekday: weekdayFromDate(date),
    location: clean(task.location),
    type: normalizeTaskType(task.type, task.title),
    planDetails: '',
    details: '',
    status: '未评价',
    rawText: '',
    sheetName: '',
    order: nextOrderForDate(date) + index * 10,
    isDraft: false
  }));

  tasks = mergeTasks(tasks, clones);
  activePlanningDates.add(date);
  await saveState();
  renderTasks();
  setStatus(`已从 ${previousDate} 复用 ${clones.length} 条安排。`, 'hidden');
}

function createBlankTask(date) {
  return {
    id: `manual-${Date.now()}`,
    title: '',
    startTime: '',
    endTime: '',
    date,
    weekday: '',
    location: '',
    type: '工作',
    planDetails: '',
    details: '',
    status: '未评价',
    rawText: '',
    sheetName: '',
    source: 'manual',
    order: nextOrderForDate(date),
    isDraft: true
  };
}

function removeGeneratedScheduleTasks(taskItems) {
  return taskItems.filter((task) => {
    if (task.source === 'schedule-template') return false;
    return !(task.type === '课程' && task.sheetName === '手动课表');
  });
}

function createAddTaskRow() {
  const row = document.createElement('button');
  row.className = 'add-task-row';
  row.type = 'button';
  row.textContent = '+';
  row.setAttribute('aria-label', '新增一条安排');
  row.addEventListener('click', addTaskForSelectedDate);
  return row;
}

function createInlineInput(type, value, label) {
  const input = document.createElement('input');
  input.className = 'inline-field';
  input.type = type;
  input.value = clean(value);
  input.setAttribute('aria-label', label);
  return input;
}

function createTypeSelect(value) {
  const select = document.createElement('select');
  select.className = `task-type-select type-${normalizeTaskType(value)}`;
  select.setAttribute('aria-label', '任务标签');

  TASK_TYPES.forEach((type) => {
    const option = document.createElement('option');
    option.value = type;
    option.textContent = type;
    select.appendChild(option);
  });

  select.value = normalizeTaskType(value);
  select.addEventListener('change', () => {
    select.className = `task-type-select type-${normalizeTaskType(select.value)}`;
  });
  return select;
}

function blurOnEnter(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    event.currentTarget.blur();
  }
}

async function updateTaskField(taskId, field, value) {
  const task = tasks.find((item) => item.id === taskId);
  if (!task) return;

  task[field] = clean(value);
  if (field === 'type') {
    task.type = normalizeTaskType(value, task.title);
  }
  if (['title', 'startTime', 'endTime', 'planDetails'].includes(field)) {
    task.isDraft = !clean(task.title) || !clean(task.startTime) || !clean(task.endTime);
  }

  await saveState();
  renderTasks();
}

async function deleteTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId);
  await saveState();
  renderTasks();
}

function handleTaskDragStart(event, taskId) {
  draggedTaskId = taskId;
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', taskId);
}

function handleTaskDragEnd() {
  draggedTaskId = '';
  document.querySelectorAll('.task-card.drag-target').forEach((card) => card.classList.remove('drag-target'));
}

function handleTaskDragOver(event) {
  if (!draggedTaskId) return;
  event.preventDefault();
  event.currentTarget.classList.add('drag-target');
}

async function handleTaskDrop(event) {
  event.preventDefault();
  const targetId = event.currentTarget.dataset.taskId;
  event.currentTarget.classList.remove('drag-target');

  if (!draggedTaskId || !targetId || draggedTaskId === targetId) return;

  const selectedDate = clean(taskDateFilter.value);
  const visibleIds = sortTasksForDisplay(tasks.filter((task) => isRenderableTask(task) && normalizeDate(task.date) === selectedDate))
    .map((task) => task.id);
  const fromIndex = visibleIds.indexOf(draggedTaskId);
  const toIndex = visibleIds.indexOf(targetId);

  if (fromIndex < 0 || toIndex < 0) return;

  visibleIds.splice(fromIndex, 1);
  visibleIds.splice(toIndex, 0, draggedTaskId);
  visibleIds.forEach((id, index) => {
    const task = tasks.find((item) => item.id === id);
    if (task) task.order = (index + 1) * 10;
  });

  await saveState();
  draggedTaskId = '';
  renderTasks();
}

function sortTasksForDisplay(taskItems) {
  return [...taskItems].sort((a, b) => {
    const orderA = Number.isFinite(Number(a.order)) ? Number(a.order) : Number.MAX_SAFE_INTEGER;
    const orderB = Number.isFinite(Number(b.order)) ? Number(b.order) : Number.MAX_SAFE_INTEGER;
    if (orderA !== orderB) return orderA - orderB;
    return normalizeTime(a.startTime).localeCompare(normalizeTime(b.startTime));
  });
}

function updateTaskTemporalView(options = {}) {
  if (!pages.tasks.classList.contains('active') || taskWorkspace.classList.contains('hidden')) return;

  const selectedDate = normalizeDate(taskDateFilter.value);
  const now = currentEffectiveNow;
  const today = formatLocalDate(now);
  const isToday = selectedDate === today;
  const isPastDate = selectedDate && selectedDate < today;
  const isFutureDate = selectedDate && selectedDate > today;
  let currentTaskId = '';

  taskList.querySelectorAll('.task-card').forEach((card) => {
    const task = tasks.find((item) => item.id === card.dataset.taskId);
    card.classList.remove('task-past', 'task-current', 'task-future');
    if (!task) return;

    if (isPastDate) {
      card.classList.add('task-past');
      return;
    }

    if (isFutureDate) {
      card.classList.add('task-future');
      return;
    }

    if (!isToday) return;

    const stage = classifyTaskStage(task, now);
    if (!stage) return;
    card.classList.add(`task-${stage}`);
    if (stage === 'current' && !currentTaskId) currentTaskId = task.id;
  });

  if (!options.scrollToCurrent || !currentTaskId || draggedTaskId) {
    highlightedTaskId = currentTaskId;
    return;
  }

  if (!options.forceScroll && highlightedTaskId === currentTaskId) return;

  const currentCard = Array.from(taskList.querySelectorAll('.task-card'))
    .find((card) => card.dataset.taskId === currentTaskId);
  if (currentCard) {
    const top = Math.max(0, currentCard.offsetTop - taskList.offsetTop);
    taskList.scrollTo({ top, behavior: options.forceScroll ? 'auto' : 'smooth' });
  }

  highlightedTaskId = currentTaskId;
}

function classifyTaskStage(task, now) {
  const start = timeToMinutes(task.startTime);
  const end = timeToMinutes(task.endTime);
  if (start === null || end === null) return '';

  const current = now.getHours() * 60 + now.getMinutes();
  if (start === end) return '';

  if (end < start) {
    if (current >= start || current < end) return 'current';
    return 'future';
  }

  if (current < start) return 'future';
  if (current >= end) return 'past';
  return 'current';
}

function checkDueReminders(now) {
  const date = formatLocalDate(now);
  const todayTasks = tasks.filter((task) => isRenderableTask(task) && normalizeDate(task.date) === date);
  const currentCheckValue = reminderCheckValue(now);
  const previousCheckValue = lastReminderCheckValue;
  const duePreviousValue = reminderPreviousValue(previousCheckValue, currentCheckValue);
  const dueReminders = [];
  lastReminderCheckValue = currentCheckValue;

  todayTasks.forEach((task, taskIndex) => {
    buildReminderEvents(task).forEach((event) => {
      const eventCheckValue = dayStartCheckValue(now) + event.minute;
      if (!isReminderDue(duePreviousValue, currentCheckValue, eventCheckValue)) return;
      const key = `${date}|${task.id}|${event.kind}|${event.minute}`;
      if (firedReminderKeys.has(key)) return;

      firedReminderKeys.add(key);
      dueReminders.push({
        minute: event.minute,
        priority: reminderEventPriority(event.kind),
        order: Number.isFinite(task.order) ? task.order : taskIndex,
        payload: {
          title: '日织提醒',
          body: event.message
        }
      });
    });
  });

  dueReminders
    .sort((a, b) => a.minute - b.minute || a.priority - b.priority || a.order - b.order)
    .forEach((item) => showReminderMessage(item.payload));

  trimOldReminderKeys(date);
}

function reminderPreviousValue(previousValue, currentValue) {
  if (previousValue === null) return null;
  if (currentValue < previousValue) return currentValue - 1;
  if (currentValue - previousValue > MISSED_REMINDER_BACKLOG_LIMIT_MINUTES) return currentValue - 1;
  return previousValue;
}

async function showReminderMessage(payload) {
  try {
    const result = await window.whbr.showReminder(payload);
    if (result && result.error) {
      console.warn(result.error);
    }
  } catch (error) {
    console.warn(error);
  }
}

function isReminderDue(previousValue, currentValue, eventValue) {
  if (previousValue === null) return eventValue === currentValue;
  if (currentValue < previousValue) return eventValue === currentValue;
  return eventValue > previousValue && eventValue <= currentValue;
}

function reminderCheckValue(date) {
  return dayStartCheckValue(date) + date.getHours() * 60 + date.getMinutes();
}

function reminderEventPriority(kind) {
  if (/end|break/.test(kind)) return 0;
  if (/start|focus|next/.test(kind)) return 1;
  return 2;
}

function dayStartCheckValue(date) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor(start.getTime() / 60000);
}

function buildReminderEvents(task) {
  const start = timeToMinutes(task.startTime);
  const end = timeToMinutes(task.endTime);
  if (start === null || end === null || start === end) return [];

  const profileData = normalizedProfile();
  const type = normalizeTaskType(task.type, task.title);
  const title = clean(task.title) || '当前安排';
  const events = [];

  if (type === '课程') {
    addReminderEvent(events, start, 'course-start', `${title} 要上课了，专注听讲。`);
    addReminderEvent(events, end, 'course-end', `${title} 下课了，休息一下。`);
    addRepeatingReminderEvents(events, start, end, profileData.classDuration, profileData.classBreakLength, {
      focusKind: 'course-next',
      breakKind: 'course-break',
      focusMessage: `${title} 要继续上课了，专注听讲。`,
      breakMessage: `${title} 下课了，休息一下。`
    });
    return dedupeEvents(events);
  }

  if (type === '工作' || type === '学习') {
    const action = type === '学习' ? '学习' : '工作';
    addReminderEvent(events, start, `${type}-start`, `要${action}了，高效专注。`);
    addReminderEvent(events, end, `${type}-end`, `${title} 结束了，休息一下。`);
    if (profileData.breakReminder) {
      addRepeatingReminderEvents(events, start, end, profileData.workFocusLength, profileData.workBreakLength, {
        focusKind: `${type}-focus`,
        breakKind: `${type}-break`,
        focusMessage: `要${action}了，高效专注。`,
        breakMessage: `${action}很久了，起来活动一下吧。`
      });
    }
    return dedupeEvents(events);
  }

  addReminderEvent(events, start, 'life-start', `${title} 开始了。`);
  addReminderEvent(events, end, 'life-end', `${title} 结束了，稍微整理一下状态。`);
  return dedupeEvents(events);
}

function addRepeatingReminderEvents(events, start, end, focusMinutes, breakMinutes, config) {
  const focusLengthMinutes = numericSetting(focusMinutes, 50);
  const breakLengthMinutes = numericSetting(breakMinutes, 10);
  let cursor = start;
  let cycle = 0;

  while (cursor < end && cycle < 40) {
    const breakAt = cursor + focusLengthMinutes;
    if (breakAt < end) addReminderEvent(events, breakAt, `${config.breakKind}-${cycle}`, config.breakMessage);

    const focusAt = breakAt + breakLengthMinutes;
    if (focusAt < end) addReminderEvent(events, focusAt, `${config.focusKind}-${cycle}`, config.focusMessage);

    cursor = focusAt;
    cycle += 1;
  }
}

function addReminderEvent(events, minute, kind, message) {
  if (!Number.isFinite(minute) || minute < 0 || minute >= 24 * 60) return;
  events.push({ minute, kind, message });
}

function dedupeEvents(events) {
  const seen = new Set();
  return events.filter((event) => {
    const key = `${event.minute}|${event.kind}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function trimOldReminderKeys(currentDate) {
  firedReminderKeys.forEach((key) => {
    if (!key.startsWith(`${currentDate}|`)) firedReminderKeys.delete(key);
  });
}

function timeToMinutes(value) {
  const match = clean(value).match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

function taskDurationMinutes(task) {
  const start = timeToMinutes(task.startTime);
  const end = timeToMinutes(task.endTime);
  if (start === null || end === null || start === end) return 0;
  return end > start ? end - start : (24 * 60 - start) + end;
}

function taskSummaryType(task) {
  const explicitType = clean(task.type);
  if (!explicitType) return '未分配';
  return TASK_TYPES.includes(explicitType) ? explicitType : '未分配';
}

function sumTaskMinutesByType(taskItems) {
  return taskItems.reduce((summary, task) => {
    const minutes = taskDurationMinutes(task);
    if (minutes <= 0) return summary;
    const type = taskSummaryType(task);
    summary[type] = (summary[type] || 0) + minutes;
    return summary;
  }, Object.fromEntries(TASK_SUMMARY_TYPES.map((type) => [type, 0])));
}

function formatDurationHours(minutes) {
  if (!Number.isFinite(minutes) || minutes <= 0) return '0小时';
  const hours = minutes / 60;
  const rounded = Math.round(hours * 10) / 10;
  return `${Number.isInteger(rounded) ? rounded : rounded.toFixed(1)}小时`;
}

function formatPercent(value, total) {
  if (!total) return '0%';
  return `${Math.round((value / total) * 100)}%`;
}

function normalizeTaskTypeForClass(type) {
  if (type === '课程') return 'course';
  if (type === '学习') return 'study';
  if (type === '生活') return 'life';
  if (type === '未分配') return 'unassigned';
  return 'work';
}

function taskTypeColor(type) {
  if (type === '课程') return '#a86bc9';
  if (type === '学习') return '#b9892e';
  if (type === '生活') return '#7aa35e';
  if (type === '未分配') return '#8b96a3';
  return '#2e8f65';
}

function dateRangeForProfileStats(rangeType, baseDate) {
  const parsedBase = parseLocalDate(normalizeDate(baseDate));
  const base = parsedBase || new Date();
  const start = new Date(base.getFullYear(), base.getMonth(), base.getDate());
  const end = new Date(start);

  if (rangeType === 'day') {
    return { start: formatLocalDate(start), end: formatLocalDate(end) };
  }

  if (rangeType === 'week') {
    end.setTime(start.getTime());
    end.setDate(start.getDate() + 6);
    return { start: formatLocalDate(start), end: formatLocalDate(end) };
  }

  if (rangeType === 'month') {
    end.setMonth(start.getMonth() + 1, start.getDate() - 1);
    return { start: formatLocalDate(start), end: formatLocalDate(end) };
  }

  if (rangeType === 'quarter') {
    end.setMonth(start.getMonth() + 3, start.getDate() - 1);
    return { start: formatLocalDate(start), end: formatLocalDate(end) };
  }

  end.setFullYear(start.getFullYear() + 1, start.getMonth(), start.getDate() - 1);
  return { start: formatLocalDate(start), end: formatLocalDate(end) };
}

function findConflictingTaskIds(taskItems) {
  const conflicted = new Set();
  const byDate = new Map();

  taskItems.forEach((task) => {
    const date = normalizeDate(task.date);
    if (!date) return;
    if (!byDate.has(date)) byDate.set(date, []);
    byDate.get(date).push(task);
  });

  byDate.forEach((dayTasks) => {
    const indexes = findConflictingRangeIndexes(dayTasks);
    indexes.forEach((index) => {
      if (dayTasks[index] && dayTasks[index].id) conflicted.add(dayTasks[index].id);
    });
  });

  return conflicted;
}

function findConflictingRangeIndexes(items) {
  const conflicted = new Set();
  const ranges = items.map((item, index) => ({
    index,
    intervals: item.startTime || item.endTime
      ? rangeToComparableIntervals(item.startTime, item.endTime)
      : inputRangeToComparableIntervals(item.timeRange)
  })).filter((item) => item.intervals.length > 0);

  for (let firstIndex = 0; firstIndex < ranges.length; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < ranges.length; secondIndex += 1) {
      if (!rangesOverlap(ranges[firstIndex].intervals, ranges[secondIndex].intervals)) continue;
      conflicted.add(ranges[firstIndex].index);
      conflicted.add(ranges[secondIndex].index);
    }
  }

  return conflicted;
}

function inputRangeToComparableIntervals(value) {
  const timeRange = extractTimeRangeFromInput(value);
  if (!timeRange) return [];
  return rangeToComparableIntervals(timeRange.startTime, timeRange.endTime);
}

function rangeToComparableIntervals(startTime, endTime) {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  if (start === null || end === null || start === end) return [];
  if (end > start) return [[start, end], [start + 1440, end + 1440]];
  return [[start, end + 1440], [start - 1440, end]];
}

function rangesOverlap(firstIntervals, secondIntervals) {
  return firstIntervals.some(([firstStart, firstEnd]) => (
    secondIntervals.some(([secondStart, secondEnd]) => firstStart < secondEnd && secondStart < firstEnd)
  ));
}

function nextOrderForDate(date, counters = null) {
  const normalizedDate = normalizeDate(date);
  const counterKey = normalizedDate || '__all__';

  if (counters && counters.has(counterKey)) {
    const next = counters.get(counterKey) + 10;
    counters.set(counterKey, next);
    return next;
  }

  const maxOrder = tasks
    .filter((task) => normalizeDate(task.date) === normalizedDate)
    .reduce((max, task) => Math.max(max, Number(task.order) || 0), 0);
  const next = maxOrder + 10;

  if (counters) counters.set(counterKey, next);
  return next;
}

function ensureSelectedDate() {
  if (!taskDateFilter.value) {
    setDateInputValue(taskDateFilter, formatLocalDate(new Date()));
  }

  return clean(taskDateFilter.value);
}

function mergeJournals(currentJournals, importedJournals) {
  const journalMap = new Map(currentJournals.map((journal) => [journalIdentity(journal), journal]));

  importedJournals.forEach((journal) => {
    const key = journalIdentity(journal);
    const tagId = normalizeJournalTagId(journal.tagId) || legacyRatingToTagId(journal.rating);
    if (!key || (!journal.content && !tagId)) return;

    journalMap.set(key, {
      id: journal.id || `journal-${Date.now()}`,
      date: journalPrimaryDate(journal),
      dateRangeStart: normalizeDate(journal.dateRangeStart),
      dateRangeEnd: normalizeDate(journal.dateRangeEnd),
      sheetName: clean(journal.sheetName),
      content: clean(journal.content),
      tagId: normalizeJournalTagId(tagId),
      source: clean(journal.source) || 'manual',
      updatedAt: new Date().toISOString()
    });
  });

  return Array.from(journalMap.values()).sort(compareJournals);
}

function normalizeJournalCollection(items) {
  return mergeJournals([], items);
}

async function saveSelectedJournal() {
  commitDateInput(journalDate);
  const date = clean(journalDate.value);
  const content = clean(journalContent.value);
  const tagId = normalizeJournalTagId(journalTag ? journalTag.value : '');

  if (!date) {
    journalSaveState.textContent = '请先选择日期';
    return;
  }

  journals = mergeJournals(journals, [{
    id: `journal-${date}`,
    date,
    sheetName: '',
    content,
    tagId,
    source: 'manual'
  }]);

  if (!content && !tagId) {
    journals = journals.filter((journal) => journalPrimaryDate(journal) !== date);
  }

  await saveState();
  renderJournalList();
  journalSaveState.textContent = content ? '已保存' : '已清空';
}

function renderSelectedJournal() {
  const date = clean(journalDate.value);
  const journal = findJournalForDate(normalizeDate(date), date);
  journalContent.value = journal ? journal.content : '';
  if (journalTag) journalTag.value = normalizeJournalTagId(journal && journal.tagId);
  renderTagPicker(journalTag, journalTagPaletteButton, journalTagPalette);
  journalSaveState.textContent = journal ? '已加载' : '尚未保存';
}

function renderJournalList() {
  ensureJournalViewDate();
  journalList.innerHTML = '';

  const visibleJournals = filteredJournalsForList();

  if (visibleJournals.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'muted';
    empty.textContent = journals.length === 0
      ? '还没有每日记录。可以手动保存，也可以从表格文件中的记录内容或批注导入。'
      : '没有符合当前筛选条件的记录。';
    journalList.appendChild(empty);
    return;
  }

  visibleJournals.forEach((journal) => {
    const item = document.createElement('button');
    item.className = 'journal-item';
    item.type = 'button';
    item.addEventListener('click', () => {
      openJournalEntry(journal);
    });

    const title = document.createElement('strong');
    title.innerHTML = '';
    title.append(document.createTextNode(journalDisplayDate(journal)));
    const tagBadge = createJournalTagBadge(journal.tagId);
    if (tagBadge) title.appendChild(tagBadge);
    const preview = document.createElement('span');
    preview.textContent = journal.content || '这一天还没有填写生活记录。';
    item.append(title, preview);
    journalList.appendChild(item);
  });
}

function filteredJournalsForList() {
  if (journalFilterMode === 'date') {
    const selectedDate = normalizeDate(journalViewDate ? journalViewDate.value : '');
    if (!selectedDate) return [];
    return journals.filter((journal) => journalPrimaryDate(journal) === selectedDate);
  }

  if (journalFilterMode === 'tag') {
    return journals.filter((journal) => normalizeJournalTagId(journal.tagId) === appliedJournalTagFilter);
  }

  return journals;
}

function updateJournalFilterControls() {
  if (journalFilterModeButton) journalFilterModeButton.textContent = journalFilterModeLabel(journalFilterMode);
  if (journalTagFilter) journalTagFilter.disabled = journalFilterMode !== 'tag';
  if (journalTagFilterPaletteButton) journalTagFilterPaletteButton.disabled = journalFilterMode !== 'tag';
  if (journalTagFilterField) journalTagFilterField.classList.toggle('hidden', journalFilterMode !== 'tag');
  if (journalViewDateField) journalViewDateField.classList.toggle('hidden', journalFilterMode !== 'date');
  if (journalFilterMode !== 'tag') closeAllTagPalettes();
}

function journalFilterModeLabel(mode) {
  if (mode === 'date') return '日期记录';
  if (mode === 'tag') return '标签记录';
  return '显示全部';
}

function cycleJournalFilterMode() {
  if (journalFilterMode === 'all') {
    journalFilterMode = 'date';
  } else if (journalFilterMode === 'date') {
    journalFilterMode = 'tag';
    appliedJournalTagFilter = normalizeJournalTagId(journalTagFilter ? journalTagFilter.value : '');
  } else {
    journalFilterMode = 'all';
  }

  updateJournalFilterControls();
  renderJournalList();
}

function createJournalTagBadge(tagId) {
  const tag = journalTagById(tagId);
  if (!tag) return null;
  const badge = document.createElement('span');
  badge.className = 'journal-tag-badge';
  badge.style.background = tag.color;
  badge.title = tag.fullName;
  badge.textContent = tag.shortName;
  return badge;
}

function ensureJournalViewDate() {
  if (journalViewDate.value) return;
  setDateInputValue(journalViewDate, latestJournalDate() || formatLocalDate(currentEffectiveNow || new Date()));
}

function openJournalEntry(journal) {
  const targetDate = journalPrimaryDate(journal);
  renderJournalView(journal, targetDate, journalDisplayDate(journal));
}

function renderJournalView(journal, targetDate, fallbackTitle) {
  const normalizedDate = normalizeDate(targetDate);
  const dayTasks = sortTasksForDisplay(tasks.filter((task) => normalizeDate(task.date) === normalizedDate));
  const title = fallbackTitle || (journal ? journalDisplayDate(journal) : normalizedDate || '未标记日期');
  journalViewTitle.innerHTML = '';
  journalViewTitle.append(document.createTextNode(title));
  const tagBadge = journal ? createJournalTagBadge(journal.tagId) : null;
  if (tagBadge) journalViewTitle.appendChild(tagBadge);
  journalViewContent.innerHTML = '';

  const journalSection = document.createElement('section');
  const journalHeading = document.createElement('h3');
  journalHeading.textContent = '生活记录';
  const journalText = document.createElement('p');
  journalText.textContent = journal && journal.content ? journal.content : '这一天还没有生活记录。';
  journalSection.append(journalHeading, journalText);
  journalViewContent.appendChild(journalSection);

  const taskSection = document.createElement('section');
  const taskHeading = document.createElement('h3');
  taskHeading.textContent = '任务完成情况';
  taskSection.appendChild(taskHeading);

  const tasksWithReflections = dayTasks.filter((task) => hasTaskDetail(task));
  if (tasksWithReflections.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = '这一天还没有任务完成记录。';
    taskSection.appendChild(empty);
  } else {
    tasksWithReflections.forEach((task) => {
      const item = document.createElement('div');
      item.className = 'journal-task-detail';
      const title = document.createElement('strong');
      title.textContent = `${task.startTime || '--:--'} - ${task.endTime || '--:--'} ${task.title || '未命名安排'}`;
      item.append(
        title,
        createJournalTaskField('任务目标', task.planDetails || '没有填写任务目标。'),
        createJournalTaskField('具体完成内容及反思', task.details || '没有填写完成内容及反思。'),
        createJournalTaskField('完成情况', task.status || '未评价')
      );
      taskSection.appendChild(item);
    });
  }

  journalViewContent.appendChild(taskSection);
  journalViewModal.classList.remove('hidden');
}

function createJournalTaskField(label, value) {
  const field = document.createElement('div');
  field.className = 'journal-task-field';
  const labelElement = document.createElement('span');
  labelElement.textContent = label;
  const valueElement = document.createElement('p');
  valueElement.textContent = value;
  field.append(labelElement, valueElement);
  return field;
}

function findJournalForDate(normalizedDate, rawDate) {
  if (!normalizedDate && !rawDate) return null;
  return journals.find((item) => journalPrimaryDate(item) === normalizedDate)
    || journals.find((item) => journalIncludesDate(item, normalizedDate))
    || journals.find((item) => clean(item.sheetName) === clean(rawDate))
    || null;
}

function closeJournalViewModal() {
  journalViewModal.classList.add('hidden');
}

function formatMeta(task) {
  const parts = [task.location].filter(Boolean);
  return parts.join(' · ');
}

function normalizeTaskType(value, title = '') {
  const text = clean(value);
  if (TASK_TYPES.includes(text)) return text;
  return inferTaskType(title || text);
}

function inferTaskType(title) {
  const text = clean(title);
  if (/课|课程|讲座|lecture|class|seminar/i.test(text)) return '课程';
  if (/学|阅读|复习|预习|论文|实验|背|题|考试|study|read/i.test(text)) return '学习';
  if (/洗漱|早餐|午饭|晚饭|午餐|晚餐|午休|休息|运动|娱乐|睡|通勤|散步|生活/i.test(text)) return '生活';
  return '工作';
}

function normalizeTime(value) {
  return value && /^\d{1,2}:\d{2}$/.test(value) ? value.padStart(5, '0') : '99:99';
}

function journalIdentity(journal) {
  return journalPrimaryDate(journal);
}

function compareJournals(a, b) {
  const aEnd = journalSortEnd(a);
  const bEnd = journalSortEnd(b);
  if (aEnd !== bEnd) return bEnd.localeCompare(aEnd);

  const aStart = journalSortStart(a);
  const bStart = journalSortStart(b);
  return bStart.localeCompare(aStart);
}

function journalSortStart(journal) {
  return journalDateRange(journal).start || '0000-00-00';
}

function journalSortEnd(journal) {
  return journalDateRange(journal).end || '0000-00-00';
}

function journalDisplayDate(journal) {
  const { start, end } = journalDateRange(journal);
  if (start && end && start !== end) return `${start} 至 ${end}`;
  return start || clean(journal.sheetName) || '未标记日期';
}

function journalIncludesDate(journal, date) {
  if (!date) return false;
  const { start, end } = journalDateRange(journal);
  if (!start && !end) return false;
  return date >= (start || end) && date <= (end || start);
}

function journalPrimaryDate(journal) {
  return journalDateRange(journal).start || normalizeDate(journal.date) || '';
}

function journalDateRange(journal) {
  const rangeStart = normalizeDate(journal.dateRangeStart);
  const rangeEnd = normalizeDate(journal.dateRangeEnd);
  const date = normalizeDate(journal.date);

  return {
    start: rangeStart || date,
    end: rangeEnd || rangeStart || date
  };
}

function normalizeDate(value) {
  const text = clean(value);
  if (!text) return '';
  const match = text.match(/^(\d{4})[-/.年](\d{1,2})[-/.月](\d{1,2})日?$/);
  if (!match) return text;
  return `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`;
}

function isCompleteDate(value) {
  const normalized = normalizeDate(value);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return false;
  const [year, month, day] = normalized.split('-').map(Number);
  const parsed = new Date(year, month - 1, day);
  return parsed.getFullYear() === year
    && parsed.getMonth() === month - 1
    && parsed.getDate() === day;
}

function isSelectableDate(value) {
  if (!isCompleteDate(value)) return false;
  const normalized = normalizeDate(value);
  const year = Number(normalized.slice(0, 4));
  return year >= MIN_DATE_YEAR;
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

function formatTimeRangeInput(value) {
  const digits = clean(value).replace(/\D/g, '').slice(0, 8);
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

function normalizeWeekday(value) {
  const text = clean(value);
  if (!text) return '';
  if (/周一|星期一|mon/i.test(text)) return '周一';
  if (/周二|星期二|tue/i.test(text)) return '周二';
  if (/周三|星期三|wed/i.test(text)) return '周三';
  if (/周四|星期四|thu/i.test(text)) return '周四';
  if (/周五|星期五|fri/i.test(text)) return '周五';
  if (/周六|星期六|sat/i.test(text)) return '周六';
  if (/周日|周天|星期日|星期天|sun/i.test(text)) return '周日';
  return '';
}

function parseLocalDate(date) {
  const normalized = normalizeDate(date);
  if (!isSelectableDate(normalized)) return null;
  const [year, month, day] = normalized.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function shiftDate(date, offsetDays) {
  const parsed = parseLocalDate(date);
  if (!parsed) return '';
  parsed.setDate(parsed.getDate() + offsetDays);
  return formatLocalDate(parsed);
}

function weekdayFromDate(date) {
  const parsed = parseLocalDate(date);
  if (!parsed) return '';
  return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][parsed.getDay()];
}

function formatLocalDate(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ].join('-');
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

function taskIdentity(task) {
  if (clean(task.id).startsWith('manual-') || task.isDraft) {
    return clean(task.id);
  }

  return [
    normalizeDate(task.date),
    clean(task.sheetName),
    normalizeTime(task.startTime),
    normalizeTime(task.endTime),
    clean(task.title),
    clean(task.location)
  ].join('|');
}

function isRenderableTask(task) {
  const title = clean(task.title);
  if (task.isDraft) return true;
  if (task.source === 'untimed-table') return Boolean(title);
  if (!task.startTime || !task.endTime) return false;
  if (!title) return false;
  if (normalizeTaskType(task.type, title) === '课程') return true;
  if (task.source === 'schedule-template') return true;
  if (/^[\d\s√✓×xX-]+$/.test(title)) return false;
  return /[\u4e00-\u9fa5A-Za-z]/.test(title);
}

function hasTaskDetail(task) {
  const status = clean(task.status);
  return Boolean(clean(task.details)) || Boolean(status && status !== '未评价');
}

function openTaskEditModal(taskId, focusTarget) {
  const task = tasks.find((item) => item.id === taskId);
  if (!task) return;

  editingTaskId = taskId;
  taskEditTitle.textContent = task.title || '未命名安排';
  taskDetails.value = task.details || '';
  taskStatus.value = task.status || '未评价';
  taskEditModal.classList.remove('hidden');

  if (focusTarget === 'status') {
    taskStatus.focus();
  } else {
    taskDetails.focus();
  }
}

function closeTaskEditModal() {
  editingTaskId = '';
  taskEditModal.classList.add('hidden');
}

async function saveTaskEdit(event) {
  event.preventDefault();
  const task = tasks.find((item) => item.id === editingTaskId);
  if (!task) return;

  task.details = clean(taskDetails.value);
  task.status = clean(taskStatus.value) || '未评价';
  await saveState();
  closeTaskEditModal();
  renderTasks();
}

function statusClass(status) {
  if (status === '已完成') return 'done';
  if (status === '部分完成') return 'partial';
  if (status === '未完成') return 'missed';
  return 'pending';
}

function sourceLabel(sourceType) {
  if (sourceType === 'table') return '表格解析';
  return '文件导入';
}

function pageTitleFor(page) {
  if (page === 'tasks') return '任务';
  if (page === 'records') return '记录';
  if (page === 'settings') return '设置';
  return '个人';
}

function defaultProfile() {
  return {
    focusLength: 50,
    breakReminder: true,
    classDuration: 50,
    classBreakLength: 10,
    workFocusLength: 50,
    workBreakLength: 10,
    journalTags: defaultJournalTags(),
    defaultsVersion: '0.2.0'
  };
}

function normalizedProfile() {
  const {
    timeMode,
    customClockBaseTimestamp,
    customClockStartedAt,
    ...systemTimeProfile
  } = profile || {};

  return {
    ...defaultProfile(),
    ...systemTimeProfile,
    journalTags: normalizeJournalTags(systemTimeProfile.journalTags)
  };
}

function loadProfileToForm() {
  const data = normalizedProfile();
  breakReminder.checked = Boolean(data.breakReminder);
  classDuration.value = String(data.classDuration || 50);
  classBreakLength.value = String(data.classBreakLength || 10);
  workFocusLength.value = String(data.workFocusLength || data.focusLength || 50);
  workBreakLength.value = String(data.workBreakLength || 10);
}

function defaultJournalTags() {
  return DEFAULT_JOURNAL_TAGS.map((tag) => ({ ...tag }));
}

function normalizeJournalTags(tags) {
  const shouldUseDefault = !Array.isArray(tags);
  const sourceTags = shouldUseDefault ? defaultJournalTags() : tags;
  const seen = new Set();
  const normalized = sourceTags.map((tag, index) => {
    const id = clean(tag && tag.id) || `tag-${Date.now()}-${index}`;
    if (seen.has(id)) return null;
    seen.add(id);
    return {
      id,
      color: normalizeColor(tag && tag.color),
      shortName: clean(tag && tag.shortName).slice(0, 8) || `标签${index + 1}`,
      fullName: clean(tag && tag.fullName) || '未填写含义'
    };
  }).filter(Boolean);

  return normalized.length > 0 || !shouldUseDefault ? normalized : defaultJournalTags();
}

function normalizeColor(value) {
  const color = clean(value);
  return /^#[0-9a-fA-F]{6}$/.test(color) ? color : '#64748b';
}

function journalTags() {
  return normalizeJournalTags(profile && profile.journalTags);
}

function journalTagById(tagId) {
  return journalTags().find((tag) => tag.id === clean(tagId)) || null;
}

function normalizeJournalTagId(value) {
  const tagId = clean(value);
  return journalTagById(tagId) ? tagId : '';
}

function legacyRatingToTagId(value) {
  return LEGACY_RATING_TO_TAG_ID[clean(value)] || '';
}

function buildTagOptionText(tag) {
  return tag ? `${tag.shortName}：${tag.fullName}` : '无标签';
}

function populateJournalTagSelects() {
  const currentEditorValue = normalizeJournalTagId(journalTag && journalTag.value);
  const currentFilterValue = normalizeJournalTagId(journalTagFilter && journalTagFilter.value) || appliedJournalTagFilter;
  [journalTag, journalTagFilter].forEach((select) => {
    if (!select) return;
    select.innerHTML = '';
    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.textContent = '无标签';
    select.appendChild(emptyOption);
    journalTags().forEach((tag) => {
      const option = document.createElement('option');
      option.value = tag.id;
      option.textContent = buildTagOptionText(tag);
      select.appendChild(option);
    });
  });
  if (journalTag) journalTag.value = currentEditorValue;
  if (journalTagFilter) journalTagFilter.value = currentFilterValue;
  renderTagPicker(journalTag, journalTagPaletteButton, journalTagPalette);
  renderTagPicker(journalTagFilter, journalTagFilterPaletteButton, journalTagFilterPalette);
}

function renderTagPicker(select, button, palette) {
  if (!select || !button || !palette) return;
  const tag = journalTagById(select.value);
  button.classList.toggle('empty', !tag);
  button.style.background = tag ? tag.color : 'transparent';
  button.title = tag ? `${tag.shortName}：${tag.fullName}` : '无标签';

  palette.innerHTML = '';
  const emptyButton = createTagPaletteItem(null, select, button, palette);
  palette.appendChild(emptyButton);
  journalTags().forEach((item) => {
    palette.appendChild(createTagPaletteItem(item, select, button, palette));
  });
}

function createTagPaletteItem(tag, select, button, palette) {
  const item = document.createElement('button');
  item.type = 'button';
  item.className = 'tag-palette-item';
  item.classList.toggle('empty', !tag);
  item.style.background = tag ? tag.color : 'transparent';
  item.title = tag ? `${tag.shortName}：${tag.fullName}` : '无标签';
  item.setAttribute('aria-label', item.title);
  item.addEventListener('click', (event) => {
    event.stopPropagation();
    select.value = tag ? tag.id : '';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    palette.classList.add('hidden');
    button.focus();
  });
  return item;
}

function toggleTagPalette(palette) {
  if (!palette) return;
  const shouldOpen = palette.classList.contains('hidden');
  closeAllTagPalettes();
  palette.classList.toggle('hidden', !shouldOpen);
}

function closeAllTagPalettes() {
  [journalTagPalette, journalTagFilterPalette].forEach((palette) => {
    if (palette) palette.classList.add('hidden');
  });
}

function closeTagPalettesOnOutsideClick(event) {
  if (event.target.closest('.tag-select-control')) return;
  closeAllTagPalettes();
}

function renderJournalTagSettings() {
  if (!journalTagSettingsList) return;
  journalTagSettingsList.innerHTML = '';

  journalTags().forEach((tag) => {
    const row = document.createElement('div');
    row.className = 'tag-settings-row';
    row.dataset.tagId = tag.id;

    const color = document.createElement('input');
    color.type = 'color';
    color.value = tag.color;
    color.setAttribute('aria-label', '标签颜色');
    color.addEventListener('input', () => updateJournalTag(tag.id, 'color', color.value));

    const shortName = document.createElement('input');
    shortName.type = 'text';
    shortName.maxLength = 8;
    shortName.value = tag.shortName;
    shortName.placeholder = '简称';
    shortName.addEventListener('blur', () => updateJournalTag(tag.id, 'shortName', shortName.value));
    shortName.addEventListener('keydown', blurOnEnter);

    const fullName = document.createElement('input');
    fullName.type = 'text';
    fullName.value = tag.fullName;
    fullName.placeholder = '全称 / 含义';
    fullName.addEventListener('blur', () => updateJournalTag(tag.id, 'fullName', fullName.value));
    fullName.addEventListener('keydown', blurOnEnter);

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-table-row';
    deleteButton.type = 'button';
    deleteButton.textContent = '-';
    deleteButton.setAttribute('aria-label', '删除标签');
    deleteButton.addEventListener('click', () => deleteJournalTag(tag.id));

    row.append(color, shortName, fullName, deleteButton);
    journalTagSettingsList.appendChild(row);
  });
}

async function updateJournalTag(tagId, field, value) {
  const tags = journalTags();
  const target = tags.find((tag) => tag.id === tagId);
  if (!target) return;
  if (field === 'color') target.color = normalizeColor(value);
  if (field === 'shortName') target.shortName = clean(value).slice(0, 8) || target.shortName;
  if (field === 'fullName') target.fullName = clean(value) || target.fullName;
  profile = { ...normalizedProfile(), journalTags: tags };
  await saveState();
  populateJournalTagSelects();
  renderJournalList();
}

async function addJournalTag() {
  const tags = journalTags();
  tags.push({
    id: `tag-${Date.now()}`,
    color: '#64748b',
    shortName: `标签${tags.length + 1}`,
    fullName: '新的标签含义'
  });
  profile = { ...normalizedProfile(), journalTags: tags };
  await saveState();
  renderJournalTagSettings();
  populateJournalTagSelects();
}

async function deleteJournalTag(tagId) {
  const tags = journalTags().filter((tag) => tag.id !== tagId);
  profile = { ...normalizedProfile(), journalTags: tags };
  journals = journals.map((journal) => (
    clean(journal.tagId) === tagId ? { ...journal, tagId: '' } : journal
  ));
  await saveState();
  renderJournalTagSettings();
  populateJournalTagSelects();
  renderJournalList();
  renderSelectedJournal();
}

async function saveProfileFromForm() {
  profile = {
    ...normalizedProfile(),
    focusLength: numericSetting(workFocusLength.value, 50),
    breakReminder: breakReminder.checked,
    classDuration: numericSetting(classDuration.value, 50),
    classBreakLength: numericSetting(classBreakLength.value, 10),
    workFocusLength: numericSetting(workFocusLength.value, 50),
    workBreakLength: numericSetting(workBreakLength.value, 10)
  };
  await saveState();
}

async function getEffectiveNow() {
  const result = await window.whbr.getSystemTime();
  return new Date(result.timestamp);
}

function numericSetting(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
}

async function initializeAppData() {
  try {
    const result = await window.whbr.loadData();
    tasks = result.data.tasks || [];
    profile = {
      ...defaultProfile(),
      ...(result.data.profile || {})
    };
    const migratedProfile = migrateProfileDefaults(profile);
    profile = migratedProfile.profile;
    journals = normalizeJournalCollection(result.data.journals || []);
    storagePaths = result.paths || storagePaths;
    setDateInputValue(journalViewDate, latestJournalDate() || journalDate.value || formatLocalDate(new Date()));
    loadProfileToForm();
    populateJournalTagSelects();
    renderJournalTagSettings();
    await migrateLegacyLocalStorageIfNeeded();
    if (migratedProfile.changed) await saveState();
    updateStoragePathView();
    renderAll();
    if (pages.tasks.classList.contains('active')) {
      renderTasks({ scrollToCurrent: true, forceScroll: true });
    }
    updateJournalFilterControls();
  } catch (error) {
    setStatus(`加载数据失败：${error.message}`, '');
  }
}

function migrateProfileDefaults(profileData) {
  const migrated = { ...profileData };
  let changed = false;
  const normalizedTags = normalizeJournalTags(migrated.journalTags);
  if (JSON.stringify(migrated.journalTags || []) !== JSON.stringify(normalizedTags)) {
    migrated.journalTags = normalizedTags;
    changed = true;
  }
  if (migrated.defaultsVersion !== '0.2.0') {
    if (Number(migrated.classDuration) === 45) {
      migrated.classDuration = 50;
      changed = true;
    }
    if (Number(migrated.workFocusLength) === 45) {
      migrated.workFocusLength = 50;
      changed = true;
    }
    if (Number(migrated.focusLength) === 45) {
      migrated.focusLength = 50;
      changed = true;
    }
    migrated.defaultsVersion = '0.2.0';
    changed = true;
  }
  return { profile: migrated, changed };
}

function latestJournalDate() {
  return journals
    .map((journal) => journalSortEnd(journal))
    .filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date) && date !== '0000-00-00')
    .sort()
    .at(-1) || '';
}

async function migrateLegacyLocalStorageIfNeeded() {
  const legacyTasks = loadLegacyArray('whbr.tasks');
  const legacyJournals = loadLegacyArray('whbr.journals');

  if (tasks.length === 0 && legacyTasks.length > 0) {
    tasks = mergeTasks(tasks, legacyTasks);
  }

  if (journals.length === 0 && legacyJournals.length > 0) {
    journals = mergeJournals(journals, legacyJournals);
  }

  if (legacyTasks.length > 0 || legacyJournals.length > 0) {
    await saveState();
    clearLegacyLocalStorage();
  }
}

function loadLegacyArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value : [];
  } catch (error) {
    return [];
  }
}

async function saveState() {
  const result = await window.whbr.saveData({ tasks, journals, profile });
  storagePaths = result.paths || storagePaths;
  updateStoragePathView();
}

async function chooseDataPath() {
  const result = await window.whbr.chooseDataPath({ tasks, journals, profile });

  if (result.canceled) {
    return;
  }

  storagePaths = result.paths || storagePaths;
  updateStoragePathView();
}

async function openDataPath() {
  const result = await window.whbr.openDataPath();
  if (result && result.error) {
    setStatus(`打开文件夹失败：${result.error}`, 'error', 3000);
  }
}

function openDeleteDayModal() {
  deleteMode = 'day';
  if (!deleteDayDate.value) {
    setDateInputValue(deleteDayDate, taskDateFilter.value || formatLocalDate(new Date()));
  }
  resetTitle.textContent = '删除当天数据';
  resetDescription.textContent = `确认后会删除 ${deleteDayDate.value} 的全部任务安排和每日生活记录。`;
  resetConfirmText.textContent = `我确认删除 ${deleteDayDate.value} 的数据`;
  confirmResetButton.textContent = '确认删除';
  openConfirmModal();
}

function openResetModal() {
  deleteMode = 'all';
  resetTitle.textContent = '重置全部数据';
  resetDescription.textContent = '确认后会清空软件写入的全部本地数据，并清理旧版本浏览器存储。';
  resetConfirmText.textContent = '我确认重置全部日织数据';
  confirmResetButton.textContent = '确认重置';
  openConfirmModal();
}

function openConfirmModal() {
  resetConfirmCheck.checked = false;
  confirmResetButton.disabled = true;
  renderResetPaths();
  resetModal.classList.remove('hidden');
}

function closeResetModal() {
  resetModal.classList.add('hidden');
}

async function confirmReset() {
  if (!resetConfirmCheck.checked) return;

  confirmResetButton.disabled = true;
  if (deleteMode === 'day') {
    await deleteSelectedDay();
    closeResetModal();
    return;
  }

  const result = await window.whbr.resetData();
  clearLegacyLocalStorage();
  tasks = [];
  journals = [];
  profile = defaultProfile();
  firedReminderKeys.clear();
  storagePaths = result.paths || storagePaths;
  loadProfileToForm();
  updateStoragePathView();
  renderAll();
  closeResetModal();
}

function renderResetPaths() {
  resetPathList.innerHTML = '';

  const rows = deleteMode === 'day'
    ? [
        ['删除日期', deleteDayDate.value || '未选择'],
        ['影响内容', '该日期的任务安排和每日生活记录'],
        ['数据文件夹', storagePaths.dataDirectory],
        ['当前月份文件', storagePaths.dataFilePath]
      ]
    : [
    ['数据文件夹', storagePaths.dataDirectory],
    ['月度文件命名', storagePaths.dataFilePattern],
    ['设置文件', storagePaths.settingsFilePath],
    ['内部定位文件', storagePaths.settingsLocationPath],
    ['旧版浏览器存储', storagePaths.legacyStorageKeys.join(', ')]
      ];

  rows.forEach(([label, value]) => {
    const row = document.createElement('div');
    row.className = 'path-row';
    const name = document.createElement('span');
    name.textContent = label;
    const code = document.createElement('code');
    code.textContent = value || '尚未生成';
    row.append(name, code);
    resetPathList.appendChild(row);
  });
}

async function deleteSelectedDay() {
  const date = deleteDayDate.value;
  if (!date) return;

  tasks = tasks.filter((task) => normalizeDate(task.date) !== date);
  journals = journals.filter((journal) => {
    const start = normalizeDate(journal.dateRangeStart || journal.date);
    const end = normalizeDate(journal.dateRangeEnd || journal.date);
    const isSingleDay = !end || start === end;
    return !(isSingleDay && start === date);
  });
  activePlanningDates.delete(date);

  if (taskDateFilter.value === date) renderTasks();
  if (journalDate.value === date) journalContent.value = '';

  await saveState();
  renderAll();
}

function updateStoragePathView() {
  dataFilePath.textContent = storagePaths.dataFilePath || '尚未生成';
  settingsFilePath.textContent = storagePaths.settingsFilePath || '尚未生成';
}

function clearLegacyLocalStorage() {
  localStorage.removeItem('whbr.tasks');
  localStorage.removeItem('whbr.journals');
}

function setStatus(message, extraClass, timeoutMs = 0) {
  window.clearTimeout(statusTimer);
  statusBox.textContent = message;
  statusBox.className = `status-box ${extraClass || ''}`.trim();

  if (timeoutMs > 0) {
    statusTimer = window.setTimeout(() => {
      statusBox.textContent = '';
      statusBox.className = 'status-box hidden';
    }, timeoutMs);
  }
}

function clean(value) {
  return String(value ?? '').trim();
}

async function startApp() {
  await applyAppIcon();
  await applyAppVersion();
  const today = formatLocalDate(new Date());
  setDateInputValue(journalDate, today);
  setDateInputValue(taskDateFilter, today);
  setDateInputValue(deleteDayDate, today);
  committedProfileStatsStartDate = today;
  setDateInputValue(profileStatsStartDate, today);

  await initializeAppData();
  await refreshSystemTime();
  setInterval(refreshSystemTime, 1000);
}

async function applyAppIcon() {
  if (!window.whbr || typeof window.whbr.getAppIconUrl !== 'function') return;

  try {
    const iconUrl = await window.whbr.getAppIconUrl();
    if (!iconUrl) return;
    if (appIconLink) appIconLink.href = iconUrl;
    if (brandMark) brandMark.src = iconUrl;
  } catch (error) {
    // Keep the static relative path as a development fallback.
  }
}

async function applyAppVersion() {
  if (!versionBadge || !window.whbr || typeof window.whbr.getAppVersion !== 'function') return;

  try {
    const version = await window.whbr.getAppVersion();
    versionBadge.textContent = version ? `版本 v${version}` : '版本 --';
  } catch (error) {
    versionBadge.textContent = '版本 --';
  }
}

startApp();
