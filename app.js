var Robinhood = require('robinhood');
var CONFIG = require('./config.json');

var robinhood = Robinhood({
    username: CONFIG.username,
    password: CONFIG.password
  }, function handleAuthentication() {

    robinhood.orders(function handleResponse(error, response, body) {
      if (error) {
        console.error(error);
        process.exit(1);
      }

      console.log(body);
    });

  });