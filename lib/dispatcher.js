//node filesystem module
var fs = require('fs');
//part 3
var url = require('url');

var Mustache = require('Mustache');

this.dispatch = function(req, res) {

  var requestedUrl = url.parse(req.url);

  //some private methods
  var serverError = function(code, content) {
    res.writeHead(code, {'Content-Type': 'text/plain'});
    res.end(content);
  }
  
  var actions = {
  'home' : function() {
    var data = {
      'users' : {
        'name'    : 'James',
        'viewLink': '/view/james/'       
      },
      'test'  : 123
    } 
    renderView('home', data);  
  },
  
  'view' : function(user) {
      var data = {
       'user' : user ? user : 'nobody'
      }  
      renderView('view', data);
    }  
  }

  var renderView = function(name, data) {
     getView(name, 'html',  function(content) {
      var view = Mustache.to_html(content, data);
      
      getLayout({}, function(content) {              
        //lets make some default content
        content = setLayoutContent(content, view);
        renderHtml(content);
      }); 
    });
  }

  var getView = function(name, format, callback) {  
    console.log('getting view file');
    if (!name) return '';  
    var format = format ? format : 'html';  
    var path = './app/views/actions/' + name + '.' + format + '.js'; 
    
    //callback handling
    var callback = (typeof callback === 'function') ? callback : function() {};  
    
    fs.readFile(path, 'utf-8', function(error, content) {
      console.log('reading view file: ' + path);
        if (error) {
          serverError(404, 'View Not Found');
        } else {    
          console.log('executing callback');       
          callback(content);
        }   
    });
  }  
  
  var setLayoutContent = function(layout, content) {
    var layout  = layout ? layout : '';
    var context = {
      'content_for_layout' : content ? content : ''
    }    
    return Mustache.to_html(layout, context);
  }
  
  var getLayout = function(options, callback) {  
    
    var options = options ? options : { 'name' : 'default', 'format' : 'html' };  
    var name   = options.name   ? options.name   : 'default';
    var format = options.format ? options.format : 'html' ;
    
    //callback handling
    var callback = (typeof callback === 'function') ? callback : function() {};  
    
    var path = './app/views/layouts/' + name + '.' + format + '.js';
    console.log('trying to read file: ' + path);
    fs.readFile(path, 'utf-8', function(error, content) {
        if (error) {
          serverError(500);
        } else {           
          callback(content);
        }   
    });
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
  
  console.log(requestedUrl);
  
  (function() {
    var parts, action, argument;
    
    if (requestedUrl.pathname == '/') {
      action = 'home';
    } else {
      parts    = req.url.split('/');  
      action   = parts[1];
      argument = parts[2];   
    }
    
    //only executing registered actions
    if (typeof actions[action] == 'function') {      
      console.log('executing ' + action);      
      actions[action](argument);
    } else {
      renderWebroot(requestedUrl);
    }
  })() 
}