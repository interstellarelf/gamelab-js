class State {
  constructor(object, stateName, fallbackState) {
    this.object = object;
    this.stateName = stateName;
    //list of boolean fxns which cancel the state
    this.triggers = [];
    //fxn to be called when triggered
    this.triggerCall = function() {};
    //list of boolean fxns which trigger the state
    this.cancellators = [];
    //fxn to be called when cancelled
    this.cancelCall = function() {};
    //error-protection: use limit on number of list-Members
    this.listLimit = 10;
    this.fallbackState = fallbackState;
  }
  onTrigger(call) {
    this.triggerCall = call || function() {
      clog('--empty trigger call');
    };
  }
  onCancel(call) {
    this.cancelCall = call || function() {
      clog('--empty cancel call');
    };
  }
  defineTrigger(triggerFxn) {
    this.triggers.push(triggerFxn);
    return this;
  }
  defineCancellator(cancelFxn) {
    this.cancellators.push(cancelFxn);
    return this;
  }
  isTriggered() {
    for (var x = 0; x < this.triggers.length; x++) {
      if (this.triggers[x]()) {
        return true;
      }
    }
    return false;
  }
  isCancelled() {
    for (var x = 0; x < this.triggers.length; x++) {
      if (this.cancellators[x]) {
        return true;
      }
    }
    return false;
  }
}

class StateMachine {
  constructor() {
    this.states = [];
  }
  add(state) {
    this.states.push(state);
  }
}