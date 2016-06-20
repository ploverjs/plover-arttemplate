'use strict';


const arttemplate = require('art-template-for-plover');

const helpers = require('./helpers');
Object.assign(arttemplate.utils, helpers);


arttemplate.onerror = function(e) {
  throw e;
};


const config = {};

exports.config = function(opts) {
  Object.assign(config, opts);
};


exports.compile = function(source, opts) {
  opts = opts || {};

  const options = Object.assign({
    filename: opts.path
  }, config);

  const fn = arttemplate.compile(source, options);
  return function(context) {
    return String(fn.call(helpers, context, opts.path));
  };
};
