/*
 * Game Bits
 * Copyright (c) 2019 Ali Shakiba
 * Available under the MIT license
 * @license
 */

(function() {

  var map = {};
  var list = [];
  
  function set(fn, delay, name) {
    var id = setTimeout(function() {
      var i = list.indexOf(id);
      i >= 0 && list.splice(i, 1);
      fn();
    }, delay);
    list.push(id);
    if (name) {
      clearTimeout(map[name]);
      map[name] = id;
    }
    return id;
  }
  
  function unset(name) {
    clearTimeout(map[name]);
    clearTimeout(name);
    var i = list.indexOf(id);
    i >= 0 && list.splice(i, 1);
  }
  
  function loop(fn, delay, name) {
    delay = delay || fn();
    delay && set(function() {
      loop(fn, 0, name);
    }, delay, name);
  }
  
  function reset() {
    while (list.length) {
      clearTimeout(list.shift());
    }
  }

  var Timeout = {
    set : set,
    unset : unset,
    reset : reset,
    loop : loop
  };

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = Timeout;
    }
    exports.Timeout = Timeout;
  } else if (typeof define === 'function' && define.amd) {
    define([], function() {
      return Timeout;
    });
  } else if (typeof window !== 'undefined') {
    window.Timeout = Timeout;
  } else if (typeof global !== 'undefined') {
    global.Timeout = Timeout;
  } else if (typeof self !== 'undefined') {
    self.Timeout = Timeout;
  } else {
    this.Timeout = Timeout;
  }
}).call(this);
