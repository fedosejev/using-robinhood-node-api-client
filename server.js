var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var engine = require('./engine');
var SERVER_CONFIG = require('./server.config.json');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Middleware that enables CORS
app.use(cors());

var router = express.Router();

router
  .route('/orders')
  .post(function (request, response) {

    console.log('POST /orders');

    var config = {
      username: request.body.username,
      password: request.body.password
    };

    engine.getOrders(config, function (orders) {
      response.status(200).json(orders);
    });
  });

app.use('/api/robinhood', router);

var server = app.listen(SERVER_CONFIG.port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Server listening at http://%s:%s', host, port);
});