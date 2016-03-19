(function() {
  var app, express, home, request;

  express = require('express');

  request = require('request');

  app = module.exports = express();

  app.set('views', __dirname + '/dist');
  app.use(express["static"](__dirname + '/dist'));

  home = function(req, res) {
    return res.render('index.html');
  };

  app.get('/', home);

  app.listen(process.env.PORT || 4000);

}).call(this);
