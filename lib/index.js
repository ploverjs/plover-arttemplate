'use strict';


const is = require('is-type-of');
const arttemplate = require('art-template-for-plover');
const utils = require('./utils');


// 标识支持Promise渲染
exports.async = true;


const config = {};
exports.config = function(opts) {
  Object.assign(config, opts);
};


Object.assign(arttemplate.utils, utils);
arttemplate.onerror = function(e) {
  throw e;
};


exports.compile = function(source, opts) {
  opts = opts || {};

  const options = Object.assign({
    filename: opts.path,
    inspect: true,
    debug: opts.development
  }, config);

  const render = arttemplate.compile(source, options);
  return function* (context) {
    let result = render(context, opts.path);
    if (is.promise(result)) {
      result = yield result;
    }
    return result;
  };
};
