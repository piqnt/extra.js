var should = require('should');
var Delta = require('../delta');

describe('Delta', function() {
  it('Basic', function() {

    var delta = new Delta(function(d) {
      return d;
    });

    delta.data([ 1, 2, 3, 4, 5 ])
    delta.exit().should.eql([])
    delta.enter().should.eql([ 1, 2, 3, 4, 5 ])
    delta.update().should.eql([ 1, 2, 3, 4, 5 ])

    delta.data([ 2, 4, 6 ])
    delta.exit().should.eql([ 1, 3, 5 ])
    delta.enter().should.eql([ 6 ])
    delta.update().should.eql([ 2, 4, 6 ])

  });
});
