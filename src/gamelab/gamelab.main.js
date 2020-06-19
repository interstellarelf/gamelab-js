/**@author
 Jordan Blake
 * */

/**@copyright
 Copyright 2018
 **/


//Gamelab: the main module object:
let Gamelab_Module = function() {

  var module = {

    settings: {

      DEBUG: false,

      gui_mode: true,

      recursionCount: 0,

      errorLimit: 20
    },

    errors: 0,

    stopDraw: false,

    defSize() {
      if (this.WIDTH == 0) {
        this.WIDTH = document.body.clientWidth;
      }

      if (this.HEIGHT == 0) {
        this.HEIGHT = document.body.clientHeight;
      }

    },

    isGameObject(object) {
      object.type = object.constructor.name;
      return ['Sprite',
        'BackgroundElement',
        'BackgroundFill',
        'Terrain',
        'Animation',
        'Frame',
        'Line2D'
      ].includes(object.type);
    },

    getGameWindow(ix = 0) {
      return this.game_windows[0]
    },

    WIDTH: 0,

    HEIGHT: 0,

    game_windows: [],

    gs_renderables: [],

    gs_events: [],

    spriteTypes: [],

    systemSpriteTypes: ['player', 'enemy', 'background', 'interactive', 'terrain', 'weapon', 'subsprite'],

    __gameWindowList: [],

    all: function() {
      var all_objects = [];
      this.game_windows.forEach(function(item) {
        all_objects = all_objects.concat(item.drawables);
      });
      console.info('Gamelab.all():', all_objects);
      return all_objects;
    },

    init: function() {

      this.testSquare = new Gamelab.Sprite();


    },

    onButton: function(gpix = 0, callback) {
      if (typeof gpix == 'function') {
        callback = gpix;
        gpix = 0;
      }
      new Gamelab.GamepadEvent().Gamepads([gpix]).Keys();
    },

    objectDestroyed(obj) {
      var dead = true;

      for (var x in this.game_windows) {
        let gw = this.game_windows[x];

        for (var y in gw.objects) {
          if (gw.objects[y] === obj)
            dead = false;
        }
      }
      return dead;
    },

    getObjectById(id) {
      for (var x = 0; x < this.all_objects.length; x++) {
        if (this.all_objects[x].id == id) {
          return this.all_objects[x];
        }
      }
    },

    interlog: function(message, div) //recursive safe :: won't go crazy with recursive logs :: log message every x times this is called
    {
      this.recursionCount++;
      if (!isNaN(div) && this.settings.recursionCount % div == 0) {
        //   console.log('Interval Log:'+  message);
      }
    },


    create_id: function() {
      var S4 = function() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      };
      return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    },


    error: function(quit, message) {

      if (quit) {
        throw new Error(message);
      } else {
        console.error('E!' + message);
      }
    },

    info: function(m) {

      if (Gamelab.DEBUG) {
        console.info('Info:' + m);
      }
    },


    log: function(m) {

      if (Gamelab.DEBUG) {
        console.log('Gamelab:' + m);
      }
    },

    initializers: [],

    addInitializer: function(i) {

      this.initializers.push(i);

    },

    _gameWindow: {},

    setGameWindow: function(gameWindow) {
      this._gameWindow = gameWindow;
    },

    ExtendEvents: function(extendedObject, extendedKey, extendor, extendorKey) {
      var evtLink = new GSEventLink(extendedObject, extendedKey, extendor, extendorKey);

      this.all_objects.push(new GSEventLink(extendedObject, extendedKey, extendor, extendorKey));

      var parent = extendedObject;

      // console.log(parent);

      if (parent) {
        console.log('Gamelab:EXTENDING EVENTS:' + extendedKey + ":" + extendorKey);

        if (parent.onRun) //Any extendable object has an onRun ... OR
        {
          parent.onRun(extendor, extendorKey);

        }
        if (parent.onComplete) //object has an onComplete
        {
          parent.onComplete(extendor, extendorKey);

        }
      }
    },


    assignAll: function(object, args, keys) {

      __gamelabInstance.each(keys, function(ix, item) {

        object[ix] = args[ix];

      });

    },


    loadSprites: function(sprites, callback) {

      var LEN = sprites.length,
        COUNT = 0;

      if (sprites instanceof Array) {
        sprites.forEach(function(spr) {

          spr.onLoad(function() {

            COUNT += 1;

            if (COUNT >= LEN) {
              callback(sprites);
            }

          });

        });
      } else if (typeof sprites == 'object') {
        LEN = Object.keys(sprites).length;

        for (var x in sprites) {
          var spr = sprites[x];
          if (spr.constructor.name == 'Sprite' ||
            spr.constructor.name == 'BoneSprite' ||
            spr.constructor.name == 'SpriteGroup' ||
            spr.constructor.name == 'Animation') {
            spr.onLoad(function() {

              COUNT += 1;

              if (COUNT >= LEN) {
                callback(sprites);
              }
            });
          }
        }
      }
    },

    each: function(list, onResult, onComplete) {
      for (var i in list) {
        onResult(i, list[i]);
      }

      if (typeof(onComplete) === 'function') {
        onComplete(false, list)
      };

    },

    ready_callstack: [],

    ready: function(callback) {

      this.ready_callstack.push(callback);

    },
    reload: function() {

      this.callReady();

    },

    callReady: function() {

      var funx = this.ready_callstack;

      var gameWindow = this.game_windows[0],
        module = this;

      //call every function in the ready_callstack

      this.each(funx, function(ix, call) {

        call(module, gameWindow);

      });

      this.InputSystem.init();

      this.__running = true;

    },

    getArg: function(args, keys, fallback) {

      if (typeof(keys) == 'string') {
        keys = [keys]; //always array
      }
      for (var x = 0; x < keys.length; x++) {
        var k = keys[x];

        if (args && args.hasOwnProperty(k)) {
          return args[k]; //return first argument match
        }
      }
      return fallback;
    },

    normalArgs: function(args) {

      var a = {};

      function normal(str) {
        return str.toLowerCase().replace('-', '').replace(' ', '').replace('_', '')
      };

      for (var x in args) {
        a[normal(x)] = args[x];
      }

      return a;
    },

    isNormalStringMatch: function(str1, str2) {

      return str1.toLowerCase().replace(' ', '') == str2.toLowerCase().replace(' ', '');

    },

    instance_type_pairs: function() {

      //get an array of all instance/type pairs added to the library

      //example : [ {constructor_name:Sprite, type:enemy_basic}, {constructor_name:Animation, type:enemy_attack}  ];

      var objectList = [];

      this.each(this.all_objects, function(ix, item) {

        objectList.push({
          constructor_name: item.constructor.name,
          type: item.type
        });

      });

      return objectList;

    },

    getById: function(id) {

      for (var x in this.all_objects) {
        if (this.all_objects[x].id == id) {
          return this.all_objects[x];

        }

      }

    },

    select: function(constructor_name, name, group /*ignoring spaces and CAPS/CASE on type match*/ ) {

      var query = [];

      var __inst = this;

      this.each(Gamelab.all(), function(ix, item) {

        if (constructor_name == '*' || item.constructor.name == constructor_name) {

          if (group == '*' || __inst.isNormalStringMatch(group, item.group)) {

            if (name == '*' || __inst.isNormalStringMatch(name, item.name)) {

              query.push(item);

            }
          }
        }
      });

      return query;
    }
  }

  return module;

};

