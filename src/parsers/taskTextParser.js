const { collapseRepeatedText } = require('./textUtils');

const CHINESE_NUMBER_MAP = {
  零: 0,
  〇: 0,
  一: 1,
  二: 2,
  两: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7,
  八: 8,
  九: 9
};

const PERIOD_PATTERN = '(?:凌晨|早上|上午|中午|下午|傍晚|晚上|夜里)';
const CLOCK_NUMBER_PATTERN = '[0-9零〇一二两三四五六七八九十]+';
const DATE_PATTERN = /(?:(\d{4})\s*[年\-/]\s*)?(\d{1,2})\s*(?:月|\/)\s*(\d{1,2})(?:日)?/g;
const CHINESE_DATE_PATTERN = /(?:(\d{4})\s*年\s*)?([零〇一二两三四五六七八九十]{1,3})\s*月\s*([零〇一二两三四五六七八九十]{1,3})(?:日|号)/g;

function parseTaskText(text, options = {}) {
  const rawText = normalizeText(text);
  const warnings = [];
  const referenceDate = normalizeReferenceDate(options.referenceDate);
  const dateResult = parseDate(rawText, referenceDate, warnings);
  const timeResult = parseTimeRange(rawText, warnings);
  const typeResult = parseTaskType(rawText, warnings);
  const title = parseTitle(rawText, [
    ...dateResult.spans,
    ...timeResult.spans,
    ...typeResult.spans
  ]);

  const result = {
    date: dateResult.value,
    startTime: timeResult.startTime,
    endTime: timeResult.endTime,
    title,
    type: typeResult.value,
    missingFields: [],
    warnings
  };

  ['date', 'startTime', 'endTime', 'title', 'type'].forEach((field) => {
    if (!result[field]) result.missingFields.push(field);
  });

  return result;
}


function parseTaskTextList(text, options = {}) {
  const rawText = normalizeText(text);
  const referenceDate = normalizeReferenceDate(options.referenceDate);
  const globalWarnings = [];
  const dateResult = parseDate(rawText, referenceDate, globalWarnings);
  const ranges = extractTimeRanges(rawText);
  const resolvedDate = dateResult.value || (referenceDate ? formatDate(referenceDate) : '');
  if (!dateResult.value && resolvedDate) {
    globalWarnings.push('未在文字中识别日期，已使用页面所选日期。');
  }


  if (!ranges.length) {
    return {
      tasks: [],
      warnings: [...globalWarnings, '未识别到完整时间段，无法生成任务候选。']
    };
  }

  let previousEndMinutes = null;
  const tasks = ranges.map((range, index) => {
    const nextRange = ranges[index + 1];
    const segmentText = rawText.slice(range.end, nextRange ? nextRange.start : rawText.length);
    const localRange = applySegmentTimeContext(range, segmentText);
    const normalizedRange = alignRangeToSequence(localRange, previousEndMinutes);
    previousEndMinutes = normalizedRange.endMinutes;
    const warnings = [...range.warnings, ...normalizedRange.warnings];
    const typeResult = parseTaskType(segmentText, warnings);
    const content = parseSegmentContent(segmentText, typeResult.spans);
    const task = {
      date: resolvedDate,
      startTime: normalizedRange.startTime,
      endTime: normalizedRange.endTime,
      title: content.title,
      details: content.details,
      type: typeResult.value,
      missingFields: [],
      warnings,
      rawText: rawText.slice(range.start, nextRange ? nextRange.start : rawText.length).trim()
    };

    ['date', 'startTime', 'endTime', 'title', 'type'].forEach((field) => {
      if (!task[field]) task.missingFields.push(field);
    });
    return task;
  });

  return { tasks, warnings: globalWarnings };
}

