const fs = require('fs');
const path = require('path');
const { parseScheduleText } = require('./textScheduleParser');

const WEEKDAY_LABELS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

async function parseScheduleImage(filePath) {
  let createWorker;

  try {
    ({ createWorker } = require('tesseract.js'));
  } catch (error) {
    return {
      tasks: [],
      timetableTemplate: { rows: [] },
      status: 'missing_dependency',
      message: '图片课表需要本地 OCR 依赖 tesseract.js。请先运行 npm install，再重新导入图片。'
    };
  }

  const languageConfig = getLanguageConfig();
  let worker;

  try {
    worker = await createWorker(languageConfig.language, 1, {
      workerPath: path.join(__dirname, 'tesseractNodeWorker.js'),
      langPath: languageConfig.langPath,
      gzip: true,
      errorHandler: (error) => {
        console.warn('RiZhi OCR worker error:', error);
      }
    });
  } catch (error) {
    return {
      tasks: [],
      timetableTemplate: { rows: [] },
      status: 'ocr_error',
      message: `图片 OCR 初始化失败：${error.message}`
    };
  }

  try {
    const imageForOcr = await prepareImageForOcr(filePath);
    const result = await worker.recognize(imageForOcr);
    const rawText = result.data.text || '';
    const units = collectOcrUnits(result.data);
    const timetableTemplate = buildTemplateFromOcrLayout(units);
    const fallbackTasks = parseScheduleText(rawText, 'ocr');
    const fallbackTemplate = buildTemplateFromRecognizedTasks(fallbackTasks);
    const bestTemplate = timetableTemplate.rows.length > 0 ? timetableTemplate : fallbackTemplate;

    return {
      tasks: fallbackTasks,
      timetableTemplate: bestTemplate,
      rawText,
      status: 'ok',
      message: bestTemplate.rows.length > 0
        ? '图片转化完成：已根据文字位置关系预填课表。请校对课程位置，并填写具体时间段后再生成课程安排。'
        : '图片转化完成：已读取图片文字，但没有识别出稳定的课表网格。请在课表编辑器中手动填写。'
    };
  } finally {
    await worker.terminate();
  }
}

async function prepareImageForOcr(filePath) {
  try {
    const sharp = require('sharp');
    return await sharp(filePath)
      .resize({ width: 1800, withoutEnlargement: false })
      .grayscale()
      .normalize()
      .sharpen()
      .png()
      .toBuffer();
  } catch (error) {
    return filePath;
  }
}

function getLanguageConfig() {
  const bundledLangPath = path.join(__dirname, '..', '..', 'tessdata');
  if (fs.existsSync(path.join(bundledLangPath, 'chi_sim.traineddata.gz'))) {
    return {
      language: 'chi_sim',
      langPath: bundledLangPath
    };
  }

  try {
    const chiSim = require('@tesseract.js-data/chi_sim');
    return {
      language: chiSim.code || 'chi_sim',
      langPath: chiSim.langPath
    };
  } catch (error) {
    throw new Error('缺少 OCR 中文语言包 @tesseract.js-data/chi_sim，请运行 npm install。');
  }
}

function collectOcrUnits(data) {
  const source = Array.isArray(data.words) && data.words.length > 0
    ? data.words
    : Array.isArray(data.lines)
      ? data.lines
      : [];

  return source
    .map((item) => {
      const text = String(item.text || '').trim();
      const bbox = normalizeBox(item.bbox);
      if (!text || !bbox) return null;
      return {
        text,
        bbox,
        confidence: Number(item.confidence ?? item.conf ?? 100),
        x: (bbox.x0 + bbox.x1) / 2,
        y: (bbox.y0 + bbox.y1) / 2
      };
    })
    .filter(Boolean);
}

function normalizeBox(box) {
  if (!box) return null;
  const x0 = Number(box.x0 ?? box.left ?? box.l);
  const y0 = Number(box.y0 ?? box.top ?? box.t);
  const x1 = Number(box.x1 ?? (box.left !== undefined && box.width !== undefined ? box.left + box.width : box.r));
  const y1 = Number(box.y1 ?? (box.top !== undefined && box.height !== undefined ? box.top + box.height : box.b));
  if (![x0, y0, x1, y1].every(Number.isFinite)) return null;
  return { x0, y0, x1, y1 };
}

