$.PaneView = function (selector) {
  this.$dom = $($(selector)[0]);
  this.$dom.css({position: 'relative', 'overflow-x': 'visible'});
  this.stack = [];
};

$.PaneView.prototype.last = function (offset) {
  return this.stack[this.stack.length - offset];
};

$.PaneView.prototype.pushPane = function (pane) {
  this.$dom.append(pane.$dom);
  this.stack.push(pane);
  
  if (this.stack.length == 1) {
    this.last(1).$dom.animate({left: 0,   right: 0});
  } else if (this.stack.length >= 2) {
    this.last(1).$dom.animate({left: '20%', right: 0});
    this.last(2).$dom.animate({left: 0,   right: '80%'});
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
  this.$inner.css({width: 600, 'overflow-x': 'hidden'});
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
};

$.PaneView.NavPane.prototype.add = function (item, handler) {
  var $a = $('<a/>', {text: item, href: '#'});
  $a.on('click', handler);
  
  var $li = $('<li/>').append($a);
  $li.appendTo(this.$ul);
};

