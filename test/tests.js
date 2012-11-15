require('chai').should();
var IndexedArray = require('../indexedArray');

describe('IndexedArray', function () {

  it('is instanceof Array', function () {
    var a = IndexedArray([1,2,3]);
    (a instanceof Array).should.be.true;
  });

  it('is still instanceof Array when used with `new`', function () {
    var a = new IndexedArray([1,2,3]);
    (a instanceof Array).should.be.true;
  });

  it('has length', function () {
    var a = IndexedArray([1,2,3]);
    a.length.should.equal(3);
  });

  it('takes a plain array in the constructor', function () {
    var a = IndexedArray([4,3,2,1]);
    a.length.should.equal(4);
  });

  it('will initialize an empty array if instantiated with no arguments', function () {
    var a = IndexedArray();
    a.length.should.equal(0);
  });

  it('can access elements by positional index', function () {
    var a = IndexedArray(['a','b','c']);
    a[0].should.equal('a');
    a[1].should.equal('b');
    a[2].should.equal('c');
  });

  describe('Supported Array.prototype methods', function () {
    it('push', function () {
      var a = IndexedArray([]);
      a.push('thing');
      a.length.should.equal(1);
      a[0].should.equal('thing');
      a.push({_id: 'baz', val: 'foo'});
      a.length.should.equal(2);
      a['baz'].val.should.equal('foo');
    });

    it('pop', function () {
      var datum = {_id: 'foo', val: 5};
      var a = IndexedArray([{}, datum]);
      var popped = a.pop();
      popped.should.equal(datum);
      a.length.should.equal(1);
      (a['foo'] === undefined).should.be.true;

    });

    it('shift', function () {
      var datum = {_id: 'unicorns', real: true};
      var a = IndexedArray([datum, {}]);
      var shifted = a.shift();
      shifted.should.equal(datum);
      a.length.should.equal(1);
      (a['unicorns'] === undefined).should.be.true;
    });

    it('unshift', function () {
      var datum = {_id: 'luftbalons', count: 99};
      var a = IndexedArray([{}]);
      a.unshift(datum);
      a.length.should.equal(2);
      a[0].should.equal(datum);
      a['luftbalons'].should.equal(datum);
    });

    describe('splice', function () {
      var apple, potato, theRest, a;

      beforeEach(function () {
        apple = {_id: 'apple', state: 'WA'};
        potato = {_id: 'potato', state: 'ID'};
        theRest = {_id: 'rest', state: 'CA'};
        a = IndexedArray([apple, potato, theRest]);
      })

      it('inserts', function () {
        var bigApples = {_id: 'big apples', state: 'NY'};
        var spliced = a.splice(2,0, bigApples);
        a.length.should.equal(4);
        a[0].should.equal(apple);
        a[1].should.equal(potato);
        a[2].should.equal(bigApples);
        a[3].should.equal(theRest);
        a['big apples'].should.equal(bigApples);
        Array.isArray(spliced).should.be.true;
        spliced.length.should.equal(0);
      });

      it('removes', function () {
        var spliced = a.splice(0,1);
        a.length.should.equal(2);
        a[0].should.equal(potato);
        a[1].should.equal(theRest);
        spliced.length.should.equal(1);
        spliced[0].should.equal(apple);
      });

      it('removes and inserts multiple', function () {
        var lobster = {_id: 'lobster', state: 'ME'};
        var oranges = {_id: 'oranges', state: 'FL'};
        var spliced = a.splice(1,2, lobster, oranges);
        a.length.should.equal(3);
        a[0].should.equal(apple);
        a[1].should.equal(lobster);
        a[2].should.equal(oranges);
        a['lobster'].should.equal(lobster);
        a['oranges'].should.equal(oranges);
        spliced.length.should.equal(2);
        spliced[0].should.equal(potato);
        spliced[1].should.equal(theRest);
      });

    });

    describe('concat', function () {
      it('merges two IndexArrays together, using the indexer from the first IndexedArray', function () {
        var a1 = IndexedArray([{a: 'a', b:2}, {a: 'b', z: 4}], function(x) { return x.a.toUpperCase(); })
        var a2 = IndexedArray([{a: 'c', b:2}, {a: 'd', z: 4}])
        var a3 = a1.concat(a2);
        a1.length.should.equal(2);
        a2.length.should.equal(2);
        a3.length.should.equal(4);
        a3['A'].b.should.equal(2);
        a3['B'].z.should.equal(4);
        a3['C'].b.should.equal(2);
        a3['D'].z.should.equal(4);
      });

      it('merges an IndexedArray with a plain old array, using the indexer from the frist IndexedArray', function () {
        var a1 = IndexedArray([{a: 'a', b:2}, {a: 'b', z: 4}], function(x) { return x.a.toUpperCase(); })
        var a2 = [{a: 'c', b:2}, {a: 'd', z: 4}]
        var a3 = a1.concat(a2);
        a1.length.should.equal(2);
        a2.length.should.equal(2);
        a3.length.should.equal(4);
        a3['A'].b.should.equal(2);
        a3['B'].z.should.equal(4);
        a3['C'].b.should.equal(2);
        a3['D'].z.should.equal(4);
      })
    });

    describe('slice', function () {
      it('returns a copy (shallow clone) when called without arguments', function () {
        var arr = [1,2,3];
        var a1 = IndexedArray(arr);
        var a2 = a1.slice();
        a2.length.should.equal(a1.length);
        a2.should.not.equal(a1);
      });
    });

    it('foreach only iterates over each element once', function () {
      var arr = [1,2,3,4];
      var i = 0;
      IndexedArray(arr).forEach(function () { i++; });
      i.should.equal(4);
    });
  });

  describe('indexing', function () {
    it ('will index elements using an optional indexer passed in as the second argument of the constructor', function () {
      var john = {name: 'john', age: 9};
      var lucia = {name: 'lucia', age: 13};
      var arr = [john, lucia];
      var a = IndexedArray(arr, 'name');
      a['john'].should.equal(john);
    });
    it('defaults to using the property `_id`', function () {
      var arr = [{_id: '23a', boats: 'lots'}, {_id: 's12', boats: 'not so much'}, {_id: 'l337', boats: 'k'}];
      var a = IndexedArray(arr);
      a['l337'].boats.should.equal('k');
    });
    it ('won\'t use numbers as indices to prevent confusion with positional indices', function () {
      var arr = [{_id: 14, title: 'Nope'}, {_id: 3, title: 'Wat'}];
      var a = IndexedArray(arr);

      (a[14] === undefined).should.be.true;
    });
    it('takes a custom function as an indexer', function () {
      var arr = [{first: 'BOB', last: 'bobson'}, {first: 'Foo', last: 'barzynsczki'}];
      var a = IndexedArray(arr, function (x) { return x.first.toLowerCase(); });
      a['bob'].last.should.equal('bobson');
    });

    it('has a `keys` method, analogous to `Object.keys`', function () {
      var arr = [{_id: 'Q', val: 1}, {_id: 'W', val: 2}, {_id: 'E', val: 3}, {_id: 'R', val: 4}, {_id: 'T', val: 5}, {_id: 'Y', val: 6}];
      IndexedArray(arr).keys().should.deep.equal(['Q','W','E','R','T','Y']);
    });
  });

  describe('fromObj', function () {
    it('creates an IndexedArray from an object, essentially flattening indexes into properties', function () {
      var obj = {
        'QWE': {val: 'qwe'},
        'ASD': {val: 'asd'},
        'ZXC': {val: 'zxc'}
      }

      var a = IndexedArray.fromObj(obj);
      a.length.should.equal(3);
      a[0]._id.should.equal('QWE');
      a['QWE'].val.should.equal('qwe');
    })
  })

});