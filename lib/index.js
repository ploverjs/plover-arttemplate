'use strict';


const arttemplate = require('art-template-for-plover');
const utils = require('./utils');


Object.assign(arttemplate.utils, utils);
arttemplate.onerror = function(e) {
  throw e;
};


class Engine {
  constructor(config) {
    config = config || {};

    this.development = config.development;
    this.async = config.async;
    this.compress = config.compress;
    this.config = config;
    const helpers = config.helpers || {};
    for (const name in helpers) {
      arttemplate.helper(name, helpers[name]);
    }
  }


  compile(source, options) {
    options = options || {};

    const opts = Object.assign({
      filename: options.path,
      inspect: this.async
    }, this.config)
    const render = arttemplate.compile(source, opts);
    return function(context) {
      return render(context, options.path);
    };
  }
}


module.exports = Engine;

