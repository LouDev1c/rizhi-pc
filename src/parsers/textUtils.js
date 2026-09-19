'use strict';

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

module.exports = { collapseRepeatedText };
