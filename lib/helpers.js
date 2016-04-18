'use strict';


const escape = require('html-escape');


module.exports = {
  $string: toString,
  $escape: escapeHtml,
  $each: each
};


function toString(value) {
  if (value === null || value === undefined) {
    return '';
  }

  const type = typeof value;
  return type === 'string' ? value :
      type === 'function' ? toString(value()) : String(value);
}


function escapeHtml(value) {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value.toHTML === 'function') {
    return value.toHTML();
  }

  const type = typeof value;
  return type === 'string' ? escape(value) :
    type === 'function' ? escapeHtml(value()) : escape(String(value));
}


function each(data, fn) {
  if (!data) {
    return;
  }

  if (Array.isArray(data)) {
    for (let i = 0, len = data.length; i < len; i++) {
      fn(data[i], i, data);
    }
  } else {
    for (const k in data) {
      fn(data[k], k, data);
    }
  }
}
