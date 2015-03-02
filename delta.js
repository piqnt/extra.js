/*
 * ExtraJS
 * Copyright (c) 2015 Ali Shakiba, Piqnt LLC
 * Available under the MIT license
 * @license
 */

(function() {

  function Delta(_id) {

    if (typeof _id === 'string') {
      _id = (function(name) {
        return function(d) {
          return d[name];
        };
      })(_id);
    }

    var _data = [], _entered = [], _exited = [];

    var _map = {}, _xmap = {};

    this.data = function(data) {
      if (!data)
        throw "Invalid data: " + data;

      if (typeof _id === 'function') {
        _entered.length = 0;
        _exited.length = 0;
        _data.length = data.length;

        for (var i = 0; i < data.length; i++) {
          var d = data[i], id = _id(d);
          if (!_map[id]) {
            _entered.push(d);
          } else {
            delete _map[id];
          }
          _xmap[id] = _data[i] = d;
        }

        for ( var id in _map) {
          _exited.push(_map[id]);
          delete _map[id];
        }

        var temp = _map;
        _map = _xmap;
        _xmap = temp;
      } else {

        _entered.length = 0;
        for (var i = 0; i < data.length; i++) {
          if (_data.indexOf(data[i]) < 0) {
            _entered.push(data[i]);
          }
        }

        _exited.length = 0;
        for (var i = 0; i < _data.length; i++) {
          if (data.indexOf(_data[i]) < 0) {
            _exited.push(_data[i]);
          }
        }

        _data.length = data.length;
        for (var i = 0; i < data.length; i++) {
          _data[i] = data[i];
        }
      }

      return this;
    };

    this.update = function(callback) {
      if (!arguments.length) {
        return _data;
      }
      if (typeof callback !== "function")
        throw "Invalid update callback!";
      for (var i = 0; i < _data.length; i++) {
        callback(_data[i]);
      }
      return this;
    };

    this.enter = function(callback) {
      if (!arguments.length) {
        return _entered;
      }
      if (typeof callback !== "function")
        throw "Invalid enter callback!";
      for (var i = 0; i < _entered.length; i++) {
        callback(_entered[i]);
      }
      return this;
    };

    this.exit = function(callback) {
      if (!arguments.length) {
        return _exited;
      }
      if (typeof callback !== "function") {
        throw "Invalid exit callback!";
      }
      for (var i = 0; i < _exited.length; i++) {
        callback(_exited[i]);
      }
      return this;
    };

    this.toString = function() {
      return "+[" + _entered + "] -[" + _exited + "] =[" + _data + "]";
    };
  }
  
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = Delta;
    }
    exports.Delta = Delta;
  } else if (typeof define === 'function' && define.amd) {
    define([], function() {
      return Delta;
    });
  } else if (typeof window !== 'undefined') {
    window.Delta = Delta;
  } else if (typeof global !== 'undefined') {
    global.Delta = Delta;
  } else if (typeof self !== 'undefined') {
    self.Delta = Delta;
  } else {
    this.Delta = Delta;
  }
}).call(this);
