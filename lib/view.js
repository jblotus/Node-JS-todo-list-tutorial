//node filesystem module
var fs = require('fs');
var Mustache = require('Mustache');
var response_handler = require('./response_handler');

var view = function() {};

view.prototype = {

  renderView : function(name, data) {
    var self = this;

    self.getView(name, 'html', function(content) {
      var template = Mustache.to_html(content, data);

      self.getLayout({}, function(content) {
        // lets make some default content
        content = self.setLayoutContent(content, template);
        response_handler.renderHtml(content);
      });
    });
  },

  getView : function(name, format, callback) {
    var self = this;

    if (!name) {
      return '';
    }

    var format = format ? format : 'html';
    var path = './app/views/actions/' + name + '.' + format + '.js';

    // callback handling
    var callback = (typeof callback === 'function') ? callback : function() {
    };

    fs.readFile(path, 'utf-8', function(error, content) {
      console.log('reading view file: ' + path);
      if (error) {
        response_handler.serverError(404, 'View Not Found');
      } else {
        console.log('executing callback');
        callback(content);
      }
    });
  },

  setLayoutContent : function(layout, content) {
    var self = this;
    var layout = layout ? layout : '';
    var context = {
      'content_for_layout' : content ? content : ''
    };
    return Mustache.to_html(layout, context);
  },

  getLayout : function(options, callback) {
    var self = this;
    var options = options ? options : {
      'name' : 'default',
      'format' : 'html'
    };
    var name = options.name ? options.name : 'default';
    var format = options.format ? options.format : 'html';

    // callback handling
    var callback = (typeof callback === 'function') ? callback : function() {
    };

    var path = './app/views/layouts/' + name + '.' + format + '.js';
    console.log('trying to read file: ' + path);
    fs.readFile(path, 'utf-8', function(error, content) {
      if (error) {
        response_handler.serverError(500);
      } else {
        callback(content);
      }
    });
  }
};

module.exports = new view();