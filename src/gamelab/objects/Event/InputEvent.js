/**
 * Creates an instance of InputEvent
 * <info-bit> Gamelab.InputEvent runs a callback function when a specified input is triggered</info-bit>
 *
 * <tip is="p">Instead of calling
 *
 * @param   {Object} args object of arguments
 * @param   {number} args.btnix the index of controller-button to be applied
 * @param   {number} args.gpix the index of pc-gamepad --the 1st gamepad will have index 0
 * @param   {number} args.stickix the controller-stick-index to be applied
 * @param   {Array} args.keys array of strings for keys to be applied
 * @param   {Function} args.callback the function to call when InputEvent is triggered
 * @returns {Gamelab.InputEvent} a Gamelab.InputEvent object
 */


class InputEvent extends GSEvent {
  constructor(args) {
    super(args);

    var btnix = args.btnix || args.button_ix || false,
      gpix = args.gpix || args.gamepad_ix || 0,
      callback = args.callback || function() {};

    var six = args.stickix || args.six || args.stick_ix || false;
    var inputKey = six !== false ? 'stick_' + six : btnix !== false ? 'button_' + btnix : false;

    //Keys:
    var keyboardKeys = TypeCode.arrayWrap(args.keys || []);

    //Run the Q() function
    if (keyboardKeys instanceof Array) {
      Gamelab.each(keyboardKeys, function(ix, keyitem) {
        Gamelab.InputSystem.extendKey('key_' + keyitem.toLowerCase(), function() {
          callback(keyitem.toLowerCase());
        });
      });
    }

    if (inputKey && gpix >= 0) {
      Gamelab.GamepadAdapter.on(inputKey, gpix, function(x, y) {
        callback(x, y);
      });
    }
  }
};

Gamelab.InputEvent = InputEvent;


/**
 *
 * @extends InputEvent
 *
 * Creates an instance of KeyboardEvent
 * <info-bit> Gamelab.KeyboardEvent runs a callback function when keyboard-keys are pressed</info-bit>
 * @param   {Array | string} keys the Array of keys or single string-key for this event
 * @param   {Function} callback the callback-function to be called when this event is triggered

 * @returns {Gamelab.KeyboardEvent}
 */

class KeyboardEvent extends InputEvent {
  constructor(keys = keys instanceof Array ? keys : [keys], callback = function() {}) {
    super({});
    this.keys = keys;
    this.callback = callback;
  }

  init() {
    var keyboardKeys = this.keys;
    var __inst = this;

    if (keyboardKeys instanceof Array) {
      Gamelab.each(keyboardKeys, function(ix, keyitem) {
        Gamelab.InputSystem.extendKey('key_' + keyitem.toLowerCase(), function() {
          __inst.callback(keyitem.toLowerCase());
        });
      });
    }
  }

  Keys(keys = []) {
    this.keys = TypeCode.arrayWrap(keys)
    return this;
  }

  Call(callback = function() {}) {
    this.callback = callback;
    this.init();
    return this;
  }
};

Gamelab.KeyboardEvent = KeyboardEvent;


/**
 *
 * @extends InputEvent
 *
 * Creates an instance of GamepadEvent
 * <info-bit> Gamelab.GamepadEvent runs a callback function when any specified gamepad-buttons or gamepad-sticks are pressed</info-bit>
 * @param   {Array | string} gamepadKeys the Array of gamepadKeys or single string-key, representing gamepad-buttons or gamepad-sticks for this event
 * @param   {Function} callback the callback-function to be called when this event is triggered

 * @returns {Gamelab.GamepadEvent}
 */

class GamepadEvent extends InputEvent {
  constructor() {
    super({});
    this.gps = [0];
    this.keys = [];
    this.callback = function() {};
  }

  Gamepads(gps = []) {
    this.gps = TypeCode.arrayWrap(gps);
    return this;
  }

  init() {
    var gamepadKeys = TypeCode.arrayWrap(this.keys || []);
    var __inst = this;
    Gamelab.GamepadAdapter.on(gamepadKeys, this.gps, function(x, y) {
      __inst.callback(x, y);
    });
  }

  Keys(keys = []) {
    this.keys = TypeCode.arrayWrap(keys);
    for (var x = 0; x < this.keys.length; x++) {
      if (typeof this.keys[x] == 'number') { //must change to a string
        this.keys[x] = (this.keys[x] + '');
      }
    }
    return this;
  }

  Call(callback = function() {}) {
    this.callback = callback;
    this.init();
    return this;
  }
};

Gamelab.GamepadEvent = GamepadEvent;