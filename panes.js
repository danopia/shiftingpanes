$.PaneView = function (selector) {
  this.$dom = $($(selector)[0]);
  this.$dom.css({position: 'relative', 'overflow-x': 'visible'});
  this.stack = [];
  this.routes = {};
};

$.PaneView.prototype.makePane = function (path) {
  if (this.routes[path]) {
    return this.routes[path]();
  } else {
    var leaf = new $.PaneView.Pane('Error');
    leaf.text("404 Not Found error for " + path);
    return leaf;
  };
};

$.PaneView.prototype.last = function (offset) {
  return this.stack[this.stack.length - offset];
};

$.PaneView.prototype.pushPaneAfter = function (pane, parent) {
  while (this.stack.length && this.last(1) != parent && this.last(2) != parent) {
    this.popPane();
  };
  
  if (this.last(1) != parent) {
    this.last(1).$dom.animate({left: '100%', right: 0}); // TODO: and remove from DOM
    this.stack.pop();
  };
  
  this.pushPane(pane);
};

$.PaneView.prototype.pushPane = function (pane) {
  this.$dom.append(pane.$dom);
  this.stack.push(pane);
  pane.paneview = this;
  
  if (this.stack.length == 1) {
    this.last(1).$dom.animate({left: 0,   right: 0});
  } else if (this.stack.length >= 2) {
    this.last(1).$dom.animate({left: '20%', right: 0});
    this.last(2).$dom.animate({left: 0,   right: 0});
  };
  
  return pane;
};

$.PaneView.prototype.popPane = function () {
  if (this.stack.length == 1) {
    this.last(1).$dom.animate({left: '100%', right: 0}); // TODO: and remove from DOM
  } else if (this.stack.length == 2) {
    this.last(1).$dom.animate({left: '100%', right: 0}); // TODO: and remove from DOM
    this.last(2).$dom.animate({left: 0,   right: 0});
  } else if (this.stack.length >= 3) {
    this.last(1).$dom.animate({left: '100%', right: 0}); // TODO: and remove from DOM
    this.last(2).$dom.animate({left: '20%', right: 0});
  };
  
  this.stack.pop();
};


$.PaneView.Pane = function (title) {
  this.$dom = $('<section/>', {'class': 'pane'});
  this.$dom.css({position: 'absolute', left: '100%', right: 0, top: 0, bottom: 0, 'overflow-x': 'hidden'});
  
  this.title = title;
  this.$title = $('<h3/>', {text: title}).appendTo(this.$dom);
  
  this.$inner = $('<div/>').appendTo(this.$dom);
  //this.$inner.css({width: 600, 'overflow-x': 'hidden'});
};

$.PaneView.Pane.prototype.text = function (text) {
  this.$inner.text(text);
};


$.PaneView.NavPane = function (title) {
  this.$dom = $('<section/>', {'class': 'nav pane'});
  this.$dom.css({position: 'absolute', left: '100%', right: 0, top: 0, bottom: 0, 'overflow-x': 'hidden'});
  
  this.title = title;
  this.$title = $('<h3/>', {text: title}).appendTo(this.$dom);
  
  this.$inner = $('<div/>').appendTo(this.$dom);
  //this.$inner.css({width: 600, 'overflow-x': 'hidden'});
  
  this.$ul = $('<ul/>').appendTo(this.$inner);
  
  var self = this;
  this.$ul.on('click', 'a', function (e) {
    if (self.current == e.target) {
      self.paneview.popPane();
      self.current = null;
      $(e.target).removeClass('active');
      e.preventDefault();
      return;
    }
    
    var leaf = self.paneview.makePane($(e.target).attr('href'));
    
    if (self.current) {
      $(self.current).removeClass('active');
      self.paneview.pushPaneAfter(leaf, self);
    } else {
      self.paneview.pushPane(leaf);
    };
    
    self.current = e.target;
    $(e.target).addClass('active');
    e.preventDefault();
  });
};

$.PaneView.NavPane.prototype.add = function (item, target) {
  var $a  = $('<a/>', {text: item, href: target});
  var $li = $('<li/>').append($a).appendTo(this.$ul);
};

