

class StateAction {

  constructor() {

  }
  Name(name) {
    this.name = name;
    return this;
  }
  Parent(p) {
    this.parent = p;
    return this;
  }
  Options(options) {
    this.options = options;
    this.stateOptions = {};
    this.reset();
    return this;
  }
  Call(engageCallback) {
    this.engage = this.commit = engageCallback;
    return this;
  }
  set(optionKey, optionValue) {
    this.stateOptions[optionKey] = optionValue;
    return this;
  }
  get(optionKey) {
    return this.stateOptions[optionKey];
  }
  reset() {
    //reset the options to original values
    for (var x in this.options) {
      this.stateOptions[x] = this.options[x];
    }
  }
  disengage() {
    //set the parent's state to '_NEXT_'
    this.parent.state = '_NEXT_';
    this.reset();
  }
  commit() {
    //default as empty function
  }
  engage() {
    //same as calling commit()
  }

}


Gamelab.StateAction = StateAction;
