var fs = require('fs');
var Rx = require('rx');
var request = require('request');
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
    
      var results = body.results;

      Rx.Observable
      .from(results)
      .flatMap(function (result) {
        return Rx.Observable.create(function (observer) {

          request(result.instrument, function (error, ajaxResponse, ajaxBody) {

            if (error) {
              console.error(error);
              process.exit(1);
            }

            result.symbol = ajaxResponse.symbol;

            observer.onNext(result);
            observer.onCompleted();
            
          });

        });
      })
      .subscribe(function onCompleted(event) {

        fs.writeFileSync('./raw_robinhood_data.json', JSON.stringify(event, null, 4));

        parseData(event);

      });
    });

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

    console.log('👉 Mic drop! 🎤');
  });
}