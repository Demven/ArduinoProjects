var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var addCircleCIParser = require('./projects/circleci-parser');

var app = express();

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 4000);
app.set('ip-address', process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

addCircleCIParser(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.listen(app.get('port'), app.get('ip-address'), () => {
  global.console.info(`Server started on ${app.get('ip-address')}: ${app.get('port')}`);
});