let GamelabApi = {
  get: function() {


  },

  post: function(object) {
    //TODO decycle the object before saving

    if (!object.id) {
      object.id = Gamelab.create_id();

    }

    var name = object.name,
      type = object.constructor.name,
      contents = jstr(object),
      id = object.id;


  }

};


class GSO //Gamelab-Overrideable
{
  constructor(args = {}) {

    this.run_ext = args.run_ext || [];

    this.complete_ext = args.complete_ext || [];
  }

  /*****
   * Overridable / Extendable functions
   * -allows stacking of external object-function calls
   ******/

  onRun(caller, callkey) {
    this.run_ext = this.run_ext || [];

    if (this.run_ext.indexOf(caller[callkey]) == -1) {
      this.run_ext.push({
        caller: caller,
        callkey: callkey
      });
    }
  }

  onComplete(caller, callkey) {
    this.complete_ext = this.complete_ext || [];

    if (this.complete_ext.indexOf(caller[callkey]) == -1) {
      this.complete_ext.push({
        caller: caller,
        callkey: callkey
      });
    }
  }

  call_on_run() {
    //call any function extension that is present
    for (var x = 0; x < this.run_ext.length; x++) {
      this.run_ext[x].caller[this.run_ext[x].callkey]();
    }
  }

  call_on_complete() {
    //call any function extension that is present
    for (var x = 0; x < this.complete_ext.length; x++) {
      this.complete_ext[x].caller[this.complete_ext[x].callkey]();
    }
  }

}

