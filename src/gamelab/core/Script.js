


class Script{

  constructor(uri, callback){

    this.src = uri || '';

    if(uri && callback)
    {
    this.load(uri, callback);
    }
    else{
      console.info('Created Script() without uri + callback --1st and 2nd arguments. To use object call script.load()');
    }

  }

  load(uri, callback){

    var __object = this;

    callback = callback || function(){};

    callback.bind(this);

    var script = document.createElement('SCRIPT');
    script.src = uri;

    //define onload fxn
    script.onload = function(){

      var construct = module.exports;
      callback(construct);

    };

    //append to the document
    document.head.appendChild(script);

  }

};

Gamelab.Script = Script;


class Scriptable{

  constructor(object, siblings){

    this.object = object;

    this.siblings = siblings;

  }

  Object(object)
  {
    this.object = object;
    return this;
  }


  load(url, callback){

    var __object = this;

    callback = callback || function(){};

    callback = callback.bind(this);

    var script = document.createElement('SCRIPT');
    script.src = url;

    //define onload fxn
    script.onload = function(){

      var construct = window.module.exports;

      var MOD = construct(__object.object, __object.siblings);

      callback.bind(__object).call(MOD, __object.object, __object.siblings);
    };

    //append to the document
    document.head.appendChild(script);

  }

};

Gamelab.Scriptable = Scriptable;
