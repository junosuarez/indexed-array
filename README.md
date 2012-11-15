# IndexedArray

An extension to native Array which supports direct element lookup by position index or primary key. Objects returned by IndexedArray are Array-like, meaning they have a `.length` property and are `instanceof Array`.

## Usage

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

Supports normal Array.prototype methods. See tests for more exmaples.

## Installation

    npm install indexed-array

## License
MIT

## Contributing
Feel free to open an issue or a pull request. Use this class at your own risk.