let Gamelab = Gamelab_Module();


Gamelab.DEV = true;


if (typeof module !== 'undefined' && module.exports) {

  //This library is being instaniated via require() aka node.js require or similar library loader
  module.exports = Gamelab;

} else {


}

/***************
 * TODO : fix the above duplicate references, which exist now for backward compatibility with previouslyh authored code
 *  -apply find and replace accross the codebase
 * ****************/

/********
 * jstr() : public function for stringifying objects and arrays (uses pretty print style)
 * *********/

function jstr(obj) {

  return JSON.stringify(obj);

};

Gamelab.jstr = jstr;

/**********
 * $Q : Selector Function
 *  -allows string-based-selection of game-objects.
 * **********/

function $Q(selector) {

  //declare events:

  console.log(selector);

  var query = [];

  //handle selector / selection of objects:

  if (typeof selector !== 'string') {

    if (selector instanceof Array) {

    } else {


    }

  } else {


    if (selector && selector !== '*') {

      var s = selector || '';

      console.info('selector:' + s);


      var mainSelector = $Q.before('[', s).trim(),
        msfChar = mainSelector.substring(0, 1);

      var __targetClassName = "*";

      var output = [];

      var cleanSelectorString = function(str) {
        return str.replace(",", "");
      };

      switch (msfChar.toLowerCase()) {
        case ".":

          console.info('Selecting by "." or class');

          __targetClassName = cleanSelectorString($Q.after('.', mainSelector));

          console.info('Target class is:' + __targetClassName);

          break;

        case "*":

          console.info('Selecting by "*" or ANY object in the library instance');

          __targetClassName = "*";

          break;

      }

      var criterion = $Q.between('[', ']', s),
        cparts = criterion.split('=');

      var __targetGroup = "*",
        __targetName = "*";

      var getParts = function() {

        if (cparts.length >= 2) {

          switch (cparts[0].toLowerCase()) {

            case "name":

              //get all objects according to name=name

              console.log('Q():Detected parts in selector:' + jstr(cparts));

              __targetName = cleanSelectorString(cparts[1]);

              break;

            case "group":

              console.log('Q():Detected parts in selector:' + jstr(cparts));

              __targetGroup = cleanSelectorString(cparts[1]);

              break;

          }

        }

        if (cparts.length >= 4) {

          cparts[2] = cparts[2].replace(",", "");

          switch (cparts[2].toLowerCase()) {

            case "name":

              //get all objects according to name=name

              console.log('Q():Detected parts in selector:' + jstr(cparts));

              __targetName = cleanSelectorString(cparts[3]);

              break;

            case "group":

              console.log('Q():Detected parts in selector:' + jstr(cparts));

              __targetGroup = cleanSelectorString(cparts[3]);

              break;

          }

        }

      };

      getParts(cparts);

      query = Gamelab.select(__targetClassName, __targetName, __targetGroup);

    } else if (selector == '*') {

      query = Gamelab.all();

    }

  }


  query.each = function(callback) {

    var objects = [];

    for (var x = 0; x < this.length; x++) {
      if (typeof x == 'number') {

        callback(x, this[x]);
      }

    }


  };

  query.on = function(evt_key, selectorObject, controller_ix, callback) //handle each event such as on('collide') OR on('stick_left_0') << first controller stick_left
  {

    if (typeof evt_key == 'function' && typeof selectorObject == 'function') {
      //this is a special pattern of if(f() == true){ runFunction(); };

      var boolTrigger = evt_key,
        boolCall = selectorObject,

        boolEvent = new Gamelab.BoolEvent().On(boolTrigger).Call(boolCall);
    }


    var criterion = $Q.between('[', ']', evt_key);

    if (criterion.indexOf('===') >= 0) {
      criterion = criterion.replace('===', '=');
    }

    if (criterion.indexOf('==') >= 0) {
      criterion = criterion.replace('==', '=').replace('==', 0);
    }

    var cparts = criterion.split('=');

    var __targetGroup = "*",
      __targetName = "*";

    if (evt_key.indexOf('[') >= 0) {
      evt_key = $Q.before('[', evt_key).trim();

    }


    var padding = 0;

    //if controller_ix is function, and callback not present, then controller_ix is the callback aka optional argument

    if (controller_ix && typeof controller_ix == 'function' && !callback) {
      callback = controller_ix;
      controller_ix = 0;
    }

    //optional argument: if controller_ix is function, and callback not present, then callback is selectorObject

    if (selectorObject && typeof selectorObject == 'function' && !callback) {

      callback = selectorObject;

      selectorObject = $Q('*');

      controller_ix = 0;
    };

    var evt_profile = {};

    //which controller?

    evt_profile.cix = controller_ix;

    //Need the control key: 'left_stick', 'button_0', etc..

    evt_profile.evt_key = evt_key;

    if ($Q.contains_any(['stick', 'button', 'click', 'key'], evt_profile.evt_key)) {

      var button_mode = evt_profile.evt_key.indexOf('button') >= 0;

      Gamelab.GamepadAdapter.on(evt_profile.evt_key, 0, function(x, y) {

        callback(x, y);

      });

      console.info('detected input event key in:' + evt_profile.evt_key);

      console.info('TODO: rig events');

    }

    //TODO: test collision events:
    else if ($Q.contains_any(['collide', 'collision', 'hit', 'touch'], evt_profile.evt_key)) {

      //   console.info('Rigging a collision event');

      //   console.info('detected collision event key in:' + evt_profile.evt_key);

      //  console.info('TODO: rig collision events');

      this.each(function(ix, item1) {

        // console.info('Collision Processing 1:' + item1.name);
        //  console.info('Collision Processing 1:' + item1.type);

        selectorObject.each(function(iy, item2) {

          //    console.info('Collision Processing 2:' + item2.name);
          //   console.info('Collision Processing 2:' + item2.type);

          if (typeof(item1.onUpdate) == 'function') {

            var update = function(sprite) {

              console.log('Box collide::' + jstr([this, item2]));

              if (Gamelab.Collision.spriteCollide(this, item2)) {

                callback(this, item2);

              };

            };

            item1.onUpdate(update);

          }


        });

      });


    } else {
      console.info('Rigging a property event');

      //TODO: test property-watch events:

      console.info('detected property threshhold event key in:' + evt_profile.evt_key);

      console.info('TODO: rig property events');

      var condition = "_",
        key = criterion || evt_profile.evt_key;

      if (key.indexOf('[') >= 0 || key.indexOf(']') >= 0) {
        key = $Q.between('[', ']', key);

      }

      var evt_parts = [];

      var run = function() {
        console.error('Sprite property check was not set correctly');

      };

      if (key.indexOf('>=') >= 0) {
        condition = ">=";


      } else if (key.indexOf('<=') >= 0) {
        condition = "<=";
      } else if (key.indexOf('>') >= 0) {
        condition = ">";
      } else if (key.indexOf('<') >= 0) {
        condition = "<";
      } else if (key.indexOf('=') >= 0) {
        condition = "=";
      }

      evt_parts = key.split(condition);

      for (var x = 0; x < evt_parts.length; x++) {
        evt_parts[x] = evt_parts[x].replace('=', '').replace('=', '').trim(); //remove any trailing equals and trim()

      }

      var mykey, number;

      // alert(evt_parts[0]);

      try {

        mykey = evt_parts[0];

        number = parseFloat(evt_parts[1]);

      } catch (e) {
        console.log(e);
      }

      console.info('Gamelab:Processing condition with:' + condition);

      switch (condition) {

        case ">=":


          run = function(obj, key) {
            if (obj[key] >= number) {
              callback();
            }
          };

          break;

        case "<=":

          run = function(obj, key) {
            if (obj[key] <= number) {
              callback();
            }
          };

          break;


        case ">":

          run = function(obj, key) {
            if (obj[key] > number) {
              callback();
            }
          };

          break;

        case "<":

          run = function(obj, key) {
            if (obj[key] < number) {
              callback();
            }
          };

          break;

        case "=":

          run = function(obj, key) {
            if (obj[key] == number) {
              callback();
            }
          };

          break;

      }


      /************
       * Attach update to each member
       *
       * **************/

      var keys = mykey.split('.'),
        propkey = "";

      this.each(function(ix, item) {

        var object = {};

        if (keys.length == 1) {
          object = item;

          propkey = mykey;

        } else if (keys.length == 2) {
          object = item[keys[0]];

          propkey = keys[1];


        } else if (keys.length == 3) {
          object = item[keys[0]][keys[1]];

          propkey = keys[2];

        } else {
          console.error(":length of '.' notation out of range. We use max length of 3 or prop.prop.key.");

        }

        if (typeof item.onUpdate == 'function') {


          var spr = item;

          item.onUpdate(function(sprite) {

            run(object, propkey);

          });

        }

      });

    }

  };


  return query;

}


