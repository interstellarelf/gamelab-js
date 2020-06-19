/**
 * returns BoolEvent --allows code to run whenever a conditional-function returns true
 * @param   {onBool} onBool the function to be tested each update
 * @param   {call} call the function to be called when onBool returns true;

 * @returns {BoolEvent} a Gamelab.BoolEvent object
 */

class BooleanEvent extends GSEvent {
  constructor(onBool, callback) {
    super({});
    this.bool = onBool || function() {
      console.info('CustomBoolEvent():needs .on function(){}. --Add this as 1st argument or via chainable On() function returning bool argument');
    }
    /*Defaults to false to avoid broken code*/
    this.callback = callback || function() {
      console.info('CustomBoolEvent():needs .callback function(){} --Add this as 2nd argument or via chainable Call() function');
    };
    Gamelab.gs_events.push(this);
  }

  /**
   * applies a boolFunction to be tested for true each update
   * @param   {boolFunction} boolFunction the function to be tested each update --replaces the value of boolEvent.onBool

   * @returns {BoolEvent} the current instance of BoolEvent, reference to 'this' keyword
   */

  On(boolFunction) {
    this.bool = boolFunction;
    return this;
  }

  /**
   * applies a callback to be called whenever the onBool function returns true
   * @memberof BoolEvent
   * @param   {callbackFunction} callbackFunction the function to be called --replaces the value of boolEvent.callback

   * @returns {BoolEvent} the current instance of BoolEvent, reference to 'this' keyword
   */

  Call(callbackFunction) {
    this.callback = callbackFunction || this.callback || function() {};
    return this;
  }
};

BooleanEvent.Boolean = BooleanEvent.Boolean = BooleanEvent.On;
Gamelab.BooleanEvent = BooleanEvent;