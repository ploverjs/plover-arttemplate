const pathUtil = require('path');
const mm = require('plover-test-mate');


describe('plugin', () => {
  const app = mm({
    applicationRoot: pathUtil.join(__dirname, 'fixtures/app'),
    expectRoot: pathUtil.join(__dirname, 'fixtures/expect'),
    arttemplate: {
      compress: true,
      async: false
    }
  });

  app.install(require('../lib/plugin'));
  app.it('/', 'index.html');
});
