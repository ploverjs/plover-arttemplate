'use strict';


module.exports = function(app) {
  app.addEngine('art', require('./index'));
};
