const fs = require('fs/promises');
const path = require('path');
const { extractDate, extractTimeRange, extractTitle, guessType } = require('./textScheduleParser');

async function parseScheduleFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.csv' || ext === '.tsv') {
    const text = await fs.readFile(filePath, 'utf8');
    const rows = parseDelimitedText(text, ext === '.tsv' ? '\t' : ',');
    const result = buildResult(rows, {
      idPrefix: 'csv',
      fileYear: inferYearFromFileName(filePath) || new Date().getFullYear()
    });
    const timetableTemplate = extractTimetableTemplate(rows);
    return {
      ...result,
      timetableTemplate,
      message: `表格转化完成：已解析出 ${result.tasks.length} 条安排${timetableTemplate.rows.length ? `，并预填 ${timetableTemplate.rows.length} 行课表` : ''}`
    };
  }

  if (ext === '.xlsx' || ext === '.xls') {
    return parseExcelWorkbook(filePath);
  }

  if (ext === '.pdf') {
    return parsePdfFile(filePath);
  }

  return {
    tasks: [],
    status: 'unsupported',
    message: '暂不支持该表格类型，请选择 xlsx、xls、csv、tsv 或 pdf 文件。'
  };
}

async function parsePdfFile(filePath) {
  let PDFParse;
  try {
    ({ PDFParse } = require('pdf-parse'));
  } catch (error) {
    return {
      tasks: [],
      status: 'missing_dependency',
      message: '解析 PDF 需要安装 pdf-parse 依赖：npm install'
    };
  }

  let parser = null;
  try {
    const data = await fs.readFile(filePath);
    parser = new PDFParse({ data });
    const [textResult, tableResult] = await Promise.all([
      parser.getText(),
      parser.getTable().catch(() => null)
    ]);
    const text = textResult.text || '';
    const rows = [
      ...extractRowsFromPdfTables(tableResult),
      ...parsePdfTextToRows(text)
    ];
    const parsed = buildResult(rows, {
      idPrefix: 'pdf',
      fileYear: inferYearFromFileName(filePath) || new Date().getFullYear()
    });

    return {
      ...parsed,
      timetableTemplate: { rows: [] },
      pageCount: textResult.total || 0,
      message: `PDF 表格转化完成：已解析出 ${parsed.tasks.length} 条安排`
    };
  } catch (error) {
    return {
      tasks: [],
      status: 'parse_error',
      message: `PDF 解析失败：${error.message}`
    };
  } finally {
    if (parser) await parser.destroy();
  }
}

async function parseExcelWorkbook(filePath) {
  let XLSX;
  try {
    XLSX = require('xlsx');
  } catch (error) {
    return {
      tasks: [],
      status: 'missing_dependency',
      message: '解析 Excel 需要安装 xlsx 依赖：npm install'
    };
  }

  const workbook = XLSX.readFile(filePath, { cellDates: false, cellComments: true });
  const allTasks = [];
  const journals = [];
  const allTimetableRows = [];
  let datedSheetCount = 0;

  workbook.SheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    fillMergedCells(XLSX, sheet);
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
    const fileYear = inferYearFromFileName(filePath) || new Date().getFullYear();
    const date = inferSheetDate(sheetName, filePath);
    const dateRange = inferSheetDateRange(sheetName, filePath);
    if (date) datedSheetCount += 1;
    const result = buildResult(rows, {
      date,
      sheetName,
      fileYear,
      idPrefix: `sheet-${sheetName}`
    });
    allTasks.push(...result.tasks);
    journals.push(...result.journals);
    const annotationResult = extractSheetAnnotations(sheet, rows, result.tasks, {
      sheetName,
      date: dateRange.start || date,
      dateRange,
      fileYear
    });
    journals.push(...annotationResult.journals);
    const timetableTemplate = extractTimetableTemplate(rows);
    if (timetableTemplate.rows.length > 0) {
      allTimetableRows.push(...timetableTemplate.rows);
    }
  });

  return {
    tasks: allTasks,
    journals,
    timetableTemplate: { rows: dedupeTimetableRows(allTimetableRows) },
    sheetCount: workbook.SheetNames.length,
    datedSheetCount,
    status: 'ok',
    message: `表格转化完成：已解析出 ${allTasks.length} 条安排${allTimetableRows.length ? `，并预填 ${dedupeTimetableRows(allTimetableRows).length} 行课表` : ''}${journals.length ? `，读取 ${journals.length} 条每日记录` : ''}`
  };
}

