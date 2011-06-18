// in other modules
var sys  = require('sys');
var http = require('http');
var url  = require('url');

//require custom dispatcher
var dispatcher = require('./lib/dispatcher.js');

console.log('Starting server @ http://127.0.0.1:1337/');
zxc
http.createServer(function (req, res) {
  //wrap calls in a try catch or the node js server will crash upon any code errors
  try {asd
    //pipe some details to the node console
    console.log('Incoming Request from: ' + req.connection.remoteAddress + ' for href: ' + url.parse(req.url).href);

    //dispatch our request
    dispatcher.dispatch(req, res);

  } catch (err) {
    //handle errors gracefully
    sys.puts(err);
    res.writeHead(500);
    res.end('Internal Server Error');
  }

}).listen(1337, "127.0.0.1", function() {
  //runs when our server is created
  console.log('Server running at http://127.0.0.1:1337/');
});

//uncaught execptions that can take down your server
process.on('uncaughtException', function (err) {
  console.error('there be errors here: ' + err);
  console.log("Node NOT Exiting...");
});