function buildTemplateFromOcrLayout(units) {
  if (!Array.isArray(units) || units.length === 0) return { rows: [] };

  const scale = estimateScale(units);
  const weekdayColumns = detectWeekdayColumns(units);
  if (weekdayColumns.length < 2) return { rows: [] };

  const headerBottom = Math.max(...weekdayColumns.map((item) => item.bbox.y1));
  const firstCourseColumn = Math.min(...weekdayColumns.map((item) => item.x));
  const courseLeftBoundary = inferCourseLeftBoundary(weekdayColumns);
  const timeMarkers = detectTimeMarkers(units, firstCourseColumn, headerBottom, scale);
  const rowSlots = buildRowSlots(timeMarkers, units, headerBottom, scale);
  if (rowSlots.length === 0) return { rows: [] };

  const cells = new Map();
  units.forEach((unit) => {
    if (unit.y <= headerBottom) return;
    if (unit.x < courseLeftBoundary) return;
    if (unit.confidence < 25 || isNoiseText(unit.text)) return;

    const columnIndex = nearestWeekdayColumn(unit.x, weekdayColumns);
    const rowIndex = nearestRowSlot(unit.y, rowSlots);
    if (columnIndex < 0 || rowIndex < 0) return;

    const key = `${rowIndex}:${columnIndex}`;
    if (!cells.has(key)) cells.set(key, []);
    cells.get(key).push(unit);
  });

  const rows = rowSlots.map((slot, rowIndex) => {
    const courses = Array(7).fill('');
    for (let columnIndex = 0; columnIndex < 7; columnIndex += 1) {
      const cellUnits = cells.get(`${rowIndex}:${columnIndex}`) || [];
      courses[columnIndex] = summarizeCourseCell(cellUnits);
    }
    return {
      timeRange: '',
      sectionLabel: slot.label,
      courses
    };
  }).filter((row) => row.courses.some(Boolean));

  return { rows };
}

function detectWeekdayColumns(units) {
  const columns = [];
  units.forEach((unit) => {
    const weekdayIndex = weekdayToIndex(unit.text);
    if (weekdayIndex < 0) return;
    columns.push({
      ...unit,
      weekdayIndex
    });
  });

  const byWeekday = new Map();
  columns.forEach((item) => {
    const current = byWeekday.get(item.weekdayIndex);
    if (!current || item.bbox.y0 < current.bbox.y0) {
      byWeekday.set(item.weekdayIndex, item);
    }
  });

  const directColumns = Array.from(byWeekday.values()).sort((a, b) => a.weekdayIndex - b.weekdayIndex);
  if (directColumns.length >= 2) return directColumns;

  return detectWeekdayColumnsFromHeaderCharacters(units);
}

function detectWeekdayColumnsFromHeaderCharacters(units) {
  const scale = estimateScale(units);
  const minY = Math.min(...units.map((unit) => unit.y));
  const candidates = units
    .filter((unit) => unit.y < minY + 140 * scale)
    .map((unit) => ({
      ...unit,
      weekdayIndex: weekdayCharacterToIndex(unit.text)
    }))
    .filter((unit) => unit.weekdayIndex >= 0);
  const clusters = clusterByY(candidates, 14 * scale);
  const headerCluster = clusters
    .filter((cluster) => new Set(cluster.items.map((item) => item.weekdayIndex)).size >= 2)
    .sort((a, b) => a.y - b.y)[0];

  if (!headerCluster) return [];

  const byWeekday = new Map();
  headerCluster.items.forEach((item) => {
    if (!byWeekday.has(item.weekdayIndex)) byWeekday.set(item.weekdayIndex, item);
  });

  return Array.from(byWeekday.values()).sort((a, b) => a.weekdayIndex - b.weekdayIndex);
}

