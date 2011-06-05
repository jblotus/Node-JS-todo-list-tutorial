var view = require('./view');

var controller = function() {};

controller.prototype = {

  home : function() {
    var data = {
      'users' : {
        'name'    : 'James',
        'viewLink': '/view/james/'
      },
      'test'  : 123
    };
    view.renderView('home', data);
  },

  view : function(user) {
      var data = {
       'user' : user ? user : 'nobody'
      };
      view.renderView('view', data);
  }
};

module.exports = new controller();