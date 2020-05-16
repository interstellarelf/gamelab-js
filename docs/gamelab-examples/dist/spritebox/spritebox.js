"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**@author
 Jordan Blake
 * */

/**@copyright
 Copyright 2018
 **/

/**
 * Main module-object; references all Gamelab classes.
 * */

console.dev = function (tag, object) {

  var psuedoType = "--unknown";

  switch (typeof object === "undefined" ? "undefined" : _typeof(object)) {
    case "string":
    case "number":
    case "boolean":
    case "null":
      psuedoType = typeof object === "undefined" ? "undefined" : _typeof(object);
    default:
      {
        if ((typeof object === "undefined" ? "undefined" : _typeof(object)) == 'object') psuedoType = object.constructor.name;
      }
  }

  if (Gamelab.DEV) console.info('gamelab::', tag, {
    data_type: psuedoType,
    object: object
  });
};

var delay = function delay(f, duration) {
  setTimeout(f, duration);
};

var repeat = function repeat(f, duration) {
  setInterval(f, duration);
};

//Gamelab: the main module object:
var Gamelab_Module = function Gamelab_Module() {
  var _module;

  var module = (_module = {

    settings: {

      DEBUG: false,

      gui_mode: true,

      recursionCount: 0,

      errorLimit: 20
    },

    errors: 0,

    stopDraw: false,

    defSize: function defSize() {
      if (this.WIDTH == 0) {
        this.WIDTH = document.body.clientWidth;
      }

      if (this.HEIGHT == 0) {
        this.HEIGHT = document.body.clientHeight;
      }
    },
    getGameWindow: function getGameWindow() {
      var ix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      return this.game_windows[0];
    },


    WIDTH: 0,

    HEIGHT: 0,

    game_windows: [],

    gs_renderables: [],

    gs_events: [],

    spriteTypes: [],

    systemSpriteTypes: ['player', 'enemy', 'background', 'interactive', 'terrain', 'weapon', 'subsprite'],

    __gameWindowList: [],

    all: function all() {

      var all_objects = [];

      this.game_windows.forEach(function (item) {

        all_objects = all_objects.concat(item.drawables);
      });

      console.info('Gamelab.all():', all_objects);

      return all_objects;
    },

    init: function init() {

      this.testSquare = new Gamelab.Sprite();
    },

    objectDestroyed: function objectDestroyed(obj) {
      var dead = true;

      for (var x in this.game_windows) {
        var gw = this.game_windows[x];

        for (var y in gw.objects) {
          if (gw.objects[y] === obj) dead = false;
        }
      }

      return dead;
    },
    getObjectById: function getObjectById(id) {

      for (var x = 0; x < this.all_objects.length; x++) {
        if (this.all_objects[x].id == id) {

          return this.all_objects[x];
        }
      }
    },


    interlog: function interlog(message, div) //recursive safe :: won't go crazy with recursive logs :: log message every x times this is called
    {
      this.recursionCount++;

      if (!isNaN(div) && this.settings.recursionCount % div == 0) {
        //   console.log('Interval Log:'+  message);
      }
    },

    create_id: function create_id() {
      var S4 = function S4() {
        return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
      };
      return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
    },

    error: function error(quit, message) {

      if (quit) {
        throw new Error(message);
      } else {
        console.error('E!' + message);
      }
    },

    info: function info(m) {

      if (Gamelab.DEBUG) {
        console.info('Info:' + m);
      }
    },

    log: function log(m) {

      if (Gamelab.DEBUG) {
        console.log('Gamelab:' + m);
      }
    },

    initializers: [],

    addInitializer: function addInitializer(i) {

      this.initializers.push(i);
    },

    Collision: {
      boxesCollide: function boxesCollide(pos1, size1, pos2, size2) {

        return pos1.x >= pos2.x - size1.x && pos1.x <= pos2.x + size2.x && pos1.y >= pos2.y - size1.y && pos1.y <= pos2.y + size2.y;
      },
      spriteBoxesCollide: function spriteBoxesCollide(obj1, obj2, gw) {
        gw = gw || Gamelab.game_windows[0];

        var camPos = new Gamelab.Vector(0, 0, 0);

        obj1.padding = obj1.padding || new Gamelab.Vector(0, 0, 0);

        var paddingX = Math.round(obj1.padding.x * obj1.size.x),
            paddingY = Math.round(obj1.padding.y * obj1.size.y),
            left = obj1.position.x + paddingX + camPos.x,
            right = obj1.position.x + obj1.size.x - paddingX + camPos.x,
            top = obj1.position.y + camPos.y + paddingY,
            bottom = obj1.position.y + obj1.size.y - paddingY + camPos.y;

        if (right > obj2.position.x && left < obj2.position.x + obj2.size.x && bottom > obj2.position.y && top < obj2.position.y + obj2.size.y) {

          return true;
        }
      },
      spriteBoxesCollideTop: function spriteBoxesCollideTop(obj1, obj2, gw) {
        gw = gw || Gamelab.game_windows[0];

        var camPos = new Gamelab.Vector(0, 0, 0);

        obj1.padding = obj1.padding || new Gamelab.Vector(0, 0, 0);

        var paddingX = Math.round(obj1.padding.x * obj1.size.x),
            paddingY = Math.round(obj1.padding.y * obj1.size.y),
            left = obj1.position.x + paddingX + camPos.x,
            right = obj1.position.x + obj1.size.x - paddingX + camPos.x,
            top = obj1.position.y + camPos.y + paddingY,
            bottom = obj1.position.y + obj1.size.y - paddingY + camPos.y;

        if (right > obj2.position.x && left < obj2.position.x + obj2.size.x && bottom > obj2.position.y && top < obj2.position.y + obj2.size.y) {

          return true;
        }
      },


      /*
       *
       *  ##Not known to be working -->> Below function
       *
       * */

      pixelsCollide: function pixelsCollide(sourceSprite, targetSprite, gw) {
        gw = gw || Gamelab.game_windows[0];

        var camPos = new Gamelab.Vector(0, 0, 0);

        /* Box model detection, return true on collision */
        function hitBox(source, target) {
          /* Source and target objects contain x, y and width, height */
          return !(source.y + source.height < target.y || source.y > target.y + target.height || source.x + source.width < target.x || source.x > target.x + target.width);
        }

        var source = {

          position: sourceSprite.position,

          pixelMap: sourceSprite.selected_animation.pixelMap

        },
            target = {

          position: targetSprite.position,

          pixelMap: targetSprite.selected_animation.pixelMap

        };

        // Loop through all the pixels in the source image
        for (var s = 0; s < source.pixelMap.length; s++) {
          var sourcePixel = source.pixelMap[s];
          // Add positioning offset
          var sourceArea = {
            x: sourcePixel.x + sourceSprite.position.x,
            y: sourcePixel.y + sourceSprite.position.y,
            width: 1,
            height: 1
          };

          var relatedPixel;

          // Loop through all the pixels in the target image
          for (var t = 0; t < target.pixelMap.length; t++) {
            var targetPixel = target.pixelMap[t];
            // Add positioning offset
            var targetArea = {
              x: targetPixel.x + targetSprite.position.x,
              y: targetPixel.y + targetSprite.position.y,
              width: 1,
              height: 1
            };

            /* Use the earlier aforementioned hitbox function */
            if (hitBox(sourceArea, targetArea)) {
              return true;
            }
          }
        }
      }
    },

    _gameWindow: {},

    setGameWindow: function setGameWindow(gameWindow) {
      this._gameWindow = gameWindow;
    },

    ExtendEvents: function ExtendEvents(extendedObject, extendedKey, extendor, extendorKey) {
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

    removeOffscreenObjects: function removeOffscreenObjects(gw) {

      gw = gw || Gamelab.game_windows[0];

      Gamelab.each(Gamelab.all_objects, function (ix, item) {

        if (item instanceof Gamelab.Sprite && item.onScreen() == false && !item.__keepAlive && !item.keepAlive) {

          gw.remove(item);
        }
      });
    },

    removeDeadObjects: function removeDeadObjects(gw) {

      gw = gw || Gamelab.game_windows[0];

      Gamelab.each(Gamelab.all_objects, function (ix, item) {

        if (item instanceof Gamelab.Sprite && item.isDead()) {

          // console.log('removing:' + item.image.domElement.src);
          gw.remove(item);
        }
      });
    }

  }, _defineProperty(_module, "getGameWindow", function getGameWindow() {

    return this._gameWindow;
  }), _defineProperty(_module, "assignAll", function assignAll(object, args, keys) {

    __gamelabInstance.each(keys, function (ix, item) {

      object[ix] = args[ix];
    });
  }), _defineProperty(_module, "each", function each(list, onResult, onComplete) {
    for (var i in list) {
      onResult(i, list[i]);
    }

    if (typeof onComplete === 'function') {
      onComplete(false, list);
    };
  }), _defineProperty(_module, "ready_callstack", []), _defineProperty(_module, "ready", function ready(callback) {

    this.ready_callstack.push(callback);
  }), _defineProperty(_module, "reload", function reload() {

    this.callReady();
  }), _defineProperty(_module, "callReady", function callReady() {

    var funx = this.ready_callstack;

    var gameWindow = this.game_windows[0],
        module = this;

    //call every function in the ready_callstack

    this.each(funx, function (ix, call) {

      call(module, gameWindow);
    });

    this.InputSystem.init();

    this.__running = true;
  }), _defineProperty(_module, "getArg", function getArg(args, keys, fallback) {

    if (typeof keys == 'string') {
      keys = [keys]; //always array
    }
    for (var x = 0; x < keys.length; x++) {
      var k = keys[x];

      if (args && args.hasOwnProperty(k)) {
        return args[k]; //return first argument match
      }
    }
    return fallback;
  }), _defineProperty(_module, "normalArgs", function normalArgs(args) {

    var a = {};

    function normal(str) {
      return str.toLowerCase().replace('-', '').replace(' ', '').replace('_', '');
    };

    for (var x in args) {
      a[normal(x)] = args[x];
    }

    return a;
  }), _defineProperty(_module, "isNormalStringMatch", function isNormalStringMatch(str1, str2) {

    return str1.toLowerCase().replace(' ', '') == str2.toLowerCase().replace(' ', '');
  }), _defineProperty(_module, "instance_type_pairs", function instance_type_pairs() {

    //get an array of all instance/type pairs added to the library

    //example : [ {constructor_name:Sprite, type:enemy_basic}, {constructor_name:Animation, type:enemy_attack}  ];

    var objectList = [];

    this.each(this.all_objects, function (ix, item) {

      objectList.push({
        constructor_name: item.constructor.name,
        type: item.type
      });
    });

    return objectList;
  }), _defineProperty(_module, "getById", function getById(id) {

    for (var x in this.all_objects) {
      if (this.all_objects[x].id == id) {
        return this.all_objects[x];
      }
    }
  }), _defineProperty(_module, "select", function select(constructor_name, name, group /*ignoring spaces and CAPS/CASE on type match*/) {

    var query = [];

    var __inst = this;

    this.each(Gamelab.all(), function (ix, item) {

      if (constructor_name == '*' || item.constructor.name == constructor_name) {

        if (group == '*' || __inst.isNormalStringMatch(group, item.group)) {

          if (name == '*' || __inst.isNormalStringMatch(name, item.name)) {

            query.push(item);
          }
        }
      }
    });

    return query;
  }), _module);

  return module;
};

var GamelabApi = {
  get: function get() {},

  post: function post(object) {
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

var GSO //Gamelab-Overrideable
= function () {
  function GSO() {
    var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, GSO);

    this.run_ext = args.run_ext || [];

    this.complete_ext = args.complete_ext || [];
  }

  /*****
   * Overridable / Extendable functions
   * -allows stacking of external object-function calls
   ******/

  _createClass(GSO, [{
    key: "onRun",
    value: function onRun(caller, callkey) {
      this.run_ext = this.run_ext || [];

      if (this.run_ext.indexOf(caller[callkey]) == -1) {
        this.run_ext.push({
          caller: caller,
          callkey: callkey
        });
      }
    }
  }, {
    key: "onComplete",
    value: function onComplete(caller, callkey) {
      this.complete_ext = this.complete_ext || [];

      if (this.complete_ext.indexOf(caller[callkey]) == -1) {
        this.complete_ext.push({
          caller: caller,
          callkey: callkey
        });
      }
    }
  }, {
    key: "call_on_run",
    value: function call_on_run() {
      //call any function extension that is present
      for (var x = 0; x < this.run_ext.length; x++) {
        this.run_ext[x].caller[this.run_ext[x].callkey]();
      }
    }
  }, {
    key: "call_on_complete",
    value: function call_on_complete() {
      //call any function extension that is present
      for (var x = 0; x < this.complete_ext.length; x++) {
        this.complete_ext[x].caller[this.complete_ext[x].callkey]();
      }
    }
  }]);

  return GSO;
}();

var Gamelab = Gamelab_Module();

Gamelab.DEV = true;

if (typeof module !== 'undefined' && module.exports) {

  //This library is being instaniated via require() aka node.js require or similar library loader
  module.exports = Gamelab;
} else {}

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

    if (selector instanceof Array) {} else {}
  } else {

    if (selector && selector !== '*') {

      var s = selector || '';

      console.info('selector:' + s);

      var mainSelector = $Q.before('[', s).trim(),
          msfChar = mainSelector.substring(0, 1);

      var __targetClassName = "*";

      var output = [];

      var cleanSelectorString = function cleanSelectorString(str) {
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

      var getParts = function getParts() {

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

  query.each = function (callback) {

    var objects = [];

    for (var x = 0; x < this.length; x++) {
      if (typeof x == 'number') {

        callback(x, this[x]);
      }
    }
  };

  query.on = function (evt_key, selectorObject, controller_ix, callback) //handle each event such as on('collide') OR on('stick_left_0') << first controller stick_left
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

      Gamelab.GamepadAdapter.on(evt_profile.evt_key, 0, function (x, y) {

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

        this.each(function (ix, item1) {

          // console.info('Collision Processing 1:' + item1.name);
          //  console.info('Collision Processing 1:' + item1.type);

          selectorObject.each(function (iy, item2) {

            //    console.info('Collision Processing 2:' + item2.name);
            //   console.info('Collision Processing 2:' + item2.type);

            if (typeof item1.onUpdate == 'function') {

              var update = function update(sprite) {

                if (this.hasBoxCollision(item2, padding)) {

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

        var run = function run() {
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

            run = function run(obj, key) {
              if (obj[key] >= number) {
                callback();
              }
            };

            break;

          case "<=":

            run = function run(obj, key) {
              if (obj[key] <= number) {
                callback();
              }
            };

            break;

          case ">":

            run = function run(obj, key) {
              if (obj[key] > number) {
                callback();
              }
            };

            break;

          case "<":

            run = function run(obj, key) {
              if (obj[key] < number) {
                callback();
              }
            };

            break;

          case "=":

            run = function run(obj, key) {
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

        this.each(function (ix, item) {

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

            item.onUpdate(function (sprite) {

              run(object, propkey);
            });
          }
        });
      }
  };

  return query;
}

$Q.each = function (obj, callback, complete) {

  for (var x in obj) {
    callback(obj);
  }

  if (typeof complete == 'function') {
    complete(obj);
  }
};

$Q.before = function (c1, test_str) {
  var start_pos = 0;
  var end_pos = test_str.indexOf(c1, start_pos);
  return test_str.substring(start_pos, end_pos);
};

$Q.contains = function (c1, test_str) {
  return test_str.indexOf(c1) >= 0;
};

$Q.contains_all = function (cList, test_str) {
  for (var x = 0; x < cList.length; x++) {
    if (test_str.indexOf(cList[x]) < 0) {
      return false;
    }
  }

  return true;
};

$Q.contains_any = function (cList, test_str) {

  for (var x = 0; x < cList.length; x++) {
    if (test_str.indexOf(cList[x]) >= 0) {
      return true;
    }
  }

  return false;
};

$Q.after = function (c1, test_str) {
  var start_pos = test_str.indexOf(c1) + 1;
  var end_pos = test_str.length;
  return test_str.substring(start_pos, end_pos);
};

$Q.between = function (c1, c2, test_str) {
  var start_pos = test_str.indexOf(c1) + 1;
  var end_pos = test_str.indexOf(c2, start_pos);
  return test_str.substring(start_pos, end_pos);
};

/****************************************
 *  Developer's own test-function:
 *      -Q.test_selector_method():
 * ***************************************/

$Q.test_selector_method = function () {
  //leftover method of hand-testing
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
    setPosition: function setPosition(x, y) {

      this.Speed.x = x - this.Position.x;

      this.Speed.y = y - this.Position.y;

      this.Position.x = x;

      this.Position.y = y;
    },

    isIdle: function isIdle() {
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

  keyReplace: function keyReplace(str) {
    return str.toLowerCase().replace('space', ' ').replace('left', String.fromCharCode(37)).replace('left', String.fromCharCode(37)).replace('up', String.fromCharCode(38)).replace('right', String.fromCharCode(39)).replace('down', String.fromCharCode(40));
  },

  extendKey: function extendKey(evt_key, _callback, onFinish) {

    evt_key = this.keyReplace(evt_key);

    Gamelab.InputSystem.keymap[evt_key] = {

      down: false,

      callback: function callback() {
        _callback(evt_key);
      }
    };

    return Gamelab.InputSystem.keymap[evt_key];
  },

  extend: function extend(evt_key, downCall, upCall, onFinish) {

    evt_key = evt_key.toLowerCase();

    //each event-group has object-type
    Gamelab.InputSystem.events[evt_key] = Gamelab.InputSystem.events[evt_key] || [];

    Gamelab.InputSystem.events[evt_key].push({

      down: downCall,

      up: upCall

    });
  },

  init: function init() {

    var MOUSE = this.Mouse;

    window.setInterval(function () {

      Gamelab.each(Gamelab.InputSystem.keymap, function (im, kmapItem) {

        if (kmapItem.down == true) {

          kmapItem.callback();
        }
      });
    }, 10);

    document.onkeydown = document.onkeyup = function (e) {

      e = e || event; // to deal with IE

      var gs_key_string = 'key_' + String.fromCharCode(e.keyCode),
          evt_object = Gamelab.InputSystem['keymap'][gs_key_string] || Gamelab.InputSystem['keymap'][gs_key_string.toLowerCase()];

      if (evt_object) {
        evt_object.down = e.type == 'keydown';
      }
    };

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

    var InputSystem = Gamelab.InputSystem;

    function mouseMoving(event, c) {

      var pos = getMousePos(event, c);

      MOUSE.setPosition(pos.x, pos.y);

      if (InputSystem.events['mousemove']) {
        Gamelab.each(InputSystem.events['mousemove'], function (ix, el) {

          el.down(pos.x, pos.y);
        });
      }
    };

    //Interval for mouse-idle time : run mouse move again with same position, no difference
    setInterval(function () {

      if (InputSystem.events['mousepos']) {

        var pos = MOUSE.Position;

        Gamelab.each(InputSystem.events['mousepos'], function (ix, el) {

          el.down(pos.x, pos.y);
        });
      }
    }, 10);

    for (var x = 0; x < canvases.length; x++) {
      var applyMouseMove = function applyMouseMove(e) {
        mouseMoving(e, c);
      };

      var c = canvases[x];

      console.info('Gamelab-lib-code:main.js: InputSystem applying mousemove');

      document.addEventListener("mousemove", applyMouseMove);

      c.onmousedown = function (e) {
        //    alert(JSON.stringify(Gamelab.InputSystem, true, 2));

        var value = e.which;
        var pos = getMousePos(e, c);
        var InputSystem = Gamelab.InputSystem;

        e.preventDefault();

        switch (e.which) {
          case 1:

            for (var x in InputSystem.events) {

              if (InputSystem.events[x] instanceof Array && x == 'leftclick') {

                Gamelab.each(InputSystem.events[x], function (ix, el) {

                  el.down(pos.x, pos.y);
                });
              }
            }

            break;
          case 2:
            // alert('Middle Mouse button pressed.');

            for (var x in Gamelab.InputSystem.events) {

              if (InputSystem.events[x] instanceof Array && x == 'middleclick') {

                Gamelab.each(InputSystem.events[x], function (ix, el) {

                  el.down(pos.x, pos.y);
                });
              }
            }
            break;
          case 3:
            //  alert('Right Mouse button pressed.');


            for (var x in Gamelab.InputSystem.events) {

              if (InputSystem.events[x] instanceof Array && x == 'rightclick') {

                Gamelab.each(InputSystem.events[x], function (ix, el) {

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

      c.onmouseup = function (e) {

        //    alert(JSON.stringify(Gamelab.InputSystem, true, 2));

        var value = e.which;
        var pos = getMousePos(e, c);
        var InputSystem = Gamelab.InputSystem;

        e.preventDefault();

        switch (e.which) {
          case 1:

            for (var x in InputSystem.events) {

              if (InputSystem.events[x] instanceof Array && x == 'leftclick') {

                Gamelab.each(InputSystem.events[x], function (ix, el) {

                  el.up(pos.x, pos.y);
                });
              }
            }

            break;
          case 2:
            // alert('Middle Mouse button pressed.');


            for (var x in Gamelab.InputSystem.events) {

              if (InputSystem.events[x] instanceof Array && x == 'middleclick') {

                Gamelab.each(InputSystem.events[x], function (ix, el) {

                  el.up(pos.x, pos.y);
                });
              }
            }
            break;
          case 3:
            //  alert('Right Mouse button pressed.');


            for (var x in Gamelab.InputSystem.events) {

              if (InputSystem.events[x] instanceof Array && x == 'rightclick') {

                Gamelab.each(InputSystem.events[x], function (ix, el) {

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

document.addEventListener('DOMContentLoaded', function () {

  Gamelab.callReady();
});

Gamelab.file_system = {

  localizedSource: function localizedSource(src, hostUrl) {

    hostUrl = hostUrl || "../";

    var gs_folder_ix = src.indexOf('assets/game');

    return hostUrl + src.substring(gs_folder_ix, src.length);
  },

  loadJSON: function loadJSON(filepath, callback) {

    function readTextFile(file, callback) {
      var rawFile = new XMLHttpRequest();
      rawFile.open("GET", file, false);
      rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
          if (rawFile.status === 200 || rawFile.status == 0) {
            var allText = rawFile.responseText;
            callback(JSON.stringify(allText));
          }
        }
      };
      rawFile.send(null);
    };

    readTextFile('file:///' + filepath, callback);
  },

  loadLevel: function loadLevel(jsonText, gw, callback) {

    var data = JSON.parse(jsonText);

    if (typeof gw == 'function' || !gw) {
      callback = gw || callback || function () {};

      gw = Gamelab.game_windows[0];
    }

    $.each(data.sprites, function (ix, xitem) {

      if (typeof xitem.src == 'string') {

        xitem.src = Gamelab.file_system.localizedSource(xitem.src);
      }

      __gamelabInstance.each(xitem, function (iy, yitem) {

        if (yitem.src) {

          yitem.src = Gamelab.file_system.localizedSource(yitem.src);
        }

        __gamelabInstance.each(yitem, function (iz, zitem) {

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

  loadJSONLevel: function loadJSONLevel(filepath, gw, callback) {

    if (typeof gw == 'function' || !gw) {
      callback = gw || callback || function () {};

      gw = Gamelab.game_windows[0];
    }

    this.loadJSON(filepath, function (data) {

      //localize .src up to three levels of recursion (.src must be altered to refer locally)

      $.each(data.sprites, function (ix, xitem) {

        if (typeof xitem.src == 'string') {

          xitem.src = Gamelab.file_system.localizedSource(xitem.src);
        }

        __gamelabInstance.each(xitem, function (iy, yitem) {

          if (yitem.src) {

            yitem.src = Gamelab.file_system.localizedSource(yitem.src);
          }

          __gamelabInstance.each(yitem, function (iz, zitem) {

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

Gamelab.ready(function (lib) {

  Gamelab.log('Gamelab: library is ready');
});

/* Screen */

var Screen = {

  size: function size() {
    return new Gamelab.Vector(Gamelab.WIDTH, Gamelab.HEIGHT);
  },

  center: function center() {
    return new Gamelab.Vector(Gamelab.WIDTH / 2, Gamelab.HEIGHT / 2).round();
  }

};
;
/**************************
  EventInterfaceMap: StringKeys:

    * (must implement without option)
    @ (may implement optional)
*****************************/

var EventInterfaceMap = { //className / must have named functions whyen carrying Symbol of className

  Sprite: ['@onUpdate', '@onDestroy'],

  Animation: ['@onRun', '@onComplete', '*onCollide'],

  Motion: ['@onCommit', '@onComplete', '*onCollide'],

  Shot: ['@onShoot', '*onCollide', '*onCollide'],

  Terrain: ['@onCollide'],

  Interactive: ['@onCollide'],

  Global: ['@onUpdate'],

  check: function check(instance) {
    for (var x in this) {
      if (x == 'check') continue;else {
        if (this[x] instanceof Array) {
          this[x].forEach(function (f) {
            var fkey = f.replace('@', '');
            if (!instance.getOwnPropertyNames.indexOf(fkey) >= 0) throw new Error('Object must implement function by name of:' + fkey);
          });
        }
      }
    };
  }

  /**************************
    ObjectFeatureInterfaceMap:
        Indicates classNames, and what they must carry as functions
  *****************************/

};var ObjectFeatureMap = { //className / must have named function properties when carrying Symbol of className

  Sprite: ['@spatial', '@data'],

  Elipse: ['@spatial'],

  Background: ['@spatial', '@data'],

  Animation: ['@framedriven', '@effectdriven', '@posable', '@data'],

  Line2d: ['@spatial', '@pointarrayflippable', '@selftransposable', '@data'],

  Text: ['@spatial', '@text', '@colored']

};

Gamelab.ObjectFeatureMap = ObjectFeatureMap;

var InputIFM = {

  GamepadButtons: ['@onButton'],

  GamepadSticks: ['@onStick'],

  Keyboard: ['@onKey'],

  MouseMove: ['@onMouseMove'],

  MouseButton: ['@onMouseButton'],

  MouseWheel: ['@onMouseWheel'],

  LeapMotion: ['@onLeapMotion']

};

var UIEditables = {

  Sprite: ['size', 'position', 'rotation'],

  Animation: ['frameBounds', 'etc']

};

var UIOption = function UIOption(name, hint, script) {

  return {
    name: name,
    hint: hint,
    script: script
  };
};

var UIPrefab = {

  MainSelect: {
    Interactive: {

      name: 'FourwayClasticRect',

      hint: 'Object is collideable on four rectangular sides',

      script: '#MY-SCRIPT-PATH'
    }
  },

  FormEditables: {

    Interactive: []
  }
};

var UIPrefabMainSelect = {

  Background: ['Bound']

};

var getCustomPrefabMeta = function getCustomPrefabMeta() {//get name and file/data resources for each custom prefab

};

/**********************************

  UIObjectSelectMap:

    -Just the system default options

*********************************/

var UIObjectPrefabs = {

  Sprite: ['Side-Scroll-Player', 'Collider', 'Spaceship', 'Robot']

};
;

var SymbolSlicer = function () {
  function SymbolSlicer() {
    _classCallCheck(this, SymbolSlicer);

    if (new.target === SymbolSlicer) {
      throw new TypeError("Cannot construct SymbolSlicer instance directly. Use a subclass instead.");
    }
  }

  _createClass(SymbolSlicer, [{
    key: "on",
    value: function on(object, symbol, callback) {
      var syms = Object.getOwnPropertySymbols(object);

      syms.forEach(function (s) {

        if (Symbol.keyFor(symbol) == s) callback();
      });
    }
  }]);

  return SymbolSlicer;
}();

;

(function () {
  console.log('Camera class... creating');

  /**
   * Creates an instance of 2d-camera to be applied as the viewing-point for a GameWindow.
    * @param {number} x an optional position-x
   * @param {number} y an optional position-y
   * @param {number} z an optional position-z
   * @returns {Camera}
   *
   */

  var Camera = function Camera(x, y, z) {
    _classCallCheck(this, Camera);

    if (isNaN(x)) {
      x = 0;
    }

    if (isNaN(y)) {
      y = 0;
    }

    if (isNaN(z)) {
      z = 0;
    }

    this.position = new Gamelab.Vector(x, y, z);
  };

  Gamelab.Camera = Camera;
})();
;
(function () {
  console.log('Line() class... creating');

  var Curves = { //ALL HAVE INPUT AND OUTPUT OF: 0-1.0
    // no easing, no acceleration
    linearNone: function linearNone(t) {
      return t;
    },

    // accelerating from zero velocity
    easeInQuadratic: function easeInQuadratic(t) {
      return t * t;
    },
    // decelerating to zero velocity
    easeOutQuadratic: function easeOutQuadratic(t) {
      return t * (2 - t);
    },
    // acceleration until halfway, then deceleration
    easeInOutQuadratic: function easeInOutQuadratic(t) {
      return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    // accelerating from zero velocity
    easeInCubic: function easeInCubic(t) {
      return t * t * t;
    },
    // decelerating to zero velocity
    easeOutCubic: function easeOutCubic(t) {
      return --t * t * t + 1;
    },
    // acceleration until halfway, then deceleration
    easeInOutCubic: function easeInOutCubic(t) {
      return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    // accelerating from zero velocity
    easeInQuartic: function easeInQuartic(t) {
      return t * t * t * t;
    },
    // decelerating to zero velocity
    easeOutQuartic: function easeOutQuartic(t) {
      return 1 - --t * t * t * t;
    },
    // acceleration until halfway, then deceleration
    easeInOutQuartic: function easeInOutQuartic(t) {
      return t < .5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
    },
    // accelerating from zero velocity
    easeInQuintic: function easeInQuintic(t) {
      return t * t * t * t * t;
    },
    // decelerating to zero velocity
    easeOutQuintic: function easeOutQuintic(t) {
      return 1 + --t * t * t * t * t;
    },
    // acceleration until halfway, then deceleration
    easeInOutQuintic: function easeInOutQuintic(t) {
      return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
    }
  };

  Gamelab.Curves = Curves;

  var inOutCurves = {

    quadratic: function quadratic(t) {
      return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },

    cubic: function cubic(t) {
      return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },

    quartic: function quartic(t) {
      return t < .5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
    },

    quintic: function quintic(t) {
      return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
    },

    linear: function linear(t) {
      return t;
    } //provided for consistency / in case 'linear' is needed

  };

  Gamelab.Curves.Smooth = inOutCurves;
  Gamelab.Curves.InOut = inOutCurves;
})();
;

var Game = function Game(srcFile) {
  _classCallCheck(this, Game);
};

Gamelab.Game = Game;

;
/**
 * Creates a GameWindow object.
 *
 * <iframe style='width:400px; height:450px; overflow:hidden;' src='../client/examples/js-class/GameWindow.html'> </iframe>
 * @param   {Object} canvas the canvas element for this gameWindow. --GameWindow's if not supplied, the constructor will create a full-screen canvas, if a canvas.
  * @param   {Object} drawables the drawable objects to be drawn. --Drawables can also be added after constructor call.
 * @returns {GameWindow} a Gamelab.GameWindow object
 * */

var GameWindow = function () {
  function GameWindow() {
    var canvas = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var drawables = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    _classCallCheck(this, GameWindow);

    this.drawables = drawables;

    this.bool_events = Gamelab.bool_events || [];

    this.canvas = canvas || false;

    if (!canvas) {
      console.info('GameWindow() had no {canvas:canvas} argument. Creating a new canvas in document.body...');
      this.canvas = document.createElement('CANVAS');
      this.canvas.setAttribute('class', 'gamewindow');
      document.body.append(this.canvas);
    }

    this.context = this.canvas.getContext('2d');

    document.body.style.position = "absolute";

    document.body.style.width = "100%";

    document.body.style.height = "100%";

    this.camera = new Gamelab.Camera();

    this.camera.target = false;

    Gamelab.camera = this.camera;

    var __inst = this;

    this.Size();

    this.update_ext = [];

    window.onresize = function () {

      if (__inst.isAbsoluteSize) return;

      __inst.Size();
    };

    this.ctx = this.canvas.getContext('2d');

    Gamelab.game_windows.push(this);

    window.onerror = function () {

      Gamelab.errors += 1;

      console.log('Canvas Error --');

      if (Gamelab.errors > Gamelab.settings.errorLimit) {
        Gamelab.stopDraw = true;

        var call = call || window.setTimeout(function () {

          if (call) {
            window.clearTimeout(call);
          }
          console.log('%cDraw stopped at errorLimit:' + Gamelab.settings.errorLimit, 'color:darkorange;');
        }, 200);
      }
    };
  }

  /**
   * returns the gameWindow.canvas property, an HTMLCanvasElement
   *
   * @function
   * @memberof GameWindow
   **********/

  _createClass(GameWindow, [{
    key: "getCanvas",
    value: function getCanvas() {
      return this.canvas;
    }

    /**
     * returns a vector(x, y) showing the center of the GameWindow
     *
     * @function
     * @memberof GameWindow
     **********/

  }, {
    key: "center",
    value: function center() {

      return new Gamelab.Vector(Math.round(this.canvas.width / 2), Math.round(this.canvas.height / 2));
    }
  }, {
    key: "TrackStat",
    value: function TrackStat() {

      this.__trackStat = true;
      return this;
    }

    /**
     * creates an array of gridUnits
     *
     * @function
     * @memberof GameWindow
     **********/

  }, {
    key: "GridStyle",
    value: function GridStyle(total_x, total_y, w, h, srcImage_Path) {

      if (!(this.grid instanceof Array)) {
        this.grid = [];
      }

      function GridUnit(x, y, w, h, srcImage_Path) {

        var size = new Gamelab.Vector(w, h),
            position = new Gamelab.Vector(x, y);

        var sprite;

        if (srcImage_Path) {
          sprite = new Gamelab.Sprite(srcImage_Path);
          sprite.Size(size);
          sprite.Pos(position);

          Gamelab.game_windows[0].add(sprite);
        }

        return {
          size: size,
          position: position
        };
      };

      for (var y = 0; y < total_y; y++) {

        for (var x = 0; x < total_x; x++) {

          this.grid.push(new GridUnit(x * w, y * h, w, h, srcImage_Path));
        }
      }
      return this;
    }
  }, {
    key: "getCanvas",
    value: function getCanvas() {
      return this.canvas;
    }

    /**
     * adds an update to the GameWindow:: update to be called every 20 milliseconds
     *
     * @function
     * @memberof GameWindow
     **********/

  }, {
    key: "onUpdate",
    value: function onUpdate(f) {

      this.update_ext.push(f);
    }

    /**
     * the main update for the GameWindow:: called automatically after call of GameWindow.start() or GameWindow.animate()
     *
     * @function
     * @memberof GameWindow
     **********/

  }, {
    key: "update",
    value: function update() {

      Gamelab.each(this.drawables, function (ix, item) {

        if (item && typeof item.def_update == 'function') {

          item.def_update(item);
        }

        if (item && typeof item.update == 'function') {
          item.update(item);
        }

        if (item && ['SpriteArray', 'RobotixArray', 'RobotixVerticalChain'].indexOf(item.constructor.name) >= 0 && typeof item.each == 'function') {

          item.each(function (ix, graphic) {

            graphic.update(graphic);
          });
        }
      });

      Gamelab.each(this.bool_events, function (ix, item) {

        if (item && item.bool()) {
          item.callback();
        }
      });

      for (var x in this.update_ext) {
        this.update_ext[x]();
      }
    }
  }, {
    key: "draw",
    value: function draw() {

      var __gameWindow = this;

      if (this.before_draw_ext) {
        this.before_draw_ext();
      }

      Gamelab.each(this.drawables, function (ix, item) {

        if (typeof item.draw == 'function') {
          item.draw(__gameWindow.ctx, __gameWindow.camera);
        }
      });

      if (this.after_draw_ext) {
        this.after_draw_ext();
      }
    }

    /**
     * adds a call before the GameWindow draw()
     *
     * @function
     * @memberof GameWindow
     **********/

  }, {
    key: "onBeforeDraw",
    value: function onBeforeDraw(f) {

      var boundCall = f.bind(this);

      if (!this.before_draw_ext) this.before_draw_ext = function () {};

      var beforeDraw = this.before_draw_ext.bind(this);

      this.before_draw_ext = function () {
        beforeDraw();
        boundCall();
      };
    }

    /**
     * adds a call after the GameWindow draw()
     *
     * @function
     * @memberof GameWindow
     **********/

  }, {
    key: "onAfterDraw",
    value: function onAfterDraw(f) {

      var boundCall = f.bind(this);

      if (!this.after_draw_ext) this.after_draw_ext = function () {};

      var afterDraw = this.after_draw_ext.bind(this);

      this.after_draw_ext = function () {
        afterDraw();
        boundCall();
      };
    }

    /**
     * sets the size of the GameWindow
     *
     * @function
     * @param {integer} w the width of the GameWindow
     * @param {integer} h the HEIGHT of the GameWindow
     * @memberof GameWindow
     **********/

  }, {
    key: "Size",
    value: function Size(w, h, isAbsoluteSize) {
      //call with no args to fill to browser-window-size;

      w = w || this.canvas.parentNode.clientWidth;

      h = h || this.canvas.parentNode.clientHeight;

      var c = this.canvas;

      if (c) {
        c.setAttribute('width', w);
      };

      if (c) {
        c.setAttribute('height', h);
      };

      Gamelab.WIDTH = w;

      Gamelab.HEIGHT = h;

      this.canvas.width = w;

      this.canvas.height = h;

      this.size = new Gamelab.Vector(w, h);

      this.isAbsoluteSize = isAbsoluteSize || false;

      return this;
    }

    /**
     * adds an object to the GameWindow
     *
     * @function
     * @param {Object} obj the object to be added (Sprite)
     * @param {Boolean} onBottom if true, adds to the bottom of layer-stack in GameWindow
     * @memberof GameWindow
     **********/

  }, {
    key: "add",
    value: function add(obj) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


      var optionsGuide = {
        obj: 'The Object{} being added into play',
        options: {
          position: 'The Vector(x, y) offset to use when drawing the obj'
        }
      };

      console.info('GameWindow.add() --2nd argument options is object of arguments >>>', optionsGuide);

      var layer = options.layer || this.drawables.length - 1;

      if (!(typeof layer == 'number' && layer >= 0)) layer = this.drawables.length;

      var offset = new Gamelab.Vector(0, 0);

      if (options.position) offset = options.position;

      obj.window_offset = offset;

      //1: if Sprite(), Add object to the existing __gameWindow

      var __inst = this;

      if (obj instanceof Gamelab.Camera) {

        this.camera = obj;
      } else if (obj instanceof Gamelab.GSEvent) {

        if (Gamelab.__running) {

          return console.error('Events can only be added before Gamstack.animate() is called::aka before the main update / loop begins');
        } else {

          obj.apply();
        }
      } else {

        this.drawables.splice(layer, 0, obj);
      };

      return obj;
    }

    /**
     * set background-color of GameWindow
     *
     * @function
     * @param {string} c the new background-color for GameWindow
     * @memberof GameWindow
     **********/

  }, {
    key: "Background",
    value: function Background(c) {
      this.canvas.style.background = c;

      this.canvas.style.backgroundColor = c;

      return this;
    }

    /**
     * removes an object from the GameWindow
     *
     * @function
     * @param {Object} obj the object to be removed (Sprite)
     * @memberof GameWindow
     **********/

  }, {
    key: "remove",
    value: function remove(obj) {

      var ix = this.drawables.indexOf(obj);

      if (ix >= 0) {
        this.drawables.splice(ix, 1);
      }
    }

    /**
     * begins the animation-loop of GameWindow.
     *
     * @function
     * @param {number} time optional time parameter for usage with Tween
     * @memberof GameWindow
     **********/

  }, {
    key: "animate",
    value: function animate(time) {

      var __inst = this;

      requestAnimationFrame(function () {

        __inst.animate();
      });

      if (this.__stats) {
        this.__stats.begin();
        this.__statsMS.begin();
        this.__statsMB.update();
      }

      Gamelab.isAtPlay = true;

      if (window.TWEEN) TWEEN.update(time);

      __inst.update();

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.draw();

      if (this.__stats) {
        this.__stats.end();
        this.__statsMS.end();
      }
    }

    /**
     * begins the animation-loop of GameWindow, with performance Stats shown on-screen
     *
     * @function
     * @memberof GameWindow
     **********/

  }, {
    key: "start",
    value: function start() {

      if (typeof Stats == 'function') //Stats library exists
        {
          //basic stat animation
          this.__stats = new Stats();
          this.__stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom

          this.__stats.dom.style.left = '10%';

          this.__stats.dom.setAttribute('class', 'stat');

          this.canvas.parentNode.appendChild(this.__stats.dom);

          //basic stat animation
          this.__statsMS = new Stats();
          this.__statsMS.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom

          this.__statsMS.dom.style.left = '10%';

          this.__statsMS.dom.style.marginLeft = '90px';

          this.__statsMS.dom.setAttribute('class', 'stat');

          this.canvas.parentNode.appendChild(this.__statsMS.dom);

          //basic stat animation
          this.__statsMB = new Stats();
          this.__statsMB.showPanel(2); // 0: fps, 1: ms, 2: mb, 3+: custom

          this.__statsMB.dom.style.left = '10%';

          this.__statsMB.dom.setAttribute('class', 'stat');

          this.__statsMB.dom.style.marginLeft = '180px';

          this.canvas.parentNode.appendChild(this.__statsMB.dom);
        }

      this.animate();
    }
  }]);

  return GameWindow;
}();

Gamelab.GameWindow = GameWindow;
;

console.info('Module class :: keep as public');

var Module = function () {
  function Module(uri, callback) {
    _classCallCheck(this, Module);

    this.load(uri, callback);
  }

  _createClass(Module, [{
    key: "load",
    value: function load(uri, callback) {

      var __object = this;

      callback = callback || function () {};

      callback = callback.bind(this);

      var script = document.createElement('SCRIPT');
      script.src = uri;

      //define onload fxn
      script.onload = function () {

        var construct = window.module.exports;
        callback(construct);
      };

      //append to the document
      document.head.appendChild(script);
    }
  }]);

  return Module;
}();

;

Gamelab.Module = Module;
;

/**
 * Creates an instance of Rectangle.
 * @param   {Gamelab.Vector} min the minimum vector point (x,y)
 * @param   {Gamelab.Vector} max the maximum vector point (x,y)
 *
 * @returns {Rectangle} a Rectangle object
 */

var Rectangle = function () {
  function Rectangle(min, max) {
    _classCallCheck(this, Rectangle);

    this.min = new Gamelab.Vector(min);
    this.max = new Gamelab.Vector(max);
  }

  _createClass(Rectangle, [{
    key: "toLine",
    value: function toLine() {}
  }]);

  return Rectangle;
}();

;

var VectorBounds = Rectangle;

Gamelab.VectorBounds = VectorBounds;

Gamelab.Rectangle = Rectangle;

/**
 * Takes the min and max vectors plus termPoint ('termination-point'), returns VectorFrameBounds
 *  *use this to define the bounds of an Animation object.
 * @param   {Vector} min the minimum vector point (x,y)
 * @param   {Vector} max the maximum vector point (x,y)
 * @param   {Vector=} termPoint the optional termination vector point (x,y) : defaults to the value of 'max'
 * -While a min and max Gamelab.Vector(x,y) will describe the grid-size of Animation frames,
 * the termPoint will indicate the last frame on-grid for this set of frames --Animation may stop early on the 'grid')
 * @returns {VectorFrameBounds} a VectorFrameBounds object
 */

var VectorFrameBounds = function (_Rectangle) {
  _inherits(VectorFrameBounds, _Rectangle);

  function VectorFrameBounds(min, max, termPoint) {
    _classCallCheck(this, VectorFrameBounds);

    var _this = _possibleConstructorReturn(this, (VectorFrameBounds.__proto__ || Object.getPrototypeOf(VectorFrameBounds)).call(this, min, max));

    _this.termPoint = termPoint || new Gamelab.Vector(_this.max.x, _this.max.y, _this.max.z);

    return _this;
  }

  return VectorFrameBounds;
}(Rectangle);

;

Gamelab.VectorFrameBounds = VectorFrameBounds;

var GeoMath = {

  rotatePointsXY: function rotatePointsXY(x, y, angle) {

    var theta = angle * Math.PI / 180;

    var point = {};
    point.x = x * Math.cos(theta) - y * Math.sin(theta);
    point.y = x * Math.sin(theta) + y * Math.cos(theta);

    point.z = 0;

    return point;
  }

};

Gamelab.GeoMath = GeoMath;
;

/**
 * Renderable : consistent base-type for graphic-objects
 * @param   {Object} args the object of arguments
 * @returns {Renderable} a Gamelab.Renderable object.
 * */

var Renderable = function Renderable() {
  //  Gamelab.FeatureInject(this, args);

  var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  _classCallCheck(this, Renderable);
};

/**
 * A game-image object based on HTMLImage element. Creates GameImage, attaches gameImage.domElement --an instance of HTMLImageElement
 * @param   {string} src the sourcePath of the image-file.
 * @returns {GameImage} a Gamelab.GameImage object.
 * */

var GameImage = function (_Renderable) {
  _inherits(GameImage, _Renderable);

  function GameImage() {
    var src = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var onCreate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
      I('image: applied default arg to onCreate():');
    };

    _classCallCheck(this, GameImage);

    var _this2 = _possibleConstructorReturn(this, (GameImage.__proto__ || Object.getPrototypeOf(GameImage)).call(this, src));

    if ((typeof src === "undefined" ? "undefined" : _typeof(src)) == 'object') {
      var _ret;

      return _ret = src, _possibleConstructorReturn(_this2, _ret);
    }

    console.dev('GameImage--', _this2);

    _this2.domElement = document.createElement('IMG');

    _this2.domElement.src = src;

    _this2.domElement.onerror = function () {
      this.__error = true;
      console.dev('--image error');
    };

    return _this2;
  }

  return GameImage;
}(Renderable);

;

Gamelab.GameImage = GameImage;
;

console.info('Scriptable class :: keep as public');
console.info('Script class :: keep as public');

var Script = function () {
  function Script(uri, callback) {
    _classCallCheck(this, Script);

    this.src = uri || '';

    if (uri && callback) {
      this.load(uri, callback);
    } else {
      console.info('Created Script() without uri + callback --1st and 2nd arguments. To use object call script.load()');
    }
  }

  _createClass(Script, [{
    key: "load",
    value: function load(uri, callback) {

      var __object = this;

      callback = callback || function () {};

      callback = callback.bind(this);

      var script = document.createElement('SCRIPT');
      script.src = uri;

      //define onload fxn
      script.onload = function () {

        var construct = window.module.exports;
        callback(construct);
      };

      //append to the document
      document.head.appendChild(script);
    }
  }]);

  return Script;
}();

;

Gamelab.Script = Script;

var Scriptable = function () {
  function Scriptable(object, siblings) {
    _classCallCheck(this, Scriptable);

    this.object = object;

    this.siblings = siblings;
  }

  _createClass(Scriptable, [{
    key: "Object",
    value: function Object(object) {
      this.object = object;
      return this;
    }
  }, {
    key: "load",
    value: function load(url, callback) {

      var __object = this;

      callback = callback || function () {};

      callback = callback.bind(this);

      var script = document.createElement('SCRIPT');
      script.src = url;

      //define onload fxn
      script.onload = function () {

        var construct = window.module.exports;

        var MOD = construct(__object.object, __object.siblings);

        callback.bind(__object).call(MOD, __object.object, __object.siblings);
      };

      //append to the document
      document.head.appendChild(script);
    }
  }]);

  return Scriptable;
}();

;

Gamelab.Scriptable = Scriptable;
;

var Elipse = function () {
  function Elipse(pos, size) {
    _classCallCheck(this, Elipse);

    this.position = new Gamelab.Vector(0, 0, 0);
    this.size = new Gamelab.Vector(0, 0, 0);
    this.rotation = new Gamelab.Vector(0, 0, 0);
    this.Pos(pos);
    this.Size(size);
  }

  _createClass(Elipse, [{
    key: "draw",
    value: function draw() {
      var halfX = this.size.x / 2;
      var halfY = this.size.y / 2;
      Gamelab.Canvas.arc(this.position, new Gamelab.Vector(halfX, halfY));
    }
  }]);

  return Elipse;
}();

Gamelab.Elipse = Elipse;
;

var Trigonometry = {

  rotate_from_xy: function rotate_from_xy(cx, cy, x, y, angle) {
    var radians = Math.PI / 180 * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = cos * (x - cx) + sin * (y - cy) + cx,
        ny = cos * (y - cy) - sin * (x - cx) + cy;
    return new Gamelab.Vector(nx, ny);
  },

  find_point_on_circle: function find_point_on_circle(x, y, radius, degrees) {}
};

Gamelab.Trig = Trigonometry;
Gamelab.Trigonometry = Trigonometry;
;

function Curve_ToComplete(tag) {
  var log_it = function log_it(sub_tag) {
    return function () {
      console.info('Curve_ToComplete:' + tag + '.' + sub_tag);
    }();
  };
  return {
    In: log_it('In'),
    Out: log_it('Out'),
    Seamless: log_it('Seamless')
  };
};

var linkedCurves = {

  quadratic: function quadratic(t) {
    return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  },

  cubic: function cubic(t) {
    return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  },

  quartic: function quartic(t) {
    return t < .5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
  },

  quintic: function quintic(t) {
    return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
  },

  linear: function linear(t) {
    return t;
  } //provided for consistency / in case 'linear' is needed

};

var Twix = {

  Curves: {
    //ALL HAVE INPUT AND OUTPUT OF: 0-1.0
    // no easing, no acceleration
    Linear: {
      None: function None(t) {
        return t;
      }
    },

    Quadratic: {
      In: function In(t) {
        return t * t;
      },
      Out: function Out(t) {
        return t * (2 - t);
      },
      Seamless: function Seamless(t) {
        return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      }
    },

    Cubic: {
      In: function In(t) {
        return t * t * t;
      },
      Out: function Out(t) {
        return --t * t * t + 1;
      },
      Seamless: function Seamless(t) {
        return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      }
    },

    Quartic: {
      In: function In(t) {
        return t * t * t * t;
      },
      Out: function Out(t) {
        return 1 - --t * t * t * t;
      },
      Seamless: function Seamless(t) {
        return t < .5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
      }
    },

    Quintic: {
      In: function In(t) {
        return t * t * t * t * t;
      },
      Out: function Out(t) {
        return 1 + --t * t * t * t * t;
      },
      Seamless: function Seamless(t) {
        return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
      }
    },

    Sine: Curve_ToComplete('Sine'),

    Cosine: Curve_ToComplete('Cosine'),

    Tangent: Curve_ToComplete('Tangent'),

    Exponential: Curve_ToComplete('Exponential')

  },

  LinkedCurves: linkedCurves

};

var TranceCurves = {};

TranceCurves.Exponential = function (value, power, min, max) {};

TranceCurves.Power = function (value, power, min, max) {};

var TrigFunctions = {};

TrigFunctions.Sine = {};

TrigFunctions.Cosine = {};

TrigFunctions.Tangent = {};

var SpecialFunctions = {};

SpecialFunctions.Sawtooth = function (t) {
  return t <= 1.0 ? t : 0;
};

SpecialFunctions.Square = function () {};

SpecialFunctions.Triangle = function () {};

SpecialFunctions.Floor = function () {};

SpecialFunctions.Sign = function () {};

Gamelab.core = Gamelab.core || {};

Gamelab.core.XYFunctions = {};

Gamelab.core.XYFunctions.SpecialFunctions = SpecialFunctions;

var SigmaFunctions = {};

var GammaFunctions = {};
;(function () {
  console.log('Vector class... creating');

  /**
   * Creates a Vector object with x, y, and z properties.
   * <info-bit>Vector-2D requires only x and y args --new Vector(10, 10)
   * For Vector-3D, use x,y, and z --new Vector(10, 10, 10)
   * Pass an existing Vector as the sole argument in order to copy that Vector to a new instance</info-bit>
   * @param   {number} x the x coordinate
   * @param   {number} y the y coordinate
   * @param   {number} z the optional z coordinate
   * @param   {number} r the optional r value
   * @returns {Vector} a Vector object
   */

  var Vector = function () {
    function Vector(x, y, z, r) {
      _classCallCheck(this, Vector);

      var copied = false;

      if ((typeof x === "undefined" ? "undefined" : _typeof(x)) == 'object' && x.hasOwnProperty('x') && x.hasOwnProperty('y')) //optionally pass vector3
        {
          this.x = x.x;
          this.y = x.y;
          this.z = x.z || 0;

          if (this.z == null) {
            this.z = 0;
          }

          this.valid_check();

          copied = true;
        }

      if (z == null) {
        z = 0;
      }

      if (!copied) {

        this.x = x;
        this.y = y;
        this.z = z;
        this.r = r;

        this.valid_check();
      }
    }

    _createClass(Vector, [{
      key: "valid_check",
      value: function valid_check() {
        if (this.x == undefined) {
          this.x = 0;
        }
        if (this.y == undefined) {
          this.y = 0;
        }
        if (this.z == undefined) {
          this.z = 0;
        }
      }

      /**
       * Subtracts another Vector from this vector and returns a vector for the resulting difference.
       *
       * @function
       * @param {Vector} v the vector to be subtracted from this vector
       * @memberof Vector
       **********/

    }, {
      key: "sub",
      value: function sub(v) {
        if (typeof v == 'number') {
          v = {
            x: v,
            y: v,
            z: v
          };
        };

        return new Gamelab.Vector(this.x - v.x, this.y - v.y, this.z - v.z);
      }

      /**
       * Adds another Vector to this vector and returns a vector for the resulting sum.
       *
       * @function
       * @param {Vector} v the vector to be added to this vector
       * @memberof Vector
       **********/

    }, {
      key: "add",
      value: function add(v) {
        if (typeof v == 'number') {
          v = {
            x: v,
            y: v,
            z: v
          };
        };

        return new Gamelab.Vector(this.x + v.x, this.y + v.y, this.z + v.z);
      }

      /**
       * Multiplies another Vector by this vector and returns a vector for the resulting product.
       *
       * @function
       * @param {Vector} v the vector that this vector will by muliplied by
       * @memberof Vector
       **********/

    }, {
      key: "mult",
      value: function mult(v) {
        if (typeof v == 'number') {
          v = {
            x: v,
            y: v,
            z: v
          };
        };

        return new Gamelab.Vector(this.x * v.x, this.y * v.y, this.z * v.z);
      }

      /**
       * Gets vector of absolute values.
       *
       * @function
       * @param {Vector} v the absolute vector
       * @memberof Vector
       **********/

    }, {
      key: "abs",
      value: function abs() {

        return new Gamelab.Vector(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z));
      }

      /**
       * Divides another Vector by this vector and returns a vector for the resulting quotient.
       *
       * @function
       * @param {Vector} v the vector for this vector to be divided by
       * @memberof Vector
       **********/

    }, {
      key: "div",
      value: function div(v) {
        if (typeof v == 'number') {
          v = {
            x: v,
            y: v,
            z: v
          };
        };

        return new Gamelab.Vector(this.x / v.x, this.y / v.y, this.z / v.z);
      }

      /**
       * Rounds this vector to the nearest set of whole numbers and returns the result.
       *
       * @function
       * @memberof Vector
       * @returns {Vector} a Gamelab.Vector object
       **********/

    }, {
      key: "round",
      value: function round() {
        return new Gamelab.Vector(Math.round(this.x), Math.round(this.y), Math.round(this.z));
      }

      /**
       * Floors this vector to the nearest set of whole numbers and returns the result (subtractive-only, an x of 1.7 becomes 1)
       *
       * @function
       * @memberof Vector
       * @returns {Vector} a Gamelab.Vector object
       **********/

    }, {
      key: "floor",
      value: function floor() {
        return new Gamelab.Vector(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z));
      }

      /**
       * Ceils this vector to the nearest set of whole numbers  and returns the result (additive-only, an x of 1.2 becomes 2)
       *
       * @function
       * @memberof Vector
       * @returns {Vector} a Gamelab.Vector object
       **********/

    }, {
      key: "ceil",
      value: function ceil() {
        return new Gamelab.Vector(Math.ceil(this.x), Math.ceil(this.y), Math.ceil(this.z));
      }

      /**
       * Creates new vector, with the negated x,y,z values (-x-y-z), returns the resulting vector
       *
       * @function
       * @memberof Vector
       * @returns {Vector} a Gamelab.Vector object
       **********/

    }, {
      key: "neg",
      value: function neg() {
        return new Gamelab.Vector(-this.x, -this.y, -this.z);
      }

      /**
       * An equals-test for vectors. Returns true OR false.
       *
       * @function
       * @memberof Vector
       * @returns {boolean} a true OR false value
       **********/

    }, {
      key: "equals",
      value: function equals(v) {

        return this.x == v.x && this.y == v.y && this.z == v.z;
      }

      /**
       * Gets  the specific distance between this and the argument-vector. --applies to x and y of two vectors. Returns a single number.
       *
       * @function
       * @memberof Vector
       * @returns {number} the specific distance between this and the argument-vector
       **********/

    }, {
      key: "trig_distance_xy",
      value: function trig_distance_xy(v) {

        var dist = this.sub(v);

        return Math.sqrt(dist.x * dist.x + dist.y * dist.y);
      }
    }, {
      key: "is_between",
      value: function is_between(v1, v2) {
        //TODO : overlap vectors return boolean

        return this.x >= v1.x && this.x <= v2.x && this.y >= v1.y && this.y <= v2.y && this.z >= v1.z && this.z <= v2.z;
      }

      /**
       * Returns a vector-multiple: the original-size, multiplied by a random between the minFloat and maxFloat arguments.
       *
       * @function
       * @memberof Vector
       * @returns {Vector} the resulting vector.
       **********/

    }, {
      key: "randomize",
      value: function randomize(minFloat, maxFloat) {

        var random = (Math.random() * (maxFloat - minFloat) + minFloat) * 1000 / 1000;

        return this.mult(random);
      }

      /**
       * Returns a speed vector, based on rotation.
       *
       * @function
       * @param {number} rotation in degrees, 0-360
       * @param {number} speed the level of speed to apply, default being 1
       * @returns {Vector}
       * @memberof Vector
       **********/

    }, {
      key: "rotationalSpeedPoint",
      value: function rotationalSpeedPoint(rotation, speed) {
        var r = rotation;

        if (isNaN(speed)) {
          speed = 1;
        }

        if ((typeof rotation === "undefined" ? "undefined" : _typeof(rotation)) == 'object' && rotation.x) {
          r = rotation.x;
        }

        return new Gamelab.Vector(Math.cos(r * 3.14 / 180) * speed, Math.sin(r * 3.14 / 180) * speed);
      }

      /**
       * Returns the right-handed angle of degrees between two two position-vectors.
         * @memberof Vector
       * @function
       * @param {Vector} p1 the 1st vector-argument
       * @param {Vector} p2 the 2nd vector-argument
       * @returns {number} the resulting angle in degrees.
       **********/

    }, {
      key: "angleBetween",
      value: function angleBetween(p1, p2) {

        return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
      }

      //apply minimum value to all values

    }, {
      key: "min2d",
      value: function min2d() {

        function minimize(object, key1, key2) {
          if (object[key1] < object[key2]) object[key2] = object[key1];

          if (object[key2] < object[key1]) object[key1] = object[key2];
        };

        minimize(this, 'x', 'y');

        return this;
      }

      //apply maximum value to all values

    }, {
      key: "max2d",
      value: function max2d() {

        function maximize(object, key1, key2) {
          if (object[key1] > object[key2]) object[key2] = object[key1];

          if (object[key2] > object[key1]) object[key1] = object[key2];
        };

        maximize(this, 'x', 'y');

        return this;
      }
    }]);

    return Vector;
  }();

  ;

  var Vector3 = Vector,
      Pos = Vector,
      Size = Vector,
      Position = Vector,
      Vector2 = Vector,
      Rotation = Vector;

  Gamelab.Vector = Vector;

  //synonymous w/ Vector::
  Gamelab.Vector2d = Vector;
  Gamelab.Vector2D = Vector;
  Gamelab.Rotation = Vector;
  Gamelab.Pos = Vector;
  Gamelab.Position = Vector;
  Gamelab.Size = Vector;

  //The above are a list of synonymous expressions for Vector. All of these do the same thing in this library (store and manipulate x,y,z values)

  var VectorMath = {
    rotatePointsXY: function rotatePointsXY(x, y, angle) {

      var theta = angle * Math.PI / 180;

      var point = {};
      point.x = x * Math.cos(theta) - y * Math.sin(theta);
      point.y = x * Math.sin(theta) + y * Math.cos(theta);

      point.z = 0;

      return point;
    }
  };

  Gamelab.VectorMath = VectorMath;
})();
;
/**
 * Creates a GameWindow object.
 *
 * <iframe style='width:400px; height:450px; overflow:hidden;' src='../client/examples/js-class/GameWindow.html'> </iframe>
 * @param   {Object} canvas the canvas element for this gameWindow. --GameWindow's if not supplied, the constructor will create a full-screen canvas, if a canvas.
  * @param   {Object} drawables the drawable objects to be drawn. --Drawables can also be added after constructor call.
 * @returns {GameWindow} a Gamelab.GameWindow object
 * */

var WebGL = function () {
  function WebGL() {
    var canvas = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var drawables = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    _classCallCheck(this, WebGL);

    if (!THREE) {
      return console.error('THREE.js required in window');
    }

    document.body.style.position = "absolute";

    document.body.style.width = "100%";

    document.body.style.height = "100%";

    var camera = new THREE.PerspectiveCamera();

    var container = document.querySelector('#game-window');

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(container.clientWidth, container.clientHeight);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000); //was 1000 last arg


    container.append(this.renderer.domElement);

    this.scene.add(this.camera);

    this.light = new THREE.AmbientLight(0x404040); // soft white light
    this.scene.add(this.light);

    this.drawables = drawables;

    this.bool_events = Gamelab.bool_events || [];

    this.canvas = this.renderer.domElement;

    this.camera.target = false;

    var __inst = this;

    this.update_ext = [];

    Gamelab.game_windows.push(this);

    window.onerror = function () {

      Gamelab.errors += 1;

      console.log('Canvas Error --');

      if (Gamelab.errors > Gamelab.settings.errorLimit) {
        Gamelab.stopDraw = true;

        var call = call || window.setTimeout(function () {

          if (call) {
            window.clearTimeout(call);
          }
          console.log('%cDraw stopped at errorLimit:' + Gamelab.settings.errorLimit, 'color:darkorange;');
        }, 200);
      }
    };
  }

  /**
   * returns the gameWindow.canvas property, an HTMLCanvasElement
   *
   * @function
   * @memberof GameWindow
   **********/

  _createClass(WebGL, [{
    key: "getCanvas",
    value: function getCanvas() {
      return this.canvas;
    }

    /**
     * returns a vector(x, y) showing the center of the GameWindow
     *
     * @function
     * @memberof GameWindow
     **********/

  }, {
    key: "center",
    value: function center() {

      return new Gamelab.Vector(Math.round(this.canvas.width / 2), Math.round(this.canvas.height / 2));
    }

    /**
     * creates an array of gridUnits
     *
     * @function
     * @memberof GameWindow
     **********/

  }, {
    key: "GridStyle",
    value: function GridStyle(total_x, total_y, w, h, srcImage_Path) {

      if (!(this.grid instanceof Array)) {
        this.grid = [];
      }

      function GridUnit(x, y, w, h, srcImage_Path) {

        var size = new Gamelab.Vector(w, h),
            position = new Gamelab.Vector(x, y);

        var sprite;

        if (srcImage_Path) {
          sprite = new Gamelab.Sprite(srcImage_Path);
          sprite.Size(size);
          sprite.Pos(position);

          Gamelab.game_windows[0].add(sprite);
        }

        return {
          size: size,
          position: position
        };
      };

      for (var y = 0; y < total_y; y++) {

        for (var x = 0; x < total_x; x++) {

          this.grid.push(new GridUnit(x * w, y * h, w, h, srcImage_Path));
        }
      }
      return this;
    }
  }, {
    key: "getCanvas",
    value: function getCanvas() {
      return this.canvas;
    }

    /**
     * adds an update to the GameWindow:: update to be called every 20 milliseconds
     *
     * @function
     * @memberof GameWindow
     **********/

  }, {
    key: "onUpdate",
    value: function onUpdate(f) {

      this.update_ext.push(f);
    }

    /**
     * the main update for the GameWindow:: called automatically after call of GameWindow.start() or GameWindow.animate()
     *
     * @function
     * @memberof GameWindow
     **********/

  }, {
    key: "update",
    value: function update() {

      Gamelab.each(this.drawables, function (ix, item) {

        if (item && typeof item.def_update == 'function') {

          item.def_update(item);
        }

        if (item && typeof item.update == 'function') {
          item.update(item);
        }

        if (item && ['SpriteArray', 'RobotixArray', 'RobotixVerticalChain'].indexOf(item.constructor.name) >= 0 && typeof item.each == 'function') {

          item.each(function (ix, graphic) {

            graphic.update(graphic);
          });
        }
      });

      Gamelab.each(this.bool_events, function (ix, item) {

        if (item && item.bool()) {
          item.callback();
        }
      });

      for (var x in this.update_ext) {
        this.update_ext[x]();
      }
    }
  }, {
    key: "draw",
    value: function draw() {

      var __gameWindow = this;

      if (this.before_draw_ext) {
        this.before_draw_ext();
      }

      Gamelab.each(this.drawables, function (ix, item) {

        if (typeof item.draw == 'function') {
          item.draw(__gameWindow.ctx, __gameWindow.camera);
        }
      });

      if (this.after_draw_ext) {
        this.after_draw_ext();
      }
    }

    /**
     * adds a call before the GameWindow draw()
     *
     * @function
     * @memberof GameWindow
     **********/

  }, {
    key: "onBeforeDraw",
    value: function onBeforeDraw(f) {

      var boundCall = f.bind(this);

      if (!this.before_draw_ext) this.before_draw_ext = function () {};

      var beforeDraw = this.before_draw_ext.bind(this);

      this.before_draw_ext = function () {
        beforeDraw();
        boundCall();
      };
    }

    /**
     * adds a call after the GameWindow draw()
     *
     * @function
     * @memberof GameWindow
     **********/

  }, {
    key: "onAfterDraw",
    value: function onAfterDraw(f) {

      var boundCall = f.bind(this);

      if (!this.after_draw_ext) this.after_draw_ext = function () {};

      var afterDraw = this.after_draw_ext.bind(this);

      this.after_draw_ext = function () {
        afterDraw();
        boundCall();
      };
    }

    /**
     * sets the size of the GameWindow
     *
     * @function
     * @param {integer} w the width of the GameWindow
     * @param {integer} h the HEIGHT of the GameWindow
     * @memberof GameWindow
     **********/

  }, {
    key: "Size",
    value: function Size(w, h, isAbsoluteSize) {
      //call with no args to fill to browser-window-size;

      w = w || this.canvas.parentNode.clientWidth;

      h = h || this.canvas.parentNode.clientHeight;

      var c = this.canvas;

      if (c) {
        c.setAttribute('width', w);
      };

      if (c) {
        c.setAttribute('height', h);
      };

      Gamelab.WIDTH = w;

      Gamelab.HEIGHT = h;

      this.canvas.width = w;

      this.canvas.height = h;

      this.size = new Gamelab.Vector(w, h);

      this.isAbsoluteSize = isAbsoluteSize || false;

      return this;
    }

    /**
     * adds an object to the GameWindow
     *
     * @function
     * @param {Object} obj the object to be added (Sprite)
     * @param {Boolean} onBottom if true, adds to the bottom of layer-stack in GameWindow
     * @memberof GameWindow
     **********/

  }, {
    key: "add",
    value: function add(obj) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


      var optionsGuide = {
        obj: 'The Object{} being added into play',
        options: {
          position: 'The Vector(x, y) offset to use when drawing the obj'
        }
      };

      console.info('GameWindow.add() --2nd argument options is object of arguments >>>', optionsGuide);

      var layer = options.layer || this.drawables.length - 1;

      if (!(typeof layer == 'number' && layer >= 0)) layer = this.drawables.length;

      var offset = new Gamelab.Vector(0, 0);

      if (options.position) offset = options.position;

      obj.window_offset = offset;

      //1: if Sprite(), Add object to the existing __gameWindow

      var __inst = this;

      if (obj instanceof Gamelab.Camera) {

        this.camera = obj;
      } else if (obj instanceof Gamelab.GSEvent) {

        if (Gamelab.__running) {

          return console.error('Events can only be added before Gamstack.animate() is called::aka before the main update / loop begins');
        } else {

          obj.apply();
        }
      } else {

        this.drawables.splice(layer, 0, obj);
      };

      return obj;
    }

    /**
     * set background-color of GameWindow
     *
     * @function
     * @param {string} c the new background-color for GameWindow
     * @memberof GameWindow
     **********/

  }, {
    key: "Background",
    value: function Background(c) {
      this.canvas.style.background = c;

      this.canvas.style.backgroundColor = c;

      return this;
    }

    /**
     * removes an object from the GameWindow
     *
     * @function
     * @param {Object} obj the object to be removed (Sprite)
     * @memberof GameWindow
     **********/

  }, {
    key: "remove",
    value: function remove(obj) {

      var ix = this.drawables.indexOf(obj);

      if (ix >= 0) {
        this.drawables.splice(ix, 1);
      }
    }

    /**
     * begins the animation-loop of GameWindow.
     *
     * @function
     * @param {number} time optional time parameter for usage with Tween
     * @memberof GameWindow
     **********/

  }, {
    key: "animate",
    value: function animate(time) {

      var __inst = this;

      requestAnimationFrame(function () {

        __inst.animate();
      });

      if (Gamelab.__stats) {
        Gamelab.__stats.begin();
        Gamelab.__statsMS.begin();
        Gamelab.__statsMB.update();
      }

      Gamelab.isAtPlay = true;

      if (window.TWEEN) TWEEN.update(time);

      __inst.update();

      console.log('Rendering');
      this.renderer.render(this.scene, this.camera);

      this.draw();

      if (Gamelab.__stats) {
        Gamelab.__stats.end();
        Gamelab.__statsMS.end();
      }
    }

    /**
     * begins the animation-loop of GameWindow, with performance Stats shown on-screen
     *
     * @function
     * @memberof GameWindow
     **********/

  }, {
    key: "start",
    value: function start() {

      if (typeof Stats == 'function') //Stats library exists
        {
          //basic stat animation
          Gamelab.__stats = new Stats();
          Gamelab.__stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom

          Gamelab.__stats.dom.style.left = '10%';

          Gamelab.__stats.dom.setAttribute('class', 'stat');

          this.canvas.parentNode.appendChild(Gamelab.__stats.dom);

          //basic stat animation
          Gamelab.__statsMS = new Stats();
          Gamelab.__statsMS.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom

          Gamelab.__statsMS.dom.style.left = '10%';

          Gamelab.__statsMS.dom.style.marginLeft = '90px';

          Gamelab.__statsMS.dom.setAttribute('class', 'stat');

          this.canvas.parentNode.appendChild(Gamelab.__statsMS.dom);

          //basic stat animation
          Gamelab.__statsMB = new Stats();
          Gamelab.__statsMB.showPanel(2); // 0: fps, 1: ms, 2: mb, 3+: custom

          Gamelab.__statsMB.dom.style.left = '10%';

          Gamelab.__statsMB.dom.setAttribute('class', 'stat');

          Gamelab.__statsMB.dom.style.marginLeft = '180px';

          this.canvas.parentNode.appendChild(Gamelab.__statsMB.dom);
        }

      this.animate();
    }
  }]);

  return WebGL;
}();

Gamelab.WebGL = WebGL;

Gamelab.WebGl = WebGL;
;
var RGBAColor = function () {
  function RGBAColor() {
    var r = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var g = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var b = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var a = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    _classCallCheck(this, RGBAColor);

    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  _createClass(RGBAColor, [{
    key: "fromString",
    value: function fromString(str) {

      str = str.replace(/^\s*#|\s*$/g, '');
      str = str.toLowerCase();
      if (ColorStrings[str]) str = ColorStrings[str];

      var match;

      // RGB(A)
      if (match = str.match(RE_RGB) || str.match(RE_RGBA)) {

        console.log('Processing Match::' + jstr(match));

        return new Gamelab.RGBAColor(parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10), parseFloat(match.length === 4 ? 1 : match[4]));
      }
    }
  }, {
    key: "fromData",
    value: function fromData(data) {
      return new Gamelab.RGBAColor(parseInt(data[0], 10), parseInt(data[1], 10), parseInt(data[2], 10), parseFloat(data.length === 3 ? 1 : data[3]));
    }
  }, {
    key: "distance",
    value: function distance(color) {

      var sumOfSquares = 0;

      sumOfSquares += Math.pow(this.r - color.r, 2);
      sumOfSquares += Math.pow(this.g - color.g, 2);
      sumOfSquares += Math.pow(this.b - color.b, 2);

      return Math.sqrt(sumOfSquares);
    }
  }, {
    key: "match_by_tolerance",
    value: function match_by_tolerance(color, tolerance) {

      var matches = {
        r: color.r,
        g: color.g,
        b: color.b
      };

      var total_diff = 0;

      for (var x in matches) {
        var diff = Math.abs(color[x] - this[x]);

        console.log('COLOR-DIFF: --1::' + jstr(this) + ':: --2::' + jstr(color));

        total_diff += diff;
      }

      return total_diff <= tolerance;
    }
  }]);

  return RGBAColor;
}();

;

Gamelab.RGBAColor = RGBAColor;

var ColorStrings = {
  aliceblue: 'rgb(240, 248, 255)',
  antiquewhite: 'rgb(250, 235, 215)',
  aqua: 'rgb(0, 255, 255)',
  aquamarine: 'rgb(127, 255, 212)',
  azure: 'rgb(240, 255, 255)',
  beige: 'rgb(245, 245, 220)',
  bisque: 'rgb(255, 228, 196)',
  black: 'rgb(0, 0, 0)',
  blanchedalmond: 'rgb(255, 235, 205)',
  blue: 'rgb(0, 0, 255)',
  blueviolet: 'rgb(138, 43, 226)',
  brown: 'rgb(165, 42, 42)',
  burlywood: 'rgb(222, 184, 135)',
  cadetblue: 'rgb(95, 158, 160)',
  chartreuse: 'rgb(127, 255, 0)',
  chocolate: 'rgb(210, 105, 30)',
  coral: 'rgb(255, 127, 80)',
  cornflowerblue: 'rgb(100, 149, 237)',
  cornsilk: 'rgb(255, 248, 220)',
  crimson: 'rgb(220, 20, 60)',
  cyan: 'rgb(0, 255, 255)',
  darkblue: 'rgb(0, 0, 139)',
  darkcyan: 'rgb(0, 139, 139)',
  darkgoldenrod: 'rgb(184, 134, 11)',
  darkgray: 'rgb(169, 169, 169)',
  darkgreen: 'rgb(0, 100, 0)',
  darkgrey: 'rgb(169, 169, 169)',
  darkkhaki: 'rgb(189, 183, 107)',
  darkmagenta: 'rgb(139, 0, 139)',
  darkolivegreen: 'rgb(85, 107, 47)',
  darkorange: 'rgb(255, 140, 0)',
  darkorchid: 'rgb(153, 50, 204)',
  darkred: 'rgb(139, 0, 0)',
  darksalmon: 'rgb(233, 150, 122)',
  darkseagreen: 'rgb(143, 188, 143)',
  darkslateblue: 'rgb(72, 61, 139)',
  darkslategray: 'rgb(47, 79, 79)',
  darkslategrey: 'rgb(47, 79, 79)',
  darkturquoise: 'rgb(0, 206, 209)',
  darkviolet: 'rgb(148, 0, 211)',
  deeppink: 'rgb(255, 20, 147)',
  deepskyblue: 'rgb(0, 191, 255)',
  dimgray: 'rgb(105, 105, 105)',
  dimgrey: 'rgb(105, 105, 105)',
  dodgerblue: 'rgb(30, 144, 255)',
  firebrick: 'rgb(178, 34, 34)',
  floralwhite: 'rgb(255, 250, 240)',
  forestgreen: 'rgb(34, 139, 34)',
  fuchsia: 'rgb(255, 0, 255)',
  gainsboro: 'rgb(220, 220, 220)',
  ghostwhite: 'rgb(248, 248, 255)',
  gold: 'rgb(255, 215, 0)',
  goldenrod: 'rgb(218, 165, 32)',
  gray: 'rgb(128, 128, 128)',
  green: 'rgb(0, 128, 0)',
  greenyellow: 'rgb(173, 255, 47)',
  grey: 'rgb(128, 128, 128)',
  honeydew: 'rgb(240, 255, 240)',
  hotpink: 'rgb(255, 105, 180)',
  indianred: 'rgb(205, 92, 92)',
  indigo: 'rgb(75, 0, 130)',
  ivory: 'rgb(255, 255, 240)',
  khaki: 'rgb(240, 230, 140)',
  lavender: 'rgb(230, 230, 250)',
  lavenderblush: 'rgb(255, 240, 245)',
  lawngreen: 'rgb(124, 252, 0)',
  lemonchiffon: 'rgb(255, 250, 205)',
  lightblue: 'rgb(173, 216, 230)',
  lightcoral: 'rgb(240, 128, 128)',
  lightcyan: 'rgb(224, 255, 255)',
  lightgoldenrodyellow: 'rgb(250, 250, 210)',
  lightgray: 'rgb(211, 211, 211)',
  lightgreen: 'rgb(144, 238, 144)',
  lightgrey: 'rgb(211, 211, 211)',
  lightpink: 'rgb(255, 182, 193)',
  lightsalmon: 'rgb(255, 160, 122)',
  lightseagreen: 'rgb(32, 178, 170)',
  lightskyblue: 'rgb(135, 206, 250)',
  lightslategray: 'rgb(119, 136, 153)',
  lightslategrey: 'rgb(119, 136, 153)',
  lightsteelblue: 'rgb(176, 196, 222)',
  lightyellow: 'rgb(255, 255, 224)',
  lime: 'rgb(0, 255, 0)',
  limegreen: 'rgb(50, 205, 50)',
  linen: 'rgb(250, 240, 230)',
  magenta: 'rgb(255, 0, 255)',
  maroon: 'rgb(128, 0, 0)',
  mediumaquamarine: 'rgb(102, 205, 170)',
  mediumblue: 'rgb(0, 0, 205)',
  mediumorchid: 'rgb(186, 85, 211)',
  mediumpurple: 'rgb(147, 112, 219)',
  mediumseagreen: 'rgb(60, 179, 113)',
  mediumslateblue: 'rgb(123, 104, 238)',
  mediumspringgreen: 'rgb(0, 250, 154)',
  mediumturquoise: 'rgb(72, 209, 204)',
  mediumvioletred: 'rgb(199, 21, 133)',
  midnightblue: 'rgb(25, 25, 112)',
  mintcream: 'rgb(245, 255, 250)',
  mistyrose: 'rgb(255, 228, 225)',
  moccasin: 'rgb(255, 228, 181)',
  navajowhite: 'rgb(255, 222, 173)',
  navy: 'rgb(0, 0, 128)',
  oldlace: 'rgb(253, 245, 230)',
  olive: 'rgb(128, 128, 0)',
  olivedrab: 'rgb(107, 142, 35)',
  orange: 'rgb(255, 165, 0)',
  orangered: 'rgb(255, 69, 0)',
  orchid: 'rgb(218, 112, 214)',
  palegoldenrod: 'rgb(238, 232, 170)',
  palegreen: 'rgb(152, 251, 152)',
  paleturquoise: 'rgb(175, 238, 238)',
  palevioletred: 'rgb(219, 112, 147)',
  papayawhip: 'rgb(255, 239, 213)',
  peachpuff: 'rgb(255, 218, 185)',
  peru: 'rgb(205, 133, 63)',
  pink: 'rgb(255, 192, 203)',
  plum: 'rgb(221, 160, 221)',
  powderblue: 'rgb(176, 224, 230)',
  purple: 'rgb(128, 0, 128)',
  red: 'rgb(255, 0, 0)',
  rosybrown: 'rgb(188, 143, 143)',
  royalblue: 'rgb(65, 105, 225)',
  saddlebrown: 'rgb(139, 69, 19)',
  salmon: 'rgb(250, 128, 114)',
  sandybrown: 'rgb(244, 164, 96)',
  seagreen: 'rgb(46, 139, 87)',
  seashell: 'rgb(255, 245, 238)',
  sienna: 'rgb(160, 82, 45)',
  silver: 'rgb(192, 192, 192)',
  skyblue: 'rgb(135, 206, 235)',
  slateblue: 'rgb(106, 90, 205)',
  slategray: 'rgb(112, 128, 144)',
  slategrey: 'rgb(112, 128, 144)',
  snow: 'rgb(255, 250, 250)',
  springgreen: 'rgb(0, 255, 127)',
  steelblue: 'rgb(70, 130, 180)',
  tan: 'rgb(210, 180, 140)',
  teal: 'rgb(0, 128, 128)',
  thistle: 'rgb(216, 191, 216)',
  tomato: 'rgb(255, 99, 71)',
  turquoise: 'rgb(64, 224, 208)',
  violet: 'rgb(238, 130, 238)',
  wheat: 'rgb(245, 222, 179)',
  white: 'rgb(255, 255, 255)',
  whitesmoke: 'rgb(245, 245, 245)',
  yellow: 'rgb(255, 255, 0)',
  yellowgreen: 'rgb(154, 205, 50)',

  map_orange: 'rgb(255, 106, 0)',

  map_green: 'rgb(76, 255, 0)',

  map_red: 'rgb(255, 0, 0)',

  map_blue: 'rgb(0, 38, 255)',

  map_darkgreen: 'rgb(38, 127, 0)',

  map_yellow: 'rgb(255, 216, 0)',

  map_aqua: 'rgb(0, 255, 255)',

  map_grey: 'rgb(128, 128, 128)',

  map_gray: 'rgb(128, 128, 128)',

  map_darkgrey: 'rgb(64, 64, 64)',

  map_darkgray: 'rgb(64, 64, 64)',

  map_black: 'rgb(0, 0, 0)'

};

var RE_RGB = /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/;

Gamelab.Colors = {};

Gamelab.PixelMapColors = {};

for (var x in ColorStrings) {
  if (ColorStrings.hasOwnProperty(x)) {
    Gamelab.Colors[x] = new Gamelab.RGBAColor().fromString(x);
  }
}
;(function () {
  console.log('GSEvent class... creating');

  var GSEvent = function GSEvent() {

    //  Gamelab.Modifiers.informable(this, args);

    var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, GSEvent);
  };

  var MouseMoveEvent = function () {
    function MouseMoveEvent(callback) {
      _classCallCheck(this, MouseMoveEvent);

      callback = callback || function (x, y) {};

      this.Callback(callback);
    }

    _createClass(MouseMoveEvent, [{
      key: "Callback",
      value: function Callback(cb) {
        Gamelab.InputSystem.extend('mousemove', function (x, y) {

          cb(x, y);
        });
      }
    }]);

    return MouseMoveEvent;
  }();

  ;

  Gamelab.MouseMoveEvent = MouseMoveEvent;

  var MousePosEvent = function () {
    function MousePosEvent(callback) {
      _classCallCheck(this, MousePosEvent);

      callback = callback || function (x, y) {};

      this.Callback(callback);
    }

    _createClass(MousePosEvent, [{
      key: "Callback",
      value: function Callback(cb) {
        Gamelab.InputSystem.extend('mousepos', function (x, y) {

          cb(x, y);
        });
      }
    }]);

    return MousePosEvent;
  }();

  ;

  Gamelab.MousePosEvent = MousePosEvent;

  var MouseLeftClickEvent = function () {
    function MouseLeftClickEvent(callback) {
      _classCallCheck(this, MouseLeftClickEvent);

      callback = callback || function (x, y) {};

      this.Callback(callback);
    }

    _createClass(MouseLeftClickEvent, [{
      key: "Callback",
      value: function Callback(cb) {

        Gamelab.InputSystem.extend('leftclick', function (x, y) {

          cb(x, y);
        });
      }
    }]);

    return MouseLeftClickEvent;
  }();

  ;

  Gamelab.MouseLeftClickEvent = MouseLeftClickEvent;

  var MouseRightClickEvent = function () {
    function MouseRightClickEvent(callback) {
      _classCallCheck(this, MouseRightClickEvent);

      callback = callback || function (x, y) {};

      this.Callback(callback);
    }

    _createClass(MouseRightClickEvent, [{
      key: "Callback",
      value: function Callback(cb) {

        Gamelab.InputSystem.extend('rightclick', function (x, y) {

          cb(x, y);
        });
      }
    }]);

    return MouseRightClickEvent;
  }();

  ;

  Gamelab.MouseRightClickEvent = MouseRightClickEvent;

  function GSEventLink(extendedObject, extendedKey, extendor, extendorKey) {
    this.parent_id = extendedObject.id, this.child_id = extendor.id, this.parent_key = extendedKey, this.child_key = extendorKey;
  };

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

  var InputEvent = function (_GSEvent) {
    _inherits(InputEvent, _GSEvent);

    function InputEvent(args) {
      _classCallCheck(this, InputEvent);

      var _this3 = _possibleConstructorReturn(this, (InputEvent.__proto__ || Object.getPrototypeOf(InputEvent)).call(this, args));

      var btnix = args.btnix || args.button_ix || false,
          gpix = args.gpix || args.gamepad_ix || 0,
          callback = args.callback || function () {};

      var six = args.stickix || args.six || args.stick_ix || false;

      var inputKey = six !== false ? 'stick_' + six : btnix !== false ? 'button_' + btnix : false;

      //Keys:

      var keyboardKeys = Larva.arrayWrap(args.keys || []);

      //Run the Q() function

      if (keyboardKeys instanceof Array) {

        Gamelab.each(keyboardKeys, function (ix, keyitem) {

          Gamelab.InputSystem.extendKey('key_' + keyitem.toLowerCase(), function () {

            callback(keyitem.toLowerCase());
          });
        });
      }

      if (inputKey && gpix >= 0) {

        Gamelab.GamepadAdapter.on(inputKey, gpix, function (x, y) {

          callback(x, y);
        });
      }
      return _this3;
    }

    return InputEvent;
  }(GSEvent);

  ;

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

  var KeyboardEvent = function (_InputEvent) {
    _inherits(KeyboardEvent, _InputEvent);

    function KeyboardEvent() {
      var keys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : keys instanceof Array ? keys : [keys];
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

      _classCallCheck(this, KeyboardEvent);

      var _this4 = _possibleConstructorReturn(this, (KeyboardEvent.__proto__ || Object.getPrototypeOf(KeyboardEvent)).call(this, {}));

      _this4.keys = keys;

      _this4.callback = callback;

      return _this4;
    }

    _createClass(KeyboardEvent, [{
      key: "init",
      value: function init() {
        var keyboardKeys = this.keys;

        var __inst = this;

        if (keyboardKeys instanceof Array) {

          Gamelab.each(keyboardKeys, function (ix, keyitem) {

            Gamelab.InputSystem.extendKey('key_' + keyitem.toLowerCase(), function () {

              __inst.callback(keyitem.toLowerCase());
            });
          });
        }
      }
    }, {
      key: "Keys",
      value: function Keys() {
        var keys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        this.keys = Larva.arrayWrap(keys);

        return this;
      }
    }, {
      key: "Call",
      value: function Call() {
        var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

        this.callback = callback;

        this.init();

        return this;
      }
    }]);

    return KeyboardEvent;
  }(InputEvent);

  ;

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

  var GamepadEvent = function (_InputEvent2) {
    _inherits(GamepadEvent, _InputEvent2);

    function GamepadEvent() {
      var keys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

      _classCallCheck(this, GamepadEvent);

      var _this5 = _possibleConstructorReturn(this, (GamepadEvent.__proto__ || Object.getPrototypeOf(GamepadEvent)).call(this, {}));

      _this5.keys = keys;

      _this5.callback = callback;

      return _this5;
    }

    _createClass(GamepadEvent, [{
      key: "Gamepads",
      value: function Gamepads() {
        var gps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        this.gps = gps = Larva.arrayWrap(gps || []);

        return this;
      }
    }, {
      key: "init",
      value: function init() {
        var gamepadKeys = Larva.arrayWrap(this.keys || []);

        var __inst = this;

        Gamelab.GamepadAdapter.on(gamepadKeys, this.gps, function (x, y) {

          __inst.callback(x, y);
        });
      }
    }, {
      key: "Keys",
      value: function Keys() {
        var keys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        this.keys = Larva.arrayWrap(keys);

        return this;
      }
    }, {
      key: "Call",
      value: function Call() {
        var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

        this.callback = callback;

        this.init();

        return this;
      }
    }]);

    return GamepadEvent;
  }(InputEvent);

  ;

  var CollisionEvent = function (_GSEvent2) {
    _inherits(CollisionEvent, _GSEvent2);

    function CollisionEvent() {
      var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, CollisionEvent);

      return _possibleConstructorReturn(this, (CollisionEvent.__proto__ || Object.getPrototypeOf(CollisionEvent)).call(this, args));
    }

    /**
     * applies objects and siblings to be compared for the CollisionEvent instance
     * @memberof CollisionEvent
     * @param   {Array} objects the main-objects for collision processing
     * @param   {Array} siblings the comparable-objects for collision processing
     * @returns {CollisionEvent} the current instance of CollisionEvent, reference to 'this' keyword
     */

    _createClass(CollisionEvent, [{
      key: "OnCollision",
      value: function OnCollision(objects, siblings) {

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

    }, {
      key: "Call",
      value: function Call(callbackFunction) {

        this.callback = callbackFunction || this.callback || function () {};

        var __inst = this;

        $Q(this.objects).on('collide', $Q(this.siblings), function (obj1, obj2) {

          __inst.callback(obj1, obj2);
        });

        return this;
      }
    }]);

    return CollisionEvent;
  }(GSEvent);

  ;

  /**
   * returns BoolEvent --allows code to run whenever a conditional-function returns true
   * @param   {onBool} onBool the function to be tested each update
   * @param   {call} call the function to be called when onBool returns true;
     * @returns {BoolEvent} a Gamelab.BoolEvent object
   */

  var BoolEvent = function (_GSEvent3) {
    _inherits(BoolEvent, _GSEvent3);

    function BoolEvent(onBool, callback) {
      _classCallCheck(this, BoolEvent);

      var _this7 = _possibleConstructorReturn(this, (BoolEvent.__proto__ || Object.getPrototypeOf(BoolEvent)).call(this, {}));

      _this7.bool = onBool || function () {
        console.info('CustomBoolEvent():needs .on function(){}. --Add this as 1st argument or via chainable On() function returning bool argument');
      };
      /*Defaults to false to avoid broken code*/

      _this7.callback = callback || function () {
        console.info('CustomBoolEvent():needs .callback function(){} --Add this as 2nd argument or via chainable Call() function');
      };

      Gamelab.gs_events.push(_this7);

      return _this7;
    }

    /**
     * applies a boolFunction to be tested for true each update
     * @param   {boolFunction} boolFunction the function to be tested each update --replaces the value of boolEvent.onBool
       * @returns {BoolEvent} the current instance of BoolEvent, reference to 'this' keyword
     */

    _createClass(BoolEvent, [{
      key: "On",
      value: function On(boolFunction) {

        this.bool = boolFunction;

        return this;
      }

      /**
       * applies a callback to be called whenever the onBool function returns true
       * @memberof BoolEvent
       * @param   {callbackFunction} callbackFunction the function to be called --replaces the value of boolEvent.callback
         * @returns {BoolEvent} the current instance of BoolEvent, reference to 'this' keyword
       */

    }, {
      key: "Call",
      value: function Call(callbackFunction) {

        this.callback = callbackFunction || this.callback || function () {};

        return this;
      }
    }]);

    return BoolEvent;
  }(GSEvent);

  ;

  BoolEvent.Bool = BoolEvent.On;

  Gamelab.GSEvent = GSEvent;

  Gamelab.GSEventLink = GSEventLink;

  Gamelab.InputEvent = InputEvent;

  Gamelab.GamepadEvent = GamepadEvent;

  Gamelab.KeyboardEvent = KeyboardEvent;

  Gamelab.CollisionEvent = CollisionEvent;

  Gamelab.BoxCollisionEvent = CollisionEvent;

  Gamelab.BoolEvent = BoolEvent;
})();
;(function () {
  console.log('Frame class... creating');

  /**
   * Creates an instance of Frame
   *
   * <info-bit>Gamelab.Frame is called automatically by Gamelab.Sprite and Gamelab.Animation.
   * Gamelab.Frame does not take arguments.
   * It is instantiated, then initilized with chainable function-calls.</info-bit>
   *
   * @returns {Frame}
   *
   * @example
   *
   * var selected_frame = new Gamelab.Frame().Image(gameImage).Size(frameSizeVector);
   */

  var Frame = function () {
    function Frame() {
      _classCallCheck(this, Frame);

      var __inst = this;
      this.framePos = new Gamelab.Vector(0, 0);
    }

    _createClass(Frame, [{
      key: "Image",
      value: function Image(src) {
        this.image = new Gamelab.GameImage(src);
        return this;
      }
    }, {
      key: "onLoad",
      value: function onLoad(fxn) {

        fxn = fxn || function () {};
        fxn = fxn.bind(this);
        this.image.domElement.onload = function () {
          fxn();
        };
      }
    }, {
      key: "Size",
      value: function Size(s) {

        this.size = new Gamelab.Vector(s, s, s);

        this.frameSize = new Gamelab.Vector(s, s, s);

        return this;
      }
    }, {
      key: "Position",
      value: function Position(p) {
        this.position = new Gamelab.Vector(p, p, p);

        this.framePos = new Gamelab.Vector(p, p, p);

        return this;
      }
    }, {
      key: "FramePos",
      value: function FramePos(p) {
        this.position = new Gamelab.Vector(p, p, p);

        this.framePos = new Gamelab.Vector(p, p, p);

        return this;
      }
    }, {
      key: "StoreOffscreen",
      value: function StoreOffscreen() {

        this.offscreen = new Gamelab.OffscreenCanvasRendering(this.image);

        for (var x in this.offscreen) {
          if (x == 'ctx' || x == 'canvas') this[x] = this.offscreen[x];
        }

        return this;
      }
    }, {
      key: "getURL",
      value: function getURL() {
        this.StoreOffscreen();
        return this.offscreen.canvas.toDataURL();
      }
    }, {
      key: "getColoredPixelGrid",
      value: function getColoredPixelGrid() {
        var unitSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5;


        var grid = [];

        var min = this.framePos,
            max = this.framePos.add(this.frameSize);

        for (var x = min.x; x <= max.x; x += unitSize) {
          for (var y = min.y; y <= max.y; y += unitSize) {
            // Fetch pixel at current position
            var pixel = this.ctx.getImageData(x, y, 1, 1);
            // Check that opacity is above zero
            if (pixel.data[3] != 0) {

              var vector = new Gamelab.Vector(x, y),
                  gridObject = {

                position: vector,

                size: new Gamelab.Vector(unitSize, unitSize),

                pixel: pixel

              };

              grid.push(gridObject);
            }
          }
        }

        return grid;
      }
    }, {
      key: "getFullPixelGrid",
      value: function getFullPixelGrid() {
        var unitSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5;


        var grid = [];

        var min = this.framePos,
            max = this.framePos.add(this.frameSize);

        for (var x = min.x; x <= max.x; x += unitSize) {
          for (var y = min.y; y <= max.y; y += unitSize) {
            // Fetch pixel at current position
            var pixel = this.ctx.getImageData(x, y, 1, 1);
            // Check that opacity is above zero


            var vector = new Gamelab.Vector(x, y),
                gridObject = {

              position: vector,

              size: new Gamelab.Vector(unitSize, unitSize),

              pixel: pixel

            };

            grid.push(gridObject);
          }
        }

        return grid;
      }

      /**
       * Creates and returns a ColorMap for this animation, allowing opacity-based pixel-collision.
       *
       * @function
       * @param {number} unitDimen a Colormap grid-unit-size --A larger unitDimen decreases accuracy, and results in faster-processing.
       * @memberof Animation
       **********/

    }, {
      key: "createColorMap",
      value: function createColorMap(size, altImage) {

        if (!(altImage || this.image && this.image.domElement)) return this;

        this.StoreOffscreen();

        this.colorMap = this.getColoredPixelGrid(size, this.testCtx);

        return this.colorMap;
      }
    }, {
      key: "createFullPixelMap",
      value: function createFullPixelMap(size, altImage) {

        if (!(altImage || this.image && this.image.domElement)) return this;

        this.StoreOffscreen();

        this.fullPixelMap = this.getFullPixelGrid(size, this.testCtx);

        return this.fullPixelMap;
      }
    }]);

    return Frame;
  }();

  Gamelab.Frame = Frame;
})();
; /**
  * @ignore
  * */

var ControllerEventKeys = function ControllerEventKeys() {
  _classCallCheck(this, ControllerEventKeys);

  return {

    left_stick: false,

    right_stick: false,

    0: false,

    1: false,

    2: false,

    3: false,

    4: false,

    5: false,

    6: false,

    7: false,

    8: false,

    9: false,

    10: false,

    11: false,

    12: false,

    13: false,

    14: false,

    15: false,

    16: false,

    17: false,

    18: false,

    19: false

  };
};

Gamelab.ControllerEventKeys = ControllerEventKeys;

/**
 * Creates an instance of GamepadAdapter: --instead use the existing: Gamelab.GamepadAdapter, a working instance of this class.
 * -supports game-controller input for web-games
 * -accesses live gamepad input from the HTML5 Gamepad Api
 * @returns {GamepadAdapter} an instance of GamepadAdapter
 * */

Gamelab.gamepads = Gamelab.gamepads || [];

var GamepadAdapter = function () {
  function GamepadAdapter() {
    _classCallCheck(this, GamepadAdapter);

    this.__gamepads = [];

    this.intervals = [];

    var controller_stack = this;

    var __gamepadMaster = this;

    this.events = [];

    window.addEventListener("gamepadconnected", function (e) {
      console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.", e.gamepad.index, e.gamepad.id, e.gamepad.buttons.length, e.gamepad.axes.length);

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

  _createClass(GamepadAdapter, [{
    key: "gamepads",
    value: function gamepads() {

      return navigator.getGamepads();
    }
  }, {
    key: "disconnect_all",
    value: function disconnect_all() {

      for (var x = 0; x < this.intervals.length; x++) {

        window.clearInterval(this.intervals[x]);
      }
    }
  }, {
    key: "disconnect_by_index",
    value: function disconnect_by_index(game_pad_index) {

      window.clearInterval(this.intervals[game_pad_index]);
    }
  }, {
    key: "hasAnyPad",
    value: function hasAnyPad() {
      return "getGamepads" in navigator;
    }
  }, {
    key: "Event",
    value: function Event(key, game_pad, callback) {
      return {

        key: key, game_pad: game_pad, callback: callback

      };
    }
  }, {
    key: "GamepadEvents",
    value: function GamepadEvents(args) {

      var gp = {};

      gp.stick_left = args.stick_left || function (x, y) {

        //  console.log('Def call');

      };

      gp.stick_right = args.stick_right || function (x, y) {};

      gp.buttons = [];

      gp.extendFunc = function (f1, f2) {

        var fc = f2;

        return function (x, y) {

          f2(x, y);

          f1(x, y);
        };
      };

      gp.on = function (key, callback) {

        if (this[key] && key !== "on") {

          var current_cb = typeof this[key] == 'function' ? this[key] : function (x, y) {};

          this[key] = this.extendFunc(callback, current_cb);
        } else if (key.indexOf('button') >= 0 && key.indexOf('_') >= 0) {
          var parts = key.split('_');

          var number;

          try {

            number = parseInt(parts[1]);

            var current_cb = typeof this['buttons'][number] == 'function' ? this['buttons'][number] : function (x, y) {};

            this['buttons'][number] = this.extendFunc(callback, current_cb);
          } catch (e) {
            console.error('could not parse "on" event with ' + key);
          }
        }
      };

      gp.constructor = { name: "GamepadEvents" };

      this.__gamepads.push(gp);

      Gamelab.gamepads = this.__gamepads;

      return gp;
    }
  }, {
    key: "getGamepads",
    value: function getGamepads() {
      return Gamelab.gamepads;
    }
  }, {
    key: "process",
    value: function process(gp, gpEvents) {

      this.process_buttons(gp, gpEvents);

      this.process_axes(gp, gpEvents);
    }
  }, {
    key: "process_axes",
    value: function process_axes(gp, events) {

      if (!gp || !gp['axes']) {

        return false;
      }

      for (var i = 0; i < gp.axes.length; i += 2) {

        var axis1 = gp.axes[i],
            axia2 = gp.axes[i + 1];

        var ix = Math.ceil(i / 2) + 1,
            x = gp.axes[i],
            y = gp.axes[i + 1];

        if (ix == 1 && events.stick_left) {
          events.stick_left(x, y);
        }

        if (ix == 2 && events.stick_right) {
          events.stick_right(x, y);
        }

        if (this.events && this.events['stick_' + i] && typeof this.events['stick_' + i].callback == 'function') {
          this.events['stick_' + i].callback();
        }
      }
    }
  }, {
    key: "process_buttons",
    value: function process_buttons(gp, events) {

      if (!gp || !gp['buttons']) {
        return false;
      }

      for (var i = 0; i < gp.buttons.length; i++) {

        if (!events.buttons) break;else if (events.buttons.length > i && typeof events.buttons[i] == 'function') {
          events.buttons[i](gp.buttons[i].pressed);
        } else if (events.buttons.length > i && _typeof(events.buttons[i]) == 'object' && typeof events.buttons[i].update == 'function') {
          events.buttons[i].update(events.buttons[i].pressed);
        }
        var clearance_1 = this.events && this.events[i],
            gpc,
            bkey = "button_" + i;

        if (clearance_1) {
          gpc = this.events[bkey] && !isNaN(this.events[bkey].game_pad) ? this.gamepads[this.events[bkey].game_pad] : this.events[bkey].game_pad;
        }
        ;

        if (clearance_1 && gpc && typeof this.events[bkey].callback == 'function') {
          //call the callback
          this.events[i].callback();
        }
      }
    }
  }, {
    key: "on",
    value: function on(key, gpix, callback) {

      var keys = Larva.arrayWrap(key || []),
          gps = Larva.arrayWrap(gpix || []);;

      for (var x in keys) {
        for (var y in gps) {
          if (gps[y] >= this.__gamepads.length) {

            this.__gamepads.push(this.GamepadEvents({}));
          }

          this.__gamepads[y].on(keys[x], callback);
        }
      }
    }
  }]);

  return GamepadAdapter;
}();

/**********
 * NOTE: here we bind the instance, and NOT the instantiator.
 *
 * *********/

if (!Gamelab.GamepadAdapter) {

  Gamelab.GamepadAdapter = new GamepadAdapter();

  // __gameInstance.gamepads.push(gamepad);
}
;
var Line2d = function (_Scriptable) {
  _inherits(Line2d, _Scriptable);

  function Line2d() {
    _classCallCheck(this, Line2d);

    var _this8 = _possibleConstructorReturn(this, (Line2d.__proto__ || Object.getPrototypeOf(Line2d)).call(this));

    _this8.Object(_this8);
    _this8.points = [];
    _this8.position = new Gamelab.Vector(0, 0);
    _this8.size = new Gamelab.Vector(0, 0);
    _this8.index = 0;
    _this8.call = function () {};
    return _this8;
  }

  _createClass(Line2d, [{
    key: "StepFunction",
    value: function StepFunction(call) {
      this.call = call;
      return this;
    }
  }, {
    key: "next",
    value: function next() {
      this.index += 1;
      return this.points[this.index % this.points.length];
    }
  }, {
    key: "Color",
    value: function Color(c) {
      this.color = c;
      return this;
    }
  }, {
    key: "Fill",
    value: function Fill() {

      for (var x = 1; x <= this.size.x; x++) {

        var x_total = this.size.x;

        var out_of_1 = x / x_total;

        var next_x = this.position.x + x;

        console.log('using x portion::' + out_of_1);

        var next_y = this.position.y + this.size.y * this.call(out_of_1, 1.0),
            next_point = new Gamelab.Vector(next_x, next_y);
        this.points.push(next_point);
      }

      return this;
    }
  }, {
    key: "getOffsetPos",
    value: function getOffsetPos(pos) {
      var offset = this.window_offset || new Gamelab.Vector(0, 0);
      return pos.add(offset);
    }
  }, {
    key: "draw",
    value: function draw(ctx, camera) {

      ctx = ctx || Gamelab.game_windows[0].ctx;
      camera = camera || Gamelab.game_windows[0].camera;

      var points = this.points;

      ctx.save();
      ctx.strokeStyle = this.color;

      ctx.beginPath();
      if (points instanceof Array) {
        for (var x = 0; x < points.length; x++) {
          var p = points[x];

          var position = p.position || p;

          var real_pos = this.getOffsetPos(position);

          if (real_pos.hasOwnProperty('x') && real_pos.hasOwnProperty('y')) {
            if (x == 0) ctx.moveTo(real_pos.x, real_pos.y);else {
              ctx.lineTo(real_pos.x, real_pos.y);
            }
          }
        }
      }

      ctx.stroke();
      ctx.restore();
    }
  }]);

  return Line2d;
}(Scriptable);

Gamelab.Line2d = Line2d;

Gamelab.Line2D = Line2d;
;
/**
 * Creates a Sound instance. Implements HTML5-Audio object
 * --DevTODO : complete docs for the Sound class
 *
 * @param   {string} src the source-path of the targeted sound-file
 * @returns {Sound} instance of Gamelab.Sound
 * */

var Sound = function () {
  function Sound(src, data) {
    _classCallCheck(this, Sound);

    if ((typeof src === "undefined" ? "undefined" : _typeof(src)) == 'object') {

      this.sound = document.createElement('audio');

      this.sound.src = src.src;

      this.src = src.src;
    } else if (typeof src == 'string') {

      this.sound = document.createElement('audio');

      this.sound.src = src;

      this.src = src;
    }

    if ((typeof data === "undefined" ? "undefined" : _typeof(data)) == 'object') {
      for (var x in data) {
        if (x !== 'sound') {
          this[x] = data[x];
        }
      }
    }

    this.onLoad = this.onLoad || function () {};

    if (typeof this.onLoad == 'function') {

      this.onLoad(this.sound);
    }
  }

  _createClass(Sound, [{
    key: "Loop",
    value: function Loop(loop) {
      this.sound.loop = loop || true;

      return this;
    }
  }, {
    key: "loop",
    value: function loop(_loop) //same as Loop()
    {
      this.sound.loop = _loop || true;

      return this;
    }
  }, {
    key: "Volume",
    value: function Volume(val) {

      this.sound.volume = val;

      return this;
    }
  }, {
    key: "volume",
    value: function volume(val) //same as Volume()
    {

      this.sound.volume = val;

      return this;
    }
  }, {
    key: "Play",
    value: function Play() {
      if (_typeof(this.sound) == 'object' && typeof this.sound.play == 'function') {

        this.sound.play();
      }

      return this;
    }
  }, {
    key: "play",
    value: function play() {
      //same as Play()
      if (_typeof(this.sound) == 'object' && typeof this.sound.play == 'function') {

        this.sound.play();
      }
      return this;
    }
  }]);

  return Sound;
}();

var SoundList = function () {
  function SoundList(list) {
    _classCallCheck(this, SoundList);

    this.cix = 1;

    this.sounds = [];

    if (list instanceof Array) {
      for (var x in list) {
        if (list[x].src) {
          this.sounds.push(new Sound(list[x].src, list[x]));
        } else if (typeof list[x] == 'string') {
          this.sounds.push(new Sound(list[x]));
        }
      }
    }
  }

  _createClass(SoundList, [{
    key: "add",
    value: function add(src, name) {
      if ((typeof src === "undefined" ? "undefined" : _typeof(src)) == 'object' && src.src) {
        this.sounds.push(new Sound(src.src, src));
      } else if (typeof src == 'string') {
        var data = {};

        if (name) {
          data.name = name;
        }

        this.sounds.push(new Sound(list[x], data));
      }
    }
  }, {
    key: "Volume",
    value: function Volume(v) {
      for (var x = 0; x < this.sounds.length; x++) {
        this.sounds[x].volume(v);
      }

      return this;
    }
  }, {
    key: "volume",
    value: function volume(v) {
      for (var x = 0; x < this.sounds.length; x++) {
        this.sounds[x].volume(v);
      }

      return this;
    }
  }, {
    key: "PlayNext",
    value: function PlayNext() {
      this.sounds[this.cix % this.sounds.length].play();

      this.cix += 1;
    }
  }, {
    key: "Play",
    value: function Play() {

      this.sounds[this.cix % this.sounds.length].play();

      this.cix += 1;
    }
  }, {
    key: "playNext",
    value: function playNext() //same as PlayNext()
    {
      this.sounds[this.cix % this.sounds.length].play();

      this.cix += 1;
    }
  }, {
    key: "play",
    value: function play() //same as Play()
    {

      this.sounds[this.cix % this.sounds.length].play();

      this.cix += 1;
    }
  }]);

  return SoundList;
}();

Gamelab.Sound = Sound;

Gamelab.SoundList = SoundList;
;
var THREE_EXT = {

  defaults: {

    DodecahedronGeometry: { radius: 1, detail: 0 },

    SphereGeometry: { radius: 5, widthSegments: 32, heightSegments: 32 },

    BoxGeometry: {

      width: 20,

      height: 20,

      depth: 20

    },

    CylinderGeometry: { radiusTop: 5, radiusBottom: 5, height: 20, heightSegments: 32 },

    TorusGeometry: { radius: 10, tube: 3, radialSegments: 16, tubularSegments: 100 }
  }

};

var Three //dependency: THREE.js
= function () {
  function Three() {
    var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Three);

    if (!THREE) //THREE.js library must be loaded
      {
        return console.error('ThreeJSObject():Library: Three.js is required for this object.');
      }

    this.scene = new THREE.Scene();

    if (args.geometry instanceof String && THREE[args.geometry]) {
      this.geometry = new THREE[args.geometry]();
    } else {

      this.geometry = args.geometry || new THREE.TorusGeometry(50, 10, 16, 100);
    }

    this.scene.add(new THREE.AmbientLight(0xffffff, 1.0));

    this.renderer = Gamelab.renderer || new THREE.WebGLRenderer({
      preserveDrawingBuffer: true,
      alpha: true
    });

    this.renderer.setSize(1000, 1000);

    this.camera = new THREE.PerspectiveCamera(70, 1, 1, 1000);

    this.camera.position.z = 1000 / 8;

    var __inst = this;

    var src = args.src || "../assets/game/image/tiles/perlin_3.png";

    __inst.loader = new THREE.TextureLoader();

    __inst.loader.load(src, function (texture) {

      __inst.material = args.material || new THREE.MeshPhongMaterial({
        map: texture
      });

      if (!__inst.__init) {

        __inst.mesh = new THREE.Mesh(__inst.geometry, __inst.material);

        __inst.scene.add(__inst.mesh);

        __inst.__init = true;
      }

      //__inst.mesh.size.set(__inst.size);

      __inst.renderer.render(__inst.scene, __inst.camera);

      __ServerSideFile.file_upload('test.png', __inst.renderer.domElement.toDataURL('image/png'), function (relpath, content) {

        relpath = relpath.replace('client/', '../');

        __inst.selected_animation = new Animation({ src: relpath, frameSize: new Vector(1000, 1000), frameBounds: new VectorFrameBounds(new Vector(0, 0, 0), new Vector(0, 0, 0), new Vector(0, 0, 0)) }).singleFrame();

        __inst.selected_animation.image.domElement.onload = function () {

          __inst.setSize(new Vector(__inst.selected_animation.image.domElement.width, __inst.selected_animation.image.domElement.height));

          __inst.selected_animation.animate();

          console.log(jstr(__inst.selected_animation.frames));
        };
      });
    });
  }

  _createClass(Three, [{
    key: "three_update",
    value: function three_update() {
      console.log('THREE --GS-Object UPDATE');

      this.mesh.rotation.y += 0.05;

      this.renderer.clear();

      this.renderer.setSize(this.size.x, this.size.y);

      var pixels = new Uint8Array(this.size.x * this.size.y * 4);

      this.renderer.render(this.scene, this.camera);

      var gl = this.renderer.getContext();

      gl.readPixels(0, 0, this.size.x, this.size.y, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

      this.selected_animation.selected_frame = { image: {} };

      this.selected_animation.selected_frame.image.data = new ImageData(new Uint8ClampedArray(pixels), this.size.x, this.size.y);
    }
  }, {
    key: "applyAnimativeState",
    value: function applyAnimativeState() {}
  }]);

  return Three;
}();

;(function () {
  console.log('Animation class... creating');

  /**
   *
   * Creates an instance of Animation with one or more Frames.
   *
   * <iframe style='width:400px; height:450px; overflow:hidden;' src='../client/examples/js-class/Animation.html'> </iframe>
   *
   * @param   {string=} [src] the src/file-path for this Animation
   * @param   {GameImage= | HTMLImageElement=} [gameImage] the existing GameImage to be applied
   * @param   {Object= | Animation=} [anime] the existing Animation-data to be returned as fully unique instance
   * @returns {Animation} an Animation object
   *
   * @example
   *
   * //constructor call: Creates a single-frame Animation from src
   * var singleFrameAnime = new Animation('directory/myFile.png');
   *
   * @example
   * //constructor call with chainable function-calls: Creates multi-frame Animation from src, then sets properties with chainable-function-calls.
   * var multiFrameAnime = new Gamelab.Animation('../images/characters/full/spaceman1.png') //constructor is called
   * .FrameSize(130, 130)
   * .FrameBounds(new Gamelab.Vector(9, 0), new Gamelab.Vector(23, 0), new Gamelab.Vector(23, 0))
   * .Seesaw() //The Animation will play back-and-forth repeatedly (cycle through frames forwards, then backwards and so on.
   * .Duration(900); //Animation lasts 900 millis OR just under 1 second
   *
   *  @design
   *
   * //single-responsibility : to define a list of frames, then progress that list of frames with a 'selected_frame' property
   * var singleFrameAnime = new Animation('directory/myFile.png');
   */

  var Animation = function () {
    function Animation() {
      var src = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Animation);

      var args = (typeof src === "undefined" ? "undefined" : _typeof(src)) == 'object' ? src : {};

      //Gamelab.Modifiers.informable(this, args);

      if (typeof src == 'string') {
        this.Src(src, args.frameBounds);
      } else if (args instanceof Gamelab.GameImage) {
        console.log('Animation(): args are an instance of GameImage');

        this.image = args;
      } else if (args instanceof HTMLImageElement) {
        console.log('Animation(): args was an instance of HTMLImageElement');

        this.image = new Gamelab.GameImage(args);
      } else if (args instanceof Gamelab.Animation) {

        this.image = args.image;
      } else if ((typeof args === "undefined" ? "undefined" : _typeof(args)) == 'object' && args.src) {
        this.src = args.src;
        this.image = new Gamelab.GameImage(args.src);
      }

      this.frameSize = this.frameSize || new Gamelab.Vector(args.frameSize || new Gamelab.Vector(0, 0));

      if (args.frameBounds && args.frameBounds.min && args.frameBounds.max) {

        this.frameBounds = new Gamelab.VectorFrameBounds(args.frameBounds.min, args.frameBounds.max, args.frameBounds.termPoint);
      } else {

        this.frameBounds = new Gamelab.VectorFrameBounds(new Gamelab.Vector(0, 0, 0), new Gamelab.Vector(0, 0, 0), new Gamelab.Vector(0, 0, 0));
      }

      this.frameOffset = this.getArg(args, 'frameOffset', new Gamelab.Vector(0, 0, 0));

      this.apply2DFrames();

      this.flipX = this.getArg(args, 'flipX', false);

      this.cix = 0;

      this.selected_frame = this.frames[0] || false;

      this.timer = 0;

      this.duration = args.duration || 2000;

      this.seesaw_mode = args.seesaw_mode || false;

      this.reverse_frames = args.reverse_frames || false;

      this.run_ext = args.run_ext || [];

      this.complete_ext = args.complete_ext || [];

      // this.colorMap = this.createColorMap(5);
    }

    _createClass(Animation, [{
      key: "Src",
      value: function Src(src) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


        if (typeof src == 'string') {

          console.log('setting GameImage with string:' + src);
          this.src = src;
          this.image = new Gamelab.GameImage(src);
        } else if (src instanceof GameImage) {
          console.log('Animation(): args are an instance of GameImage');

          this.image = src;
        } else if (src instanceof HTMLImageElement) {
          console.log('Animation(): args was an instance of HTMLImageElement');

          this.image = new Gamelab.GameImage(src);
        }

        if (!options.frameBounds) this.init_singleFrame();

        return this;
      }
    }, {
      key: "Image",
      value: function Image(src) {

        if (typeof src == 'string') {

          console.log('setting GameImage with string:' + src);
          this.src = src;
          this.image = new Gamelab.GameImage(src);
        } else if (src instanceof Gamelab.GameImage) {
          console.log('Animation(): args are an instance of GameImage');

          this.image = src;
        } else if (src instanceof HTMLImageElement) {
          console.log('Animation(): args was an instance of HTMLImageElement');

          this.image = new Gamelab.GameImage(src);
        }

        this.init_singleFrame();

        return this;
      }

      /**
       * sets this Animation to a single-frame-animation, from existing image
       * @function
       * @memberof Animation
       **********/

    }, {
      key: "init_singleFrame",
      value: function init_singleFrame() {

        var __inst = this;

        this.image.domElement.onload = function () {
          if (!__inst.__isInit) __inst.FrameSize(__inst.image.domElement.width, __inst.image.domElement.height).FrameBounds(new Gamelab.Vector(0, 0), new Gamelab.Vector(0, 0));

          __inst.run();
        };

        Gamelab.log('Animation():set single-frame animation');

        return this;
      }

      /*****
       * Overridable / Extendable functions
       * -allows stacking of external object-function calls
       ******/

      /**
       * Provides a function to be called whenever this Animation starts. Function should run every time the Animation reaches frame-index 0
       *
       * @function
       * @params {Function} call the function to be called on start
       * @memberof Animation
       **********/

    }, {
      key: "onRun",
      value: function onRun(call) {

        if (this.run_ext.indexOf(call) == -1) {
          this.run_ext.push(call.bind(this));
        }
      }

      /**
       * Provides a function to be called whenever this Animation completes. Function should run every time the Animation reaches it's last frame-index.
       *
       * @function
       * @params {Function} call the function to be called on complete
       * @memberof Animation
       **********/

    }, {
      key: "onComplete",
      value: function onComplete(call) {

        if (this.complete_ext.indexOf(call) == -1) {
          this.complete_ext.push(call.bind(this));
        }
      }
    }, {
      key: "call_on_run",
      value: function call_on_run() {
        //call any function extension that is present
        for (var x = 0; x < this.run_ext.length; x++) {
          this.run_ext[x](this);
        }
      }
    }, {
      key: "call_on_complete",
      value: function call_on_complete() {
        //call any function extension that is present
        for (var x = 0; x < this.complete_ext.length; x++) {
          this.complete_ext[x](this);
        }
      }
    }, {
      key: "FrameSize",
      value: function FrameSize(w, h) {
        this.frameSize = new Gamelab.Vector(w, h);

        this.__isInit = true;

        this.run();

        return this;
      }
    }, {
      key: "Hang",
      value: function Hang() {

        this._hang = true;
        return this;
      }
    }, {
      key: "FrameBounds",
      value: function FrameBounds(minVector, maxVector, termVector) {
        this.frameBounds = new Gamelab.VectorFrameBounds(minVector, maxVector, termVector);

        this.__isInit = true;

        this.run();

        return this;
      }
    }, {
      key: "FrameOffset",
      value: function FrameOffset(x, y) {
        this.frameOffset = new Gamelab.Vector(x, y);
        return this;
      }
    }, {
      key: "Seesaw",
      value: function Seesaw() {
        if (!this.seesaw_mode) {
          this.seesaw_mode = true;
        }

        return this;
      }
    }, {
      key: "Duration",
      value: function Duration(millis) {
        this.duration = millis;

        return this;
      }

      /**
       * Reverses all frames of the animation. Frames are then expected to run backwards.
       *
       * @function
       * @memberof Animation
       **********/

    }, {
      key: "ReverseFrames",
      value: function ReverseFrames() {

        this.reverse_frames = true;
        return this;
      }

      /**
       * Declares the animation a a single frame / full-image.
       *
       * @function
       * @param {Vector} frameSize optional size param
       * @memberof Animation
       **********/

    }, {
      key: "SingleFrame",
      value: function SingleFrame() {

        this.__frametype = 'single';

        this.frameSize = new Gamelab.Vector(this.image.domElement.width, this.image.domElement.height);

        this.frameBounds = false;

        this.selected_frame = new Gamelab.Frame().Image(this.image).Size(this.frameSize);

        this.frames = [];

        this.frames[0] = this.selected_frame;

        return this;
      }
    }, {
      key: "getArg",
      value: function getArg(args, key, fallback) {

        if (args.hasOwnProperty(key)) {

          return args[key];
        } else {
          return fallback;
        }
      }
    }, {
      key: "init",
      value: function init() {

        this.apply2DFrames();
        return this;
      }
    }, {
      key: "apply2DFrames",
      value: function apply2DFrames() {

        this.frames = [];

        var fcount = 0;

        var quitLoop = false;

        for (var y = this.frameBounds.min.y; y <= this.frameBounds.max.y; y++) {

          for (var _x32 = this.frameBounds.min.x; _x32 <= this.frameBounds.max.x; _x32++) {

            var framePos = {
              x: _x32 * this.frameSize.x + this.frameOffset.x,
              y: y * this.frameSize.y + this.frameOffset.y
            };

            var f = new Gamelab.Frame().Image(this.image).Size(this.frameSize).Position(framePos);

            this.frames.push(f);

            if (_x32 >= this.frameBounds.termPoint.x && y >= this.frameBounds.termPoint.y) {

              quitLoop = true;

              break;
            }

            fcount += 1;

            if (quitLoop) break;
          }
        }

        this.frames[0] = this.selected_frame = this.frames[0] || new Gamelab.Frame().Image(this.image).Size(this.frameSize);

        if (this.seesaw_mode) {

          // console.log('Animation: applying seesaw');

          var frames_reversed = this.frames.slice().reverse();

          this.frames.pop();

          this.frames = this.frames.concat(frames_reversed);
        }
        if (this.reverse_frames) {
          this.frames.reverse();
        }
      }
    }, {
      key: "scaleOf",
      value: function scaleOf(sized_Object) {

        var s = Larva.getPreferredPropertyByKey(sized_Object, 'size', 'argument had nested size variable. Using this instead.');

        return s.div(this.frameSize);
      }
    }, {
      key: "init_colorMap",
      value: function init_colorMap() {
        Larva.info('init_colorMap()');

        if (!Larva.allDefined([this.image, this.image.domElement])) return [];

        this.canvasObject = this.canvasObject || new Gamelab.OffscreenCanvasRendering(this.image);

        this.colorMap = this.colorMap || this.ColoredPixelGrid();

        return this.colorMap;
      }
    }, {
      key: "ColoredPixelGrid",
      value: function ColoredPixelGrid() {

        I('ColoredPixelGrid()');

        var image = this.image.domElement,
            ctx = this.canvasObject.ctx,
            grid = [],
            frameSizeDiv = this.selected_frame.frameSize.div(12).round();

        for (var x = 0; x <= image.width; x += frameSizeDiv.x) {
          for (var y = 0; y <= image.height; y += frameSizeDiv.y) {
            // Fetch pixel at current position
            var pixel = ctx.getImageData(x, y, 1, 1);
            // Check that opacity is above zero
            if (pixel.data[3] != 0) {

              var vector = new Gamelab.Vector(x, y),
                  gridObject = {

                position: vector,

                size: frameSizeDiv
              };

              grid.push(gridObject);
            }
          }
        }

        return grid;
      }

      /**
       * Returns the existing ColorMap for this animation.
       *
       * @function
       * @memberof Animation
       **********/

    }, {
      key: "getCurrentPixelMap",
      value: function getCurrentPixelMap() {

        Larva.info('getCurrentPixelMap()');

        var map = [];

        var frame = this.selected_frame;

        var __inst = this;

        this.colorMap = this.init_colorMap();

        for (var x in this.colorMap) {
          var c = this.colorMap[x];

          if (Gamelab.Collision.boxesCollide(frame.framePos, frame.frameSize, c.position, c.size)) {

            map.push(c);
          }
        }

        return map;
      }

      /**
       * Sets the frame to a specific array-index.
       *
       * @function
       * @param {number} ix the frame-index to apply.
       * @memberof Animation
       **********/

    }, {
      key: "setFrame",
      value: function setFrame(ix) {
        this.selected_frame = this.frames[ix];
      }
    }, {
      key: "update",
      value: function update() {

        if (this._hang && this.cix >= this.frames.length - 1) {
          this.cix = this.frames.length - 1;
        }

        this.selected_frame = this.frames[Math.round(this.cix) % this.frames.length];
      }
    }, {
      key: "reset",
      value: function reset() {

        this.apply2DFrames();

        this.cix = 0;
      }

      /**
       * Applies a continuous animation. Use this in parent-sprite's update if continuous animation is required.
       * Also works as a single call at any time during game-update.
       *
       * @function
       * @memberof Animation
       **********/

    }, {
      key: "run",
      value: function run() {

        if (this.__frametype == 'single') {
          return 0;
        }

        this.apply2DFrames();

        //update once:
        this.update();

        if (this.cix == 0) {

          this.engage();
        }
      }

      /**
       * animate():: same as run()
       *
       * @function
       * @memberof Animation
       **********/

    }, {
      key: "animate",
      value: function animate() {

        if (this.__frametype == 'single') {
          return 0;
        }

        this.apply2DFrames();

        //update once:
        this.update();

        if (this.cix == 0) {

          this.engage();
        }
      }

      /**
       * Engages, or updates the animation for a one full frame-cycle.
       *
       * @function
       * @param {number} duration the number of milliseconds the animation should take.
       * @memberof Animation
       **********/

    }, {
      key: "engage",
      value: function engage(duration) {

        this.call_on_run();

        duration = duration || this.duration || this.frames.length * 20;

        if (this.__frametype == 'single') {
          return 0;
        }

        var __inst = this;

        //we have a target
        this.tween = new TWEEN.Tween(this).easing(__inst.curve || TWEEN.Easing.Linear.None).to({ cix: __inst.frames.length - 1 }, duration).onUpdate(function () {
          //console.log(objects[0].position.x,objects[0].position.y);

          //   __inst.cix = Math.ceil(__inst.cix);

          __inst.update();
        }).onComplete(function () {
          //console.log(objects[0].position.x, objects[0].position.y);

          __inst.cix = 0;

          __inst.call_on_complete();

          __inst.isComplete = true;
        });

        if (this.cix == 0) this.tween.start();

        if (this.cix >= this.frames.length && !this._hang) {
          this.cix = 0;
        }
      }
    }]);

    return Animation;
  }();

  ;

  /** @memberof Gamelab */

  Gamelab.Animation = Animation;

  Gamelab.Animation.continuous = Gamelab.Animation.run; //'continuous is an alternate reference to 'run'.'

  Gamelab.Animation.continue = Gamelab.Animation.run; //'continue is an alternate reference to 'run'.'

  Gamelab.Animation.animate = Gamelab.Animation.run; //'animate is an alternate reference to 'run'.'
})();
; /**
  * Creates an instance of Sprite.
  *
  * <info-bit>Gamelab.Sprite is a container for 2D Animations.
  * -apply Sprite class to create behaviors for an entire 2d-game-entity.
  *
  * Sprites hold reference to their-own Animations and Sounds.</info-bit>
  
  * <iframe style='width:400px; height:450px; overflow:hidden;' src='../client/examples/js-class/Sprite.html'> </iframe>
  
  * @param   {string=} [src] the srcPath for the image of the Sprite
  * @param   {scale=} [anime] the scale to be applied to width + height of the image
  *
  * @returns {Sprite} a Gamelab.Sprite object
  *
  * @example
  *
  * //Create Sprite using Sprite constructor, with one src argument
  *
  *
  */

var Sprite = function (_Scriptable2) {
  _inherits(Sprite, _Scriptable2);

  function Sprite() {
    var src = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1.0;

    _classCallCheck(this, Sprite);

    var _this9 = _possibleConstructorReturn(this, (Sprite.__proto__ || Object.getPrototypeOf(Sprite)).call(this));

    _this9.Object(_this9);

    var args = (typeof src === "undefined" ? "undefined" : _typeof(src)) == 'object' ? src : {};

    if (args instanceof Gamelab.Animation) //instantiate from animation
      {
        console.dev('args was Gamelab.Animation', args);
        args = {
          selected_animation: args,
          image: args.image,
          size: new Gamelab.Vector(args.frameSize)
        };
      }

    //apply image from string 'src'

    if (typeof src == 'string') {
      _this9.src = src;
      _this9.selected_animation = new Gamelab.Animation(src);
      _this9.image = _this9.selected_animation.image;
      _this9.SingleFrame();
    }

    _this9.animations = [];

    //create size property
    _this9.size = new Gamelab.Vector(0, 0);

    if (typeof scale == 'number') //image plus 'scale' argument
      {
        _this9.scale = scale || 1.0;
      }

    _this9.active = true; //defaults to active or visible

    //apply remaining args
    _this9.apply_args(args);

    if (!_this9.selected_animation) _this9.SingleFrame();
    return _this9;
  }

  _createClass(Sprite, [{
    key: "static_image_load",
    value: function static_image_load(img) {

      this.size = new Gamelab.Vector(img.width * this.scale, img.height * this.scale).round();
    }

    /**
     * runs a function for the onload event of this sprite's image
     *
     * @function
     * @param {Function} f the function to be called on load
     * @memberof Sprite
     **********/

  }, {
    key: "onLoad",
    value: function onLoad(f) {

      var img = this.image.domElement,
          load = img.onload;

      f = f || function () {};

      f.bind(this);

      this.load_call = f;

      var $sprite = this;

      img.onload = function () {

        $sprite.load_total += 1;

        load.bind($sprite).call($sprite);

        //  $sprite.static_image_load(img);

        $sprite.load_call($sprite);
      };

      img.onerror = function (err) {

        $sprite.load_call(false, $sprite);
      };

      return this;
    }

    /**********
     * @ignore
     **********/

  }, {
    key: "apply_args",
    value: function apply_args() {
      var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


      this.FromData(args, true); //Using a FUNCTIONAL COPY --heavy to process

      if (args.image instanceof Gamelab.GameImage && !this.image) {
        this.image = args.image;
      }

      this.name = args.name || "__blankName";

      this.life = args.life || 999999999999;

      this.description = args.description || "__spriteDesc";

      this.id = this.create_id();

      this.animations = Gamelab.getArg(args, 'animations', []);

      this.scripts = Gamelab.getArg(args, 'scripts', []);

      this.motions = Gamelab.getArg(args, 'motions', []);

      this.particles = Gamelab.getArg(args, 'particles', []);

      this.shots = Gamelab.getArg(args, 'shots', []);

      this.sounds = Gamelab.getArg(args, 'sounds', []);

      this.init_ext = Gamelab.getArg(args, 'init_ext', []);

      this.group = Gamelab.getArg(args, 'group', 'one');

      this.scrollFactor = args.scrollFactor || 1.0;

      this.noScroll = args.noScroll || false;

      if (this.noScroll) {
        this.scrollFactor = 0;
      }

      this.speed = new Gamelab.Vector(Gamelab.getArg(args, 'speed', new Gamelab.Vector(0, 0)));

      this.size = new Gamelab.Vector(Gamelab.getArg(args, 'size', new Gamelab.Vector(0, 0)));

      this.position = new Gamelab.Vector(Gamelab.getArg(args, 'position', new Gamelab.Vector(0, 0, 0)));

      this.collision_bounds = Gamelab.getArg(args, 'collision_bounds', new Gamelab.VectorBounds(new Gamelab.Vector(0, 0, 0), new Gamelab.Vector(0, 0, 0)));

      this.rotation = new Gamelab.Vector(Gamelab.getArg(args, 'rotation', new Gamelab.Vector(0, 0, 0)));

      this.scale = args.scale || 1.0;

      this.acceleration = Gamelab.getArg(args, 'acceleration', new Gamelab.Vector(0, 0, 0));

      this.rot_speed = new Gamelab.Vector(Gamelab.getArg(args, 'rot_speed', new Gamelab.Vector(0, 0)));

      this.rot_accel = new Gamelab.Vector(Gamelab.getArg(args, 'rot_accel', new Gamelab.Vector(0, 0)));

      this.padding = Gamelab.getArg(args, 'padding', new Gamelab.Vector(0, 0, 0));

      var __inst = this;

      //Apply / instantiate Sound(), Gamelab.Motion(), and Gamelab.Animation() args...


      Gamelab.each(this.shots, function (ix, item) {

        __inst.shots[ix] = new Gamelab.Shot(item);
      });

      Gamelab.each(this.sounds, function (ix, item) {

        __inst.sounds[ix] = new Gamelab.Sound(item);
      });

      Gamelab.each(this.motions, function (ix, item) {

        __inst.motions[ix] = new Gamelab.TweenMotion(item);
      });

      Gamelab.each(this.animations, function (ix, item) {

        __inst.animations[ix] = new Gamelab.Animation(item);
      });

      Gamelab.each(this.particles, function (ix, item) {

        __inst.particles[ix] = new Gamelab.GSProton(item);
      });

      //Apply initializers:

      Gamelab.each(this.init_ext, function (ix, item) {

        __inst.addInitializer(item);
      });

      if (!this.selected_animation && args.selected_animation) {

        console.dev('applying animation:' + jstr(args.selected_animation));

        this.selected_animation = new Gamelab.Animation(args.selected_animation);
      }
    }

    /**
     * Clones a sprite from existing data
     *
     * @function
     * @param {Object} object the data to be cloned
     * @memberof Sprite
     **********/

  }, {
    key: "Clone",
    value: function Clone(sprite) {
      console.log('using Clone() function');

      var clone = new Gamelab.Sprite(sprite.src);

      clone.Anime(new Gamelab.Animation(sprite.anime));

      clone.apply_args(sprite);

      return clone;
    }
  }, {
    key: "draw",
    value: function draw(ctx, camera) {

      var sprite = this;

      camera = camera || Gamelab.game_windows[0].camera || {
        position: new Gamelab.Vector(0, 0, 0)
      };

      if (sprite.active && (this.DRAWOFFSCREEN || sprite.onScreen(Gamelab.WIDTH, Gamelab.HEIGHT))) {
        this.draw_current_frame(ctx, camera);
      }
    }
  }, {
    key: "draw_current_frame",
    value: function draw_current_frame(ctx, camera) {

      var sprite = this;

      var frame;

      if (sprite.active) {

        if (sprite.selected_animation instanceof Object && sprite.selected_animation.hasOwnProperty('selected_frame')) {

          frame = sprite.selected_animation.selected_frame;
        } else {

          // console.error('Sprite is missing arguments');
          //delay the draw

          return;
        }

        var p = sprite.position;

        var camera_pos = camera.position || {
          x: 0,
          y: 0,
          z: 0
        };

        if (!sprite.hasOwnProperty('scrollFactor')) {
          sprite.scrollFactor = 1.0;
        }

        var x = p.x,
            y = p.y,
            scrollFactor = sprite.scrollFactor >= -1.0 && sprite.scrollFactor <= 1.0 ? sprite.scrollFactor : 1.0;

        if (sprite.noScroll) {
          scrollFactor = 0;
        }

        x -= camera_pos.x * scrollFactor || 0;
        y -= camera_pos.y * scrollFactor || 0;
        //optional animation : gameSize

        var targetSize = sprite.size || sprite.selected_animation.size;

        var realWidth = targetSize.x;
        var realHeight = targetSize.y;

        var origin = sprite.origin || new Gamelab.Vector(realWidth / 2, realHeight / 2);

        //optional animation : offset

        if (sprite.selected_animation && sprite.selected_animation.hasOwnProperty('offset')) {
          x += sprite.selected_animation.offset.x;

          y += sprite.selected_animation.offset.y;
        }

        var rotation;

        if (_typeof(sprite.rotation) == 'object') {

          rotation = sprite.rotation.x;
        } else {
          rotation = sprite.rotation;
        }

        var frame = sprite.selected_animation.selected_frame;

        sprite.realPosition = new Gamelab.Vector(x, y);

        if (frame && frame.image && frame.image.data) {

          ctx.putImageData(frame.image.data, x, y, 0, 0, sprite.size.x, sprite.size.y);
        } else {

          if (!sprite.selected_animation || !sprite.selected_animation.selected_frame.image.domElement) return;

          if (frame.image.domElement instanceof HTMLImageElement) {

            Gamelab.Canvas.draw_image_frame(frame.image.domElement, frame.framePos, frame.frameSize, new Gamelab.Vector2D(Math.round(x + realWidth / 2), Math.round(y + realHeight / 2)), new Gamelab.Vector2D(realWidth, realHeight), rotation % 360, ctx, sprite.flipX, sprite.flipY, origin);
          }
        }
      }
    }

    /**
     * adds an animation to the sprites
     *
     * @function
     * @param {Object} object the animation to be added
     * @memberof Sprite
     **********/

  }, {
    key: "Add",
    value: function Add(object) {

      if (object instanceof Gamelab.Animation) {
        this.animations.add(object);
      }

      return this;
    }
  }, {
    key: "Anime",
    value: function Anime(anime) {
      if (anime) this.selected_animation = anime;
      return this;
    }
  }, {
    key: "Animation",
    value: function Animation(anime) {
      if (anime) this.selected_animation = anime;
      return this;
    }
  }, {
    key: "FromData",
    value: function FromData() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var fxlCopy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      for (var x in data) {
        if (fxlCopy || typeof data[x] !== 'function') this[x] = data[x];
      }

      return this;
    }

    /**************************************************************
     * scales the sprite.size property according to image-size.
     * @param {number} scaleFloat a 0-1+ value
     *
     * @function
     * @memberof Sprite
     **************************************************************/

  }, {
    key: "Scale",
    value: function Scale(scaleFloat) {

      this.scale = scaleFloat;

      this.size = new Gamelab.Vector(this.image.domElement.width * scaleFloat, this.image.domElement.height * scaleFloat);

      return this;
    }

    /**************************************************************
     * applies a float value arg to Sprite.scrollFactor
     * @param {number} s a 0-1+ value
     *
     * @function
     * @memberof Sprite
     **************************************************************/

  }, {
    key: "ScrollFactor",
    value: function ScrollFactor(s) {
      this.scrollFactor = s;

      return this;
    }
  }, {
    key: "engage",
    value: function engage(obj) //engages an object having an engage function
    {

      obj.parent = this;

      if (obj.engage) {
        obj.engage();
      }
    }

    /**
     * pass argument v to the sprite.life property.
     * @function
     * @memberof Sprite
     * @param {number} v number of render-updates that this Sprite will last. --update occurs 60+ times per second, or less, depending on performance
     * @returns {Sprite} the sprite object --enables chainable function calls
     **********/

  }, {
    key: "Life",
    value: function Life(v) {

      this.life = v;

      return this;
    }

    /**
     * initializes sprites. triggers all functions previously passed to the addInitializer function.
     * Use this function when a sprite, instantiated from json-data, carries initializers.
     * --This feature is built for the purpose of data-persistence. --sprites from json-file may carry behaviors onto the scene.
     *
     * @function
     * @memberof Sprite
     **********/

  }, {
    key: "init",
    value: function init() {}

    /**
     * extends the init function.
     * @function
     * @memberof Sprite
     * @param {function} fun the function to be passed into the init function of the sprite
     **********/

  }, {
    key: "addInitializer",
    value: function addInitializer(fun) {

      var boundFun = fun.bind(this);

      if (this.init_ext.indexOf(boundFun) < 0) {

        this.init_ext.push(boundFun);
      };
    }

    /*****************************
     * Getters
     ***************************/

    /**
     * returns the 'id' property of the sprite
     * @function
     * @memberof Sprite
     * @returns {string}
     **********/

  }, {
    key: "get_id",
    value: function get_id() {
      return this.id;
    }

    /**********
     * @ignore
     **********/

  }, {
    key: "to_map_object",
    value: function to_map_object(size, framesize) {

      this.__mapSize = new Gamelab.Vector(size || this.size);

      this.frameSize = new Gamelab.Vector(framesize || this.size);

      return this;
    }

    /*****************************
     * Setters and Creators
     ***************************/

    /**
     * creates a unique string id property for the sprite.
     * @function
     * @memberof Sprite
     * @returns {string}
     **********/

  }, {
    key: "create_id",
    value: function create_id() {

      return Gamelab.create_id();
    }

    /**
     * returns a maximum scaled size, according to max dimensions of width and height
     * @param {number} mx the maximum size.x for the returned size
     * @param {number} my the maximum size.y for the returned size
     * @function
     * @memberof Sprite
     * @returns {Vector} a vector of x,y,z? values
     **********/

  }, {
    key: "getSizeByMax",
    value: function getSizeByMax(mx, my) {

      var size = new Gamelab.Vector(this.size);

      var wth = size.y / size.x;

      var htw = size.x / size.y;

      if (size.x > mx) {
        size.x = mx;

        size.y = size.x * wth;
      }

      if (size.y > my) {
        size.y = my;

        size.x = size.y * htw;
      }

      return size;
    }

    /*****************************
     *  assert the existence of a speed{} property
     *  sprite.speed (vector) is created if not existing in sprite
     *  @memberof Sprite
     ***************************/

  }, {
    key: "assertSpeed",
    value: function assertSpeed() {
      if (!this.speed) {
        this.speed = new Gamelab.Vector(0, 0, 0);
      }
    }

    /**
     * set the 'selected_animation' property to a single-frame-animation
     * @function
     * @memberof Sprite
     **********/

  }, {
    key: "SingleFrame",
    value: function SingleFrame() {

      if (!this.image || !this.image.domElement) {
        return this;
      }

      var __inst = this,
          load = this.image.domElement.onload || function () {};

      if (this.size && this.size.x !== 0 && this.size.y !== 0) return;

      var _obj = this;

      this.image.domElement.onload = function () {

        load(false, __inst);

        if (_obj.size && _obj.size.x !== 0 && _obj.size.y !== 0) {} else {
          __inst.size = new Gamelab.Vector(__inst.image.domElement.width, __inst.image.domElement.height);
          __inst.selected_animation = new Gamelab.Animation(__inst.image).FrameSize(__inst.size);
          __inst.Scale(__inst.scale || 1.0);
        }
      };

      Gamelab.log('set single-frame animation');

      return this;
    }

    /**
     * set the 'life' property to a specified integer
     * @function
     * @memberof Sprite
     **********/

  }, {
    key: "LifeSpan",
    value: function LifeSpan(value) {
      this.life = value;
    }

    /**
     * set the 'life' property to a specified integer
     * @function
     * @memberof Sprite
     **********/

  }, {
    key: "Life",
    value: function Life(value) //same as LifeSpan
    {
      this.life = value;
    }

    /**
     * tells if sprite has been taken out of game
     * @function
     * @memberof Sprite
     **********/

  }, {
    key: "isDead",
    value: function isDead(gw) {

      gw = gw || Gamelab.game_windows[0];

      return this.hasOwnProperty('life') && this.life <= 0;
    }

    /**
     * sets life to 0, then ending the sprite
     * @function
     * @memberof Sprite
     **********/

  }, {
    key: "die",
    value: function die(gw) {

      this.life = 0;

      return this;
    }

    /**
     * indicates if any portion of the sprite is within screen bounds --uses Gamelab.WIDTH, Gamelab.HEIGHT OR any w,h arguments passed to this method
     * @function
     * @memberof Sprite
     * @param {number} w optional screen-width argument, defaults to Gamelab.WIDTH
     * @param {number} h optional screen-height argument, defaults to Gamelab.HEIGHT
     * @returns {boolean} a true or false value to show if any part of the sprite is on-screen
     **********/

  }, {
    key: "onScreen",
    value: function onScreen(w, h, gw) {

      w = w || Gamelab.WIDTH;

      h = h || Gamelab.HEIGHT;

      gw = gw || Gamelab.game_windows[0];

      var camera = gw.camera || Gamelab.camera || {
        position: new Gamelab.Vector(0, 0, 0)
      },
          scrollFactor = this.noScroll ? 0 : this.scrollFactor;

      var camPos = new Gamelab.Vector(camera.position).mult(scrollFactor);

      var p = new Gamelab.Vector(this.position.x - camPos.x, this.position.y - camPos.y, this.position.z - camPos.z);

      return p.x + this.size.x > -1000 - w && p.x < w + 1000 && p.y + this.size.y > 0 - 1000 - h && p.y < h + 1000;
    }

    /*****************************
     * Updates
     ***************************/

    /*****************************
     * update()
     * -starts empty:: is applied recursively by Gamelab.js as the main sprite-update
     ***************************/

    /**
     * the main update for the sprite --applied recursively by GameWindow after gameWindow.start is called
     * @function
     * @memberof Sprite
     **********/

  }, {
    key: "update",
    value: function update(sprite) {}

    /*****************************
     * def_update()
     * -applies speed and other default factors of movement
     * -is used by Quick2d.js as the system def_update (default update)
     ***************************/

    /**
     * Automatically updates various speed and rotational properties for the Sprite()
     * @function
     * @memberof Sprite
     *
     * @example
     * // applies a constant speed property --speed is Vector(x, y)
     * mySprite.rot_speed = new Gamelab.Vector(3);
     * //def_update() will run automatically with the gamelab update. The above sprite will rotate at a constant speed of 3.
     * @example
     * // how to reset to nothing:: if automatic speed updates are undesired, replace the def_update() function with a 'do nothing' function.
     * mySprite.def_update = function()
     *                      {
     *                     //do nothing
     *                     };
     **********/

  }, {
    key: "def_update",
    value: function def_update(sprite) {

      if (this.hasOwnProperty('life') && !isNaN(this.life)) {

        this.life -= 1;
      };

      for (var x in this.speed) {

        if (this.speed[x] > 0 || this.speed[x] < 0) {

          this.position[x] += this.speed[x];
        }
      }

      for (var x in this.acceleration) {

        if (this.acceleration[x] > 0 || this.acceleration[x] < 0) {

          this.speed[x] += this.acceleration[x];
        }
      }

      for (var x in this.rot_speed) {

        if (this.rot_speed[x] > 0 || this.rot_speed[x] < 0) {

          this.rotation[x] += this.rot_speed[x];
        }
      }

      for (var x in this.rot_accel) {

        if (this.rot_accel[x] > 0 || this.rot_accel[x] < 0) {

          this.rot_speed[x] += this.rot_accel[x];
        }
      }
    }

    /**
     * extends an existing function, and is applied by Gamelab in addInitializer();
     * @ignore
     * -REMOVED FROM DOCS : SYSTEM USE ONLY
     **********/

  }, {
    key: "extendFunc",
    value: function extendFunc(fun, extendedFunc) {

      console.log('extending func');

      var ef = extendedFunc;

      var __inst = this;

      return function () {

        ef(__inst);

        //any new function comes after

        fun(__inst);
      }.bind(this);
    }

    /*****************************
     *  onUpdate(fun)
     * -args: 1 function(sprite){ } //the self-instance/sprite is passed into the function()
     * -overrides and maintains existing code for update(){} function
     ***************************/

    /**
     * extends the update of this sprite with a new function to be called during the update
     * --repeated calls will extend, (not replace) the update --Allows multiple extensions of the update
     * @function
     * @memberof Sprite
     * @param {function} fun the function to be appended to sprite.update
     *
     *  * @example
     * // extend the behavior of your sprite
     * mySprite.onUpdate(function(spr)
     *
     *                    console.log('extended update'); //runs automatically whenever sprite.update runs
     *
     *                   });
     *
     **********/

  }, {
    key: "onUpdate",
    value: function onUpdate(fun) {

      var id = this.create_id();

      fun = fun.bind(this);

      var update = this.update.bind(this);

      var __inst = this;

      this.update = function (__inst) {

        update(__inst);

        fun(__inst);
      };
    }

    /*****************************
     *  travelLineTwoWay()
     *  -sprite travels line: any Line() or object with property of line
     ***************************/

    /********************************************************************************
     * sprite travels on a line in a back-and-forth motion --to the end of the line, and back.
     * #Dev-todo:MORE ON THIS
     * @function
     * @memberof Sprite
     *********************************************************************************/

  }, {
    key: "travelLineTwoWay",
    value: function travelLineTwoWay(lineObject, speed, curveKey, offset) {

      speed = speed || 1;

      var motionCurveOptions = ["linear", "quadratic", "cubic"];

      curveKey = curveKey || "linear";

      var line = lineObject;

      if (lineObject.line) {
        line = lineObject.line;
      }

      this.__crtLineIx = this.__crtLineIx || 0;

      var __inst = this,
          pctFloat = __inst.__crtLineIx % ((line.points.length - 1) / 2) / ((line.points.length - 1) / 2);

      if (__inst.__crtLineIx >= (line.points.length - 1) / 2) {
        pctFloat = 1.0 - pctFloat;
      }

      var ixChange = Gamelab.Curves.InOut[curveKey](pctFloat) * speed * 0.5;

      if (curveKey == 'linear') {
        ixChange = speed;
      }

      ixChange = Math.ceil(ixChange);

      if (ixChange < 1) {
        ixChange = 1;
      }

      __inst.position = new Gamelab.Vector(line.points[__inst.__crtLineIx]);

      //console.log(ixChange);

      __inst.__crtLineIx += ixChange;

      if (__inst.__crtLineIx >= line.points.length) {

        line.points = line.points.reverse();
        __inst.__crtLineIx = 0;
      }

      if (offset instanceof Gamelab.Vector) {
        this.position = this.position.add(offset);
      }
    }

    /*****************************
     *  travelLineOnLoop()
     *  -sprite travels line: any Line() or object with property of line
     ***************************/

    /**
     * the sprite travels one line in a looping motion --useful for traveling Square, Circle, or other enclosed Lines.
     * #Dev-todo:MORE ON THIS
     * @function
     * @memberof Sprite
     **********/

  }, {
    key: "travelLineOnLoop",
    value: function travelLineOnLoop(lineObject, speed, curveKey, offset) {

      speed = speed || 1;

      var motionCurveOptions = ["linear", "quadratic", "cubic"];

      curveKey = curveKey || "linear";

      var line = lineObject;

      if (lineObject.line) {
        line = lineObject.line;
      }

      this.__crtLineIx = this.__crtLineIx || 0;

      var __inst = this,
          pctFloat = __inst.__crtLineIx % ((line.points.length - 1) / 2) / ((line.points.length - 1) / 2);

      if (__inst.__crtLineIx >= (line.points.length - 1) / 2) {
        pctFloat = 1.0 - pctFloat;
      }

      var ixChange = Gamelab.Curves.InOut[curveKey](pctFloat) * speed * 0.5;

      if (curveKey == 'linear') {
        ixChange = speed;
      }

      ixChange = Math.ceil(ixChange);

      if (ixChange < 1) {
        ixChange = 1;
      }

      __inst.position = new Gamelab.Vector(line.points[__inst.__crtLineIx]);

      // console.log(ixChange);

      __inst.__crtLineIx += ixChange;

      if (__inst.__crtLineIx >= line.points.length) {
        __inst.__crtLineIx = 0;
      }

      if (offset instanceof Gamelab.Vector) {
        this.position = this.position.add(offset);
      }
    }

    /**
     * returns a true || false value for immediate color-collision --non-transparent-pixels --between colored-pixels of this sprite and the sprite argument
     * @function
     * @memberof Sprite
     * @param {Sprite} spr the sprite object to be collided
     * @returns {boolean} a true or false value to show if collision is happening
     **********/

  }, {
    key: "hasPixelCollision",
    value: function hasPixelCollision(sprite) {

      if (!Larva.truthyPropsPerArray([this, sprite], 'selected_animation')) return;

      if (!Larva.truthyPropsPerArray([this.selected_animation, sprite.selected_animation], 'getCurrentPixelMap')) return;

      var anime = this.selected_animation,
          alt_anime = sprite.selected_animation;

      var grid1 = anime.selectedFramePixelMap = this.selected_animation.getCurrentPixelMap(),
          grid2 = alt_anime.selectedFramePixelMap = alt_anime.getCurrentPixelMap();

      for (var x in grid1) {
        for (var y in grid2) {
          if (Gamelab.Collision.boxesCollide(grid1[x].position, grid1[x].size, grid2[y].position, grid2[y].size)) {
            return true;
          }
        }
      }

      return false;
    }
  }, {
    key: "init_pixelCollision",
    value: function init_pixelCollision() {
      var anime = this.selected_animation;

      this.selectedFramePixelMap = anime.getCurrentPixelMap(anime.scaleOf(this.size));
      this.colliderHighlights = this.colliderHighlights || [];
    }
  }, {
    key: "init_colliderHighlights",
    value: function init_colliderHighlights(unitMarker) {
      while (this.colliderHighlights.length < 100) {
        var sprite = new Gamelab.Sprite(unitMarker);
        this.colliderHighlights.push(sprite);
        Gamelab.game_windows[0].add(sprite);
      }
    }
  }, {
    key: "pixelGridOff",
    value: function pixelGridOff() {}
  }, {
    key: "set_colliderHighlights",
    value: function set_colliderHighlights(hSprite, on) {
      this.collider_highlightsOn = on || false;

      this.init_pixelCollision();

      this.init_colliderHighlights(hSprite);

      var anime = this.selected_animation;

      for (var x in this.colliderHighlights) {
        this.colliderHighlights[x].active = false;
      }

      if (hSprite && this.collider_highlightsOn) for (var x in this.selectedFramePixelMap) {
        if (!this.colliderHighlights[x]) {
          continue;
        }

        var gridPiece = this.selectedFramePixelMap[x];

        var anime_scale = anime.scaleOf(this.size),
            real_gridPiece_pos = gridPiece.position.mult(anime_scale),
            real_gridPiece_size = gridPiece.size.mult(anime_scale);

        this.colliderHighlights[x].Pos(this.position.add(new Gamelab.Vector(real_gridPiece_pos.x, real_gridPiece_pos.y).sub(anime.selected_frame.framePos.mult(anime_scale))));

        this.colliderHighlights[x].Size(real_gridPiece_size);

        this.colliderHighlights[x].active = true;
      };
    }
  }, {
    key: "onPixelCollision",
    value: function onPixelCollision(sprite, callback, highlightSprite) {

      var anime = this.selected_animation;

      this.onUpdate(function () {

        var anime = this.selected_animation;

        if (this.hasPixelCollision(sprite)) {

          if (!this.colliderHighlights) {} else for (var x in colliderHighlights) {
            gameWindow.remove(colliderHighlights[x]);
          };

          callback(this, sprite);
        };
      });
    }

    /**
     * returns a true || false value for immediate box-collision --between this sprite and the sprite argument
     * @function
     * @memberof Sprite
     * @param {Sprite} sprite the alternate Sprite for collision detection
     * @returns {boolean} a true or false value to show if collision is happening
     **********/

  }, {
    key: "hasBoxCollision",
    value: function hasBoxCollision(sprite) {

      return Gamelab.Collision.spriteBoxesCollide(this, sprite);
    }
  }, {
    key: "onBoxCollision",
    value: function onBoxCollision(sprite, callback) {
      this.onUpdate(function () {

        if (this.hasBoxCollision(sprite, this.boxCollisionSettings.padding)) {

          callback(this, sprite);
        };
      });
    }

    /*****************************
     *  shoot(sprite)
     *  -fire a shot from the sprite:: as in a firing gun or spaceship
     *  -takes options{} for number of shots anglePerShot etc...
     *  -TODO: complete and test this code
     ***************************/

    /**
     * fire a Shot, or bullet-Sprite from the Sprite
     * @function
     * @memberof Sprite
     * @param {Object} options an object of arguments
     * @param {Gamelab.Animation} animation the animation to fire from the Sprite
     * @param {number} speed the speed of the shot that is projected
     * @param {Gamelab.Vector} position the initial position of the shot: defaults to current Sprite position
     * @param {Gamelab.Vector} size the Vector size of the shot
     * @param {Gamelab.Vector} rot_offset the rotational offset to apply: controls direction of the shot
     **********/

  }, {
    key: "shoot",
    value: function shoot(options, gw) {
      //character shoots an animation

      gw = gw || Gamelab.game_windows[0];

      this.prep_key = 'shoot';

      var animation = options.bullet || options.animation || options.anime || new Gamelab.Animation();

      var speed = options.speed || options.velocity || 1;

      var size = options.size || new Gamelab.Vector(10, 10, 0);

      var position = new Gamelab.Vector(options.position) || new Gamelab.Vector(this.position);

      var rot_offset = options.rot_offset || options.rotation || 0;

      var total = options.total || 1;

      var rot_disp = options.rot_disp || 0; //the full rotational-dispersion of the bullets

      var life = options.life || 900;

      var shots = [];

      for (var x = 0; x < total; x++) {

        var __playerInst = this;

        if (Gamelab.isAtPlay) {

          var bx = position.x,
              by = position.y,
              bw = size.x,
              bh = size.y;

          var shot = new Gamelab.Sprite({

            active: true,

            position: new Gamelab.Vector(position),

            size: new Gamelab.Vector(size),

            speed: speed,

            image: animation.image,

            rotation: new Gamelab.Vector(0, 0, 0),

            flipX: false,

            life: options.life

          });

          shot.setAnimation(animation);

          rot_offset = new Gamelab.Vector(rot_offset, 0, 0);

          shot.position.x = bx, shot.position.y = by;

          //Danger On this line: annoying math --dispersing rotation of bullets by rot_disp

          var div = rot_disp / total;

          var rotPlus = div * x + div / 2 - rot_disp / 2;

          shot.rotation.x = rot_offset.x + rotPlus;

          //  shot.origin = new Gamelab.Vector(position);

          shot.speed = new Gamelab.Vector(Math.cos(shot.rotation.x * 3.14 / 180) * speed, Math.sin(shot.rotation.x * 3.14 / 180) * speed);

          shots.push(shot);

          shot.onUpdate(function (spr) {
            // console.log('update:rotation:' + shot.rotation.x);


          });

          gw.add(shot);
        }
      }

      return shots;
    }

    /**
     * create a sub-sprite belonging to the current sprite
     * @function
     * @memberof Sprite
     * @param {Object} options an object of arguments
     * @param {Animation} animation the animation to fire from the Sprite
     * @param {number} speed the speed of the shot that is projected
     * @param {Vector} position the initial position of the shot: defaults to current Sprite position
     * @param {Vector} size the Vector size of the shot
     * @param {Vector} offset the positional offset to apply
     * @returns {Sprite} a Gamelab.Sprite object
     **********/

  }, {
    key: "subsprite",
    value: function subsprite(options, gw) {

      gw = gw || Gamelab.game_windows[0];

      var animation = options.animation || new Gamelab.Animation();

      var position = options.position || new Gamelab.Vector(this.position);

      var offset = options.offset || new Gamelab.Vector(0, 0, 0);

      var size = new Gamelab.Vector(options.size || this.size);

      if (Gamelab.isAtPlay) {

        var subsprite = gw.add(new Gamelab.Sprite({

          active: true,

          position: position,

          size: size,

          offset: offset,

          image: animation.image,

          rotation: new Gamelab.Vector(0, 0, 0),

          flipX: false,

          scrollFactor: this.scrollFactor,

          noScroll: this.noScroll

        }));

        subsprite.setAnimation(animation);

        return subsprite;
      } else {
        alert('No subsprite when not at play');
      }
    }

    /**
     * switch to the next frame on sprite.selected_animation
     * @function
     * @memberof Sprite
     * @param {Animation} animation the optional animation to switch to before animate is called, defaults to the existing sprite.selected_animation
     **********/

  }, {
    key: "animate",
    value: function animate(animation) {

      if (Gamelab.isAtPlay) {

        if (animation) {
          this.setAnimation(animation);
        }

        this.selected_animation.run();
      }
    }

    /**
     * run a function when the sprite.selected_animation is complete
     *
     * @function
     * @memberof Sprite
     * @param {Function} fun the function to call when the animation is complete
     *
     **********/

  }, {
    key: "onAnimationComplete",
    value: function onAnimationComplete(fun) {

      this.selected_animation.onComplete(fun);
    }

    /*****************************
     *  accelY
     *  -accelerate on Y-Axis with 'accel' and 'max' (speed) arguments
     *  -example-use: gravitation of sprite || up / down movement
     ***************************/

    /**
     * accelerate speed on the y-axis
     *
     * @function
     * @memberof Sprite
     * @param {number} accel the increment of acceleration
     * @param {number} max the maximum for speed
     *
     **********/

  }, {
    key: "accelY",
    value: function accelY(accel, max) {

      accel = Math.abs(accel);

      if (typeof max == 'number') {
        max = {
          y: max
        };
      }

      this.assertSpeed();

      var diff = max.y - this.speed.y;

      if (diff > 0) {
        this.speed.y += Math.abs(diff) >= accel ? accel : diff;
      };

      if (diff < 0) {
        this.speed.y -= Math.abs(diff) >= accel ? accel : diff;
      };
    }

    /*****************************
     *  accelX
     *  -accelerate on x-Axis
     *  -example-use: running of sprite || left / right movement
     ***************************/

    /**
     * accelerate speed on the x-Axis
     *
     * @function
     * @memberof Sprite
     * @param {number} accel the increment of acceleration
     * @param {number} max the maximum for speed
     *
     **********/

  }, {
    key: "accelX",
    value: function accelX(accel, max) {

      accel = Math.abs(accel);

      if (typeof max == 'number') {
        max = {
          x: max
        };
      }

      this.assertSpeed();

      var diff = max.x - this.speed.x;

      if (diff > 0) {
        this.speed.x += Math.abs(diff) >= accel ? accel : diff;
      };

      if (diff < 0) {
        this.speed.x -= Math.abs(diff) >= accel ? accel : diff;
      };
    }

    /*****************************
     *  accel
     *  -accelerate any acceleration -key
     ***************************/

    /**
     * decelerate speed on the x-Axis, toward zero
     * @function
     * @memberof Sprite
     * @param {number} amt the increment of deceleration, negatives ignored
     *
     **********/

  }, {
    key: "decelY",
    value: function decelY(amt) {

      amt = Math.abs(amt);

      if (Math.abs(this.speed.y) <= amt) {
        this.speed.y = 0;
      } else if (this.speed.y > amt) {

        this.speed.y -= amt;
      } else if (this.speed.y < amt * -1) {

        this.speed.y += amt;
      }
    }

    /*****************************
     *  decelX
     *  -decelerate on the X axis
     *  -args: 1 float:amt
     ***************************/

    /**
     * decelerate speed on the x-Axis, toward zero
     * @function
     * @memberof Sprite
     * @param {number} amt the increment of deceleration, negatives ignored
     *
     **********/

  }, {
    key: "decelX",
    value: function decelX(amt) {

      amt = Math.abs(amt);

      if (this.speed.x > amt) {

        this.speed.x -= amt;
      } else if (this.speed.x < amt * -1) {

        this.speed.x += amt;
      }

      if (Math.abs(this.speed.x) <= amt) {

        this.speed.x = 0;
      }
    }

    /**
     * accelerate toward a max value on any object-property
     * @function
     * @memberof Sprite
     * @param {Object} prop The object to control
     * @param {string} key the target property-key for object argument
     * @param {number} accel the additive increase to the property on each call
     * @param {number} max the max value to accelerate towards
     **********/

  }, {
    key: "accel",
    value: function accel(object, key, _accel, max) {

      var prop = object;

      _accel = Math.abs(_accel);

      if (typeof max == 'number') {
        max = {
          x: max
        };
      }

      var speed = prop[key];

      // this.assertSpeed();

      var diff = max.x - prop[key];

      if (diff > 0) {
        prop[key] += Math.abs(diff) >= _accel ? _accel : diff;
      };

      if (diff < 0) {
        prop[key] -= Math.abs(diff) >= _accel ? _accel : diff;
      };
    }

    /*****************************
     *  decel
     *  -deceleration -key
     ***************************/

    /**
     * decelerate toward a max value on any object-property
     * @function
     * @memberof Sprite
     * @param {Object} prop the object to control
     * @param {string} key the property-key for targeted property of prop argument
     *
     * @param {number} decel the increment of deceleration
     *
     * @param {number} max the max value to decelerate towards
     *
     *
     **********/

  }, {
    key: "decel",
    value: function decel(prop, key, rate) {

      if ((typeof rate === "undefined" ? "undefined" : _typeof(rate)) == 'object') {

        rate = rate.rate;
      }

      rate = Math.abs(rate);

      if (Math.abs(prop[key]) <= rate) {
        prop[key] = 0;
      } else if (prop[key] > 0) {
        prop[key] -= rate;
      } else if (prop[key] < 0) {
        prop[key] += rate;
      } else {

        prop[key] = 0;
      }
    }
  }, {
    key: "seekPosition",
    value: function seekPosition(target_Position, differential_SpeedMultiple) {
      var target = {};

      //always positive:
      differential_SpeedMultiple = Math.abs(differential_SpeedMultiple);

      if (target_Position.hasOwnProperty('position')) {
        console.log('1st argument had its own position property. Using this property now:');
        target = target_Position.position;
      } else {
        target = target_Position;
      }

      var diff = this.position.sub(target).mult(-1);

      this.speed = diff.mult(differential_SpeedMultiple);
    }

    /*****************************
     *  decelY
     *  -decelerate on the Y axis
     *  -args: 1 float:amt
     ***************************/

    /**
     * A generic 'smooth motion', adds to position.x and position.y with smooth acceleration and deceleration
     * --uses quadratic-easing of the TWEEN.js library
     * @function
     * @memberof Sprite
     * @param {number} x The x to be added to Sprite().positon.x over the course of the SmoothMotion --use negative for subtractive motion
     * @param {number} y The y to be added to Sprite().positon.y over the course of the SmoothMotion- -use negative for subtractive motion
     * @param {number} duration the amount of time taken to complete this motion
     *
     **********/

  }, {
    key: "SmoothMotion",
    value: function SmoothMotion(x, y, duration) {
      if ((typeof x === "undefined" ? "undefined" : _typeof(x)) == 'object') //argument coercion: x is a vector, y is duration
        {
          duration = y;
          y = x.y;
          x = x.x;
        }

      x = x + this.position.x;

      y = y + this.position.y;

      if (!TWEEN instanceof Object) {
        return console.error('TWEEN.js required for SmoothMotion();');
      }

      var t = new TWEEN.Tween(this.position).easing(TWEEN.Easing.Quadratic.InOut).to(new Gamelab.Vector(x, y), duration).onUpdate(function () {
        //console.log(objects[0].position.x,objects[0].position.y);


      }).onComplete(function () {
        //console.log(objects[0].position.x, objects[0].position.y);


      });

      t.start();
    }

    /**
     * A generic 'smooth rotate', adds to rotation.x with smooth acceleration and deceleration
     * --uses quadratic-easing of the TWEEN.js library
     * @function
     * @memberof Sprite
     * @param {number} r The numeric value to be added to Sprite().rotation.x over the course of the SmoothRotate --use negative for subtractive rotation
     * @param {number} duration the amount of time taken to complete this rotation
     **********/

  }, {
    key: "SmoothRotate",
    value: function SmoothRotate(r, duration) {

      if (!TWEEN instanceof Object) {
        return console.error('TWEEN.js required for SmoothRotate();');
      }

      r = r + this.rotation.x;

      var t = new TWEEN.Tween(this.rotation).easing(TWEEN.Easing.Quadratic.InOut).to(new Gamelab.Vector(r), duration).onUpdate(function () {
        //console.log(objects[0].position.x,objects[0].position.y);


      }).onComplete(function () {
        //console.log(objects[0].position.x, objects[0].position.y);


      });
      t.start();
    }

    /**
     * get the vector-position at the center of the sprite, based on its current position and size
     * @function
     * @memberof Sprite
     *
     * @returns (Vector) a vector-position pinpointing the current-center of the sprite
     *
     **********/

  }, {
    key: "center",
    value: function center() {

      return new Gamelab.Vector(this.position.x + this.size.x / 2, this.position.y + this.size.y / 2, 0);
    }

    /*****************************
     *  System Use / Collision
     ***************************/

    /*****************************
     * @ignore
     ***************************/

  }, {
    key: "shortest_stop",
    value: function shortest_stop(item, callback) {

      var diff_min_y = item.min ? item.min.y : Math.abs(item.position.y - this.position.y + this.size.y);

      var diff_min_x = item.min ? item.min.x : Math.abs(item.position.x - this.position.x + this.size.x);

      var diff_max_y = item.max ? item.max.y : Math.abs(item.position.y + item.size.y - this.position.y);

      var diff_max_x = item.max ? item.max.x : Math.abs(item.position.x + item.size.x - this.position.y);

      var dimens = {
        top: diff_min_y,
        left: diff_min_x,
        bottom: diff_max_y,
        right: diff_max_x
      };

      var minkey = "",
          min = 10000000;

      for (var x in dimens) {
        if (dimens[x] < min) {
          min = dimens[x];
          minkey = x; // a key of top left bottom or right
        }
      }

      callback(minkey);
    }

    /*************
     * #BE CAREFUL
     * -with this function :: change sensitive / tricky / 4 way collision
     * *************/

    /**
     * determine if sprite overlaps on x-axis with another sprite
     *
     * @function
     * @memberof Sprite
     * @param {Sprite} item the Sprite to compare with
     * @param {number} padding the 0-1.0 float value of padding to use on self when testing overlap
     * @returns {boolean} a true || false var showing if overlap has occured
     *
     **********/

  }, {
    key: "overlap_x",
    value: function overlap_x(item, padding) {
      if (!padding) {
        padding = 0;
      }

      var paddingX = Math.round(padding * this.size.x),
          paddingY = Math.round(padding * this.size.y),
          left = this.position.x + paddingX,
          right = this.position.x + this.size.x - paddingX,
          top = this.position.y + paddingY,
          bottom = this.position.y + this.size.y - paddingY;

      return right > item.position.x && left < item.position.x + item.size.x;
    }

    /*************
     * #BE CAREFUL
     * -with this function :: change sensitive / tricky / 4 way collision
     * *************/

    /**
     * determine if sprite overlaps on y-axis with another sprite
     * @function
     * @memberof Sprite
     * @param {Sprite} item the Sprite to compare with
     * @param {number} padding the 0-1.0 float value of padding to use on self when testing overlap
     * @returns {boolean} a true || false var showing if overlap has occured
     *
     **********/

  }, {
    key: "overlap_y",
    value: function overlap_y(item, padding) {
      if (!padding) {
        padding = 0;
      }

      var paddingX = Math.round(padding * this.size.x),
          paddingY = Math.round(padding * this.size.y),
          left = this.position.x + paddingX,
          right = this.position.x + this.size.x - paddingX,
          top = this.position.y + paddingY,
          bottom = this.position.y + this.size.y - paddingY;

      return bottom > item.position.y && top < item.position.y + item.size.y;
    }

    /*************
     * #BE CAREFUL
     * -with this function :: change sensitive / tricky / 4 way collision
     * *************/

    /**
     * stop collision on x-axis with another sprite
     * @function
     * @memberof Sprite
     * @param {Sprite} item the Sprite with which to collide-stop on the x-axis
     **********/

  }, {
    key: "collide_stop_x",
    value: function collide_stop_x(item) {

      var apart = false;

      var ct = 10000;

      while (!apart && ct > 0) {

        ct--;

        var diffX = this.center().sub(item.center()).x;

        var distX = Math.abs(this.size.x / 2 + item.size.x / 2 - Math.round(this.size.x * this.padding.x));

        if (Math.abs(diffX) < distX) {

          this.position.x -= diffX > 0 ? -1 : 1;
        } else {

          this.speed.x = 0;

          apart = true;
        }
      }
    }

    /*************
     * #BE CAREFUL
     * -with this function :: change sensitive / tricky / 4 way collision
     * *************/

    /**
     * Trigger a fourway collision-stop between this and another Sprite ::
     * objects will behave clastically and resist passing through one-another
     *
     * @function
     * @memberof Sprite
     * @param {Sprite} item the Sprite to collide with
     *
     **********/

  }, {
    key: "collide_stop",
    value: function collide_stop(item) {

      if (this.id == item.id) {
        return false;
      }

      this.speed = this.speed || new Gamelab.Vector(0, 0, 0);

      this.padding = this.padding || new Gamelab.Vector(0, 0, 0);

      // this.position = this.position.sub(this.speed);

      if (this.hasBoxCollision(item)) {

        var diff = this.center().sub(item.center());

        if (this.overlap_x(item, this.padding.x + 0.1) && Math.abs(diff.x) < Math.abs(diff.y)) {

          var apart = false;

          var ct = 10000;

          while (!apart && ct > 0) {

            ct--;

            var diffY = this.center().sub(item.center()).y;

            var distY = Math.abs(this.size.y / 2 + item.size.y / 2 - Math.round(this.size.y * this.padding.y));

            if (Math.abs(diffY) < distY) {

              this.position.y -= diffY > 0 ? -1 : diffY < 0 ? 1 : 0;

              this.position.y = Math.round(this.position.y);
            } else {

              if (diffY <= 0) {
                this.__inAir = false;
              };

              this.speed.y = 0;

              return apart = true;
            }
          }
        }

        if (this.overlap_y(item, this.padding.y) && Math.abs(diff.y) < Math.abs(diff.x)) {

          this.collide_stop_x(item);
        }
      }
    }

    /**
     * collide-stop only from the top (of the sprite passed as argument) ::
     *
     * @function
     * @memberof Sprite
     * @param {Sprite} item the Sprite to collide with
     *
     **********/

  }, {
    key: "collide_stop_top",
    value: function collide_stop_top(item, callback) {

      if (this.id == item.id) {
        return false;
      }

      if (this.overlap_x(item, this.padding.x + 0.1)) {

        console.log('OVERLAP_X');

        var paddingY = this.padding.y * this.size.y;

        if (this.position.y + this.size.y - paddingY <= item.position.y) {

          this.groundMaxY = item.position.y - this.size.y + paddingY;
        }
      }
    }

    /**
     * restore a sprite from existing json-data --applies to data-persistence
     *
     * @function
     * @memberof Sprite
     *
     * @returns (Sprite)
     **********/

  }, {
    key: "restoreFrom",
    value: function restoreFrom(data) {
      data.image = new GameImage(data.src || data.image.src);

      return new Gamelab.Sprite(data);
    }

    /*****************************
     * @ignore
     * #IN-TESTING
     *  fromFile(file_path)
     *  -TODO : complete this function based on code to load Sprite() from file, located in the spritemaker.html file
     *  -TODO: test this function
     ***************************/

  }, {
    key: "fromFile",
    value: function fromFile(file_path) {

      if (typeof file_path == 'string') {

        var __inst = this;

        $.getJSON(file_path, function (data) {

          __inst = new Gamelab.Sprite(data);
        });
      }
    }

    /*****************************
     * return a decycled json-string for the sprite --without circular references
     * @returns {string} a json string
     ***************************/

  }, {
    key: "toJSONString",
    value: function toJSONString() {
      return jstr(JSON.decycle(this));
    }
  }, {
    key: "animation",
    get: function get() {
      return this.selected_animation;
    }
  }, {
    key: "anime",
    get: function get() {
      return this.selected_animation;
    }
  }]);

  return Sprite;
}(Scriptable);

;

Gamelab.Sprite = Sprite;
;

var Text = function () {
  function Text(value) {
    _classCallCheck(this, Text);

    this.Text(value);

    this.FontSize(15);
    this.FontFamily('Arial');

    this.color = 'white';

    this.position = new Gamelab.Vector(0, 0);
  }

  _createClass(Text, [{
    key: "Font",
    value: function Font(fsize, ffamily) {
      this.FontSize(fsize);
      this.FontFamily(ffamily);
      return this;
    }
  }, {
    key: "FontSize",
    value: function FontSize(value) {
      if (typeof value !== 'string') value = value + '';

      value = value.replace('px', '') + 'px';

      this.fontSize = value;
      return this;
    }
  }, {
    key: "FontFamily",
    value: function FontFamily(value) {
      this.fontFamily = value;
      return this;
    }
  }, {
    key: "getOffsetPos",
    value: function getOffsetPos(pos) {
      var offset = this.window_offset || new Gamelab.Vector(0, 0);
      return pos.add(offset);
    }
  }, {
    key: "draw",
    value: function draw(ctx, camera) {

      var x = this.position.x + camera.position.x,
          y = this.position.y + camera.position.y;

      if (ctx.save) {
        ctx.save();
      }

      ctx.fillStyle = this.color;

      ctx.font = this.fontSize + ' ' + this.fontFamily;

      var pos = new Gamelab.Vector(x, y),
          realPos = this.getOffsetPos(pos);

      ctx.fillText(this.text, realPos.x, realPos.y);

      ctx.restore();
    }
  }]);

  return Text;
}();

Gamelab.Text = Text;
; /****************************
  * Robotix
  ***************************/

//Appendage:: one stack of objects which behave as single appendage:
//--a chain of links or an arm or leg made of separate parts

var Appendage = function Appendage() {
  _classCallCheck(this, Appendage);
};

//Single part which exists along with its parent object


var Attachment = function Attachment() {
  _classCallCheck(this, Attachment);
};

; /**
  * Creates a GravityForce instance.
  *
  *@param   {Object} args the object of arguments
  * @param   {string} args.name optional
  * @param   {string} args.description optional
  * @param   {Array} args.subjects the subjects to be pulled by the GravityForce
  * @param   {Array} args.clasticObjects any clastic object or array-of-objects that should have collision-stop behavior with subjects
  * @param   {Vector} args.max the max speed of the gravity-force, similar to concept of 'terminal velocity'
  * @param   {number} args.accel the increment of acceleration for each update called, while subjects are falling
  *
  * @returns {GravityForce} a GravityForce object
  */

(function () {
  console.log('Force class... creating');

  var GravityForce = function () {
    function GravityForce() {
      var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, GravityForce);

      this.name = args.name || "";

      this.description = args.description || "";

      this.subjects = args.subjects || [];

      this.clasticObjects = args.clasticObjects || [];

      this.topClastics = args.topClastics || [];

      this.max = args.max || new Vector3(3, 3, 3);
      this.accel = args.accel || new Vector3(1.3, 1.3, 1.3);

      for (var x in this.clasticObjects) {
        if (!this.clasticObjects[x] instanceof Gamelab.Sprite) {
          this.clasticObjects[x] = Gamelab.getById(this.clasticObjects[x].id);
        }
      }

      for (var x in this.topClastics) {
        if (!this.topClastics[x] instanceof Gamelab.Sprite) {
          this.topClastics[x] = Gamelab.getById(this.topClastics[x].id);
        }
      }

      for (var x in this.subjects) {
        if (!this.subjects[x] instanceof Gamelab.Sprite) {
          this.subjects[x] = Gamelab.getById(this.subjects[x].id);
        }
      }
    }

    _createClass(GravityForce, [{
      key: "getArg",
      value: function getArg(args, key, fallback) {

        if (args.hasOwnProperty(key)) {
          return args[key];
        } else {
          return fallback;
        }
      }

      /**
       * Updates position for all objects effected by this instance.
       * @memberof GravityForce
       */

    }, {
      key: "update",
      value: function update() {

        var subjects = this.subjects;

        var clasticObjects = this.clasticObjects;

        var topClastics = this.topClastics;

        var accel = this.accel || {};

        var max = this.max || {};

        Gamelab.each(subjects, function (ix, itemx) {

          if (!itemx.jumping && !itemx.flying) itemx.accelY(accel, max);

          itemx.__inAir = true;

          if (itemx.position.y >= itemx.groundMaxY) {

            itemx.position.y = itemx.groundMaxY;
          }

          itemx.groundMaxY = 3000000; //some crazy number you'll never reach in-game

          Gamelab.each(topClastics, function (iy, itemy) {

            //    itemx.collide_stop_top(itemy);

          });
        });
      }
    }]);

    return GravityForce;
  }();

  ;

  var Force = GravityForce;

  Gamelab.Force = Force;

  Gamelab.GForce = Force;

  Gamelab.GravityForce = GravityForce;
})();
;;;;;
var Player = function (_Sprite) {
  _inherits(Player, _Sprite);

  function Player() {
    _classCallCheck(this, Player);

    return _possibleConstructorReturn(this, (Player.__proto__ || Object.getPrototypeOf(Player)).apply(this, arguments));
  }

  _createClass(Player, [{
    key: "OnInput",
    value: function OnInput(inputDevice, arg1, arg2, callback) {
      console.info('Player.OnInput: Feature not implemented');
    }
  }]);

  return Player;
}(Sprite);

Gamelab.Player = Player;
;

/**
 * Creates an instance of Shot.
 * <info-bit>Shot object fires a moving-animation from a sprite </info-bit>
 *
 * @param   {string} name the name of this Shot
 * @param   {GameImage | Animation} imageOrAnimation the GameImage or Animation to apply for this Shot
 * @returns {Shot} a Gamelab.Shot object
 */

var Shot = function () {
  function Shot(name, imageOrAnimation) {
    _classCallCheck(this, Shot);

    this.name = name || 'No-Name';

    if (imageOrAnimation instanceof Gamelab.GameImage) {
      this.anime = new Animation(imageOrAnimation);
    } else if (imageOrAnimation instanceof Gamelab.Animation) {
      this.anime = imageOrAnimation;
    }

    this.rotation = 0;

    this.rot_disp = 0;

    var args = name instanceof Object ? name : {};

    //is name / first arg an entire instance of shot?

    this.init(args);
  }

  _createClass(Shot, [{
    key: "init",
    value: function init(args) {
      if (args instanceof Object) {

        for (var x in args) {

          this[x] = args[x];

          if (args[x] instanceof Object && args[x].hasOwnProperty('x')) //process as Vector
            {
              this[x] = new Vector(args[x]);
            }
        }
      }
    }
  }, {
    key: "Image",
    value: function Image(image) {

      this.anime = new Animation(image);
    }
  }, {
    key: "Animation",
    value: function Animation(anime) {
      this.anime = anime;
      return this;
    }
  }, {
    key: "Total",
    value: function Total(total, rot_disp_per_unit) {

      this.total = total;

      this.rot_disp = rot_disp_per_unit;

      return this;
    }
  }, {
    key: "WaveGrowth",
    value: function WaveGrowth(growth) {
      if (growth > 0) this.curve_growth = growth;
    }
  }, {
    key: "CurveMode",
    value: function CurveMode(key, size, growth) {
      this.curve = Gamelab.Curves.InOut[key.toLowerCase()];

      this.curve_key = key.toLowerCase();

      this.curve_size = size;

      if (growth > 0) this.curve_growth = growth;

      if (typeof this.curve_size == 'number') this.curve_size = new Gamelab.Vector(this.curve_size, this.curve_size);

      return this;
    }
  }, {
    key: "RotDisp",
    value: function RotDisp(rot_disp) {
      this.rot_disp = rot_disp;

      return this;
    }
  }, {
    key: "Velocity",
    value: function Velocity(v) {
      this.velocity = v;

      return this;
    }
  }, {
    key: "onCollide",
    value: function onCollide(collideables, callback) {}
  }]);

  return Shot;
}();

Gamelab.Shot = Shot;
;
var Background = function (_Gamelab$Sprite) {
  _inherits(Background, _Gamelab$Sprite);

  function Background() {
    var arg1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var arg2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Background);

    var _this11 = _possibleConstructorReturn(this, (Background.__proto__ || Object.getPrototypeOf(Background)).call(this, arg1, arg2));

    var args = (typeof arg1 === "undefined" ? "undefined" : _typeof(arg1)) == 'object' ? arg1 : {};

    _this11.type = args.type || "parallax" || "basic" || false;

    _this11.source_objects = args.objects || args.source_objects || [];

    _this11.members = [];

    _this11.rows = args.rows || 1; //The Y number of repititions

    _this11.cols = args.cols || 1; //The X number of repetitions of the images

    _this11.flip = args.flip || false;

    _this11.fill = args.fill || false;

    _this11.flip = args.flip || false;

    return _this11;
  }

  _createClass(Background, [{
    key: "Flip",
    value: function Flip(value) {
      if (value == undefined) {
        this.flip = true;
      } else if (value == true || value == false) {
        this.flip = value;
      }

      return this;
    }
  }, {
    key: "Rows",
    value: function Rows(r) {
      this.rows = r;
      return this;
    }
  }, {
    key: "Cols",
    value: function Cols(c) {
      this.cols = c;
      return this;
    }
  }, {
    key: "Fill",
    value: function Fill(approxRows, approxCols, gw) {

      approxRows = approxRows || this.rows || 1;

      approxCols = approxCols || this.cols || 1;

      this.members.push(new Background(this)); //"This" or base image is always applied

      for (var x = 0; x < this.source_objects.length; x++) {
        this.members.push(new Background(this.source_objects[x])); //src strings OR Sprites()
      }

      gw = gw || Gamelab.game_windows[0];

      var w = gw.canvas.width,
          h = gw.canvas.height,
          xBacksTotal = Math.floor(approxRows / 2),
          yBacksTotal = Math.floor(approxCols / 2);

      var __inst = this;

      //create first row:

      for (var y = -yBacksTotal; y <= yBacksTotal + 1; y++) {
        console.log('adding background:' + y);

        for (var x = -xBacksTotal; x <= xBacksTotal + 1; x++) {

          this.members.push(new Background(this));

          var b = this.members[this.members.length - 1];

          b.setSize(this.size);

          var __inst = this;

          b.position.x = x * this.size.x;

          b.position.y = y * this.size.y;

          b.minX = -xBacksTotal * b.size.x + b.size.x;

          b.maxX = (xBacksTotal + 1) * b.size.x;

          b.minY = -yBacksTotal * b.size.y + b.size.y;

          b.maxY = yBacksTotal * b.size.y;

          if (x % 2 == 0) {
            b.flipX = true;
          }

          if (y % 2 == 0) {
            b.flipY = true;
          }

          b.onUpdate(function (spr) {

            spr.campos = gw.camera.position;

            var cx = spr.campos.x - spr.campos.x % spr.size.x,
                cy = spr.campos.y - spr.campos.y % spr.size.y;

            if (spr.position.x - cx < spr.minX) {

              spr.position.x = spr.maxX + cx;
            }

            if (spr.position.x - cx > spr.maxX) {

              spr.position.x = spr.minX + cx;
            }

            if (spr.position.y - cy < spr.minY) {

              spr.position.y = spr.maxY + cy;
            }

            if (spr.position.y - cy > spr.maxY) {

              spr.position.y = spr.minY + cy;
            }
          });

          gw.add(b); //add to window
        }
      }

      return this;
    }
  }, {
    key: "add",
    value: function add(object) {
      var cleanCheck = object instanceof Gamelab.Sprite || object instanceof Array && object[0] instanceof Gamelab.Sprite; //is Sprite

      if (!cleanCheck) {
        return console.error('Must have: valid contents (Gamelab.Sprite OR [] of Gamelab.Sprite())');
      }

      if (object instanceof Array) {
        this.source_objects.cancat(object);
      } else {
        this.source_objects.push(object);
      }

      return this;
    }
  }]);

  return Background;
}(Gamelab.Sprite);

Gamelab.Background = Background;;
//Author: Jordan E. Blake


var Effect = function () {
  function Effect() {
    _classCallCheck(this, Effect);
  }

  _createClass(Effect, [{
    key: "isAnimation",
    value: function isAnimation() {}
  }, {
    key: "isParticleEffect",
    value: function isParticleEffect() {}
  }, {
    key: "isSoundEffect",
    value: function isSoundEffect() {}
  }, {
    key: "commit",
    value: function commit() {}
  }]);

  return Effect;
}();

var SpriteMove = function () {
  function SpriteMove() {
    var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, SpriteMove);

    this.line = 100;

    this.timeLimit = 350;

    this.degreesRotated = 90;
  }

  _createClass(SpriteMove, [{
    key: "setAnimation",
    value: function setAnimation() {}
  }, {
    key: "setAnimationForward",
    value: function setAnimationForward() //set the basic animation OR 'forward anime'
    {}
  }, {
    key: "setAnimationBackard",
    value: function setAnimationBackard() //set the backward animation OR 'backward-anime'
    {}
  }, {
    key: "setLineBack",
    value: function setLineBack() //set the 'backward movement', should the Sprite need to return from the move
    {}
  }, {
    key: "setLine",
    value: function setLine() //set the basic line OR 'forward movement'
    {}
  }, {
    key: "setLineForward",
    value: function setLineForward() //set the basic line OR 'forward movement'
    {}
  }, {
    key: "setLineBack",
    value: function setLineBack() //set the 'backward movement', should the Sprite need to return from the move
    {}
  }, {
    key: "setImmediateEffects",
    value: function setImmediateEffects() //Effects triggered when the SpriteMove starts
    {}
  }, {
    key: "setAfterEffects",
    value: function setAfterEffects() //Effects triggered when the SpriteMove completes
    {}
  }, {
    key: "commit",
    value: function commit() {}
  }, {
    key: "then",
    value: function then() {}
  }]);

  return SpriteMove;
}();

var Jump = function () {
  function Jump(spriteMove) {
    _classCallCheck(this, Jump);
  }

  _createClass(Jump, [{
    key: "setAnimation",
    value: function setAnimation() {}
  }, {
    key: "setTimeLimit",
    value: function setTimeLimit() {}
  }, {
    key: "setUpward",
    value: function setUpward(distance, duration) {}
  }, {
    key: "setDownward",
    value: function setDownward(distance, duration) {}
  }, {
    key: "commit",
    value: function commit() {}
  }]);

  return Jump;
}();

var Vault = function () {
  function Vault(forward, back, afterEffects) {
    _classCallCheck(this, Vault);
  }

  _createClass(Vault, [{
    key: "commit",
    value: function commit() {}
  }, {
    key: "setForwardMove",
    value: function setForwardMove(line, curve, duration) {}
  }, {
    key: "setBackwardMove",
    value: function setBackwardMove(line, curve, duration) {}
  }, {
    key: "onForwardDone",
    value: function onForwardDone(psuedoEffect) {}
  }, {
    key: "onBackwardDone",
    value: function onBackwardDone(psuedoEffect) {}
  }]);

  return Vault;
}();

var Attack = function () {
  function Attack(spriteMove, rpsLevel, powerLevel, afterEffects) {
    _classCallCheck(this, Attack);
  }

  _createClass(Attack, [{
    key: "commit",
    value: function commit() {}
  }, {
    key: "setAfterEffects",
    value: function setAfterEffects(afterEffects) {}
  }, {
    key: "setRpsLevel",
    value: function setRpsLevel(rpsLevel) {}
  }, {
    key: "setPowerLevel",
    value: function setPowerLevel(pLevel) {}
  }]);

  return Attack;
}();

; /**
  * Takes an object of arguments and returns Projectile() object. Projectile fires a shot from the parent sprite, with specified offset, rotation, motion_curve, line_curve
   * @param   {Object} args object of arguments
  * @param   {string} args.name optional
  * @param   {string} args.description optional
  * @param   {string} args.distance the distance before dissappearance
  * @param   {TWEEN.Easing.'objectGroup'.'objectMember'} args.motion_curve the TWEEN.Easing function to be applied for motion/speed (Example: TWEEN.Easing.Quadratic.InOut)
  *
  *  * @param   {TWEEN.Easing.'objectGroup'.'objectMember'} args.line_curve the TWEEN.Easing function to be applied for line (Example: TWEEN.Easing.Quadratic.InOut)
  *
  * @returns {Projectile} a Projectile object
  */

var Projectile = function () {
  function Projectile() {
    var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Projectile);

    this.getArg = $Q.getArg;

    for (var x in args) {
      this[x] = args[x];
    }

    this.name = args.name || "__";

    this.description = args.description || "__";

    this.animation = Gamelab.getArg(args, 'animation', new Animation());

    this.parent_id = args.parent_id || args.object_id || "__blank"; //The parent object

    this.name = Gamelab.getArg(args, 'name', "__");

    this.size = false;

    if (args.size) {
      this.size = new Vector(args.size);
    } else if (this.animation && this.animation.frameSize) {
      this.size = new Vector(this.animation.frameSize);
    } else {
      console.info('Projectile():using default size.');
      this.size = new Vector(20, 20, 20);
    }

    this.origin = args.origin || new Vector(0, 0, 0);

    this.rotation = args.rotation || 0;

    this.line.Rotation(this.rotation);

    this.description = Gamelab.getArg(args, 'description', false);

    this.duration = Gamelab.getArg(args, 'duration', 500);

    this.delay = Gamelab.getArg(args, 'delay', 0);

    this.position = Gamelab.getArg(args, 'position', new Vector(0, 0, 0));

    this.motion_curve = Gamelab.getArg(args, 'motion_curve', TWEEN.Easing.Linear.None);

    this.highlighted = false;

    this.sprites = [];

    this.run_ext = args.run_ext || [];
  }

  /**
   * specify a function to be called when Motion is complete
   *
   * @function
   * @memberof Projectile
   * @param {Function} fun the function to be called when complete
   *
   **********/

  _createClass(Projectile, [{
    key: "onComplete",
    value: function onComplete(fun) {
      this.complete = fun;
    }
  }, {
    key: "onCollide",
    value: function onCollide(fun) {
      this.collide = fun;
    }
  }, {
    key: "setAnimation",
    value: function setAnimation(anime) {

      this.animation = anime;

      return this;
    }
  }, {
    key: "setMotionCurve",
    value: function setMotionCurve(c) {

      this.motion_curve = c;

      return this;
    }
  }, {
    key: "kill_one",
    value: function kill_one() {

      var spr = this.sprites[this.sprites.length - 1];

      Gamelab.remove(spr);
    }
  }, {
    key: "onRun",
    value: function onRun(caller, callkey) {

      this.run_ext = this.run_ext || [];

      this.run_ext.push({ caller: caller, callkey: callkey });
    }
  }, {
    key: "shoot_basic",
    value: function shoot_basic(position, size, rot_offset, speed, numberShots, disp) {

      var __playerInst = this;

      var bx = position.x,
          by = position.y,
          bw = size.x,
          bh = size.y;

      var half = numberShots / 2;

      for (var x = half * -1; x <= half; x++) {
        var shot = Gamelab.add(new Sprite({

          active: true,

          position: position,

          size: size,

          speed: speed,

          image: animation.image,

          rotation: new Vector3(0, 0, 0),

          flipX: false

        }));

        shot.setAnimation(animation);

        rot_offset = new Vector(rot_offset + x * disp, 0, 0);

        shot.position.x = bx, shot.position.y = by;
        shot.rotation.x = 0 + rot_offset.x;

        shot.stats = {

          damage: 1

        };

        if (!options.line) {

          shot.onUpdate(function () {

            shot.position.x += Math.cos(shot.rotation.x * 3.14 / 180) * speed;

            shot.position.y += Math.sin(shot.rotation.x * 3.14 / 180) * speed;
          });
        }
      }
    }
  }, {
    key: "fire",
    value: function fire(origin, rotation) {

      for (var x = 0; x < this.run_ext.length; x++) {

        this.run_ext[x].caller[this.run_ext[x].callkey]();
      }

      this.line.origin = origin;

      this.line.rotation = rotation;

      console.log('FIRING FROM:' + jstr(origin));

      var sprite = new Sprite({ image: this.animation.image });

      sprite.setAnimation(this.animation);

      sprite.setSize(this.size);

      sprite.position = new Vector(0, 0, 0);

      var __inst = this;

      __inst.line.fill();

      var lp = this.line.points;

      sprite.position = new Vector(lp[0]);

      sprite.onUpdate(function (sprite) {

        for (var x = 0; x < lp.length; x++) {

          if (sprite.position.equals(lp[x]) && x < lp.length - 1) {

            sprite.position = new Vector(lp[x + 1]);

            break;
          }

          if (x == lp.length - 1) {
            Gamelab.remove(sprite);
          }
        }
      });

      Gamelab.add(sprite);

      this.sprites.push(sprite);
    }
  }]);

  return Projectile;
}();

Gamelab.Projectile = Projectile;;

(function () {
  console.log('Terrain class... creating');

  var Terrain = function (_Gamelab$Sprite2) {
    _inherits(Terrain, _Gamelab$Sprite2);

    function Terrain() {
      var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Terrain);

      //init as Gamelab.Sprite()

      var _this12 = _possibleConstructorReturn(this, (Terrain.__proto__ || Object.getPrototypeOf(Terrain)).call(this, args));

      _this12.collideables = args.collideables || args.colliders || [];

      return _this12;
    }

    _createClass(Terrain, [{
      key: "Collideables",
      value: function Collideables(c) {
        this.collideables = c || [];

        if (!this.collideables instanceof Array) {
          return console.error('Must pass array for "c" argument');
        }

        return this;
      }
    }, {
      key: "onCollide",
      value: function onCollide() // Gamelab.Terrain instance should have an onCollide() function
      {}
    }]);

    return Terrain;
  }(Gamelab.Sprite);

  Gamelab.Terrain = Terrain;
})();
;

(function () {
  console.log('Interactive class... creating');

  var Interactive = function (_Gamelab$Sprite3) {
    _inherits(Interactive, _Gamelab$Sprite3);

    function Interactive() {
      var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Interactive);

      //init as Gamelab.Sprite()

      var _this13 = _possibleConstructorReturn(this, (Interactive.__proto__ || Object.getPrototypeOf(Interactive)).call(this, args));

      _this13.collision_settings = new Gamelab.CollisionSettings(args);

      _this13.collideables = args.collideables || [];

      Gamelab.Extendors.collideable(_this13, args); //overwrites the onCollide():

      return _this13;
    }

    _createClass(Interactive, [{
      key: "Collideables",
      value: function Collideables(c) {
        this.collideables = c || [];

        if (!this.collideables instanceof Array) {
          return console.error('Must pass array for "c" argument');
        }

        return this;
      }
    }, {
      key: "onCollide",
      value: function onCollide() // Gamelab.Interactive instance should have an onCollide() function
      {}
    }]);

    return Interactive;
  }(Gamelab.Sprite);

  Gamelab.Interactive = Interactive;
})();;
var SpriteArray = function () {
  function SpriteArray() {
    _classCallCheck(this, SpriteArray);

    this.sprites = [];

    this.update = [];

    this.moves = {};

    this.load = function () {};

    this.update = function () {};
  }

  _createClass(SpriteArray, [{
    key: "each",
    value: function each(f) {

      var ix = 0;

      this.sprites.forEach(function (spr) {

        f(ix, spr);

        ix += 1;
      });
    }
  }, {
    key: "add",
    value: function add(sprite) {
      this.sprites.push(sprite);
      return this;
    }

    /**
     * runs a function when the sprite's image has loaded
     *
     * @function
     * @params {Function} f the function to be called on load
     * @memberof Sprite
     **********/

  }, {
    key: "onLoadSprites",
    value: function onLoadSprites(f) {

      var sprites = this.sprites,
          len = this.sprites.length,
          ix = 0;

      var __spriteList = this;

      __spriteList.load = f.bind(this);

      sprites.forEach(function (spr) {

        spr.onLoad(function () {

          ix += 1;

          if (ix == len) {
            __spriteList.load(__spriteList.sprites);
          }
        });
      });
    }
  }]);

  return SpriteArray;
}();

Gamelab.SpriteArray = SpriteArray;

var SpriteVerticalChain = function (_SpriteArray) {
  _inherits(SpriteVerticalChain, _SpriteArray);

  function SpriteVerticalChain() {
    _classCallCheck(this, SpriteVerticalChain);

    return _possibleConstructorReturn(this, (SpriteVerticalChain.__proto__ || Object.getPrototypeOf(SpriteVerticalChain)).call(this));
  }

  _createClass(SpriteVerticalChain, [{
    key: "add",
    value: function add(sprite) {

      sprite.parent = this.sprites.length >= 1 ? this.sprites[this.sprites.length - 1] : false;

      sprite.onUpdate(function () {

        this.origin = this.origin || new Gamelab.Vector(this.size.x / 2, 0);

        if (this.parent) {

          this.offset = this.offset || new Gamelab.Vector(0, 0);

          var extremity = new Gamelab.Vector(0, this.parent.size.y);

          var p = this.parent.position.add(this.parent.origin);

          //  p = p.sub(this.origin);

          //  p = p.add(parent.origin);

          var np = new Gamelab.Vector(Gamelab.GeoMath.rotatePointsXY(extremity.x, extremity.y, this.parent.rotation.x));

          this.position = p.add(np).add(this.offset);
        }
      });

      this.sprites.push(sprite);

      return this;
    }
  }]);

  return SpriteVerticalChain;
}(SpriteArray);

Gamelab.SpriteVerticalChain = SpriteVerticalChain;
;

var SpriteCollider = function () {
  function SpriteCollider() {
    _classCallCheck(this, SpriteCollider);
  }

  _createClass(SpriteCollider, [{
    key: "PixelUnit",
    value: function PixelUnit() {}
  }, {
    key: "Box",
    value: function Box() {}
  }, {
    key: "Eliptical",
    value: function Eliptical() {}
  }, {
    key: "TestMode",
    value: function TestMode() {}
  }]);

  return SpriteCollider;
}();

;
var FeatureSymbol = function FeatureSymbol(key) {
  _classCallCheck(this, FeatureSymbol);

  this.key = key || "@NONE";
  this.symbol = Symbol(key);
};

Gamelab.FeatureSymbol = FeatureSymbol;

Gamelab.FeatureInjectors = Gamelab.FeatureInjectors || {};

Gamelab.FeatureInject = function (constructor, args) {

  //console.log('Gamelab.FeatureInject()');

  var GClassFeatures = {};

  for (var y in Gamelab.ObjectFeatureMap) {

    if (Gamelab[y] && typeof Gamelab[y] == 'function') {

      var constructor = Gamelab[y];

      GClassFeatures[y] = {};

      //  console.log('Feature Symbol-key:' + Gamelab.ObjectFeatureMap[x][y]);

      GClassFeatures[y].featureSymbols = GClassFeatures[y].featureSymbols || [];

      for (var z in Gamelab.ObjectFeatureMap[y]) {

        GClassFeatures[y].featureSymbols.push(new Gamelab.FeatureSymbol(Gamelab.ObjectFeatureMap[y][z]));

        GClassFeatures[y].featureSymbols.hasKey = function (key) {

          for (var x = 0; x < this.length; x++) {
            if (typeof this[x].key !== 'string') continue;

            if (this[x].key.indexOf('@') == -1) console.error('feature-keys must contain @');

            //  console.log('eval key:' + this[x].key.split('@')[1]);

            if (this[x].key.split('@')[1] == key) return true;
          }

          return false;
        };

        GClassFeatures[y].featureSymbols.hasSymbol = function (symbol) {
          for (var x in this) {
            if (this[x].symbol == symbol) return true;
          }

          return false;
        };

        //  console.info('adding feature-symbol:' + Gamelab.ObjectFeatureMap[x][y]);
      }
    } else {
      console.error('Gamelab.ObjectFeatureMap: member by name of ' + x + ' does not exist as member of Gamelab');
    }
  }

  console.info('FEATURES:', GClassFeatures);

  for (var x in Gamelab.FeatureInjectors) {

    //  console.log(Gamelab.FeatureInjectors[x]);

    var props = Larva.getProtoFuncs(Gamelab.FeatureInjectors[x]);

    for (var y = 0; y < props.length; y++) {

      console.log(x + ":" + props[y]);

      for (var z in GClassFeatures) {
        if (GClassFeatures[z] && GClassFeatures[z].featureSymbols.hasKey(props[y])) {

          Gamelab.FeatureInjectors[x][props[y]](Gamelab[z].prototype, args);
        }
      }
    }
  }
};

var CssFeatures = function () {
  function CssFeatures() {
    _classCallCheck(this, CssFeatures);
  }

  _createClass(CssFeatures, [{
    key: "colored",
    value: function colored(obj) {
      obj.Color = function (c) {
        this.color = c;
        return this;
      };
    }
  }, {
    key: "color_transition",
    value: function color_transition(min_color, max_color) {
      this.min_color = min_color;
      this.max_color = max_color;
      return this;
    }
  }, {
    key: "text",
    value: function text(obj) {
      obj.Text = function (value) {
        this.text = value;
        return this;
      };
    }
  }, {
    key: "opaque",
    value: function opaque(obj) {
      obj.Opacity = function (o) {
        this.opacity = o;
        return this;
      };
    }
  }]);

  return CssFeatures;
}();

;

var DataFunctions = function () {
  function DataFunctions() {
    _classCallCheck(this, DataFunctions);
  }

  _createClass(DataFunctions, [{
    key: "data",
    value: function data(obj) {

      obj.Name = function (n) {
        this.name = n;
        return this;
      };

      obj.Description = function (d) {
        this.description = d;
        return this;
      };

      obj.Context = function (c) {
        this.context = c;
        return this;
      };
    }
  }]);

  return DataFunctions;
}();

/***************************
GeometryFeatures:
  A functional dependency injector
  injects properties and functions according to Symbols
**************************/


var VectorFunctions = function () {
  function VectorFunctions() {
    _classCallCheck(this, VectorFunctions);

    this.name = 'VectorFunctionals';
  }

  _createClass(VectorFunctions, [{
    key: "collideable",
    value: function collideable(obj) {
      obj.collision_callback = function () {};
      obj.onCollide = args.onCollide || function (collideables, callback) {
        if (typeof collideables == 'function') {
          callback = collideables;
        }
        this.collision_callback = callback || function () {};
      };
    }
  }, {
    key: "spatial",
    value: function spatial(obj) {

      obj.Size = function (x, y, z) {

        if ((typeof x === "undefined" ? "undefined" : _typeof(x)) == 'object') this.size = new Gamelab.Vector(x);else if (!isNaN(x) && !isNaN(y)) //has minimum of numeric x and y
          this.size = new Gamelab.Vector(x, y, z);else //use x accross the vector
          this.size = new Gamelab.Vector(x, x, x);

        return this;
      };

      obj.Pos = function (x, y, z) {

        if ((typeof x === "undefined" ? "undefined" : _typeof(x)) == 'object') this.position = new Gamelab.Vector(x);else if (!isNaN(x) && !isNaN(y)) //has minimum of numeric x and y
          this.position = new Gamelab.Vector(x, y, z);else //use x accross the vector
          this.position = new Gamelab.Vector(x, x, x);

        return this;
      };

      obj.Rot = function (x, y, z) {

        if ((typeof x === "undefined" ? "undefined" : _typeof(x)) == 'object') this.rotation = new Gamelab.Vector(x);else if (!isNaN(x) && !isNaN(y)) //has minimum of numeric x and y
          this.rotation = new Gamelab.Vector(x, y, z);else //use x accross the vector
          this.rotation = new Gamelab.Vector(x, x, x);

        return this;
      };

      obj.Position = obj.Pos;

      obj.Rotate = obj.Rot;

      obj.Rotation = obj.Rot;
    }
  }, {
    key: "posable",
    value: function posable(obj) {

      obj.Pos = function (x, y, z) {

        if ((typeof x === "undefined" ? "undefined" : _typeof(x)) == 'object') this.position = new Gamelab.Vector(x);else if (!isNaN(x) && !isNaN(y)) //has minimum of numeric x and y
          this.position = new Gamelab.Vector(x, y, z);else //use x accross the vector
          this.position = new Gamelab.Vector(x, x, x);

        return this;
      };

      obj.Position = obj.Pos;
    }
  }, {
    key: "sizeable",
    value: function sizeable(obj) {

      obj.Size = function (x, y, z) {

        if ((typeof x === "undefined" ? "undefined" : _typeof(x)) == 'object') this.size = new Gamelab.Vector(x);else if (!isNaN(x) && !isNaN(y)) //has minimum of numeric x and y
          this.size = new Gamelab.Vector(x, y, z);else //use x accross the vector
          this.size = new Gamelab.Vector(x, x, x);

        return this;
      };

      obj.Position = obj.Pos;
    }
  }, {
    key: "rotable",
    value: function rotable(obj) {
      obj.Rot = function (x, y, z) {

        if ((typeof x === "undefined" ? "undefined" : _typeof(x)) == 'object') this.rotation = new Gamelab.Vector(x);else if (!isNaN(x) && !isNaN(y)) //has minimum of numeric x and y
          this.rotation = new Gamelab.Vector(x, y, z);else //use x accross the vector
          this.rotation = new Gamelab.Vector(x, x, x);

        if (typeof this.Transpose == 'function') {
          this.Transpose();
        }

        return this;
      };

      obj.Rotate = obj.Rot;

      obj.Rotation = obj.Rot;
    }
  }, {
    key: "minable",
    value: function minable(obj) {
      obj.Min = function (x, y, z) {

        if ((typeof x === "undefined" ? "undefined" : _typeof(x)) == 'object') this.min = new Gamelab.Vector(x);else if (!isNaN(x) && !isNaN(y)) //has minimum of numeric x and y
          this.min = new Gamelab.Vector(x, y, z);else //use x accross the vector
          this.min = new Gamelab.Vector(x, x, x);

        return this;
      };

      obj.Minimum = obj.Min;
    }
  }, {
    key: "maxable",
    value: function maxable(obj) {
      obj.Max = function (x, y, z) {

        if ((typeof x === "undefined" ? "undefined" : _typeof(x)) == 'object') this.max = new Gamelab.Vector(x);else if (!isNaN(x) && !isNaN(y)) //has minimum of numeric x and y
          this.max = new Gamelab.Vector(x, y, z);else //use x accross the vector
          this.max = new Gamelab.Vector(x, x, x);

        return this;
      };

      obj.Maximum = obj.Max;
    }
  }, {
    key: "boundable",
    value: function boundable(obj) {
      this.minable(obj);

      this.maxable(obj);
    }
  }, {
    key: "selftransposable",
    value: function selftransposable(obj) {
      //apply the transposition
      obj.Transpose = function (rotation, position) {

        this.rotation = new Gamelab.Vector(rotation || this.rotation);

        this.position = new Gamelab.Vector(position || this.position);

        //TODO: Modify this trig function and its call below to an optional 3D rotation

        for (var x = 0; x < this.points.length; x++) {

          var p = this.points[x];

          var np = Gamelab.Trig.rotate_from_xy(0, 0, p.x, p.y, this.rotation.x);

          this.points[x] = this.position.add(np);
        }
        return this;
      };
    }
  }, {
    key: "pointarrayflippable",
    value: function pointarrayflippable(obj) {
      //apply the transposition
      obj.FlipX = function () {

        var middle = Math.floor(this.points.length / 2); //account for FlipX with length of --odd number

        var x, y;

        for (x = this.points.length - 1, y = 0; x > middle, y < middle; x--, y++) {

          var p1 = this.points[x],
              p2 = this.points[y];

          var _ref = [p2.x, p1.x];
          p1.x = _ref[0];
          p2.x = _ref[1];
        }

        return this;
      };

      //apply the transposition
      obj.FlipY = function () {

        var middle = Math.floor(this.points.length / 2); //account for FlipX with length of --odd number

        var x, y;

        for (x = this.points.length - 1, y = 0; x > middle, y < middle; x--, y++) {

          var p1 = this.points[x],
              p2 = this.points[y];

          var _ref2 = [p2.y, p1.y];
          p1.y = _ref2[0];
          p2.y = _ref2[1];
        }

        return this;
      };
    }
  }, {
    key: "informable",
    value: function informable(obj, args) {
      obj.name = Gamelab.getArg(args, 'name', "__ObjectName");

      obj.description = Gamelab.getArg(args, 'description', false);

      obj.group = Gamelab.getArg(args, 'group', 'one');
    }
  }, {
    key: "tweenable",
    value: function tweenable(obj) {

      obj.curve_string = obj.curve_string || "linearNone";

      obj.setTweenCurve = function (c) {

        c = c || "linear_none";

        var cps = c.split('_');

        //alert(cps);

        var s1 = cps[0].toLowerCase(),
            s2 = cps[1].toLowerCase();

        var curve = TWEEN.Easing.Linear.None;

        obj.curve_string = 'linear_none';

        Gamelab.each(TWEEN.Easing, function (ix, easing) {

          Gamelab.each(TWEEN.Easing[ix], function (iy, easeType) {

            if (ix == s1 && iy == s2) {

              // alert('setting curve');

              curve = TWEEN.Easing[ix][iy];

              obj.curve_string = ix + '_' + iy;
            }
          });
        });

        obj.curve = curve;

        return curve;
      };

      obj.curvesToArray = function () {

        var c = [];

        Gamelab.each(TWEEN.Easing, function (ix, easing) {

          Gamelab.each(easing, function (iy, easeType) {

            if (['in', 'out', 'inout', 'none'].indexOf(iy.toLowerCase()) >= 0) {

              c.push(ix + "_" + iy);
            }
          });
        });

        return c;
      };
    }
  }]);

  return VectorFunctions;
}();

;

Gamelab.FeatureInjectors.CssFeatures = new CssFeatures();

Gamelab.FeatureInjectors.VectorFunctions = new VectorFunctions();

Gamelab.FeatureInjectors.DataFunctions = new DataFunctions();
;var Larva = {

  DEV: false,

  //Display message in console
  info: function info(arg1, arg2) {

    if (!this.DEV) return;

    console.info(arg1, arg2);
  },

  log: function log(arg1, arg2) {

    if (!this.DEV) return;

    console.log(arg1, arg2);
  },

  /* ERRORS always show */
  error: function error(arg1, arg2) {

    if (!this.DEV) return;

    console.error(arg1, arg2);
  },

  warn: function warn(arg1, arg2) {

    if (!this.DEV) return;

    console.error(arg1, arg2);
  },

  //obj is number or becomes fallback
  number: function number(_number) {
    var fallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


    _number = typeof _number == 'number' ? _number : fallback;
  },

  //obj is string or becomes fallback
  string: function string(_string, fallback) {

    _string = typeof _string == 'string' ? _string : fallback;
  },

  //obj is Array or becomes wrapped in [] as [obj]
  arrayWrap: function arrayWrap(obj) {
    if (obj instanceof Array) return obj;else return [obj];
  },

  //obj or array-of-objects are ALL truthy (return=true) or not (return=false)
  allDefined: function allDefined(obj_all) {

    var list = this.arrayWrap(obj_all);

    var failed = false;

    for (var x in list) {
      if (!list[x]) {
        failed = true;
        console.error('Failed to define @ Larva.Define()');
      }
    };

    return !failed;
  },

  //getPreferredPropertyByKey(): uses the property[key] if present, if not returns same property passed in
  getPreferredPropertyByKey: function getPreferredPropertyByKey(property, key, warning) {

    if (property.hasOwnProperty(key)) {
      this.warn(warning);
      return property[key];
    } else {
      return property;
    }
  },

  //obj's are all of type or return false
  psuedoTypeCheck: function psuedoTypeCheck(obj) //obj is type or is encapsulated into type
  {
    var psuedotype = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var throwing = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var list = this.arrayWrap(obj);

    for (var x in list) {
      if (_typeof(list[x]) !== psuedotype && !(list[x] instanceof psuedotype)) {
        if (!throwing) return console.error(error);else throw new console.error(error);
      }
    }

    return true;
  },

  getAllFuncs: function getAllFuncs(obj) {

    return Object.getOwnPropertyNames(obj).filter(function (p) {
      return typeof obj[p] === 'function';
    });
  },

  getProtoFuncs: function getProtoFuncs(obj) {

    return Object.getOwnPropertyNames(obj.__proto__).filter(function (p) {
      return typeof obj[p] === 'function';
    });
  },

  truthOrDie: function truthOrDie(list, exitMessage) //All members of Array are truthy or the program exits with Error()
  {
    function findError(obj, error) {
      return obj || new Error(error);
    };

    for (var x in list) {

      var e = findError(list[x], exitMessage);

      if (e instanceof Error) {
        console.Error(e);
      }
    };
  },

  truthyPropsPerArray: function truthyPropsPerArray(obj, propKeys, kill) {

    var list = this.arrayWrap(obj),
        keys = this.arrayWrap(propKeys);

    var error = "The required truthy property has non-truthy value.";

    function findError(obj, prop) {
      return obj[prop] || new Error(error);
    };

    var failed = false;

    for (var x in list) {
      for (var y in keys) {
        var e = findError(list[x], keys[y]);
        if (e instanceof Error) {
          failed = true;
          if (kill) throw e;else console.error(e);
        }
      }
    }

    return !failed;
  },

  typeArgsExtract: function typeArgsExtract(obj, type) //obj is type or is each-converted into type
  {
    if (obj instanceof type) {
      return obj;
    } else {
      obj = [obj];
    }
    return obj;
  },

  typeOrHalt: function typeOrHalt(obj, type) //obj is type or error is thrown
  {
    if (obj instanceof type) {
      return obj;
    } else {
      throw new Error('object not of required type');
      console.info(obj);
      console.info(type + "?");
    }
    return obj;
  },

  typeOrError: function typeOrError(obj, type) //obj is type or error is logged, execution continues
  {
    if (obj instanceof type) {
      return obj;
    } else {
      console.log(new Error('object not of required type'));
      console.info(obj);
      console.info(type + "?");
    }
    return obj;
  },

  check: function check(object, propKey, propValue) {
    if (!object[propKey]) {
      object[propKey] = propValue;
    }
  }
};
;var Logger = {

  options: {

    error: true,

    info: true,

    warning: true

  },

  log: function log(message) {},

  interlog: function interlog(message, loopDuration) {},

  info: function info(message) {},

  warning: function warning(message) {},

  error: function error(message) {}
};

var E = function E(msg, halt) {
  //basic Error
  console.error(msg);
};

var L = function L(str1, str2) {
  console.log(str1, str2);
};

var I = function I(str1, str2) {
  console.info(str1, str2);
};

var R = function R(obj, callback) {
  for (var x in obj) {
    callback(obj[x]);
  }
};
; /**
  * Creates Gamelab.js Canvas: The canvas-renderer for Gamelab games.
  
  @description
  This Canvas library handles the low-level drawing of Gamelab.Animation objects on HTML5Canvas.
  -Draws Sprites according to their rotation, size, and properties.
  * @returns {CanvasLib} a CanvasLib object.
  */

(function () {

  console.log('CanvasStack class... creating');

  var GamelabCanvas = function () {
    function GamelabCanvas() {
      _classCallCheck(this, GamelabCanvas);

      this.__levelMaker = false;

      //draw is synonymous w/ drawSprite
      this.draw = this.draw_object;
    }

    _createClass(GamelabCanvas, [{
      key: "isStopped",
      value: function isStopped() {

        return Gamelab.stopDraw || false;
      }
    }, {
      key: "arc",
      value: function arc(p1, p2) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};


        if (this.isStopped()) return;

        var ctx = Gamelab.game_windows[0].ctx;

        ctx.strokeStyle = 'aqua';

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p2.x, p2.y, Math.PI * 2, true);
        ctx.stroke();
      }
    }, {
      key: "draw_image_frame",
      value: function draw_image_frame(image, framePos, frameSize, position, size, rotation, canvasContext, flipX, flipY, origin) {

        if (this.isStopped()) return;

        var fx = framePos.x,
            fy = framePos.y,
            fw = frameSize.x,
            fh = frameSize.y,
            x = position.x,
            y = position.y,
            width = size.x,
            height = size.y;

        //save canvas state before draw
        canvasContext.save();

        //degrees rotation:
        var deg = Math.round(rotation);
        deg = deg % 360;
        var rad = deg * Math.PI / 180;
        //Set the origin to the center of the image
        canvasContext.translate(x, y);
        canvasContext.rotate(rad);
        //Rotate the canvas around the origin

        canvasContext.translate(0, canvasContext.width);

        if (flipX) {

          canvasContext.scale(-1, 1);
        } else {}

        if (flipY) {

          canvasContext.scale(1, -1);
        } else {}

        origin = origin || new Gamelab.Vector(width / 2, height / 2);

        //draw the image
        canvasContext.drawImage(image, fx, fy, fw, fh, origin.x * -1, origin.y * -1, width, height);
        //reset the canvas

        canvasContext.restore();
      }
    }, {
      key: "draw_data",
      value: function draw_data(x, y, w, h, data, ctx) {

        if (this.isStopped()) return;

        ctx.putImageData(data, x, y, 0, 0, w, h);
      }
    }]);

    return GamelabCanvas;
  }();

  Gamelab.Canvas = new GamelabCanvas();

  Gamelab.GamelabCanvas = GamelabCanvas;

  var OffscreenCanvasRendering = function OffscreenCanvasRendering(psuedoImage) {
    _classCallCheck(this, OffscreenCanvasRendering);

    I('StashToCanvas():');

    this.htmlImage = psuedoImage.domElement || psuedoImage;

    this.testCanvas = document.createElement("CANVAS");

    this.testCtx = this.testCanvas.getContext("2d");

    this.testCanvas.width = this.htmlImage.width;

    this.testCanvas.height = this.htmlImage.height;

    this.testCanvas.style.zIndex = '9999';

    this.testCtx.drawImage(this.htmlImage, 0, 0);

    return {
      canvas: this.testCanvas,
      ctx: this.testCtx
    };
  };

  ;

  Gamelab.OffscreenCanvasRendering = OffscreenCanvasRendering;
})();
;if (typeof JSON.decycle !== 'function') {
  JSON.decycle = function decycle(object) {
    "use strict";

    var objects = [],
        // Keep a reference to each unique object or array
    paths = []; // Keep the path to each unique object or array

    return function derez(value, path) {

      var i, // The loop counter
      name, // Property name
      nu; // The new object or array

      switch (typeof value === "undefined" ? "undefined" : _typeof(value)) {
        case 'object':

          if (!value) {
            return null;
          }

          for (i = 0; i < objects.length; i += 1) {
            if (objects[i] === value) {
              return { $ref: paths[i] };
            }
          }

          // Otherwise, accumulate the unique value and its path.

          objects.push(value);
          paths.push(path);

          // If it is an array, replicate the array.

          if (Object.prototype.toString.apply(value) === '[object Array]') {
            nu = [];
            for (i = 0; i < value.length; i += 1) {
              nu[i] = derez(value[i], path + '[' + i + ']');
            }
          } else {

            // If it is an object, replicate the object.

            nu = {};
            for (name in value) {
              if (Object.prototype.hasOwnProperty.call(value, name)) {
                nu[name] = derez(value[name], path + '[' + JSON.stringify(name) + ']');
              }
            }
          }
          return nu;
        case 'number':
        case 'string':
        case 'boolean':
          return value;
      }
    }(object, '$');
  };
}

if (typeof JSON.retrocycle !== 'function') {
  JSON.retrocycle = function retrocycle($) {
    "use strict";

    var px = /^\$(?:\[(?:\d?|\"(?:[^\\\"\u0000-\u001f]|\\([\\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*\")\])*$/;

    (function rez(value) {

      var i, item, name, path;

      if (value && (typeof value === "undefined" ? "undefined" : _typeof(value)) === 'object') {
        if (Object.prototype.toString.apply(value) === '[object Array]') {
          for (i = 0; i < value.length; i += 1) {
            item = value[i];
            if (item && (typeof item === "undefined" ? "undefined" : _typeof(item)) === 'object') {
              path = item.$ref;
              if (typeof path === 'string' && px.test(path)) {
                value[i] = eval(path);
              } else {
                rez(item);
              }
            }
          }
        } else {
          for (name in value) {
            if (_typeof(value[name]) === 'object') {
              item = value[name];
              if (item) {
                path = item.$ref;
                if (typeof path === 'string' && px.test(path)) {
                  value[name] = eval(path);
                } else {
                  rez(item);
                }
              }
            }
          }
        }
      }
    })($);
    return $;
  };
}

var json_stringify = JSON.stringify;

JSON.stringify = function (object, arg2, arg3) {
  var clean_object = JSON.decycle(object);
  return json_stringify(clean_object, arg2, arg3);
};

var json_parse = JSON.parse;

JSON.parse = function (object, arg2, arg3) {
  var retro_object = JSON.retrocycle(object);
  return json_parse(retro_object);
};
; /**
  * @author mrdoob / http://mrdoob.com/
  */

/***************
 *
 * @ignore
 *
 * *****************/

var Stats = function Stats() {

  var mode = 0;

  var container = document.createElement('div');
  container.style.cssText = 'position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000';
  container.addEventListener('click', function (event) {

    event.preventDefault();
    showPanel(++mode % container.children.length);
  }, false);

  //

  function addPanel(panel) {

    container.appendChild(panel.dom);
    return panel;
  }

  function showPanel(id) {

    for (var i = 0; i < container.children.length; i++) {

      container.children[i].style.display = i === id ? 'block' : 'none';
    }

    mode = id;
  }

  //

  var beginTime = (performance || Date).now(),
      prevTime = beginTime,
      frames = 0;

  var fpsPanel = addPanel(new Stats.Panel('FPS', '#0ff', '#002'));
  var msPanel = addPanel(new Stats.Panel('MS', '#0f0', '#020'));

  if (self.performance && self.performance.memory) {

    var memPanel = addPanel(new Stats.Panel('MB', '#f08', '#201'));
  }

  showPanel(0);

  return {

    REVISION: 16,

    dom: container,

    addPanel: addPanel,
    showPanel: showPanel,

    begin: function begin() {

      beginTime = (performance || Date).now();
    },

    end: function end() {

      frames++;

      var time = (performance || Date).now();

      msPanel.update(time - beginTime, 200);

      if (time >= prevTime + 1000) {

        fpsPanel.update(frames * 1000 / (time - prevTime), 100);

        prevTime = time;
        frames = 0;

        if (memPanel) {

          var memory = performance.memory;
          memPanel.update(memory.usedJSHeapSize / 1048576, memory.jsHeapSizeLimit / 1048576);
        }
      }

      return time;
    },

    update: function update() {

      beginTime = this.end();
    },

    // Backwards Compatibility

    domElement: container,
    setMode: showPanel

  };
};

Stats.Panel = function (name, fg, bg) {

  var min = Infinity,
      max = 0,
      round = Math.round;
  var PR = round(window.devicePixelRatio || 1);

  var WIDTH = 80 * PR,
      HEIGHT = 48 * PR,
      TEXT_X = 3 * PR,
      TEXT_Y = 2 * PR,
      GRAPH_X = 3 * PR,
      GRAPH_Y = 15 * PR,
      GRAPH_WIDTH = 74 * PR,
      GRAPH_HEIGHT = 30 * PR;

  var canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  canvas.style.cssText = 'width:80px;height:48px';

  var context = canvas.getContext('2d');
  context.font = 'bold ' + 9 * PR + 'px Helvetica,Arial,sans-serif';
  context.textBaseline = 'top';

  context.fillStyle = bg;
  context.fillRect(0, 0, WIDTH, HEIGHT);

  context.fillStyle = fg;
  context.fillText(name, TEXT_X, TEXT_Y);
  context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

  context.fillStyle = bg;
  context.globalAlpha = 0.9;
  context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

  return {

    dom: canvas,

    update: function update(value, maxValue) {

      min = Math.min(min, value);
      max = Math.max(max, value);

      context.fillStyle = bg;
      context.globalAlpha = 1;
      context.fillRect(0, 0, WIDTH, GRAPH_Y);
      context.fillStyle = fg;
      context.fillText(round(value) + ' ' + name + ' (' + round(min) + '-' + round(max) + ')', TEXT_X, TEXT_Y);

      context.drawImage(canvas, GRAPH_X + PR, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT, GRAPH_X, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT);

      context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT);

      context.fillStyle = bg;
      context.globalAlpha = 0.9;
      context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, round((1 - value / maxValue) * GRAPH_HEIGHT));
    }

  };
};
; /**
  * Tween.js - Licensed under the MIT license
  * https://github.com/tweenjs/tween.js
  * ----------------------------------------------
  *
  * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
  * Thank you all, you're awesome!
  */

/*
*
* @ignore
*
* */

var TWEEN = TWEEN || function () {

  var _tweens = [];

  return {

    getAll: function getAll() {

      return _tweens;
    },

    removeAll: function removeAll() {

      _tweens = [];
    },

    add: function add(tween) {

      _tweens.push(tween);
    },

    remove: function remove(tween) {

      var i = _tweens.indexOf(tween);

      if (i !== -1) {
        _tweens.splice(i, 1);
      }
    },

    update: function update(time, preserve) {

      if (_tweens.length === 0) {
        return false;
      }

      var i = 0;

      time = time !== undefined ? time : TWEEN.now();

      while (i < _tweens.length) {

        if (_tweens[i].update(time) || preserve) {
          i++;
        } else {
          _tweens.splice(i, 1);
        }
      }

      return true;
    }
  };
}();

//removed polyfill

TWEEN.now = Date.now;

TWEEN.Tween = function (object) {

  var _object = object;
  var _valuesStart = {};
  var _valuesEnd = {};
  var _valuesStartRepeat = {};
  var _duration = 1000;
  var _repeat = 0;
  var _repeatDelayTime;
  var _yoyo = false;
  var _isPlaying = false;
  var _reversed = false;
  var _delayTime = 0;
  var _startTime = null;
  var _easingFunction = TWEEN.Easing.Linear.None;
  var _interpolationFunction = TWEEN.Interpolation.Linear;
  var _chainedTweens = [];
  var _onStartCallback = null;
  var _onStartCallbackFired = false;
  var _onUpdateCallback = null;
  var _onCompleteCallback = null;
  var _onStopCallback = null;

  // Set all starting values present on the target object
  for (var field in object) {
    _valuesStart[field] = parseFloat(object[field], 10);
  }

  this.to = function (properties, duration) {

    if (duration !== undefined) {
      _duration = duration;
    }

    _valuesEnd = properties;

    return this;
  };

  this.start = function (time) {

    TWEEN.add(this);

    _isPlaying = true;

    _onStartCallbackFired = false;

    _startTime = time !== undefined ? time : TWEEN.now();
    _startTime += _delayTime;

    for (var property in _valuesEnd) {

      // Check if an Array was provided as property value
      if (_valuesEnd[property] instanceof Array) {

        if (_valuesEnd[property].length === 0) {
          continue;
        }

        // Create a local copy of the Array with the start value at the front
        _valuesEnd[property] = [_object[property]].concat(_valuesEnd[property]);
      }

      // If `to()` specifies a property that doesn't exist in the source object,
      // we should not set that property in the object
      if (_object[property] === undefined) {
        continue;
      }

      _valuesStart[property] = _object[property];

      if (_valuesStart[property] instanceof Array === false) {
        _valuesStart[property] *= 1.0; // Ensures we're using numbers, not strings
      }

      _valuesStartRepeat[property] = _valuesStart[property] || 0;
    }

    return this;
  };

  this.stop = function () {

    if (!_isPlaying) {
      return this;
    }

    TWEEN.remove(this);
    _isPlaying = false;

    if (_onStopCallback !== null) {
      _onStopCallback.call(_object, _object);
    }

    this.stopChainedTweens();
    return this;
  };

  this.end = function () {

    this.update(_startTime + _duration);
    return this;
  };

  this.stopChainedTweens = function () {

    for (var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
      _chainedTweens[i].stop();
    }
  };

  this.delay = function (amount) {

    _delayTime = amount;
    return this;
  };

  this.repeat = function (times) {

    _repeat = times;
    return this;
  };

  this.repeatDelay = function (amount) {

    _repeatDelayTime = amount;
    return this;
  };

  this.yoyo = function (yoyo) {

    _yoyo = yoyo;
    return this;
  };

  this.easing = function (easing) {

    _easingFunction = easing;
    return this;
  };

  this.interpolation = function (interpolation) {

    _interpolationFunction = interpolation;
    return this;
  };

  this.chain = function () {

    _chainedTweens = arguments;
    return this;
  };

  this.onStart = function (callback) {

    _onStartCallback = callback;
    return this;
  };

  this.onUpdate = function (callback) {

    _onUpdateCallback = callback;
    return this;
  };

  this.onComplete = function (callback) {

    _onCompleteCallback = callback;
    return this;
  };

  this.onStop = function (callback) {

    _onStopCallback = callback;
    return this;
  };

  this.update = function (time) {

    var property;
    var elapsed;
    var value;

    if (time < _startTime) {
      return true;
    }

    if (_onStartCallbackFired === false) {

      if (_onStartCallback !== null) {
        _onStartCallback.call(_object, _object);
      }

      _onStartCallbackFired = true;
    }

    elapsed = (time - _startTime) / _duration;
    elapsed = elapsed > 1 ? 1 : elapsed;

    value = _easingFunction(elapsed);

    for (property in _valuesEnd) {

      // Don't update properties that do not exist in the source object
      if (_valuesStart[property] === undefined) {
        continue;
      }

      var start = _valuesStart[property] || 0;
      var end = _valuesEnd[property];

      if (end instanceof Array) {

        _object[property] = _interpolationFunction(end, value);
      } else {

        // Parses relative end values with start as base (e.g.: +10, -3)
        if (typeof end === 'string') {

          if (end.charAt(0) === '+' || end.charAt(0) === '-') {
            end = start + parseFloat(end, 10);
          } else {
            end = parseFloat(end, 10);
          }
        }

        // Protect against non numeric properties.
        if (typeof end === 'number') {
          _object[property] = start + (end - start) * value;
        }
      }
    }

    if (_onUpdateCallback !== null) {
      _onUpdateCallback.call(_object, value);
    }

    if (elapsed === 1) {

      if (_repeat > 0) {

        if (isFinite(_repeat)) {
          _repeat--;
        }

        // Reassign starting values, restart by making startTime = now
        for (property in _valuesStartRepeat) {

          if (typeof _valuesEnd[property] === 'string') {
            _valuesStartRepeat[property] = _valuesStartRepeat[property] + parseFloat(_valuesEnd[property], 10);
          }

          if (_yoyo) {
            var tmp = _valuesStartRepeat[property];

            _valuesStartRepeat[property] = _valuesEnd[property];
            _valuesEnd[property] = tmp;
          }

          _valuesStart[property] = _valuesStartRepeat[property];
        }

        if (_yoyo) {
          _reversed = !_reversed;
        }

        if (_repeatDelayTime !== undefined) {
          _startTime = time + _repeatDelayTime;
        } else {
          _startTime = time + _delayTime;
        }

        return true;
      } else {

        if (_onCompleteCallback !== null) {

          _onCompleteCallback.call(_object, _object);
        }

        for (var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
          // Make the chained tweens start exactly at the time they should,
          // even if the `update()` method was called way past the duration of the tween
          _chainedTweens[i].start(_startTime + _duration);
        }

        return false;
      }
    }

    return true;
  };
};

TWEEN.Easing = {

  Linear: {

    None: function None(k) {

      return k;
    }

  },

  Quadratic: {

    In: function In(k) {

      return k * k;
    },

    Out: function Out(k) {

      return k * (2 - k);
    },

    InOut: function InOut(k) {

      if ((k *= 2) < 1) {
        return 0.5 * k * k;
      }

      return -0.5 * (--k * (k - 2) - 1);
    }

  },

  Cubic: {

    In: function In(k) {

      return k * k * k;
    },

    Out: function Out(k) {

      return --k * k * k + 1;
    },

    InOut: function InOut(k) {

      if ((k *= 2) < 1) {
        return 0.5 * k * k * k;
      }

      return 0.5 * ((k -= 2) * k * k + 2);
    }

  },

  Quartic: {

    In: function In(k) {

      return k * k * k * k;
    },

    Out: function Out(k) {

      return 1 - --k * k * k * k;
    },

    InOut: function InOut(k) {

      if ((k *= 2) < 1) {
        return 0.5 * k * k * k * k;
      }

      return -0.5 * ((k -= 2) * k * k * k - 2);
    }

  },

  Quintic: {

    In: function In(k) {

      return k * k * k * k * k;
    },

    Out: function Out(k) {

      return --k * k * k * k * k + 1;
    },

    InOut: function InOut(k) {

      if ((k *= 2) < 1) {
        return 0.5 * k * k * k * k * k;
      }

      return 0.5 * ((k -= 2) * k * k * k * k + 2);
    }

  },

  Sinusoidal: {

    In: function In(k) {

      return 1 - Math.cos(k * Math.PI / 2);
    },

    Out: function Out(k) {

      return Math.sin(k * Math.PI / 2);
    },

    InOut: function InOut(k) {

      return 0.5 * (1 - Math.cos(Math.PI * k));
    }

  },

  Exponential: {

    In: function In(k) {

      return k === 0 ? 0 : Math.pow(1024, k - 1);
    },

    Out: function Out(k) {

      return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
    },

    InOut: function InOut(k) {

      if (k === 0) {
        return 0;
      }

      if (k === 1) {
        return 1;
      }

      if ((k *= 2) < 1) {
        return 0.5 * Math.pow(1024, k - 1);
      }

      return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
    }

  },

  Circular: {

    In: function In(k) {

      return 1 - Math.sqrt(1 - k * k);
    },

    Out: function Out(k) {

      return Math.sqrt(1 - --k * k);
    },

    InOut: function InOut(k) {

      if ((k *= 2) < 1) {
        return -0.5 * (Math.sqrt(1 - k * k) - 1);
      }

      return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
    }

  },

  Elastic: {

    In: function In(k) {

      if (k === 0) {
        return 0;
      }

      if (k === 1) {
        return 1;
      }

      return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
    },

    Out: function Out(k) {

      if (k === 0) {
        return 0;
      }

      if (k === 1) {
        return 1;
      }

      return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;
    },

    InOut: function InOut(k) {

      if (k === 0) {
        return 0;
      }

      if (k === 1) {
        return 1;
      }

      k *= 2;

      if (k < 1) {
        return -0.5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
      }

      return 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1;
    }

  },

  Back: {

    In: function In(k) {

      var s = 1.70158;

      return k * k * ((s + 1) * k - s);
    },

    Out: function Out(k) {

      var s = 1.70158;

      return --k * k * ((s + 1) * k + s) + 1;
    },

    InOut: function InOut(k) {

      var s = 1.70158 * 1.525;

      if ((k *= 2) < 1) {
        return 0.5 * (k * k * ((s + 1) * k - s));
      }

      return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
    }

  },

  Bounce: {

    In: function In(k) {

      return 1 - TWEEN.Easing.Bounce.Out(1 - k);
    },

    Out: function Out(k) {

      if (k < 1 / 2.75) {
        return 7.5625 * k * k;
      } else if (k < 2 / 2.75) {
        return 7.5625 * (k -= 1.5 / 2.75) * k + 0.75;
      } else if (k < 2.5 / 2.75) {
        return 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375;
      } else {
        return 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375;
      }
    },

    InOut: function InOut(k) {

      if (k < 0.5) {
        return TWEEN.Easing.Bounce.In(k * 2) * 0.5;
      }

      return TWEEN.Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
    }

  }

};

TWEEN.Interpolation = {

  Linear: function Linear(v, k) {

    var m = v.length - 1;
    var f = m * k;
    var i = Math.floor(f);
    var fn = TWEEN.Interpolation.Utils.Linear;

    if (k < 0) {
      return fn(v[0], v[1], f);
    }

    if (k > 1) {
      return fn(v[m], v[m - 1], m - f);
    }

    return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);
  },

  Bezier: function Bezier(v, k) {

    var b = 0;
    var n = v.length - 1;
    var pw = Math.pow;
    var bn = TWEEN.Interpolation.Utils.Bernstein;

    for (var i = 0; i <= n; i++) {
      b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
    }

    return b;
  },

  CatmullRom: function CatmullRom(v, k) {

    var m = v.length - 1;
    var f = m * k;
    var i = Math.floor(f);
    var fn = TWEEN.Interpolation.Utils.CatmullRom;

    if (v[0] === v[m]) {

      if (k < 0) {
        i = Math.floor(f = m * (1 + k));
      }

      return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);
    } else {

      if (k < 0) {
        return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]);
      }

      if (k > 1) {
        return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
      }

      return fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);
    }
  },

  Utils: {

    Linear: function Linear(p0, p1, t) {

      return (p1 - p0) * t + p0;
    },

    Bernstein: function Bernstein(n, i) {

      var fc = TWEEN.Interpolation.Utils.Factorial;

      return fc(n) / fc(i) / fc(n - i);
    },

    Factorial: function () {

      var a = [1];

      return function (n) {

        var s = 1;

        if (a[n]) {
          return a[n];
        }

        for (var i = n; i > 1; i--) {
          s *= i;
        }

        a[n] = s;
        return s;
      };
    }(),

    CatmullRom: function CatmullRom(p0, p1, p2, p3, t) {

      var v0 = (p2 - p0) * 0.5;
      var v1 = (p3 - p1) * 0.5;
      var t2 = t * t;
      var t3 = t * t2;

      return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
    }

  }

};

//Attach to the global Gamelab object

/***************
 *
 * @memberOf Gamelab
 *
 * *****************/

Gamelab.TWEEN = TWEEN;

/*

// UMD (Universal Module Definition)
(function (root) {

    if (typeof define === 'function' && define.amd) {

        // AMD
        define([], function () {
            return TWEEN;
        });

    } else if (typeof module !== 'undefined' && typeof exports === 'object') {

        // Node.js
        module.exports = TWEEN;

    } else if (root !== undefined) {

        // Global variable
        root.TWEEN = TWEEN;

    }

})(this);

*/
;
//Call Gamelab.FeatureInject::

Gamelab.FeatureInject();

// UMD (Universal Module Definition)
(function (root) {

  if (typeof define === 'function' && define.amd) {

    // AMD
    define([], function () {
      return Gamelab;
    });
  } else if (typeof module !== 'undefined' && (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') {

    // Node.js
    module.exports = Gamelab;
  } else if (root !== undefined) {

    // Global variable
    root.Gamelab = Gamelab;
  }
})(undefined);
//# sourceMappingURL=spritebox.js.map
