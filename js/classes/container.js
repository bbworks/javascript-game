function Container (children) {
  this.children = children || [];
}

Container.prototype = {
  constructor: Container,
  iterate: function(callback) {
    for (var i in this.children) {
      var child = this.children[i];
      if (child instanceof Container) {
        child.iterate(callback);
        continue;
      }
      callback.call(child);
    }
  },
  add: function(child, key) {
    if (this.children instanceof Array) {
      this.children.push(child);
    }
    else if (typeof this.children === "object") {
      this.children[key] = child;
    }
  },
  remove: function(child, key) {
    if (this.children instanceof Array) {
      this.children.splice(this.children.indexOf(child), 1);
    }
    else if (typeof this.children === "object") {
      delete this.children[key];
    }
  },
  update: function() {
    this.iterate(function(){this.update();});
  },
  render: function() {
    this.iterate(function(){this.render();});
  },
}
