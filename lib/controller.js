var view        = require('./view');

var controller = function() {
};

controller.prototype = {

  data : {
    'session' : {}
  },

  _auth_actions: {
    'deny' : ['edit']
  },

  _isAuthorized : function(action) {
    var self   = this;
    var denied = self._auth_actions['deny'];

    if (denied) {

      for (i = 0; i < denied.length; i++) {
        if (denied[i] === action) {
          return false;
        }
      }
    }

    return true;
  },

  home : function(arg, callback) {

    var callback = (typeof callback === 'function') ? callback : function() {};

    var data = {
      'users' : {
        'name'    : 'James',
        'viewLink': '/view/james/'
      }
    };

    view.renderView('home', data, function(data) {
      callback(data);
    });
  },

  edit: function(user, callback) {
    var callback = (typeof callback === 'function') ? callback : function() {};

    var data = {
     'user' : user ? user : 'nobody'
    };

    view.renderView('edit', data, function(data) {
      callback(data);
    });
  },

  view : function(user, callback) {
    var callback = (typeof callback === 'function') ? callback : function() {};

    var data = {
     'user' : user ? user : 'nobody'
    };

    view.renderView('view', data, function(data) {
      callback(data);
    });
  }
};

module.exports = controller;