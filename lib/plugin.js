module.exports = function(app) {
  const settings = app.settings;
  const Engine = require('./index');

  const config = Object.assign(
    {
      async: true,
      development: settings.development
    },
    settings.arttemplate
  );

  const engine = new Engine(config);
  const viewExt = config.viewExt || 'art';
  app.addEngine(viewExt, engine);
};
