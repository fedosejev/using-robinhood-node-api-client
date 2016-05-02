var fs = require('fs');
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

      fs.writeFileSync('./raw_robinhood_data.json', body);

      parseData(body.results);
  }
);

function convertObjectToCsv(object) {
  return Object.keys(object)
    .filter(function (key) {
      return key !== 'executions';
    })
    .map(function (key) {
      return object[key];
    })
    .join(',');
}

function convertObjectsToCsv(objects) {
  return objects.map(convertObjectToCsv).join('\n');
}

function parseData(data) {
  var csv = Object.keys(data[0])
                  .filter(function (object) {
                    return object !== 'executions';
                  })
                  .join(',');

  csv = csv + '\n' + convertObjectsToCsv(data);

  fs.writeFile('./robinhood_data.csv', csv, function (error) {
    if (error) {
      console.error(error);
      return;
    }

    console.log('All done!');
  });
}