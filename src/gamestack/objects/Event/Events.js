(function() {
  console.log('GSEvent class... creating');

  class GSEvent {

    constructor(args = {}) {

      //  Gamestack.Modifiers.informable(this, args);

    }
  }


  class MouseMoveEvent {
    constructor(callback) {
      callback = callback || function(x, y) {};

      this.Callback(callback);
    }
    Callback(cb) {
      Gamestack.InputSystem.extend('mousemove', function(x, y) {

        cb(x, y);

      });
    }
  };

  Gamestack.MouseMoveEvent = MouseMoveEvent;

  class MousePosEvent {
    constructor(callback) {
      callback = callback || function(x, y) {};

      this.Callback(callback);
    }
    Callback(cb) {
      Gamestack.InputSystem.extend('mousepos', function(x, y) {

        cb(x, y);

      });
    }
  };

  Gamestack.MousePosEvent = MousePosEvent;


  class MouseLeftClickEvent {
    constructor(callback) {
      callback = callback || function(x, y) {};

      this.Callback(callback);
    }
    Callback(cb) {

      Gamestack.InputSystem.extend('leftclick', function(x, y) {

        cb(x, y);

      });
    }
  };

  Gamestack.MouseLeftClickEvent = MouseLeftClickEvent;


  class MouseRightClickEvent {
    constructor(callback) {
      callback = callback || function(x, y) {};

      this.Callback(callback);
    }
    Callback(cb) {

      Gamestack.InputSystem.extend('rightclick', function(x, y) {

        cb(x, y);

      });
    }
  };


  Gamestack.MouseRightClickEvent = MouseRightClickEvent;


  function GSEventLink(extendedObject, extendedKey, extendor, extendorKey) {
    this.parent_id = extendedObject.id,

      this.child_id = extendor.id,

      this.parent_key = extendedKey,

      this.child_key = extendorKey;
  };

  /**
   * Creates an instance of InputEvent
   * <info-bit> Gamestack.InputEvent runs a callback function when a specified input is triggered</info-bit>
   *
   * <tip is="p">Instead of calling
   *
   * @param   {Object} args object of arguments
   * @param   {number} args.btnix the index of controller-button to be applied
   * @param   {number} args.gpix the index of pc-gamepad --the 1st gamepad will have index 0
   * @param   {number} args.stickix the controller-stick-index to be applied
   * @param   {Array} args.keys array of strings for keys to be applied
   * @param   {Function} args.callback the function to call when InputEvent is triggered
   * @returns {Gamestack.InputEvent} a Gamestack.InputEvent object
   */


  class InputEvent extends GSEvent {
    constructor(args) {
      super(args);

      var btnix = args.btnix || args.button_ix || false,

        gpix = args.gpix || args.gamepad_ix || 0,

        callback = args.callback || function() {


        };

      var six = args.stickix || args.six || args.stick_ix || false;

      var inputKey = six !== false ? 'stick_' + six : btnix !== false ? 'button_' + btnix : false;

      //Keys:

      var keyboardKeys = Larva.arrayWrap(args.keys || []);

      //Run the Q() function

      if (keyboardKeys instanceof Array) {

        Gamestack.each(keyboardKeys, function(ix, keyitem) {

          Gamestack.InputSystem.extendKey('key_' + keyitem.toLowerCase(), function() {

            callback(keyitem.toLowerCase());

          });
        });
      }

      if (inputKey && gpix >= 0) {

        Gamestack.GamepadAdapter.on(inputKey, gpix, function(x, y) {

          callback(x, y);

        });
      }
    }
  };


  /**
   *
   * @extends InputEvent
   *
   * Creates an instance of KeyboardEvent
   * <info-bit> Gamestack.KeyboardEvent runs a callback function when keyboard-keys are pressed</info-bit>
   * @param   {Array | string} keys the Array of keys or single string-key for this event
   * @param   {Function} callback the callback-function to be called when this event is triggered

   * @returns {Gamestack.KeyboardEvent}
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

        Gamestack.each(keyboardKeys, function(ix, keyitem) {

          Gamestack.InputSystem.extendKey('key_' + keyitem.toLowerCase(), function() {

            __inst.callback(keyitem.toLowerCase());

          });
        });
      }
    }

    Keys(keys = []) {
      this.keys = Larva.arrayWrap(keys)

      return this;

    }

    Call(callback = function() {}) {
      this.callback = callback;

      this.init();

      return this;
    }
  };

  /**
   *
   * @extends InputEvent
   *
   * Creates an instance of GamepadEvent
   * <info-bit> Gamestack.GamepadEvent runs a callback function when any specified gamepad-buttons or gamepad-sticks are pressed</info-bit>
   * @param   {Array | string} gamepadKeys the Array of gamepadKeys or single string-key, representing gamepad-buttons or gamepad-sticks for this event
   * @param   {Function} callback the callback-function to be called when this event is triggered

   * @returns {Gamestack.GamepadEvent}
   */

  class GamepadEvent extends InputEvent {
    constructor(keys = [], callback = function() {}) {

      super({});

      this.keys = keys;

      this.callback = callback;

    }

    Gamepads(gps = []) {
      this.gps = gps = Larva.arrayWrap(gps || []);

      return this;
    }

    init() {
      var gamepadKeys = Larva.arrayWrap(this.keys || []);

      var __inst = this;

      Gamestack.GamepadAdapter.on(gamepadKeys, this.gps, function(x, y) {

        __inst.callback(x, y);

      });
    }

    Keys(keys = []) {
      this.keys = Larva.arrayWrap(keys);

      return this;

    }

    Call(callback = function() {}) {
      this.callback = callback;

      this.init();

      return this;

    }

  };

  class CollisionEvent extends GSEvent {
    constructor(args = {}) {
      super(args);

    }

    /**
     * applies objects and siblings to be compared for the CollisionEvent instance
     * @memberof CollisionEvent
     * @param   {Array} objects the main-objects for collision processing
     * @param   {Array} siblings the comparable-objects for collision processing
     * @returns {CollisionEvent} the current instance of CollisionEvent, reference to 'this' keyword
     */

    OnCollision(objects, siblings) {

      this.objects = Larva.arrayWrap(objects || this.objects || []);

      this.siblings = Larva.arrayWrap(siblings || this.siblings || []);

      return this;
    }

    /**
     * applies a callback to be called whenever the onBool function returns true
     * @memberof CollisionEvent
     * @param   {callbackFunction} callbackFunction the function to be called --replaces the value of collisionEvent.callback

     * @returns {CollisionEvent} the current instance of CollisionEvent, reference to 'this' keyword
     */

    Call(callbackFunction) {

      this.callback = callbackFunction || this.callback || function() {};

      let __inst = this;

      $Q(this.objects).on('collide', $Q(this.siblings), function(obj1, obj2) {

        __inst.callback(obj1, obj2);


      });

      return this;

    }
  };

  /**
   * returns BoolEvent --allows code to run whenever a conditional-function returns true
   * @param   {onBool} onBool the function to be tested each update
   * @param   {call} call the function to be called when onBool returns true;

   * @returns {BoolEvent} a Gamestack.BoolEvent object
   */


  class BoolEvent extends GSEvent {
    constructor(onBool, callback) {

      super({});

      this.bool = onBool || function() {
        console.info('CustomBoolEvent():needs .on function(){}. --Add this as 1st argument or via chainable On() function returning bool argument');
      }
      /*Defaults to false to avoid broken code*/

      this.callback = callback || function() {
        console.info('CustomBoolEvent():needs .callback function(){} --Add this as 2nd argument or via chainable Call() function');
      };

      Gamestack.gs_events.push(this);

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

  BoolEvent.Bool = BoolEvent.On;

  Gamestack.GSEvent = GSEvent;

  Gamestack.GSEventLink = GSEventLink;

  Gamestack.InputEvent = InputEvent;

  Gamestack.GamepadEvent = GamepadEvent;

  Gamestack.KeyboardEvent = KeyboardEvent;

  Gamestack.CollisionEvent = CollisionEvent;

  Gamestack.BoxCollisionEvent = CollisionEvent;

  Gamestack.BoolEvent = BoolEvent;

})();