function buildResult(rows, context = {}) {
  const normalizedRows = rows
    .map((row) => row.map((cell) => String(cell ?? '').trim()))
    .filter((row) => row.some(Boolean));

  const headerIndex = findHeaderIndex(normalizedRows);
  const header = headerIndex >= 0 ? normalizedRows[headerIndex] : [];
  const dataRows = headerIndex >= 0 ? normalizedRows.slice(headerIndex + 1) : normalizedRows;
  const mappings = mapHeader(header);

  const tasks = [];
  const journals = [];

  dataRows.forEach((row, index) => {
    const rowContext = {
      ...context,
      rowIndex: headerIndex >= 0 ? headerIndex + index + 1 : index
    };
    const task = rowToTask(row, mappings, index, rowContext);
    if (task) {
      tasks.push(task);
      return;
    }

    const journal = rowToJournal(row, mappings, index, rowContext);
    if (journal) journals.push(journal);
  });

  const collapsedTasks = collapseTasksByTime(tasks);

  return {
    tasks: collapsedTasks,
    journals,
    status: 'ok',
    message: `已解析出 ${collapsedTasks.length} 条安排`
  };
}

function rowToTask(row, mappings, index, context = {}) {
  const rawText = row.filter(Boolean).join(' ');
  const detectedTimeRange = extractTimeRange(rawText);

  let startTime = getCell(row, mappings.startTime);
  let endTime = getCell(row, mappings.endTime);
  const timeRangeCell = getCell(row, mappings.timeRange);
  const timeRangeFromCell = extractTimeRange(timeRangeCell);

  if (!startTime && timeRangeFromCell) startTime = timeRangeFromCell.startTime;
  if (!endTime && timeRangeFromCell) endTime = timeRangeFromCell.endTime;
  if (!startTime && detectedTimeRange) startTime = detectedTimeRange.startTime;
  if (!endTime && detectedTimeRange) endTime = detectedTimeRange.endTime;

  if (!startTime || !endTime) return rowToUntimedTask(row, mappings, index, context, rawText);

  const titleSource = getCell(row, mappings.title)
    || (timeRangeCell ? extractTitle(timeRangeCell, startTime, endTime) : '')
    || extractTitle(rawText, startTime, endTime);
  const title = cleanTaskTitle(titleSource, startTime, endTime);
  if (!isTaskLikeTitle(title)) return null;
  const date = normalizeParsedDate(getCell(row, mappings.date), context.fileYear)
    || normalizeParsedDate(extractDate(rawText), context.fileYear)
    || context.date
    || '';

  return {
    id: `${context.idPrefix || 'table'}-${Date.now()}-${index}`,
    title,
    startTime,
    endTime,
    date,
    weekday: getCell(row, mappings.weekday) || weekdayFromDate(date),
    location: getCell(row, mappings.location),
    type: getCell(row, mappings.type) || guessType(title),
    planDetails: getCell(row, mappings.planDetails),
    details: '',
    status: normalizeTaskStatus(getCell(row, mappings.status)),
    rawText,
    sheetName: context.sheetName || '',
    rowIndex: context.rowIndex
  };
}

function rowToUntimedTask(row, mappings, index, context = {}, rawText = '') {
  if (mappings.title === undefined || !context.date) return null;

  const title = cleanTaskTitle(getCell(row, mappings.title), '', '');
  if (!isTaskLikeTitle(title)) return null;

  return {
    id: `${context.idPrefix || 'table'}-untimed-${Date.now()}-${index}`,
    title,
    startTime: '',
    endTime: '',
    date: context.date,
    weekday: weekdayFromDate(context.date),
    location: getCell(row, mappings.location),
    type: getCell(row, mappings.type) || guessType(title),
    planDetails: getCell(row, mappings.planDetails),
    details: '',
    status: normalizeTaskStatus(getCell(row, mappings.status)),
    rawText,
    sheetName: context.sheetName || '',
    rowIndex: context.rowIndex,
    source: 'untimed-table'
  };
}

