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
const emptyState = document.querySelector('#emptyState');
const taskWorkspace = document.querySelector('#taskWorkspace');
const taskList = document.querySelector('#taskList');
const statusBox = document.querySelector('#statusBox');
const manualTaskButton = document.querySelector('#manualTaskButton');
const importFileButton = document.querySelector('#importFileButton');
const backToCurrentTaskButton = document.querySelector('#backToCurrentTaskButton');
const reusePreviousButton = document.querySelector('#reusePreviousButton');
const importMoreButton = document.querySelector('#importMoreButton');
const taskDateFilter = document.querySelector('#taskDateFilter');
const journalDate = document.querySelector('#journalDate');
const journalContent = document.querySelector('#journalContent');
const saveJournalButton = document.querySelector('#saveJournalButton');
const journalSaveState = document.querySelector('#journalSaveState');
const journalViewDate = document.querySelector('#journalViewDate');
const openJournalDateButton = document.querySelector('#openJournalDateButton');
const journalList = document.querySelector('#journalList');
const dataFilePath = document.querySelector('#dataFilePath');
const settingsFilePath = document.querySelector('#settingsFilePath');
const chooseDataPathButton = document.querySelector('#chooseDataPathButton');
const chooseSettingsPathButton = document.querySelector('#chooseSettingsPathButton');
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
const importDateModal = document.querySelector('#importDateModal');
const closeImportDateModalButton = document.querySelector('#closeImportDateModalButton');
const cancelImportDateButton = document.querySelector('#cancelImportDateButton');
const confirmImportDateButton = document.querySelector('#confirmImportDateButton');
const importStartDate = document.querySelector('#importStartDate');
const importEndDate = document.querySelector('#importEndDate');
const importChoiceModal = document.querySelector('#importChoiceModal');
const closeImportChoiceModalButton = document.querySelector('#closeImportChoiceModalButton');
const manualScheduleButton = document.querySelector('#manualScheduleButton');
const fileScheduleButton = document.querySelector('#fileScheduleButton');
const manualDailyPlanButton = document.querySelector('#manualDailyPlanButton');
const fileDailyPlanButton = document.querySelector('#fileDailyPlanButton');
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
const dailyPlanDate = document.querySelector('#dailyPlanDate');
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
let pendingImportResult = null;
let highlightedTaskId = '';
let currentEffectiveNow = new Date();
let lastReminderCheckValue = null;
let statusTimer = null;
let tutorialStepIndex = 0;
let previousTutorialPage = 'tasks';
const firedReminderKeys = new Set();
const activePlanningDates = new Set();
const tutorialSteps = [
  {
    page: 'tasks',
    targetSelector: '#importMoreButton',
    title: '批量创建任务',
    text: '点击这个按钮，可手动填写或上传表格文件生成课表，也可以批量创建每日任务安排。'
  },
  {
    page: 'records',
    targetSelector: '.journal-editor .section-head',
    title: '每日生活记录',
    text: '每日记录用于写下当天的活动、状态和复盘内容，帮助你保留每天的生活脉络。'
  },
  {
    page: 'records',
    targetSelector: '.records-list-panel .section-head',
    title: '记录列表',
    text: '记录列表可以按日期查看历史记录，像翻看日记一样回顾之前写下的内容。'
  },
  {
    page: 'profile',
    targetSelector: '.profile-grid .panel',
    title: '个人设置',
    text: '这里可以设置课程、工作和学习的时间周期，日织会按这些信息提醒你专注或休息。'
  },
  {
    page: 'settings',
    targetSelector: '.settings-data-panel .path-list',
    title: '数据文件',
    text: '个人记录与软件设置会存放在这里显示的位置，也可以按你的习惯自定义保存地址。'
  },
  {
    page: 'settings',
    targetSelector: '#backToCurrentTaskButton',
    title: '定位按钮',
    text: '点击这个按钮可以回到当前任务，并快速定位到此刻正在进行的安排。'
  },
  {
    page: 'tasks',
    title: '教程已结束',
    text: '教程已结束，祝使用愉快。'
  }
];