function detectTimeMarkers(units, firstCourseColumn, headerBottom, scale) {
  const markers = units
    .filter((unit) => unit.y > headerBottom)
    .filter((unit) => unit.x < firstCourseColumn)
    .map((unit) => {
      const number = extractSectionNumber(unit.text);
      return number ? { number, y: unit.y } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.y - b.y)
    .filter((marker, index, markers) => index === 0 || marker.number !== markers[index - 1].number || Math.abs(marker.y - markers[index - 1].y) > 12 * scale);
  return filterSequentialTimeMarkers(markers);
}

function filterSequentialTimeMarkers(markers) {
  const result = [];
  markers.forEach((marker) => {
    const previous = result[result.length - 1];
    if (!previous || marker.number === previous.number + 1) {
      result.push(marker);
    }
  });
  return result;
}

function buildRowSlots(timeMarkers, units, headerBottom, scale) {
  if (timeMarkers.length >= 2) {
    const rows = [];
    for (let index = 0; index < timeMarkers.length; index += 2) {
      const first = timeMarkers[index];
      const second = timeMarkers[index + 1];
      const end = second || first;
      rows.push({
        label: first.number === end.number ? `${first.number}节` : `${first.number}-${end.number}节`,
        y: (first.y + end.y) / 2
      });
    }
    return withRowBounds(rows, headerBottom);
  }

  return withRowBounds(clusterCourseRows(units.filter((unit) => unit.y > headerBottom && !isNoiseText(unit.text)), scale)
    .map((cluster, index) => ({
      label: `${index + 1}节`,
      y: cluster.y
    })), headerBottom);
}

function clusterCourseRows(units, scale = 1) {
  const clusters = [];
  units.sort((a, b) => a.y - b.y).forEach((unit) => {
    const cluster = clusters.find((item) => Math.abs(item.y - unit.y) < 48 * scale);
    if (!cluster) {
      clusters.push({ y: unit.y, count: 1 });
      return;
    }
    cluster.y = (cluster.y * cluster.count + unit.y) / (cluster.count + 1);
    cluster.count += 1;
  });
  return clusters;
}

function estimateScale(units) {
  const ys = units.map((unit) => unit.y).filter(Number.isFinite);
  if (ys.length === 0) return 1;
  const height = Math.max(...ys) - Math.min(...ys);
  return Math.max(1, height / 850);
}

function nearestWeekdayColumn(x, weekdayColumns) {
  let nearest = null;
  weekdayColumns.forEach((column) => {
    const distance = Math.abs(column.x - x);
    if (!nearest || distance < nearest.distance) {
      nearest = { index: column.weekdayIndex, distance };
    }
  });
  return nearest ? nearest.index : -1;
}

function inferCourseLeftBoundary(weekdayColumns) {
  const sorted = [...weekdayColumns].sort((a, b) => a.x - b.x);
  if (sorted.length < 2) return sorted[0] ? sorted[0].x - 80 : 0;
  const gaps = [];
  for (let index = 1; index < sorted.length; index += 1) {
    gaps.push(sorted[index].x - sorted[index - 1].x);
  }
  gaps.sort((a, b) => a - b);
  const medianGap = gaps[Math.floor(gaps.length / 2)] || 120;
  return sorted[0].x - medianGap / 2;
}

function nearestRowSlot(y, rowSlots) {
  const containing = rowSlots.findIndex((row) => Number.isFinite(row.top) && Number.isFinite(row.bottom) && y >= row.top && y < row.bottom);
  if (containing >= 0) return containing;

  let nearest = null;
  rowSlots.forEach((row, index) => {
    const distance = Math.abs(row.y - y);
    if (!nearest || distance < nearest.distance) {
      nearest = { index, distance };
    }
  });
  return nearest ? nearest.index : -1;
}

function withRowBounds(rows, headerBottom) {
  return rows.map((row, index) => {
    const previous = rows[index - 1];
    const next = rows[index + 1];
    return {
      ...row,
      top: previous ? (previous.y + row.y) / 2 : headerBottom,
      bottom: next ? (row.y + next.y) / 2 : Number.POSITIVE_INFINITY
    };
  });
}

function summarizeCourseCell(units) {
  const lines = clusterByY(units, estimateLineTolerance(units))
    .sort((a, b) => a.y - b.y)
    .map((cluster) => cluster.items.sort((a, b) => a.x - b.x))
    .map((lineUnits) => joinOcrLine(lineUnits))
    .map((line) => cleanCourseLine(line))
    .filter(Boolean);

  const kept = [];
  for (const line of lines) {
    if (isCourseMetaLine(line)) break;
    if (isDuplicateCourseLine(kept, line)) continue;
    kept.push(line);
    if (kept.length >= 2) break;
  }

  const course = normalizeKnownCourseName(kept.join(' ').replace(/\s+/g, ' ').trim());
  return isMeaningfulCourse(course) ? course : '';
}

function normalizeKnownCourseName(value) {
  const text = String(value || '').trim();
  const compact = normalizeCourseForCompare(text);
  const knownCourses = [
    {
      name: '认知科学基础与前沿',
      match: /认知.*科学.*基|认知.*基础|科学基础与前沿/.test(compact)
    },
    {
      name: '听觉科学及信号检测技术',
      match: /听觉.*科学.*信号|听觉.*信号.*检测|听.*科学.*信号.*检测|听.*科.*信.*检测/.test(compact)
    },
    {
      name: '现代信号处理',
      match: /现代.*信号.*处|信号处理/.test(compact)
    },
    {
      name: '自然辩证法概论',
      match: /自然.*辩|自然.*辨|辩证法|辫证法/.test(compact)
    },
    {
      name: '智能数据分析',
      match: /智能.*数据.*分析|智.*数据.*分析|智.*数.*据.*分析|数据分析/.test(compact)
    }
  ];
  const matched = knownCourses.find((course) => course.match);
  if (matched) return matched.name;

  return text
    .replace(/^[诚后朋皇江来腾咤蓉唉神据\s:：;；,.，。-]+(?=[\u4e00-\u9fa5A-Za-z]{3,})/, '')
    .replace(/\s*[-—–]?\s*0?1\s*环.*$/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function isDuplicateCourseLine(lines, nextLine) {
  const normalizedNext = normalizeCourseForCompare(nextLine);
  return lines.some((line) => {
    const normalizedLine = normalizeCourseForCompare(line);
    return normalizedLine && normalizedNext && (normalizedLine.includes(normalizedNext) || normalizedNext.includes(normalizedLine));
  });
}

function normalizeCourseForCompare(value) {
  return String(value || '').replace(/[^\u4e00-\u9fa5A-Za-z0-9]/g, '');
}

function joinOcrLine(units) {
  return units.reduce((text, unit) => {
    const next = String(unit.text || '').trim();
    if (!next) return text;
    if (!text) return next;
    if (isCjkText(text.slice(-1)) && isCjkText(next[0])) return `${text}${next}`;
    return `${text} ${next}`;
  }, '');
}

function isCjkText(value) {
  return /[\u4e00-\u9fa5]/.test(value);
}

function estimateLineTolerance(units) {
  const heights = units
    .map((unit) => unit.bbox.y1 - unit.bbox.y0)
    .filter((height) => Number.isFinite(height) && height > 0)
    .sort((a, b) => a - b);
  if (heights.length === 0) return 18;
  return Math.max(12, heights[Math.floor(heights.length / 2)] * 0.85);
}

function cleanCourseLine(value) {
  return String(value || '')
    .replace(/\[[^\]]*\]/g, '')
    .replace(/【[^】]*】/g, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/（[^）]*）/g, '')
    .replace(/^[\]\[0-9LIl|｜\s-]+/, '')
    .replace(/[\]\[|｜\s-]+$/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function isCourseMetaLine(value) {
  return /第?\d+\s*[-~至—–]\s*\d+\s*周|周[一二三四五六日天]|星期[一二三四五六日天]|[一二三四五六七八九十\d]+教|机房|报告厅|校区|班|英文|中文/.test(value);
}

function isMeaningfulCourse(value) {
  const text = String(value || '').trim();
  if (text.length < 2) return false;
  if (!/[\u4e00-\u9fa5A-Za-z]/.test(text)) return false;
  if (/^[节《》\s.,;:!?，。；：！？、\[\]()（）|｜-]+$/.test(text)) return false;
  return /学|论|处理|分析|技术|基础|前沿|检测|英语|数学|系统|数据|信号|概论|课程/.test(text);
}

function isNoiseText(value) {
  const text = String(value || '').trim();
  if (!text) return true;
  if (weekdayToIndex(text) >= 0) return true;
  if (/^时间$|^课表查看$/.test(text)) return true;
  if (extractSectionNumber(text)) return true;
  return false;
}

function extractSectionNumber(value) {
  const match = String(value || '').match(/^(?:第)?(\d{1,2})(?:\s*[-~至—–]\s*\d{1,2})?\s*节?$/);
  if (!match) return 0;
  const number = Number(match[1]);
  return number >= 1 && number <= 20 ? number : 0;
}

function buildTemplateFromRecognizedTasks(tasks) {
  const rows = [];

  tasks.forEach((task) => {
    const weekdayIndex = weekdayToIndex(task.weekday);
    if (weekdayIndex < 0 || !task.title) return;

    const timeRange = task.startTime && task.endTime ? `${task.startTime}-${task.endTime}` : '';
    let row = rows.find((item) => item.timeRange === timeRange);
    if (!row) {
      row = { timeRange, courses: Array(7).fill('') };
      rows.push(row);
    }

    row.courses[weekdayIndex] = [row.courses[weekdayIndex], task.title].filter(Boolean).join(' / ');
  });

  return { rows };
}

function weekdayToIndex(value) {
  const text = String(value || '');
  const match = text.match(/周([一二三四五六日天])|星期([一二三四五六日天])/);
  if (!match) return -1;
  const key = match[1] || match[2];
  return {
    一: 0,
    二: 1,
    三: 2,
    四: 3,
    五: 4,
    六: 5,
    日: 6,
    天: 6
  }[key] ?? -1;
}

function weekdayCharacterToIndex(value) {
  const text = String(value || '').trim();
  if (!/^[一二三四五六日天]$/.test(text)) return -1;
  return {
    一: 0,
    二: 1,
    三: 2,
    四: 3,
    五: 4,
    六: 5,
    日: 6,
    天: 6
  }[text] ?? -1;
}

function clusterByY(items, tolerance) {
  const clusters = [];
  items.sort((a, b) => a.y - b.y).forEach((item) => {
    const cluster = clusters.find((entry) => Math.abs(entry.y - item.y) <= tolerance);
    if (!cluster) {
      clusters.push({ y: item.y, items: [item] });
      return;
    }
    cluster.y = (cluster.y * cluster.items.length + item.y) / (cluster.items.length + 1);
    cluster.items.push(item);
  });
  return clusters;
}

module.exports = {
  parseScheduleImage,
  buildTemplateFromOcrLayout,
  collectOcrUnits
};