function rowToJournal(row, mappings, index, context = {}) {
  const rawText = row.filter(Boolean).join(' ').trim();
  if (!rawText || extractTimeRange(rawText)) return null;
  if (!isJournalLikeText(rawText)) return null;

  const date = normalizeParsedDate(getCell(row, mappings.date), context.fileYear)
    || normalizeParsedDate(extractDate(rawText), context.fileYear)
    || context.date
    || '';
  if (!date) return null;

  return {
    id: `${context.idPrefix || 'table'}-journal-${Date.now()}-${index}`,
    date,
    sheetName: context.sheetName || '',
    content: rawText,
    source: 'table-cell'
  };
}

function collapseTasksByTime(taskItems) {
  const taskMap = new Map();

  taskItems.forEach((task) => {
    const key = [
      normalizeParsedDate(task.date),
      task.sheetName || '',
      task.startTime || `untimed-${task.title}`,
      task.endTime || task.location || task.rowIndex || ''
    ].join('|');
    const current = taskMap.get(key);
    if (!current) {
      taskMap.set(key, task);
      return;
    }

    if (String(task.title || '').length > String(current.title || '').length) {
      current.title = task.title;
    }
    current.planDetails = appendText(current.planDetails, task.planDetails);
    current.rawText = appendText(current.rawText, task.rawText);
  });

  return Array.from(taskMap.values());
}

function isTaskLikeTitle(title) {
  const text = String(title || '').trim();
  if (!text) return false;
  if (/^[\d\s√✓×xX-]+$/.test(text)) return false;
  if (/^情况$|^序号$|^具体任务$|^时间线$/.test(text)) return false;
  return /[\u4e00-\u9fa5A-Za-z]/.test(text);
}

function cleanTaskTitle(value, startTime, endTime) {
  const text = String(value || '')
    .replace(taskTimeRangePattern(startTime, endTime), '')
    .replace(/\s+/g, ' ')
    .trim();

  return collapseRepeatedText(text);
}

function taskTimeRangePattern(startTime, endTime) {
  if (!startTime || !endTime) return /$^/g;
  return new RegExp(`${clockPattern(startTime)}\\s*[-~至—–]\\s*${clockPattern(endTime)}`, 'g');
}

function clockPattern(clock) {
  const [hour, minute] = String(clock).split(':');
  return `0?${Number(hour)}\\s*[:：.]\\s*${minute}`;
}

function collapseRepeatedText(value) {
  const text = String(value || '').trim();
  if (!text) return '';

  for (let length = 2; length <= Math.floor(text.length / 2); length += 1) {
    const chunk = text.slice(0, length).trim();
    if (!chunk) continue;
    if (text.replace(/\s+/g, '') === `${chunk}${chunk}`.replace(/\s+/g, '')) {
      return chunk;
    }
  }

  return text.replace(/^(.+?)\s+\1$/u, '$1').trim();
}

function extractSheetAnnotations(sheet, rows, tasks, context = {}) {
  const journals = [];
  const comments = collectSheetComments(sheet);

  comments.forEach((comment, index) => {
    const relatedTask = tasks.find((task) => task.rowIndex === comment.row);
    const nearbyText = [
      comment.cellText,
      rows[comment.row] ? rows[comment.row].filter(Boolean).join(' ') : ''
    ].join(' ');
    const kind = classifyComment(comment.text, nearbyText);

    if (relatedTask && kind !== 'journal') {
      if (kind === 'plan') {
        relatedTask.planDetails = appendText(relatedTask.planDetails, comment.text);
      }
      return;
    }

    const date = context.date
      || normalizeParsedDate(extractDate(nearbyText), context.fileYear)
      || normalizeParsedDate(extractDate(comment.text), context.fileYear)
      || '';
    journals.push({
      id: `journal-${context.sheetName || 'sheet'}-comment-${Date.now()}-${index}`,
      date,
      dateRangeStart: context.dateRange && context.dateRange.start ? context.dateRange.start : date,
      dateRangeEnd: context.dateRange && context.dateRange.end ? context.dateRange.end : date,
      sheetName: context.sheetName || '',
      content: comment.text,
      source: 'excel-comment'
    });
  });

  return { journals };
}

