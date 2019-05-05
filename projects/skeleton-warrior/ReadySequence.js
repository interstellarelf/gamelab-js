

class ReadyPromise {
  constructor(){
    this.call = function(){};
    this.next = function(){};
    this.ready = function(){ return false; };
  }

  Promise(callback){
    this.ready = callback;
    return this;
  }

  Ready(callback){
    this.ready = callback;
    return this;
  }

  Then(call){
    this.next = call;
    return this;
  }
}

Gamestack.ReadyPromise = ReadyPromise;


class ReadySequence {
  constructor() {
    this.callstack = [];
    this.finish_mode = 'one-shot';
  }

  FinishMode(m)
  {
    this.mode = m || 'one-shot' || 'continuous' || 'on-stop';
    return this;
  }

  stop(){
    this.stop = true;
    this.callstack = [];
  }

  add(object)
  {
    this.callstack.push(object);
    return this;
  }

  Prepare(call){
    call.bind(this).call();
    return this;
  }

  run(){

    this.callstack.forEach(function(call){
      if(call instanceof ReadyPromise)
      {
        console.info('detected DopeSequence in callstack');
      }
      if(typeof call == 'function')
      {
        console.info('detected basic function in callstack. --must return true to stop calling');
      }
    });
  }
};

Gamestack.ReadySequence = ReadySequence;