function extractTimeRanges(text) {
  const clocks = findClockTokens(text);
  const ranges = [];
  for (let index = 0; index < clocks.length - 1; index += 1) {
    const start = clocks[index];
    const end = clocks[index + 1];
    const connector = text.slice(start.end, end.start);
    if (!/^\s*(?:到|至|-|－|~|～|—|–)\s*$/.test(connector)) continue;

    let parsedStart = parseClock(start.value);
    const parsedEnd = parseClock(end.value, parsedStart.period);
    const hasStartPeriod = hasClockPeriod(start.value);
    const hasEndPeriod = hasClockPeriod(end.value);
    if (!hasStartPeriod && hasEndPeriod && !isTwentyFourHourClock(start.value)) {
      parsedStart = parseClock(start.value, parsedEnd.period);
    }
    if (!parsedStart.time || !parsedEnd.time) continue;

    ranges.push({
      start: start.start,
      end: end.end,
      startTime: parsedStart.time,
      endTime: parsedEnd.time,
      startClock: start.value,
      endClock: end.value,
      hasStartPeriod,
      hasEndPeriod,
      warnings: []
    });
  }
  return ranges;
}

function applySegmentTimeContext(range, segmentText) {
  let startTime = range.startTime;
  let inheritedPeriod = '';
  let inferredTimeContext = false;
  let endTime = range.endTime;
  const warnings = [];
  const hasExplicitPeriod = range.hasStartPeriod || range.hasEndPeriod;
  const bothTwentyFourHour = isTwentyFourHourClock(range.startClock) && isTwentyFourHourClock(range.endClock);
  const startsAtMidnight = isMidnightClock(range.startClock);

  if (!hasExplicitPeriod && !bothTwentyFourHour && !startsAtMidnight) {
    inheritedPeriod = '';
    if (/(?:晚上|夜里|夜间|半夜)/.test(segmentText)) inheritedPeriod = '晚上';
    else if (/(?:下午|傍晚)/.test(segmentText)) inheritedPeriod = '下午';
    else if (/(?:上午|早上)/.test(segmentText)) inheritedPeriod = '上午';

    if (inheritedPeriod) {
      inferredTimeContext = true;
      startTime = parseClock(range.startClock, inheritedPeriod).time;
      endTime = parseClock(range.endClock, inheritedPeriod).time;
    } else if (/(?:午休|中午)/.test(segmentText)) {
      inferredTimeContext = true;
      endTime = moveTimeIntoAfternoon(endTime, startTime);
    }
  }

  return { startTime, endTime, warnings, isAmbiguous: !hasExplicitPeriod && !bothTwentyFourHour && !inferredTimeContext };
}

