var fs = require('fs');
var Rx = require('rx');
var request = require('request');
var prompt = require('prompt');
var Robinhood = require('robinhood');

var config;

readConfigFile(getData);

function readConfigFile(done) {
  fs.readFile('./config.json', 'utf8', function (error, data) {
    if (error) {
      askForUsernameAndPassword(done);
      return;
    }

    data = JSON.parse(data);

    config = {
      username: data.username,
      password: data.password
    };

    done();

  });
}

function askForUsernameAndPassword(done) {

  var schema = {
    properties: {
      username: {
        message: 'Your Robinhood username',
        required: true
      },
      password: {
        message: 'Your Robinhood password',
        required: true,
        hidden: true
      }
    }
  };

  console.log('🔑  Please enter your Robinhood username and password.');

  prompt.message = '';
  prompt.start();
  prompt.get(schema, function (error, result) {

    config = {
      username: result.username,
      password: result.password
    };

    done();
  });
}

function getData() {

  console.log('🔥  Working...');

  var robinhood = Robinhood({
      username: config.username,
      password: config.password
    }, function handleAuthentication() {

      robinhood.orders(function handleResponse(error, response, body) {
        if (error) {
          console.error(error);
          process.exit(1);
        }
      
        var results = body.results;

        var results = [
          {
            test: 1,
            instrument: 'https://api.robinhood.com/instruments/438867e8-77aa-4bce-b342-46d2f1620223/'
          },
          {
            test: 2,
            instrument: 'https://api.robinhood.com/instruments/438867e8-77aa-4bce-b342-46d2f1620223/'
          }
        ];

        Rx.Observable
        .from(results)
        .flatMap(getSymbol)
        .toArray()
        .subscribe(parseData);
      });

    }
  );
}

function getSymbol(trade) {
  return Rx.Observable.create(function (observer) {

    request(trade.instrument, function (error, ajaxResponse, ajaxBody) {

      if (error) {
        observer.onError(error);
      }

      try {
        trade.symbol = JSON.parse(ajaxBody).symbol;
      } catch (error) {
        observer.onError(error);
      }

      observer.onNext(trade);
      observer.onCompleted();

    });

  });
}

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

  fs.writeFileSync('./results/raw_robinhood_data.json', JSON.stringify(data, null, 4));

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

    console.log('👉  Success! Your CSV file is in here: ' + __dirname + '/results/robinhood_data.csv');
  });
}