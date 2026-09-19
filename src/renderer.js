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
const MICROPHONE_TEST_SAMPLE_RATE = 48000;
const {
  MIN_DATE_VALUE,
  enumerateDates,
  formatClockDate,
  formatClockTime,
  formatLocalDate,
  isCompleteDate,
  isSelectableDate,
  normalizeDate,
  parseLocalDate,
  sanitizeDateSegmentLengths,
  shiftDate,
  weekdayFromDate
} = globalThis.RizhiDateUtils;
const {
  extractTimeRangeFromInput,
  formatTimeRangeInput,
  inputRangeToComparableIntervals,
  isValidClockPart,
  normalizeTime,
  rangesOverlap,
  rangeToComparableIntervals,
  timeToMinutes
} = globalThis.RizhiTaskTimeUtils;
const {
  DEFAULT_JOURNAL_TAGS,
  legacyRatingToTagId
} = globalThis.RizhiJournalTags;
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
const journalVoiceStartButton = document.querySelector('#journalVoiceStartButton');
const journalVoiceCancelButton = document.querySelector('#journalVoiceCancelButton');
const journalVoiceTimer = document.querySelector('#journalVoiceTimer');
const journalVoiceStatus = document.querySelector('#journalVoiceStatus');
const journalFilterModeButton = document.querySelector('#journalFilterModeButton');
const journalTagFilter = document.querySelector('#journalTagFilter');
const journalTagFilterPaletteButton = document.querySelector('#journalTagFilterPaletteButton');
const journalTagFilterPalette = document.querySelector('#journalTagFilterPalette');
const journalTagFilterField = document.querySelector('#journalTagFilterField');
const journalViewDateField = document.querySelector('#journalViewDateField');
const journalViewDate = document.querySelector('#journalViewDate');
const journalList = document.querySelector('#journalList');
const recordsLayout = document.querySelector('.records-layout');
const journalEditorPanel = document.querySelector('#journalEditorPanel');
const recordsListPanel = document.querySelector('#recordsListPanel');
const showJournalListButton = document.querySelector('#showJournalListButton');
const backToJournalEditorButton = document.querySelector('#backToJournalEditorButton');
const dataFilePath = document.querySelector('#dataFilePath');
const settingsFilePath = document.querySelector('#settingsFilePath');
const modelDownloadPath = document.querySelector('#modelDownloadPath');
const chooseDataPathButton = document.querySelector('#chooseDataPathButton');
const openDataPathButton = document.querySelector('#openDataPathButton');
const changeSettingsPathButton = document.querySelector('#changeSettingsPathButton');
const openSettingsPathButton = document.querySelector('#openSettingsPathButton');
const openModelDirectoryButton = document.querySelector('#openModelDirectoryButton');
const settingsMenuButtons = document.querySelectorAll('.settings-menu-item');
const settingsPanels = document.querySelectorAll('[data-settings-panel].panel');
const settingsEmptyPanel = document.querySelector('#settingsEmptyPanel');
const asrTestStartButton = document.querySelector('#asrTestStartButton');
const asrTestStopButton = document.querySelector('#asrTestStopButton');
const asrTestStatus = document.querySelector('#asrTestStatus');
const asrModelStatus = document.querySelector('#asrModelStatus');
const asrModelDownloadButton = document.querySelector('#asrModelDownloadButton');
const settingsAsrDownloadProgress = document.querySelector('#settingsAsrDownloadProgress');
const asrPartialResult = document.querySelector('#asrPartialResult');
const asrFinalResult = document.querySelector('#asrFinalResult');
const asrInputDeviceSelect = document.querySelector('#asrInputDeviceSelect');
const asrRefreshDevicesButton = document.querySelector('#asrRefreshDevicesButton');
const asrMicTestStartButton = document.querySelector('#asrMicTestStartButton');
const asrMicTestStopButton = document.querySelector('#asrMicTestStopButton');
const asrInputWaveform = document.querySelector('#asrInputWaveform');
const asrInputFeedback = document.querySelector('#asrInputFeedback');
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
const dailyPlanModalCard = dailyPlanTableModal && dailyPlanTableModal.querySelector('.daily-plan-modal-card');
const dailyPlanLaunchPanel = document.querySelector('#dailyPlanLaunchPanel');
const dailyPlanVoicePage = document.querySelector('#dailyPlanVoicePage');
const openDailyPlanVoicePageButton = document.querySelector('#openDailyPlanVoicePageButton');
const backDailyPlanVoicePageButton = document.querySelector('#backDailyPlanVoicePageButton');
const closeDailyPlanVoicePageButton = document.querySelector('#closeDailyPlanVoicePageButton');
const dailyPlanMultiDay = document.querySelector('#dailyPlanMultiDay');
const dailyPlanSingleDateRow = document.querySelector('#dailyPlanSingleDateRow');
const dailyPlanRangeRow = document.querySelector('#dailyPlanRangeRow');
const dailyPlanDate = document.querySelector('#dailyPlanDate');
const dailyPlanStartDate = document.querySelector('#dailyPlanStartDate');
const dailyPlanEndDate = document.querySelector('#dailyPlanEndDate');
const dailyPlanTableBody = document.querySelector('#dailyPlanTableBody');
const addDailyPlanRowButton = document.querySelector('#addDailyPlanRowButton');
const cancelDailyPlanTableButton = document.querySelector('#cancelDailyPlanTableButton');
const saveDailyPlanTableButton = document.querySelector('#saveDailyPlanTableButton');
const dailyPlanVoiceStartButton = document.querySelector('#dailyPlanVoiceStartButton');
const dailyPlanVoiceCancelButton = document.querySelector('#dailyPlanVoiceCancelButton');
const dailyPlanVoiceConfirmButton = document.querySelector('#dailyPlanVoiceConfirmButton');
const dailyPlanVoiceStatus = document.querySelector('#dailyPlanVoiceStatus');
const dailyPlanVoiceTimer = document.querySelector('#dailyPlanVoiceTimer');
const dailyPlanVoiceText = document.querySelector('#dailyPlanVoiceText');
const dailyPlanVoiceApplyButton = document.querySelector('#dailyPlanVoiceApplyButton');
const journalViewModal = document.querySelector('#journalViewModal');
const journalViewTitle = document.querySelector('#journalViewTitle');
const journalViewContent = document.querySelector('#journalViewContent');
const closeJournalViewModalButton = document.querySelector('#closeJournalViewModalButton');
const closeJournalViewButton = document.querySelector('#closeJournalViewButton');
const journalUnsavedModal = document.querySelector('#journalUnsavedModal');
const closeJournalUnsavedModalButton = document.querySelector('#closeJournalUnsavedModalButton');
const discardJournalChangesButton = document.querySelector('#discardJournalChangesButton');
const cancelJournalNavigationButton = document.querySelector('#cancelJournalNavigationButton');
const saveJournalBeforeLeaveButton = document.querySelector('#saveJournalBeforeLeaveButton');
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
let asrModelDownloadDirectory = '';
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
let recordsView = 'editor';
let committedProfileStatsStartDate = '';
let pendingJournalUnsavedResolver = null;
let journalDateChangePending = false;
let asrTestCapture = null;
let asrTestCaptureUnsubscribe = null;
let asrTestRecording = false;
let asrModelDownloadInFlight = false;
let latestAsrModelStatus = null;
let microphoneTestCapture = null;
let microphoneTestUnsubscribe = null;
let microphoneTestRecording = false;
let microphoneSilenceTimer = null;
let lastMicrophoneSoundAt = 0;
let journalVoiceCapture = null;
let journalVoiceCaptureUnsubscribe = null;
let journalVoiceRecording = false;
let journalVoiceProcessing = false;
let journalVoiceCanceled = false;
let journalVoiceInsertionPoint = null;
let journalVoiceFinalInserted = false;
let journalLastCursorPosition = null;
let journalVoiceHasInsertedSegment = false;
let journalVoiceOriginalContent = '';
let journalVoiceOriginalInsertionPoint = null;
let journalVoiceSilenceTimer = null;
let journalVoiceLastSoundAt = 0;
let journalVoiceWarningTimer = null;
let journalVoiceMaximumTimer = null;
let journalVoiceTimerInterval = null;
let journalVoiceRecordingStartedAt = 0;
let journalVoiceConversionStartedAt = 0;
let journalVoiceCapturedSeconds = 0;
let journalVoiceDecodedSeconds = 0;
let journalVoiceDecodeRealtimeFactor = 0;
let dailyPlanVoiceCapture = null;
let dailyPlanVoiceCaptureUnsubscribe = null;
let dailyPlanVoiceRecording = false;
let dailyPlanVoiceCanceled = false;
let dailyPlanVoiceFinalReceived = false;
let dailyPlanVoiceProcessing = false;
let dailyPlanVoiceWarningActive = false;
let dailyPlanVoiceWarningTimer = null;
let dailyPlanVoiceMaximumTimer = null;
let dailyPlanVoiceTimerInterval = null;
let dailyPlanVoiceRecordingStartedAt = 0;
let dailyPlanVoiceConversionStartedAt = 0;
let dailyPlanVoiceCapturedSeconds = 0;
let dailyPlanVoiceDecodedSeconds = 0;
let dailyPlanVoiceDecodeRealtimeFactor = 0;
let dailyPlanVoiceParsedCandidates = [];
let dailyPlanVoiceParsedText = '';
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
    recordsView: 'editor',
    targetSelector: '.journal-editor',
    title: '每日生活记录',
    text: '这里用于写下当天的活动、状态和复盘内容。填写区内容较多时会在文本框内滚动，页面本身保持稳定。'
  },
  {
    page: 'records',
    recordsView: 'editor',
    targetSelector: '#showJournalListButton',
    title: '查看记录列表',
    text: '保存记录旁边可以进入记录列表；平时记录页只显示每日生活记录，减少页面上下滚动和干扰。'
  },
  {
    page: 'records',
    recordsView: 'list',
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
    settingPanel: 'data',
    targetSelector: '.settings-data-panel',
    title: '数据文件',
    text: '个人记录与软件设置会存放在这里显示的文件夹中。可以选择新的保存文件夹，也可以直接打开本地文件夹做备份或迁移。'
  },
  {
    page: 'settings',
    settingPanel: 'tags',
    targetSelector: '.settings-tags-panel',
    title: '标签',
    text: '标签用纯色块标记每日记录。可以新增、删除和调整颜色，并用简称与全称说明每种日子的含义。'
  },
  {
    page: 'settings',
    settingPanel: 'reminders',
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
  item.addEventListener('click', async () => {
    const targetPage = item.dataset.page;
    if (!(await confirmLeaveRecordsPageIfNeeded(targetPage))) return;
    if (targetPage === 'tasks') {
      goToCurrentTask();
      return;
    }
    showPage(targetPage);
  });
});

settingsMenuButtons.forEach((button) => {
  button.addEventListener('click', () => showSettingsPanel(button.dataset.settingsPanel));
});

if (asrTestStartButton) asrTestStartButton.addEventListener('click', startRecording);
if (asrTestStopButton) asrTestStopButton.addEventListener('click', stopRecording);
if (asrModelDownloadButton) asrModelDownloadButton.addEventListener('click', downloadAsrModelFromSettings);
if (asrRefreshDevicesButton) asrRefreshDevicesButton.addEventListener('click', refreshAudioInputDevices);
if (asrMicTestStartButton) asrMicTestStartButton.addEventListener('click', startMicrophoneTest);
if (asrMicTestStopButton) asrMicTestStopButton.addEventListener('click', stopMicrophoneTest);
if (journalVoiceStartButton) journalVoiceStartButton.addEventListener('click', toggleJournalVoiceInput);
if (journalVoiceCancelButton) journalVoiceCancelButton.addEventListener('click', cancelJournalVoiceInput);
if (journalContent) {
  ['focus', 'click', 'keyup', 'select', 'input'].forEach((eventName) => {
    journalContent.addEventListener(eventName, rememberJournalCursorPosition);
  });
  journalContent.addEventListener('input', updateJournalDirtyState);
}
subscribeToAsrTestEvents();

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
if (closeJournalUnsavedModalButton) closeJournalUnsavedModalButton.addEventListener('click', () => resolveJournalUnsavedChoice('cancel'));
if (discardJournalChangesButton) discardJournalChangesButton.addEventListener('click', () => resolveJournalUnsavedChoice('discard'));
if (cancelJournalNavigationButton) cancelJournalNavigationButton.addEventListener('click', () => resolveJournalUnsavedChoice('cancel'));
if (saveJournalBeforeLeaveButton) saveJournalBeforeLeaveButton.addEventListener('click', () => resolveJournalUnsavedChoice('save'));
if (journalUnsavedModal) {
  journalUnsavedModal.addEventListener('click', (event) => {
    if (event.target === journalUnsavedModal) resolveJournalUnsavedChoice('cancel');
  });
}
window.addEventListener('resize', () => {
  if (!tutorialOverlay.classList.contains('hidden')) positionTutorialOverlay();
});
document.addEventListener('click', closeTagPalettesOnOutsideClick);

