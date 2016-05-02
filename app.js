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

      // var results = [
      //   {
      //     test: 1,
      //     instrument: 'https://api.robinhood.com/instruments/438867e8-77aa-4bce-b342-46d2f1620223/'
      //   },
      //   {
      //     test: 2,
      //     instrument: 'https://api.robinhood.com/instruments/438867e8-77aa-4bce-b342-46d2f1620223/'
      //   }
      // ];

      Rx.Observable
      .from(results)
      .flatMap(function (result) {
        return Rx.Observable.create(function (observer) {

          request(result.instrument, function (error, ajaxResponse, ajaxBody) {

            if (error) {
              observer.onError(error);
            }

            try {
              result.symbol = JSON.parse(ajaxBody).symbol;
            } catch (error) {
              observer.onError(error);
            }

            observer.onNext(result);
            observer.onCompleted();

          });

        });
      })
      .toArray()
      .subscribe(
        function onCompleted(event) {

          fs.writeFileSync('./results/raw_robinhood_data.json', JSON.stringify(event, null, 4));

          parseData(event);

        }
      );
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

  fs.writeFile('./results/robinhood_data.csv', csv, function (error) {
    if (error) {
      console.error(error);
      return;
    }

    console.log('👉 🎤  Mic drop! ');
  });
}