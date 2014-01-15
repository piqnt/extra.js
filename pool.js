function Pool(create, checkout, checkin, discard) {

  var _list = [], _max = 4, _name = "";

  var _created = 0, _checkedout = 0, _checkedin = 0, _discarded = 0;

  this.max = function(max) {
    if (!arguments.length) {
      return _max;
    }
    _max = max;
    return this;
  };

  this.name = function(name) {
    if (!arguments.length) {
      return _name;
    }
    _name = name;
    return this;
  };

  this.checkOut = function() {
    var item;
    if (_list.length) {
      item = _list.shift();
    } else {
      _created++;
      item = create.call(this);
    }
    _checkedout++;
    checkout && checkout.call(this, item);
    return item;
  };

  this.checkIn = function(item) {
    if (_list.length < _max) {
      _checkedin++;
      checkin && checkin.call(this, item);
      _list.push(item);
    } else {
      _discarded++;
      discard && discard.call(this, item);
    }
  };

  this.toString = function() {
    return "Pool (" + _name + "):" + " +" + _created + " >" + _checkedout
        + " <" + _checkedin + " -" + _discarded + " =" + _list.length + "/"
        + _max;
  };
}