function parseSegmentTitle(text, spans) {
  const title = removeSpans(text, spans)
    .replace(/^[\s，,。；;、]*(?:是|为|安排(?:为|是)?|计划(?:为|是)?|要做|需要)\s*/, '')
    .replace(/[，,。；;、\s]+$/g, '')
    .replace(/(?:然后|还有)\s*$/g, '')
    .replace(/[，,。；;、]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return collapseRepeatedText(title);
}

function hasClockPeriod(value) {

  return new RegExp(`^${PERIOD_PATTERN}`).test(String(value || '').replace(/\s/g, ''));
}

function isMidnightClock(value) {
  return toMinutes(parseClock(value).time) === 0;
}

function parseSegmentContent(text, spans) {
  const cleaned = removeSpans(text, spans)
    .replace(/^[\s，,。；;、]*(?:是|为|安排(?:为|是)?|计划(?:为|是)?|要做|需要)\s*/, '')
    .replace(/[，,。；;、\s]+$/g, '')
    .replace(/(?:然后|还有)\s*$/g, '')
    .trim();
  if (!cleaned) return { title: '', details: '' };

  const explicitDetail = cleaned.match(/^(.+?)(?:具体(?:任务)?内容(?:是|为)?|主要(?:任务|内容)?(?:是|为)?|内容(?:是|为)?|包括)\s*(.+)$/);
  if (explicitDetail) {
    return {
      title: collapseRepeatedText(explicitDetail[1].replace(/[，,。；;、\s]+$/g, '').trim()),
      details: collapseRepeatedText(explicitDetail[2].trim())
    };
  }

  const parts = cleaned
    .split(/[，,；;、]/)
    .map((part) => part.trim())
    .filter(Boolean);
  return {
    title: collapseRepeatedText(parts.shift() || ''),
    details: collapseRepeatedText(parts.join('，'))
  };
}

function alignRangeToSequence(range, previousEndMinutes) {
  let startMinutes = toMinutes(range.startTime);
  let endMinutes = toMinutes(range.endTime);
  let crossedDay = false;
  if (range.isAmbiguous && Number.isFinite(previousEndMinutes) && startMinutes < previousEndMinutes && startMinutes < 720) {
    startMinutes += 720;
    endMinutes += 720;
  }
  if (endMinutes <= startMinutes) {
    if (range.isAmbiguous && endMinutes < 720) {
      endMinutes += 720;
    } else {
      endMinutes += 1440;
      crossedDay = true;
    }
  }
  const warnings = [...range.warnings];
  if (crossedDay) warnings.push('结束时间不晚于开始时间，已按跨日时间段保留，请在确认前检查。');
  return {
    startTime: formatClockFromMinutes(startMinutes),
    endTime: formatClockFromMinutes(endMinutes),
    endMinutes,
    warnings
  };
}

function formatClockFromMinutes(minutes) {
  const normalized = ((Math.round(minutes) % 1440) + 1440) % 1440;
  return `${String(Math.floor(normalized / 60)).padStart(2, '0')}:${String(normalized % 60).padStart(2, '0')}`;
}

function moveTimeIntoAfternoon(time, startTime) {
  const [hourText, minuteText] = String(time || '').split(':');
  const hour = Number(hourText);
  const minute = Number(minuteText);
  if (!Number.isInteger(hour) || !Number.isInteger(minute) || hour >= 12) return time;
  const shifted = `${String(hour + 12).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  return toMinutes(shifted) > toMinutes(startTime) ? shifted : time;
}

function toMinutes(time) {
  const [hourText, minuteText] = String(time || '').split(':');
  const hour = Number(hourText);
  const minute = Number(minuteText);
  return Number.isInteger(hour) && Number.isInteger(minute) ? (hour * 60) + minute : Number.NaN;
}
function parseDate(text, referenceDate, warnings) {
  const absoluteDates = [];
  let match;
  DATE_PATTERN.lastIndex = 0;
  while ((match = DATE_PATTERN.exec(text))) {
    const year = match[1] ? Number(match[1]) : referenceDate && referenceDate.year;
    const month = Number(match[2]);
    const day = Number(match[3]);
    if (!year) {
      warnings.push('未提供有效参考日期，无法补全年份。');
      continue;
    }
    if (!isValidDate(year, month, day)) {
      warnings.push(`日期“${match[0]}”无效。`);
      continue;
    }
    absoluteDates.push({
      value: formatDate({ year, month, day }),
      span: spanFromMatch(match)
    });
  }

  CHINESE_DATE_PATTERN.lastIndex = 0;
  while ((match = CHINESE_DATE_PATTERN.exec(text))) {
    const year = match[1] ? Number(match[1]) : referenceDate && referenceDate.year;
    const month = parseNumber(match[2]);
    const day = parseNumber(match[3]);
    if (!year) {
      warnings.push('未提供有效参考日期，无法补全年份。');
      continue;
    }
    if (!isValidDate(year, month, day)) {
      warnings.push(`日期“${match[0]}”无效。`);
      continue;
    }
    absoluteDates.push({
      value: formatDate({ year, month, day }),
      span: spanFromMatch(match)
    });
  }

  absoluteDates.sort((left, right) => left.span.start - right.span.start);

    if (absoluteDates.length > 1) warnings.push('检测到多个日期，已采用最先出现的日期。');
  if (absoluteDates.length) {
    return { value: absoluteDates[0].value, spans: [absoluteDates[0].span] };
  }

  const relativeMatch = text.match(/今天|明天|后天/);
  if (relativeMatch) {
    if (!referenceDate) {
      warnings.push('未提供有效参考日期，无法解析“今天、明天、后天”。');
      return { value: '', spans: [] };
    }
    const offset = relativeMatch[0] === '今天' ? 0 : relativeMatch[0] === '明天' ? 1 : 2;
    return {
      value: formatDate(addDays(referenceDate, offset)),
      spans: [spanFromMatch(relativeMatch)]
    };
  }

  const weekdayMatch = text.match(/(下)?(?:周|星期)([一二三四五六日天])/);
  if (weekdayMatch) {
    if (!referenceDate) {
      warnings.push('未提供有效参考日期，无法解析星期表达。');
      return { value: '', spans: [] };
    }
    const weekday = weekdayIndex(weekdayMatch[2]);
    const referenceWeekday = dayOfWeek(referenceDate);
    const offset = weekdayMatch[1]
      ? 7 - referenceWeekday + weekday
      : (weekday - referenceWeekday + 7) % 7;
    return {
      value: formatDate(addDays(referenceDate, offset)),
      spans: [spanFromMatch(weekdayMatch)]
    };
  }

  return { value: '', spans: [] };
}

function parseTimeRange(text, warnings) {
  const clocks = findClockTokens(text);
  if (!clocks.length) return { startTime: '', endTime: '', spans: [] };

  for (let index = 0; index < clocks.length - 1; index += 1) {
    const start = clocks[index];
    const end = clocks[index + 1];
    const connector = text.slice(start.end, end.start);
    if (!/^\s*(?:到|至|-|－|~|～|—|–)\s*$/.test(connector)) continue;

    const parsedStart = parseClock(start.value);
    const parsedEnd = parseClock(end.value, parsedStart.period);
    if (!parsedStart.time || !parsedEnd.time) {
      warnings.push('检测到的时间格式无效。');
      return { startTime: '', endTime: '', spans: [{ start: start.start, end: end.end }] };
    }
    if (!parsedStart.period && !isTwentyFourHourClock(start.value)) {
      warnings.push('时间未说明上午、下午或晚上，已按 24 小时制的凌晨时段解析。');
    }
    return {
      startTime: parsedStart.time,
      endTime: parsedEnd.time,
      spans: [{ start: start.start, end: end.end }]
    };
  }

  const parsedClock = parseClock(clocks[0].value);
  if (!parsedClock.time) {
    warnings.push('检测到的时间格式无效。');
    return { startTime: '', endTime: '', spans: [{ start: clocks[0].start, end: clocks[0].end }] };
  }
  if (!parsedClock.period && !isTwentyFourHourClock(clocks[0].value)) {
    warnings.push('时间未说明上午、下午或晚上，已按 24 小时制的凌晨时段解析。');
  }
  warnings.push('只识别到开始时间，尚未识别结束时间。');
  return {
    startTime: parsedClock.time,
    endTime: '',
    spans: [{ start: clocks[0].start, end: clocks[0].end }]
  };
}

function findClockTokens(text) {
  const tokenPattern = new RegExp(
    `(?<!周)(?<!星期)(?:${PERIOD_PATTERN}\\s*)?(?:\\d{1,2}\\s*[:：]\\s*\\d{2}|${CLOCK_NUMBER_PATTERN}\\s*(?:点|时)\\s*(?:半|${CLOCK_NUMBER_PATTERN}\\s*分?)?)`,
    'g'
  );
  const tokens = [];
  let match;
  while ((match = tokenPattern.exec(text))) {
    tokens.push({ value: match[0], start: match.index, end: match.index + match[0].length });
  }
  return tokens;
}

function parseClock(rawClock, inheritedPeriod = '') {
  let value = String(rawClock || '').replace(/\s/g, '');
  const periodMatch = value.match(new RegExp(`^(${PERIOD_PATTERN})`));
  const period = periodMatch ? periodMatch[1] : inheritedPeriod;
  if (periodMatch) value = value.slice(periodMatch[0].length);

  let hour;
  let minute = 0;
  const colonMatch = value.match(/^(\d{1,2})[:：](\d{2})$/);
  if (colonMatch) {
    hour = Number(colonMatch[1]);
    minute = Number(colonMatch[2]);
  } else {
    const clockMatch = value.match(new RegExp(`^(${CLOCK_NUMBER_PATTERN})(?:点|时)(?:(半)|(${CLOCK_NUMBER_PATTERN})分?)?$`));
    if (!clockMatch) return { time: '', period };
    hour = parseNumber(clockMatch[1]);
    minute = clockMatch[2] ? 30 : (clockMatch[3] ? parseNumber(clockMatch[3]) : 0);
  }

  if (!Number.isInteger(hour) || !Number.isInteger(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return { time: '', period };
  }

  if (period === '下午' || period === '傍晚' || period === '晚上' || period === '夜里') {
    if (hour >= 1 && hour <= 11) hour += 12;
  } else if (period === '中午' && hour >= 1 && hour <= 10) {
    hour += 12;
  }

  return { time: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`, period };
}

