var fs     = require('fs');
var crypto = require('crypto');

var session = function(req, res, callback) {

  var self    = this;
  self.req    = req || {};
  self.res    = res || {};
  var cookie  = req.headers.cookie;

  if (!cookie) {
    var seed   = Math.floor(Math.random()* 123456789) + '';
    var md5sum = crypto.createHash('md5').update(seed).digest('hex');

    console.log(md5sum);
    res.setHeader('Set-Cookie', 'SID=' + md5sum + '; expires=Tue, 15-Jan-2013 21:47:38 GMT; path=/; httponly;');
  }
  var session = self.findSessionDataByCookie(cookie, callback);
};

session.prototype = {
  req: {},
  res: {},
  data: {},
  findSessionDataByCookie: function(cookie, callback) {
    console.log('Finding Session Data');
    console.log('Cookie: ' + cookie);
    var self = this;
    var re   = /SID=(.+[^\s,;])/;
    var sid  = re.exec(cookie);
    if (sid && (sid[1] !== null)) {
      console.log('Trying to load session with id: ' + sid[1]);
      self.readSessionFromDisk(sid[1], callback);
    }
  },

  readSessionFromDisk: function(sid, callback) {
    var self = this;
    var path = './tmp/sessions/' + sid;
    //look for session in sessions dir
    fs.readFile(path, 'utf-8', function(error, data) {

      if (error) {
        //lets create a new session
        var json = JSON.stringify({ 'id' : sid, 'my' : 'session' });

        self.writeSessionToDisk(path, json, function() {
          console.log('Writing session to disk');
          self.data = data;

          if (typeof callback === 'function') callback();

        });
      } else {
        self.data = JSON.parse(data);
        console.log('Reading session from disk');
        if (typeof callback === 'function') callback(data);
      }
    });
  },

  writeSessionToDisk: function(path, data, callback) {
    var self = this;
    fs.writeFile(path, data, function (error) {
      if (error) {
        throw error;
      } else {
        callback();
      }
    });
  }
};

module.exports = session;

