/*
 * Game Bits
 * Copyright (c) 2019 Ali Shakiba
 * Available under the MIT license
 * @license
 */

(function() {

  function catmullrom(ps, conf) {

    if (!ps || !ps.length) {
      return null;
    }

    conf = conf || {};

    var alpha = conf.alpha || 0;
    var close = conf.close || 0;
    var fx = conf.fx || function(p) {
      return p.x || p[0];
    };
    var fy = conf.fy || function(p) {
      return p.y || p[1];
    };

    var xs = [], ys = [], n = ps.length;
    for (var i = 0; i < n; i++) {
      xs[i] = fx(ps[i]);
      ys[i] = fy(ps[i]);
    }

    if (ps.length == 1) {
      // on point
      return function(t, xy) {
        return __xy(xs[0], ys[0], xy);
      };
    } else if (ps.length == 2) {
      // two point, a line
      return function(t, xy) {
        if (t < 0) {
          t = t - (t | 0) + 1;
        } else if (t > 1) {
          t = t - (t | 0);
        }
        var x = (1 - t) * xs[0] + t * xs[1];
        var y = (1 - t) * ys[0] + t * ys[1];
        return __xy(x, y, xy);
      };
    }

    // extrapolate control points
    if (close) {
      xs.unshift(xs[n - 1]);
      ys.unshift(ys[n - 1]);
      xs.push(xs[1]);
      ys.push(ys[1]);
      xs.push(xs[2]);
      ys.push(ys[2]);
      n += 3;
    } else {
      xs.push(2 * xs[n - 1] - xs[n - 2]);
      ys.push(2 * ys[n - 1] - ys[n - 2]);
      xs.unshift(2 * xs[0] - xs[1]);
      ys.unshift(2 * ys[0] - ys[1]);
      n += 2;
    }

    var ts = [];
    for (var i = 0; i < n; i++) {
      if (alpha > 0 && i > 0) {
        var dx = xs[i] - xs[i - 1];
        var dy = ys[i] - ys[i - 1];
        ts[i] = ts[i - 1] + Math.pow(dx * dx + dy * dy, alpha);
      } else {
        ts[i] = i;
      }
    }

    return function(t, xy) {
      if (close) {
        if (t < 0) {
          t = t - (t | 0) + 1;
        } else if (t > 1) {
          t = t - (t | 0);
        }
      }
      t = (1 - t) * ts[1] + t * ts[ts.length - 2];
      for (var i = 2; i < ts.length - 2 && t > ts[i]; i++) {
      }
      i -= 2;
      var x = cr_interpolate(t, ts[i], ts[i + 1], ts[i + 2], ts[i + 3], xs[i],
          xs[i + 1], xs[i + 2], xs[i + 3]);
      var y = cr_interpolate(t, ts[i], ts[i + 1], ts[i + 2], ts[i + 3], ys[i],
          ys[i + 1], ys[i + 2], ys[i + 3]);
      return __xy(x, y, xy);
    };
  }

  function cr_interpolate(t, t0, t1, t2, t3, v0, v1, v2, v3) {
    var l01 = (v0 * (t1 - t) + v1 * (t - t0)) / (t1 - t0);
    var l12 = (v1 * (t2 - t) + v2 * (t - t1)) / (t2 - t1);
    var l23 = (v2 * (t3 - t) + v3 * (t - t2)) / (t3 - t2);
    var l012 = (l01 * (t2 - t) + l12 * (t - t0)) / (t2 - t0);
    var l123 = (l12 * (t3 - t) + l23 * (t - t1)) / (t3 - t1);
    var c12 = (l012 * (t2 - t) + l123 * (t - t1)) / (t2 - t1);
    return c12;
  }

  function __xy(x, y, xy) {
    if (!xy) {
      return {
        x : x,
        y : y
      };
    } else if (typeof xy === "function") {
      return xy(x, y);
    } else if (xy instanceof Array) {
      xy[0] = x;
      xy[1] = y;
      return xy;
    } else if (typeof xy === "object") {
      xy.x = x;
      xy.y = y;
      return xy;
    } else {
      return {
        x : x,
        y : y
      };
    }
  }

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = catmullrom;
    }
    exports.catmullrom = catmullrom;
  } else if (typeof define === 'function' && define.amd) {
    define([], function() {
      return catmullrom;
    });
  } else if (typeof window !== 'undefined') {
    window.catmullrom = catmullrom;
  } else if (typeof global !== 'undefined') {
    global.catmullrom = catmullrom;
  } else if (typeof self !== 'undefined') {
    self.catmullrom = catmullrom;
  } else {
    this.catmullrom = catmullrom;
  }
}).call(this);
