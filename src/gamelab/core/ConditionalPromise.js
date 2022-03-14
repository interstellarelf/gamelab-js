class ConditionalPromise extends Promise {
  constructor(resolve, reject) {
    super(resolve, reject);
    this.every = function() {}; //millis || boolfxn
    this.unless = function() {};
    this.resolve = resolve || function() {};
    this.reject = reject || function() {};
    this.until = function() {}; //millis || boolfxn
    this.promise = new Promise(this.resolve, this.reject);
  }
  Do(d) {
    this.do = d;
    return this;
  }
  On(o) {
    this.on = o;
    return this;
  }
  Every(e) {
    this.every = e;
    return this;
  }
  Unless(u) {
    this.unless = u;
    return this;
  }
  Until(u) {
    this.until = u;
    return this;
  }
  run(timer) {

  }
}

Gamelab.ConditionalPromise = ConditionalPromise;