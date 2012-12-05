# IndexedArray

An extension to native Array which supports direct element lookup by position index or primary key. Objects returned by IndexedArray are Array-like, meaning they have a `.length` property and are `instanceof Array`.

## Usage

    var IndexedArray = require('indexed-array');

    var data = [
      {_id: 'abc', name: 'Kurosawa'},
      {_id: 'xyz', name: 'Gondry'},
      {_id: 'rst', name: 'Almodovar'}
    ];

    var arr = IndexedArray(data);
    arr['abc'].name; // 'Kurosawa'
    arr[0].name;     // 'Kurosawa'
    arr['rst'].name; // 'Almodovar'
    arr[2].name;     // 'Almodovar'

The `IndexedArray` constructor takes an optional existing Array and an optional indexer, which can be either the name of the property to index or a function like you would pass to `Array.prototype.map`. By default, MongoDB style `_id` is used.

You can also create an IndexedArray from an object being used as a hashmap:

    var obj = {
      'QWE': {val: 'qwe'},
      'ASD': {val: 'asd'},
      'ZXC': {val: 'zxc'}
    }

    var arr = IndexedArray.fromObject(obj);

Now you can use Array-like methods, such as `push` and `pop` while still being able to access objects in O(1) time without iteration.

When you're done mutating the IndexedArray, you can get the the hashmap directly:

    arr.toObject();


IndexedArray supports normal Array.prototype methods:

 - pop
 - push
 - shift
 - unshift
 - splice
 - slice

Since IndexedArrays extend plain old Arrays, collection methods work great:

 - forEach
 - map
 - reduce
 - filter
 - some
 - every
 - sort

And third party libraries should play nice, too, for example lodash or underscore.

See tests for more examples.

## AMD Compatibility

IndexedArray supports AMD modules and can be used either in node or in the browser. IndexedArray has no dependencies in node but may require ES5 shims in really old browsers.

## Installation

    npm install indexed-array

## License
Copyright (c) 2012 Jason Denizac <jason@denizac.org>
Licensed under the MIT license.

## Contributing
Feel free to open an issue or a pull request. Use this class at your own risk.