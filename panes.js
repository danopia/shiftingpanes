$.PaneView = function (selector) {
  this.$dom = $($(selector)[0]);
  this.$dom.css({position: 'relative', 'overflow-x': 'visible'});
  this.stack = [];
  this.routes = [];
  
  $(window).bind('popstate', function (e) { // e.data
    console.log(e.originalEvent.state);
  });
};

$.PaneView.prototype.route = function (path, handler) {
  var route = {handler: handler};
  
  if (typeof(path) == 'string') {
    route.path = path;
  } else if (path.exec) {
    route.regex = path;
  } else {
    console.log('WARNING: no idea how to handle routes with', path);
  };
  
  this.routes.push(route);
};

$.PaneView.prototype.makePane = function (path) {
  var i, param, route;
  
  for (i = 0; i < this.routes.length; i++) {
    route = this.routes[i];
    if (route.path == path)
      return route.handler(path);
    else if (route.regex && (param = route.regex.exec(path)))
      return route.handler(path, param);
  };
  
  var leaf = new $.PaneView.Pane('Error');
  leaf.text('404 Not Found error for ' + path);
  return leaf;
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
  
  this.pushPane(pane, true);
};

$.PaneView.prototype.pushPane = function (pane, swap) {
  this.$dom.append(pane.$dom);
  this.stack.push(pane);
  pane.paneview = this;
  //window.history.pushState({stack: $.map(this.stack,function(p){return p.path}), path: pane.path}, 'shifting pane', pane.path);
  
  if (this.stack.length == 1) {
    this.last(1).$dom.animate({left: 0,   right: 0});
  } else if (this.stack.length >= 2) {
    this.last(1).$dom.animate({left: '20%', right: 0});
    if (!swap) this.last(2).$dom.animate({left: 0,   right: '80%'});
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
  
  //if (this.last(1))
    //window.history.pushState({}, 'shifting pane', this.last(1).path);
};


$.PaneView.Pane = function (title) {
  this.$dom = $('<section/>', {'class': 'pane'});
  this.$dom.css({position: 'absolute', left: '100%', right: 0, top: 0, bottom: 0, 'overflow-x': 'hidden'});
  
  this.$title = $('<h3/>', {text: title}).appendTo(this.$dom);
  this.$inner = $('<div/>').appendTo(this.$dom);
  //this.$inner.css({width: 600, 'overflow-x': 'hidden'});
};

$.PaneView.Pane.prototype.text = function (text) {
  this.$inner.text(text);
};

$.PaneView.Pane.prototype.title = function (title) {
  this.$title.text(title);
};

$.PaneView.Pane.prototype.dom = function (dom) {
  this.$inner.empty()
  this.$inner.append(dom);
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
    e.preventDefault();
    
    if (self.current == e.target) {
      self.paneview.popPane();
      self.current = null;
      $(e.target).removeClass('active');
      return;
    }
    
    var leaf = self.paneview.makePane($(e.target).attr('href'));
    leaf.path = $(e.target).attr('href');
    
    if (self.current) {
      $(self.current).removeClass('active');
      self.paneview.pushPaneAfter(leaf, self);
    } else {
      self.paneview.pushPane(leaf);
    };
    
    self.current = e.target;
    $(e.target).addClass('active');
  });
};

$.PaneView.NavPane.prototype.add = function (item, target, extra) {
  var $a  = $('<a/>', {text: item, href: target, });
  var $li = $('<li/>', {'class': extra}).append($a).appendTo(this.$ul);
};

