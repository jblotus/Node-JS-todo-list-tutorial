var session = function(req, res, callback) {
  var self = this;
  self.req = req || {};
  self.res = res || {};
  var cookie = req.headers.cookie;

  if (cookie) {
      self.findSessionDataByCookie(cookie, callback);

  } else {
    res.setHeader('Set-Cookie', 'asdasdasw123');
  }

  if (typeof callback === 'function') callback();
};

session.prototype = {
  req: {},
  res: {},
  data: {},
  findSessionDataByCookie: function(cookie, callback) {
    if ('cookie' === 'asd') {
      self.data = {
        'someData' : 'goesIntoSession'
      };
      callback();
    }
  }
};

module.exports = session;