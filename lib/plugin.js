'use strict';


module.exports = function(app) {
  const settings = app.settings;
  const engine = require('./index');

  const opts = Object.assign({
    debug: settings.development
  }, settings.arttemplate);

  engine.config(opts);

  app.addEngine('art', require('./index'));
};