function collectSheetComments(sheet) {
  return Object.entries(sheet)
    .filter(([address, cell]) => !address.startsWith('!') && cell && Array.isArray(cell.c))
    .flatMap(([address, cell]) => {
      const position = decodeCellAddress(address);
      return cell.c
        .map((comment) => String(comment.t || comment.text || '').trim())
        .filter(Boolean)
        .map((text) => ({
          address,
          row: position.row,
          col: position.col,
          cellText: String(cell.v || cell.w || '').trim(),
          text
        }));
    });
}

function classifyComment(commentText, nearbyText = '') {
  const text = `${commentText} ${nearbyText}`;
  if (/事前|计划|要求|注意事项|准备|要做/.test(text)) return 'plan';
  if (/完成|实际|反思|复盘|评价|情况|总结|发生|记录/.test(text)) return 'details';
  if (/每日|日记|生活记录|今天|状态|复盘/.test(text)) return 'journal';
  return 'details';
}

function decodeCellAddress(address) {
  const match = String(address).match(/^([A-Z]+)(\d+)$/i);
  if (!match) return { row: -1, col: -1 };
  const col = match[1].toUpperCase().split('').reduce((sum, char) => sum * 26 + char.charCodeAt(0) - 64, 0) - 1;
  return {
    row: Number(match[2]) - 1,
    col
  };
}

function appendText(current, next) {
  return [current, next].map((value) => String(value || '').trim()).filter(Boolean).join('\n');
}

function isJournalLikeText(text) {
  const value = String(text || '').trim();
  if (value.length < 12) return false;
  if (/备注|批注|记录|反思|复盘|总结|完成|今天|状态|发生|实际/.test(value)) return true;
  return /[。！？；，,]/.test(value) && value.length >= 24;
}

function normalizeParsedDate(value, fallbackYear) {
  const text = String(value || '').trim();
  if (!text) return '';

  const fullMatch = text.match(/(20\d{2})[-/.年]\s*(\d{1,2})[-/.月]\s*(\d{1,2})日?/);
  if (fullMatch) return formatDateParts(Number(fullMatch[1]), Number(fullMatch[2]), Number(fullMatch[3]));

  const shortMatch = text.match(/^(\d{1,2})[-/.月]\s*(\d{1,2})日?$/);
  if (shortMatch && fallbackYear) {
    return formatDateParts(fallbackYear, Number(shortMatch[1]), Number(shortMatch[2]));
  }

  return '';
}

function inferSheetDate(sheetName, filePath) {
  const text = String(sheetName || '').trim();
  const year = inferYearFromFileName(filePath) || new Date().getFullYear();
  const match = text.match(/^(\d{1,2})[./-](\d{1,2})$/);

  if (!match) return '';

  return `${year}-${match[1].padStart(2, '0')}-${match[2].padStart(2, '0')}`;
}

function inferSheetDateRange(sheetName, filePath) {
  const text = String(sheetName || '').trim();
  const year = inferYearFromFileName(filePath) || new Date().getFullYear();
  const rangeMatch = text.match(/^(\d{1,2})[./](\d{1,2})\s*[-~至—–]\s*(?:(\d{1,2})[./])?(\d{1,2})$/);

  if (rangeMatch) {
    const startMonth = Number(rangeMatch[1]);
    const startDay = Number(rangeMatch[2]);
    const endMonth = Number(rangeMatch[3] || rangeMatch[1]);
    const endDay = Number(rangeMatch[4]);
    const startYear = year;
    const endYear = endMonth < startMonth ? year + 1 : year;

    return {
      start: formatDateParts(startYear, startMonth, startDay),
      end: formatDateParts(endYear, endMonth, endDay)
    };
  }

  const date = inferSheetDate(sheetName, filePath);
  return {
    start: date,
    end: date
  };
}

function formatDateParts(year, month, day) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function inferYearFromFileName(filePath) {
  const fileName = path.basename(filePath);
  const match = fileName.match(/(20\d{2})/);
  return match ? Number(match[1]) : null;
}

