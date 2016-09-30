'use strict';


const pathUtil = require('path');
const fs = require('fs');
const is = require('is-type-of');
const escapeHtml = require('escape-html');
const arttemplate = require('art-template-for-plover');
const assign = require('plover-util/lib/assign');
const utils = require('./utils');

const debug = require('debug')('plover-arttemplate');


assign(arttemplate.utils, utils);
arttemplate.onerror = function(e) {
  throw e;
};


class Engine {
  constructor(config, app) {
    config = config || {};
    app = app || {};

    const settings = app.settings || {};

    this.development = settings.development;
    this.async = config.async;
    this.compress = config.compress;
    this.disableAutowire = (settings.assets || {}).disableAutowire;

    this.utils = assign({
      $include: this.include.bind(this)
    }, utils);

    this.renderCache = new Map();
    this.moduleResolver = app.moduleResolver;
  }


  compile(source, options) {
    options = options || {};

    const path = options.path;
    const render = this.compileTpl(source, path);

    if (!this.async) {
      return function(context) {
        return render(context, path);
      };
    }

    return function* (context) {
      let result = render(context, path);
      if (is.promise(result)) {
        result = yield result;
      }
      return result;
    };
  }


  include(name, data, ctx) {
    if (name.indexOf(':') !== -1) {
      return ctx.data.app.control(name, data);
    }

    debug('include %s, %o', name, data);

    if (data) {
      data = assign(Object.create(ctx.data), data);
    } else {
      data = ctx.data;
    }

    const route = data.route;
    const info = this.moduleResolver.resolve(route.module);
    const view = info.views[name];
    if (!view) {
      return notFound(`${route.module}/${name}`, this.development);
      return '<div class="not-found"></div>';
    }

    if (!this.disableAutowire) {
      view.css && data.assets.css(view.css);
      view.js && data.assets.js(view.js);
    }

    const path = pathUtil.join(info.path, view.template);
    const render = this.compileTpl(null, path);
    return utils.$string(render(data, path), ctx);
  }


  compileTpl(source, path) {
    const renderCache = this.renderCache;
    let render = renderCache.get(path);
    if (render) {
      render;
    }

    const opts = {
      filename: path,
      inspect: this.async,
      debug: this.development,
      compress: this.compress,
      utils: this.utils
    };

    source = source || fs.readFileSync(path, 'utf-8');
    source = source.replace(/\{\{\s*=?\s*app\.control\(/g, '{{include(');
    render = arttemplate.compile(source, opts);
    renderCache.set(path, render);

    // 开发状态3秒缓存失效
    this.development && setTimeout(function() {
      renderCache.delete(path);
    }, 3000);

    return render;
  }
}


function notFound(url, development) {
  url = escapeHtml(url);
  const content = development ?
`<h2 style="color: red; border: 1px dotted #f00; margin: 2px; padding: 5px 10px;">
  Not Found: ${url}
</h2>` :
`<div class="plover-not-found" style="display: none" data-url="${url}"></div>`;
  return content;
}


module.exports = Engine;

