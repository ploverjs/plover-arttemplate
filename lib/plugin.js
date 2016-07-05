'use strict';


module.exports = function(app) {
  const settings = app.settings;
  const engine = require('./index');

  engine.config(settings.arttemplate);
  app.addEngine('art', require('./index'));
};
