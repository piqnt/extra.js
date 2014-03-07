var Timer = (function() {
  var lastid = 0;
  var timers = {};
  return {
    once : function(callback, delay) {
      return this.repeat(callback, delay, 1);
    },
    repeat : function(callback, delay, repeat) {
      repeat = arguments.length > 2 ? repeat : Infinity;
      return this.set({
        callback : callback,
        repeat : repeat,
        delay : delay,
      });
    },
    set : function(options) {
      if (!(options.repeat > 0)) {
        throw "Invalid repeat number: " + options.repeat;
      }
      var id = ++lastid;
      timers[id] = options;
      if (typeof options.delay !== "function") {
        var delay = options.delay;
        options.delay = function() {
          return delay;
        };
      }
      options.time = options.time || options.delay();
      options.repeat = options.repeat || 1;
      return id;
    },
    clear : function(id) {
      delete timers[id];
    },
    tick : function(t) {
      for ( var id in timers) {
        var timer = timers[id];
        timer.time -= t;
        if (timer.time <= 0) {
          if (--timer.repeat <= 0) {
            this.clear(id);
          } else {
            timer.time = timer.delay();
          }
          timer.callback();
        }
      }
    }
  };
})();