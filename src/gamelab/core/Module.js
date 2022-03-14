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

  onInstanceCallback(uri, callback) {
    var moduleInstance;
    this.load(uri, function(inst) {
      moduleInstance = new inst();
      callback(moduleInstance);
    });
  }

  load(uri, callback) {

    Gamelab.modules = Gamelab.modules || [];

    var __object = this;
    this.uri = uri;
    callback = callback || function() {};
    callback = callback.bind(this);

    var script = document.createElement('SCRIPT'),
      executeNow = false;

    for (var x = 0; x < Gamelab.modules.length; x++) {
      if (Gamelab.modules[x].uri == uri) {
        callback(Gamelab.modules[x].construct);
        return Gamelab.modules[x];
      }
    }

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
      __object.construct = __object.lib = construct;
      callback(construct, uri);
    };
    if (executeNow) {
      setTimeout(function() {
        var construct = window.module.exports;
        callback(construct, uri);
      }, 250);
    }
    //append to the document

    Gamelab.modules.push(__object);

    document.head.appendChild(script);
  }
};

Gamelab.Module = Module;

class Code {
  constructor() {

  }
  run(callback) {
    if (typeof callback == 'string') {
      callback = new Function('return function run(){' + callback + '}();');
    }
    //get string contents after the name
    var fxnString = callback.toString().split('()')[1];
    //add generic name
    fxnString = '\n function run()' + fxnString;
    var script = document.createElement('SCRIPT');
    script.innerHTML = fxnString + '\n  run();';
    document.head.appendChild(script);
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

Code.call = Code.run;
Code.loadAndCall = Code.loadAndRun;
Gamelab.Code = Code;

Gamelab.ScopeInterface = function(scope) {
  var testInterface = document.createElement('div');
  testInterface.style.position = 'fixed';
  testInterface.style.display = 'block';
  testInterface.style.top = '58px';
  testInterface.style.right = '4%';
  testInterface.style.width = '40%';
  testInterface.style.height = '40%';
  testInterface.style.zIndex = '9999';
  testInterface.style.padding = '7px';
  testInterface.style.background = '#222';
  testInterface.style.border = '1px solid lightgrey';
  var testInput = document.createElement('textarea');
  testInput.style.backgroundColor = '#000';
  testInput.style.height = '80%';
  testInput.style.width = '96%';
  testInput.style.color = 'lightgrey';
  var submitRow = document.createElement('span');
  var submit = document.createElement('button');
  submit.style.backgroundColor = '#222';
  submit.style.color = 'lightgrey';
  submit.style.border = '1px solid lightgrey';
  submit.style.marginTop = '4px';
  submitRow.appendChild(submit);
  submit.innerText = 'Run Code';

  submit.onclick = function() {
    console.log('testing-interface-value:' + testInput.value);
    var value = testInput.value;
    new Gamelab.Code().run(value);
  };


  testInterface.appendChild(testInput);
  testInterface.appendChild(submit);
  document.body.appendChild(testInterface);
};
