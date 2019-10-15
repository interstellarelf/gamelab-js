let TypeCode = {

  DEV:false,

  //Display message in console
  info: function(arg1, arg2) {

    if(!this.DEV)
    return;

    console.info(arg1, arg2);

  },

  log:function(arg1, arg2){

    if(!this.DEV)
    return;

      console.log(arg1, arg2);

  },

  /* ERRORS always show */
  error:function(arg1, arg2){

    if(!this.DEV)
    return;

      console.error(arg1, arg2);

  },


  warn:function(arg1, arg2){

    if(!this.DEV)
    return;

      console.error(arg1, arg2);

  },

  //obj is number or becomes fallback
  number: function(number, fallback = 0) {

    number = typeof(number) == 'number' ? number : fallback;

  },

  //obj is string or becomes fallback
  string: function(string, fallback) {

    string = typeof(string) == 'string' ? string : fallback;

  },

  //obj is Array or becomes wrapped in [] as [obj]
  arrayWrap: function(obj) {
    if (obj instanceof Array)
      return obj;
    else
      return [obj];
  },

  //obj or array-of-objects are ALL truthy (return=true) or not (return=false)
  allDefined: function(obj_all) {

    var list = this.arrayWrap(obj_all);

    var failed = false;

    for (var x in list) {
      if (!list[x]) {
        failed = true;
        console.error('Failed to define @ TypeCode.Define()');
      }
    };

    return !failed;
  },

  //getPreferredPropertyByKey(): uses the property[key] if present, if not returns same property passed in
  getPreferredPropertyByKey:function(property, key, warning){

    if(property.hasOwnProperty(key))
    {
      this.warn(warning);
      return property[key];
    }

    else {
      return property;
    }
  },

  //obj's are all of type or return false
  psuedoTypeCheck: function(obj, psuedotype = [], throwing = false) //obj is type or is encapsulated into type
  {
    var list = this.arrayWrap(obj);

    for (var x in list) {
      if (typeof(list[x]) !== psuedotype && !(list[x] instanceof psuedotype)) {
        if (!throwing)
          return console.error(error);
        else
          throw new console.error(error);
      }
    }

    return true;
  },

  getAllFuncs: function(obj) {

    return Object.getOwnPropertyNames(obj).filter(function (p) {
        return typeof obj[p] === 'function';
    });

  },

  getProtoFuncs: function(obj) {

    return Object.getOwnPropertyNames(obj.__proto__).filter(function (p) {
        return typeof obj[p] === 'function';
    });

  },

  truthOrDie:function(list, exitMessage) //All members of Array are truthy or the program exits with Error()
  {
    function findError(obj, error) {
      return obj || new Error(error)
    };

    for (var x in list) {

        let e = findError(list[x], exitMessage);

        if (e instanceof Error) {
            console.Error(e);
        }
      };
  },

  truthyPropsPerArray: function(obj, propKeys, kill) {

    var list = this.arrayWrap(obj),
      keys = this.arrayWrap(propKeys);

    let error = "The required truthy property has non-truthy value.";

    function findError(obj, prop) {
      return obj[prop] || new Error(error)
    };

    var failed = false;

    for (var x in list) {
      for (var y in keys) {
        let e = findError(list[x], keys[y]);
        if (e instanceof Error) {
          failed = true;
          if (kill)
            throw e;
          else
            console.error(e);
        }
      }
    }

    return !failed;
  },

  typeArgsExtract: function(obj, type) //obj is type or is each-converted into type
  {
    if (obj instanceof type) {
      return obj;
    } else {
      obj = [obj];
    }
    return obj;
  },

  typeOrHalt: function(obj, type) //obj is type or error is thrown
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

  typeOrError: function(obj, type) //obj is type or error is logged, execution continues
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

  check:function(object, propKey, propValue)
  {
    if(!object[propKey])
    {
       object[propKey] = propValue;
    }
  }
};
;/**@author
 Jordan Blake
 * */

/**@copyright
 Copyright 2018
 **/

/**
 * Main module-object; references all Gamelab classes.
 * */


console.dev = function(tag, object) {

  var psuedoType = "--unknown";

  switch (typeof object) {
    case "string":
    case "number":
    case "boolean":
    case "null":
      psuedoType = typeof object;
    default:
      {
        if (typeof object == 'object')
          psuedoType = object.constructor.name;
      }
  }

  if (Gamelab.DEV)
    console.info('gamelab::', tag, {
      data_type: psuedoType,
      object: object
    });


};


let delay = function(f, duration) {
  setTimeout(f, duration);
}


