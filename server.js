//include our modules
var sys  = require('sys');
var http = require('http');

//require custom dispatcher
var dispatcher = require('./lib/dispatcher.js');

http.createServer(function (req, res) {
  //wrap calls in a try catch or the node js server will crash upon any code errors
  try {
    dispatcher.dispatch(req, res); 
    
  } catch (err) {
    sys.puts(err);
    res.writeHead(500);
    res.end('Internal Server Error');
  }  
   
}).listen(1337, "127.0.0.1");

console.log('Server running at http://127.0.0.1:1337/');