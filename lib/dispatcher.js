//node filesystem module
var fs = require('fs');

var actions = {
  'view' : function(user) {
    return '<h1>Todos for ' + user + '</h1>';
  }  
}

this.dispatch = function(req, res) {

  //some private methods
  var serverError = function(code, content) {
    res.writeHead(code, {'Content-Type': 'text/plain'});
    res.end(content);
  }
    
  var renderHtml = function(content) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(content, 'utf-8');
  }
  
  if (req.url == "/") {
    fs.readFile('./templates/index.html', function(error, content) {      
      if (error) {
        serverError(500);
      } else {
        renderHtml(content);
      }
    });
    
  } else {  
    var parts    = req.url.split('/');  
    var action   = parts[1];
    var argument = parts[2];
    
    if (typeof actions[action] == 'function') {
      var content = actions[action](argument);
      renderHtml(content);
    } else {   
      serverError(404, '404 Bad Request');
    }  
  }
}