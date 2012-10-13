$.PaneView = function (selector) {
  this.$dom = $($(selector)[0]);
  this.$dom.css({position: 'relative', 'overflow-x': 'hidden'});
  this.stack = [];
};

$.PaneView.prototype.last = function (offset) {
  return this.stack[this.stack.length - offset];
};

$.PaneView.prototype.pushPane = function (title) {
  var pane = new $.PaneView.Pane(title);
  this.$dom.append(pane.$dom);
  this.stack.push(pane);
  
  if (this.stack.length == 1) {
    this.last(1).$dom.animate({left: 0,   right: 0});
  } else if (this.stack.length >= 2) {
    this.last(1).$dom.animate({left: 200, right: 0});
    this.last(2).$dom.animate({left: 0,   right: 600});
    
    if (this.stack.length > 2)
      this.last(3).$dom.animate({left: -200, right: 800}); // TODO: and remove from DOM
  };
  
  return pane;
};

$.PaneView.prototype.popPane = function () {
  if (this.stack.length == 1) {
    this.last(1).$dom.animate({left: 800, right: 0}); // TODO: and remove from DOM
  } else if (this.stack.length == 2) {
    this.last(1).$dom.animate({left: 800, right: 0}); // TODO: and remove from DOM
    this.last(2).$dom.animate({left: 0,   right: 0});
  } else if (this.stack.length >= 3) {
    this.last(1).$dom.animate({left: 800, right: 0}); // TODO: and remove from DOM
    this.last(2).$dom.animate({left: 200, right: 0});
    this.last(3).$dom.animate({left: 0,   right: 600}); // TODO: and remove from DOM
  };
  
  this.stack.pop();
};


$.PaneView.Pane = function (title) {
  this.$dom = $('<section/>', {'class': 'pane'});
  this.$dom.css({position: 'absolute', left: '100%', right: 0, top: 0, bottom: 0});
  
  this.$inner = $('<div/>').appendTo(this.$dom);
  this.$inner.css({width: 600, 'overflow-x': 'hidden'});
  
  this.title = title;
};

$.PaneView.Pane.prototype.text = function (text) {
  this.$inner.text(text);
};

