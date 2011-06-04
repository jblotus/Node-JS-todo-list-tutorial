//node filesystem module
var fs = require('fs');
//part 3
var url = require('url');

var actions = {
  'view' : function(user) {
    return '<h1>Todos for ' + user + '</h1>';
  }  
}

this.dispatch = function(req, res) {
  
  var requestedUrl = url.parse(req.url);

  //some private methods
  var serverError = function(code, content) {
    res.writeHead(code, {'Content-Type': 'text/plain'});
    res.end(content);
  }
    
  var renderHtml = function(content) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(content, 'utf-8');
  }
  
  //part3...parsing headers based on file extension
  var getHeadersByFileExtension = function(extension) {
    
    var headers = {};
    
    switch (extension) {
      case 'css':
        headers['Content-Type'] = 'text/css';
        break;
      case 'js':
        headers['Content-Type'] = 'application/javascript';
        break;
      case 'ico':
        headers['Content-Type'] = 'image/x-icon';
      default:
        headers['Content-Type'] = 'text/plain'; 
   }
   
    return headers; 
  }
  
  //part3
  var renderWebroot = function(urlObject) {    
    //try and match a file in our webroot directory
    console.log('try to match in webroot: ' + urlObject.href);
    
    fs.readFile('./app/webroot' + req.url, function(error, content) {      
      if (error) {
        console.log('could not match file in /app/webroot: ' + req.url);
        serverError(404, '404 Bad Request');
      } else {
        console.log('matched file in app/webroot: ' + req.url);
        //part 3 load this file  
        var extension = (requestedUrl.pathname.split('.').pop());
        res.writeHead(200, getHeadersByFileExtension(extension));
        res.end(content, 'utf-8');
      }
    });
  }
  
  if (req.url == "/") {
    fs.readFile('./app/views/layouts/default.html.js', function(error, content) {      
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
      renderWebroot(requestedUrl);
    }  
  }
}