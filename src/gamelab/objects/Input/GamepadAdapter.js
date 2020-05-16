

/**
 * Creates an instance of GamepadAdapter: --instead use the existing: Gamelab.GamepadAdapter, a working instance of this class.
 * -supports game-controller input for web-games
 * -accesses live gamepad input from the HTML5 Gamepad Api
 * @returns {GamepadAdapter} an instance of GamepadAdapter
 * */

Gamelab.gamepads = Gamelab.gamepads || [];

class GamepadAdapter {

    constructor() {
        this.__gamepads = [];
        this.intervals = [];
        let controller_stack = this;
        let __gamepadMaster = this;
        this.settings = {};
        this.settings.xbox_pc = {
          button_0:'a',
          button_1:'b',
          button_2:'x',
          button_3:'y',
          button_4:'lb',
          button_5:'rb',
          button_6:'lt',
          button_7:'rt',
          button_8:'select',
          button_9:'start',
          button_10:'left_stick_button',
          button_11:'right_stick_button',
          button_12:'up',
          button_13:'down',
          button_14:'right',
          button_15:'left'
        };

        this.selectSettings('xbox_pc');

        this.events = [];

        window.addEventListener("gamepadconnected", function (e) {
            console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
                e.gamepad.index, e.gamepad.id,
                e.gamepad.buttons.length, e.gamepad.axes.length);

            if (__gamepadMaster.mainLoop) {
                window.clearInterval(__gamepadMaster.mainLoop);
            }

            __gamepadMaster.mainLoop = window.setInterval(function () {

                var gps = navigator.getGamepads();

                __gamepadMaster.gps = gps;

                for (var x = 0; x < gps.length; x++) {

                    var events = __gamepadMaster.__gamepads[x] ? __gamepadMaster.__gamepads[x] : {};

                    __gamepadMaster.process(__gamepadMaster.gps[x], events);
                }
            }, 20);
        });
    }

    selectSettings(name)
    {
      for(var x in this.settings)
      {
        if(x.toLowerCase() == name.toLowerCase())
        {
                this.selectedSettings = this.settings[x];
        }
      }
    }

    addButtonSettings(name, settings)
    {
      name = name || '#untitled';
      this.settings[name] = settings;
    }

    gamepads() {

        return navigator.getGamepads();

    }

    disconnect_all() {

        for (var x = 0; x < this.intervals.length; x++) {

            window.clearInterval(this.intervals[x]);

        }
    }

    disconnect_by_index(game_pad_index) {

        window.clearInterval(this.intervals[game_pad_index]);

    }

    hasAnyPad() {
        return "getGamepads" in navigator;

    }

    Event(key, game_pad, callback) {
        return {

            key: key, game_pad: game_pad, callback: callback

        }

    }

    GamepadEvents(args) {

        var $adapter = this;

        var gp = {};

        gp.stick_left = args.stick_left || function (x, y) {

            //  console.log('Def call');

        }

        gp.stick_right = args.stick_right || function (x, y) {

        }

        gp.buttons = [];

        gp.extendFunc = function (f1, f2) {

            var fc = f2;

            return function (x, y) {

                f2(x, y);

                f1(x, y);

            }

        };


                gp.normal_key = function(k){ //replace spaces and dashes with _
                  for(var x = 0; x < 4; x++)
                  {
                    if(k.indexOf(' ') >= 0)
                    {
                        k = k.replace(' ', '_');
                    }
                    if(k.indexOf('-') >= 0)
                    {
                        k = k.replace('-', '_');
                    }
                  }

                  return k.toLowerCase();
                }

                gp.on = function (key, callback) {

                    var settings = $adapter.selectedSettings;

                    key = this.normal_key(key);


                                if (this[key] && key !== "on") {

                                    var current_cb = typeof(this[key]) == 'function' ? this[key] : function (x, y) {
                                    };

                                    this[key] = this.extendFunc(callback, current_cb);
                                }


                    for(var x in settings)
                    {
                        var parts = x.split('_');

                        if(this.normal_key(x) == key || this.normal_key(settings[x]) == key) //its in the settings
                        {

                                          var number;

                                          try {

                                              number = parseInt(parts[1]);

                                              var current_cb = typeof(this['buttons'][number]) == 'function' ? this['buttons'][number] : function (x, y) {
                                              };

                                              this['buttons'][number] = this.extendFunc(callback, current_cb);

                                          }
                                          catch (e) {
                                              console.error('could not parse "on" event with ' + key);

                                          }
                        }
                    }
                }

        gp.constructor = {name: "GamepadEvents"};

        this.__gamepads.push(gp);

        Gamelab.gamepads = this.__gamepads;

        return gp;

    }

    getGamepads() {
        return Gamelab.gamepads;

    }

    process(gp, gpEvents) {

        this.process_buttons(gp, gpEvents);

        this.process_axes(gp, gpEvents);

    }

    process_axes(gp, events) {

        if (!gp || !gp['axes']) {

            return false;

        }


        for (var i = 0; i < gp.axes.length; i += 2) {

            var axis1 = gp.axes[i], axia2 = gp.axes[i + 1];

            var ix = (Math.ceil(i / 2) + 1), x = gp.axes[i], y = gp.axes[i + 1];

            if (ix == 1 && events.stick_left) {
                events.stick_left(x, y);

            }

            if (ix == 2 && events.stick_right) {
                events.stick_right(x, y);

            }

            if (this.events && this.events['stick_' + i] && typeof(this.events['stick_' + i].callback) == 'function') {
                this.events['stick_' + i].callback();

            }
        }

    }


    process_buttons(gp, events) {

        if (!gp || !gp['buttons']) {
            return false;

        }

        for (var i = 0; i < gp.buttons.length; i++) {

            if (!events.buttons)
                break;

            else if (events.buttons.length > i && typeof(events.buttons[i]) == 'function') {
                events.buttons[i](gp.buttons[i].pressed);
            }
            else if (events.buttons.length > i && typeof(events.buttons[i]) == 'object' && typeof(events.buttons[i].update) == 'function') {
                events.buttons[i].update(events.buttons[i].pressed);

            }
            var clearance_1 = this.events && this.events[i], gpc, bkey = "button_" + i;

            if (clearance_1) {
                gpc = this.events[bkey] && !isNaN(this.events[bkey].game_pad) ? this.gamepads[this.events[bkey].game_pad] : this.events[bkey].game_pad;
            }
            ;

            if (clearance_1 && gpc && typeof(this.events[bkey].callback) == 'function') {
                //call the callback
                this.events[i].callback();

            }

        }
    }


    on(key, gpix, callback) {

        var keys = TypeCode.arrayWrap(key || []), gps = TypeCode.arrayWrap(gpix || []);;

        for(var x in keys)
        {
            for(var y in gps)
            {
                if (gps[y] >= this.__gamepads.length) {

                    this.__gamepads.push(this.GamepadEvents({}));

                }

                this.__gamepads[y].on(keys[x], callback);

            }
        }
    }
}

/**********
 * NOTE: here we bind the instance, and NOT the instantiator.
 *
 * *********/

if (!Gamelab.GamepadAdapter) {

    Gamelab.GamepadAdapter = new GamepadAdapter();

    // __gameInstance.gamepads.push(gamepad);

}