backToCurrentTaskButton.addEventListener('click', async () => {
  if (await confirmLeaveRecordsPageIfNeeded('tasks')) goToCurrentTask();
});
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
  if (event.key === 'Escape' && journalUnsavedModal && !journalUnsavedModal.classList.contains('hidden')) {
    resolveJournalUnsavedChoice('cancel');
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
  if (recordsView !== 'editor') return false;
  return [
    resetModal,
    taskEditModal,
    importChoiceModal,
    scheduleTableModal,
    dailyPlanTableModal,
    journalViewModal,
    journalUnsavedModal,
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
registerDateInput(journalDate, { onCommit: handleJournalDateCommit });
if (journalTag) journalTag.addEventListener('change', () => {
  renderTagPicker(journalTag, journalTagPaletteButton, journalTagPalette);
  updateJournalDirtyState();
});
if (journalTagFilter) {
  journalTagFilter.addEventListener('change', () => {
    renderTagPicker(journalTagFilter, journalTagFilterPaletteButton, journalTagFilterPalette);
    if (journalFilterMode === 'tag') {
      appliedJournalTagFilter = normalizeJournalTagId(journalTagFilter.value);
      renderJournalListPreservingScroll();
    }
  });
}
if (journalTagPaletteButton) journalTagPaletteButton.addEventListener('click', () => toggleTagPalette(journalTagPalette));
if (journalTagFilterPaletteButton) journalTagFilterPaletteButton.addEventListener('click', () => toggleTagPalette(journalTagFilterPalette));
if (journalFilterModeButton) journalFilterModeButton.addEventListener('click', cycleJournalFilterMode);
if (showJournalListButton) showJournalListButton.addEventListener('click', () => showRecordsView('list'));
if (backToJournalEditorButton) backToJournalEditorButton.addEventListener('click', () => showRecordsView('editor'));
saveJournalButton.addEventListener('click', saveSelectedJournal);
registerDateInput(journalViewDate, {
  onCommit: () => {
    if (journalFilterMode === 'date') renderJournalListPreservingScroll();
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
if (changeSettingsPathButton) changeSettingsPathButton.addEventListener('click', chooseDataPath);
if (openSettingsPathButton) openSettingsPathButton.addEventListener('click', openDataPath);
if (openModelDirectoryButton) openModelDirectoryButton.addEventListener('click', openModelDirectory);
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
if (closeDailyPlanVoicePageButton) closeDailyPlanVoicePageButton.addEventListener('click', closeDailyPlanTableModal);
if (openDailyPlanVoicePageButton) openDailyPlanVoicePageButton.addEventListener('click', openDailyPlanVoicePage);
if (backDailyPlanVoicePageButton) backDailyPlanVoicePageButton.addEventListener('click', closeDailyPlanVoicePage);
cancelDailyPlanTableButton.addEventListener('click', closeDailyPlanTableModal);
addDailyPlanRowButton.addEventListener('click', () => addDailyPlanRow());
saveDailyPlanTableButton.addEventListener('click', saveDailyPlanTable);
if (dailyPlanVoiceStartButton) dailyPlanVoiceStartButton.addEventListener('click', toggleDailyPlanVoiceInput);
if (dailyPlanVoiceCancelButton) dailyPlanVoiceCancelButton.addEventListener('click', cancelDailyPlanVoiceInput);
if (dailyPlanVoiceConfirmButton) dailyPlanVoiceConfirmButton.addEventListener('click', confirmDailyPlanVoiceText);
if (dailyPlanVoiceApplyButton) dailyPlanVoiceApplyButton.addEventListener('click', applyDailyPlanVoiceTasks);
if (dailyPlanVoiceText) dailyPlanVoiceText.addEventListener('input', invalidateDailyPlanVoiceParse);
if (dailyPlanMultiDay) dailyPlanMultiDay.addEventListener('change', handleDailyPlanDateModeChange);
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

function getSelectedAudioInputDeviceId() {
  return asrInputDeviceSelect ? asrInputDeviceSelect.value : '';
}

async function refreshAudioInputDevices() {
  if (!asrInputDeviceSelect || !window.RizhiAsrAudioCapture) return;
  const previousDeviceId = asrInputDeviceSelect.value;
  asrRefreshDevicesButton.disabled = true;
  try {
    const devices = await window.RizhiAsrAudioCapture.getAudioInputDevices();
    asrInputDeviceSelect.replaceChildren();
    if (!devices.length) {
      const option = new Option('未发现可用麦克风', '');
      asrInputDeviceSelect.add(option);
      asrInputDeviceSelect.disabled = true;
      return;
    }

    devices.forEach((device, index) => {
      const label = device.label || `语音输入设备 ${index + 1}（授权后显示名称）`;
      asrInputDeviceSelect.add(new Option(label, device.deviceId));
    });
    asrInputDeviceSelect.disabled = false;
    const matchingDevice = devices.some((device) => device.deviceId === previousDeviceId);
    asrInputDeviceSelect.value = matchingDevice ? previousDeviceId : devices[0].deviceId;
  } catch (error) {
    asrInputDeviceSelect.replaceChildren(new Option('无法读取语音输入设备', ''));
    asrInputDeviceSelect.disabled = true;
    setInputFeedback(`无法读取设备：${error.message || String(error)}`, 'warning');
  } finally {
    asrRefreshDevicesButton.disabled = microphoneTestRecording || asrTestRecording;
  }
}

async function startMicrophoneTest() {
  if (microphoneTestRecording) return;
  if (journalVoiceRecording || dailyPlanVoiceRecording) {
    setInputFeedback('请先停止正在进行的语音输入，再开始麦克风测试。', 'warning');
    return;
  }
  if (asrTestRecording) {
    setInputFeedback('请先停止语音识别录音，再开始麦克风测试。', 'warning');
    return;
  }

  setMicrophoneTestControls(true);
  clearInputWaveform();
  setInputFeedback('正在请求麦克风权限…');
  try {
    await ensureMicrophoneTestCapture();
    const captureResult = await microphoneTestCapture.start();
    microphoneTestRecording = true;
    lastMicrophoneSoundAt = Date.now();
    setMicrophoneTestControls(true);
    setInputFeedback(`正在测试：输入 ${captureResult.inputSampleRate} Hz，波形已重采样至 ${captureResult.sampleRate} Hz。`, 'warning');
    startMicrophoneSilenceWatch();
    await refreshAudioInputDevices();
    setMicrophoneTestControls(true);
  } catch (error) {
    microphoneTestRecording = false;
    setMicrophoneTestControls(false);
    setInputFeedback(describeMicrophoneError(error), 'warning');
  }
}

async function stopMicrophoneTest() {
  if (!microphoneTestRecording) return;
  setMicrophoneTestControls(true, true);
  try {
    await microphoneTestCapture.stop();
    setInputFeedback('麦克风测试已停止。未保存或发送任何音频。');
  } catch (error) {
    setInputFeedback(describeMicrophoneError(error), 'warning');
  } finally {
    microphoneTestRecording = false;
    stopMicrophoneSilenceWatch();
    setMicrophoneTestControls(false);
  }
}

async function ensureMicrophoneTestCapture() {
  if (!window.RizhiAsrAudioCapture || !window.RizhiAsrAudioCapture.AudioCapture) {
    throw new Error('未能加载 AudioWorklet 麦克风采集模块。');
  }
  const deviceId = getSelectedAudioInputDeviceId();
  if (!microphoneTestCapture) {
    // This test does not invoke ASR, so it uses a neutral browser-audio target
    // rather than duplicating the model sample-rate configuration in renderer.
    microphoneTestCapture = new window.RizhiAsrAudioCapture.AudioCapture({
      sampleRate: MICROPHONE_TEST_SAMPLE_RATE,
      deviceId
    });
    microphoneTestUnsubscribe = microphoneTestCapture.onAudioFrame((frame) => {
      if (frame.error) {
        setInputFeedback(describeMicrophoneError(frame.error), 'warning');
        return;
      }
      drawInputWaveform(frame.samples);
      const level = calculateRms(frame.samples);
      if (level >= 0.012) {
        lastMicrophoneSoundAt = Date.now();
        setInputFeedback('麦克风工作正常，正在接收声音。', 'active');
      }
    });
  } else {
    microphoneTestCapture.setDeviceId(deviceId);
  }
  await microphoneTestCapture.initialize();
}

function calculateRms(samples) {
  if (!samples || !samples.length) return 0;
  let total = 0;
  for (let index = 0; index < samples.length; index += 1) total += samples[index] * samples[index];
  return Math.sqrt(total / samples.length);
}

function drawInputWaveform(samples) {
  if (!asrInputWaveform) return;
  const rect = asrInputWaveform.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  const width = Math.max(1, Math.round(rect.width * ratio));
  const height = Math.max(1, Math.round(rect.height * ratio));
  if (asrInputWaveform.width !== width || asrInputWaveform.height !== height) {
    asrInputWaveform.width = width;
    asrInputWaveform.height = height;
  }

  const context = asrInputWaveform.getContext('2d');
  context.clearRect(0, 0, width, height);
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, width, height);
  context.strokeStyle = '#dbe2e8';
  context.lineWidth = ratio;
  context.beginPath();
  context.moveTo(0, height / 2);
  context.lineTo(width, height / 2);
  context.stroke();

  context.strokeStyle = '#21865e';
  context.lineWidth = Math.max(1, ratio * 1.5);
  context.beginPath();
  const step = Math.max(1, Math.ceil(samples.length / width));
  for (let x = 0, sampleIndex = 0; x < width; x += 1, sampleIndex += step) {
    const sample = samples[Math.min(sampleIndex, samples.length - 1)] || 0;
    const y = height / 2 - sample * height * 0.42;
    if (x === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  }
  context.stroke();
}

function clearInputWaveform() {
  if (!asrInputWaveform) return;
  const context = asrInputWaveform.getContext('2d');
  if (!context) return;
  const rect = asrInputWaveform.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  asrInputWaveform.width = Math.max(1, Math.round(rect.width * ratio));
  asrInputWaveform.height = Math.max(1, Math.round(rect.height * ratio));
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, asrInputWaveform.width, asrInputWaveform.height);
  context.strokeStyle = '#dbe2e8';
  context.beginPath();
  context.moveTo(0, asrInputWaveform.height / 2);
  context.lineTo(asrInputWaveform.width, asrInputWaveform.height / 2);
  context.stroke();
}

function startMicrophoneSilenceWatch() {
  stopMicrophoneSilenceWatch();
  microphoneSilenceTimer = window.setInterval(() => {
    if ((microphoneTestRecording || asrTestRecording) && Date.now() - lastMicrophoneSoundAt >= 1200) {
      setInputFeedback('未接收到声音', 'warning');
    }
  }, 350);
}

function stopMicrophoneSilenceWatch() {
  if (microphoneSilenceTimer) window.clearInterval(microphoneSilenceTimer);
  microphoneSilenceTimer = null;
}

function startJournalVoiceSilenceWatch() {
  stopJournalVoiceSilenceWatch();
  journalVoiceSilenceTimer = window.setInterval(() => {
    if (journalVoiceRecording && Date.now() - journalVoiceLastSoundAt >= 1200) {
      setJournalVoiceStatus('未检测到声音输入。请检查麦克风或开始说话。', 'warning');
    }
  }, 350);
}

function stopJournalVoiceSilenceWatch() {
  if (journalVoiceSilenceTimer) window.clearInterval(journalVoiceSilenceTimer);
  journalVoiceSilenceTimer = null;
}

function startJournalVoiceDurationTimers(maxDurationSeconds) {
  stopJournalVoiceDurationTimers();
  const timers = scheduleVoiceDurationTimers(maxDurationSeconds, {
    isRecording: () => journalVoiceRecording,
    onWarning: () => {
      setJournalVoiceStatus('还有 10 秒录制时间，请准备结束本段录音。', 'warning');
      playJournalVoiceWarningTone(journalVoiceCapture);
    },
    onMaximum: () => void stopJournalVoiceInput({ automatic: true })
  });
  journalVoiceWarningTimer = timers.warningTimer;
  journalVoiceMaximumTimer = timers.maximumTimer;
}

function scheduleVoiceDurationTimers(maxDurationSeconds, handlers) {
  const maxSeconds = Math.max(1, Number(maxDurationSeconds) || 90);
  const warningDelayMs = Math.max(0, (maxSeconds - 10) * 1000);
  const warningTimer = window.setTimeout(() => {
    if (!handlers || typeof handlers.isRecording !== 'function' || !handlers.isRecording()) return;
    if (typeof handlers.onWarning === 'function') handlers.onWarning();
  }, warningDelayMs);
  const maximumTimer = window.setTimeout(() => {
    if (!handlers || typeof handlers.isRecording !== 'function' || !handlers.isRecording()) return;
    if (typeof handlers.onMaximum === 'function') handlers.onMaximum();
  }, maxSeconds * 1000);
  return { warningTimer, maximumTimer };
}

function stopJournalVoiceDurationTimers() {
  if (journalVoiceWarningTimer) window.clearTimeout(journalVoiceWarningTimer);
  if (journalVoiceMaximumTimer) window.clearTimeout(journalVoiceMaximumTimer);
  journalVoiceWarningTimer = null;
  journalVoiceMaximumTimer = null;
}

function formatVoiceDuration(totalSeconds) {
  const seconds = Math.max(0, Math.ceil(Number(totalSeconds) || 0));
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

function setJournalVoiceTimer(text, hidden = false) {
  if (!journalVoiceTimer) return;
  journalVoiceTimer.textContent = text;
  journalVoiceTimer.classList.toggle('hidden', hidden);
}

function clearJournalVoiceTimer({ hide = false } = {}) {
  if (journalVoiceTimerInterval) window.clearInterval(journalVoiceTimerInterval);
  journalVoiceTimerInterval = null;
  if (hide) setJournalVoiceTimer('', true);
}

function startJournalVoiceRecordingTimer(maxDurationSeconds) {
  clearJournalVoiceTimer({ hide: true });
  journalVoiceRecordingStartedAt = Date.now();
  const maxSeconds = Math.max(1, Number(maxDurationSeconds) || 90);
  const render = () => {
    const elapsed = (Date.now() - journalVoiceRecordingStartedAt) / 1000;
    setJournalVoiceTimer(
      `录音 ${formatVoiceDuration(elapsed)} / ${formatVoiceDuration(maxSeconds)}（剩余 ${formatVoiceDuration(maxSeconds - elapsed)}）`
    );
  };
  render();
  journalVoiceTimerInterval = window.setInterval(render, 250);
}

function startJournalVoiceConversionTimer() {
  clearJournalVoiceTimer();
  journalVoiceConversionStartedAt = Date.now();
  const pendingAudioSeconds = Math.max(0.5, journalVoiceCapturedSeconds - journalVoiceDecodedSeconds);
  // The estimate uses actual speed from already decoded VAD segments. A
  // conservative fallback is used for the first segment of a fresh session.
  const realtimeFactor = journalVoiceDecodeRealtimeFactor || 1.2;
  const estimatedSeconds = Math.max(1, Math.ceil(pendingAudioSeconds * realtimeFactor));
  const render = () => {
    const elapsed = (Date.now() - journalVoiceConversionStartedAt) / 1000;
    const remaining = estimatedSeconds - elapsed;
    const suffix = remaining > 0
      ? `预计剩余 ${formatVoiceDuration(remaining)}`
      : '正在完成最后一段';
    setJournalVoiceTimer(`转换 ${formatVoiceDuration(elapsed)}（${suffix}）`);
  };
  render();
  journalVoiceTimerInterval = window.setInterval(render, 250);
}

function finishJournalVoiceConversionTimer() {
  if (!journalVoiceConversionStartedAt) return;
  const elapsed = (Date.now() - journalVoiceConversionStartedAt) / 1000;
  clearJournalVoiceTimer();
  setJournalVoiceTimer(`转换完成，耗时 ${formatVoiceDuration(elapsed)}`);
  journalVoiceConversionStartedAt = 0;
}

function updateJournalVoiceDecodeEstimate(payload) {
  const segmentSeconds = Number(payload && payload.segmentDurationSeconds);
  const decodeMilliseconds = Number(payload && payload.decodeElapsedMs);
  if (!(segmentSeconds > 0) || !(decodeMilliseconds >= 0)) return;
  journalVoiceDecodedSeconds += segmentSeconds;
  const observedFactor = decodeMilliseconds / (segmentSeconds * 1000);
  journalVoiceDecodeRealtimeFactor = journalVoiceDecodeRealtimeFactor > 0
    ? journalVoiceDecodeRealtimeFactor * 0.7 + observedFactor * 0.3
    : observedFactor;
}

function playJournalVoiceWarningTone(audioCapture = journalVoiceCapture) {
  const audioContext = audioCapture && audioCapture.audioContext;
  if (!audioContext || audioContext.state === 'closed') return;
  try {
    if (audioContext.state === 'suspended') void audioContext.resume();
    const startAt = audioContext.currentTime + 0.02;
    [0, 0.18].forEach((offset) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = 880;
      gain.gain.setValueAtTime(0.0001, startAt + offset);
      gain.gain.exponentialRampToValueAtTime(0.16, startAt + offset + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + offset + 0.13);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(startAt + offset);
      oscillator.stop(startAt + offset + 0.14);
    });
  } catch (error) {
    // The visible 10-second warning remains available if the system blocks sound.
  }
}

function setMicrophoneTestControls(recording, stopping = false) {
  if (asrMicTestStartButton) asrMicTestStartButton.disabled = recording;
  if (asrMicTestStopButton) asrMicTestStopButton.disabled = !recording || stopping;
  setInputDeviceControlsDisabled(recording);
}

function setInputDeviceControlsDisabled(disabled) {
  if (asrInputDeviceSelect) asrInputDeviceSelect.disabled = disabled;
  if (asrRefreshDevicesButton) asrRefreshDevicesButton.disabled = disabled;
}

function setInputFeedback(message, state = '') {
  if (!asrInputFeedback) return;
  asrInputFeedback.textContent = message;
  asrInputFeedback.classList.toggle('is-active', state === 'active');
  asrInputFeedback.classList.toggle('is-warning', state === 'warning');
}

function describeMicrophoneError(error) {
  if (error && error.code === 'MIC_PERMISSION_DENIED') return `麦克风权限被拒绝：${error.message}`;
  if (error && error.code === 'MIC_DEVICE_NOT_FOUND') return `未找到语音输入设备：${error.message}`;
  return `麦克风测试失败：${error && error.message ? error.message : String(error)}`;
}

async function toggleJournalVoiceInput() {
  if (journalVoiceRecording) {
    await stopJournalVoiceInput();
    return;
  }
  await startJournalVoiceInput();
}

async function startJournalVoiceInput() {
  if (asrTestRecording || microphoneTestRecording || dailyPlanVoiceRecording) {
    setJournalVoiceStatus('请先停止设置页正在进行的音频操作。', true);
    return;
  }

  journalVoiceCanceled = false;
  journalVoiceProcessing = false;
  journalVoiceFinalInserted = false;
  journalVoiceHasInsertedSegment = false;
  journalVoiceOriginalContent = journalContent.value;
  journalVoiceCapturedSeconds = 0;
  journalVoiceDecodedSeconds = 0;
  journalVoiceDecodeRealtimeFactor = 0;
  journalVoiceConversionStartedAt = 0;
  clearJournalVoiceTimer({ hide: true });
  journalVoiceInsertionPoint = Number.isInteger(journalLastCursorPosition)
    ? journalLastCursorPosition
    : journalContent.value.length;
  journalVoiceOriginalInsertionPoint = journalVoiceInsertionPoint;
  setJournalVoiceControls('starting');
  setJournalVoiceStatus('正在加载本地语音识别器…');

  let serviceStarted = false;
  try {
    const api = getAsrTestApi();
    const initialization = await initializeAsrForUse(api);
    await ensureJournalVoiceCapture(initialization.sampleRate, api);
    const startResult = await api.start();
    ensureAsrSuccess(startResult);
    serviceStarted = true;

    await journalVoiceCapture.start();
    journalVoiceRecording = true;
    journalVoiceLastSoundAt = Date.now();
    startJournalVoiceSilenceWatch();
    startJournalVoiceDurationTimers(startResult.maxRecordingDurationSeconds || 90);
    startJournalVoiceRecordingTimer(startResult.maxRecordingDurationSeconds || 90);
    setJournalVoiceControls('recording');
    setJournalVoiceStatus(
      `单次录音最多 ${startResult.maxRecordingDurationSeconds || 90} 秒，建议以午休为界分别录制上、下午音频。VAD 已开启。`,
      'active'
    );
  } catch (error) {
    journalVoiceCanceled = true;
    if (serviceStarted) {
      try {
        await getAsrTestApi().cancel();
      } catch (cancelError) {
        // The original microphone/model error is more useful to the user.
      }
    }
    await stopJournalVoiceCapture();
    journalVoiceRecording = false;
    stopJournalVoiceSilenceWatch();
    clearJournalVoiceTimer({ hide: true });
    resetJournalVoiceControls();
    setJournalVoiceStatus(describeJournalVoiceError(error), true);
  }
}

async function stopJournalVoiceInput({ automatic = false } = {}) {
  if (!journalVoiceRecording) return;
  // Keep journalVoiceRecording true until the Worker finishes draining the
  // buffered frames, so its final VAD segments can still reach the textarea.
  journalVoiceProcessing = true;
  stopJournalVoiceSilenceWatch();
  stopJournalVoiceDurationTimers();
  startJournalVoiceConversionTimer();
  setJournalVoiceControls('processing');
  setJournalVoiceStatus('已结束本次录制，正在转成文本…');
  try {
    // AudioCapture.stop() immediately releases media tracks, then flushes only
    // the already buffered PCM before the Worker performs final decoding.
    await stopJournalVoiceCapture();
    const result = await getAsrTestApi().stop();
    ensureAsrSuccess(result);
    if (!journalVoiceCanceled && !journalVoiceFinalInserted) {
      finalizeJournalVoiceInput(result.finalText || '');
    }
    if (automatic) setJournalVoiceStatus('已结束本次录制，语音文本已转换并插入记录。');
  } catch (error) {
    clearJournalVoiceTimer({ hide: true });
    setJournalVoiceStatus(describeJournalVoiceError(error), true);
  } finally {
    journalVoiceRecording = false;
    journalVoiceProcessing = false;
    stopJournalVoiceSilenceWatch();
    stopJournalVoiceDurationTimers();
    resetJournalVoiceControls();
  }
}

async function cancelJournalVoiceInput() {
  if (!journalVoiceRecording) return;
  journalVoiceCanceled = true;
  journalVoiceProcessing = true;
  clearJournalVoiceTimer({ hide: true });
  setJournalVoiceControls('processing');
  setJournalVoiceStatus('正在取消本次语音输入…');
  try {
    await stopJournalVoiceCapture();
    const result = await getAsrTestApi().cancel();
    ensureAsrSuccess(result);
    journalContent.value = journalVoiceOriginalContent;
    const restorePosition = Math.max(
      0,
      Math.min(journalVoiceOriginalInsertionPoint || 0, journalContent.value.length)
    );
    journalContent.focus();
    journalContent.setSelectionRange(restorePosition, restorePosition);
    journalLastCursorPosition = restorePosition;
    setJournalVoiceStatus('已取消本次语音输入，未写入记录。');
  } catch (error) {
    setJournalVoiceStatus(describeJournalVoiceError(error), true);
  } finally {
    journalVoiceRecording = false;
    journalVoiceProcessing = false;
    stopJournalVoiceSilenceWatch();
    stopJournalVoiceDurationTimers();
    resetJournalVoiceControls();
  }
}

async function ensureJournalVoiceCapture(sampleRate, api) {
  if (!window.RizhiAsrAudioCapture || !window.RizhiAsrAudioCapture.AudioCapture) {
    throw new Error('未能加载本地音频采集模块。');
  }
  if (journalVoiceCapture && journalVoiceCapture.sampleRate !== sampleRate) {
    await journalVoiceCapture.dispose();
    journalVoiceCapture = null;
  }
  if (!journalVoiceCapture) {
    journalVoiceCapture = new window.RizhiAsrAudioCapture.AudioCapture({
      sampleRate,
      deviceId: getSelectedAudioInputDeviceId()
    });
    journalVoiceCaptureUnsubscribe = journalVoiceCapture.onAudioFrame((frame) => {
      if (frame.error) {
        setJournalVoiceStatus(describeJournalVoiceError(frame.error), true);
        return;
      }
      if (calculateRms(frame.samples) >= 0.012) {
        journalVoiceLastSoundAt = Date.now();
      }
      journalVoiceCapturedSeconds += frame.samples.length / frame.sampleRate;
      try {
        api.sendAudioFrame(frame.sampleRate, frame.samples);
      } catch (error) {
        setJournalVoiceStatus(describeJournalVoiceError(error), true);
      }
    });
  } else {
    journalVoiceCapture.setDeviceId(getSelectedAudioInputDeviceId());
  }
  await journalVoiceCapture.initialize();
}

async function stopJournalVoiceCapture() {
  if (journalVoiceCapture) await journalVoiceCapture.stop();
}

function insertJournalVoiceSegmentText(value) {
  if (journalVoiceCanceled) return false;
  const segmentText = clean(value);
  if (!segmentText) return false;
  const currentValue = journalContent.value;
  const rawPosition = Number.isInteger(journalVoiceInsertionPoint)
    ? journalVoiceInsertionPoint
    : currentValue.length;
  const position = Math.max(0, Math.min(rawPosition, currentValue.length));
  const before = currentValue.slice(0, position);
  const after = currentValue.slice(position);
  const insertedText = segmentText;
  journalContent.value = `${before}${insertedText}${after}`;
  const caretPosition = position + insertedText.length;
  journalContent.focus();
  journalContent.setSelectionRange(caretPosition, caretPosition);
  journalLastCursorPosition = caretPosition;
  journalVoiceInsertionPoint = caretPosition;
  journalVoiceHasInsertedSegment = true;
  journalSaveState.textContent = '已插入语音文本，尚未保存';
  return true;
}

function finalizeJournalVoiceInput(value) {
  if (journalVoiceCanceled || journalVoiceFinalInserted) return;
  journalVoiceFinalInserted = true;
  if (!journalVoiceHasInsertedSegment) insertJournalVoiceSegmentText(value);
  if (journalVoiceProcessing) finishJournalVoiceConversionTimer();
  setJournalVoiceStatus(
    journalVoiceHasInsertedSegment
      ? '语音段已直接插入记录。请按“保存记录”写入本地数据。'
      : '未识别到清晰语音，未修改记录。'
  );
}

function rememberJournalCursorPosition() {
  if (Number.isInteger(journalContent.selectionStart)) {
    journalLastCursorPosition = journalContent.selectionStart;
  }
}

function setJournalVoiceControls(state) {
  if (!journalVoiceStartButton || !journalVoiceCancelButton) return;
  if (state === 'recording') {
    journalVoiceStartButton.disabled = false;
    journalVoiceStartButton.textContent = '● 正在聆听，点击停止';
    journalVoiceCancelButton.classList.remove('hidden');
    journalVoiceCancelButton.disabled = false;
    return;
  }
  if (state === 'starting' || state === 'processing') {
    journalVoiceStartButton.disabled = true;
    journalVoiceStartButton.textContent = state === 'processing' ? '正在识别…' : '正在准备…';
    journalVoiceCancelButton.classList.toggle('hidden', state === 'starting');
    journalVoiceCancelButton.disabled = true;
    return;
  }
  resetJournalVoiceControls();
}

function resetJournalVoiceControls() {
  if (!journalVoiceStartButton || !journalVoiceCancelButton) return;
  journalVoiceStartButton.disabled = false;
  journalVoiceStartButton.textContent = '🎤 语音输入';
  journalVoiceCancelButton.disabled = false;
  journalVoiceCancelButton.classList.add('hidden');
}

function setJournalVoiceStatus(message, state = '') {
  if (!journalVoiceStatus) return;
  journalVoiceStatus.textContent = message;
  const normalizedState = state === true ? 'error' : state;
  journalVoiceStatus.classList.toggle('is-error', normalizedState === 'error');
  journalVoiceStatus.classList.toggle('is-active', normalizedState === 'active');
  journalVoiceStatus.classList.toggle('is-warning', normalizedState === 'warning');
}

function describeJournalVoiceError(error) {
  if (error && error.code === 'ASR_MODEL_DOWNLOADING') return '模型正在下载中，请稍后使用。';
  if (error && error.code === 'ASR_MODEL_DOWNLOAD_CANCELED') return '已取消模型下载。需要时可再次点击“语音输入”。';
  if (error && error.code === 'MIC_PERMISSION_DENIED') return `无法开始语音输入：${error.message}`;
  if (error && error.code === 'MIC_DEVICE_NOT_FOUND') return `无法开始语音输入：${error.message}`;
  return `语音输入失败：${error && error.message ? error.message : String(error)}`;
}

function getAsrTestApi() {
  const api = window.whbr && window.whbr.asr;
  if (!api) throw new Error('ASR IPC 接口不可用。请重新启动应用后重试。');
  return api;
}

function formatAsrModelSize(bytes) {
  const value = Number(bytes || 0);
  if (!Number.isFinite(value) || value <= 0) return '较大的模型文件';
  return `${Math.round((value / 1024 / 1024) * 10) / 10} MB`;
}

function updateAsrModelStatus(status = {}) {
  latestAsrModelStatus = status;
  if (status.downloadDirectory) {
    asrModelDownloadDirectory = status.downloadDirectory;
    updateStoragePathView();
  }
  if (!asrModelStatus) return;
  const state = status.state || 'not-installed';
  const progress = status.progress || {};
  const downloadSize = formatAsrModelSize(status.downloadSizeBytes);
  let message = '未安装。首次使用需要下载离线语音模型。';
  if (state === 'downloading') {
    message = '正在下载模型；进度显示在“设置”标题右侧。';
  } else if (state === 'installed') {
    message = status.source === 'development'
      ? '已安装（正在使用开发模型目录）。'
      : '已安装，可离线使用。';
  } else if (state === 'failed') {
    message = `下载失败：${status.error && status.error.message ? status.error.message : '请检查网络后重试。'}`;
  } else {
    message = `未安装。首次下载约 ${downloadSize}，完成后即可离线使用。`;
  }
  asrModelStatus.textContent = message;
  asrModelStatus.classList.toggle('is-ready', state === 'installed');
  asrModelStatus.classList.toggle('is-error', state === 'failed');
  updateSettingsAsrDownloadProgress(status);

  if (!asrModelDownloadButton) return;
  const canDownload = status.canDownload !== false;
  asrModelDownloadButton.classList.toggle('hidden', state === 'installed' || !canDownload);
  asrModelDownloadButton.disabled = state === 'downloading' || !canDownload;
  asrModelDownloadButton.textContent = state === 'failed' ? '重试下载' : '下载模型';
}

function updateSettingsAsrDownloadProgress(status = latestAsrModelStatus) {
  if (!settingsAsrDownloadProgress) return;
  const isDownloading = status && status.state === 'downloading' && currentPageKey() === 'settings';
  settingsAsrDownloadProgress.classList.toggle('hidden', !isDownloading);
  if (!isDownloading) return;
  const progress = status.progress || {};
  if (progress.phase === 'extracting') settingsAsrDownloadProgress.textContent = '正在解压语音模型…';
  else if (progress.phase === 'verifying') settingsAsrDownloadProgress.textContent = '正在校验语音模型…';
  else if (Number.isFinite(progress.percent)) settingsAsrDownloadProgress.textContent = `正在下载模型 ${progress.percent}%`;
  else settingsAsrDownloadProgress.textContent = '正在准备模型下载…';
}

async function refreshAsrModelStatus() {
  try {
    const result = await getAsrTestApi().getModelStatus();
    updateAsrModelStatus(ensureAsrSuccess(result));
    return result;
  } catch (error) {
    updateAsrModelStatus({ state: 'failed', error: { message: error.message || String(error) } });
    return null;
  }
}

async function confirmAndDownloadAsrModel(api) {
  let status = ensureAsrSuccess(await api.getModelStatus());
  updateAsrModelStatus(status);
  if (status.isReady) return status;
  if (status.state === 'downloading' || asrModelDownloadInFlight) {
    const error = new Error('模型正在下载中，请稍后使用。');
    error.code = 'ASR_MODEL_DOWNLOADING';
    throw error;
  }
  if (status.canDownload === false) {
    const error = new Error('开发模型目录不完整。请检查开发模型配置。');
    error.code = 'ASR_MODEL_NOT_READY';
    throw error;
  }

  while (!status.isReady) {
    const size = formatAsrModelSize(status.downloadSizeBytes);
    const response = await window.whbr.showMessageBox({
      type: status.state === 'failed' ? 'error' : 'question',
      title: '下载离线语音模型',
      message: status.state === 'failed'
        ? '离线语音模型下载失败。'
        : `首次使用离线语音输入，需要下载语音识别模型（约 ${size}）。`,
      detail: status.state === 'failed'
        ? `${status.error && status.error.message ? status.error.message : '请检查网络连接后重试。'}\n模型下载完成后即可离线使用。`
        : '模型下载完成后即可离线使用。下载仅来自 sherpa-onnx 官方发布页。',
      buttons: [status.state === 'failed' ? '重试下载' : '下载模型', '取消'],
      defaultId: 0,
      cancelId: 1
    });
    if (!response || response.response !== 0) {
      const error = new Error('已取消下载离线语音模型。');
      error.code = 'ASR_MODEL_DOWNLOAD_CANCELED';
      throw error;
    }

    try {
      asrModelDownloadInFlight = true;
      updateAsrModelStatus({ ...status, state: 'downloading', progress: { phase: 'preparing', percent: 0 } });
      status = ensureAsrSuccess(await api.downloadModel());
      updateAsrModelStatus(status);
    } catch (error) {
      status = ensureAsrSuccess(await api.getModelStatus());
      updateAsrModelStatus(status);
      if (status.state !== 'failed') throw error;
    } finally {
      asrModelDownloadInFlight = false;
    }
  }
  return status;
}

async function initializeAsrForUse(api) {
  await confirmAndDownloadAsrModel(api);
  return ensureAsrSuccess(await api.initialize());
}

async function downloadAsrModelFromSettings() {
  if (asrModelDownloadInFlight) return;
  try {
    await confirmAndDownloadAsrModel(getAsrTestApi());
  } catch (error) {
    if (error && error.code === 'ASR_MODEL_DOWNLOAD_CANCELED') return;
    updateAsrModelStatus({ state: 'failed', error: { message: error.message || String(error) } });
  }
}

async function openModelDirectory() {
  try {
    const result = ensureAsrSuccess(await getAsrTestApi().openModelDirectory());
    if (result.error) setStatus(`打开模型文件夹失败：${result.error}`, 'error', 3000);
  } catch (error) {
    setStatus(`打开模型文件夹失败：${error.message || String(error)}`, 'error', 3000);
  }
}

function subscribeToAsrTestEvents() {
  if (!window.whbr || !window.whbr.asr) return;
  window.whbr.asr.onModelStatus((payload) => updateAsrModelStatus(payload));
  window.whbr.asr.onPartialResult((payload) => {
    if (asrTestRecording && asrPartialResult) {
      asrPartialResult.textContent = payload.text || '正在分析语音…';
      setAsrTestStatus('正在录音；已更新部分识别结果。');
    }
    if (journalVoiceRecording && !journalVoiceCanceled) {
      updateJournalVoiceDecodeEstimate(payload);
      if (insertJournalVoiceSegmentText(payload.segmentText || '') && !journalVoiceProcessing) {
        setJournalVoiceStatus('VAD 已完成一段语音，文本已直接插入。继续说话或点击停止。', 'active');
      }
    }
    if (dailyPlanVoiceRecording && !dailyPlanVoiceCanceled) {
      updateDailyPlanVoiceDecodeEstimate(payload);
      if (!dailyPlanVoiceProcessing && !dailyPlanVoiceWarningActive) {
        setDailyPlanVoiceStatus('已接收一段语音，停止录音后将显示完整原始文字。');
      }
    }
  });
  window.whbr.asr.onFinalResult((payload) => {
    if (asrTestRecording && asrFinalResult) {
      asrFinalResult.textContent = payload.text || '未识别到清晰语音。';
      setAsrTestStatus('识别完成。最终文本已显示。');
    }
    if (journalVoiceRecording && !journalVoiceCanceled) {
      finalizeJournalVoiceInput(payload.text || '');
    }
    if (dailyPlanVoiceRecording && !dailyPlanVoiceCanceled && dailyPlanVoiceText) {
      dailyPlanVoiceText.value = payload.text || '';
      dailyPlanVoiceFinalReceived = true;
      if (dailyPlanVoiceProcessing) finishDailyPlanVoiceConversionTimer();
      setDailyPlanVoiceStatus('识别完成。请检查并编辑原始文字，确认解析后点击“创建任务”保存。');
    }
  });
  window.whbr.asr.onVadState((payload) => {
    if (journalVoiceRecording && !journalVoiceCanceled && !journalVoiceProcessing && payload.detected) {
      setJournalVoiceStatus('VAD 已检测到语音，正在等待停顿后识别…', 'active');
    }
  });
  window.whbr.asr.onRecordingLimit(() => {
    if (asrTestRecording) {
      asrTestRecording = false;
      stopMicrophoneSilenceWatch();
      setAsrTestControls(false);
      setInputDeviceControlsDisabled(false);
      if (asrTestCapture) void asrTestCapture.stop().catch(() => {});
      setAsrTestStatus('已结束录制，正在显示已识别的文本。');
    }
    if (journalVoiceRecording) {
      // The worker has already emitted its final aggregated text. Stop the
      // renderer capture promptly so the microphone indicator turns off.
      void stopJournalVoiceCapture();
      journalVoiceRecording = false;
      journalVoiceProcessing = false;
      stopJournalVoiceSilenceWatch();
      stopJournalVoiceDurationTimers();
      clearJournalVoiceTimer();
      setJournalVoiceTimer('录音已自动结束，文本转换完成。');
      resetJournalVoiceControls();
      setJournalVoiceStatus('已结束录制，语音文本已转换并插入记录。');
    }
    if (dailyPlanVoiceRecording && !dailyPlanVoiceProcessing) {
      void stopDailyPlanVoiceCapture();
      dailyPlanVoiceRecording = false;
      dailyPlanVoiceProcessing = false;
      stopDailyPlanVoiceDurationTimers();
      clearDailyPlanVoiceTimer();
      setDailyPlanVoiceTimer('录音已自动结束，文本转换完成。');
      setDailyPlanVoiceControls('idle');
      setDailyPlanVoiceStatus('已结束录制，识别文字已显示。请检查并编辑。');
    }
  });
  window.whbr.asr.onError((payload) => {
    if (asrTestRecording) {
      setAsrTestStatus(`语音识别失败：${payload.message || '未知错误。'}`, true);
      setAsrTestControls(false);
      setInputDeviceControlsDisabled(false);
      asrTestRecording = false;
      stopMicrophoneSilenceWatch();
      if (asrTestCapture) void asrTestCapture.stop().catch(() => {});
    }
    if (journalVoiceRecording) {
      journalVoiceCanceled = true;
      void stopJournalVoiceCapture();
      journalVoiceRecording = false;
      journalVoiceProcessing = false;
      stopJournalVoiceSilenceWatch();
      stopJournalVoiceDurationTimers();
      clearJournalVoiceTimer({ hide: true });
      setJournalVoiceStatus(`语音输入失败：${payload.message || '未知错误。'}`, true);
      resetJournalVoiceControls();
    }
    if (dailyPlanVoiceRecording) {
      dailyPlanVoiceCanceled = true;
      void stopDailyPlanVoiceCapture();
      dailyPlanVoiceRecording = false;
      setDailyPlanVoiceControls('idle');
      dailyPlanVoiceProcessing = false;
      stopDailyPlanVoiceDurationTimers();
      clearDailyPlanVoiceTimer({ hide: true });
      setDailyPlanVoiceStatus(`语音创建任务失败：${payload.message || '未知错误。'}`, true);
    }
  });
}

async function startRecording() {
  if (asrTestRecording) return;
  if (journalVoiceRecording || dailyPlanVoiceRecording) {
    setAsrTestStatus('请先停止正在进行的语音输入，再开始语音识别。', true);
    return;
  }
  if (microphoneTestRecording) {
    setAsrTestStatus('请先停止麦克风测试，再开始语音识别。', true);
    return;
  }
  setAsrTestControls(true);
  setInputDeviceControlsDisabled(true);
  if (asrPartialResult) asrPartialResult.textContent = '—';
  if (asrFinalResult) asrFinalResult.textContent = '—';

  let serviceStarted = false;
  try {
    const api = getAsrTestApi();
    const modelStatus = ensureAsrSuccess(await api.getModelStatus());
    const needsModelInstallation = !modelStatus.isReady;
    setAsrTestStatus(needsModelInstallation
      ? '正在下载离线语音模型。等模型安装好后再次点击“开始录音”进行测试。'
      : '正在加载本地语音模型；首次加载可能需要一些时间…');
    const initialization = await initializeAsrForUse(api);

    if (needsModelInstallation) {
      setAsrTestControls(false);
      setInputDeviceControlsDisabled(false);
      setAsrTestStatus('模型已安装。请再次点击“开始录音”进行测试。');
      return;
    }

    await ensureAsrTestCapture(initialization.sampleRate, api);
    setAsrTestStatus('正在准备本地识别器…');
    const startResult = await api.start();
    ensureAsrSuccess(startResult);
    serviceStarted = true;

    setAsrTestStatus('请允许麦克风权限，然后开始说话。');
    const captureResult = await asrTestCapture.start();
    asrTestRecording = true;
    clearInputWaveform();
    lastMicrophoneSoundAt = Date.now();
    startMicrophoneSilenceWatch();
    setAsrTestControls(true);
    setAsrTestStatus(`正在录音。VAD 已开启，单次最长 ${startResult.maxRecordingDurationSeconds || 90} 秒；输入设备 ${captureResult.inputSampleRate} Hz，已重采样至 ${captureResult.sampleRate} Hz。`);
    setInputFeedback('正在监听语音识别输入。', 'warning');
  } catch (error) {
    if (serviceStarted) {
      try {
        await getAsrTestApi().stop();
      } catch (stopError) {
        // The original error gives the user the actionable cause.
      }
    }
    asrTestRecording = false;
    setAsrTestControls(false);
    setInputDeviceControlsDisabled(false);
    setAsrTestStatus(describeAsrTestError(error), true);
  }
}

async function stopRecording() {
  if (!asrTestRecording) return;
  setAsrTestControls(true, true);
  setAsrTestStatus('正在停止麦克风并生成最终文本…');
  try {
    await asrTestCapture.stop();
    const result = await getAsrTestApi().stop();
    ensureAsrSuccess(result);
    if (result.finalText && asrFinalResult) asrFinalResult.textContent = result.finalText;
    setAsrTestStatus('识别完成。最终文本已显示。');
    setInputFeedback('语音识别录音已停止。');
  } catch (error) {
    setAsrTestStatus(describeAsrTestError(error), true);
  } finally {
    asrTestRecording = false;
    stopMicrophoneSilenceWatch();
    setAsrTestControls(false);
    setInputDeviceControlsDisabled(false);
  }
}

async function ensureAsrTestCapture(sampleRate, api) {
  if (!window.RizhiAsrAudioCapture || !window.RizhiAsrAudioCapture.AudioCapture) {
    throw new Error('未能加载 AudioWorklet 采集模块。');
  }
  if (asrTestCapture && asrTestCapture.sampleRate !== sampleRate) {
    await asrTestCapture.dispose();
    asrTestCapture = null;
  }
  if (!asrTestCapture) {
    asrTestCapture = new window.RizhiAsrAudioCapture.AudioCapture({
      sampleRate,
      deviceId: getSelectedAudioInputDeviceId()
    });
    asrTestCaptureUnsubscribe = asrTestCapture.onAudioFrame((frame) => {
      if (frame.error) {
        setAsrTestStatus(describeAsrTestError(frame.error), true);
        setInputFeedback(describeMicrophoneError(frame.error), 'warning');
        return;
      }
      drawInputWaveform(frame.samples);
      if (calculateRms(frame.samples) >= 0.012) {
        lastMicrophoneSoundAt = Date.now();
        if (asrTestRecording) setInputFeedback('正在接收语音识别输入。', 'active');
      }
      try {
        api.sendAudioFrame(frame.sampleRate, frame.samples);
      } catch (error) {
        setAsrTestStatus(describeAsrTestError(error), true);
      }
    });
  } else {
    asrTestCapture.setDeviceId(getSelectedAudioInputDeviceId());
  }
  await asrTestCapture.initialize();
}

function ensureAsrSuccess(result) {
  if (result && result.ok) return result;
  const error = new Error(result && result.error && result.error.message ? result.error.message : 'ASR 请求失败。');
  error.code = result && result.error && result.error.code ? result.error.code : 'ASR_REQUEST_FAILED';
  throw error;
}

function describeAsrTestError(error) {
  const message = error && error.message ? error.message : String(error || '未知错误。');
  if (error && error.code === 'ASR_MODEL_DOWNLOADING') return '模型正在下载中，请稍后使用。';
  if (error && error.code === 'MIC_PERMISSION_DENIED') return `无法开始录音：${message}`;
  if (error && error.code === 'MIC_DEVICE_NOT_FOUND') return `无法开始录音：${message}`;
  if (error && error.code === 'ASR_MODEL_DOWNLOAD_CANCELED') return '已取消模型下载。需要时可再次点击“开始录音”。';
  return `语音识别测试失败：${message}`;
}

function setAsrTestControls(recording, stopping = false) {
  if (!asrTestStartButton || !asrTestStopButton) return;
  asrTestStartButton.disabled = recording;
  asrTestStopButton.disabled = !recording || stopping;
}

function setAsrTestStatus(message, isError = false) {
  if (!asrTestStatus) return;
  asrTestStatus.textContent = message;
  asrTestStatus.classList.toggle('is-error', Boolean(isError));
}

async function refreshSystemTime() {
  const previousDate = currentEffectiveNow ? formatLocalDate(currentEffectiveNow) : '';
  const now = await getEffectiveNow();
  currentEffectiveNow = now;
  const today = formatLocalDate(now);
  const weekday = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][now.getDay()];
  systemTime.textContent = `${formatClockDate(now)} ${weekday} ${formatClockTime(now)}`;
  updateTaskDateAfterMidnight(previousDate, today);
  updateTaskTemporalView();
  if (pages.profile.classList.contains('active')) renderProfileStats();
  checkDueReminders(now);
}

function updateTaskDateAfterMidnight(previousDate, today) {
  if (!previousDate || previousDate === today) return;
  if (!pages.tasks.classList.contains('active')) return;
  if (normalizeDate(taskDateFilter.value) !== previousDate) return;

  setDateInputValue(taskDateFilter, today);
  activePlanningDates.add(today);
  renderTasks({ scrollToCurrent: true, forceScroll: true });
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
  if (step.page === 'settings' && step.settingPanel) showSettingsPanel(step.settingPanel);
  if (step.page === 'tasks') renderTasks();
  if (step.page === 'records') {
    showRecordsView(step.recordsView || 'editor');
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
    onCommit: typeof options.onCommit === 'function' ? options.onCommit : null,
    manualEditing: false
  };
  dateInputControllers.set(input, controller);

  input.addEventListener('pointerdown', () => {
    controller.manualEditing = false;
  });
  input.addEventListener('input', () => sanitizeDateInputValue(input));
  input.addEventListener('change', () => {
    if (document.activeElement === input && controller.manualEditing) {
      sanitizeDateInputValue(input);
      return;
    }
    commitDateInput(input);
  });
  input.addEventListener('blur', () => {
    controller.manualEditing = false;
    commitDateInput(input);
  });
  input.addEventListener('keydown', (event) => {
    controller.manualEditing = true;
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
    controller.onCommit(normalizedDate, previousDate);
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
      controller.onCommit(normalizedDate, previousDate);
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
  dailyPlanMultiDay.checked = false;
  setDateInputValue(dailyPlanDate, defaultDate);
  setDateInputValue(dailyPlanStartDate, defaultDate);
  setDateInputValue(dailyPlanEndDate, defaultDate);
  syncDailyPlanDateMode();
  dailyPlanTableBody.innerHTML = '';
  clearDailyPlanVoiceParsedState({ clearText: true });
  addDailyPlanRow('09:00-11:30');
  addDailyPlanRow('14:00-17:30');
  dailyPlanVoiceCanceled = false;
  dailyPlanVoiceFinalReceived = false;
  setDailyPlanVoiceControls('idle');
  setDailyPlanVoiceStatus('尚未开始语音识别。');
  setDailyPlanVoicePageVisible(false);
  dailyPlanTableModal.classList.remove('hidden');
}

function closeDailyPlanTableModal() {
  if (dailyPlanVoiceRecording) void cancelDailyPlanVoiceInput();
  setDailyPlanVoicePageVisible(false);
  dailyPlanTableModal.classList.add('hidden');
}

function openDailyPlanVoicePage() {
  setDailyPlanVoicePageVisible(true);
  if (dailyPlanModalCard) dailyPlanModalCard.scrollTop = 0;
}

function closeDailyPlanVoicePage() {
  if (dailyPlanVoiceRecording) void cancelDailyPlanVoiceInput();
  setDailyPlanVoicePageVisible(false);
  if (dailyPlanModalCard) dailyPlanModalCard.scrollTop = 0;
}

function setDailyPlanVoicePageVisible(visible) {
  if (dailyPlanLaunchPanel) dailyPlanLaunchPanel.classList.toggle('hidden', visible);
  if (dailyPlanVoicePage) dailyPlanVoicePage.classList.toggle('hidden', !visible);
}

async function toggleDailyPlanVoiceInput() {
  if (dailyPlanVoiceRecording) {
    await stopDailyPlanVoiceInput();
    return;
  }
  await startDailyPlanVoiceInput();
}

async function startDailyPlanVoiceInput() {
  if (journalVoiceRecording || asrTestRecording || microphoneTestRecording) {
    setDailyPlanVoiceStatus('请先停止其他正在使用麦克风的操作。', true);
    return;
  }
  try {
    const modelStatus = ensureAsrSuccess(await getAsrTestApi().getModelStatus());
    if (modelStatus.state === 'downloading' || asrModelDownloadInFlight) {
      setDailyPlanVoiceStatus('模型正在下载中，具体进度可到设置页查看。', 'warning');
      return;
    }
  } catch (error) {
    setDailyPlanVoiceStatus(describeDailyPlanVoiceError(error), true);
    return;
  }

  clearDailyPlanVoiceParsedState({ clearText: true });
  dailyPlanVoiceCanceled = false;
  dailyPlanVoiceFinalReceived = false;
  dailyPlanVoiceProcessing = false;
  dailyPlanVoiceWarningActive = false;
  dailyPlanVoiceCapturedSeconds = 0;
  dailyPlanVoiceDecodedSeconds = 0;
  dailyPlanVoiceDecodeRealtimeFactor = 0;
  dailyPlanVoiceConversionStartedAt = 0;
  clearDailyPlanVoiceTimer({ hide: true });
  setDailyPlanVoiceControls('starting');
  setDailyPlanVoiceStatus('正在加载本地语音识别器…');
  let serviceStarted = false;
  try {
    const api = getAsrTestApi();
    const modelStatus = ensureAsrSuccess(await api.getModelStatus());
    const needsModelInstallation = !modelStatus.isReady;
    if (needsModelInstallation) {
      setDailyPlanVoiceStatus('模型正在下载中，具体进度可到设置页查看。', 'warning');
    }
    const initialization = await initializeAsrForUse(api);
    if (needsModelInstallation) {
      setDailyPlanVoiceControls('idle');
      setDailyPlanVoiceStatus('模型已安装。请再次点击“开始录音”进行语音创建任务。');
      return;
    }
    await ensureDailyPlanVoiceCapture(initialization.sampleRate, api);
    const startResult = await api.start();
    ensureAsrSuccess(startResult);
    serviceStarted = true;

    await dailyPlanVoiceCapture.start();
    dailyPlanVoiceRecording = true;
    startDailyPlanVoiceDurationTimers(startResult.maxRecordingDurationSeconds || 90);
    startDailyPlanVoiceRecordingTimer(startResult.maxRecordingDurationSeconds || 90);
    setDailyPlanVoiceControls('recording');
    setDailyPlanVoiceStatus(`正在录音。VAD 已开启，单次最长 ${startResult.maxRecordingDurationSeconds || 90} 秒。建议按“开始时间到结束时间，任务标题，具体任务内容”的格式描述。`);
  } catch (error) {
    dailyPlanVoiceCanceled = true;
    if (serviceStarted) {
      try {
        await getAsrTestApi().cancel();
      } catch (cancelError) {
        // Preserve the useful original error below.
      }
    }
    await stopDailyPlanVoiceCapture();
    dailyPlanVoiceRecording = false;
    setDailyPlanVoiceControls('idle');
    setDailyPlanVoiceStatus(describeDailyPlanVoiceError(error), true);
    stopDailyPlanVoiceDurationTimers();
    clearDailyPlanVoiceTimer({ hide: true });
  }
}

async function stopDailyPlanVoiceInput({ automatic = false } = {}) {
  if (!dailyPlanVoiceRecording || dailyPlanVoiceProcessing) return;
  dailyPlanVoiceProcessing = true;
  stopDailyPlanVoiceDurationTimers();
  startDailyPlanVoiceConversionTimer();
  setDailyPlanVoiceControls('processing');
  setDailyPlanVoiceStatus('已结束本次录制，正在转成文字…');
  try {
    // Stop immediately releases the media tracks; the ASR worker only drains
    // PCM that was already captured before this point.
    await stopDailyPlanVoiceCapture();
    const result = await getAsrTestApi().stop();
    ensureAsrSuccess(result);
    if (!dailyPlanVoiceCanceled && !dailyPlanVoiceFinalReceived && dailyPlanVoiceText) {
      dailyPlanVoiceText.value = result.finalText || '';
      dailyPlanVoiceFinalReceived = true;
    }
    finishDailyPlanVoiceConversionTimer();
    setDailyPlanVoiceStatus(automatic
      ? '已结束录制，识别文字已显示。'
      : '识别完成。请检查并编辑原始文字，确认解析后点击“创建任务”保存。');
  } catch (error) {
    clearDailyPlanVoiceTimer({ hide: true });
    setDailyPlanVoiceStatus(describeDailyPlanVoiceError(error), true);
  } finally {
    dailyPlanVoiceRecording = false;
    dailyPlanVoiceProcessing = false;
    stopDailyPlanVoiceDurationTimers();
    setDailyPlanVoiceControls('idle');
  }
}

async function cancelDailyPlanVoiceInput() {
  if (!dailyPlanVoiceRecording) return;
  dailyPlanVoiceCanceled = true;
  dailyPlanVoiceProcessing = true;
  stopDailyPlanVoiceDurationTimers();
  clearDailyPlanVoiceTimer({ hide: true });
  setDailyPlanVoiceControls('processing');
  setDailyPlanVoiceStatus('正在取消本次录音…');
  try {
    await stopDailyPlanVoiceCapture();
    const result = await getAsrTestApi().cancel();
    ensureAsrSuccess(result);
    setDailyPlanVoiceStatus('已取消本次录音。');
  } catch (error) {
    setDailyPlanVoiceStatus(describeDailyPlanVoiceError(error), true);
  } finally {
    dailyPlanVoiceRecording = false;
    dailyPlanVoiceProcessing = false;
    stopDailyPlanVoiceDurationTimers();
    setDailyPlanVoiceControls('idle');
  }
}

async function ensureDailyPlanVoiceCapture(sampleRate, api) {
  if (!window.RizhiAsrAudioCapture || !window.RizhiAsrAudioCapture.AudioCapture) {
    throw new Error('未能加载本地音频采集模块。');
  }
  if (dailyPlanVoiceCapture && dailyPlanVoiceCapture.sampleRate !== sampleRate) {
    await dailyPlanVoiceCapture.dispose();
    dailyPlanVoiceCapture = null;
  }
  if (!dailyPlanVoiceCapture) {
    dailyPlanVoiceCapture = new window.RizhiAsrAudioCapture.AudioCapture({
      sampleRate,
      deviceId: getSelectedAudioInputDeviceId()
    });
    dailyPlanVoiceCaptureUnsubscribe = dailyPlanVoiceCapture.onAudioFrame((frame) => {
      if (frame.error) {
        setDailyPlanVoiceStatus(describeDailyPlanVoiceError(frame.error), true);
        return;
      }
      try {
      dailyPlanVoiceCapturedSeconds += frame.samples.length / frame.sampleRate;
        api.sendAudioFrame(frame.sampleRate, frame.samples);
      } catch (error) {
        setDailyPlanVoiceStatus(describeDailyPlanVoiceError(error), true);
      }
    });
  } else {
    dailyPlanVoiceCapture.setDeviceId(getSelectedAudioInputDeviceId());
  }
  await dailyPlanVoiceCapture.initialize();
}

async function stopDailyPlanVoiceCapture() {
  if (dailyPlanVoiceCapture) await dailyPlanVoiceCapture.stop();
}


function startDailyPlanVoiceDurationTimers(maxDurationSeconds) {
  stopDailyPlanVoiceDurationTimers();
  const timers = scheduleVoiceDurationTimers(maxDurationSeconds, {
    isRecording: () => dailyPlanVoiceRecording && !dailyPlanVoiceProcessing,
    onWarning: () => {
      dailyPlanVoiceWarningActive = true;
      setDailyPlanVoiceStatus('还有 10 秒录制时间，请准备结束本段录音。', 'warning');
      playJournalVoiceWarningTone(dailyPlanVoiceCapture);
    },
    onMaximum: () => void stopDailyPlanVoiceInput({ automatic: true })
  });
  dailyPlanVoiceWarningTimer = timers.warningTimer;
  dailyPlanVoiceMaximumTimer = timers.maximumTimer;
}

function stopDailyPlanVoiceDurationTimers() {
  if (dailyPlanVoiceWarningTimer) window.clearTimeout(dailyPlanVoiceWarningTimer);
  if (dailyPlanVoiceMaximumTimer) window.clearTimeout(dailyPlanVoiceMaximumTimer);
  dailyPlanVoiceWarningTimer = null;
  dailyPlanVoiceMaximumTimer = null;
  dailyPlanVoiceWarningActive = false;
}

function setDailyPlanVoiceTimer(text, hidden = false) {
  if (!dailyPlanVoiceTimer) return;
  dailyPlanVoiceTimer.textContent = text;
  dailyPlanVoiceTimer.classList.toggle('hidden', hidden);
}

function clearDailyPlanVoiceTimer({ hide = false } = {}) {
  if (dailyPlanVoiceTimerInterval) window.clearInterval(dailyPlanVoiceTimerInterval);
  dailyPlanVoiceTimerInterval = null;
  if (hide) setDailyPlanVoiceTimer('', true);
}

function startDailyPlanVoiceRecordingTimer(maxDurationSeconds) {
  clearDailyPlanVoiceTimer({ hide: true });
  dailyPlanVoiceRecordingStartedAt = Date.now();
  const maxSeconds = Math.max(1, Number(maxDurationSeconds) || 90);
  const render = () => {
    const elapsed = (Date.now() - dailyPlanVoiceRecordingStartedAt) / 1000;
    setDailyPlanVoiceTimer(
      `录音 ${formatVoiceDuration(elapsed)} / ${formatVoiceDuration(maxSeconds)}（剩余 ${formatVoiceDuration(maxSeconds - elapsed)}）`
    );
  };
  render();
  dailyPlanVoiceTimerInterval = window.setInterval(render, 250);
}

function startDailyPlanVoiceConversionTimer() {
  clearDailyPlanVoiceTimer();
  dailyPlanVoiceConversionStartedAt = Date.now();
  const pendingAudioSeconds = Math.max(0.5, dailyPlanVoiceCapturedSeconds - dailyPlanVoiceDecodedSeconds);
  const realtimeFactor = dailyPlanVoiceDecodeRealtimeFactor || 1.2;
  const estimatedSeconds = Math.max(1, Math.ceil(pendingAudioSeconds * realtimeFactor));
  const render = () => {
    const elapsed = (Date.now() - dailyPlanVoiceConversionStartedAt) / 1000;
    const remaining = estimatedSeconds - elapsed;
    const suffix = remaining > 0 ? `预计剩余 ${formatVoiceDuration(remaining)}` : '正在完成最后一段';
    setDailyPlanVoiceTimer(`转换 ${formatVoiceDuration(elapsed)}（${suffix}）`);
  };
  render();
  dailyPlanVoiceTimerInterval = window.setInterval(render, 250);
}

function finishDailyPlanVoiceConversionTimer() {
  if (!dailyPlanVoiceConversionStartedAt) return;
  const elapsed = (Date.now() - dailyPlanVoiceConversionStartedAt) / 1000;
  clearDailyPlanVoiceTimer();
  setDailyPlanVoiceTimer(`转换完成，耗时 ${formatVoiceDuration(elapsed)}`);
  dailyPlanVoiceConversionStartedAt = 0;
}

function updateDailyPlanVoiceDecodeEstimate(payload) {
  const segmentSeconds = Number(payload && payload.segmentDurationSeconds);
  const decodeMilliseconds = Number(payload && payload.decodeElapsedMs);
  if (!(segmentSeconds > 0) || !(decodeMilliseconds >= 0)) return;
  dailyPlanVoiceDecodedSeconds += segmentSeconds;
  const observedFactor = decodeMilliseconds / (segmentSeconds * 1000);
  dailyPlanVoiceDecodeRealtimeFactor = dailyPlanVoiceDecodeRealtimeFactor > 0
    ? dailyPlanVoiceDecodeRealtimeFactor * 0.7 + observedFactor * 0.3
    : observedFactor;
}
function setDailyPlanVoiceControls(state) {
  if (!dailyPlanVoiceStartButton || !dailyPlanVoiceCancelButton) return;
  if (state === 'recording') {
    dailyPlanVoiceStartButton.disabled = false;
    dailyPlanVoiceStartButton.textContent = '● 正在录音，点击停止';
    dailyPlanVoiceCancelButton.classList.remove('hidden');
    dailyPlanVoiceCancelButton.disabled = false;
    return;
  }
  if (state === 'starting' || state === 'processing') {
    dailyPlanVoiceStartButton.disabled = true;
    dailyPlanVoiceStartButton.textContent = state === 'processing' ? '正在识别…' : '正在准备…';
    dailyPlanVoiceCancelButton.classList.toggle('hidden', state === 'starting');
    dailyPlanVoiceCancelButton.disabled = true;
    return;
  }
  dailyPlanVoiceStartButton.disabled = false;
  dailyPlanVoiceStartButton.textContent = '开始录音';
  dailyPlanVoiceCancelButton.disabled = false;
  dailyPlanVoiceCancelButton.classList.add('hidden');
}

function setDailyPlanVoiceStatus(message, state = '') {
  if (!dailyPlanVoiceStatus) return;
  dailyPlanVoiceStatus.textContent = message;
  const normalizedState = state === true ? 'error' : state;
  dailyPlanVoiceStatus.classList.toggle('is-error', normalizedState === 'error');
  dailyPlanVoiceStatus.classList.toggle('is-warning', normalizedState === 'warning');
}

function describeDailyPlanVoiceError(error) {
  if (error && error.code === 'ASR_MODEL_DOWNLOADING') return '模型正在下载中，请稍后使用。';
  if (error && error.code === 'ASR_MODEL_DOWNLOAD_CANCELED') return '已取消模型下载。需要时可再次点击“开始录音”。';
  if (error && error.code === 'MIC_PERMISSION_DENIED') return `无法开始语音创建任务：${error.message}`;
  if (error && error.code === 'MIC_DEVICE_NOT_FOUND') return `无法开始语音创建任务：${error.message}`;
  return `语音创建任务失败：${error && error.message ? error.message : String(error)}`;
}

async function confirmDailyPlanVoiceText() {
  const text = clean(dailyPlanVoiceText && dailyPlanVoiceText.value);
  if (!text) {
    clearDailyPlanVoiceParsedState();
    setDailyPlanVoiceStatus('当前没有可解析的识别文字。', true);
    return;
  }

  dailyPlanVoiceConfirmButton.disabled = true;
  if (dailyPlanVoiceApplyButton) dailyPlanVoiceApplyButton.disabled = true;
  setDailyPlanVoiceStatus('正在本地解析文字…');
  try {
    let candidates = parseStructuredDailyPlanVoiceText(text);
    if (!candidates) {
      if (!window.whbr || typeof window.whbr.parseTaskText !== 'function') {
        throw new Error('本地任务解析器不可用，请重新启动应用。');
      }
      const response = await window.whbr.parseTaskText(text, getDailyPlanVoiceReferenceDate());
      if (!response || !response.ok || !response.result) {
        throw new Error(response && response.error && response.error.message ? response.error.message : '本地任务解析失败。');
      }
      candidates = Array.isArray(response.result.tasks)
        ? response.result.tasks.map(normalizeDailyPlanVoiceCandidate)
        : [];
    }
    if (candidates.length === 0) {
      clearDailyPlanVoiceParsedState();
      setDailyPlanVoiceStatus('未识别到完整时间段。请补充“几点到几点”的表达后重新解析。', true);
      return;
    }

    const parsedText = candidates.map(formatDailyPlanVoiceCandidate).join('\n');
    dailyPlanVoiceParsedCandidates = candidates;
    dailyPlanVoiceParsedText = parsedText;
    dailyPlanVoiceText.value = parsedText;

    const invalidLines = candidates
      .map((candidate, index) => ({
        line: index + 1,
        missing: requiredDailyPlanVoiceCandidateFields(candidate)
      }))
      .filter((item) => item.missing.length > 0);

    if (invalidLines.length) {
      const summary = invalidLines
        .map((item) => `第 ${item.line} 行缺少${item.missing.map(dailyPlanVoiceFieldLabel).join('、')}`)
        .join('；');
      setDailyPlanVoiceStatus(`${summary}。请修改文字后重新解析。`, true);
      return;
    }

    setDailyPlanVoiceStatus(`已解析出 ${candidates.length} 条任务。确认文本无误后点击“确定”回填创建任务页。`);
  } catch (error) {
    clearDailyPlanVoiceParsedState();
    setDailyPlanVoiceStatus(`任务解析失败：${error && error.message ? error.message : String(error)}`, true);
  } finally {
    dailyPlanVoiceConfirmButton.disabled = false;
    if (dailyPlanVoiceApplyButton) dailyPlanVoiceApplyButton.disabled = false;
  }
}

function getDailyPlanVoiceReferenceDate() {
  if (dailyPlanMultiDay && dailyPlanMultiDay.checked) {
    return (dailyPlanStartDate && dailyPlanStartDate.value) || (dailyPlanDate && dailyPlanDate.value) || '';
  }
  return dailyPlanDate && dailyPlanDate.value;
}

function normalizeDailyPlanVoiceCandidate(task = {}) {
  return {
    startTime: clean(task.startTime),
    endTime: clean(task.endTime),
    title: clean(task.title),
    details: clean(task.details),
    type: TASK_TYPES.includes(clean(task.type)) ? clean(task.type) : ''
  };
}

function parseStructuredDailyPlanVoiceText(text) {
  const lines = String(text || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length === 0) return null;

  const pattern = /^起始时间[：:]\s*(.*?)\s*[，,]\s*结束时间[：:]\s*(.*?)\s*[，,]\s*任务[：:]\s*(.*?)\s*[，,]\s*具体内容[：:]\s*(.*?)\s*[，,]\s*类型[：:]\s*(.*?)\s*$/;
  const candidates = [];
  for (const line of lines) {
    const match = line.match(pattern);
    if (!match) return null;
    candidates.push(normalizeDailyPlanVoiceCandidate({
      startTime: match[1],
      endTime: match[2],
      title: match[3],
      details: match[4],
      type: match[5]
    }));
  }
  return candidates;
}

function formatDailyPlanVoiceCandidate(candidate) {
  const inlineText = (value) => clean(value).replace(/[\r\n]+/g, ' ');
  return [
    `起始时间：${inlineText(candidate.startTime)}`,
    `结束时间：${inlineText(candidate.endTime)}`,
    `任务：${inlineText(candidate.title)}`,
    `具体内容：${inlineText(candidate.details)}`,
    `类型：${inlineText(candidate.type)}`
  ].join('，');
}

function requiredDailyPlanVoiceCandidateFields(candidate) {
  const missing = [];
  if (!candidate.startTime) missing.push('startTime');
  if (!candidate.endTime) missing.push('endTime');
  if (!candidate.title) missing.push('title');
  if (!TASK_TYPES.includes(candidate.type)) missing.push('type');
  const range = extractTimeRangeFromInput(`${candidate.startTime}-${candidate.endTime}`);
  if (candidate.startTime && candidate.endTime && !range) missing.push('startTime', 'endTime');
  return Array.from(new Set(missing));
}

function dailyPlanVoiceFieldLabel(field) {
  return {
    startTime: '起始时间',
    endTime: '结束时间',
    title: '任务',
    type: '类型'
  }[field] || field;
}

function invalidateDailyPlanVoiceParse() {
  if (dailyPlanVoiceParsedCandidates.length === 0) return;
  if (dailyPlanVoiceText && dailyPlanVoiceText.value === dailyPlanVoiceParsedText) return;
  dailyPlanVoiceParsedCandidates = [];
  dailyPlanVoiceParsedText = '';
  setDailyPlanVoiceStatus('文字已修改，请重新点击“解析”后再确定。', 'warning');
}

function applyDailyPlanVoiceTasks() {
  if (dailyPlanVoiceParsedCandidates.length === 0 || !dailyPlanVoiceParsedText) {
    setDailyPlanVoiceStatus('请先点击“解析”，解析成功后才能确定。', true);
    return;
  }

  if (!dailyPlanVoiceText || dailyPlanVoiceText.value !== dailyPlanVoiceParsedText) {
    invalidateDailyPlanVoiceParse();
    setDailyPlanVoiceStatus('解析后的文字已被修改，请重新解析后再确定。', true);
    return;
  }

  const invalidLines = dailyPlanVoiceParsedCandidates
    .map((candidate, index) => ({
      line: index + 1,
      missing: requiredDailyPlanVoiceCandidateFields(candidate)
    }))
    .filter((item) => item.missing.length > 0);
  if (invalidLines.length) {
    setDailyPlanVoiceStatus('解析结果存在缺少时间、任务或类型的行，请修改后重新解析。', true);
    return;
  }

  Array.from(dailyPlanTableBody.querySelectorAll('tr')).forEach((row) => {
    const title = clean(row.querySelector('td:nth-child(2) input')?.value);
    const details = clean(row.querySelector('td:nth-child(3) input')?.value);
    if (!title && !details) row.remove();
  });

  dailyPlanVoiceParsedCandidates.forEach((candidate) => {
    addDailyPlanRow(`${candidate.startTime}-${candidate.endTime}`, {
      title: candidate.title,
      planDetails: candidate.details,
      type: candidate.type
    });
  });

  const count = dailyPlanVoiceParsedCandidates.length;
  clearDailyPlanVoiceParsedState({ clearText: true });
  setDailyPlanVoiceStatus('尚未开始语音识别。');
  closeDailyPlanVoicePage();
  setStatus(`已将 ${count} 条语音解析结果填入创建任务列表，请核对后点击“确定安排”。`, 'hidden');
}

function clearDailyPlanVoiceParsedState(options = {}) {
  dailyPlanVoiceParsedCandidates = [];
  dailyPlanVoiceParsedText = '';
  if (options.clearText && dailyPlanVoiceText) dailyPlanVoiceText.value = '';
}

function addDailyPlanRow(timeRange = '', values = {}) {
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
  titleInput.value = clean(values.title);
  titleCell.appendChild(titleInput);

  const planCell = document.createElement('td');
  const planInput = document.createElement('input');
  planInput.type = 'text';
  planInput.placeholder = '具体要做什么，可不填';
  planInput.value = clean(values.planDetails);
  planCell.appendChild(planInput);

  const typeCell = document.createElement('td');
  typeCell.appendChild(createTypeSelect(values.type || '工作'));

  const actionCell = document.createElement('td');
  actionCell.className = 'row-action-cell';
  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'delete-table-row';
  deleteButton.textContent = '×';
  deleteButton.setAttribute('aria-label', '删除这一条任务');
  deleteButton.title = '删除这一条任务';
  deleteButton.addEventListener('click', () => row.remove());
  actionCell.appendChild(deleteButton);

  row.append(timeCell, titleCell, planCell, typeCell, actionCell);
  dailyPlanTableBody.appendChild(row);
}

function handleDailyPlanDateModeChange() {
  if (!dailyPlanMultiDay) return;
  if (dailyPlanMultiDay.checked) {
    commitDateInput(dailyPlanDate);
    const date = normalizeDate(dailyPlanDate.value) || taskDateFilter.value || formatLocalDate(currentEffectiveNow);
    setDateInputValue(dailyPlanStartDate, date);
    setDateInputValue(dailyPlanEndDate, date);
  } else {
    commitDateInput(dailyPlanStartDate);
    const date = normalizeDate(dailyPlanStartDate.value) || dailyPlanDate.value || taskDateFilter.value || formatLocalDate(currentEffectiveNow);
    setDateInputValue(dailyPlanDate, date);
  }
  syncDailyPlanDateMode();
}

function syncDailyPlanDateMode() {
  const multiDay = Boolean(dailyPlanMultiDay && dailyPlanMultiDay.checked);
  dailyPlanSingleDateRow.classList.toggle('hidden', multiDay);
  dailyPlanSingleDateRow.setAttribute('aria-hidden', multiDay ? 'true' : 'false');
  dailyPlanRangeRow.classList.toggle('hidden', !multiDay);
  dailyPlanRangeRow.setAttribute('aria-hidden', multiDay ? 'false' : 'true');

  if (!multiDay) {
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
  if (!dailyPlanMultiDay || !dailyPlanMultiDay.checked) {
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
    const startInput = createTaskTimeInput(task.startTime, '开始时间');
    startInput.classList.toggle('time-conflict', hasTimeConflict);
    const separator = document.createElement('span');
    separator.textContent = '-';
    const endInput = createTaskTimeInput(task.endTime, '结束时间');
    endInput.classList.toggle('time-conflict', hasTimeConflict);
    startInput.addEventListener('input', () => handleTaskTimeInput(startInput, endInput));
    endInput.addEventListener('input', () => handleTaskTimeInput(endInput));
    startInput.addEventListener('blur', () => commitTaskTimeField(task.id, 'startTime', startInput));
    endInput.addEventListener('blur', () => commitTaskTimeField(task.id, 'endTime', endInput));
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
  updateSettingsAsrDownloadProgress();
  if (page === 'records') showRecordsView('editor');
  if (page === 'profile') renderProfileStats();
  if (page === 'settings') clearSettingsPanel();
}

function showRecordsView(view) {
  recordsView = view === 'list' ? 'list' : 'editor';
  if (recordsLayout) {
    recordsLayout.classList.toggle('is-list-view', recordsView === 'list');
    recordsLayout.classList.toggle('is-editor-view', recordsView !== 'list');
    recordsLayout.scrollTop = 0;
  }
  if (journalEditorPanel) journalEditorPanel.classList.toggle('hidden', recordsView === 'list');
  if (recordsListPanel) recordsListPanel.classList.toggle('hidden', recordsView !== 'list');
  if (recordsView === 'list') renderJournalList();
}

function showSettingsPanel(panelKey) {
  const normalizedKey = clean(panelKey);
  settingsMenuButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.settingsPanel === normalizedKey);
  });
  settingsPanels.forEach((panel) => {
    panel.classList.toggle('hidden', panel.dataset.settingsPanel !== normalizedKey);
  });
  if (settingsEmptyPanel) settingsEmptyPanel.classList.toggle('hidden', Boolean(normalizedKey));
}

function clearSettingsPanel() {
  settingsMenuButtons.forEach((button) => button.classList.remove('active'));
  settingsPanels.forEach((panel) => panel.classList.add('hidden'));
  if (settingsEmptyPanel) settingsEmptyPanel.classList.remove('hidden');
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
      splitParentId: clean(task.splitParentId),
      order,
      isDraft: Boolean(task.isDraft)
    };
  });

  normalized.forEach((task) => {
    taskMap.set(taskIdentity(task), task);
  });

  return Array.from(taskMap.values());
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

function createTaskTimeInput(value, label) {
  const input = createInlineInput('text', formatTaskTimeInput(value), label);
  input.classList.add('time-input');
  input.inputMode = 'numeric';
  input.maxLength = 5;
  input.placeholder = '--:--';
  return input;
}

function handleTaskTimeInput(input, nextInput = null) {
  const previousLength = input.value.length;
  input.value = formatTaskTimeInput(input.value);
  if (input.value.length !== previousLength) {
    input.setSelectionRange(input.value.length, input.value.length);
  }

  const digits = input.value.replace(/\D/g, '');
  if (digits.length < 4) {
    input.dataset.autoAdvanced = '';
    return;
  }

  if (!nextInput || input.dataset.autoAdvanced === 'true' || !normalizeTaskTimeInput(input.value)) return;
  input.dataset.autoAdvanced = 'true';
  window.setTimeout(() => {
    if (document.activeElement !== input) return;
    nextInput.focus();
    nextInput.select();
  }, 0);
}

function formatTaskTimeInput(value) {
  const digits = clean(value).replace(/\D/g, '').slice(0, 4);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return digits.length === 2 ? `${digits}:` : digits;
  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

function normalizeTaskTimeInput(value) {
  const text = clean(value);
  const match = text.match(/^(\d{2}):(\d{2})$/);
  if (!match) return '';

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return '';
  return `${match[1]}:${match[2]}`;
}

function commitTaskTimeField(taskId, field, input) {
  const normalized = normalizeTaskTimeInput(input.value);
  input.value = normalized;
  updateTaskField(taskId, field, normalized, { render: false, splitCrossDay: true });
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

async function updateTaskField(taskId, field, value, options = {}) {
  const task = tasks.find((item) => item.id === taskId);
  if (!task) return;

  task[field] = clean(value);
  if (field === 'type') {
    task.type = normalizeTaskType(value, task.title);
  }
  if (['title', 'startTime', 'endTime', 'planDetails'].includes(field)) {
    task.isDraft = !clean(task.title) || !clean(task.startTime) || !clean(task.endTime);
  }
  const normalizedTasks = options.splitCrossDay ? normalizeTaskDayBoundaries() : { changed: false };

  await saveState();
  if (options.render === false) {
    if (normalizedTasks.changed) {
      renderTasksPreservingScroll();
      return;
    }
    refreshTasksAfterInlineEdit(taskId);
    return;
  }
  renderTasks();
}

function refreshTasksAfterInlineEdit(taskId) {
  const selectedDate = clean(taskDateFilter.value);
  const visibleTasks = selectedDate
    ? tasks.filter((task) => isRenderableTask(task) && normalizeDate(task.date) === selectedDate)
    : tasks.filter(isRenderableTask);
  const conflictingTaskIds = findConflictingTaskIds(sortTasksForDisplay(visibleTasks));
  renderTaskDurationSummary(visibleTasks);

  taskList.querySelectorAll('.task-card').forEach((card) => {
    const task = tasks.find((item) => item.id === card.dataset.taskId);
    if (!task) return;

    const hasTimeConflict = conflictingTaskIds.has(task.id);
    syncTaskCardTimeInputs(card, task);
    card.classList.toggle('task-time-conflict', hasTimeConflict);
    card.title = hasTimeConflict ? '这个时间段与同一天的其他任务冲突，请修改开始或结束时间。' : '';
    const timeEditor = card.querySelector('.task-time-editor');
    if (timeEditor) timeEditor.classList.toggle('task-time-conflict-text', hasTimeConflict);
    card.querySelectorAll('.time-input').forEach((input) => {
      input.classList.toggle('time-conflict', hasTimeConflict);
    });
  });

  updateTaskTemporalView({ scrollToCurrent: false });
  if (taskId && selectedDate) activePlanningDates.add(selectedDate);
}

function renderTasksPreservingScroll() {
  const scrollTop = taskList ? taskList.scrollTop : 0;
  renderTasks({ scrollToCurrent: false, forceScroll: false });
  if (taskList) taskList.scrollTop = scrollTop;
}

function syncTaskCardTimeInputs(card, task) {
  const inputs = Array.from(card.querySelectorAll('.time-input'));
  const values = [task.startTime, task.endTime];
  inputs.forEach((input, index) => {
    if (document.activeElement === input) return;
    input.value = formatTaskTimeInput(values[index] || '');
  });
}

function normalizeTaskDayBoundaries() {
  const before = taskNormalizationSignature(tasks);
  const restoredTasks = restoreSplitTaskParents(tasks);
  const grouped = groupTasksByOriginalDate(restoredTasks);
  const normalizedTasks = [];
  const orderCounters = new Map();

  Array.from(grouped.keys()).sort().forEach((date) => {
    let dayOffset = 0;
    let previousStart = null;
    const dayTasks = grouped.get(date);

    dayTasks.forEach((task) => {
      const start = timeToMinutes(task.startTime);
      const end = timeToMinutes(task.endTime);
      if (start !== null && previousStart !== null && start < previousStart) dayOffset += 1;
      previousStart = start === null ? previousStart : start;

      const actualDate = shiftDate(date, dayOffset);
      normalizedTasks.push(...normalizeTaskIntoDayPieces(task, actualDate, orderCounters));
    });
  });

  tasks = resolveDayOverlaps(normalizedTasks);
  return { changed: before !== taskNormalizationSignature(tasks) };
}

function restoreSplitTaskParents(taskItems) {
  const baseTasks = taskItems
    .filter((task) => !clean(task.splitParentId))
    .map((task) => ({ ...task, splitParentId: '' }));
  const byId = new Map(baseTasks.map((task) => [task.id, task]));

  taskItems.forEach((task) => {
    const parentId = clean(task.splitParentId);
    if (!parentId) return;
    const parent = byId.get(parentId);
    if (parent && parent.endTime === '00:00' && task.startTime === '00:00') {
      parent.endTime = task.endTime;
      return;
    }
    baseTasks.push({ ...task, splitParentId: '' });
  });

  return baseTasks;
}

function groupTasksByOriginalDate(taskItems) {
  return taskItems.reduce((groups, task) => {
    const date = normalizeDate(task.date);
    if (!date) return groups;
    if (!groups.has(date)) groups.set(date, []);
    groups.get(date).push(task);
    groups.get(date).sort(compareTasksByOrderThenTime);
    return groups;
  }, new Map());
}

function compareTasksByOrderThenTime(a, b) {
  const orderA = Number.isFinite(Number(a.order)) ? Number(a.order) : Number.MAX_SAFE_INTEGER;
  const orderB = Number.isFinite(Number(b.order)) ? Number(b.order) : Number.MAX_SAFE_INTEGER;
  if (orderA !== orderB) return orderA - orderB;
  return normalizeTime(a.startTime).localeCompare(normalizeTime(b.startTime));
}

function normalizeTaskIntoDayPieces(task, date, orderCounters) {
  const start = timeToMinutes(task.startTime);
  const end = timeToMinutes(task.endTime);
  const normalizedDate = normalizeDate(date);
  if (start === null || end === null || end === 0 || start <= end) {
    return [normalizeTaskPiece(task, normalizedDate, task.startTime, task.endTime, '', orderCounters)];
  }

  const nextDate = shiftDate(normalizedDate, 1);
  return [
    normalizeTaskPiece(task, normalizedDate, task.startTime, '00:00', '', orderCounters),
    normalizeTaskPiece(task, nextDate, '00:00', task.endTime, task.id, orderCounters)
  ];
}

function normalizeTaskPiece(task, date, startTime, endTime, splitParentId, orderCounters) {
  return {
    ...task,
    id: splitParentId ? `split-${task.id}-${date}` : task.id,
    date,
    weekday: weekdayFromDate(date),
    startTime,
    endTime,
    splitParentId,
    order: nextNormalizedOrder(date, orderCounters),
    isDraft: !clean(task.title) || !clean(startTime) || !clean(endTime)
  };
}

function nextNormalizedOrder(date, counters) {
  const key = normalizeDate(date) || '__all__';
  const next = (counters.get(key) || 0) + 10;
  counters.set(key, next);
  return next;
}

function resolveDayOverlaps(taskItems) {
  const grouped = groupTasksByOriginalDate(taskItems);
  const resolved = [];

  Array.from(grouped.keys()).sort().forEach((date) => {
    const dayTasks = grouped.get(date).sort((a, b) => {
      const startCompare = timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
      return startCompare || compareTasksByOrderThenTime(a, b);
    });

    dayTasks.forEach((task) => {
      const previous = resolved[resolved.length - 1];
      if (previous && normalizeDate(previous.date) === date) {
        const previousEnd = comparableDayEnd(previous.endTime);
        const currentStart = timeToMinutes(task.startTime);
        if (previousEnd !== null && currentStart !== null && currentStart < previousEnd) {
          previous.endTime = minutesToTime(currentStart);
        }
      }
      if (taskDurationMinutes(task) > 0 || task.isDraft) resolved.push(task);
    });
  });

  return resolved;
}

function comparableDayEnd(value) {
  const minutes = timeToMinutes(value);
  if (minutes === null) return null;
  return minutes === 0 ? 24 * 60 : minutes;
}

function minutesToTime(minutes) {
  const normalized = Math.max(0, Math.min(24 * 60, minutes));
  if (normalized === 24 * 60) return '00:00';
  return `${String(Math.floor(normalized / 60)).padStart(2, '0')}:${String(normalized % 60).padStart(2, '0')}`;
}

function taskNormalizationSignature(taskItems) {
  return JSON.stringify(taskItems.map((task) => ({
    id: clean(task.id),
    date: normalizeDate(task.date),
    startTime: clean(task.startTime),
    endTime: clean(task.endTime),
    order: Number(task.order) || 0,
    splitParentId: clean(task.splitParentId)
  })).sort((a, b) => a.id.localeCompare(b.id)));
}

async function deleteTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId && clean(task.splitParentId) !== taskId);
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
  if (journalDateChangePending) return false;
  const date = committedDateInputValue(journalDate) || normalizeDate(journalDate.value);

  return saveJournalForDate(date);
}

async function saveJournalForDate(date) {
  const content = clean(journalContent.value);
  const tagId = normalizeJournalTagId(journalTag ? journalTag.value : '');

  if (!date) {
    journalSaveState.textContent = '请先选择日期';
    return false;
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
  return true;
}

function hasUnsavedJournalChanges(dateOverride = '') {
  if (!journalContent || !journalDate) return false;
  const date = normalizeDate(dateOverride || committedDateInputValue(journalDate) || journalDate.value);
  const content = clean(journalContent.value);
  const tagId = normalizeJournalTagId(journalTag ? journalTag.value : '');

  if (!date) return Boolean(content || tagId);

  const journal = findJournalForDate(date, date);
  const savedContent = journal ? clean(journal.content) : '';
  const savedTagId = journal ? normalizeJournalTagId(journal.tagId) : '';
  return content !== savedContent || tagId !== savedTagId;
}

async function handleJournalDateCommit(nextDate, previousDate) {
  if (!previousDate || !hasUnsavedJournalChanges(previousDate)) {
    renderSelectedJournal();
    return;
  }

  journalDateChangePending = true;
  try {
    const choice = await openJournalUnsavedModal();
    if (choice === 'cancel') {
      setDateInputValue(journalDate, previousDate);
      return;
    }

    if (choice === 'save') {
      const saved = await saveJournalForDate(previousDate);
      if (!saved) {
        setDateInputValue(journalDate, previousDate);
        return;
      }
    }

    setDateInputValue(journalDate, nextDate);
    renderSelectedJournal();
  } finally {
    journalDateChangePending = false;
  }
}

function updateJournalDirtyState() {
  if (!journalSaveState) return;
  if (hasUnsavedJournalChanges()) {
    journalSaveState.textContent = '尚未保存';
  }
}

async function confirmLeaveRecordsPageIfNeeded(targetPage) {
  if (targetPage === 'records') return true;
  if (!pages.records.classList.contains('active')) return true;
  if (!hasUnsavedJournalChanges()) return true;

  const choice = await openJournalUnsavedModal();
  if (choice === 'cancel') return false;
  if (choice === 'discard') {
    renderSelectedJournal();
    return true;
  }

  return saveSelectedJournal();
}

function openJournalUnsavedModal() {
  if (!journalUnsavedModal) return Promise.resolve('cancel');
  journalUnsavedModal.classList.remove('hidden');
  if (saveJournalBeforeLeaveButton) saveJournalBeforeLeaveButton.focus();
  return new Promise((resolve) => {
    pendingJournalUnsavedResolver = resolve;
  });
}

function resolveJournalUnsavedChoice(choice) {
  if (!pendingJournalUnsavedResolver) return;
  journalUnsavedModal.classList.add('hidden');
  const resolver = pendingJournalUnsavedResolver;
  pendingJournalUnsavedResolver = null;
  resolver(choice);
}

function renderSelectedJournal() {
  const date = clean(journalDate.value);
  const journal = findJournalForDate(normalizeDate(date), date);
  journalContent.value = journal ? journal.content : '';
  if (journalTag) journalTag.value = normalizeJournalTagId(journal && journal.tagId);
  renderTagPicker(journalTag, journalTagPaletteButton, journalTagPalette);
  journalSaveState.textContent = journal ? '已加载' : '尚未保存';
}

function preserveRecordsScroll(callback) {
  const scroller = recordsLayout;
  const anchor = journalList || document.querySelector('.records-list-panel');
  const previousScrollTop = scroller ? scroller.scrollTop : 0;
  const previousAnchorTop = anchor ? anchor.getBoundingClientRect().top : 0;
  const activeElement = document.activeElement;

  callback();

  if (!scroller || !anchor) return;

  const restore = () => {
    const nextAnchorTop = anchor.getBoundingClientRect().top;
    scroller.scrollTop = previousScrollTop + (nextAnchorTop - previousAnchorTop);
    if (activeElement && typeof activeElement.focus === 'function') {
      activeElement.focus({ preventScroll: true });
    }
  };

  restore();
  requestAnimationFrame(restore);
}

function renderJournalListPreservingScroll() {
  preserveRecordsScroll(() => renderJournalList());
}

function refreshJournalFilterViewPreservingScroll() {
  preserveRecordsScroll(() => {
    updateJournalFilterControls();
    renderJournalList();
  });
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
    title.className = 'journal-item-title';
    title.innerHTML = '';
    const dateText = document.createElement('span');
    dateText.className = 'journal-item-date';
    dateText.textContent = journalDisplayDate(journal);
    title.appendChild(dateText);
    const tagBadge = createJournalTagBadge(journal.tagId);
    if (tagBadge) title.appendChild(tagBadge);
    const preview = document.createElement('span');
    preview.className = 'journal-item-preview';
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

  refreshJournalFilterViewPreservingScroll();
}

function createJournalTagBadge(tagId) {
  const tag = journalTagById(tagId);
  if (!tag) return null;
  const badge = document.createElement('span');
  badge.className = 'journal-tag-badge';
  badge.style.background = tag.color;
  badge.title = `${tag.shortName}：${tag.fullName}`;
  badge.setAttribute('aria-label', badge.title);
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
    const migratedTasks = normalizeTaskDayBoundaries();
    journals = normalizeJournalCollection(result.data.journals || []);
    storagePaths = result.paths || storagePaths;
    setDateInputValue(journalViewDate, latestJournalDate() || journalDate.value || formatLocalDate(new Date()));
    loadProfileToForm();
    populateJournalTagSelects();
    renderJournalTagSettings();
    await migrateLegacyLocalStorageIfNeeded();
    if (migratedProfile.changed || migratedTasks.changed) await saveState();
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
  if (modelDownloadPath) modelDownloadPath.textContent = asrModelDownloadDirectory || '加载中...';
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
  void refreshAsrModelStatus();
  void refreshAudioInputDevices();
  if (navigator.mediaDevices && typeof navigator.mediaDevices.addEventListener === 'function') {
    navigator.mediaDevices.addEventListener('devicechange', () => {
      if (!microphoneTestRecording && !asrTestRecording) void refreshAudioInputDevices();
    });
  }
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
