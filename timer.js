var Timer = (function() {
  var lastid = 0;
  var timers = {};
  return {
    once : function(callback, delay) {
      return this.repeat(callback, delay, 1);
    },
    repeat : function(callback, delay, repeat) {
      repeat = arguments.length > 2 ? repeat : Infinity;
      if (repeat > 0) {
        var id = ++lastid;
        timers[id] = [ callback, delay, repeat, delay ];
        return id;
      }
    },
    clear : function(id) {
      delete timers[id];
    },
    tick : function(t) {
      for ( var id in timers) {
        var timer = timers[id];
        timer[1] -= t;
        if (timer[1] <= 0) {
          if (--timer[2] <= 0) {
            this.clear(id);
          } else {
            timer[1] = timer[3];
          }
          timer[0]();
        }
      }
    }
  };
})();