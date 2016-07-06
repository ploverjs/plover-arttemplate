'use strict';


module.exports = function(app) {
  const settings = app.settings;
  const Engine = require('./index');

  const engine = new Engine(settings.arttemplate);
  app.addEngine('art', engine);
};
