'use strict';


const is = require('is-type-of');
const arttemplate = require('art-template-for-plover');
const utils = require('./utils');


Object.assign(arttemplate.utils, utils);
arttemplate.onerror = function(e) {
  throw e;
};


class Engine {
  constructor(config) {
    this.config = config || {};
    this.async = this.config.async;
  }


  compile(source, options) {
    options = options || {};
    const config = this.config;

    const opts = {
      filename: options.path,
      inspect: this.async,
      debug: config.development,
      compress: config.compress
    };

    const render = arttemplate.compile(source, opts);
    if (!this.async) {
      return function(context) {
        return render(context, opts.path);
      };
    }

    return function* (context) {
      let result = render(context, opts.path);
      if (is.promise(result)) {
        result = yield result;
      }
      return result;
    };
  }
}


module.exports = Engine;