navItems.forEach((item) => {
  item.addEventListener('click', () => {
    showPage(item.dataset.page);
  });
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

backToCurrentTaskButton.addEventListener('click', goToCurrentTask);
if (manualTaskButton) manualTaskButton.addEventListener('click', openImportChoiceModal);
reusePreviousButton.addEventListener('click', reusePreviousDay);
if (importFileButton) importFileButton.addEventListener('click', openImportChoiceModal);
importMoreButton.addEventListener('click', openImportChoiceModal);
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !resetModal.classList.contains('hidden')) {
    closeResetModal();
  }
  if (event.key === 'Escape' && !taskEditModal.classList.contains('hidden')) {
    closeTaskEditModal();
  }
  if (event.key === 'Escape' && !importDateModal.classList.contains('hidden')) {
    closeImportDateModal();
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
if (importFileButton) {
  importFileButton.addEventListener('dragover', handleDragOver);
  importFileButton.addEventListener('dragleave', handleDragLeave);
  importFileButton.addEventListener('drop', handleDrop);
}
importMoreButton.addEventListener('dragover', handleDragOver);
importMoreButton.addEventListener('dragleave', handleDragLeave);
importMoreButton.addEventListener('drop', handleDrop);
taskDateFilter.addEventListener('change', renderTasks);
journalDate.addEventListener('change', renderSelectedJournal);
saveJournalButton.addEventListener('click', saveSelectedJournal);
journalViewDate.addEventListener('change', () => {
  if (journalViewDate.value) openJournalForDate(journalViewDate.value);
});
openJournalDateButton.addEventListener('click', () => {
  if (journalViewDate.value) openJournalForDate(journalViewDate.value);
});
chooseDataPathButton.addEventListener('click', chooseDataPath);
chooseSettingsPathButton.addEventListener('click', chooseSettingsPath);
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
closeImportDateModalButton.addEventListener('click', closeImportDateModal);
cancelImportDateButton.addEventListener('click', closeImportDateModal);
confirmImportDateButton.addEventListener('click', confirmImportWithDateRange);
importDateModal.addEventListener('click', (event) => {
  if (event.target === importDateModal) closeImportDateModal();
});
closeImportChoiceModalButton.addEventListener('click', closeImportChoiceModal);
manualScheduleButton.addEventListener('click', () => openScheduleTableModal());
fileScheduleButton.addEventListener('click', () => importScheduleFile('schedule'));
manualDailyPlanButton.addEventListener('click', openDailyPlanTableModal);
fileDailyPlanButton.addEventListener('click', () => importScheduleFile('daily'));
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
  updateTaskTemporalView({ scrollToCurrent: true });
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
  renderTasks();
}

function scrollTutorialTargetIntoView(step) {
  const target = getTutorialTarget(step);
  if (!target) return;
  target.scrollIntoView({ block: 'center', inline: 'center' });
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

async function importScheduleFile(kind = 'daily') {
  setStatus(kind === 'schedule'
    ? '请选择要导入的课表文件，仅支持 xlsx、xls、csv 或 tsv。'
    : '请选择要导入的每日安排表格文件，仅支持 xlsx、xls、csv、tsv 或 pdf。', '');
  closeImportChoiceModal();

  try {
    const selectedFile = await window.whbr.selectAndParseFile({ kind });
    if (selectedFile.canceled) {
      setStatus('已取消导入。', '', 2500);
      return;
    }

    const result = await parseSelectedImportFile(selectedFile, kind);

    if (result.message) {
      setStatus(result.message, result.status === 'ok' ? 'hidden' : '');
    }

    if (result.error) {
      setStatus(result.error, '');
      return;
    }

    if (!validateImportKind(result, kind)) return;

    await handleParsedImport(result, kind);
  } catch (error) {
    setStatus(`导入失败：${error.message}`, '');
  }
}

async function importDroppedFile(file) {
  setStatus('正在读取拖入的文件……', '');

  try {
    const filePath = window.whbr.getPathForFile(file);
    if (!filePath) {
      setStatus('无法读取拖入文件的本地路径，请点击“批量创建任务”选择文件。', '');
      return;
    }

    const result = await parseSelectedImportFile({ filePath, fileName: file.name || filePath.split(/[\\/]/).pop() });
    if (result.error) {
      setStatus(result.error, '');
      return;
    }

    if (result.message) {
      setStatus(result.message, result.status === 'ok' ? 'hidden' : '');
    }

    if (!validateImportKind(result, 'daily')) return;

    await handleParsedImport(result, 'daily');
  } catch (error) {
    setStatus(`拖拽导入失败：${error.message}`, '');
  }
}

async function parseSelectedImportFile(file, kind = 'daily') {
  const fileName = file.fileName || file.filePath.split(/[\\/]/).pop();
  const ext = fileName.split('.').pop().toLowerCase();
  const isExcel = ['xlsx', 'xls'].includes(ext);
  const isPdf = ext === 'pdf';
  const isScheduleUnsupported = kind === 'schedule' && !['xlsx', 'xls', 'csv', 'tsv'].includes(ext);

  if (isScheduleUnsupported) {
    return {
      canceled: false,
      error: '课表入口目前只支持 xlsx、xls、csv 或 tsv 文件。PDF 课表暂不在 v0.1.2 支持范围内。',
      filePath: file.filePath,
      fileName,
      tasks: []
    };
  }

  setStatus(`已选择 ${fileName}，正在读取文件……`, '');
  await waitForPaint();

  setStatus(kind === 'schedule'
    ? '正在转化中……正在读取课表文件。'
    : isPdf
      ? '正在转化中……正在读取 PDF 表格。'
      : isExcel
      ? '正在转化中……正在读取 Excel 工作表。'
      : '正在转化中……正在读取表格内容。', '');
  await waitForPaint();

  const result = await window.whbr.parseFilePath(file.filePath);

  setStatus(kind === 'schedule'
    ? '正在整理课表文件解析结果，准备预填课表。'
    : '正在整理表格解析结果，准备写入任务。', '');
  await waitForPaint();

  return result;
}

function validateImportKind(result, kind = 'daily') {
  const importedTasks = Array.isArray(result.tasks) ? result.tasks : [];
  const hasTimetable = hasImportedTimetable(result);
  const isTable = result.sourceType === 'table';

  if (kind === 'schedule') {
    if (!isTable) {
      setStatus('课表入口目前只支持 xlsx、xls、csv 或 tsv 文件。', '');
      return false;
    }

    if (!hasTimetable) {
      setStatus(importedTasks.length > 0
        ? '这个文件看起来是每日安排，不是学期课表。请从“每日安排”的导入安排文件入口上传。'
        : '没有识别到课表网格。请上传包含周一至周日列的课表文件。', '');
      return false;
    }

    return true;
  }

  if (hasTimetable) {
    setStatus('这个文件看起来是学期课表，不是每日安排。请从“课表”的导入课表文件入口上传。', '');
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

async function handleParsedImport(result, kind = 'daily') {
  const importedTasks = Array.isArray(result.tasks) ? result.tasks : [];
  if (kind === 'schedule') {
    openScheduleTableModal(result.timetableTemplate || templateFromScheduleTasks(importedTasks), result);
    return;
  }

  if (importedTasks.length === 0) {
    journals = mergeJournals(journals, result.journals || []);
    await saveState();
    renderAll();
    return;
  }

  if (shouldAskImportDateRange(result, importedTasks)) {
    pendingImportResult = result;
    openImportDateModal(result);
    return;
  }

  tasks = mergeTasks(tasks, importedTasks);
  journals = mergeJournals(journals, result.journals || []);
  await saveState();
  renderAll();
}

function shouldAskImportDateRange(result, importedTasks) {
  const datedSheetCount = Number(result.datedSheetCount || 0);
  const distinctDates = new Set(importedTasks.map((task) => normalizeDate(task.date)).filter(Boolean));
  if (result.sourceType === 'table' && datedSheetCount > 1 && distinctDates.size > 1) return false;
  return distinctDates.size <= 1;
}

function openImportDateModal(result) {
  const inferredDate = firstTaskDate(result.tasks || []);
  const defaultDate = inferredDate || taskDateFilter.value || formatLocalDate(new Date());
  importStartDate.value = defaultDate;
  importEndDate.value = defaultDate;
  setStatus(`已解析出 ${result.tasks.length} 条安排，请选择这些安排的生效日期。`, '');
  importDateModal.classList.remove('hidden');
  importStartDate.focus();
}

function firstTaskDate(taskItems) {
  const task = taskItems.find((item) => normalizeDate(item.date));
  return task ? normalizeDate(task.date) : '';
}

function closeImportDateModal() {
  pendingImportResult = null;
  importDateModal.classList.add('hidden');
}

async function confirmImportWithDateRange() {
  if (!pendingImportResult) return;

  const startDate = normalizeDate(importStartDate.value);
  const endDate = normalizeDate(importEndDate.value || importStartDate.value);
  const dates = enumerateDates(startDate, endDate);
  if (dates.length === 0) {
    setStatus('请选择有效的开始和结束日期。', '');
    return;
  }

  const expandedTasks = expandTasksAcrossDates(pendingImportResult.tasks || [], dates);
  tasks = mergeTasks(tasks, expandedTasks);
  journals = mergeJournals(journals, pendingImportResult.journals || []);
  taskDateFilter.value = dates[0];
  activePlanningDates.add(dates[0]);
  await saveState();
  closeImportDateModal();
  renderAll();
  setStatus(`已导入 ${expandedTasks.length} 条安排，日期范围 ${dates[0]} 至 ${dates[dates.length - 1]}。`, 'hidden');
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
  termStartDate.value = template && template.termStartDate ? template.termStartDate : today;
  termEndDate.value = template && template.termEndDate ? template.termEndDate : today;
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
  const dates = enumerateDates(termStartDate.value, termEndDate.value);
  if (dates.length === 0) {
    setStatus('请填写有效的学期开始和结束日期。', '');
    return;
  }

  const template = readScheduleTemplateFromTable();
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
  taskDateFilter.value = dates[0];
  activePlanningDates.add(dates[0]);
  await saveState();
  closeScheduleTableModal();
  renderAll();
  setStatus(`已生成 ${newTasks.length} 条课程安排。`, 'hidden');
}

function openDailyPlanTableModal() {
  closeImportChoiceModal();
  dailyPlanDate.value = taskDateFilter.value || formatLocalDate(currentEffectiveNow);
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

  const typeCell = document.createElement('td');
  typeCell.appendChild(createTypeSelect('工作'));

  row.append(timeCell, titleCell, typeCell);
  dailyPlanTableBody.appendChild(row);
}

async function saveDailyPlanTable() {
  const date = normalizeDate(dailyPlanDate.value);
  if (!date) {
    setStatus('请先选择每日安排日期。', '');
    return;
  }

  const newTasks = Array.from(dailyPlanTableBody.querySelectorAll('tr'))
    .map((row, index) => {
      const timeInput = row.querySelector('td:nth-child(1) input');
      const titleInput = row.querySelector('td:nth-child(2) input');
      const typeSelect = row.querySelector('select');
      const timeRange = extractTimeRangeFromInput(timeInput.value);
      const title = clean(titleInput.value);
      if (!timeRange || !title) return null;

      return {
        id: `daily-${Date.now()}-${index}`,
        title,
        startTime: timeRange.startTime,
        endTime: timeRange.endTime,
        date,
        weekday: weekdayFromDate(date),
        location: '',
        type: normalizeTaskType(typeSelect.value, title),
        planDetails: '',
        details: '',
        status: '未评价',
        rawText: '',
        sheetName: '手动安排',
        order: nextOrderForDate(date) + index * 10,
        isDraft: false
      };
    })
    .filter(Boolean);

  if (newTasks.length === 0) {
    setStatus('请至少填写一条有效的时间段和任务。', '');
    return;
  }

  tasks = mergeTasks(tasks, newTasks);
  taskDateFilter.value = date;
  activePlanningDates.add(date);
  await saveState();
  closeDailyPlanTableModal();
  renderAll();
  setStatus(`已生成 ${newTasks.length} 条当日安排。`, 'hidden');
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

function renderTasks() {
  const selectedDate = clean(taskDateFilter.value);
  const visibleTasks = selectedDate
    ? tasks.filter((task) => isRenderableTask(task) && normalizeDate(task.date) === selectedDate)
    : tasks.filter(isRenderableTask);
  emptyState.classList.add('hidden');
  taskWorkspace.classList.remove('hidden');
  taskList.innerHTML = '';

  const sortedTasks = sortTasksForDisplay(visibleTasks);

  sortedTasks.forEach((task) => {
    const card = document.createElement('article');
    card.className = 'task-card';
    card.dataset.taskId = task.id;
    card.addEventListener('dragover', handleTaskDragOver);
    card.addEventListener('drop', handleTaskDrop);

    const time = document.createElement('div');
    time.className = 'task-time task-time-editor';
    const startInput = createInlineInput('time', task.startTime, '开始时间');
    startInput.classList.add('time-input');
    startInput.addEventListener('change', () => updateTaskField(task.id, 'startTime', startInput.value));
    const separator = document.createElement('span');
    separator.textContent = '-';
    const endInput = createInlineInput('time', task.endTime, '结束时间');
    endInput.classList.add('time-input');
    endInput.addEventListener('change', () => updateTaskField(task.id, 'endTime', endInput.value));
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
  updateTaskTemporalView({ scrollToCurrent: true, forceScroll: true });
}

function renderAll() {
  renderTasks();
  renderJournalList();
  renderSelectedJournal();
}

function showPage(page) {
  navItems.forEach((navItem) => {
    navItem.classList.toggle('active', navItem.dataset.page === page);
  });
  Object.values(pages).forEach((section) => section.classList.remove('active'));
  pages[page].classList.add('active');
  pageTitle.textContent = pageTitleFor(page);
}

async function goToCurrentTask() {
  const now = await getEffectiveNow();
  currentEffectiveNow = now;
  const date = formatLocalDate(now);
  taskDateFilter.value = date;
  activePlanningDates.add(date);
  showPage('tasks');
  renderTasks();
  updateTaskTemporalView({ scrollToCurrent: true, forceScroll: true });
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
  const dueReminders = [];
  lastReminderCheckValue = currentCheckValue;

  todayTasks.forEach((task, taskIndex) => {
    buildReminderEvents(task).forEach((event) => {
      const eventCheckValue = dayStartCheckValue(now) + event.minute;
      if (!isReminderDue(previousCheckValue, currentCheckValue, eventCheckValue)) return;
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
    taskDateFilter.value = formatLocalDate(new Date());
  }

  return clean(taskDateFilter.value);
}

function mergeJournals(currentJournals, importedJournals) {
  const journalMap = new Map(currentJournals.map((journal) => [journalIdentity(journal), journal]));

  importedJournals.forEach((journal) => {
    const key = journalIdentity(journal);
    if (!key || !journal.content) return;

    journalMap.set(key, {
      id: journal.id || `journal-${Date.now()}`,
      date: journalPrimaryDate(journal),
      dateRangeStart: normalizeDate(journal.dateRangeStart),
      dateRangeEnd: normalizeDate(journal.dateRangeEnd),
      sheetName: clean(journal.sheetName),
      content: clean(journal.content),
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
  const date = clean(journalDate.value);
  const content = clean(journalContent.value);

  if (!date) {
    journalSaveState.textContent = '请先选择日期';
    return;
  }

  journals = mergeJournals(journals, [{
    id: `journal-${date}`,
    date,
    sheetName: '',
    content,
    source: 'manual'
  }]);

  if (!content) {
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
  journalSaveState.textContent = journal ? '已加载' : '尚未保存';
}

function renderJournalList() {
  ensureJournalViewDate();
  journalList.innerHTML = '';

  if (journals.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'muted';
    empty.textContent = '还没有每日记录。可以手动保存，也可以从表格文件中的记录内容或批注导入。';
    journalList.appendChild(empty);
    return;
  }

  journals.forEach((journal) => {
    const item = document.createElement('button');
    item.className = 'journal-item';
    item.type = 'button';
    item.addEventListener('click', () => {
      openJournalEntry(journal);
    });

    const title = document.createElement('strong');
    title.textContent = journalDisplayDate(journal);
    const preview = document.createElement('span');
    preview.textContent = journal.content;
    item.append(title, preview);
    journalList.appendChild(item);
  });
}

function ensureJournalViewDate() {
  if (journalViewDate.value) return;
  journalViewDate.value = latestJournalDate() || formatLocalDate(currentEffectiveNow || new Date());
}

function openJournalEntry(journal) {
  const targetDate = journalPrimaryDate(journal);
  renderJournalView(journal, targetDate, journalDisplayDate(journal));
}

function openJournalForDate(date) {
  const normalizedDate = normalizeDate(date);
  const journal = findJournalForDate(normalizedDate, date);
  renderJournalView(journal, normalizedDate, normalizedDate || date || '未标记日期');
}

function renderJournalView(journal, targetDate, fallbackTitle) {
  const normalizedDate = normalizeDate(targetDate);
  const dayTasks = sortTasksForDisplay(tasks.filter((task) => normalizeDate(task.date) === normalizedDate));
  journalViewTitle.textContent = fallbackTitle || (journal ? journalDisplayDate(journal) : normalizedDate || '未标记日期');
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
      const status = document.createElement('span');
      status.textContent = `完成情况：${task.status || '未评价'}`;
      const details = document.createElement('p');
      details.textContent = task.details || '没有填写反思内容。';
      item.append(title, status, details);
      taskSection.appendChild(item);
    });
  }

  journalViewContent.appendChild(taskSection);
  journalViewModal.classList.remove('hidden');
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
  const { start, end } = journalDateRange(journal);
  return [start, end, clean(journal.sheetName), clean(journal.id)].filter(Boolean).join('|');
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

function expandTasksAcrossDates(taskItems, dates) {
  const expanded = [];
  dates.forEach((date) => {
    taskItems.forEach((task, index) => {
      expanded.push({
        ...task,
        id: `import-${Date.now()}-${date}-${index}`,
        date,
        weekday: weekdayFromDate(date),
        order: nextOrderForDate(date) + index * 10
      });
    });
  });
  return expanded;
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
  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return null;
  const parsed = new Date(`${normalized}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
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
    defaultsVersion: '0.1.2'
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
    ...systemTimeProfile
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
    journals = normalizeJournalCollection(result.data.journals || []);
    profile = {
      ...defaultProfile(),
      ...(result.data.profile || {})
    };
    storagePaths = result.paths || storagePaths;
    const migratedProfile = migrateProfileDefaults(profile);
    profile = migratedProfile.profile;
    journalViewDate.value = latestJournalDate() || journalDate.value || formatLocalDate(new Date());
    loadProfileToForm();
    await migrateLegacyLocalStorageIfNeeded();
    if (migratedProfile.changed) await saveState();
    updateStoragePathView();
    renderAll();
  } catch (error) {
    setStatus(`加载数据失败：${error.message}`, '');
  }
}

function migrateProfileDefaults(profileData) {
  const migrated = { ...profileData };
  let changed = false;
  if (migrated.defaultsVersion !== '0.1.2') {
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
    migrated.defaultsVersion = '0.1.2';
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

async function chooseSettingsPath() {
  const result = await window.whbr.chooseSettingsPath({ tasks, journals, profile });

  if (result.canceled) {
    return;
  }

  storagePaths = result.paths || storagePaths;
  updateStoragePathView();
}

function openDeleteDayModal() {
  deleteMode = 'day';
  if (!deleteDayDate.value) {
    deleteDayDate.value = taskDateFilter.value || new Date().toISOString().slice(0, 10);
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
  journalDate.value = today;
  taskDateFilter.value = today;
  deleteDayDate.value = today;

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
