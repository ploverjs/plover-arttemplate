'use strict';


const pathUtil = require('path');
const fs = require('fs');
const arttemplate = require('art-template-for-plover');

const helpers = require('./helpers');
Object.assign(arttemplate.utils, helpers);


arttemplate.onerror = function(e) {
  throw e;
};


exports.compile = function(source, opts) {
  opts = opts || {};
  const debug = opts.development;

  let code = arttemplate.compile(source).toString();
  code = 'return (' + code + ').apply(this, arguments)';
  let fn = new Function('$data', code);  // eslint-disable-line

  if (debug && opts.path) {
    let path = pathUtil.join(pathUtil.dirname(opts.path),
        '.' + pathUtil.basename(opts.path) + '.js');
    const body = 'module.exports = ' + fn.toString();
    fs.writeFileSync(path, body);

    path = require.resolve(path);
    delete require.cache[path];
    fn = require(path);
  }

  return function(context) {
    return String(fn.call(helpers, context));
  };
};
