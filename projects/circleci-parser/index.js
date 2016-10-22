var Promise = require('bluebird');
var fetch = require('node-fetch');

fetch.Promise = Promise;

var CIRCLECI_HOST = 'https://circleci.com';
var CIRCLECI_API = '/api/v1.1';
var CIRCLECI_TKN = '3cf9ee04d9963bea7fe93a8350bd0a54cb1802f5'; // TODO: move it to openshift param

var STATUS = {
  RUNNING: 'running',
  FIXED: 'fixed',
  SUCCESS: 'success',
  FAILED: 'failed',
  CANCELED: 'canceled',
};

var RESULT = {
  GOOD: 'grn',
  UNKNOWN: 'yel',
  BAD: 'red'
};

function getStatusResult(build) {
  var statusResult = '';

  if (build && build.status) {
    if (build.status === STATUS.RUNNING) {
      statusResult = RESULT.UNKNOWN;
    } else if (build.status === STATUS.SUCCESS || build.status === STATUS.FIXED) {
      statusResult = RESULT.GOOD;
    } else if (build.status === STATUS.FAILED || build.status === STATUS.CANCELED) {
      statusResult = RESULT.BAD;
    }
  }

  return statusResult;
}

module.exports = function addCircleCIParser (app) {
  app.get('/circleci/:project', function (req, res) {
    var projectName = req.params.project;

    if (projectName) {
      var circleciUrl = CIRCLECI_HOST + CIRCLECI_API + '/project/github/dailybeast/' + projectName + '?circle-token=' + CIRCLECI_TKN;

      fetch(circleciUrl)
        .then(function (res) {
          return res.json();
        })
        .then(function (json) {
          if (json && json.length > 0) {
            var lastBuild = json[0];
            var statusResult = getStatusResult(lastBuild);
            res.json(statusResult);
          } else {
            res.status(500).send('Server Error: empty response from CI');
          }
        });
    } else {
      res.status(400).send('Need project name to proceed!');
    }
  });
};