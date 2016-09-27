'use strict';


const pathUtil = require('path');
const fs = require('fs');
const is = require('is-type-of');
const assign = require('plover-util/lib/assign');
const SafeString = require('plover-util/lib/safe-string');
const arttemplate = require('art-template-for-plover');
const utils = require('./utils');


assign(arttemplate.utils, utils);
arttemplate.onerror = function(e) {
  throw e;
};


class Engine {
  constructor(config) {
    config = config || {};

    this.config = {
      development: config.development,
      compress: config.compress,
      // compatible with plover < 2.5.0 that does not support async engine
      async: config.async !== false
    };
  }


  compile(source, options) {
    const opts = assign({}, this.config, options);
    const render = compile(source, opts, new Map());

    if (!opts.async) {
      return render;
    }

    return function* (context) {
      let result = render(context);
      if (is.promise(result)) {
        result = yield result;
      }
      return result;
    };
  }
}


module.exports = Engine;



/*
 * 编译一个arttemplate
 *
 * @param {String} source - template
 * @param {Object} opts   - options
 * {
 *   path: {String}
 *   async: {Boolean}
 *   development: {Boolean}
 *   compress: {Boolean}
 * }
 * @return {Function}
 */
function compile(source, opts, controls) {
  const fn = arttemplate.compile(source, {
    filename: opts.path,
    inspect: opts.async,
    debug: opts.development,
    compress: opts.compress
  });

  return function(context) {
    context.$render = function(name, data) {
      const path = getPath(opts.path, name);
      let cfn = controls[path];
      if (!cfn) {
        const csource = fs.readFileSync(path, 'utf-8');
        const copts = assign({}, opts, {
          path: path
        });
        cfn = controls[path] = compile(csource, copts, controls);
      }

      let ctx = context;
      if (data) {
        ctx = assign(Object.create(ctx), data);
      }

      return toHtml(cfn(ctx));
    };

    return fn(context, opts.path);
  };
}


function getPath(rpath, name) {
  if (name.indexOf(':') === -1) {
    return pathUtil.join(pathUtil.dirname(rpath), name + '.art');
  }
  throw new Error('NotImplementError');
}


function toHtml(html) {
  if (html && typeof html.then === 'function') {
    return html.then(function(output) {
      return new SafeString(output);
    });
  }
  return new SafeString(html);
}
