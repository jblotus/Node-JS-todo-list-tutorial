//node filesystem module
var fs               = require('fs');
var url              = require('url');
var controller       = require('./controller');
var view             = require('./view');
var response_handler = require('./response_handler');

this.dispatch = function(req, res) {

  var requestedUrl = url.parse(req.url);

  //set up response object
  response_handler.res = res;

  console.log(requestedUrl);
  var parts, action, argument;

  if (requestedUrl.pathname == '/') {
    action = 'home';
  } else {
    parts    = req.url.split('/');
    action   = parts[1];
    argument = parts[2];
  }

  //only executing registered actions
  if (typeof controller[action] == 'function') {
    console.log('executing ' + action);
    controller[action](argument);
  } else {
    response_handler.renderWebroot(requestedUrl);
  }
};