$Q.each = function(obj, callback, complete) {

  for (var x in obj) {
    callback(obj);

  }

  if (typeof(complete) == 'function') {
    complete(obj);

  }

};


$Q.before = function(c1, test_str) {
  var start_pos = 0;
  var end_pos = test_str.indexOf(c1, start_pos);
  return test_str.substring(start_pos, end_pos);
};


$Q.contains = function(c1, test_str) {
  return test_str.indexOf(c1) >= 0;
};

$Q.contains_all = function(cList, test_str) {
  for (var x = 0; x < cList.length; x++) {
    if (test_str.indexOf(cList[x]) < 0) {
      return false;

    }
  }

  return true;

};

$Q.contains_any = function(cList, test_str) {

  for (var x = 0; x < cList.length; x++) {
    if (test_str.indexOf(cList[x]) >= 0) {
      return true;

    }
  }

  return false;

};

$Q.after = function(c1, test_str) {
  var start_pos = test_str.indexOf(c1) + 1;
  var end_pos = test_str.length;
  return test_str.substring(start_pos, end_pos);
};

$Q.between = function(c1, c2, test_str) {
  var start_pos = test_str.indexOf(c1) + 1;
  var end_pos = test_str.indexOf(c2, start_pos);
  return test_str.substring(start_pos, end_pos)
};