function weekdayFromDate(date) {
  if (!date) return '';
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return '';
  return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][parsed.getDay()];
}

function findHeaderIndex(rows) {
  return rows.findIndex((row) => {
    const joined = row.join('|').toLowerCase();
    return /时间|开始|start|课程|任务|title|subject|日期|星期|week|地点|location/.test(joined);
  });
}

function mapHeader(header) {
  return header.reduce((acc, cell, index) => {
    const label = String(cell).toLowerCase();
    if (/具体任务|任务目标|任务详情|事前|计划|plan/.test(label)) acc.planDetails = index;
    if (/课程|任务|事项|内容|名称|title|subject|course|task/.test(label) && acc.planDetails !== index) acc.title = index;
    if (/开始|start/.test(label)) acc.startTime = index;
    if (/结束|end/.test(label)) acc.endTime = index;
    if (/日期|date/.test(label)) acc.date = index;
    if (/星期|周|week|day/.test(label)) acc.weekday = index;
    if (/地点|教室|位置|location|place|room/.test(label)) acc.location = index;
    if (/类型|type/.test(label)) acc.type = index;
    if (/完成情况|完成状态|完成|状态|情况|status/.test(label)) acc.status = index;
    if (/评价/.test(label) && acc.status === undefined) acc.status = index;
    if (/时间段|时间|time/.test(label) && acc.startTime === undefined) acc.timeRange = index;
    return acc;
  }, {});
}

function normalizeTaskStatus(value) {
  const text = String(value || '').trim();
  if (!text) return '未评价';
  if (/未完成|没完成|未做|失败/.test(text)) return '未完成';
  if (/部分|一半|进行中|未完全/.test(text)) return '部分完成';
  if (/完成|做完|已做|正好|√|✓/.test(text)) return '已完成';
  return '未评价';
}

function getCell(row, index) {
  if (index === undefined || index < 0 || index >= row.length) return '';
  return String(row[index] ?? '').trim();
}

function parseDelimitedText(text, delimiter) {
  return text
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => parseDelimitedLine(line, delimiter));
}

