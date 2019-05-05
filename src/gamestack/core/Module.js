

console.info('Module class :: keep as public');

class Module{

  constructor(uri, callback){

    this.load(uri, callback);

  }

  load(uri, callback){

    var __object = this;

    callback = callback || function(){};

    callback = callback.bind(this);

    var script = document.createElement('SCRIPT');
    script.src = uri;

    //define onload fxn
    script.onload = function(){

      var construct = window.module.exports;
      callback(construct);

    };

    //append to the document
    document.head.appendChild(script);

  }

};

Gamestack.Module = Module;