let repeat = function(f, duration) {
  setInterval(f, duration);
}

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

    stopDraw:false,

    defSize() {
      if (this.WIDTH == 0) {
        this.WIDTH = document.body.clientWidth;
      }

      if (this.HEIGHT == 0) {
        this.HEIGHT = document.body.clientHeight;
      }

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

    Collision: {

      boxesCollide(pos1, size1, pos2, size2) {

        return pos1.x >= pos2.x - size1.x &&
          pos1.x <= pos2.x + size2.x &&
          pos1.y >= pos2.y - size1.y &&
          pos1.y <= pos2.y + size2.y;
      },

      spriteBoxesCollide(obj1, obj2, gw) {
        gw = gw || Gamelab.game_windows[0];

        var camPos = new Gamelab.Vector(0, 0, 0);

        obj1.padding = obj1.padding || new Gamelab.Vector(0, 0, 0);

        var paddingX = Math.round(obj1.padding.x * obj1.size.x),

          paddingY = Math.round(obj1.padding.y * obj1.size.y),
          left = obj1.position.x + paddingX + camPos.x,

          right = obj1.position.x + obj1.size.x - paddingX + camPos.x,

          top = obj1.position.y + camPos.y + paddingY,
          bottom = obj1.position.y + obj1.size.y - paddingY + camPos.y;

        if (right > obj2.position.x && left < obj2.position.x + obj2.size.x &&
          bottom > obj2.position.y && top < obj2.position.y + obj2.size.y) {

          return true;

        }

      },

      spriteBoxesCollideTop(obj1, obj2, gw) {
        gw = gw || Gamelab.game_windows[0];

        var camPos = new Gamelab.Vector(0, 0, 0);

        obj1.padding = obj1.padding || new Gamelab.Vector(0, 0, 0);

        var paddingX = Math.round(obj1.padding.x * obj1.size.x),

          paddingY = Math.round(obj1.padding.y * obj1.size.y),
          left = obj1.position.x + paddingX + camPos.x,

          right = obj1.position.x + obj1.size.x - paddingX + camPos.x,

          top = obj1.position.y + camPos.y + paddingY,
          bottom = obj1.position.y + obj1.size.y - paddingY + camPos.y;

        if (right > obj2.position.x && left < obj2.position.x + obj2.size.x &&
          bottom > obj2.position.y && top < obj2.position.y + obj2.size.y
        ) {

          return true;

        }

      },

      /*
       *
       *  ##Not known to be working -->> Below function
       *
       * */

      pixelsCollide(sourceSprite, targetSprite, gw) {
        gw = gw || Gamelab.game_windows[0];

        var camPos = new Gamelab.Vector(0, 0, 0);

        /* Box model detection, return true on collision */
        function hitBox(source, target) {
          /* Source and target objects contain x, y and width, height */
          return !(
            ((source.y + source.height) < (target.y)) ||
            (source.y > (target.y + target.height)) ||
            ((source.x + source.width) < target.x) ||
            (source.x > (target.x + target.width))
          );
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
            var allText = rawFile.responseText;
            callback(JSON.stringify(allText));
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
;
/**************************
  EventInterfaceMap: StringKeys:

    * (must implement without option)
    @ (may implement optional)
*****************************/


let EventInterfaceMap = {  //className / must have named functions whyen carrying Symbol of className

  Sprite: ['@onUpdate', '@onDestroy'],

  Animation: ['@onRun', '@onComplete', '*onCollide'],

  Motion: ['@onCommit', '@onComplete', '*onCollide'],

  Shot: ['@onShoot', '*onCollide', '*onCollide'],

  Terrain: ['@onCollide'],

  Interactive: ['@onCollide'],

  Global: ['@onUpdate'],

  check: function(instance) {
    for (var x in this) {
      if (x == 'check')
        continue;
      else {
        if (this[x] instanceof Array) {
          this[x].forEach(function(f) {
            var fkey = f.replace('@', '');
            if (!instance.getOwnPropertyNames.indexOf(fkey) >= 0)
              throw new Error('Object must implement function by name of:' + fkey);

          });
        }
      }
    };
  }
}

/**************************
  ObjectFeatureInterfaceMap:
      Indicates classNames, and what they must carry as functions
*****************************/

let ObjectFeatureMap = { //className / must have named function properties when carrying Symbol of className

  Sprite: ['@spatial', '@data'],

  SpriteBrush: ['@spatial', '@data'],

  Elipse:['@spatial'],

  Frame:['@spatial'],

  Particle:['@spatial'],

  Animation: ['@anchored', '@framedriven', '@effectdriven', '@data'],

  Line2d:['@spatial', '@pointarrayflippable', '@selftransposable',  '@data'],

  Text:['@spatial', '@text', '@colored'],

};

Gamelab.ObjectFeatureMap = ObjectFeatureMap;


let InputIFM = {

  GamepadButtons: ['@onButton'],

  GamepadSticks: ['@onStick'],

  Keyboard: ['@onKey'],

  MouseMove: ['@onMouseMove'],

  MouseButton: ['@onMouseButton'],

  MouseWheel: ['@onMouseWheel'],

  LeapMotion: ['@onLeapMotion']

};


let UIEditables = {

  Sprite: ['size', 'position', 'rotation'],

  Animation: ['frameBounds', 'etc']

};


let UIOption = function(name, hint, script) {
  return {
    name,
    hint,
    script
  }
};

let UIPrefab = {

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



let UIPrefabMainSelect = {

  Background: ['Bound']

};


let getCustomPrefabMeta = function() { //get name and file/data resources for each custom prefab

};

/**********************************

  UIObjectSelectMap:

    -Just the system default options

*********************************/

let UIObjectPrefabs = {

  Sprite: ['Side-Scroll-Player', 'Collider', 'Spaceship', 'Robot'],

};
;class Bone {

  constructor(target={}, size) {

    this.size = size || target.size;

    if (typeof target == 'Object' && target.id)
      this.target_id = target.id;

    this.targetAnimation = target;

    this.parentAnimation = {};

    this.origin = target.origin || new Gamelab.Vector(0, 0, 0);

    this.rotation = target.rotation || new Gamelab.Vector(0, 0, 0);

    this.parentOffset = new Gamelab.Vector(0, 0, 0);

    this.size = size;

    //every frame of the target object gets same size::

    if(target.Size)
    {
        target.Size(size.x, size.y, size.z);
    }

  }

  Target(t){

    this.targetAnimation = t;
    return this;
  }


  Parent(p){

      this.parentAnimation = p;
      return this;
    }

  ParentOffset(x, y)
  {
    this.parentOffset = new Gamelab.Vector(x, y);
    return this;
  }

  Origin(x, y, z){

    this.origin = new Gamelab.Vector(x, y, z);
    this.targetAnimation.Origin(x, y, z);
    return this;
  }

  Size(x, y, z){

    this.size = new Gamelab.Vector(x, y, z);
    this.targetAnimation.Size(x, y, z);

  }

  Rotation(x, y, z)
  {
    this.rotation = new Gamelab.Vector(x, y, z);
    this.targetAnimation.Rotation(this.rotation);
    return this;
  }

  update(){

          console.log('Bone.js :: onPosition, --setting');

          var rotatedOffset = Gamelab.VectorMath.rotatePointsXY(this.parentOffset.x, this.parentOffset.y, this.parentAnimation.rotation.x),

          fullPosition = this.parentAnimation.position.add(rotatedOffset);

          this.targetAnimation.Position(fullPosition);

  }

}


class BoneState {

  constructor(boneList) {

    var states = [];

    boneList.forEach(function(bone) {

      states.push({
        bone:bone,
        offset: new Gamelab.Vector(),
        rotation: new Gamelab.Vector(),
        size: new Gamelab.Vector(),
      });

    });

  }

}
Gamelab.BoneState = BoneState;
Gamelab.Bone = Bone;
;(function() {

  /**
   * Creates a new Camera
   * @param {number} x=0 position-x
   * @param {number} y=0 position-y
   * @param {number} z=0 position-z
   * @returns {Camera}
   */

  class Camera {
    constructor(x, y, z) {
      if (isNaN(x)) {
        x = 0;
      }

      if (isNaN(y)) {
        y = 0;
      }

      if (isNaN(z)) {
        z = 0;
      }

         /**
          * @property {Vector} position the vector-position of Camera
          * @memberof Camera
          **********/

      this.position = new Gamelab.Vector(x, y, z);
    }

  }

  Gamelab.Camera = Camera;

})();
;
//RGBColor:: Color object
class RGBColor {
  constructor(r = 0, g = 0, b = 0, a = 0) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  //Create color from string (rgba-string or hex-string to RGBAColor{})
  fromString(str) {
    if(str.indexOf('#') >= 0) //color-string is hex-color-string
    {
      str = Gamelab.ColorCalc.hexToRgba(str);
    }

    str = str.replace(/^\s*#|\s*$/g, '');
    str = str.toLowerCase();
    if (ColorStrings[str]) str = ColorStrings[str];

    var match;
    // RGB(A)
    if ((match = str.match(/\d+/g))) {

      return new Gamelab.RGBColor(
        parseInt(match[0], 10),
        parseInt(match[1], 10),
        parseInt(match[2], 10),
        1.0
      );
    }
  }

  //Create color from pixel-data
  fromData(data) {
    return new Gamelab.RGBColor(
      parseInt(data[0], 10),
      parseInt(data[1], 10),
      parseInt(data[2], 10),
      1.0
    );

  }

  //Distance between two colors (a 3d distance fxn)
  distance(color) {
    var sumOfSquares = 0;
    sumOfSquares += Math.pow(this.r - color.r, 2);
    sumOfSquares += Math.pow(this.g - color.g, 2);
    sumOfSquares += Math.pow(this.b - color.b, 2);
    return Math.sqrt(sumOfSquares);
  }

  //Fuzzy Match with tolerance for distance
  match_by_tolerance(color, tolerance) {

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

};


Gamelab.RGBColor = RGBColor;

//Color calculations::
Gamelab.ColorCalculator = {

  hexToRgbArray(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null;
  },

  rgbFromString: function(rgba_string) {
    return new Gamelab.RGBColor(rgba_string);
  },

  hexToRgba: function(hex) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');
      if (c.length == 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');
      return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',1)';
    }
    throw new Error('Bad Hex');
  },

  scaledRGBAFromHex:function(hexcolor_a, hexcolor_b, scalePoint){

    //get the point between color_a and color_b using value of 0-1 ::
    //scalePoint of 0 = color_a as rgba & scalePoint of 1.0 will return color_b as rgba

    var rgba_a = this.hexToRgbArray(hexcolor_a),
    rgba_b = this.hexToRgbArray(hexcolor_b);


    var finalRgba={
      0:rgba_a[0] + ((rgba_a[0] - rgba_b[0]) * scalePoint * -1.0),
      1:rgba_a[1] + ((rgba_a[1] - rgba_b[1]) * scalePoint * -1.0),
      2:rgba_a[2] + ((rgba_a[2] - rgba_b[2]) * scalePoint * -1.0),
      3:1.0
    };

    //first 3 values are rounded / whole number
    [0, 1, 2].forEach(function(x){
      if(finalRgba[x] >= 255)
      {
        finalRgba[x] = 255
      }
      finalRgba[x] = Math.round(finalRgba[x]);
    });

    return "rgba("+ finalRgba[0] +  "," + finalRgba[1] + "," + finalRgba[2] + ", 1.0)" ;
  }

};

//Css Colors by name::
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


  //special map Colors
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
  map_black: 'rgb(0, 0, 0)',
};

var RE_RGB = /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/;

Gamelab.Colors = {};

for (var x in ColorStrings) {
  if (ColorStrings.hasOwnProperty(x)) {
    Gamelab.Colors[x] = new Gamelab.RGBColor().fromString(x);
  }
}
;(function() {
  console.log('Line() class... creating');

  var Curves = { //ALL HAVE INPUT AND OUTPUT OF: 0-1.0
    // no easing, no acceleration
    linearNone: function(t) {
      return t
    },

    // accelerating from zero velocity
    easeInQuadratic: function(t) {
      return t * t
    },
    // decelerating to zero velocity
    easeOutQuadratic: function(t) {
      return t * (2 - t)
    },
    // acceleration until halfway, then deceleration
    easeInOutQuadratic: function(t) {
      return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    },
    // accelerating from zero velocity
    easeInCubic: function(t) {
      return t * t * t
    },
    // decelerating to zero velocity
    easeOutCubic: function(t) {
      return (--t) * t * t + 1
    },
    // acceleration until halfway, then deceleration
    easeInOutCubic: function(t) {
      return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
    },
    // accelerating from zero velocity
    easeInQuartic: function(t) {
      return t * t * t * t
    },
    // decelerating to zero velocity
    easeOutQuartic: function(t) {
      return 1 - (--t) * t * t * t
    },
    // acceleration until halfway, then deceleration
    easeInOutQuartic: function(t) {
      return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t
    },
    // accelerating from zero velocity
    easeInQuintic: function(t) {
      return t * t * t * t * t
    },
    // decelerating to zero velocity
    easeOutQuintic: function(t) {
      return 1 + (--t) * t * t * t * t
    },
    // acceleration until halfway, then deceleration
    easeInOutQuintic: function(t) {
      return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t
    }
  }

  Gamelab.Curves = Curves;

  var inOutCurves = {
    quadratic: function(t) {
      return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    },
    cubic: function(t) {
      return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
    },
    quartic: function(t) {
      return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t
    },
    quintic: function(t) {
      return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t
    },
    linear: function(t) {
      return t;
    } //provided for consistency / in case 'linear' is needed
  };


  Gamelab.Curves.Smooth = inOutCurves;
  Gamelab.Curves.InOut = inOutCurves;


})();
;
  /**
   * Creates a new GameWindow
   * <iframe style='width:400px; height:450px; overflow:hidden;' src='./html/iframe-error.html'> </iframe>
   * @param   {Object} canvas the canvas element for this gameWindow. --GameWindow's if not supplied, the constructor will create a full-screen canvas, if a canvas.
    * @param   {Array} drawables=[] a list of drawable objects to be drawn. --Drawables can also be added after constructor call.
   * @returns {GameWindow} a Gamelab.GameWindow object
   * */

  class GameWindow {
    constructor(canvas = false, drawables = []) {

            /**
             * list of all drawables in the window.
             *
             * @property this.drawables
             * @memberof GameWindow
             **********/

      this.drawables = drawables;

      this.bool_events = Gamelab.bool_events || [];

      this.settings = {};

            /**
             * the html-canvas of the GameWindow.
             *
             * @property this.canvas
             * @memberof GameWindow
             **********/

      this.canvas = canvas || false;

      this.engaged = true;

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

      /**
       * the camera of the GameWindow. --An instance of Gamelab.Camera
       *
       * @property this.camera
       * @memberof GameWindow
       **********/


      this.camera = new Gamelab.Camera();

      this.camera.target = false;

      Gamelab.camera = this.camera;

      var __inst = this;

      this.Size();

      this.update_ext = [];

      window.onresize = function() {

        if (__inst.isAbsoluteSize)
          return;

        __inst.Size();

      };

      this.ctx = this.canvas.getContext('2d');

      Gamelab.game_windows.push(this);


      window.onerror = function(){

        Gamelab.errors += 1;

        console.log('Canvas Error --');

        if (Gamelab.errors > Gamelab.settings.errorLimit) {
          Gamelab.stopDraw = true;

        var call = call ||  window.setTimeout(function(){

          if(call)
          {
            window.clearTimeout(call);
          }
            console.log('%cDraw stopped at errorLimit:' + Gamelab.settings.errorLimit, 'color:darkorange;');

          }, 200);

        }

      }

    }



      /**
       * returns the gameWindow.canvas property, an HTMLCanvasElement
       *
       * @function
       * @memberof GameWindow
       **********/

    getCanvas(){
      return this.canvas;
    }


      /**
       * returns a vector(x, y) showing the center of the GameWindow
       *
       * @function
       * @memberof GameWindow
       **********/


    center() {

      return new Gamelab.Vector(Math.round(this.canvas.width / 2), Math.round(this.canvas.height / 2));

    }


    TrackStat(){

      this.__trackStat = true;
      return this;
    }


    GridUnit(x, y, w, h, srcImage_Path){

      var size = new Gamelab.Vector(w, h),
      position = new Gamelab.Vector(x, y);

      var sprite;

      if(srcImage_Path)
      {
        sprite = new Gamelab.Sprite(srcImage_Path);
        sprite.Size(size);
        sprite.Pos(position);

        Gamelab.game_windows[0].add(sprite);
      }

      return {
        size:size,
        position:position
      };
    }


    onMouseMove(callback){

      var canvas = this.canvas;

      this.canvas.addEventListener('mousemove',  function(evt){

        var x = evt.clientX, y = evt.clientY;

        const rect = canvas.getBoundingClientRect();

        x -= rect.left;
        y -= rect.top;

        callback(x, y);

      });
    }




    onMouseClick(callback){

      var canvas = this.canvas;


      this.canvas.addEventListener('click',  function(evt){

        var x = evt.clientX, y = evt.clientY;

        const rect = canvas.getBoundingClientRect();

        x -= rect.left;
        y -= rect.top;

        callback(x, y);

      });


    }


    /**
     * creates an array of gridUnits
     *
     * @function
     * @memberof GameWindow
     **********/

     GridStyle(total_x, total_y, w, h, srcImage_Path)
     {

       if(!(this.grid instanceof Array))
       {
         this.grid = [];
       }

       function GridUnit(x, y, w, h, srcImage_Path){

         var size = new Gamelab.Vector(w, h),
         position = new Gamelab.Vector(x, y);

         var sprite;

         if(srcImage_Path)
         {
           sprite = new Gamelab.Sprite(srcImage_Path);
           sprite.Size(size);
           sprite.Pos(position);

           Gamelab.game_windows[0].add(sprite);
         }

         return {
           size:size,
           position:position
         };
       };

       for(var y = 0; y < total_y; y++)
       {

         for(var x = 0; x < total_x; x++)
         {

           this.grid.push(new GridUnit(x * w, y * h, w, h, srcImage_Path));

         }

       }
       return this;
     }

  getCanvas(){
    return this.canvas;
  }

    /**
     * adds an update to the GameWindow:: update to be called every 20 milliseconds
     *
     * @function
     * @memberof GameWindow
     **********/


    onUpdate(f) {

      this.update_ext.push(f);

    }

        /**
         * the main update for the GameWindow:: called automatically after call of GameWindow.start() or GameWindow.animate()
         *
         * @function
         * @memberof GameWindow
         **********/

    update() {


      Gamelab.each(this.drawables, function(ix, item) {

        if (item && typeof(item.def_update) == 'function') {

          item.def_update(item);

        }

        if (item && typeof(item.update) == 'function') {
          item.update(item);

        }

                if (item && ['SpriteArray', 'RobotixArray', 'RobotixVerticalChain'].indexOf(item.constructor.name) >= 0  &&
                   typeof item.each  == 'function') {

                  item.each(function(ix, graphic){

                    graphic.update(graphic);

                  });

                }

      });

      Gamelab.each(this.bool_events, function(ix, item) {

        if (item && item.bool()) {
          item.callback();
        }

      });


      for (var x in this.update_ext) {
        this.update_ext[x]();
      }
    }

    reset_draw(){
      this.before_draw_ext = function(){};
    }

    disengage(){
      this.drawables = [];
      this.engaged = false;
      this.reset_draw();
    }

    engage(){
      this.engaged = true;
    }

    draw() {

      var __gameWindow = this;

      if (this.before_draw_ext) {
        this.before_draw_ext();
      }

      Gamelab.each(this.drawables, function(ix, item) {

        if(typeof item.draw == 'function')
        {
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

    onBeforeDraw(f) {

      var boundCall = f.bind(this);

      if(!this.before_draw_ext)
      this.before_draw_ext = function(){};

      var beforeDraw = this.before_draw_ext.bind(this);

      this.before_draw_ext = function() {
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


    onAfterDraw(f) {

      var boundCall = f.bind(this);

      if(!this.after_draw_ext)
      this.after_draw_ext = function(){};


      var afterDraw = this.after_draw_ext.bind(this);

      this.after_draw_ext = function() {
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

    Size(w, h, isAbsoluteSize) { //call with no args to fill to browser-window-size;

      w = w || this.canvas.parentNode.clientWidth;

      h = h || this.canvas.parentNode.clientHeight;

      var c = this.canvas;

      if (c) {
        c.setAttribute('width', w)
      };

      if (c) {
        c.setAttribute('height', h)
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

    add(obj, options={}) {

      var optionsGuide = {
        obj:'The Object{} being added into play',
        options:{
          position:'The Vector(x, y) offset to use when drawing the obj'
        }
      };

      //console.info('GameWindow.add() --2nd argument options is object of arguments >>>', optionsGuide);

      var layer = options.layer || this.drawables.length - 1;

      if(!(typeof layer == 'number' && layer >= 0))
      layer = this.drawables.length;

      var offset = new Gamelab.Vector(0, 0);

      if(options.position)
      offset = options.position;

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

    Background(c) {
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

    remove(obj) {

      var ix = this.drawables.indexOf(obj);

      if (ix >= 0) {
        this.drawables.splice(ix, 1);
      }
    }


    removeDeadObjects() {

      var $window = this;

      this.drawables.forEach(function(sprite){

        if(sprite.life <= 0)
        {
          $window.remove(sprite);
        }

      });

    }

    /**
     * begins the animation-loop of GameWindow.
     *
     * @function
     * @param {number} time optional time parameter for usage with Tween
     * @memberof GameWindow
     **********/


    animate(time) {

      if(!this.engaged)
      return false;

      var __inst = this;

      requestAnimationFrame(function() {

        __inst.animate();

      });


      if (this.__stats) {
        this.__stats.begin();
        this.__statsMS.begin();
        this.__statsMB.update();
      }

      Gamelab.isAtPlay = true;

      if (window.TWEEN)
        TWEEN.update(time);

      __inst.update();

      if(this.settings.hasOwnProperty('autoClear') && this.settings.autoClear == false)
      {

      }
      else{
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }


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


    start() {

      if (typeof(Stats) == 'function') //Stats library exists
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
  }

  Gamelab.GameWindow = GameWindow;
;
  /**
   * Creates a new Module
   * @param   {string} uri the uri that the .js file is located at
    * @param   {Function} callback=function(){} The callback to call after the module is loaded
   * @returns {Module} a Gamelab.Module object
   * */

class Module{

  constructor(uri, callback){

    if(uri)
    this.load(uri, callback);

  }

  load(uri, callback){

    var __object = this;

    callback = callback || function(){};

    callback = callback.bind(this);

    var script = document.createElement('SCRIPT');
    script.src = uri;

    //define onload fxn
    script.onload = function(){

      window.module = window.module || {};

      var construct = window.module.exports;
      callback(construct);

    };

    //append to the document
    document.head.appendChild(script);

  }

};

Gamelab.Module = Module;
;
(function(){

  class OffscreenCanvas {

    constructor(canvas, x, y){
      this.canvas = canvas;
      this.x = x;
      this.y = y;

      this.ctx = this.canvas.getContext('2d');
    }
    draw(ctx)
    {
      ctx.draw(this.canvas, this.x, this.y);
    }

  }

  Gamelab.OffscreenCanvas = OffscreenCanvas;


})();
;

/**
 * Creates an instance of Rectangle.
 * @param   {Gamelab.Vector} min the minimum vector point (x,y)
 * @param   {Gamelab.Vector} max the maximum vector point (x,y)
 *
 * @returns {Rectangle} a Rectangle object
 */

class Rectangle {
    constructor(x1, y1, x2, y2) {
      this.Min(x1, y1);
      this.Max(x2, y2);
    }
    Min(x, y)
    {
      this.min = new Gamelab.Vector(x, y);
      return this;
    }
    Max(x, y)
    {
      this.max = new Gamelab.Vector(x, y);
      return this;
    }
}
;



let VectorBounds = Rectangle;

Gamelab.VectorBounds =VectorBounds;

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

class VectorFrameBounds {
    constructor(min, max, termPoint) {
        this.min = min;
        this.max = max;
        this.termPoint = termPoint || new Gamelab.Vector(this.max.x, this.max.y, this.max.z);
    }
}
;

Gamelab.VectorFrameBounds = VectorFrameBounds;


var GeoMath = {

        rotatePointsXY:function(x,y,angle) {

            var theta = angle*Math.PI/180;

            var point = {};
            point.x = x * Math.cos(theta) - y * Math.sin(theta);
            point.y = x * Math.sin(theta) + y * Math.cos(theta);

            point.z = 0;

            return point
        }

}

Gamelab.GeoMath = GeoMath;
;/**
 * Renderable : consistent base-type for graphic-objects
 * @param   {Object} args the object of arguments
 * @returns {Renderable} a Gamelab.Renderable object.
 * */

class Renderable {
  constructor(args = {}) {
    //  Gamelab.FeatureInject(this, args);
  }
}


/**
 * A game-image object based on HTMLImage element. Creates GameImage, attaches gameImage.domElement --an instance of HTMLImageElement
 * @param   {string} src the sourcePath of the image-file.
 * @returns {GameImage} a Gamelab.GameImage object.
 * */

class GameImage extends Renderable {

  constructor(src = {}, onCreate = function() {
    I('image: used default fxn argument:');
  }) {

    super(src);

    if (typeof src == 'object' && !(src instanceof HTMLCanvasElement)) {
      return src;
    }

    if (typeof src == 'string') {
      this.domElement = document.createElement('IMG');
      this.domElement.src = src;
    } else if (src instanceof HTMLCanvasElement) {
      this.domElement = src;
    }


    this.domElement.onerror = function() {
      this.__error = true;
      console.dev('--image error');
    };

  }
};

Gamelab.GameImage = GameImage;
;


class Script{

  constructor(uri, callback){

    this.src = uri || '';

    if(uri && callback)
    {
    this.load(uri, callback);
    }
    else{
      console.info('Created Script() without uri + callback --1st and 2nd arguments. To use object call script.load()');
    }

  }

  load(uri, callback){

    var __object = this;

    callback = callback || function(){};

    callback.bind(this);

    var script = document.createElement('SCRIPT');
    script.src = uri;

    //define onload fxn
    script.onload = function(){

      var construct = module.exports;
      callback(construct);

    };

    //append to the document
    document.head.appendChild(script);

  }

};

Gamelab.Script = Script;


class Scriptable{

  constructor(object, siblings){

    this.object = object;

    this.siblings = siblings;

  }

  Object(object)
  {
    this.object = object;
    return this;
  }


  load(url, callback){

    var __object = this;

    callback = callback || function(){};

    callback = callback.bind(this);

    var script = document.createElement('SCRIPT');
    script.src = url;

    //define onload fxn
    script.onload = function(){

      var construct = window.module.exports;

      var MOD = construct(__object.object, __object.siblings);

      callback.bind(__object).call(MOD, __object.object, __object.siblings);
    };

    //append to the document
    document.head.appendChild(script);

  }

};

Gamelab.Scriptable = Scriptable;
;

var Trigonometry = {

  rotate_from_xy:function(cx, cy, x, y, angle) {
      var radians = (Math.PI / 180) * angle,
          cos = Math.cos(radians),
          sin = Math.sin(radians),
          nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
          ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
      return new Gamelab.Vector(nx, ny);
  },

  rotational_speed:function(angle, speed){
    // Move towards the player
    var radians = (angle / 360) * Math.PI * 2.0;
    return new Gamelab.Vector(Math.cos(radians) * speed, Math.sin(radians) * speed);
  },

  find_point_on_circle:function(x, y, radius, degrees){

  }
};


Gamelab.Trig = Trigonometry;
Gamelab.Trigonometry = Trigonometry;
;


  var linkedCurves = {

    quadratic: function(t) {
      return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    },

    cubic: function(t) {
      return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
    },

    quartic: function(t) {
      return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t
    },

    quintic: function(t) {
      return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t
    },

    linear: function(t) {
      return t;
    } //provided for consistency / in case 'linear' is needed

  };


let Twix = {

  Curves:{
    //ALL HAVE INPUT AND OUTPUT OF: 0-1.0
      // no easing, no acceleration
      Linear: {
        None: function(t) {
          return t;
        }
      },

      Quadratic: {
        In: function(t) {
          return t * t;
        },
        Out: function(t) {
          return t * (2 - t);
        },
        Seamless: function(t) {
          return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        }
      },

      Cubic: {
        In: function(t) {
          return t * t * t;
        },
        Out: function(t) {
          return (--t) * t * t + 1;
        },
        Seamless: function(t) {
          return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        }
      },

      Quartic: {
        In: function(t) { return t * t * t * t; },
        Out: function(t) { return 1 - (--t) * t * t * t; },
        Seamless: function(t) { return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t; }
      },

      Quintic: {
        In: function(t) { return t * t * t * t * t; },
        Out: function(t) { return 1 + (--t) * t * t * t * t; },
        Seamless: function(t) { return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t; }
      }
  },

  LinkedCurves:linkedCurves

};



const TranceCurves = {};

TranceCurves.Exponential = (value, power, min, max) => {

};

TranceCurves.Power = (value, power, min, max) => {

};


const TrigFunctions = {};

TrigFunctions.Sine = {};

TrigFunctions.Cosine = {};

TrigFunctions.Tangent = {};


const SpecialFunctions = {};

SpecialFunctions.Sawtooth = (t) => { return t <= 1.0 ? t : 0; };

SpecialFunctions.Square = () => {};

SpecialFunctions.Triangle = () => {};

SpecialFunctions.Floor = () => {};

SpecialFunctions.Sign = () => {};

Gamelab.core = Gamelab.core || {};

Gamelab.core.XYFunctions = {};

Gamelab.core.XYFunctions.SpecialFunctions = SpecialFunctions;



const SigmaFunctions = {};

const GammaFunctions = {};
;(function() {
  console.log('Vector class... creating');

  /**
   * Creates a Vector object with x, y, and --optional z.
   * @param   {number} x the x coordinate
   * @param   {number} y the y coordinate
   * @param   {number} z the optional z coordinate
   * @param   {number} r the optional r value
   * @returns {Vector} a Vector object
   */


function single_numeric_x(x, y, z)
{
  return typeof x == 'number' && y == undefined && z == undefined;
}


  class Vector {
    constructor(x, y, z, r) {

      var copied = false;

      if (typeof(x) == 'object' && x.hasOwnProperty('x') && x.hasOwnProperty('y')) //optionally pass vector3
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

      if (!copied) {

        if(single_numeric_x(x, y, z))
        {
          this.x = x;
          this.y = x;
          this.z = x;
        }
        else{
          if (z == null) {
            z = 0;
          }

                  this.x = x;
                  this.y = y;
                  this.z = z;
                  this.r = r;
        }

        this.valid_check();
      }
    }

    valid_check() {
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

    sub(x, y, z) {
      var v = new Gamelab.Vector(x, y, z);
      return new Gamelab.Vector(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    /**
     * Adds another Vector to this vector and returns a vector for the resulting sum.
     *
     * @function
     * @param {Vector} v the vector to be added to this vector
     * @memberof Vector
     **********/

    add(x, y, z) {
      var v = new Gamelab.Vector(x, y, z);
      return new Gamelab.Vector(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    /**
     * Multiplies another Vector by this vector and returns a vector for the resulting product.
     *
     * @function
     * @param {Vector} v the vector that this vector will by muliplied by
     * @memberof Vector
     **********/

    mult(x, y, z) {
      var v = new Gamelab.Vector(x, y, z);
      return new Gamelab.Vector(this.x * v.x, this.y * v.y, this.z * v.z);
    }

    /**
     * Gets vector of absolute values.
     *
     * @function
     * @param {Vector} v the absolute vector
     * @memberof Vector
     **********/

    abs() {
      return new Gamelab.Vector(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z));
    }

    /**
     * Divides another Vector by this vector and returns a vector for the resulting quotient.
     *
     * @function
     * @param {Vector} v the vector for this vector to be divided by
     * @memberof Vector
     **********/

    div(x, y, z) {
      var v = new Gamelab.Vector(x, y, z);
      return new Gamelab.Vector(this.x / v.x, this.y / v.y, this.z / v.z);
    }

    /**
     * Rounds this vector to the nearest set of whole numbers and returns the result.
     *
     * @function
     * @memberof Vector
     * @returns {Vector} a Gamelab.Vector object
     **********/

    round(multiple=1.0) {
      var d = multiple;
      if(isNaN(d) || d < 1)
      {
        d = 1;
      }

      var z = !isNaN(this.z) ? this.z : 0;
      return new Gamelab.Vector(Math.round(this.x * d) / d, Math.round(this.y * d) / d, Math.round(this.z  * d) / d);
    }

    /**
     * Floors this vector to the nearest set of whole numbers and returns the result (subtractive-only, an x of 1.7 becomes 1)
     *
     * @function
     * @memberof Vector
     * @returns {Vector} a Gamelab.Vector object
     **********/

     floor(multiple=1.0) {
       var d = multiple;
       if(isNaN(d) || d < 1)
       {
         d = 1;
       }

       var z = !isNaN(this.z) ? this.z : 0;
       return new Gamelab.Vector(Math.floor(this.x * d) / d, Math.floor(this.y * d) / d, Math.floor(this.z  * d) / d);
     }

    /**
     * Ceils this vector to the nearest set of whole numbers  and returns the result (additive-only, an x of 1.2 becomes 2)
     *
     * @function
     * @memberof Vector
     * @returns {Vector} a Gamelab.Vector object
     **********/

     ceil(multiple=1.0) {
       var d = multiple;
       if(isNaN(d) || d < 1)
       {
         d = 1;
       }

       var z = !isNaN(this.z) ? this.z : 0;
       return new Gamelab.Vector(Math.ceil(this.x * d) / d, Math.ceil(this.y * d) / d, Math.ceil(this.z  * d) / d);
     }

    /**
     * Creates new vector, with the negated x,y,z values (-x-y-z), returns the resulting vector
     *
     * @function
     * @memberof Vector
     * @returns {Vector} a Gamelab.Vector object
     **********/

    neg() {
      return new Gamelab.Vector(-this.x, -this.y, -this.z);
    }

    /**
     * An equals-test for vectors. Returns true OR false.
     *
     * @function
     * @memberof Vector
     * @returns {boolean} a true OR false value
     **********/

    equals(x, y, z) {
      var v = new Gamelab.Vector(x, y, z);
      return this.x == v.x && this.y == v.y && this.z == v.z;
    }

    /**
     * Gets  the specific distance between this and the argument-vector. --applies to x and y of two vectors. Returns a single number.
     *
     * @function
     * @memberof Vector
     * @returns {number} the specific distance between this and the argument-vector
     **********/

    trig_distance_xy(v) {
      var dist = this.sub(v);
      return Math.sqrt(dist.x * dist.x + dist.y * dist.y);
    }


    is_between(v1, v2) {
      //TODO : overlap vectors return boolean

      return this.x >= v1.x && this.x <= v2.x &&
        this.y >= v1.y && this.y <= v2.y &&
        this.z >= v1.z && this.z <= v2.z;
    }

    /**
     * Returns a vector-multiple: the original-size, multiplied by a random between the minFloat and maxFloat arguments.
     *
     * @function
     * @memberof Vector
     * @returns {Vector} the resulting vector.
     **********/

    randomize(minFloat, maxFloat) {
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

    rotationalSpeedPoint(rotation, speed) {
      var r = rotation;
      if (isNaN(speed)) {
        speed = 1;
      }
      if (typeof(rotation) == 'object' && rotation.x) {
        r = rotation.x;
      }

      return new Gamelab.Vector(Math.cos((r) * 3.14 / 180) * speed, Math.sin((r) * 3.14 / 180) * speed);
    }

    /**
     * Returns the right-handed angle of degrees between two two position-vectors.

     * @memberof Vector
     * @function
     * @param {Vector} p1 the 1st vector-argument
     * @param {Vector} p2 the 2nd vector-argument
     * @returns {number} the resulting angle in degrees.
     **********/

    angleBetween(p1, p2) {
      return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
    }

    //apply minimum value to all values
    min2d() {

      function minimize(object, key1, key2) {
        if (object[key1] < object[key2])
          object[key2] = object[key1];

        if (object[key2] < object[key1])
          object[key1] = object[key2];
      };

      minimize(this, 'x', 'y');

      return this;
    }


    //apply maximum value to all values
    max2d() {

      function maximize(object, key1, key2) {
        if (object[key1] > object[key2])
          object[key2] = object[key1];

        if (object[key2] > object[key1])
          object[key1] = object[key2];
      };

      maximize(this, 'x', 'y');

      return this;
    }

  };

  let Vector3 = Vector,
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

    rotatePointsXY(x, y, angle) {

      var theta = angle * Math.PI / 180;

      var point = {};
      point.x = x * Math.cos(theta) - y * Math.sin(theta);
      point.y = x * Math.sin(theta) + y * Math.cos(theta);

      point.z = 0;

      return new Gamelab.Vector(point.x, point.y, point.z);
    },

    rotatePosition3D(x, y, z, $rot) {

      var pos1 = this.rotatePointsXY(x, z, $rot.y);
      var pos2 = this.rotatePointsXY(pos1.x, y, $rot.z);
      //var pos3 = this.rotatePointsXY(y, z, $rot.x);

      return new Gamelab.Vector(pos2.x, pos3.x, pos3.y);
    }

  }

  Gamelab.VectorMath = VectorMath;

})();
;
class Voxel {

  constructor(x, y, w, h){
    this.size = new Gamelab.Vector(w, h);
    this.x = x;
    this.y = y;
  }

}


class VoxelArray {

  constructor(voxels, onCreate){

      onCreate = onCreate || function(){};

      var array = this;

      voxels = voxels || [];

      this.voxels = [];

      this.id = Gamelab.create_id();

      voxels.forEach(function(v){

        array.push(v);

      });

      onCreate.bind(this).call();
  }

  Clone(object){
    if(object.voxels instanceof Array)
    return new Gamelab.VoxelArray(object.voxels);
    else
    return console.error('needs array-type@ on 1st arg: .voxels');
  }

  push(item){
    this.voxels.push(item);
  }
  add(item)
  {
    this.voxels.push(item);
  }

  FromData(data)
  {
    var jsonData = JSON.parse(JSON.stringify(data));
    return new VoxelArray(jsonData.voxels);
  }
}

Gamelab.Voxel = Voxel;
Gamelab.VoxelArray = VoxelArray;
;(function() {
  console.log('GSEvent class... creating');

  class GSEvent {

    constructor(args = {}) {

      //  Gamelab.Modifiers.informable(this, args);

    }
  }

  class MouseMoveEvent {
    constructor(callback) {
      callback = callback || function(x, y) {};

      this.Callback(callback);
    }
    Callback(cb) {
      Gamelab.InputSystem.extend('mousemove', function(x, y) {

        cb(x, y);

      });
    }
  };

  Gamelab.MouseMoveEvent = MouseMoveEvent;

  class MousePosEvent {
    constructor(callback) {
      callback = callback || function(x, y) {};

      this.Callback(callback);
    }
    Callback(cb) {
      Gamelab.InputSystem.extend('mousepos', function(x, y) {

        cb(x, y);

      });
    }
  };

  Gamelab.MousePosEvent = MousePosEvent;

  class MouseLeftClickEvent {
    constructor(callback) {
      callback = callback || function(x, y) {};

      this.Callback(callback);
    }
    Callback(cb) {

      Gamelab.InputSystem.extend('leftclick', function(x, y) {

        cb(x, y);

      });
    }
  };

  Gamelab.MouseLeftClickEvent = MouseLeftClickEvent;

  class MouseRightClickEvent {
    constructor(callback) {
      callback = callback || function(x, y) {};

      this.Callback(callback);
    }
    Callback(cb) {

      Gamelab.InputSystem.extend('rightclick', function(x, y) {

        cb(x, y);

      });
    }
  };

  Gamelab.MouseRightClickEvent = MouseRightClickEvent;

  function GSEventLink(extendedObject, extendedKey, extendor, extendorKey) {
    this.parent_id = extendedObject.id,

      this.child_id = extendor.id,

      this.parent_key = extendedKey,

      this.child_key = extendorKey;
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
    constructor(keys = [], callback = function() {}) {

      super({});

      this.keys = keys;

      this.callback = callback;

    }

    Gamepads(gps = []) {
      this.gps = gps = TypeCode.arrayWrap(gps || []);

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

      this.objects = TypeCode.arrayWrap(objects || this.objects || []);

      this.siblings = TypeCode.arrayWrap(siblings || this.siblings || []);

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

      let $collision = this;

      this.objects.forEach(function($obj){

        $obj.onUpdate(function(){

          var $sprite = this;

          $collision.siblings.forEach(function($sib){
            if($sprite.hasBoxCollision($sib))
            {
              $collision.callback($sprite, $sib);
            }
          });
        });
      });


      return this;

    }
  };

  /**
   * returns BoolEvent --allows code to run whenever a conditional-function returns true
   * @param   {onBool} onBool the function to be tested each update
   * @param   {call} call the function to be called when onBool returns true;

   * @returns {BoolEvent} a Gamelab.BoolEvent object
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

  BoolEvent.Bool = BoolEvent.On;

  Gamelab.GSEvent = GSEvent;

  Gamelab.Event = GSEvent;

  Gamelab.GSEventLink = GSEventLink;

  Gamelab.InputEvent = InputEvent;

  Gamelab.GamepadEvent = GamepadEvent;

  Gamelab.KeyboardEvent = KeyboardEvent;

  Gamelab.CollisionEvent = CollisionEvent;

  Gamelab.BoxCollisionEvent = CollisionEvent;

  Gamelab.BoolEvent = BoolEvent;

})();
;(function() {
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


  class Frame {
    constructor() {
      var __inst = this;
      this.framePos = new Gamelab.Vector(0, 0);
      this.origin = new Gamelab.Vector(0, 0);
      this.rotation = new Gamelab.Vector(0, 0, 0);
    }

    Image(src) {
      this.image = new Gamelab.GameImage(src);
      return this;
    }

    onLoad(fxn) {

      fxn = fxn || function() {};
      fxn = fxn.bind(this);
      this.image.domElement.onload = function() {
        fxn();
      };

    }

    Origin(x, y, z) {
      this.origin = new Gamelab.Vector(x, y, z);
      return this;
    }

    Rotation(x, y, z) {
      this.rotation = new Gamelab.Vector(x, y, z);
      return this;
    }

    FramePos(p) {
      this.framePos = new Gamelab.Vector(p, p, p);

      return this;
    }

    FrameSize(x, y, z) {
      this.frameSize = new Gamelab.Vector(x, y, z);
      return this;
    }

    Scale(s)
    {
      if(this.image && this.image.domElement)
      {
        this.size = new Gamelab.Vector(Math.round(this.image.domElement.width * s), Math.round(this.image.domElement.height * s));
      }  
    }

    StoreOffscreen() {

      this.offscreen = this.offscreen || new Gamelab.OffscreenCanvasRendering(this.image);

      for (var x in this.offscreen) {
        if (x == 'ctx' || x == 'canvas')
          this[x] = this.offscreen[x];
      }


      return this;

    }

    getURL() {
      this.StoreOffscreen();
      return this.offscreen.canvas.toDataURL();
    }

    getColoredPixelGrid(unitSize = 5, ctx) {

      var grid = [];

      ctx = ctx || this.ctx;

      let min = this.framePos,
        max = this.framePos.add(this.frameSize);


      for (var x = min.x; x <= max.x; x += unitSize) {
        for (var y = min.y; y <= max.y; y += unitSize) {
          // Fetch pixel at current position
          var pixel = ctx.getImageData(x, y, 1, 1);
          // Check that opacity is above zero
          if (pixel.data[3] != 0) {

            var vector = new Gamelab.Vector(x, y),

              gridObject = {

                position: vector,

                x:x,
                y:y,

                size: new Gamelab.Vector(unitSize, unitSize),

                pixel: pixel,

                rotation:this.rotation

              };

            grid.push(gridObject);
          }
        }
      }

      return grid;
    }

    getNonColoredPixelGrid(unitSize = 5, ctx) {

      var grid = [];

      ctx = ctx || this.ctx;

      let min = this.framePos,
        max = this.framePos.add(this.frameSize);


      for (var x = min.x; x <= max.x; x += unitSize) {
        for (var y = min.y; y <= max.y; y += unitSize) {
          // Fetch pixel at current position
          var pixel = ctx.getImageData(x, y, 1, 1);
          // Check that opacity is above zero
          if (pixel.data[3] == 0) {

            var vector = new Gamelab.Vector(x, y),

              gridObject = {

                position: vector,

                x:x,
                y:y,

                size: new Gamelab.Vector(unitSize, unitSize),

                pixel: pixel,

                rotation:this.rotation

              };

            grid.push(gridObject);
          }
        }
      }

      return grid;
    }

    getFullPixelGrid(unitSize = 5, ctx) {

      ctx = ctx || this.ctx;

      var grid = [];

      let min = this.framePos,
        max = this.framePos.add(this.frameSize);

      for (var x = min.x; x <= max.x; x += unitSize) {
        for (var y = min.y; y <= max.y; y += unitSize) {
          // Fetch pixel at current position
          var pixel = ctx.getImageData(x, y, 1, 1);
          // Check that opacity is above zero


          var vector = new Gamelab.Vector(x, y),

            gridObject = {

              position: vector,

              x:x,
              y:y,

              size: new Gamelab.Vector(unitSize, unitSize),

              pixel: pixel,

              rotation:this.rotation

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

    createColorMap(size, ctx) {

      this.StoreOffscreen();

      ctx = ctx || this.ctx;

      this.colorMap = this.colorMap || this.getColoredPixelGrid(size, ctx);

      return this.colorMap;
    }

    createNonColorMap(size, ctx) {
      this.StoreOffscreen();
      ctx = ctx || this.ctx;
      this.nonColorMap = this.nonColorMap || this.getNonColoredPixelGrid(size, ctx);
      return this.nonColorMap;
    }


    createPixelMap(size, altImage) {
      if(this.image.domElement instanceof HTMLCanvasElement)
      {
        this.canvas = this.image.domElement;
        ctx = this.ctx = this.canvas.getContext('2d');
      }
      else{
        this.StoreOffscreen();
        ctx = ctx || this.ctx;
      }

      this.pixelMap = this.pixelMap || this.getFullPixelGrid(size, this.testCtx);
      return this.fullPixelMap;
    }

  }

  Gamelab.Frame = Frame;

})();
;/**
 * @ignore
 * */

class ControllerEventKeys {
    constructor() {
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

        }

    }

}

Gamelab.ControllerEventKeys = ControllerEventKeys;


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

        gp.on = function (key, callback) {

            if (this[key] && key !== "on") {

                var current_cb = typeof(this[key]) == 'function' ? this[key] : function (x, y) {
                };

                this[key] = this.extendFunc(callback, current_cb);


            }

            else if (key.indexOf('button') >= 0 && key.indexOf('_') >= 0) {
                var parts = key.split('_');

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
;class Line2d extends Scriptable {

  constructor() {
    super();
    this.Object(this);
    this.points = [];
    this.position = new Gamelab.Vector(0, 0);
    this.size = new Gamelab.Vector(0, 0);
    this.index = 0;
    this.lineWidth = 1.0;
    this.call = function() {};
  }

  StepFunction(call) {
    this.call = call;
    return this;
  }

  next() {
    this.index += 1;
    return this.points[this.index % this.points.length];
  }

  Color(c) {
    this.color = c;
    return this;
  }

  Fill() {

    for (var x = 1; x <= this.size.x; x++) {
          var x_total = this.size.x;
          var out_of_1 = x / x_total;
          var next_x = this.position.x + x;
          console.log('using x portion::' + out_of_1);
          var next_y = this.position.y + (this.size.y * this.call(out_of_1, 1.0)),
            next_point = new Gamelab.Vector(next_x, next_y);
          this.points.push(next_point);
      }

    return this;
  }

  getOffsetPos(pos){
    var offset = this.window_offset || new Gamelab.Vector(0, 0);
    return pos.add(offset);
  }

  LineWidth(number)
  {
    this.lineWidth = number;
    return this;
  }

  draw(ctx, camera) {

    ctx = ctx || Gamelab.game_windows[0].ctx;
    camera = camera || Gamelab.game_windows[0].camera;

    var points = this.points;

    ctx.save();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.lineWidth;

    ctx.beginPath();
    if (points instanceof Array) {
      for (var x = 0; x < points.length; x++) {
        var p = points[x];

        var position = p.position || p;

        var real_pos = this.getOffsetPos(position);

        if (real_pos.hasOwnProperty('x') && real_pos.hasOwnProperty('y')) {
          if (x == 0)
            ctx.moveTo(real_pos.x, real_pos.y)
          else {
            ctx.lineTo(real_pos.x, real_pos.y);
          }
        }
      }
    }

    ctx.stroke();
    ctx.restore();

  }

}

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

class Sound {

    constructor(src, data) {

        if (typeof(src) == 'object') {

            this.sound = document.createElement('audio');

            this.sound.src = src.src;

            this.src = src.src;
        }

        else if (typeof(src) == 'string') {

            this.sound = document.createElement('audio');

            this.sound.src = src;

            this.src = src;

        }

        if(typeof(data)=='object') {
            for (var x in data) {
                if (x !== 'sound') {
                    this[x] = data[x];

                }
            }
        }

        this.onLoad = this.onLoad || function () {
            };

        if (typeof(this.onLoad) == 'function') {

            this.onLoad(this.sound);

        }

    }

    Loop(loop)
    {
        this.sound.loop = loop || true;

        return this;

    }

    loop(loop) //same as Loop()
    {
        this.sound.loop = loop || true;

        return this;

    }


    Volume(val)
    {

        this.sound.volume = val;

        return this;

    }


    volume(val) //same as Volume()
    {

        this.sound.volume = val;

        return this;

    }

    Play() {
        if (typeof(this.sound) == 'object' && typeof(this.sound.play) == 'function') {

            this.sound.play();

        }

        return this;

    }

    play() { //same as Play()
        if (typeof(this.sound) == 'object' && typeof(this.sound.play) == 'function') {

            this.sound.play();
        }
        return this;
    }

}


class SoundList{

    constructor(list)
    {
        this.cix = 1;

        this.sounds = [];

        if(list instanceof Array)
        {
            for(var x in list)
            {
                if(list[x].src)
                {
                    this.sounds.push(new Sound(list[x].src, list[x]));

                }
                else if(typeof(list[x]) == 'string')
                {
                    this.sounds.push(new Sound(list[x]));

                }
            }
        }
    }

    add(src, name)
    {
        if(typeof(src) == 'object' && src.src)
        {
            this.sounds.push(new Sound(src.src, src));

        }
        else if(typeof(src) == 'string')
        {
            var data = {};

            if(name)
            {
                data.name = name;
            }

            this.sounds.push(new Sound(list[x], data));

        }

    }

    Volume(v)
    {
        for(var x = 0; x < this.sounds.length;x++)
        {
            this.sounds[x].volume(v);

        }

        return this;
    }

    volume(v)
    {
        for(var x = 0; x < this.sounds.length;x++)
        {
            this.sounds[x].volume(v);

        }

        return this;
    }


    PlayNext()
    {
        this.sounds[this.cix % this.sounds.length].play();

        this.cix += 1;

    }

    Play()
    {

        this.sounds[this.cix % this.sounds.length].play();

        this.cix += 1;


    }

    playNext() //same as PlayNext()
    {
        this.sounds[this.cix % this.sounds.length].play();

        this.cix += 1;

    }

    play() //same as Play()
    {

        this.sounds[this.cix % this.sounds.length].play();

        this.cix += 1;


    }

}

Gamelab.Sound = Sound;

Gamelab.SoundList = SoundList;




class Audio {

  constructor(){


  }

}

Gamelab.Audio = Audio;
;(function() {
  console.log('Animation class... creating');

  /**
   *
   * Creates an instance of Animation with one or more Frames.
   *
   * <example-marker data-class='Animation' data-info='Use JQuery fnxs to load content into the div outside of this p-element. Do not use iframe' > </example-marker>
   *
   * @param   {string=} [src] the src-image-path for this Animation
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

  class Animation {

    constructor(src = {}) {

      var args = typeof(src) == 'object' ? src : {};

      //Gamelab.Modifiers.informable(this, args);

      if (typeof src == 'string' || src instanceof HTMLCanvasElement) {
        this.src = src;
        this.image = new Gamelab.GameImage(src);
        this.init_singleFrame();
      } else if (args instanceof Gamelab.GameImage) {
        console.log('Animation(): args are an instance of GameImage');

        this.image = args;
      } else if (args instanceof HTMLImageElement) {
        console.log('Animation(): args was an instance of HTMLImageElement');

        this.image = new Gamelab.GameImage(args);
      } else if (args instanceof Gamelab.Animation) {

        this.image = args.image;

      } else if (typeof(args) == 'object' && args.src) {
        this.src = args.src;
        this.image = new Gamelab.GameImage(args.src);
      }

      this.min_cix = 0;

      this.visible = args.visible || true;

      /**
       * @property {Vector} frameSize the frameSize of the Animation
       * @memberof Animation
       **********/

      this.frameSize = this.frameSize || new Gamelab.Vector(args.frameSize || new Gamelab.Vector(0, 0));


      if (args.frameBounds && args.frameBounds.min && args.frameBounds.max) {

        /**
         * @property {VectorFrameBounds} frameBounds the frameBounds of the Animation, has three Vectors
         * @memberof Animation
         **********/

        this.frameBounds = new Gamelab.VectorFrameBounds(args.frameBounds.min, args.frameBounds.max, args.frameBounds.termPoint);

      } else {

        this.frameBounds = new Gamelab.VectorFrameBounds(new Gamelab.Vector(0, 0, 0), new Gamelab.Vector(0, 0, 0), new Gamelab.Vector(0, 0, 0));

      }

      this.scale = 1.0;

      this.origin = new Gamelab.Vector(0, 0, 0);

      this.position = new Gamelab.Vector(0, 0);

      this.rotation = new Gamelab.Vector(0, 0, 0);

      this.frameOffset = this.getArg(args, 'frameOffset', new Gamelab.Vector(0, 0, 0));

      this.apply2DFrames();

      this.flipX = this.getArg(args, 'flipX', false);

      this.cix = 0;

      /**
       * @property {Frame} selected_frame the selected_frame of the Animation, a Gamelab.Frame
       * @memberof Animation
       **********/

      this.selected_frame = this.frames[0] || false;

      this.timer = 0;

      this.duration = args.duration || 2000;

      this.seesaw_mode = args.seesaw_mode || false;

      this.reverse_frames = args.reverse_frames || false;

      this.run_ext = args.run_ext || [];

      this.complete_ext = args.complete_ext || [];


      // this.colorMap = this.createColorMap(5);

    }

    set img_src(value) {
      this.src = value;
    }

    get img_src() {
      return this.src;
    }

    Origin(x, y, z) {
      this.origin = new Gamelab.Vector(x, y, z);

      this.frames.forEach(function($f) {
        $f.origin = new Gamelab.Vector(x, y, z);
      });
      if (this.selected_frame) {
        this.selected_frame.origin = new Gamelab.Vector(x, y, z);
      }
      return this;
    }

    Position(x, y, z) {
      this.position = new Gamelab.Vector(x, y, z);

      this.frames.forEach(function($f) {

        $f.position = new Gamelab.Vector(x, y, z);

      });

      return this;
    }

    Size(x, y) {

      this.size = new Gamelab.Vector(x, y);
      this.frames.forEach(function(f) {

        f.Size(x, y);

      });
      return this;
    }

    Bone(b) {
      this.bone = b;
      return this;
    }

    ParentBone(b) {
      this.parentBone = b;
      return this;
    }

    Rotation(x, y, z) {

      this.rotation = new Gamelab.Vector(x, y, z);

      this.frames.forEach(function($frame) {
        $frame.Rotation(x, y, z);
      });

      return this;
    }

    Src(src, options = {}) {

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

      if (!options.frameBounds)
        this.init_singleFrame();

      return this;

    }

    Scale(s) {

      this.scale = s;

      if (this.image && this.image.domElement && this.image.domElement.width > 0) {
        this.size = new Gamelab.Vector(this.image.domElement.width * s, this.image.domElement.height * s).round();
        this.Size(this.size);
      }

      if(this.frames instanceof Array)
      this.frames.forEach(function(f){

        f.Scale(s);

      });

      return this;
    }

    Size(x, y, z) {

      this.size = new Gamelab.Vector(x, y, z);

      this.frames.forEach(function(f) {
        f.size = new Gamelab.Vector(x, y, z);
      });

      return this;
    }

    Image(src) {

      if (typeof(src) == 'string') {

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

    init_singleFrame() {

      var $anime = this;

      $anime.load_call = $anime.load_call || function() {};

      this.image.domElement.onload = function() {

        //alert('Anime loaded');

        $anime.FrameSize($anime.image.domElement.width, $anime.image.domElement.height)
          .FrameBounds(new Gamelab.Vector(0, 0), new Gamelab.Vector(0, 0));

        $anime.apply2DFrames();

        $anime.Size($anime.frameSize.mult(new Gamelab.Vector($anime.scale, $anime.scale)));


        $anime.load_call();

      };

      Gamelab.log('Animation():set single-frame animation');

      return this;

    }

    /*****
     * Overridable / Extendable functions
     * -allows stacking of external object-function calls
     ******/


    /**
     * Provides a function to be called when this Animation.image loads.
     *
     * @function
     * @params {Function} call the function to be called on load
     * @memberof Animation
     **********/

    onLoad(call) {

      var $anime = this;
      call = call || function() {};

      this.load_call = call;

      this.image.domElement.onload = function() {

        call.bind($anime).call();

      };

    }

    /**
     * Provides a function to be called whenever this Animation starts. Function should run every time the Animation reaches frame-index 0
     *
     * @function
     * @params {Function} call the function to be called on start
     * @memberof Animation
     **********/

    onRun(call) {

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

    onComplete(call) {

      if (this.complete_ext.indexOf(call) == -1) {
        this.complete_ext.push(call.bind(this));
      }
    }

    call_on_run() {
      //call any function extension that is present
      for (var x = 0; x < this.run_ext.length; x++) {
        this.run_ext[x](this);
      }
    }

    call_on_complete() {
      //call any function extension that is present
      for (var x = 0; x < this.complete_ext.length; x++) {
        this.complete_ext[x](this);
      }
    }


    Visible(v) {
      this.visible = v;
      return this;
    }


    FrameSize(w, h) {
      this.frameSize = new Gamelab.Vector(w, h);
      this.__isInit = true;
      this.run();
      return this;
    }

    Hang() {
      this._hang = true;
      return this;
    }

    FrameBounds(minVector, maxVector, termVector) {
      this.frameBounds = new Gamelab.VectorFrameBounds(minVector, maxVector, termVector);
      this.__isInit = true;
      this.run();
      return this;
    }

    FrameOffset(x, y) {
      this.frameOffset = new Gamelab.Vector(x, y);
      return this;
    }

    Seesaw() {
      if (!this.seesaw_mode) {
        this.seesaw_mode = true;
      }
      return this;
    }

    Duration(millis) {
      this.duration = millis;
      return this;
    }


    /**
     * Reverses all frames of the animation. Frames are then expected to run backwards.
     *
     * @function
     * @memberof Animation
     **********/

    ReverseFrames() {

      this.reverse_frames = true;
      return this;
    }

    /**
     * Sets the animation a a single frame / full-image. Use before img is loaded
     *
     * @function
     * @param {Vector} frameSize optional size param
     * @memberof Animation
     **********/

    SingleFrame() {
      this.init_singleFrame();
      return this;
    }

    getArg(args, key, fallback) {

      if (args.hasOwnProperty(key)) {
        return args[key];
      } else {
        return fallback;
      }
    }

    init() {
      this.apply2DFrames();
      return this;
    }


    apply2DFrames() {

      console.log('Running apply2DFrames(): --' + this.name);

      this.frames = [];

      if (!this.size) {
        this.Size(this.frameSize.x, this.frameSize.y);
      }

      var fcount = 0;

      var quitLoop = false;

      for (let y = this.frameBounds.min.y; y <= this.frameBounds.max.y; y++) {

        for (let x = this.frameBounds.min.x; x <= this.frameBounds.max.x; x++) {

          let framePos = {
            x: x * this.frameSize.x + this.frameOffset.x,
            y: y * this.frameSize.y + this.frameOffset.y
          };

          var f = new Gamelab.Frame().Image(this.image).FramePos(framePos).FrameSize(this.frameSize).Origin(this.origin).Size(this.size || this.frameSize).Position(this.position || framePos);
          f.Rotation(this.rotation);

          this.frames.push(f);

          if (x >= this.frameBounds.termPoint.x && y >= this.frameBounds.termPoint.y) {

            quitLoop = true;

            break;
          }

          fcount += 1;

          if (quitLoop)
            break;

        }

      }

      this.frames[0] = this.selected_frame = this.frames[0] || new Gamelab.Frame().Image(this.image).FrameSize(this.frameSize).Size(this.frameSize);

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

    scaleOf(sized_Object) {

      var s = TypeCode.getPreferredPropertyByKey(sized_Object, 'size', 'argument had nested size variable. Using this instead.');

      return s.div(this.frameSize);

    }

    init_colorMap() {
      TypeCode.info('init_colorMap()');

      if (!TypeCode.allDefined([this.image, this.image.domElement]))
        return [];

      this.canvasObject = this.canvasObject || new Gamelab.OffscreenCanvasRendering(this.image);

      this.colorMap = this.colorMap || this.ColoredPixelGrid();

      return this.colorMap;
    }


    ColoredPixelGrid() {

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

    getCurrentPixelMap() {

      TypeCode.info('getCurrentPixelMap()');
      var map = [];
      var frame = this.selected_frame;
      let __inst = this;

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

    setFrame(ix) {
      this.selected_frame = this.frames[ix];
    }


    /**
     * extends the update of this animation with a new function to be called during the update
     * --repeated calls will extend, (not replace) the update --Allows multiple extensions of the update
     * @function
     * @memberof Animation
     * @param {function} fun the function to be appended to sprite.update
     *
     *  * @example
     * // extend the behavior of your animation
     * myAnime.onUpdate(function(spr)
     *
     *                    console.log('extended update'); //runs automatically whenever animation.update runs
     *
     *                   });
     *
     **********/


    onUpdate(fun) {

      fun = fun.bind(this);

      let update = this.update.bind(this);
      let __inst = this;
      this.update = function(__inst) {
        update(__inst);
        fun(__inst);
      };
    }

    update(){
      this.update_frame();
    }

    update_frame() {

      this.selected_frame = this.frames[Math.round(this.cix) % this.frames.length];
    }

    reset() {

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

    run() {


      if (this.__frametype == 'single') {
        return 0;
      }

      this.apply2DFrames();

      this.cix += 1;

      //update once:
      this.update_frame();

      if (this.cix % this.frames.length == 0) {

        this.engage();

      }
    }

    /**
     * animate():: same as run()
     *
     * @function
     * @memberof Animation
     **********/

    animate() {


      if (this.__frametype == 'single') {
        return 0;
      }

      this.apply2DFrames();

      //update once:
      //this.update();

      if (this.cix % this.frames.length == 0) {

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

    engage(duration) {

      this.call_on_run();

      duration = duration || this.duration || this.frames.length * 20;

      if (this.__frametype == 'single') {
        return 0;
      }

            //note support of min_cix (eg: min_cix of 1 if top-row starts 1 frame later than bottom)
            if (this.cix >= this.frames.length - 1 || this.cix < this.min_cix) {
              this.cix = this.min_cix;
            }

      let __inst = this;

      //we have a target
      this.tween = new TWEEN.Tween(this)
        .easing(__inst.curve || TWEEN.Easing.Linear.None)

        .to({
          cix: this.min_cix + (this.frames.length - 1)
        }, duration)
        .onUpdate(function() {
          //console.log(objects[0].position.x,objects[0].position.y);

            //__inst.cix = Math.ceil(__inst.cix);

          __inst.update_frame();

        })
        .onComplete(function() {
          //console.log(objects[0].position.x, objects[0].position.y);

          __inst.cix = __inst.min_cix;

          __inst.call_on_complete();

          __inst.isComplete = true;

        });


      if (this.cix == this.min_cix)
        this.tween.start();


    }
  };

  /** @memberof Gamelab */

  Gamelab.Animation = Animation;

  Gamelab.Animation.continuous = Gamelab.Animation.run; //'continuous is an alternate reference to 'run'.'

  Gamelab.Animation.continue = Gamelab.Animation.run; //'continue is an alternate reference to 'run'.'

  Gamelab.Animation.animate = Gamelab.Animation.run; //'animate is an alternate reference to 'run'.'

})();
;


class Box2D{

  constructor(pos, size){
    this.Position(pos | 0);
    this.Size(size | 0);
  }

  Position(x, y)
  {
    this.position = new Gamelab.Vector(x, y);
    return this;
  }
  Size(x, y)
  {
    this.size = new Gamelab.Vector(x, y);
    return this;
  }

}



Gamelab.Box2D = Box2D;
;
class Mesh
{
    constructor(vertices, position)
    {
    this.vertices = vertices;
    this.position = position;
    }
}


Gamelab.Mesh = Mesh;
;


class FeildSpan {
  constructor(a, b, transition = 'linear', duration = 500) {
    //console.log('FeildSpan(a, b, transition) :: transition may be the key-name of a curve or "random"');

    this.a = a;
    this.b = b;
    this.transition = transition;
    this.duration = duration;
    this.ticker = 0;

    this.Duration = function(d) {
      this.duration = d;
      return this;
    };

    this.Clone = function() {
      return new FeildSpan(this.a, this.b, this.transition, this.duration);
    };

    this.reset = function() {
      this.ticker = 0;
    };

    this.getValue = function() {

      var option = this,

        value = 0,

        diff = option.a - option.b;
        option.duration = option.duration || 500;
        var tvalue = option.transition;

        var curveMethod;

      for (var x in Twix.Curves) {
        if (x.toLowerCase() == option.transition.toLowerCase())
          curveMethod = Twix.Curves[x].None || Twix.Curves[x].In;
      }

      if (tvalue == 'random') {
        option.ticker += 1;

        var finalValue = option.a;

        if (option.a <= option.b) {
          return option.a + Math.abs((Math.random() * diff));
        } else {
          return option.a - Math.abs((Math.random() * diff));
        }


      } else if (curveMethod) {

        var portion = option.ticker / option.duration;

        option.ticker += 1;

        diff = Math.abs(diff);

        var curveStep = Math.abs(curveMethod(portion) * diff);

        var finalValue = option.a;

        finalValue += option.a > option.b ? curveStep * -1 : curveStep;

        if (option.ticker >= option.duration) {
          return option.b;
        }

        return finalValue;
      }
    };
  }
}


class ColorFeildSpan {

  constructor(a, b, transition = 'linear', duration = 500) {
    this.a = a;
    this.b = b;
    this.transition = transition;
    this.duration = duration;
    this.ticker = 0;
    this.colors = [];

    this.Duration = function(d) {
      this.duration = d;
      return this;
    };

    this.Clone = function() {

      return new ColorFeildSpan(this.a, this.b, this.transition, this.duration);
    };

    //runs 100 X , creates set of differential colors on the specified scale
    for (var x = 0.0; x <= 1.0; x += 0.01) {
      //use the x value to get the set of y values for this transition | curve (ex 'cubic')
      var tvalue = this.transition !== 'random' ? this.transition : 'linear';
      var option = JSON.parse(JSON.stringify(this)),
        value = 0;

      var curveMethod;

      option.duration = option.duration || 500;

      //if 'random' then create a linear scale to select from
      if (this.transition == 'random') {
        tvalue = 'linear';
      }

      var portion = x;

      this.colors.push(Gamelab.ColorCalculator.scaledRGBAFromHex(option.a, option.b, portion));
    };

    this.reset = function() {
      this.ticker = 0;
    };


    //getValue :: returns the color for current step
    this.getValue = function() {
      //calculate portion as step 0.0 - 1.0
      var portion = this.ticker / this.duration;

      //increment ticker
      this.ticker += 1;

      //handle random transition
      if (this.transition == 'random') {
        return this.colors[Math.floor(Math.random() * this.colors.length)];
      }

      //get the correct array-member of index 0-99 using portion
      return this.colors[Math.floor(portion * 100)];
    };

  }

}

Gamelab.FeildSpan = FeildSpan;

Gamelab.ColorFeildSpan = ColorFeildSpan;


class Particle {

  constructor(options = {}, gameWindow) {

    var canvas = document.createElement('CANVAS');

    options.size = options.size || new Gamelab.Vector(2000, 2000);

    options.birthrate = options.birthrate || new Gamelab.FeildSpan(8, 10, "random")

    this.options = options;

    canvas.width = options.size.x;
    canvas.height = options.size.y;
    canvas.style.display = 'none';

    options.max = 1000;

    this.Life(70, 70, 'random');

    this.DefaultValues();

    this.Options(options);

    var sourceSprites = [],
      livingSprites = [],
      ctx = canvas.getContext('2d');

    this.sourceSprites = [];

    this.Src('./res/images/particles/colored-ring-01.png');

    this.gameWindow = gameWindow;
    this.ctx = ctx;
    this.canvas = canvas;

    this.sprites = [];
    this.birthInterval = 0;
    this.ticker = 0;
    this.total = 0;
    this.position = new Gamelab.Vector(200, 200);
  }

  DefaultValues() {
    var def_life = 50;
    this.BirthRate(4, 8, 'random', def_life);
    this.Composite('lighter');
    this.Scale(0.6, 0.8, 'quadratic', def_life);
    this.Speed(7.5, 1.0, 'linear', def_life);
    this.Alpha(1.0, 0.1, 'quintic', def_life);
    this.Color('#ff0000', '#0000ff', 'quadratic', def_life);
  }

  Options(options) {

    this.BirthRate(options.birthrate.a, options.birthrate.b, options.birthrate.transition, options.birthrate.duration);

    this.Composite(options.composite || options.globalComposite || options.gobalCompositeOperation || 'lighter');

    if(options.life)
    this.Life(options.life.a, options.life.b, options.life.transition, 500);

    var life = this.life.Clone().getValue();

    if (options.angle)
      this.Angle(options.angle.a, options.angle.b, options.angle.transition, life);

    if (options.scale)
      this.Scale(options.scale.a, options.scale.b, options.scale.transition, life);

    if (options.speed)
      this.Speed(options.speed.a, options.speed.b, options.speed.transition, life);

    if (options.alpha)
      this.Alpha(options.alpha.a, options.alpha.b, options.alpha.transition, life);

    if (options.color)
      this.Color(options.color.a, options.color.b, options.color.transition, life);
  }

  //Add delay per birth of particles
  Delay(d) {
    this.delay = d;
    return this;
  }

  //flipX :: reverse the x-speed of sprite over x-axis
  FlipX(value) {
    this.flipX = value;

    if (this.flipX) {
      if (this.options.speed.a > 0) {
        this.options.speed.a = -this.options.speed.a;
      }
      if (this.options.speed.b > 0) {
        this.options.speed.b = -this.options.speed.b;
      }
    } else {
      if (this.options.speed.a < 0) {
        this.options.speed.a = -this.options.speed.a;
      }
      if (this.options.speed.b < 0) {
        this.options.speed.b = -this.options.speed.b;
      }
    }
    return this;
  }

  //Define the src (image) of the particle
  Src(src) {

    this.sourceSprites = [];
    this.options.src = src;

    for (var x = 0; x < this.options.max; x++) {
      var sprite = new Gamelab.Sprite(this.options.src).Scale(this.options.scale.a);
      sprite.options = this.options;
      this.sourceSprites.push(sprite);
    }

    return this;
  }

  //Total particles to draw from
  Stock(stock) {
    this.options.stock = stock;
    return this;
  }

  //birth rate, updateable
  BirthRate(a, b, transition, life) {
    this.options.birthrate = new Gamelab.FeildSpan(a, b, transition, life);
    return this;
  }

  OffsetAllByX(x) {

    var particle = this;

    this.sprites.forEach(function(sprite) {
      if (!sprite.detached_particle && sprite.flipX == particle.flipX)
        sprite.position.x += x;
      else {
        sprite.detached_particle = true;
      }
    });

    return this;
  }

  //composite :: example value = 'lighter'
  Composite(c) {
    this.options.globalCompositeOperation = c;
    return this;
  }

  //Life span
  Life(a, b, transition, duration = 500) {
    this.life = new Gamelab.FeildSpan(a, b, transition, duration);
    return this;
  }

  Color(a, b, transition, life) {
    this.options.color = new Gamelab.ColorFeildSpan(a, b, transition, life);
  }

  //scale transition
  Scale(a, b, transition, life) {
    this.options.scale = new Gamelab.FeildSpan(a, b, transition, life);
    return this;
  }

  //allowable angles
  Angle(a, b, transition, life) {
    this.options.angle = new Gamelab.FeildSpan(a, b, transition, life);
    return this;
  }

  //alpha transition
  Alpha(a, b, transition, life) {
    this.options.alpha = new Gamelab.FeildSpan(a, b, transition, life);
    return this;
  }

  //speed transition
  Speed(a, b, transition, life) {
    this.options.speed = new Gamelab.FeildSpan(a, b, transition, life);
    return this;
  }

  addParticles(total) {

    var options = this.options;

    for (var x = 0; x < total; x++) {

      this.total += 1;

      var sprite = this.sourceSprites[this.total % this.sourceSprites.length];

      if (sprite.constructor.name !== 'Sprite') {
        console.error('not a sprite');
      }

      sprite.Scale(2.0);

      sprite.detached_particle = false;

      sprite.Position(this.position);

      sprite.flipX = this.flipX;

      var particle = this;

      sprite.flyByRotation = function(angle, speed) {

        this.speed = Gamelab.Trig.rotational_speed(angle, speed);

        this.position = this.position.add(this.speed);

      };

      sprite.ticker = 0;

      sprite.gunOptions = {};

      sprite.gunOptions.life = this.life.Clone();

      sprite.life = sprite.gunOptions.life.getValue();

      sprite.gunOptions.angle = options.angle.Duration(sprite.life).Clone();

      sprite.gunOptions.color = options.color.Duration(sprite.life).Clone();

      sprite.gunOptions.alpha = options.alpha.Duration(sprite.life).Clone();

      sprite.gunOptions.speed = options.speed.Duration(sprite.life).Clone();

      sprite.gunOptions.scale = options.scale.Duration(sprite.life).Clone();

      sprite.opacity = sprite.gunOptions.alpha.getValue();

      sprite.color = sprite.gunOptions.color.getValue();

      sprite.scale = sprite.gunOptions.scale.getValue();

      sprite.EffectCanvas(sprite.color);

      sprite.globalCompositeOperation = options.globalCompositeOperation || 'lighter';

      var angleDiff = Math.abs(options.angle.a - options.angle.b);

      sprite.fly_angle = sprite.gunOptions.angle.getValue();

      sprite.Scale(sprite.scale);


      sprite.update = function() {

        this.ticker += 1;

        if (this.life <= 0) {
          particle.sprites.splice(particle.sprites.indexOf(this), 1);
          gameWindow.remove(this);
        }


                this.scale = this.gunOptions.scale.getValue();

                this.Scale(this.scale);

                this.anime.Scale(this.scale);

        this.color = this.gunOptions.color.getValue();

        this.Opacity(this.gunOptions.alpha.getValue());

        this.EffectCanvas(this.color);

        this.gunSpeed = this.gunOptions.speed.getValue();

        this.flyByRotation(this.fly_angle % 360, this.gunSpeed);
      };

      this.sprites.push(sprite);

      this.gameWindow.add(sprite);
    }
  }

  shoot() {

    this.ticker += 1;

    if (this.birthInterval < 1)
      this.birthInterval = 1;

    if (this.ticker % this.birthInterval == 0) {

      this.addParticles(this.options.birthrate.getValue());

    }

  }
}


Gamelab.Particle = Particle;
;/**
 * Creates a new Sprite.
 *
 * <info-bit>Gamelab.Sprite is a container for 2D Animations.
 * -apply Sprite class to create a 2D game-object.
 *
 * Sprites hold reference to their-own Animations and Sounds.</info-bit>
 * <iframe style='width:400px; height:450px; overflow:hidden;' src='../client/examples/js-class/Sprite.html'> </iframe>

 * @param   {string} src the srcPath for the image of the Sprite
 * @param   {number} scale=1.0 the scale to be applied to size of each animation-frame
 *
 * @returns {Sprite} a Gamelab.Sprite object
 *
 *
 *
 */

var Checkers = {

    ListProps:function(array, props, call){

      array.forEach(function(){



      });

    }

};

class Sprite extends Scriptable {
  constructor(src = {}, scale = 1.0) {
    super();
    this.Object(this);

    var args = typeof src == 'object' ? src : {};


    if (args instanceof Gamelab.Animation) //instantiate from animation
    {
      console.dev('args was Gamelab.Animation', args);
      args = {
        selected_animation: args,
        image: args.image,
        size: new Gamelab.Vector(args.frameSize)
      };
    }

    this.animations = [];

    //create size property
    this.size = new Gamelab.Vector(0, 0);
    this.active = true; //defaults to active or visible


    //apply image from string 'src'

    if (src instanceof HTMLCanvasElement) {
      this.src = src;
      this.selected_animation = new Gamelab.Animation(src);
      this.image = this.selected_animation.image;
      this.animations = [];
      this.animations.push(this.selected_animation);
      this.SingleFrame();
    } else if (typeof src == 'string') {
      this.src = src;
      this.selected_animation = new Gamelab.Animation(src);
      this.image = this.selected_animation.image;
      this.animations = [];
      this.animations.push(this.selected_animation);
      this.SingleFrame();
    }

    if (typeof(scale) == 'number') //image plus 'scale' argument
    {
      this.scale = scale || 1.0;
    }

    //apply remaining args
    this.apply_args(args);

    if (!this.selected_animation)
      this.SingleFrame();
  }


  Size(x, y, z) {
    this.size = new Gamelab.Vector(x, y, z);
    if (this.selected_animation && this.selected_animation.frames instanceof Array) {
      this.selected_animation.Size(vector);
    }
    return this.size;
  }


  static_image_load(img) {
    this.size = new Gamelab.Vector(img.width * this.scale, img.height * this.scale).round();
  }

  EffectCanvas(color) {

    this.effectCanvas = document.createElement('CANVAS');

    var img = this.image.domElement;

    this.effectCanvas.width = img.width;
    this.effectCanvas.height = img.height;

    this.effectCtx = this.effectCanvas.getContext('2d');


    this.effectCtx.drawImage(img, 0, 0, img.width, img.height);

    this.effectCtx.fillStyle = color;
    this.effectCtx.globalAlpha = 0.62;
    this.effectCtx.globalCompositeOperation = "source-atop";
    this.effectCtx.fillRect(0, 0, img.width, img.height);
    this.effectCtx.globalCompositeOperation = "source-over";
    return this;
  }

  /**
   * runs a function for the onload event of this sprite's image
   *
   * @function
   * @param {Function} f the function to be called on load
   * @memberof Sprite
   **********/

  onLoad(f) {

    if (this.src instanceof HTMLCanvasElement) {

      var f = f || function() {};

      f.bind(this).call(false);

    }

    if (this.image && this.image.domElement) {

      var img = this.image.domElement,

        load = img.onload;

      f = f || function() {};

      f.bind(this);

      this.load_call = f;

      var $sprite = this;

      img.onload = function() {

        $sprite.load_total += 1;

        load.bind($sprite).call(false, $sprite);
        //  $sprite.static_image_load(img);
        $sprite.load_call(false, $sprite);
      };

      img.onerror = function(err) {
        $sprite.load_call(true, $sprite);
      }
    }

    return this;
  }


  Opacity(o) {

    this.opacity = o;
    return this;
  }


  /**********
   * @ignore
   **********/

  apply_args(args = {}) {

    this.FromData(args, true); //Using a FUNCTIONAL COPY --heavy to process


    function array_instance(list) {
      return list.slice(0);
    };

    if (args.image instanceof Gamelab.GameImage && !this.image) {
      this.image = args.image;
    }

    this.name = args.name || "__blankName";

    this.life = args.life || 999999999999;

    this.description = args.description || "__spriteDesc";

    this.opacity = args.opacity || 1.0;

    this.color = args.color || '#ffffff';


    /**
     * @property {String} id the unique identifier of the Sprite --called automatically on constructor.
     * @memberof Sprite
     **********/

    this.id = this.create_id();


    /**
     * @property {Array} animations the array of animations attached to the Sprite
     * @memberof Sprite
     **********/

    var listnames = ['animations', 'bones', 'meshes', 'scripts', 'events', 'sounds'];

    var $object = this;

    listnames.forEach(function(ln) {

      $object[ln] = array_instance(Gamelab.getArg(args, ln, []));

    });


    /**
     * @property {Array} scripts the array of scripts attached to the Sprite
     * @memberof Sprite
     **********/

    this.motions = Gamelab.getArg(args, 'motions', []);

    this.particles = Gamelab.getArg(args, 'particles', []);

    this.shots = Gamelab.getArg(args, 'shots', []);

    this.init_ext = Gamelab.getArg(args, 'init_ext', []);

    this.group = Gamelab.getArg(args, 'group', 'one');

    this.scrollFactor = args.scrollFactor || 1.0;

    this.noScroll = args.noScroll || false;

    if (this.noScroll) {
      this.scrollFactor = 0;
    }


    /**
     * @property {Vector} speed the speed of the Sprite
     * @memberof Sprite
     **********/

    this.speed = new Gamelab.Vector(Gamelab.getArg(args, 'speed', new Gamelab.Vector(0, 0)));

    /**
     * @property {Vector} size the vector-size of the Sprite
     * @memberof Sprite
     **********/

    this.size = new Gamelab.Vector(Gamelab.getArg(args, 'size', new Gamelab.Vector(0, 0)));


    /**
     * @property {Vector} position the position of the Sprite
     * @memberof Sprite
     **********/

    this.position = new Gamelab.Vector(Gamelab.getArg(args, 'position', new Gamelab.Vector(0, 0, 0)));


    this.realPosition = new Gamelab.Vector(Gamelab.getArg(args, 'realPosition', new Gamelab.Vector(0, 0, 0)));

    this.collision_bounds = Gamelab.getArg(args, 'collision_bounds', new Gamelab.VectorBounds(new Gamelab.Vector(0, 0, 0), new Gamelab.Vector(0, 0, 0)));


    /**
     *
     *
     * @property {Vector} rotation the rotation of the Sprite
     * @memberof Sprite
     **********/

    this.rotation = new Gamelab.Vector(Gamelab.getArg(args, 'rotation', new Gamelab.Vector(0, 0, 0)));


    /**
     * @property {number} scale the scale of the Sprite, controls draw-size
     * @memberof Sprite
     **********/

    this.scale = args.scale || 1.0;

    this.acceleration = Gamelab.getArg(args, 'acceleration', new Gamelab.Vector(0, 0, 0));

    this.rot_speed = new Gamelab.Vector(Gamelab.getArg(args, 'rot_speed', new Gamelab.Vector(0, 0)));

    this.rot_accel = new Gamelab.Vector(Gamelab.getArg(args, 'rot_accel', new Gamelab.Vector(0, 0)));

    this.padding = Gamelab.getArg(args, 'padding', new Gamelab.Vector(0, 0, 0));


    var __inst = this;

    //Apply / instantiate Sound(), Gamelab.Motion(), and Gamelab.Animation() args...


    Gamelab.each(this.shots, function(ix, item) {

      __inst.shots[ix] = new Gamelab.Shot(item);

    });

    Gamelab.each(this.sounds, function(ix, item) {

      __inst.sounds[ix] = new Gamelab.Sound(item);

    });

    Gamelab.each(this.motions, function(ix, item) {

      __inst.motions[ix] = new Gamelab.TweenMotion(item);

    });

    Gamelab.each(this.animations, function(ix, item) {

      __inst.animations[ix] = new Gamelab.Animation(item);

    });

    Gamelab.each(this.particles, function(ix, item) {

      __inst.particles[ix] = new Gamelab.GSProton(item);

    });

    //Apply initializers:

    Gamelab.each(this.init_ext, function(ix, item) {

      __inst.addInitializer(item);

    });

    if (!this.selected_animation && args.selected_animation) {

      console.dev('applying animation:' + jstr(args.selected_animation));
      this.selected_animation = new Gamelab.Animation(args.selected_animation);

      this.animations = [];
      if (this.animations.indexOf(this.selected_animation) == -1)
        this.animations.push(this.selected_animation);

    }
  }

  RealPosition() {
    return this.realPosition;
  }

  Origin(x, y) {

    this.origin = new Gamelab.Vector(x, y);

    var sprite = this;

    this.animations.forEach(function($anime) {

      $anime.Origin(sprite.origin);

    });

  }


  /**
   * Clones a sprite from existing data
   *
   * @function
   * @param {Object} object the data to be cloned
   * @memberof Sprite
   **********/

  Clone(sprite) {
    console.log('using Clone() function');

    var clone = new Gamelab.Sprite(sprite.src);

    clone.Anime(new Gamelab.Animation(sprite.anime));

    clone.apply_args(sprite);

    return clone;
  }

  draw(ctx, camera) {

    var sprite;

    if (this.constructor.name == 'SpriteBrush') {
      sprite = this.selected_sprite;
    } else {
      sprite = this;
    }

    camera = camera || false;

    if (!camera && Gamelab.game_windows[0] && Gamelab.game_windows[0].camera)
      camera = Gamelab.game_windows[0].camera;

    else if (!camera) {
      camera = {
        position: new Gamelab.Vector(0, 0, 0)
      };
    }

    if (sprite.active && (this.DRAWOFFSCREEN || sprite.onScreen(Gamelab.WIDTH, Gamelab.HEIGHT))) {
      this.draw_current_frame(ctx, camera);
    }
  }


  draw_current_frame(ctx, camera) {

    var sprite;

    if (this.constructor.name == 'SpriteBrush') {
      sprite = this.selected_sprite;
    } else {
      sprite = this;
    }

    var frame = false,
      frameList = [];

    if (sprite.active) {

      if (sprite.selected_animation instanceof Array && sprite.selected_animation.length >= 1) {
        sprite.selected_animation.forEach(function(anime) {

          frameList.push(anime.selected_frame);

        });
      }

      if (sprite.selected_animation instanceof Object && sprite.selected_animation.hasOwnProperty('selected_frame')) {

        frame = sprite.selected_animation.selected_frame;

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


      //optional animation : gameSize

      var targetSize = sprite.size || sprite.selected_animation.size;

      var realWidth = targetSize.x;
      var realHeight = targetSize.y;


      var origin = sprite.origin || new Gamelab.Vector(realWidth / 2, realHeight / 2);

      //optional animation : offset

      var rotation;

      if (typeof(sprite.rotation) == 'object') {
        rotation = sprite.rotation.x;

      } else {
        rotation = sprite.rotation;
      }

      if(!(sprite.selected_animation && sprite.selected_animation.selected_frame))
      {
        return;
      }

      var frame = sprite.selected_animation.selected_frame;      

      if (frame && frame.image && frame.image.data) {

        ctx.putImageData(frame.image.data, x, y, 0, 0, sprite.size.x, sprite.size.y);

      } else {

        if (frameList.length >= 1) {

          frameList.forEach(function(frame) {

            var realWidth = frame.size.x;
            var realHeight = frame.size.y;

            var xpos = frame.position.x,
              ypos = frame.position.y;

            x += sprite.position.x;
            y += sprite.position.y;

            x -= camera_pos.x * scrollFactor || 0;
            y -= camera_pos.y * scrollFactor || 0;

            sprite.realPosition = new Gamelab.Vector(x, y);

            if (frame.rotation && typeof frame.rotation.x == 'number') {
              rotation = frame.rotation.x;
            }

            if (frame.origin) {
              origin = frame.origin;
              //console.log('drawing with origin:' + origin.x + ':' + origin.y);
            }

            if (frame && frame.image)
              Gamelab.Canvas.draw_image_frame(sprite.effectCanvas ? sprite.effectCanvas : frame.image.domElement, frame.framePos, frame.frameSize, new Gamelab.Vector2D(Math.round(xpos + (origin.x)), Math.round(ypos + (origin.y))), new Gamelab.Vector2D(realWidth, realHeight), rotation % 360, ctx, sprite.flipX, sprite.flipY, origin, this.opacity, this.globalCompositeOperation || false);

          });

        } else {
          var fx = frame.position.x,
            fy = frame.position.y,
            pos = new Gamelab.Vector(x + fx, y + fy);

          pos.x -= camera_pos.x * scrollFactor || 0;
          pos.y -= camera_pos.y * scrollFactor || 0;
          sprite.realPosition = pos;
          if (frame.image.domElement instanceof HTMLImageElement || frame.image.domElement instanceof HTMLCanvasElement) {
            Gamelab.Canvas.draw_image_frame(this.effectCanvas ? this.effectCanvas : frame.image.domElement, frame.framePos, frame.frameSize, new Gamelab.Vector2D(Math.round(pos.x + (origin.x)), Math.round(pos.y + (origin.y))), new Gamelab.Vector2D(realWidth, realHeight), rotation % 360, ctx, sprite.flipX, sprite.flipY, origin, this.opacity, this.globalCompositeOperation || false);
          }

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


  Add(object) {

    if (object instanceof Gamelab.Animation) {
      this.animations.add(object);
    }

    return this;
  }

  get animation() {
    return this.selected_animation;
  }

  get anime() {
    return this.selected_animation;
  }

  Anime(anime) {
    if (anime)
      this.selected_animation = anime;
    return this;
  }


  Animation(anime) {
    if (anime)
      this.selected_animation = anime;
    return this;
  }


  FromData(data = {}, fxlCopy = false) {
    for (var x in data) {
      if (fxlCopy || typeof(data[x]) !== 'function')
        this[x] = data[x];
    }
    return this;
  }

  FromSourceImage(src) {
    return new this.constructor(src);
  }

  /**************************************************************
   * scales the sprite.size property according to image-size.
   * @param {number} scaleFloat a 0-1+ value
   *
   * @function
   * @memberof Sprite
   **************************************************************/

  Scale(scaleFloat) {

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


  ScrollFactor(s) {
    this.scrollFactor = s;

    return this;

  }


  engage(obj) //engages an object having an engage function
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

  Life(v) {

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

  init() {


  }

  /**
   * extends the init function.
   * @function
   * @memberof Sprite
   * @param {function} fun the function to be passed into the init function of the sprite
   **********/

  addInitializer(fun) {

    let boundFun = fun.bind(this)

    if (this.init_ext.indexOf(boundFun) < 0) {

      this.init_ext.push(boundFun)
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

  get_id() {
    return this.id;
  }

  /**********
   * @ignore
   **********/

  to_map_object(size, framesize) {

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

  create_id() {

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

  getSizeByMax(mx, my) {

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

  assertSpeed() {
    if (!this.speed) {
      this.speed = new Gamelab.Vector(0, 0, 0);
    }

  }


  /**
   * set the 'selected_animation' property to a single-frame-animation
   * @function
   * @memberof Sprite
   **********/

  SingleFrame() {

    if (!this.image || !this.image.domElement) {
      return this;
    }

    var __inst = this,
      load = this.image.domElement.onload || function() {};

    if (this.size && this.size.x !== 0 && this.size.y !== 0)
      return;

    var _obj = this;

    if (this.image.domElement instanceof HTMLCanvasElement) {
      if (_obj.size && _obj.size.x !== 0 && _obj.size.y !== 0) {

      } else {
        __inst.size = new Gamelab.Vector(__inst.image.domElement.width, __inst.image.domElement.height);
        __inst.selected_animation = new Gamelab.Animation(this.image.domElement).FrameSize(__inst.size);
        __inst.animations = [];
        __inst.animations.push(__inst.selected_animation);
        __inst.Scale(__inst.scale || 1.0);
      }

      return this;

    }

    this.image.domElement.onload = function() {

      load(false, __inst);

      if (_obj.size && _obj.size.x !== 0 && _obj.size.y !== 0) {

      } else {
        __inst.size = new Gamelab.Vector(__inst.image.domElement.width, __inst.image.domElement.height);
        __inst.selected_animation = new Gamelab.Animation(__inst.image).FrameSize(__inst.size);
        __inst.animations = [];
        __inst.animations.push(__inst.selected_animation);
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

  LifeSpan(value) {
    this.life = value;
  }

  /**
   * set the 'life' property to a specified integer
   * @function
   * @memberof Sprite
   **********/

  Life(value) //same as LifeSpan
  {
    this.life = value;
  }

  /**
   * tells if sprite has been taken out of game
   * @function
   * @memberof Sprite
   **********/

  isDead(gw) {

    gw = gw || Gamelab.game_windows[0];

    return this.hasOwnProperty('life') && this.life <= 0;
  }

  /**
   * sets life to 0, then ending the sprite
   * @function
   * @memberof Sprite
   **********/

  die(gw) {

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

  onScreen(w, h, gw) {

    w = w || Gamelab.WIDTH;

    h = h || Gamelab.HEIGHT;

    gw = gw || Gamelab.game_windows[0];

    var camera = gw && gw.camera ? gw.camera : Gamelab && Gamelab.camera ? Gamelab.camera : {
        position: new Gamelab.Vector(0, 0, 0)
      },
      scrollFactor = this.noScroll ? 0 : this.scrollFactor;

    var sprite = this,

      p = sprite.position,

      camera_pos = camera.position || {
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

    return x + sprite.size.x > -1000 - w && x < w + 1000 &&
      y + sprite.size.y > 0 - 1000 - h && y < h + 1000;

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

  update(sprite) {}

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


  def_update(sprite) {

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

  extendFunc(fun, extendedFunc) {

    console.log('extending func');

    var ef = extendedFunc;

    var __inst = this;

    return function() {

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


  onUpdate(fun) {

    var id = this.create_id();

    fun = fun.bind(this);

    let update = this.update.bind(this);

    let __inst = this;

    this.update = function(__inst) {

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

  travelLineTwoWay(lineObject, speed, curveKey, offset) {

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

    if (__inst.__crtLineIx >= ((line.points.length - 1) / 2)) {
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

  travelLineOnLoop(lineObject, speed, curveKey, offset) {

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

    if (__inst.__crtLineIx >= ((line.points.length - 1) / 2)) {
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

  hasPixelCollision(sprite) {

    if (!TypeCode.truthyPropsPerArray([this, sprite], 'selected_animation'))
      return;

    if (!TypeCode.truthyPropsPerArray([this.selected_animation, sprite.selected_animation], 'getCurrentPixelMap'))
      return;

    let anime = this.selected_animation,
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

  init_pixelCollision() {
    let anime = this.selected_animation;

    this.selectedFramePixelMap = anime.getCurrentPixelMap(anime.scaleOf(this.size));
    this.colliderHighlights = this.colliderHighlights || [];
  }

  init_colliderHighlights(unitMarker) {
    while (this.colliderHighlights.length < 100) {
      var sprite = new Gamelab.Sprite(unitMarker);
      this.colliderHighlights.push(sprite);
      Gamelab.game_windows[0].add(sprite);
    }
  }

  pixelGridOff() {


  }

  set_colliderHighlights(hSprite, on) {
    this.collider_highlightsOn = on || false;

    this.init_pixelCollision();

    this.init_colliderHighlights(hSprite);

    let anime = this.selected_animation;

    for (var x in this.colliderHighlights) {
      this.colliderHighlights[x].active = false;
    }

    if (hSprite && this.collider_highlightsOn)
      for (var x in this.selectedFramePixelMap) {
        if (!this.colliderHighlights[x]) {
          continue;
        }

        let gridPiece = this.selectedFramePixelMap[x];

        let anime_scale = anime.scaleOf(this.size),
          real_gridPiece_pos = gridPiece.position.mult(anime_scale),
          real_gridPiece_size = gridPiece.size.mult(anime_scale);

        this.colliderHighlights[x].Pos(this.position.add(new Gamelab.Vector(real_gridPiece_pos.x, real_gridPiece_pos.y).sub(anime.selected_frame.framePos.mult(anime_scale))));

        this.colliderHighlights[x].Size(real_gridPiece_size);

        this.colliderHighlights[x].active = true;
      };

  }

  onPixelCollision(sprite, callback, highlightSprite) {

    let anime = this.selected_animation;

    this.onUpdate(function() {

      var anime = this.selected_animation;

      if (this.hasPixelCollision(sprite)) {

        if (!this.colliderHighlights) {


        } else
          for (var x in colliderHighlights) {
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

  hasBoxCollision(sprite) {

    return Gamelab.Collision.spriteBoxesCollide(this, sprite);

  }

  onBoxCollision(sprite, callback) {
    this.onUpdate(function() {

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

  shoot(options, gw) {
    //character shoots an animation

    gw = gw || Gamelab.game_windows[0];

    this.prep_key = 'shoot';

    let animation = options.bullet || options.animation || options.anime || new Gamelab.Animation();

    let speed = options.speed || options.velocity || 1;


    let size = options.size || new Gamelab.Vector(10, 10, 0);

    let position = new Gamelab.Vector(options.position) || new Gamelab.Vector(this.position);


    let rot_offset = options.rot_offset || options.rotation || 0;

    let total = options.total || 1;

    let rot_disp = options.rot_disp || 0; //the full rotational-dispersion of the bullets

    let life = options.life || 900;

    var shots = [];

    for (var x = 0; x < total; x++) {

      var __playerInst = this;

      if (Gamelab.isAtPlay) {

        var bx = position.x,
          by = position.y,
          bw = size.x,
          bh = size.y;

        var shot = new Gamelab.Sprite().FromData({

          active: true,

          position: new Gamelab.Vector(position),

          size: new Gamelab.Vector(size),

          speed: speed,

          image: animation.image,

          rotation: new Gamelab.Vector(0, 0, 0),

          flipX: false,

          life: options.life,

          noScroll: true

        });


        shot.Animation(animation);

        rot_offset = new Gamelab.Vector(rot_offset, 0, 0);

        shot.position.x = bx, shot.position.y = by;

        //Danger On this line: annoying math --dispersing rotation of bullets by rot_disp

        var div = rot_disp / total;

        var rotPlus = div * x + div / 2 - rot_disp / 2;

        shot.rotation.x = rot_offset.x + rotPlus;

        //  shot.origin = new Gamelab.Vector(position);

        shot.speed = new Gamelab.Vector(Math.cos((shot.rotation.x) * 3.14 / 180) * speed, Math.sin((shot.rotation.x) * 3.14 / 180) * speed);

        shots.push(shot);

        shot.onUpdate(function(spr) {
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

  subsprite(options, gw) {

    gw = gw || Gamelab.game_windows[0];

    let animation = options.animation || new Gamelab.Animation();

    let position = options.position || new Gamelab.Vector(this.position);

    let offset = options.offset || new Gamelab.Vector(0, 0, 0);

    let size = new Gamelab.Vector(options.size || this.size);

    if (Gamelab.isAtPlay) {

      var subsprite = gw.add(new Gamelab.Sprite().FromData({

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


      subsprite.Animation(animation);

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

  animate(animation) {

    if (Gamelab.isAtPlay) {

      if (animation) {
        this.Animation(animation)
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

  onAnimationComplete(fun) {

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

  accelY(accel, max) {

    accel = Math.abs(accel);

    if (typeof(max) == 'number') {
      max = {
        y: max
      };

    }

    this.assertSpeed();

    let diff = max.y - this.speed.y;

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


  accelX(accel, max) {

    accel = Math.abs(accel);

    if (typeof(max) == 'number') {
      max = {
        x: max
      };

    }

    this.assertSpeed();

    let diff = max.x - this.speed.x;

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

  decelY(amt) {

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

  decelX(amt) {

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

  accel(object, key, accel, max) {

    var prop = object;

    accel = Math.abs(accel);

    if (typeof(max) == 'number') {
      max = {
        x: max
      };
    }

    let speed = prop[key];

    // this.assertSpeed();

    let diff = max.x - prop[key];

    if (diff > 0) {
      prop[key] += Math.abs(diff) >= accel ? accel : diff;

    };

    if (diff < 0) {
      prop[key] -= Math.abs(diff) >= accel ? accel : diff;

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

  decel(prop, key, rate) {

    if (typeof(rate) == 'object') {

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


  seekPosition(target_Position, differential_SpeedMultiple) {
    var target = {};

    //always positive:
    differential_SpeedMultiple = Math.abs(differential_SpeedMultiple);

    if (target_Position.hasOwnProperty('position')) {
      console.log('1st argument had its own position property. Using this property now:');
      target = target_Position.position;
    } else {
      target = target_Position;
    }

    let diff = this.position.sub(target).mult(-1);

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

  SmoothMotion(x, y, duration) {
    if (typeof(x) == 'object') //argument coercion: x is a vector, y is duration
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

    var t = new TWEEN.Tween(this.position)
      .easing(TWEEN.Easing.Quadratic.InOut)

      .to(new Gamelab.Vector(x, y), duration)
      .onUpdate(function() {
        //console.log(objects[0].position.x,objects[0].position.y);


      })
      .onComplete(function() {
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

  SmoothRotate(r, duration) {

    if (!TWEEN instanceof Object) {
      return console.error('TWEEN.js required for SmoothRotate();');
    }

    r = r + this.rotation.x;

    var t = new TWEEN.Tween(this.rotation)
      .easing(TWEEN.Easing.Quadratic.InOut)

      .to(new Gamelab.Vector(r), duration)
      .onUpdate(function() {
        //console.log(objects[0].position.x,objects[0].position.y);


      })
      .onComplete(function() {
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

  center() {

    return new Gamelab.Vector(this.position.x + this.size.x / 2, this.position.y + this.size.y / 2, 0);

  }


  /*****************************
   *  System Use / Collision
   ***************************/


  /*****************************
   * @ignore
   ***************************/

  shortest_stop(item, callback) {

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

  overlap_x(item, padding) {
    if (!padding) {
      padding = 0;
    }

    var p1 = this.position,
      p2 = item.position;
    var paddingX = Math.round(padding * this.size.x),

      paddingY = Math.round(padding * this.size.y),
      left = p2.x + paddingX,
      right = p2.x + this.size.x - paddingX;

    return right > p1.x && left < p1.x + item.size.x;
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

  overlap_y(item, padding) {
    if (!padding) {
      padding = 0;
    }

    var p1 = this.position,
      p2 = item.position;

    var paddingX = Math.round(padding * this.size.x),

      paddingY = Math.round(padding * this.size.y),

      top = p2.y + paddingY,
      bottom = p2.y + this.size.y - paddingY;

    return bottom > p1.y && top < p1.y + item.size.x;

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

  collide_stop_x(item) {

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

  collide_stop(item) {

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

  collide_stop_top(item, callback) {


    if (this.id == item.id) {
      return false;

    }

    if (this.overlap_x(item, this.padding.x + 0.1)) {

      console.log('OVERLAP_X');

      var paddingY = this.padding.y * this.size.y;

      var p1 = this.position,
        p2 = item.position;

      if (p1.y + this.size.y - paddingY <= p2.y) {

        this.groundMaxY = p2.y - this.size.y + paddingY;

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

  restoreFrom(data) {
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

  fromFile(file_path) {

    if (typeof file_path == 'string') {

      var __inst = this;

      $.getJSON(file_path, function(data) {

        __inst = new Gamelab.Sprite(data);

      });
    }
  }

  /*****************************
   * return a decycled json-string for the sprite --without circular references
   * @returns {string} a json string
   ***************************/

  toJSONString() {
    return jstr(JSON.decycle(this));
  }

};

Gamelab.Sprite = Sprite;
;
var getTextHeight = function(font) {

  var text = $('<span>Hg</span>').css({ fontFamily: font });
  var block = $('<div style="display: inline-block; width: 1px; height: 0px;"></div>');

  var div = $('<div></div>');
  div.append(text, block);

  var body = $('body');
  body.append(div);

  try {

    var result = {};

    block.css({ verticalAlign: 'baseline' });
    result.ascent = block.offset().top - text.offset().top;

    block.css({ verticalAlign: 'bottom' });
    result.height = block.offset().top - text.offset().top;

    result.descent = result.height - result.ascent;

  } finally {
    div.remove();
  }

  return result;
};


class Text {

  constructor(value){
    
    this.Text(value);

    this.FontSize(15);
    this.FontFamily('Arial');

    this.color = 'white';

    this.position = new Gamelab.Vector(0, 0);

  }

  Text(t){

    this.text = t;
    this.value = t;
    return this;
  }

  Font(fsize, ffamily){
    this.FontSize(fsize);
    this.FontFamily(ffamily)
    return this;
  }

  FontSize(value){
    if(typeof value !== 'string')
    value = value + '';

    value = value.replace('px', '') + 'px';

    this.fontSize = value;
    return this;
  }
  FontFamily(value)
  {
    this.fontFamily = value;
    return this;
  }


    getOffsetPos(pos){
      var offset = this.window_offset || new Gamelab.Vector(0, 0);
      return pos.add(offset);
    }

  draw(ctx, camera){

    console.log("DRAWING object.text.js");

    var x = this.position.x + camera.position.x,
     y = this.position.y + camera.position.y;

     if(ctx.save)
     {
    ctx.save();
    }

    ctx.fillStyle = this.color;

    ctx.font = this.fontSize + ' ' + this.fontFamily;

    var size = ctx.measureText(this.text);

    this.size = new Gamelab.Vector(size.width, getTextHeight(ctx.font).height);

    var pos = new Gamelab.Vector(x, y),
    realPos = this.getOffsetPos(pos);

    ctx.fillText(this.text, realPos.x, realPos.y);

    ctx.restore();

  }
}


Gamelab.Text = Text;
;/**
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

    class GravityForce {
        constructor(args = {}) {
            this.name = args.name || "";

            this.description = args.description || "";

            this.subjects = args.subjects || [];

            this.clasticObjects = args.clasticObjects || [];

            this.topClastics = args.topClastics || [];

            this.max = args.max || new Gamelab.Vector(3, 3, 3);
            this.accel = args.accel || new Gamelab.Vector(1.3, 1.3, 1.3);


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

        getArg(args, key, fallback) {

            if (args.hasOwnProperty(key)) {
                return args[key];
            }
            else {
                return fallback;

            }
        }


        /**
         * Updates position for all objects effected by this instance.
         * @memberof GravityForce
         */

        update() {

            var subjects = this.subjects;

            var clasticObjects = this.clasticObjects;

            var topClastics = this.topClastics;

            var accel = this.accel || {};

            var max = this.max || {};

            Gamelab.each(subjects, function (ix, itemx) {

                if(!itemx.jumping && !itemx.flying)
                itemx.accelY(accel, max);

                itemx.__inAir = true;


                if (itemx.position.y >= itemx.groundMaxY) {
                    itemx.position.y = itemx.groundMaxY;
                }

                itemx.groundMaxY = 3000000; //some crazy number you'll never reach in-game

                Gamelab.each(topClastics, function (iy, itemy) {

                    itemx.collide_stop_top(itemy);

                });

            });
        }
    };

    let Force = GravityForce;

    Gamelab.Force = Force;

    Gamelab.GForce = Force;

    Gamelab.GravityForce = GravityForce;

})();
;

class Background extends Sprite{
  constructor(){
    super(arguments);
  }
}


Gamelab.Background = Background;
;/**
 * Creates a new BoneSprite.
 *
 * <info-bit>Gamelab.BoneSprite is a container for 2D Animations.
 * -apply Sprite class to create a 2D game-object.
 *
 * BoneSprites are a group of moving animations.</info-bit>
 * <iframe style='width:400px; height:450px; overflow:hidden;' src='../client/examples/js-class/Sprite.html'> </iframe>

 * @param   {string} src the srcPath for the image of the Sprite
 * @param   {number} scale=1.0 the scale to be applied to size of each animation-frame
 *
 * @returns {Sprite} a Gamelab.BoneSprite object
 */

class BoneSprite extends Sprite {
  constructor(src = {}, scale = 1.0) {
    super(src, scale);
    this.bones = [];
  }
  addBone(oncreate) {
    var bone = new Bone(this, this.size);
    oncreate.bind(bone).call();
  }
  draw_current_frame(ctx, camera) {

    var sprite = this;
    var frameList = [];
    if (sprite.active) {

      if (sprite.selected_animation instanceof Array && sprite.selected_animation.length >= 1) {
        sprite.selected_animation.forEach(function(anime) {

          anime.selected_frame.parent = anime;
          frameList.push(anime.selected_frame);

        });
      }

      var origin = sprite.origin || new Gamelab.Vector(0, 0);
      var rotation = sprite.rotation.x;

      frameList.reverse().forEach(function(frame){

        var realWidth = frame.size.x;
        var realHeight = frame.size.y;

        var x = frame.position.x,
          y = frame.position.y;

        if (frame.rotation && typeof frame.rotation.x == 'number') {
          rotation = frame.rotation.x;
        }

        if (frame.origin) {
          origin = frame.origin;
          //console.log('drawing with origin:' + origin.x + ':' + origin.y);
        }

        var frame_offset = new Gamelab.Vector(0, 0);

        if(frame.parent && frame.parent.frameOffset instanceof Gamelab.Vector)
        {
          //console.log('object.bonesprite.js:: frame-parent-offset');
          frame_offset = frame.parent.frameOffset;
        }

        if (frame && frame.image)
          Gamelab.Canvas.draw_image_frame(frame.image.domElement, new Gamelab.Vector(frame.framePos).add(frame_offset), frame.frameSize, new Gamelab.Vector2D(Math.round(x + (origin.x)), Math.round(y + (origin.y))), new Gamelab.Vector2D(realWidth, realHeight), rotation % 360, ctx, sprite.flipX, sprite.flipY, origin);
      });

    }

  }
};

Gamelab.BoneSprite = BoneSprite;
;/**
 * Creates a new SpriteBrush.
 */

class SpriteBrush{
  constructor(onCreate, mode = 'random') {
    this.sprites = [];
    this.overlaySprites = [];
    this.mode = mode;
    this.index = -1;
    this.total = 0;
    this.selected_sprite = {};
    this.id = Gamelab.create_id();
    onCreate = onCreate || function(){};
    onCreate.bind(this);
  }

  addSprite(src, scale, callback) {
    this.sprites.push(new Gamelab.Sprite(src, scale));
    if(callback) callback.bind(this).call();
  }
  addOverlaySprite(src, scale, callback) {
    console.info(`SpriteFill().addOverlay(): --adds an overlay.
      Every overlay must fit with every sourceSprite, matching non-transparent pixels only`);
    this.overlaySprites.push(new Gamelab.Sprite(src, scale));
    if(callback) callback.bind(this).call();
  }

  removeAll(){
    this.sprites = [];
    this.overlaySprites = [];
  }

  next(){
    this.index += 1;
    switch(this.mode.toLowerCase())
    {
        case 'random':
        var index = Math.floor(Math.random() * this.sprites.length);
        this.selected_sprite = this.sprites[index];
        return this.selected_sprite;
        break;

        case 'consecutive':
        this.selected_sprite = this.sprites[this.index % this.sprites.length];
        return this.selected_sprite;
        break;
    }
  }

  Clone(spritebrush)
  {
    var outputSprite = new Gamelab.SpriteBrush();
    outputSprite.id = spritebrush.id;
    var oix = 0;

    spritebrush.sprites.forEach(function(sprite){
        outputSprite.addSprite(sprite.src, sprite.size);
        oix += 1;
    });

    spritebrush.overlaySprites.forEach(function(sprite){
        outputSprite.addOverlaySprite(sprite.src, sprite.size);
        oix += 1;
    });
    return outputSprite;
  }

  FromData(spritebrush)
  {
    var outputSprite = new Gamelab.SpriteBrush();

    outputSprite.id = spritebrush.id;

    var oix = 0;

    spritebrush.sprites.forEach(function(sprite){

        outputSprite.addSprite(sprite.src, sprite.size);

        oix += 1;
    });

    spritebrush.overlaySprites.forEach(function(sprite){

        outputSprite.addOverlaySprite(sprite.src, sprite.size);

        oix += 1;
    });

    return outputSprite;
  }
};

Gamelab.SpriteBrush = SpriteBrush;
;/**
 * Creates a new SpriteFill.
 */

class SpriteFill extends Sprite {
  constructor(src = {}, scale = 1.0) {
    super(src, scale);
    this.sourceSprites = [];
    this.overlaySprites = [];
    this.shape = [];
  }
  //draw function is overwritten to nothing. --limits console errors --todo --complete
  draw() {
    return 0;
  }
  addSprite(src, scale, callback) {
    this.sourceSprites.push(new Gamelab.Sprite(src, scale));
    if(callback) callback.bind(this).call();
  }
  addOverlaySprite(src, scale, callback) {
    console.info(`SpriteFill().addOverlay(): --adds an overlay.
      Every overlay must fit with every sourceSprite, matching non-transparent pixels only`);
    this.overlaySprites.push(new Gamelab.Sprite(src, scale));
    if(callback) callback.bind(this).call();
  }
  SelectionMode(mode) {
    this.selection_mode = mode || this.selected_mode || 'random';
    return this.selection_mode;
  }
  BuildShape(onCreateShape) {
    if(onCreateShape) onCreateShape.bind(this).call();
    return this.shape;
  }
  enclose_rectangle() {
    var rect = new Gamelab.Rectangle(Infinity, Infinity, -Infinity, -Infinity);
    this.shape.forEach(function(point) {
      if (point.x < rect.min.x) {
        rect.min.x = point.x;
      }
      if (point.y < rect.min.y) {
        rect.min.y = point.y;
      }
      if (point.x > rect.max.x) {
        rect.max.x = point.x;
      }
      if (point.y > rect.max.y) {
        rect.max.y = point.y;
      }
    });
    return rect;
  }

  Fill() {

    var bounds = this.enclose_rectangle();

    //step 1: fill the shape with rectangles:

    var tracker = new Gamelab.Vector(),
      sprite = this.sourceSprites[0],
      currentSize = new Gamelab.Vector(sprite.size),
      currentIndex = 0;

    this.offscreenCanvas = new Gamelab.OffscreenCanvas(document.createElement('CANVAS'), bounds.min.x, bounds.min.y);

    var ctx = this.offscreenCanvas.ctx;

    //apply loop through x, y bounds, fill with sprites
    for (var x = bounds.min.x; x < bounds.max.x; x += currentSize.x) {
      for (var y = bounds.min.y; y < bounds.max.y; y += currentSize.y) {
        var nextSprite = new Gamelab.Sprite().FromData(this.sourceSprites[currentIndex]);
        this.sprites.push(nextSprite);
        currentSize = new Gamelab.Vector(nextSprite.size);
        currentIndex += 1;
        nextSprite.onLoad(function() {
          this.draw(ctx);
        });
      }
    }

    return this.offscreenCanvas;

  }

};

Gamelab.SpriteFill = SpriteFill;
;class FeatureSymbol {
  constructor(key) {
    this.key = key || "@NONE";
    this.symbol = Symbol(key);
  }
}

Gamelab.FeatureSymbol = FeatureSymbol;

Gamelab.FeatureInjectors = Gamelab.FeatureInjectors || {};

Gamelab.FeatureInject = function(constructor, args) {

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

        GClassFeatures[y].featureSymbols.hasKey = function(key) {

          for (var x = 0; x < this.length; x++) {
            if (typeof this[x].key !== 'string')
              continue;

            if (this[x].key.indexOf('@') == -1)
              console.error('feature-keys must contain @');

            //  console.log('eval key:' + this[x].key.split('@')[1]);

            if (this[x].key.split('@')[1] == key)
              return true;
          }

          return false;
        };

        GClassFeatures[y].featureSymbols.hasSymbol = function(symbol) {
          for (var x in this) {
            if (this[x].symbol == symbol)
              return true;
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

    var props = TypeCode.getProtoFuncs(Gamelab.FeatureInjectors[x]);

    for (var y = 0; y < props.length; y++) {

      console.log(x + ":" + props[y]);

      for (var z in GClassFeatures)
        if (GClassFeatures[z] && GClassFeatures[z].featureSymbols.hasKey(props[y])) {


          Gamelab.FeatureInjectors[x][props[y]](Gamelab[z].prototype, args);

        }
    }
  }

};


class CssFeatures {

  colored(obj){
    obj.Color = function(c)
    {
      this.color = c;
      return this;
    }
  }

  color_transition(min_color, max_color){
    this.min_color = min_color;
    this.max_color = max_color;
    return this;
  }

  text(obj){
    obj.Text = function(value)
    {
      this.text = value;
      return this;
    }
  }

  opaque(obj){
    obj.Opacity = function(o){
      this.opacity = o;
      return this;
    }
  }
};


class DataFunctions {

  data(obj){

    obj.Name = function(n) {
      this.name = n;
      return this;
    };

    obj.Description = function(d){
      this.description = d;
      return this;
    };

    obj.Context = function(c) {
      this.context = c;
      return this;
    };

    obj.create_id = function(){
      return Gamelab.create_id();
    }
  }
}




/***************************
GeometryFeatures:
  A functional dependency injector
  injects properties and functions according to Symbols
**************************/
class VectorFunctions {
  constructor() {

    this.name = 'VectorFunctionals';

  }

  collideable(obj) {
    obj.collision_callback = function() {};
    obj.onCollide = args.onCollide || function(collideables, callback) {
      if (typeof(collideables) == 'function') {
        callback = collideables;
      }
      this.collision_callback = callback || function() {};
    };
  }

  spatial(obj) {

    obj.Size = function(x, y, z) {

      if (typeof(x) == 'object')
        this.size = new Gamelab.Vector(x);

      else if (!isNaN(x) && !isNaN(y)) //has minimum of numeric x and y
        this.size = new Gamelab.Vector(x, y, z);

      else //use x accross the vector
        this.size = new Gamelab.Vector(x, x, x);

      return this;
    };

    obj.Pos = function(x, y, z) {

      if (typeof(x) == 'object')
        this.position = new Gamelab.Vector(x);

      else if (!isNaN(x) && !isNaN(y)) //has minimum of numeric x and y
        this.position = new Gamelab.Vector(x, y, z);

      else //use x accross the vector
        this.position = new Gamelab.Vector(x, x, x);

      return this;
    };

    obj.Rot = function(x, y, z) {

      if (typeof(x) == 'object')
        this.rotation = new Gamelab.Vector(x);

      else if (!isNaN(x) && !isNaN(y)) //has minimum of numeric x and y
        this.rotation = new Gamelab.Vector(x, y, z);

      else //use x accross the vector
        this.rotation = new Gamelab.Vector(x, x, x);

      return this;
    };

    obj.Position = obj.Pos;

    obj.Rotate = obj.Rot;

    obj.Rotation = obj.Rot;

  }

  posable(obj) {

    obj.Pos = function(x, y, z) {

      if (typeof(x) == 'object')
        this.position = new Gamelab.Vector(x);

      else if (!isNaN(x) && !isNaN(y)) //has minimum of numeric x and y
        this.position = new Gamelab.Vector(x, y, z);

      else //use x accross the vector
        this.position = new Gamelab.Vector(x, x, x);

      return this;
    };

    obj.Position = obj.Pos;

  }

  sizeable(obj) {

    obj.Size = function(x, y, z) {

      if (typeof(x) == 'object')
        this.size = new Gamelab.Vector(x);

      else if (!isNaN(x) && !isNaN(y)) //has minimum of numeric x and y
        this.size = new Gamelab.Vector(x, y, z);

      else //use x accross the vector
        this.size = new Gamelab.Vector(x, x, x);

      return this;
    };

    obj.Position = obj.Pos;

  }

  rotable(obj) {
    obj.Rot = function(x, y, z) {

      if (typeof(x) == 'object')
        this.rotation = new Gamelab.Vector(x);

      else if (!isNaN(x) && !isNaN(y)) //has minimum of numeric x and y
        this.rotation = new Gamelab.Vector(x, y, z);

      else //use x accross the vector
        this.rotation = new Gamelab.Vector(x, x, x);

      if (typeof this.Transpose == 'function') {
        this.Transpose();
      }

      return this;
    };

    obj.Rotate = obj.Rot;

    obj.Rotation = obj.Rot;

  }

  minable(obj) {
    obj.Min = function(x, y, z) {

      if (typeof(x) == 'object')
        this.min = new Gamelab.Vector(x);

      else if (!isNaN(x) && !isNaN(y)) //has minimum of numeric x and y
        this.min = new Gamelab.Vector(x, y, z);

      else //use x accross the vector
        this.min = new Gamelab.Vector(x, x, x);

      return this;
    };

    obj.Minimum = obj.Min;

  }

  maxable(obj) {
    obj.Max = function(x, y, z) {

      if (typeof(x) == 'object')
        this.max = new Gamelab.Vector(x);

      else if (!isNaN(x) && !isNaN(y)) //has minimum of numeric x and y
        this.max = new Gamelab.Vector(x, y, z);

      else //use x accross the vector
        this.max = new Gamelab.Vector(x, x, x);

      return this;
    };

    obj.Maximum = obj.Max;

  }

  boundable(obj) {
    this.minable(obj);

    this.maxable(obj);
  }

  selftransposable(obj) {
    //apply the transposition
    obj.Transpose = function(rotation, position) {

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

  pointarrayflippable(obj) {
    //apply the transposition
    obj.FlipX = function() {

      var middle = Math.floor(this.points.length / 2); //account for FlipX with length of --odd number

      var x, y;

      for (x = this.points.length - 1, y = 0; x > middle, y < middle; x--, y++) {

        var p1 = this.points[x],
          p2 = this.points[y];

        [p1.x, p2.x] = [p2.x, p1.x];

      }

      return this;
    };


    //apply the transposition
    obj.FlipY = function() {

      var middle = Math.floor(this.points.length / 2); //account for FlipX with length of --odd number

      var x, y;

      for (x = this.points.length - 1, y = 0; x > middle, y < middle; x--, y++) {

        var p1 = this.points[x],
          p2 = this.points[y];

        [p1.y, p2.y] = [p2.y, p1.y];

      }

      return this;
    };

  }

  informable(obj, args) {
    obj.name = Gamelab.getArg(args, 'name', "__ObjectName");

    obj.description = Gamelab.getArg(args, 'description', false);

    obj.group = Gamelab.getArg(args, 'group', 'one');
  }

  tweenable(obj) {

    obj.curve_string = obj.curve_string || "linearNone";

    obj.setTweenCurve = function(c) {

      c = c || "linear_none";

      var cps = c.split('_');

      //alert(cps);

      var s1 = cps[0].toLowerCase(),
        s2 = cps[1].toLowerCase();

      var curve = TWEEN.Easing.Linear.None;

      obj.curve_string = 'linear_none'

      Gamelab.each(TWEEN.Easing, function(ix, easing) {

        Gamelab.each(TWEEN.Easing[ix], function(iy, easeType) {

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

    obj.curvesToArray = function() {

      var c = [];

      Gamelab.each(TWEEN.Easing, function(ix, easing) {

        Gamelab.each(easing, function(iy, easeType) {

          if (['in', 'out', 'inout', 'none'].indexOf(iy.toLowerCase()) >= 0) {

            c.push(ix + "_" + iy);

          }

        });

      });

      return c;

    }
  }

};

Gamelab.FeatureInjectors.CssFeatures = new CssFeatures();

Gamelab.FeatureInjectors.VectorFunctions = new VectorFunctions();

Gamelab.FeatureInjectors.DataFunctions = new DataFunctions();
;/**
 * Creates Gamelab.js Canvas: The canvas-renderer for Gamelab games.

 @description
 This Canvas library handles the low-level drawing of Gamelab.Animation objects on HTML5Canvas.
 -Draws Sprites according to their rotation, size, and properties.
 * @returns {CanvasLib} a CanvasLib object.
 */

(function() {

  console.log('CanvasStack class... creating');

  class GamelabCanvas {

    constructor() {

      this.__levelMaker = false;

      //draw is synonymous w/ drawSprite
      this.draw = this.draw_object;
    }

    isStopped() {

      return Gamelab.stopDraw || false;

    }

    arc(p1, p2, options = {}) {

      if (this.isStopped())
        return;


      var ctx = Gamelab.game_windows[0].ctx;

      ctx.strokeStyle = 'aqua';

      ctx.beginPath();
      ctx.arc(p1.x, p1.y, p2.x, p2.y, Math.PI * 2, true);
      ctx.stroke();

    }

    draw_image_frame(image, framePos, frameSize, position, size, rotation, canvasContext, flipX, flipY, origin, globalAlpha, globalComposite) {

      if (this.isStopped())
        return;


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
      } else {

      }

      if (flipY) {

        canvasContext.scale(1, -1);
      } else {

      }

      origin = origin || new Gamelab.Vector(width / 2, height / 2);

      canvasContext.globalAlpha = globalAlpha || 1.0;

      if(globalComposite)
      {
        canvasContext.globalCompositeOperation = globalComposite;
      }

      //draw the image
      canvasContext.drawImage(image, fx, fy, fw, fh, origin.x * (-1), origin.y * (-1), width, height);
      //reset the canvas

      canvasContext.globalAlpha = 1.0

      canvasContext.restore();

    }

    draw_data(x, y, w, h, data, ctx) {

      if (this.isStopped())
        return;


      ctx.putImageData(data, x, y, 0, 0, w, h);

    }
  }


  Gamelab.Canvas = new GamelabCanvas();

  Gamelab.GamelabCanvas = GamelabCanvas;

  class OffscreenCanvasRendering {
    constructor(psuedoImage) {

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
      }

    }

  };

  Gamelab.OffscreenCanvasRendering = OffscreenCanvasRendering;

})();
;if (typeof JSON.decycle !== 'function') {
    JSON.decycle = function decycle(object) {
        "use strict";

        var objects = [],   // Keep a reference to each unique object or array
            paths = [];     // Keep the path to each unique object or array

        return (function derez(value, path) {


            var i,          // The loop counter
                name,       // Property name
                nu;         // The new object or array

            switch (typeof value) {
            case 'object':

                if (!value) {
                    return null;
                }


                for (i = 0; i < objects.length; i += 1) {
                    if (objects[i] === value) {
                        return {$ref: paths[i]};
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
                            nu[name] = derez(value[name],
                                path + '[' + JSON.stringify(name) + ']');
                        }
                    }
                }
                return nu;
            case 'number':
            case 'string':
            case 'boolean':
                return value;
            }
        }(object, '$'));
    };
}

if (typeof JSON.retrocycle !== 'function') {
    JSON.retrocycle = function retrocycle($) {
        "use strict";

        var px =
            /^\$(?:\[(?:\d?|\"(?:[^\\\"\u0000-\u001f]|\\([\\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*\")\])*$/;

        (function rez(value) {

            var i, item, name, path;

            if (value && typeof value === 'object') {
                if (Object.prototype.toString.apply(value) === '[object Array]') {
                    for (i = 0; i < value.length; i += 1) {
                        item = value[i];
                        if (item && typeof item === 'object') {
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
                        if (typeof value[name] === 'object') {
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
        }($));
        return $;
    };
}

var json_stringify = JSON.stringify;

JSON.stringify = function(object, arg2, arg3)
{
  var clean_object = JSON.decycle(object);
  return json_stringify(clean_object, arg2, arg3);
};

var json_parse = JSON.parse;

JSON.parse = function(object, arg2, arg3){
  var retro_object = JSON.retrocycle(object);
  return json_parse(retro_object);
};
;/**
 * @author mrdoob / http://mrdoob.com/
 */


/***************
 *
 * @ignore
 *
 * *****************/

var Stats = function () {

	var mode = 0;

	var container = document.createElement( 'div' );
	container.style.cssText = 'position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000';
	container.addEventListener( 'click', function ( event ) {

		event.preventDefault();
		showPanel( ++ mode % container.children.length );

	}, false );

	//

	function addPanel( panel ) {

		container.appendChild( panel.dom );
		return panel;

	}

	function showPanel( id ) {

		for ( var i = 0; i < container.children.length; i ++ ) {

			container.children[ i ].style.display = i === id ? 'block' : 'none';

		}

		mode = id;

	}

	//

	var beginTime = ( performance || Date ).now(), prevTime = beginTime, frames = 0;

	var fpsPanel = addPanel( new Stats.Panel( 'FPS', '#0ff', '#002' ) );
	var msPanel = addPanel( new Stats.Panel( 'MS', '#0f0', '#020' ) );

	if ( self.performance && self.performance.memory ) {

		var memPanel = addPanel( new Stats.Panel( 'MB', '#f08', '#201' ) );

	}

	showPanel( 0 );

	return {

		REVISION: 16,

		dom: container,

		addPanel: addPanel,
		showPanel: showPanel,

		begin: function () {

			beginTime = ( performance || Date ).now();

		},

		end: function () {

			frames ++;

			var time = ( performance || Date ).now();

			msPanel.update( time - beginTime, 200 );

			if ( time >= prevTime + 1000 ) {

				fpsPanel.update( ( frames * 1000 ) / ( time - prevTime ), 100 );

				prevTime = time;
				frames = 0;

				if ( memPanel ) {

					var memory = performance.memory;
					memPanel.update( memory.usedJSHeapSize / 1048576, memory.jsHeapSizeLimit / 1048576 );

				}

			}

			return time;

		},

		update: function () {

			beginTime = this.end();

		},

		// Backwards Compatibility

		domElement: container,
		setMode: showPanel

	};

};

Stats.Panel = function ( name, fg, bg ) {

	var min = Infinity, max = 0, round = Math.round;
	var PR = round( window.devicePixelRatio || 1 );

	var WIDTH = 80 * PR, HEIGHT = 48 * PR,
			TEXT_X = 3 * PR, TEXT_Y = 2 * PR,
			GRAPH_X = 3 * PR, GRAPH_Y = 15 * PR,
			GRAPH_WIDTH = 74 * PR, GRAPH_HEIGHT = 30 * PR;

	var canvas = document.createElement( 'canvas' );
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	canvas.style.cssText = 'width:80px;height:48px';

	var context = canvas.getContext( '2d' );
	context.font = 'bold ' + ( 9 * PR ) + 'px Helvetica,Arial,sans-serif';
	context.textBaseline = 'top';

	context.fillStyle = bg;
	context.fillRect( 0, 0, WIDTH, HEIGHT );

	context.fillStyle = fg;
	context.fillText( name, TEXT_X, TEXT_Y );
	context.fillRect( GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT );

	context.fillStyle = bg;
	context.globalAlpha = 0.9;
	context.fillRect( GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT );

	return {

		dom: canvas,

		update: function ( value, maxValue ) {

			min = Math.min( min, value );
			max = Math.max( max, value );

			context.fillStyle = bg;
			context.globalAlpha = 1;
			context.fillRect( 0, 0, WIDTH, GRAPH_Y );
			context.fillStyle = fg;
			context.fillText( round( value ) + ' ' + name + ' (' + round( min ) + '-' + round( max ) + ')', TEXT_X, TEXT_Y );

			context.drawImage( canvas, GRAPH_X + PR, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT, GRAPH_X, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT );

			context.fillRect( GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT );

			context.fillStyle = bg;
			context.globalAlpha = 0.9;
			context.fillRect( GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, round( ( 1 - ( value / maxValue ) ) * GRAPH_HEIGHT ) );

		}

	};

};
;/**
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

var TWEEN = TWEEN || (function () {

	var _tweens = [];

	return {

		getAll: function () {

			return _tweens;

		},

		removeAll: function () {

			_tweens = [];

		},

		add: function (tween) {

			_tweens.push(tween);

		},

		remove: function (tween) {

			var i = _tweens.indexOf(tween);

			if (i !== -1) {
				_tweens.splice(i, 1);
			}

		},

		update: function (time, preserve) {

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

})();

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

			if ((_valuesStart[property] instanceof Array) === false) {
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
				if (typeof (end) === 'string') {

					if (end.charAt(0) === '+' || end.charAt(0) === '-') {
						end = start + parseFloat(end, 10);
					} else {
						end = parseFloat(end, 10);
					}
				}

				// Protect against non numeric properties.
				if (typeof (end) === 'number') {
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

					if (typeof (_valuesEnd[property]) === 'string') {
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

		None: function (k) {

			return k;

		}

	},

	Quadratic: {

		In: function (k) {

			return k * k;

		},

		Out: function (k) {

			return k * (2 - k);

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k;
			}

			return - 0.5 * (--k * (k - 2) - 1);

		}

	},

	Cubic: {

		In: function (k) {

			return k * k * k;

		},

		Out: function (k) {

			return --k * k * k + 1;

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k * k;
			}

			return 0.5 * ((k -= 2) * k * k + 2);

		}

	},

	Quartic: {

		In: function (k) {

			return k * k * k * k;

		},

		Out: function (k) {

			return 1 - (--k * k * k * k);

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k * k * k;
			}

			return - 0.5 * ((k -= 2) * k * k * k - 2);

		}

	},

	Quintic: {

		In: function (k) {

			return k * k * k * k * k;

		},

		Out: function (k) {

			return --k * k * k * k * k + 1;

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k * k * k * k;
			}

			return 0.5 * ((k -= 2) * k * k * k * k + 2);

		}

	},

	Sinusoidal: {

		In: function (k) {

			return 1 - Math.cos(k * Math.PI / 2);

		},

		Out: function (k) {

			return Math.sin(k * Math.PI / 2);

		},

		InOut: function (k) {

			return 0.5 * (1 - Math.cos(Math.PI * k));

		}

	},

	Exponential: {

		In: function (k) {

			return k === 0 ? 0 : Math.pow(1024, k - 1);

		},

		Out: function (k) {

			return k === 1 ? 1 : 1 - Math.pow(2, - 10 * k);

		},

		InOut: function (k) {

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			if ((k *= 2) < 1) {
				return 0.5 * Math.pow(1024, k - 1);
			}

			return 0.5 * (- Math.pow(2, - 10 * (k - 1)) + 2);

		}

	},

	Circular: {

		In: function (k) {

			return 1 - Math.sqrt(1 - k * k);

		},

		Out: function (k) {

			return Math.sqrt(1 - (--k * k));

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return - 0.5 * (Math.sqrt(1 - k * k) - 1);
			}

			return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);

		}

	},

	Elastic: {

		In: function (k) {

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);

		},

		Out: function (k) {

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;

		},

		InOut: function (k) {

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

		In: function (k) {

			var s = 1.70158;

			return k * k * ((s + 1) * k - s);

		},

		Out: function (k) {

			var s = 1.70158;

			return --k * k * ((s + 1) * k + s) + 1;

		},

		InOut: function (k) {

			var s = 1.70158 * 1.525;

			if ((k *= 2) < 1) {
				return 0.5 * (k * k * ((s + 1) * k - s));
			}

			return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);

		}

	},

	Bounce: {

		In: function (k) {

			return 1 - TWEEN.Easing.Bounce.Out(1 - k);

		},

		Out: function (k) {

			if (k < (1 / 2.75)) {
				return 7.5625 * k * k;
			} else if (k < (2 / 2.75)) {
				return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
			} else if (k < (2.5 / 2.75)) {
				return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
			} else {
				return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
			}

		},

		InOut: function (k) {

			if (k < 0.5) {
				return TWEEN.Easing.Bounce.In(k * 2) * 0.5;
			}

			return TWEEN.Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;

		}

	}

};

TWEEN.Interpolation = {

	Linear: function (v, k) {

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

	Bezier: function (v, k) {

		var b = 0;
		var n = v.length - 1;
		var pw = Math.pow;
		var bn = TWEEN.Interpolation.Utils.Bernstein;

		for (var i = 0; i <= n; i++) {
			b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
		}

		return b;

	},

	CatmullRom: function (v, k) {

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

		Linear: function (p0, p1, t) {

			return (p1 - p0) * t + p0;

		},

		Bernstein: function (n, i) {

			var fc = TWEEN.Interpolation.Utils.Factorial;

			return fc(n) / fc(i) / fc(n - i);

		},

		Factorial: (function () {

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

		})(),

		CatmullRom: function (p0, p1, p2, p3, t) {

			var v0 = (p2 - p0) * 0.5;
			var v1 = (p3 - p1) * 0.5;
			var t2 = t * t;
			var t3 = t * t2;

			return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (- 3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;

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

    } else if (typeof module !== 'undefined' && typeof exports === 'object') {

        // Node.js
        module.exports = Gamelab;

    } else if (root !== undefined) {

        // Global variable
        root.Gamelab = Gamelab;

    }

})(this);