/****************************************
 *  Developer's own test-function:
 *      -Q.test_selector_method():
 * ***************************************/

$Q.test_selector_method = function() { //leftover method of hand-testing
  var Q_TestStrings = ['*', '.Sprite', '*[group="enemy_type_0"]', '.Sprite[group="enemy_type_0"]'];

  for (var x = 0; x < Q_TestStrings.length; x++) {
    var test = Q_TestStrings[x];

    console.info('testing:' + test);

    $Q(test);
  }

  console.log('Testing stick left');

  this.on('stick_left_0');

  console.log('Testing button');

  this.on('button_0');


  console.log('Testing collide');

  this.on('collide');


  console.log('Testing button');

  this.on('collide');

  console.log('Testing prop');

  this.on('health>=0');


};


Gamelab.$Q = $Q;

Gamelab.query = $Q;


/********************
 * Gamelab.InputSystem
 * Various Keyboard + mouse Input Events
 ********************/

Gamelab.InputSystem = {

  //PC input events

  Mouse: {
    Position: {
      x: 0,
      y: 0
    },
    Speed: {
      x: 0,
      y: 0
    },
    setPosition(x, y) {

      this.Speed.x = x - this.Position.x;

      this.Speed.y = y - this.Position.y;

      this.Position.x = x;

      this.Position.y = y;

    },
    isIdle: function() {
      return this.speed.x == 0 && this.speed.y == 0;
    }
  },

  events: {

    mousemove: [],
    mousepos: [],
    leftclick: [],
    rightclick: [],
    middleclick: [],
    wheelup: [],
    wheelDown: []
  },

  keymap: {},

  keyReplace: function(str) {
    return str.toLowerCase().replace('space', ' ').replace('left', String.fromCharCode(37)).replace('left', String.fromCharCode(37)).replace('up', String.fromCharCode(38)).replace('right', String.fromCharCode(39)).replace('down', String.fromCharCode(40));
  },

  extendKey: function(evt_key, callback, onFinish) {

    evt_key = this.keyReplace(evt_key);

    Gamelab.InputSystem.keymap[evt_key] = {

      down: false,

      callback: function() {
        callback(evt_key);
      }
    };

    return Gamelab.InputSystem.keymap[evt_key];

  },

  extend: function(evt_key, downCall, upCall, onFinish) {

    evt_key = evt_key.toLowerCase();

    //each event-group has object-type
    Gamelab.InputSystem.events[evt_key] = Gamelab.InputSystem.events[evt_key] || [];

    Gamelab.InputSystem.events[evt_key].push({

      down: downCall,

      up: upCall

    });

  },

  init: function() {

    var MOUSE = this.Mouse;

    window.setInterval(function() {

      Gamelab.each(Gamelab.InputSystem.keymap, function(im, kmapItem) {

        if (kmapItem.down == true) {

          kmapItem.callback();

        }

      });

    }, 10);

    document.onkeydown = document.onkeyup = function(e) {

      e = e || event; // to deal with IE

      var gs_key_string = 'key_' + String.fromCharCode(e.keyCode),

        evt_object = Gamelab.InputSystem['keymap'][gs_key_string] || Gamelab.InputSystem['keymap'][gs_key_string.toLowerCase()];


      if (e.keyCode == 32) {
        gs_key_string = 'key_space';
      }

      if (e.keyCode == 18) {
        gs_key_string = 'key_alt';
      }

      if (e.keyCode == 9) {
        gs_key_string = 'key_tab';
      }

      if (e.keyCode == 16) {
        gs_key_string = 'key_shift';
      }


      if (evt_object) {
        evt_object.down = e.type == 'keydown';
      }

    }

    var canvases = document.querySelectorAll('canvas.gamewindow');


    function getMousePos(e, c) {

      var x;
      var y;
      if (e.pageX || e.pageY) {
        x = e.pageX;
        y = e.pageY;
      } else {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
      }
      x -= c.offsetLeft;
      y -= c.style.top;
      return {
        x: x,
        y: y
      };
    }

    let InputSystem = Gamelab.InputSystem;

    function mouseMoving(event, c) {

      var pos = getMousePos(event, c);

      MOUSE.setPosition(pos.x, pos.y);

      if (InputSystem.events['mousemove']) {
        Gamelab.each(InputSystem.events['mousemove'], function(ix, el) {

          el.down(pos.x, pos.y);

        });
      }

    };

    //Interval for mouse-idle time : run mouse move again with same position, no difference
    setInterval(function() {

      if (InputSystem.events['mousepos']) {

        var pos = MOUSE.Position;

        Gamelab.each(InputSystem.events['mousepos'], function(ix, el) {

          el.down(pos.x, pos.y);

        });
      }

    }, 10);


    for (var x = 0; x < canvases.length; x++) {
      var c = canvases[x];

      function applyMouseMove(e) {
        mouseMoving(e, c);
      }

      console.info('Gamelab-lib-code:main.js: InputSystem applying mousemove');

      document.addEventListener("mousemove", applyMouseMove);

      c.onmousedown = function(e) {
        //    alert(JSON.stringify(Gamelab.InputSystem, true, 2));

        var value = e.which;
        var pos = getMousePos(e, c);
        var InputSystem = Gamelab.InputSystem;

        e.preventDefault();

        switch (e.which) {
          case 1:

            for (var x in InputSystem.events) {

              if (InputSystem.events[x] instanceof Array && x == 'leftclick') {

                Gamelab.each(InputSystem.events[x], function(ix, el) {

                  el.down(pos.x, pos.y);
                });
              }
            }

            break;
          case 2:
            // alert('Middle Mouse button pressed.');

            for (var x in Gamelab.InputSystem.events) {

              if (InputSystem.events[x] instanceof Array && x == 'middleclick') {

                Gamelab.each(InputSystem.events[x], function(ix, el) {

                  el.down(pos.x, pos.y);
                });
              }
            }
            break;
          case 3:
            //  alert('Right Mouse button pressed.');


            for (var x in Gamelab.InputSystem.events) {


              if (InputSystem.events[x] instanceof Array && x == 'rightclick') {


                Gamelab.each(InputSystem.events[x], function(ix, el) {

                  el.down(pos.x, pos.y);
                });

                return false;
              }


            }

            break;
          default:

            return 0;
            //alert('You have a strange Mouse!');

        }


        e.preventDefault();
        return 0;
      };

      c.onmouseup = function(e) {

        //    alert(JSON.stringify(Gamelab.InputSystem, true, 2));

        var value = e.which;
        var pos = getMousePos(e, c);
        var InputSystem = Gamelab.InputSystem;


        e.preventDefault();

        switch (e.which) {
          case 1:

            for (var x in InputSystem.events) {


              if (InputSystem.events[x] instanceof Array && x == 'leftclick') {


                Gamelab.each(InputSystem.events[x], function(ix, el) {

                  el.up(pos.x, pos.y);
                });
              }


            }

            break;
          case 2:
            // alert('Middle Mouse button pressed.');


            for (var x in Gamelab.InputSystem.events) {


              if (InputSystem.events[x] instanceof Array && x == 'middleclick') {


                Gamelab.each(InputSystem.events[x], function(ix, el) {

                  el.up(pos.x, pos.y);
                });
              }


            }
            break;
          case 3:
            //  alert('Right Mouse button pressed.');


            for (var x in Gamelab.InputSystem.events) {


              if (InputSystem.events[x] instanceof Array && x == 'rightclick') {


                Gamelab.each(InputSystem.events[x], function(ix, el) {

                  el.up(pos.x, pos.y);
                });


                return false;

              }


            }

            break;
          default:

            return 0;
            //alert('You have a strange Mouse!');

        }


      };
    }


  }


};

