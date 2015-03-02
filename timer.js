/*
 * ExtraJS
 * Copyright (c) 2015 Ali Shakiba, Piqnt LLC
 * Available under the MIT license
 * @license
 */

(function() {

  function Timer() {

    var timers = {};

    this.once = function(name, callback, delay) {
      return this.repeat(name, callback, delay, 1);
    };

    this.repeat = function(name, callback, delay, repeat) {
      repeat = (typeof repeat === 'number') ? repeat : Infinity;
      return this.set(name, {
        callback : callback,
        repeat : repeat,
        delay : delay
      });
    };

    this.set = function(name, timer) {
      if (typeof timer.delay !== "function") {
        var delay = timer.delay;
        timer.delay = function() {
          return delay;
        };
      }
      timer.time = timer.time || timer.delay();
      if (typeof repeat !== 'number' || timer < 1) {
        timer.repeat = 1;
      }
      timers[name] = timer;
    };

    this.unset = function(name) {
      delete timers[name];
    };

    this.reset = this.empty = function() {
      for ( var name in timers) {
        delete timers[name];
      }
    };

    this.tick = function(t) {
      for ( var name in timers) {
        var timer = timers[name];
        timer.time -= t;
        if (timer.time <= 0) {
          if (--timer.repeat <= 0) {
            this.empty(name);
          } else {
            timer.time = timer.delay();
          }
          timer.callback();
        }
      }
    };

  }

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = Timer;
    }
    exports.Timer = Timer;
  } else if (typeof define === 'function' && define.amd) {
    define([], function() {
      return Timer;
    });
  } else if (typeof window !== 'undefined') {
    window.Timer = Timer;
  } else if (typeof global !== 'undefined') {
    global.Timer = Timer;
  } else if (typeof self !== 'undefined') {
    self.Timer = Timer;
  } else {
    this.Timer = Timer;
  }
}).call(this);