function parseTaskType(text, warnings) {
  const explicitPatterns = [
    /(?:算|是|属于|作为|安排为)\s*(工作|课程|学习|生活)(?:任务|安排|事项)?/,
    /(工作|课程|学习|生活)(?:任务|安排|事项)/
  ];
  for (const pattern of explicitPatterns) {
    const match = text.match(pattern);
    if (match) return { value: match[1], spans: [spanFromMatch(match)] };
  }

  const matches = [
    { type: '课程', pattern: /课程|上课|课堂|讲座|老师|作业/ },
    { type: '学习', pattern: /写论文|论文|学习|复习|预习|读书|阅读|考试|背单词/ },
    { type: '工作', pattern: /工作|开会|会议|汇报|项目|客户|加班/ },
    { type: '生活', pattern: /吃饭|运动|锻炼|跑步|买菜|做饭|睡觉|休息|午休|晚饭|早餐|午餐|晚餐|看病/ }
  ].filter((candidate) => candidate.pattern.test(text));

  if (matches.length === 1) return { value: matches[0].type, spans: [] };
  if (matches.length > 1) warnings.push('检测到多个类型关键词，未自动推断任务类型。');
  return { value: '', spans: [] };
}

function parseTitle(text, spans) {
  const withoutFields = removeSpans(text, spans);
  const title = withoutFields
    .replace(/(?:今天|明天|后天|(?:下)?(?:周|星期)[一二三四五六日天])/g, ' ')
    .replace(DATE_PATTERN, ' ')
    .replace(/[，,。；;、]/g, ' ')
    .replace(/(?:请|帮我|我想|我要|安排|计划|在|于)\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return collapseRepeatedText(title);
}

function removeSpans(text, spans) {
  return [...spans]
    .filter((span) => span && Number.isInteger(span.start) && Number.isInteger(span.end))
    .sort((left, right) => right.start - left.start)
    .reduce((value, span) => `${value.slice(0, span.start)} ${value.slice(span.end)}`, text);
}

function normalizeReferenceDate(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return { year: value.getFullYear(), month: value.getMonth() + 1, day: value.getDate() };
  }
  const match = String(value || '').trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const result = { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
  return isValidDate(result.year, result.month, result.day) ? result : null;
}

function addDays(date, offset) {
  const utcValue = Date.UTC(date.year, date.month - 1, date.day + offset);
  const shifted = new Date(utcValue);
  return { year: shifted.getUTCFullYear(), month: shifted.getUTCMonth() + 1, day: shifted.getUTCDate() };
}

function dayOfWeek(date) {
  const day = new Date(Date.UTC(date.year, date.month - 1, date.day)).getUTCDay();
  return day === 0 ? 6 : day - 1;
}

function weekdayIndex(value) {
  return { 一: 0, 二: 1, 三: 2, 四: 3, 五: 4, 六: 5, 日: 6, 天: 6 }[value];
}

function parseNumber(value) {
  const text = String(value || '');
  if (/^\d+$/.test(text)) return Number(text);
  if (!/^[零〇一二两三四五六七八九十]+$/.test(text)) return Number.NaN;
  if (text === '十') return 10;
  const tenIndex = text.indexOf('十');
  if (tenIndex < 0) return CHINESE_NUMBER_MAP[text];
  const tens = tenIndex === 0 ? 1 : CHINESE_NUMBER_MAP[text.slice(0, tenIndex)];
  const ones = text.slice(tenIndex + 1);
  return (tens * 10) + (ones ? CHINESE_NUMBER_MAP[ones] : 0);
}

function isTwentyFourHourClock(value) {
  return /\d{1,2}\s*[:：]\s*\d{2}/.test(value);
}

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function formatDate(date) {
  return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
}

function isValidDate(year, month, day) {
  const value = new Date(Date.UTC(year, month - 1, day));
  return value.getUTCFullYear() === year && value.getUTCMonth() === month - 1 && value.getUTCDate() === day;
}

function spanFromMatch(match) {
  return { start: match.index, end: match.index + match[0].length };
}

module.exports = {
  parseTaskText,
  parseTaskTextList
};
