function parseScheduleText(text, idPrefix = 'text') {
  const lines = String(text || '')
    .replace(/\r/g, '\n')
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  const tasks = [];

  lines.forEach((line, index) => {
    const timeRange = extractTimeRange(line);
    if (!timeRange) return;

    const title = extractTitle(line, timeRange.startTime, timeRange.endTime);
    tasks.push({
      id: `${idPrefix}-${Date.now()}-${index}`,
      title: title || '未命名安排',
      startTime: timeRange.startTime,
      endTime: timeRange.endTime,
      date: extractDate(line),
      weekday: extractWeekday(line),
      location: '',
      type: guessType(title),
      rawText: line
    });
  });

  return tasks;
}

function extractTimeRange(text) {
  const match = String(text).match(/(\d{1,2})\s*[:：.]\s*(\d{2})\s*[-~至—–]\s*(\d{1,2})\s*[:：.]\s*(\d{2})/);
  if (!match) return null;

  return {
    startTime: `${match[1].padStart(2, '0')}:${match[2]}`,
    endTime: `${match[3].padStart(2, '0')}:${match[4]}`
  };
}

function extractTitle(rawText, startTime, endTime) {
  const rangePattern = new RegExp(
    `${escapeClock(startTime)}\\s*[-~至—–]\\s*${escapeClock(endTime)}`
  );

  return String(rawText)
    .replace(rangePattern, '')
    .replace(/^\s*\d+\s+/, '')
    .replace(/\d{4}[-/.年]\d{1,2}[-/.月]\d{1,2}日?/, '')
    .replace(/周[一二三四五六日天]|星期[一二三四五六日天]/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractDate(text) {
  const value = String(text || '');
  const fullMatch = value.match(/(20\d{2})[-/.年]\s*(\d{1,2})[-/.月]\s*(\d{1,2})日?/);
  if (fullMatch) {
    return `${fullMatch[1]}-${fullMatch[2].padStart(2, '0')}-${fullMatch[3].padStart(2, '0')}`;
  }

  const shortMatch = value.match(/(?<![\dA-Za-z])(\d{1,2})[-/.月]\s*(\d{1,2})(?:日)?(?=$|[\s,，。；;、)）\]】]|周|星期)/);
  if (shortMatch) {
    return `${shortMatch[1].padStart(2, '0')}-${shortMatch[2].padStart(2, '0')}`;
  }

  return '';
}

function extractWeekday(text) {
  const match = String(text).match(/周[一二三四五六日天]|星期[一二三四五六日天]/);
  return match ? match[0] : '';
}

function guessType(title) {
  if (/课|lecture|class|seminar/i.test(title)) return '课程';
  return '任务';
}

function escapeClock(clock) {
  const [hour, minute] = String(clock).split(':');
  return `0?${Number(hour)}\\s*[:：.]\\s*${minute}`;
}

module.exports = {
  parseScheduleText,
  extractTimeRange,
  extractTitle,
  extractDate,
  extractWeekday,
  guessType
};
