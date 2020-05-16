/**
 * Creates a new Module
 * @param   {string} uri the uri that the .js file is located at
 * @param   {Function} callback=function(){} The callback to call after the module is loaded
 * @returns {Module} a Gamelab.Module object
 * */

class Module {

  constructor(uri, callback) {
    if (uri)
      this.load(uri, callback);
  }

  readFile(fileObject, callback) {
    var reader = new FileReader();
    reader.onload = function(e) {
      callback(reader.result);
    }
    reader.readAsText(fileObject);
  }

  load(uri, callback) {

    var __object = this;

    this.uri = uri;

    callback = callback || function() {};

    callback = callback.bind(this);

    var script = document.createElement('SCRIPT'),

    executeNow = false;

    if (uri.toLowerCase().endsWith('.js')) {
      script.src = uri;
    } else {
      //assumed to be raw value
      var data = uri;
      executeNow = true;
      script.appendChild(document.createTextNode(data));
    }

    //be sure the window.module is set to new {}
    window.module = window.module || {};

    //define onload fxn
    script.onload = function() {

      var construct = window.module.exports;
      callback(construct, uri);

    };

    if(executeNow)
    {
      setTimeout(function(){
        var construct = window.module.exports;
        callback(construct, uri);
      }, 250);
    }

    //append to the document
    document.head.appendChild(script);

  }

};

Gamelab.Module = Module;


class Code {

  constructor() {

  }

  loadAndRun(uri, callback) {

    var __object = this;

    this.uri = uri;

    callback = callback || function() {};

    callback = callback.bind(this);

    var script = document.createElement('SCRIPT');
    script.src = uri;

    //be sure the window.module is set to new {}
    window.module = window.module || {};

    //define onload fxn
    script.onload = function() {
      var construct = window.module.exports;
      var value;
      if (typeof construct == 'function') {
        value = window.module.exports();
      }

      callback(value, construct, uri);

    };
    //append to the document
    document.head.appendChild(script);
  }
}


Gamelab.Code = Code;