//Override the existing window.onload function

document.addEventListener('DOMContentLoaded', function() {

  Gamelab.callReady();

});

Gamelab.file_system = {

  localizedSource: function(src, hostUrl) {

    hostUrl = hostUrl || "../";

    var gs_folder_ix = src.indexOf('assets/game');

    return hostUrl + src.substring(gs_folder_ix, src.length);

  },

  loadJSON: function(filepath, callback) {

    function readTextFile(file, callback) {
      var rawFile = new XMLHttpRequest();
      rawFile.open("GET", file, false);
      rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4) {
          if (rawFile.status === 200 || rawFile.status == 0) {
            callback(rawFile.responseText);
          }
        }
      }
      rawFile.send(null);
    };

    readTextFile('file:///' + filepath, callback);

  },

  loadLevel: function(jsonText, gw, callback) {

    var data = JSON.parse(jsonText);

    if (typeof(gw) == 'function' || !gw) {
      callback = gw || callback || function() {};

      gw = Gamelab.game_windows[0];
    }

    $.each(data.sprites, function(ix, xitem) {

      if (typeof(xitem.src) == 'string') {

        xitem.src = Gamelab.file_system.localizedSource(xitem.src);
      }

      __gamelabInstance.each(xitem, function(iy, yitem) {

        if (yitem.src) {

          yitem.src = Gamelab.file_system.localizedSource(yitem.src);

        }

        __gamelabInstance.each(yitem, function(iz, zitem) {

          if (zitem.src) {
            zitem.src = Gamelab.file_system.localizedSource(zitem.src);

          }


        });


      });

      xitem = new Gamelab.Sprite(xitem);

      gw.add(xitem);
      //sprite.image = sprite.selected_animation.image;


      if (ix >= data.sprites.length - 1) {

        //last sprite is loaded //WHY DOESN't this work?

        callback(false, data);
      }

    });

  },

  loadJSONLevel: function(filepath, gw, callback) {

    if (typeof(gw) == 'function' || !gw) {
      callback = gw || callback || function() {};

      gw = Gamelab.game_windows[0];
    }

    this.loadJSON(filepath, function(data) {

      //localize .src up to three levels of recursion (.src must be altered to refer locally)

      $.each(data.sprites, function(ix, xitem) {

        if (typeof(xitem.src) == 'string') {

          xitem.src = Gamelab.file_system.localizedSource(xitem.src);
        }

        __gamelabInstance.each(xitem, function(iy, yitem) {

          if (yitem.src) {

            yitem.src = Gamelab.file_system.localizedSource(yitem.src);

          }

          __gamelabInstance.each(yitem, function(iz, zitem) {

            if (zitem.src) {
              zitem.src = Gamelab.file_system.localizedSource(zitem.src);

            }


          });


        });

        xitem = new Gamelab.Sprite(xitem);

        gw.add(xitem);
        //sprite.image = sprite.selected_animation.image;


        if (ix >= data.sprites.length - 1) {

          //last sprite is loaded //WHY DOESN't this work?

          callback(false, data);
        }


      });


    });

  }


};


//reference loadJSON direct from Gamelab::
Gamelab.loadJSON = Gamelab.file_system.loadJSON;
//reference loadJSON as loadJson::
Gamelab.file_system.loadJson = Gamelab.file_system.loadJSON;
Gamelab.loadJson = Gamelab.loadJSON;


Gamelab.ready(function(lib) {

  Gamelab.log('Gamelab: library is ready');

});


/* Screen */

let Screen = {

  size: function() {
    return new Gamelab.Vector(Gamelab.WIDTH, Gamelab.HEIGHT);
  },

  center: function() {
    return new Gamelab.Vector(Gamelab.WIDTH / 2, Gamelab.HEIGHT / 2).round();
  }

};