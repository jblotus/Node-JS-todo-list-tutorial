//include our modules
var sys  = require('sys');
var http = require('http');

//require custom dispatcher
var dispatcher = require('./lib/dispatcher.js');

http.createServer(function (req, res) {  
  dispatcher.dispatch(req, res);  
}).listen(1337, "127.0.0.1");

console.log('Server running at http://127.0.0.1:1337/');