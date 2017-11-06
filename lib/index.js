const arttemplate = require('art-template-for-plover');
const utils = require('./utils');


Object.assign(arttemplate.utils, utils);
arttemplate.onerror = function(e) {
  throw e;
};


class Engine {
  constructor(config) {
    config = config || {};
    this.config = config;
    this.development = config.development;
    this.async = config.async;
    this.compress = config.compress;

    const helpers = config.helpers || {};
    for (const name in helpers) {
      arttemplate.helper(name, helpers[name]);
    }
  }


  compile(source, options) {
    options = options || {};

    const opts = Object.assign({
      filename: options.path,
      inspect: this.async,
      debug: this.development
    }, this.config);
    opts.beforeCompile && (source = opts.beforeCompile(source, opts));
    const render = arttemplate.compile(source, opts);
    return function(context) {
      return render(context, options.path);
    };
  }
}


module.exports = Engine;

