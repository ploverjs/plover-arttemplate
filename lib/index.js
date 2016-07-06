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
    this.async = true;
    // compatible with plover < 2.5.0 that does not support async engine
    if (this.config.async === false) {
      this.async = false;
    }
  }


  compile(source, opts) {
    opts = opts || {};

    const options = Object.assign({
      filename: opts.path,
      inspect: this.async,
      debug: opts.development
    }, this.config);

    const render = arttemplate.compile(source, options);
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

