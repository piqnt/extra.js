var should = require('should');
var Pool = require('../pool');

describe('Pool', function() {
  it('Basic', function() {

    var pool = new Pool();

    pool.create(function() {
      return {
        created : true,
        busy : false,
        discarded : false,
      };
    });

    pool.exit(function(obj) {
      obj.busy = true;
    });

    pool.enter(function(obj) {
      obj.busy = false;
    });

    pool.discard(function(obj) {
      obj.discarded = true;
    });

    var a = pool.max(1);

    var a = pool.checkOut();
    var b = pool.checkOut();
    a.created.should.be.ok;
    a.busy.should.be.ok;
    a.discarded.should.not.be.ok;

    pool.checkIn(a);
    a.busy.should.not.be.ok;
    a.discarded.should.not.be.ok;

    pool.checkIn(b);
    b.discarded.should.be.ok;

  });
});
