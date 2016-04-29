var Robinhood = require('robinhood');
var CONFIG = require('./config.json');

Robinhood({
  username: CONFIG.username,
  password: CONFIG.password
}).orders(function handleResponse(error, response, body) {
    if (error) {
        console.error(error);
        process.exit(1);
    }

    console.log(body);
});