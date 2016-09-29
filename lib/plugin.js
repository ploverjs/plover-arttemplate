'use strict';


module.exports = function(app) {
  const settings = app.settings;
  const Engine = require('./index');

  const opts = Object.assign({
    development: settings.development,
    async: true
  }, settings.arttemplate);

  const engine = new Engine(opts);
  app.addEngine('art', engine);
};