function parsePdfTextToRows(text) {
  return String(text || '')
    .replace(/\r/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map(parsePdfTextLine);
}

function parsePdfTextLine(line) {
  if (line.includes('\t')) return parseDelimitedLine(line, '\t');

  const weekdayHeaders = extractWeekdayHeaders(line);
  if (weekdayHeaders.length >= 2) {
    const hasTimeColumn = /时间|节次|课节|节/.test(line.slice(0, line.indexOf(weekdayHeaders[0])));
    return hasTimeColumn ? ['时间', ...weekdayHeaders] : weekdayHeaders;
  }

  const withCellBreaks = line.replace(/\s{2,}/g, '\t');
  if (withCellBreaks.includes('\t')) return parseDelimitedLine(withCellBreaks, '\t');

  return [line];
}

function extractRowsFromPdfTables(tableResult) {
  if (!tableResult || !Array.isArray(tableResult.pages)) return [];

  return tableResult.pages.flatMap((page) => {
    if (!page || !Array.isArray(page.tables)) return [];
    return page.tables.flatMap((table) => Array.isArray(table) ? table : []);
  }).map((row) => Array.isArray(row) ? row.map((cell) => String(cell ?? '').trim()) : [])
    .filter((row) => row.some(Boolean));
}

function extractWeekdayHeaders(text) {
  return String(text || '').match(/(?:星期|周)\s*[一二三四五六日天]/g)
    ?.map((value) => value.replace(/\s+/g, ''))
    || [];
}

function parseDelimitedLine(line, delimiter) {
  const cells = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === delimiter && !inQuotes) {
      cells.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  cells.push(current.trim());
  return cells;
}

function fillMergedCells(XLSX, sheet) {
  const merges = sheet['!merges'] || [];
  merges.forEach((range) => {
    const sourceAddress = XLSX.utils.encode_cell(range.s);
    const sourceCell = sheet[sourceAddress];
    if (!sourceCell) return;

    for (let row = range.s.r; row <= range.e.r; row += 1) {
      for (let col = range.s.c; col <= range.e.c; col += 1) {
        const address = XLSX.utils.encode_cell({ r: row, c: col });
        if (!sheet[address]) sheet[address] = { ...sourceCell };
      }
    }
  });
}

function extractTimetableTemplate(rows) {
  const normalizedRows = rows
    .map((row) => row.map((cell) => String(cell ?? '').trim()))
    .filter((row) => row.some(Boolean));
  const headerIndex = findWeekdayHeaderIndex(normalizedRows);
  if (headerIndex < 0) return { rows: [] };

  const header = normalizedRows[headerIndex];
  const weekdayColumns = header
    .map((cell, index) => ({ weekday: normalizeWeekdayHeader(cell), index }))
    .filter((item) => item.weekday !== null);
  const timeColumn = findTimeColumn(header, weekdayColumns);
  const templateRows = [];
  let currentTemplateRow = null;

  normalizedRows.slice(headerIndex + 1).forEach((row) => {
    if (row.filter((cell) => normalizeWeekdayHeader(cell) !== null).length >= 2) return;

    const rawTimeText = cleanTimetableLabel(row[timeColumn]);
    const courses = readTimetableCourses(row, weekdayColumns);
    if (!courses.some(Boolean)) return;

    if (rawTimeText) {
      currentTemplateRow = {
        timeRange: cleanTimetableTime(rawTimeText),
        sectionLabel: rawTimeText && !cleanTimetableTime(rawTimeText) ? rawTimeText : '',
        courses
      };
      templateRows.push(currentTemplateRow);
      return;
    }

    if (currentTemplateRow) {
      appendTimetableCourses(currentTemplateRow.courses, courses);
    }
  });

  return { rows: dedupeTimetableRows(templateRows) };
}

function readTimetableCourses(row, weekdayColumns) {
  const courses = Array(7).fill('');
    weekdayColumns.forEach((item) => {
      courses[item.weekday] = cleanTimetableCourse(row[item.index]);
    });
  return courses;
}

function appendTimetableCourses(targetCourses, extraCourses) {
  extraCourses.forEach((course, index) => {
    if (!course) return;
    targetCourses[index] = [targetCourses[index], course].filter(Boolean).join('\n');
  });
}

function findWeekdayHeaderIndex(rows) {
  return rows.findIndex((row) => row.filter((cell) => normalizeWeekdayHeader(cell) !== null).length >= 2);
}

function normalizeWeekdayHeader(value) {
  const text = String(value || '').replace(/\s+/g, '');
  const match = text.match(/(?:星期|周)([一二三四五六日天])/);
  if (!match) return null;
  const indexMap = {
    一: 0,
    二: 1,
    三: 2,
    四: 3,
    五: 4,
    六: 5,
    日: 6,
    天: 6
  };
  return indexMap[match[1]];
}

function findTimeColumn(header, weekdayColumns) {
  const explicit = header.findIndex((cell) => /时间|节次|课节|节/.test(String(cell || '')));
  if (explicit >= 0) return explicit;
  const firstWeekdayColumn = Math.min(...weekdayColumns.map((item) => item.index));
  return Math.max(0, firstWeekdayColumn - 1);
}

function cleanTimetableTime(value) {
  const text = String(value || '')
    .replace(/\s+/g, '')
    .replace(/^第?(\d+)\s*节$/, '$1节')
    .trim();
  const timeRange = extractTimeRange(text);
  return timeRange ? `${timeRange.startTime}-${timeRange.endTime}` : '';
}

function cleanTimetableLabel(value) {
  return String(value || '')
    .replace(/\s+/g, '')
    .replace(/^第?(\d+)\s*节$/, '$1节')
    .trim();
}

function cleanTimetableCourse(value) {
  return String(value || '')
    .replace(/\r?\n+/g, ' ')
    .replace(/待生效/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function dedupeTimetableRows(rows) {
  const seen = new Set();
  return rows.filter((row) => {
    const key = `${row.timeRange}|${row.courses.join('|')}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

module.exports = {
  parseScheduleFile,
  parseDelimitedText,
  parsePdfTextToRows,
  extractTimetableTemplate,
  extractTimeRange,
  inferSheetDate,
  inferSheetDateRange
};
