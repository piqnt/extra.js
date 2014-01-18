function Pattern() {
  this.maps = [];
}

Pattern.repeat = function() {
  var inst = new Pattern();
  inst.repeat.apply(inst, arguments);
  return inst;
};

Pattern.map = function() {
  var inst = new Pattern();
  inst.map.apply(inst, arguments);
  return inst;
};

Pattern.prototype.repeat = function() {
  for (var i = 0; i < arguments.length; i++) {
    this.maps.push(function(fn) {
      return function(next) {
        var n = (typeof fn === "function") ? fn(t) : fn;
        for (var t = 0; t < n; t++) {
          var args = Array.prototype.slice.call(arguments, 1);
          args[args.length - 1] = t;
          next.apply(null, args);
        }
      };
    }(arguments[i]));
  }
  return this;
};

Pattern.prototype.map = function() {
  for (var i = 0; i < arguments.length; i++) {
    this.maps.push(arguments[i]);
  }
  return this;
};

Pattern.prototype.plot = function(last) {
  var c = 0;
  var self = this;
  function getnext(m) {
    return function() {
      var args = Array.prototype.slice.call(arguments, 0);
      if (m < self.maps.length) {
        self.maps[m].apply(null, [ getnext(m + 1) ].concat(args));
      } else {
        last.apply(null, args);
        c++;
      }
    };
    return null;
  }
  getnext(0)
      .apply(null, Array.prototype.slice.call(arguments, 1).concat([ 0 ]));
  return c;
};

Pattern.offset = function(a, b) {
  var values = Array.prototype.slice.call(arguments, 0);
  return function(next) {
    var args = Array.prototype.slice.call(arguments, 1);
    for (var i = 0; i < values.length && i < args.length - 1; i++) {
      args[i] += values[i];
    }
    next.apply(null, args);
  };
};

Pattern.space = function() {
  var values = Array.prototype.slice.call(arguments, 0);
  return function(next) {
    var args = Array.prototype.slice.call(arguments, 1);
    for (var i = 0; i < values.length && i < args.length - 1; i++) {
      args[i] += values[i] * args[args.length - 1];
    }
    next.apply(null, args);
  };
};
