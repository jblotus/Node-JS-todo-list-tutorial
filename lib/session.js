var fs = require('fs');

var session = function(req, res, callback) {

  var self    = this;
  self.req    = req || {};
  self.res    = res || {};
  var cookie  = req.headers.cookie;
  var session = self.findSessionDataByCookie(cookie, callback);

  var checkSession = function() {

    if (!session) {
      res.setHeader('Set-Cookie', 'SID=assdfsdfda123123sdasw123');
    }

    if (typeof callback === 'function') callback();
  };

  checkSession();

};

session.prototype = {
  req: {},
  res: {},
  data: {},
  findSessionDataByCookie: function(cookie, callback) {
    console.log('Finding Session Data');
    var self = this;
    var re   = /SID=(.+[^\s,;])/;
    var sid  = re.exec(cookie)[1];
    console.log(cookie)
    if (sid) {
      self.readSessionFromDisk(sid, callback);
    }
  },

  readSessionFromDisk: function(sid, callback) {
    var self = this;
    console.log('Finding Session Data')
    console.log(sid);
    var path = './tmp/sessions/' + sid;
    //look for session in sessions dir
    fs.readFile(path, 'utf-8', function(error, data) {
      if (error) {
        //lets create a new session
        var json = JSON.stringify({ 'id' : sid, 'my' : 'session' });

        self.writeSessionToDisk(path, json, function() {
          self.data = data;
          callback();
        });
      } else {
        self.data = data;
        callback();
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

