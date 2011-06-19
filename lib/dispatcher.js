//node filesystem module
var fs               = require('fs');
var url              = require('url');
var controller       = require('./controller');
var response_handler = require('./response_handler');
var simple_auth      = require('./simple_auth');
var session          = require('./session');

this.dispatch = function(req, res) {
  //set up response object
  responseHandler = new response_handler(res);

  var requestedUrl = url.parse(req.url);
  var parts, action, argument;

  if (requestedUrl.pathname == '/') {
    action = 'home';
  } else {
    parts    = req.url.split('/');
    action   = parts[1];
    argument = parts[2];
  }

  var authorize = function(controller, action, argument) {
    //only executing registered actions
    if (typeof controller[action] === 'function') {
      try {
        //check to see if we need auth
        var authorized = controller._isAuthorized(action);

        if (!authorized) {
          //try and authorize
          responseHandler.requestAuth(req, execute(controller, action, argument));
        } else {
          execute(controller, action, argument);
        }

      } catch (error) {
        console.log(error);
      }
    } else {
      responseHandler.renderWebroot(requestedUrl);
    }
  };

  var execute = function(controller, action, argument) {

    controller[action](argument, function(content) {

      if (content) {
        responseHandler.renderHtml(content);
      } else {
        responseHandler.serverError(404);
      }
    });
  };

  var appController = new controller();
  appController.data.session = new session(req, res, authorize(appController, action, argument));
};