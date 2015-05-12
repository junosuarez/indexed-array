if (typeof module === 'object' && typeof define !== 'function') {
    var define = function (factory) {
        module.exports = factory(require, exports, module);
    };
}

define(function (require, exports, module) {
  var isArray = Array.isArray || function (a) { return a instanceof Array; };
  var makeIndexer = function (key) {
    return function (val) {
      return val[key];
    };
  };
  var extend = function (obj1, obj2) {
    var key;
    for (key in obj2) {
      if (!obj2.hasOwnProperty(key)) {
        continue;
      }
      obj1[key] = obj2[key];
    }
    return obj1;
  };
  var notInt = /[^\d]/;
  var stringify = function (x) {
    return x !== null && x !== void 0 ? String(x) : x;
  }
  var IndexedArray = function (array, indexer) {
    // enforce no `new` so that we always return an actual
    // array to pass `instanceof Array`
    if (this instanceof IndexedArray) {
      return IndexedArray(array, indexer);
    }

    var arr = [];
    arr._indexer = typeof indexer === 'function' ? indexer :
      makeIndexer(indexer || '_id');
    arr._i = {};

    arr._index = function (val) {
      var i = stringify(arr._indexer(val));

      // only allow large numbers
      if (i && (notInt.test(i) || i.length > 10)) {
        arr._i[i] = arr[i] = val;
      }
    };

    for (var method in IndexedArray.prototype) {
      arr[method] = IndexedArray.prototype[method];
    }

    if (isArray(array)) {
      array.forEach(function (ele) {
        arr.push(ele);
      });
    }

    return arr;

  };
  IndexedArray.fromObject = function (obj, indexKey) {
    indexKey = indexKey || '_id';
    var key, arr = [];
    for(key in obj) {
      if(!obj.hasOwnProperty(key)) {
        continue;
      }
      var o = {};
      o[indexKey] = key;
      extend(o, obj[key]);
      arr.push(o);
    }
    return IndexedArray(arr, indexKey);
  };
  var Ap = Array.prototype;
  IndexedArray.prototype = {
    push: function (val) {
      this._index(val);
      return Ap.push.call(this, val);
    },
    pop: function () {
      var popped = Ap.pop.call(this);
      var i = this._indexer(popped);
      delete this._i[i];
      delete this[i];
      return popped;
    },
    shift: function () {
      var shifted = Ap.shift.call(this);
      var i = this._indexer(shifted);
      delete this._i[i];
      delete this[i];
      return shifted;
    },
    unshift: function (val) {
      this._index(val);
      return Ap.unshift.call(this, val);

    },
    splice: function (from, take) {
      var arr = this;
      var vals = Ap.slice.call(arguments).splice(2);
      vals.forEach(arr._index);
      return Ap.splice.apply(this, arguments);
    },
    toObject: function () {
      return this._i;
    },
    toJSON: function () {
      return this._i;
    },
    concat: function (arr) {
      return IndexedArray(Ap.concat.call(this, arr), this._indexer);
    },
    slice: function (begin, end) {
      return IndexedArray(Ap.slice.call(this, begin, end), this._indexer);
    },
    keys: function () {
      var key, k = [];
      for(key in this._i) {
        k.push(key);
      }
      return k;
    }
  };

  return IndexedArray;
});