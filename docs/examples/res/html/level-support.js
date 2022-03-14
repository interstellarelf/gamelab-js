class ResourceArray {

  constructor() {

  }

  From(array) {

        if (!(array instanceof Array)) {
          console.error('1st argument --not array');
          return;
        }
        array.last = function() {
          return this[this.length - 1];
        }

        array.do = function(fxn) {
          fxn.bind(this).call();
        };

        return array;
  }
}


class GlobalResourceArray {

  constructor() {

  }

  From(array) {

    if (!(array instanceof Array)) {
      console.error('1st argument --not array');
      return;
    }
    array.last = function() {
      return this[this.length - 1];
    }

    array.do = function(fxn) {
      fxn.bind(this).call();
    };

    return array;
  }
}


class LevelFile {

  constructor(name, description, map) {
    this.name = name || '*untitled';
    this.map = map;
  }

  Name(n) {
    this.name = n;
    return this;
  }

  Description(d) {
    this.description = d;
    return this;
  }

  onGlobalResources(array, onCreate) {
      this.globalResources = new GlobalResourceArray(array);
      onCreate.bind(this.globalResources).call();
  }

  onResources(array, onCreate) {
    this.resources = new GlobalResourceArray(array);
    onCreate.bind(this.resources).call();
  }

  getResources(){
    return this.resources;
  }
  getGlobalResources(){
    return this.globalResources;
  }
}
