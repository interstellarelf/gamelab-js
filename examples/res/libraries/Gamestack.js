'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**@author
 Jordan Blake
 * */

/**@copyright
 Copyright 2018
 **/

/**
 * Main module-object; references all Gamestack classes.
 * */

var Gamestack = {};

var GamestackLibrary = function GamestackLibrary() {

            var lib = {

                        settings: {

                                    DEBUG: false,

                                    gui_mode: true,

                                    recursionCount: 0
                        },

                        defSize: function defSize() {
                                    if (this.WIDTH == 0) {
                                                this.WIDTH = document.body.clientWidth;
                                    }

                                    if (this.HEIGHT == 0) {
                                                this.HEIGHT = document.body.clientHeight;
                                    }
                        },


                        WIDTH: 0,

                        HEIGHT: 0,

                        game_windows: [],

                        all_objects: [],

                        bool_events: [],

                        __gameWindow: {},

                        spriteTypes: [],

                        systemSpriteTypes: ['player', 'enemy', 'background', 'interactive', 'terrain', 'weapon', 'subsprite'],

                        __gameWindowList: [],

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

                                    if (Gamestack.DEBUG) {
                                                console.info('Info:' + m);
                                    }
                        },

                        log: function log(m) {

                                    if (Gamestack.DEBUG) {
                                                console.log('Gamestack:' + m);
                                    }
                        },

                        Modifiers: {
                                    collideable: function collideable(obj, args) {

                                                obj.collision_callback = function () {};

                                                obj.onCollide = args.onCollide || function (collideables, callback) {
                                                            if (typeof collideables == 'function') {
                                                                        callback = collideables;
                                                            }

                                                            this.collision_callback = callback || function () {};
                                                };
                                    },
                                    spatial: function spatial(obj) {
                                                obj.Size = function (x, y, z) {

                                                            if ((typeof x === 'undefined' ? 'undefined' : _typeof(x)) == 'object') this.size = new Gamestack.Vector(x);else if (!isNaN(x) && !isNaN(y)) //has minimum of numeric x and y
                                                                        this.size = new Gamestack.Vector(x, y, z);else //use x accross the vector
                                                                        this.size = new Gamestack.Vector(x, x, x);

                                                            return this;
                                                };

                                                obj.Pos = function (x, y, z) {

                                                            if ((typeof x === 'undefined' ? 'undefined' : _typeof(x)) == 'object') this.position = new Gamestack.Vector(x);else if (!isNaN(x) && !isNaN(y)) //has minimum of numeric x and y
                                                                        this.position = new Gamestack.Vector(x, y, z);else //use x accross the vector
                                                                        this.position = new Gamestack.Vector(x, x, x);

                                                            return this;
                                                };

                                                obj.Rot = function (x, y, z) {

                                                            if ((typeof x === 'undefined' ? 'undefined' : _typeof(x)) == 'object') this.rotation = new Gamestack.Vector(x);else if (!isNaN(x) && !isNaN(y)) //has minimum of numeric x and y
                                                                        this.rotation = new Gamestack.Vector(x, y, z);else //use x accross the vector
                                                                        this.rotation = new Gamestack.Vector(x, x, x);

                                                            return this;
                                                };

                                                obj.Position = obj.Pos;

                                                obj.Rotate = obj.Rot;

                                                obj.Rotation = obj.Rot;
                                    },
                                    posable: function posable() {

                                                obj.Pos = function (x, y, z) {

                                                            if ((typeof x === 'undefined' ? 'undefined' : _typeof(x)) == 'object') this.position = new Gamestack.Vector(x);else if (!isNaN(x) && !isNaN(y)) //has minimum of numeric x and y
                                                                        this.position = new Gamestack.Vector(x, y, z);else //use x accross the vector
                                                                        this.position = new Gamestack.Vector(x, x, x);

                                                            return this;
                                                };

                                                obj.Position = obj.Pos;
                                    },
                                    rotable: function rotable() {
                                                obj.Rot = function (x, y, z) {

                                                            if ((typeof x === 'undefined' ? 'undefined' : _typeof(x)) == 'object') this.rotation = new Gamestack.Vector(x);else if (!isNaN(x) && !isNaN(y)) //has minimum of numeric x and y
                                                                        this.rotation = new Gamestack.Vector(x, y, z);else //use x accross the vector
                                                                        this.rotation = new Gamestack.Vector(x, x, x);

                                                            return this;
                                                };

                                                obj.Rotate = obj.Rot;

                                                obj.Rotation = obj.Rot;
                                    },
                                    informable: function informable(obj, args) {
                                                obj.name = Gamestack.getArg(args, 'name', "__ObjectName");

                                                obj.description = Gamestack.getArg(args, 'description', false);

                                                obj.group = Gamestack.getArg(args, 'group', 'one');
                                    },
                                    tweenable: function tweenable(obj, args) {

                                                obj.curve_string = args.curve_string || "linearNone";

                                                obj.setTweenCurve = function (c) {

                                                            c = c || "linear_none";

                                                            var cps = c.split('_');

                                                            //alert(cps);

                                                            var s1 = cps[0].toLowerCase(),
                                                                s2 = cps[1].toLowerCase();

                                                            var curve = TWEEN.Easing.Linear.None;

                                                            obj.curve_string = 'linear_none';

                                                            Gamestack.each(TWEEN.Easing, function (ix, easing) {

                                                                        Gamestack.each(TWEEN.Easing[ix], function (iy, easeType) {

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

                                                            Gamestack.each(TWEEN.Easing, function (ix, easing) {

                                                                        Gamestack.each(easing, function (iy, easeType) {

                                                                                    if (['in', 'out', 'inout', 'none'].indexOf(iy.toLowerCase()) >= 0) {

                                                                                                c.push(ix + "_" + iy);
                                                                                    }
                                                                        });
                                                            });

                                                            return c;
                                                };
                                    },
                                    applyParentalArgs: function applyParentalArgs(obj, args) {

                                                if (args.parent instanceof Gamestack.Sprite) {
                                                            alert('parent was Sprite()');

                                                            obj.parent = args.parent;

                                                            obj.parent_id = obj.parent.id;
                                                } else {
                                                            obj.parent_id = args.parent_id || args.object_id || "__blank"; //The parent object

                                                            obj.parent = Gamestack.getObjectById(obj.parent_id);
                                                }

                                                return obj.parent;
                                    }
                        },

                        Collision: {
                                    basicBoxCollide: function basicBoxCollide(pos1, size1, pos2, size2) {
                                                return pos1.x >= pos2.x - size1.x && pos1.x <= pos2.x + size2.x && pos1.y >= pos2.y - size1.y && pos1.y <= pos2.y + size2.y;
                                    },
                                    spriteRectanglesCollide: function spriteRectanglesCollide(obj1, obj2, gw) {
                                                gw = gw || Gamestack.game_windows[0];

                                                var camPos = new Gamestack.Vector(0, 0, 0);

                                                obj1.padding = obj1.padding || new Gamestack.Vector(0, 0, 0);

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
                                    pixelsCollide: function pixelsCollide(sourceSprite, targetSprite, gw) {
                                                gw = gw || Gamestack.game_windows[0];

                                                var camPos = new Gamestack.Vector(0, 0, 0);

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
                                                console.log('Gamestack:EXTENDING EVENTS:' + extendedKey + ":" + extendorKey);

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

                                    gw = gw || Gamestack.game_windows[0];

                                    Gamestack.each(Gamestack.all_objects, function (ix, item) {

                                                if (item instanceof Gamestack.Sprite && item.onScreen() == false && !item.__keepAlive && !item.keepAlive) {

                                                            gw.remove(item);
                                                }
                                    });
                        },

                        removeDeadObjects: function removeDeadObjects(gw) {

                                    gw = gw || Gamestack.game_windows[0];

                                    Gamestack.each(Gamestack.all_objects, function (ix, item) {

                                                if (item instanceof Gamestack.Sprite && item.isDead()) {

                                                            // console.log('removing:' + item.image.domElement.src);
                                                            gw.remove(item);
                                                }
                                    });
                        },

                        getGameWindow: function getGameWindow() {

                                    return this._gameWindow;
                        },

                        assignAll: function assignAll(object, args, keys) {

                                    __gamestackInstance.each(keys, function (ix, item) {

                                                object[ix] = args[ix];
                                    });
                        },

                        each: function each(list, onResult, onComplete) {
                                    for (var i in list) {
                                                onResult(i, list[i]);
                                    }

                                    if (typeof onComplete === 'function') {
                                                onComplete(false, list);
                                    }
                                    ;
                        },

                        ready_callstack: [],

                        ready: function ready(callback) {

                                    this.ready_callstack.push(callback);
                        },

                        reload: function reload() {
                                    this.callReady();
                        },

                        callReady: function callReady() {

                                    var funx = this.ready_callstack;

                                    var gameWindow = this._gameWindow,
                                        lib = this,
                                        objects = this.__gameWindow.objects;

                                    //call every function in the ready_callstack


                                    this.each(funx, function (ix, call) {

                                                call(lib, gameWindow, objects);
                                    });

                                    this.InputSystem.init();

                                    this.__running = true;
                        },

                        getArg: function getArg(args, keys, fallback) {

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
                        },

                        normalArgs: function normalArgs(args) {

                                    var a = {};

                                    function normal(str) {
                                                return str.toLowerCase().replace('-', '').replace(' ', '').replace('_', '');
                                    };

                                    for (var x in args) {
                                                a[normal(x)] = args[x];
                                    }

                                    return a;
                        },

                        isNormalStringMatch: function isNormalStringMatch(str1, str2) {

                                    return str1.toLowerCase().replace(' ', '') == str2.toLowerCase().replace(' ', '');
                        },

                        instance_type_pairs: function instance_type_pairs() {

                                    //get an array of all instance/type pairs added to the library

                                    //example : [ {constructor_name:Sprite, type:enemy_basic}, {constructor_name:Animation, type:enemy_attack}  ];

                                    var objectList = [];

                                    this.each(this.all_objects, function (ix, item) {

                                                objectList.push({ constructor_name: item.constructor.name, type: item.type });
                                    });

                                    return objectList;
                        },

                        getById: function getById(id) {

                                    for (var x in this.all_objects) {
                                                if (this.all_objects[x].id == id) {
                                                            return this.all_objects[x];
                                                }
                                    }
                        },

                        select: function select(constructor_name, name, group /*ignoring spaces and CAPS/CASE on type match*/) {

                                    var objects_out = [];

                                    var __inst = this;

                                    this.each(this.all_objects, function (ix, item) {

                                                if (constructor_name == '*' || item.constructor.name == constructor_name) {

                                                            if (group == '*' || __inst.isNormalStringMatch(group, item.group)) {

                                                                        if (name == '*' || __inst.isNormalStringMatch(name, item.name)) {

                                                                                    objects_out.push(item);
                                                                        }
                                                            }
                                                }
                                    });

                                    return objects_out;
                        }
            };

            return lib;
};

var GamestackApi = {
            get: function get() {},

            post: function post(object) {
                        //TODO decycle the object before saving

                        if (!object.id) {
                                    object.id = Gamestack.create_id();
                        }

                        var name = object.name,
                            type = object.constructor.name,
                            contents = jstr(object),
                            id = object.id;
            }

};

var log = function log(str) {

            console.log(str);
};

var GSO //Gamestack-Overrideable
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
                        key: 'onRun',
                        value: function onRun(caller, callkey) {
                                    this.run_ext = this.run_ext || [];

                                    if (this.run_ext.indexOf(caller[callkey]) == -1) {
                                                this.run_ext.push({ caller: caller, callkey: callkey });
                                    }
                        }
            }, {
                        key: 'onComplete',
                        value: function onComplete(caller, callkey) {
                                    this.complete_ext = this.complete_ext || [];

                                    if (this.complete_ext.indexOf(caller[callkey]) == -1) {
                                                this.complete_ext.push({ caller: caller, callkey: callkey });
                                    }
                        }
            }, {
                        key: 'call_on_run',
                        value: function call_on_run() {
                                    //call any function extension that is present
                                    for (var x = 0; x < this.run_ext.length; x++) {
                                                this.run_ext[x].caller[this.run_ext[x].callkey]();
                                    }
                        }
            }, {
                        key: 'call_on_complete',
                        value: function call_on_complete() {
                                    //call any function extension that is present
                                    for (var x = 0; x < this.complete_ext.length; x++) {
                                                this.complete_ext[x].caller[this.complete_ext[x].callkey]();
                                    }
                        }
            }]);

            return GSO;
}();

/**
 * A an extended game-image object. Creates GameImage, attaches gameImage.domElement --an instance of HTMLImageElement
 * @param   {string} src the sourcePath of the image-file.
 * @returns {GameImage} a Gamestack.GameImage object.
 * */

var GameImage = function () {
            function GameImage(src, onCreate) {
                        _classCallCheck(this, GameImage);

                        // Gamestack.log('initializing image');

                        if (!src || src instanceof String && !['.jpg', '.png', '.gif'].indexOf(src.toLowerCase()) >= 0) {
                                    console.info('Requested an UNDEFINED or Non-Image-File for image src');
                                    return {};
                        }

                        if (src instanceof Object && src.src) {

                                    //alert('getting image from image');

                                    this.image = document.createElement('IMG');

                                    this.image.src = src.src;

                                    this.src = src.src;
                        } else if (typeof src == 'string') {

                                    var ext = src.substring(src.lastIndexOf('.'), src.length);

                                    this.image = document.createElement('IMG');

                                    this.image.src = src;

                                    this.src = this.image.src;
                        }

                        if (!this.image) {
                                    this.image = { error: "Image not instantiated, set to object by default" };

                                    return {};
                        } else {
                                    this.image.onerror = function () {
                                                this.__error = true;
                                    };
                        }

                        this.domElement = this.image;

                        if (src.data || src.image && src.image.data) {
                                    console.info('GameImage() : found and applied image.data');
                                    this.data = src.data;
                        }
            }

            _createClass(GameImage, [{
                        key: 'getImage',
                        value: function getImage() {
                                    return this.image;
                        }
            }]);

            return GameImage;
}();

//Gamestack: a main / game lib object::
//TODO: fix the following set of mixed references:: only need to refer to (1) lib-object-instance


Gamestack = new GamestackLibrary();

var __gamestackInstance = Gamestack;

Gamestack.Sound = Sound;
Gamestack.GameImage = GameImage;

if (typeof module !== 'undefined' && module.exports) {

            //This library is being instaniated via require() aka node.js require or similar library loader
            module.exports = Gamestack;
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

Gamestack.jstr = jstr;

/**********
 * $Q : Selector Function
 *  -allows string-based-selection of game-objects.
 * **********/

function $Q(selector) {

            //declare events:

            var $GFunx = {};

            $GFunx.each = function (callback) {

                        var objects = [];

                        for (var x = 0; x < this.length; x++) {
                                    if (typeof x == 'number') {

                                                callback(x, this[x]);
                                    }
                        }
            };

            $GFunx.on = function (evt_key, selectorObject, controller_ix, callback) //handle each event such as on('collide') OR on('stick_left_0') << first controller stick_left
            {

                        if (typeof evt_key == 'function' && typeof selectorObject == 'function') {
                                    //this is a special pattern of if(f() == true){ runFunction(); };

                                    var boolTrigger = evt_key,
                                        boolCall = selectorObject,
                                        boolEvent = new Gamestack.BoolEvent().On(boolTrigger).Call(boolCall);
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

                        //if controller_ix is function, and callback not present, then selectorObject is the callback aka optional argument

                        if (selectorObject && typeof selectorObject == 'function' && !callback) {

                                    callback = selectorObject;

                                    selectorObject = $Q('*');

                                    controller_ix = 0;
                        }
                        ;

                        var evt_profile = {};

                        //which controller?

                        evt_profile.cix = controller_ix;

                        //Need the control key: 'left_stick', 'button_0', etc..

                        evt_profile.evt_key = evt_key;

                        if ($Q.contains_any(['stick', 'button', 'click', 'key'], evt_profile.evt_key)) {

                                    var button_mode = evt_profile.evt_key.indexOf('button') >= 0;

                                    Gamestack.GamepadAdapter.on(evt_profile.evt_key, 0, function (x, y) {

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
                                                                                                }
                                                                                                ;
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

                                                console.info('Gamestack:Processing condition with:' + condition);

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

            var object_out = new Object();

            //handle selector / selection of objects:

            if (typeof selector !== 'string') {

                        if ((typeof selector === 'undefined' ? 'undefined' : _typeof(selector)) !== 'object') {
                                    selector = {};
                        }

                        object_out = selector;
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

                                    object_out = Gamestack.select(__targetClassName, __targetName, __targetGroup);
                        } else if (selector == '*') {
                                    object_out = Gamestack.all_objects;
                        }
            }

            for (var x in $GFunx) {

                        object_out[x] = $GFunx[x];
            }
            ;

            return object_out;
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
 *
 *  Developer's own test-function:
 *      -Q.test_selector_method():
 *
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

Gamestack.$Q = $Q;

Gamestack.query = $Q;

/********************
 * Gamestack.InputSystem
 * Various Keyboard + mouse Input Events
 ********************/

Gamestack.InputSystem = {

            //PC input events

            events: {

                        mousemove: [],
                        leftclick: {},
                        rightclick: {},
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

                        Gamestack.InputSystem.keymap[evt_key] = {

                                    down: false,

                                    callback: function callback() {
                                                _callback(evt_key);
                                    }

                        };

                        return Gamestack.InputSystem.keymap[evt_key];
            },

            extend: function extend(evt_key, downCall, upCall, onFinish) {

                        evt_key = evt_key.toLowerCase();

                        Gamestack.InputSystem[evt_key] = {

                                    down: downCall,

                                    up: upCall

                        };

                        return Gamestack.InputSystem[evt_key];
            },

            init: function init() {

                        window.setInterval(function () {

                                    Gamestack.each(Gamestack.InputSystem.keymap, function (im, kmapItem) {

                                                if (kmapItem.down == true) {

                                                            kmapItem.callback();
                                                }
                                    });
                        }, 10);

                        document.onkeydown = document.onkeyup = function (e) {

                                    e = e || event; // to deal with IE

                                    var gs_key_string = 'key_' + String.fromCharCode(e.keyCode),
                                        evt_object = Gamestack.InputSystem['keymap'][gs_key_string] || Gamestack.InputSystem['keymap'][gs_key_string.toLowerCase()];

                                    if (evt_object) {
                                                evt_object.down = e.type == 'keydown';
                                    }
                        };

                        var canvases = document.getElementsByTagName('CANVAS');

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
                                    return { x: x, y: y };
                        }

                        function fullMoveInputSystem(event, c) {

                                    var pos = getMousePos(event, c);
                                    var InputSystem = Gamestack.InputSystem;
                                    for (var x in InputSystem.events) {

                                                if (InputSystem.events[x] instanceof Array && x == 'mousemove') {

                                                            Gamestack.each(InputSystem.events[x], function (ix, el) {

                                                                        el.down(pos.x, pos.y);
                                                            });
                                                }
                                    }
                        }
                        ;

                        for (var x = 0; x < canvases.length; x++) {
                                    var applyMouseMove = function applyMouseMove(e) {
                                                fullMoveInputSystem(e, c);
                                    };

                                    var c = canvases[x];

                                    document.addEventListener("mousemove", applyMouseMove);

                                    c.onmousedown = function (e) {

                                                //    alert(JSON.stringify(Gamestack.InputSystem, true, 2));

                                                var value = e.which;
                                                var pos = getMousePos(e, c);
                                                var InputSystem = Gamestack.InputSystem;

                                                e.preventDefault();

                                                switch (e.which) {
                                                            case 1:

                                                                        for (var x in InputSystem.events) {

                                                                                    if (InputSystem.events[x] instanceof Array && x == 'leftclick') {

                                                                                                Gamestack.each(InputSystem.events[x], function (ix, el) {

                                                                                                            el.down(pos.x, pos.y);
                                                                                                });
                                                                                    }
                                                                        }

                                                                        break;
                                                            case 2:
                                                                        // alert('Middle Mouse button pressed.');


                                                                        for (var x in Gamestack.InputSystem.events) {

                                                                                    if (InputSystem.events[x] instanceof Array && x == 'middleclick') {

                                                                                                Gamestack.each(InputSystem.events[x], function (ix, el) {

                                                                                                            el.down(pos.x, pos.y);
                                                                                                });
                                                                                    }
                                                                        }
                                                                        break;
                                                            case 3:
                                                                        //  alert('Right Mouse button pressed.');


                                                                        for (var x in Gamestack.InputSystem.events) {

                                                                                    if (InputSystem.events[x] instanceof Array && x == 'rightclick') {

                                                                                                Gamestack.each(InputSystem.events[x], function (ix, el) {

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

                                                //    alert(JSON.stringify(Gamestack.InputSystem, true, 2));

                                                var value = e.which;
                                                var pos = getMousePos(e, c);
                                                var InputSystem = Gamestack.InputSystem;

                                                e.preventDefault();

                                                switch (e.which) {
                                                            case 1:

                                                                        for (var x in InputSystem.events) {

                                                                                    if (InputSystem.events[x] instanceof Array && x == 'leftclick') {

                                                                                                Gamestack.each(InputSystem.events[x], function (ix, el) {

                                                                                                            el.up(pos.x, pos.y);
                                                                                                });
                                                                                    }
                                                                        }

                                                                        break;
                                                            case 2:
                                                                        // alert('Middle Mouse button pressed.');


                                                                        for (var x in Gamestack.InputSystem.events) {

                                                                                    if (InputSystem.events[x] instanceof Array && x == 'middleclick') {

                                                                                                Gamestack.each(InputSystem.events[x], function (ix, el) {

                                                                                                            el.up(pos.x, pos.y);
                                                                                                });
                                                                                    }
                                                                        }
                                                                        break;
                                                            case 3:
                                                                        //  alert('Right Mouse button pressed.');


                                                                        for (var x in Gamestack.InputSystem.events) {

                                                                                    if (InputSystem.events[x] instanceof Array && x == 'rightclick') {

                                                                                                Gamestack.each(InputSystem.events[x], function (ix, el) {

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
window.onload = function () {
            Gamestack.callReady();
};

Gamestack.file_system = {

            localizedSource: function localizedSource(src, hostUrl) {

                        hostUrl = hostUrl || "../";

                        var gs_folder_ix = src.indexOf('assets/game');

                        return hostUrl + src.substring(gs_folder_ix, src.length);
            },

            loadJSON: function loadJSON(filepath, callback) {

                        $.getJSON(filepath, function (data) {

                                    callback(false, data);
                        });
            },

            loadJSONLevel: function loadJSONLevel(filepath, gw, callback) {

                        if (typeof gw == 'function' || !gw) {
                                    callback = gw || callback || function () {};

                                    gw = Gamestack.game_windows[0];
                        }

                        $.getJSON(filepath, function (data) {

                                    //localize .src up to three levels of recursion (.src must be altered to refer locally)

                                    $.each(data.sprites, function (ix, xitem) {

                                                if (typeof xitem.src == 'string') {

                                                            xitem.src = Gamestack.file_system.localizedSource(xitem.src);
                                                }

                                                __gamestackInstance.each(xitem, function (iy, yitem) {

                                                            if (yitem.src) {

                                                                        yitem.src = Gamestack.file_system.localizedSource(yitem.src);
                                                            }

                                                            __gamestackInstance.each(yitem, function (iz, zitem) {

                                                                        if (zitem.src) {
                                                                                    zitem.src = Gamestack.file_system.localizedSource(zitem.src);
                                                                        }
                                                            });
                                                });

                                                xitem = new Gamestack.Sprite(xitem);

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

Gamestack.ready(function (lib) {

            Gamestack.log('Gamestack: library is ready');
});

;

var Typo = {
            MakeArray: function MakeArray(obj) //obj is type or is encapsulated into type
            {
                        if (obj instanceof Array) {
                                    return obj;
                        } else {
                                    obj = [obj];
                        }
                        return obj;
            },
            Convert: function Convert(obj, type) //obj is type or is each-converted into type
            {
                        if (obj instanceof type) {
                                    return obj;
                        } else {
                                    obj = [obj];
                        }
                        return obj;
            },
            TypeHalt: function TypeHalt(obj, type) //obj is type or error is thrown
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
            TypeError: function TypeError(obj, type) //obj is type or error is logged, execution continues
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
            Restore: function Restore() {},
            Datify: function Datify() {},
            Decycle: function Decycle() {},
            Clone: function Clone() {},
            TagByType: function TagByType() {},
            MergeByType: function MergeByType() {},
            MergeByKeys: function MergeByKeys() {}
};

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
             * var multiFrameAnime = new Gamestack.Animation('../images/characters/full/spaceman1.png') //constructor is called
             * .FrameSize(130, 130)
             * .FrameBounds(new Gamestack.Vector(9, 0), new Gamestack.Vector(23, 0), new Gamestack.Vector(23, 0))
             * .Seesaw() //The Animation will play back-and-forth repeatedly (cycle through frames forwards, then backwards and so on.
             * .Duration(900); //Animation lasts 900 millis OR just under 1 second
             *
             */

            var Animation = function () {
                        function Animation() {
                                    var src = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                                    _classCallCheck(this, Animation);

                                    var args = (typeof src === 'undefined' ? 'undefined' : _typeof(src)) == 'object' ? src : {};

                                    Gamestack.Modifiers.informable(this, args);

                                    if (typeof src == 'string') {

                                                console.log('setting GameImage with string:' + src);
                                                this.src = src;
                                                this.image = new Gamestack.GameImage(src);
                                                if (!args.frameBounds) this.setToSingleFrame();
                                    } else if (args instanceof GameImage) {
                                                console.log('Animation(): args are an instance of GameImage');

                                                this.image = args;
                                    } else if (args instanceof HTMLImageElement) {
                                                console.log('Animation(): args was an instance of HTMLImageElement');

                                                this.image = new Gamestack.GameImage(args);
                                    } else if (args instanceof Gamestack.Animation) {

                                                this.image = args.image;
                                    } else if ((typeof args === 'undefined' ? 'undefined' : _typeof(args)) == 'object' && args.src) {
                                                this.src = args.src;
                                                this.image = new Gamestack.GameImage(args.src);
                                    }

                                    this.frameSize = this.frameSize || new Gamestack.Vector(args.frameSize || new Gamestack.Vector(0, 0));

                                    if (args.frameBounds && args.frameBounds.min && args.frameBounds.max) {

                                                this.frameBounds = new Gamestack.VectorFrameBounds(args.frameBounds.min, args.frameBounds.max, args.frameBounds.termPoint);
                                    } else {

                                                this.frameBounds = new Gamestack.VectorFrameBounds(new Gamestack.Vector(0, 0, 0), new Gamestack.Vector(0, 0, 0), new Gamestack.Vector(0, 0, 0));
                                    }

                                    this.frameOffset = this.getArg(args, 'frameOffset', new Gamestack.Vector(0, 0, 0));

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

                        /**
                         * sets this Animation to a single-frame-animation, from existing image
                         * @function
                         * @memberof Animation
                         **********/

                        _createClass(Animation, [{
                                    key: 'setToSingleFrame',
                                    value: function setToSingleFrame() {

                                                var __inst = this;

                                                this.image.domElement.onload = function () {
                                                            if (!__inst.__isInit) __inst.FrameSize(__inst.image.domElement.width, __inst.image.domElement.height).FrameBounds(new Gamestack.Vector(0, 0), new Gamestack.Vector(0, 0));

                                                            __inst.run();
                                                };

                                                Gamestack.log('Animation():set single-frame animation');

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
                                    key: 'onRun',
                                    value: function onRun(call) {

                                                if (this.run_ext.indexOf(call) == -1) {
                                                            this.run_ext.push(call);
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
                                    key: 'onComplete',
                                    value: function onComplete(call) {

                                                if (this.complete_ext.indexOf(call) == -1) {
                                                            this.complete_ext.push(call);
                                                }
                                    }
                        }, {
                                    key: 'call_on_run',
                                    value: function call_on_run() {
                                                //call any function extension that is present
                                                for (var x = 0; x < this.run_ext.length; x++) {
                                                            this.run_ext[x](this);
                                                }
                                    }
                        }, {
                                    key: 'call_on_complete',
                                    value: function call_on_complete() {
                                                //call any function extension that is present
                                                for (var x = 0; x < this.complete_ext.length; x++) {
                                                            this.complete_ext[x](this);
                                                }
                                    }
                        }, {
                                    key: 'FrameSize',
                                    value: function FrameSize(w, h) {
                                                this.frameSize = new Gamestack.Vector(w, h);

                                                this.__isInit = true;

                                                this.run();

                                                return this;
                                    }
                        }, {
                                    key: 'FrameBounds',
                                    value: function FrameBounds(minVector, maxVector, termVector) {
                                                this.frameBounds = new Gamestack.VectorFrameBounds(minVector, maxVector, termVector);

                                                this.__isInit = true;

                                                this.run();

                                                return this;
                                    }
                        }, {
                                    key: 'Seesaw',
                                    value: function Seesaw() {
                                                if (!this.seesaw_mode) {

                                                            this.seesaw_mode = true;
                                                }

                                                return this;
                                    }
                        }, {
                                    key: 'Duration',
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
                                    key: 'reverseFrames',
                                    value: function reverseFrames() {

                                                this.frames.reverse();
                                    }

                                    /**
                                     * Declares the animation a a single frame / full-image.
                                     *
                                     * @function
                                     * @param {Vector} frameSize optional size param
                                     * @memberof Animation
                                     **********/

                        }, {
                                    key: 'SingleFrame',
                                    value: function SingleFrame() {

                                                this.__frametype = 'single';

                                                this.frameSize = new Gamestack.Vector(this.image.domElement.width, this.image.domElement.height);

                                                this.frameBounds = false;

                                                this.selected_frame = new Gamestack.Frame().Image(this.image).Size(this.frameSize);

                                                this.frames = [];

                                                this.frames[0] = this.selected_frame;

                                                return this;
                                    }
                        }, {
                                    key: 'getArg',
                                    value: function getArg(args, key, fallback) {

                                                if (args.hasOwnProperty(key)) {

                                                            return args[key];
                                                } else {
                                                            return fallback;
                                                }
                                    }
                        }, {
                                    key: 'apply2DFrames',
                                    value: function apply2DFrames() {

                                                this.frames = [];

                                                var fcount = 0;

                                                var quitLoop = false;

                                                for (var y = this.frameBounds.min.y; y <= this.frameBounds.max.y; y++) {

                                                            for (var _x3 = this.frameBounds.min.x; _x3 <= this.frameBounds.max.x; _x3++) {

                                                                        var framePos = {
                                                                                    x: _x3 * this.frameSize.x + this.frameOffset.x,
                                                                                    y: y * this.frameSize.y + this.frameOffset.y
                                                                        };

                                                                        var f = new Gamestack.Frame().Image(this.image).Size(this.frameSize).Position(framePos);

                                                                        this.frames.push(f);

                                                                        if (_x3 >= this.frameBounds.termPoint.x && y >= this.frameBounds.termPoint.y) {

                                                                                    quitLoop = true;

                                                                                    break;
                                                                        }

                                                                        fcount += 1;

                                                                        if (quitLoop) break;
                                                            }
                                                }

                                                this.frames[0] = this.selected_frame = this.frames[0] || new Gamestack.Frame().Image(this.image).Size(this.frameSize);

                                                if (this.seesaw_mode) {

                                                            // console.log('Animation: applying seesaw');

                                                            var frames_reversed = this.frames.slice().reverse();

                                                            this.frames.pop();

                                                            this.frames = this.frames.concat(frames_reversed);
                                                }
                                                if (this.reverse_frames) {
                                                            this.reverseFrames();
                                                }
                                    }

                                    /**
                                     * Draws the image of this animation to an offscreen canvas.
                                     *
                                     * @function
                                     * @memberof Animation
                                     **********/

                        }, {
                                    key: 'StashToCanvas',
                                    value: function StashToCanvas() {

                                                this.testCanvas = document.createElement("CANVAS");

                                                this.testCtx = this.testCanvas.getContext("2d");

                                                this.testCanvas.width = this.image.domElement.width;

                                                this.testCanvas.height = this.image.domElement.height;

                                                this.testCanvas.style.zIndex = '9999';

                                                this.testCtx.drawImage(this.image.domElement, 0, 0);

                                                return this;
                                    }

                                    /**
                                     * Creates and returns a ColorMap for this animation, allowing opacity-based pixel-collision.
                                     *
                                     * @function
                                     * @param {number} unitDimen a Colormap grid-unit-size --A larger unitDimen decreases accuracy, and results in faster-processing.
                                     * @memberof Animation
                                     **********/

                        }, {
                                    key: 'createColorMap',
                                    value: function createColorMap(unitDimen) {

                                                if (!(this.image && this.image.domElement)) return this;

                                                this.StashToCanvas();

                                                function ColoredPixelGrid(image, unitSize, ctx) {

                                                            if (isNaN(unitSize)) {
                                                                        unitSize = 5;
                                                            }

                                                            var grid = [];

                                                            for (var x = 0; x < image.width; x += unitSize) {
                                                                        for (var y = 0; y < image.height; y += unitSize) {
                                                                                    // Fetch pixel at current position
                                                                                    var pixel = ctx.getImageData(x, y, 1, 1);
                                                                                    // Check that opacity is above zero
                                                                                    if (pixel.data[3] != 0) {

                                                                                                var vector = new Gamestack.Vector(x - unitSize / 2, y - unitSize / 2),
                                                                                                    gridObject = {

                                                                                                            position: vector,

                                                                                                            size: new Gamestack.Vector(unitSize, unitSize)
                                                                                                };

                                                                                                grid.push(gridObject);
                                                                                    }
                                                                        }
                                                            }

                                                            return grid;
                                                }

                                                this.colorMap = ColoredPixelGrid(this.image.domElement, unitDimen, this.testCtx);

                                                return this.colorMap;
                                    }

                                    /**
                                     * Returns the existing ColorMap for this animation.
                                     *
                                     * @function
                                     * @memberof Animation
                                     **********/

                        }, {
                                    key: 'getCurrentColorMap',
                                    value: function getCurrentColorMap() {
                                                var map = [];

                                                var frame = this.selected_frame;

                                                for (var x in this.colorMap) {

                                                            var c = this.colorMap[x];

                                                            if (Gamestack.Collision.basicBoxCollide(frame.framePos, frame.frameSize, c.position, c.size)) {

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
                                    key: 'setFrame',
                                    value: function setFrame(ix) {
                                                this.selected_frame = this.frames[ix];
                                    }
                        }, {
                                    key: 'update',
                                    value: function update() {

                                                this.selected_frame = this.frames[Math.round(this.cix) % this.frames.length];
                                    }
                        }, {
                                    key: 'reset',
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
                                    key: 'run',
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
                                     * Engages, or updates the animation for a one full frame-cycle.
                                     *
                                     * @function
                                     * @param {number} duration the number of milliseconds the animation should take.
                                     * @memberof Animation
                                     **********/

                        }, {
                                    key: 'engage',
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

                                                this.tween.start();
                                    }
                        }]);

                        return Animation;
            }();

            ;

            /** @memberof Gamestack */

            Gamestack.Animation = Animation;

            Gamestack.Animation.continuous = Gamestack.Animation.run; //'continuous is an alternate reference to 'run'.'

            Gamestack.Animation.continue = Gamestack.Animation.run; //'continue is an alternate reference to 'run'.'
})();
;

(function () {
            console.log('Camera class... creating');

            /**
             * Creates an instance of 2d-camera to be applied as the viewing-point for a GameWindow.
             *
             * <info>the sprites and game-objects attached to a GameWindow will have their positions offset
             * automatically with respect to the Camera.position Vector</info>
             *
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

                        this.position = new Gamestack.Vector(x, y, z);
            };

            Gamestack.Camera = Camera;
})();
;

/**
 * Creates Gamestack.js Canvas: The canvas-renderer for Gamestack games.

 @description
 This Canvas library handles the low-level drawing of Gamestack.Animation objects on HTML5Canvas.
 -Draws Sprites according to their rotation, size, and properties.
 * @returns {CanvasLib} a CanvasLib object.
 */

(function () {

            console.log('CanvasStack class... creating');

            var CanvasStack = function CanvasStack() {
                        _classCallCheck(this, CanvasStack);

                        return {

                                    __levelMaker: false,

                                    draw: function draw(sprite, ctx, camera) {

                                                camera = camera || Gamestack.game_windows[0].camera || { position: new Gamestack.Vector(0, 0, 0) };

                                                if (sprite.active && (this.__levelMaker || sprite.onScreen(Gamestack.WIDTH, Gamestack.HEIGHT))) {

                                                            this.drawPortion(sprite, ctx, camera);
                                                }
                                    },
                                    drawFrameWithRotation: function drawFrameWithRotation(img, fx, fy, fw, fh, x, y, width, height, deg, canvasContextObj, flipX, flipY) {

                                                canvasContextObj.save();
                                                deg = Math.round(deg);
                                                deg = deg % 360;
                                                var rad = deg * Math.PI / 180;
                                                //Set the origin to the center of the image
                                                canvasContextObj.translate(x, y);
                                                canvasContextObj.rotate(rad);
                                                //Rotate the canvas around the origin

                                                canvasContextObj.translate(0, canvasContextObj.width);

                                                if (flipX) {

                                                            canvasContextObj.scale(-1, 1);
                                                } else {}

                                                if (flipY) {

                                                            canvasContextObj.scale(1, -1);
                                                } else {}

                                                //draw the image
                                                canvasContextObj.drawImage(img, fx, fy, fw, fh, width / 2 * -1, height / 2 * -1, width, height);
                                                //reset the canvas

                                                canvasContextObj.restore();
                                    },

                                    drawData: function drawData(x, y, w, h, data, ctx) {

                                                ctx.putImageData(data, x, y, 0, 0, w, h);
                                    },

                                    drawPortion: function drawPortion(sprite, ctx, camera) {

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

                                                            var camera_pos = camera.position || { x: 0, y: 0, z: 0 };

                                                            if (!sprite.hasOwnProperty('scrollFactor')) {
                                                                        sprite.scrollFactor = 1.0;
                                                            }

                                                            var x = p.x,
                                                                y = p.y,
                                                                scrollFactor = sprite.scrollFactor >= 0 && sprite.scrollFactor <= 1.0 ? sprite.scrollFactor : 1.0;

                                                            if (sprite.noScroll) {
                                                                        scrollFactor = 0;
                                                            }

                                                            x -= camera_pos.x * scrollFactor || 0;
                                                            y -= camera_pos.y * scrollFactor || 0;
                                                            //optional animation : gameSize

                                                            var targetSize = sprite.size || sprite.selected_animation.size;

                                                            var realWidth = targetSize.x;
                                                            var realHeight = targetSize.y;

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

                                                            if (frame && frame.image && frame.image.data) {

                                                                        ctx.putImageData(frame.image.data, x, y, 0, 0, sprite.size.x, sprite.size.y);
                                                            } else {

                                                                        if (!sprite.selected_animation || !sprite.selected_animation.image || !sprite.selected_animation.image.domElement) return;

                                                                        if (sprite.selected_animation.image.domElement instanceof HTMLImageElement) {

                                                                                    this.drawFrameWithRotation(sprite.selected_animation.image.domElement, frame.framePos.x, frame.framePos.y, frame.frameSize.x, frame.frameSize.y, Math.round(x + realWidth / 2), Math.round(y + realHeight / 2), realWidth, realHeight, rotation % 360, ctx, sprite.flipX, sprite.flipY);
                                                                        }
                                                            }
                                                }
                                    }

                        };
            };

            Gamestack.Canvas = new CanvasStack();

            Gamestack.CanvasStack = CanvasStack;
})();

;

(function () {
            console.log('CollisionSettings class... creating');

            var CollisionSettings = function CollisionSettings() {
                        var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                        _classCallCheck(this, CollisionSettings);

                        this.fourway = args.fourway || args.four_way || false;

                        this.top = this.four_way || args.top || false;

                        this.bottom = this.four_way || args.bottom || false;

                        this.left = this.four_way || args.left || false;

                        this.right = this.four_way || args.right || false;

                        this.pixel = args.pixel || false;

                        this.stop = args.stop || false;

                        this.padding = args.padding || new Gamestack.Vector(0, 0, 0); // 0-1.0
            };

            Gamestack.CollisionSettings = CollisionSettings;
})();; /**
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
                                                if (!this.clasticObjects[x] instanceof Gamestack.Sprite) {
                                                            this.clasticObjects[x] = Gamestack.getById(this.clasticObjects[x].id);
                                                }
                                    }

                                    for (var x in this.topClastics) {
                                                if (!this.topClastics[x] instanceof Gamestack.Sprite) {
                                                            this.topClastics[x] = Gamestack.getById(this.topClastics[x].id);
                                                }
                                    }

                                    for (var x in this.subjects) {
                                                if (!this.subjects[x] instanceof Gamestack.Sprite) {
                                                            this.subjects[x] = Gamestack.getById(this.subjects[x].id);
                                                }
                                    }
                        }

                        _createClass(GravityForce, [{
                                    key: 'getArg',
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
                                    key: 'update',
                                    value: function update() {

                                                var subjects = this.subjects;

                                                var clasticObjects = this.clasticObjects;

                                                var topClastics = this.topClastics;

                                                var accel = this.accel || {};

                                                var max = this.max || {};

                                                __gameStack.each(subjects, function (ix, itemx) {

                                                            itemx.accelY(accel, max);

                                                            itemx.__inAir = true;

                                                            if (itemx.position.y >= itemx.groundMaxY) {

                                                                        itemx.position.y = itemx.groundMaxY;
                                                            }

                                                            itemx.groundMaxY = 3000000; //some crazy number you'll never reach in-game

                                                            __gameStack.each(clasticObjects, function (iy, itemy) {

                                                                        itemx.collide_stop(itemy);
                                                            });

                                                            __gameStack.each(topClastics, function (iy, itemy) {

                                                                        itemx.collide_stop_top(itemy);
                                                            });
                                                });
                                    }
                        }]);

                        return GravityForce;
            }();

            ;

            var Force = GravityForce;

            Gamestack.Force = Force;

            Gamestack.GForce = Force;

            Gamestack.GravityForce = GravityForce;
})();

;
(function () {
            console.log('Frame class... creating');

            /**
             * Creates an instance of Frame
             *
             * <info-bit>Gamestack.Frame is called automatically by Gamestack.Sprite and Gamestack.Animation.
             * Gamestack.Frame does not take arguments.
             * It is instantiated, then initilized with chainable function-calls.</info-bit>
             *
             * @returns {Frame}
             *
             * @example
             *
             * var selected_frame = new Gamestack.Frame().Image(gameImage).Size(frameSizeVector);
               *
             */

            var Frame = function () {
                        function Frame() {
                                    _classCallCheck(this, Frame);

                                    var __inst = this;

                                    this.framePos = new Gamestack.Vector(0, 0);
                        }

                        _createClass(Frame, [{
                                    key: 'Image',
                                    value: function Image(i) {
                                                this.image = i;

                                                return this;
                                    }
                        }, {
                                    key: 'Size',
                                    value: function Size(s) {

                                                this.size = new Gamestack.Vector(s, s, s);

                                                this.frameSize = new Gamestack.Vector(s, s, s);

                                                return this;
                                    }
                        }, {
                                    key: 'Position',
                                    value: function Position(p) {
                                                this.position = new Gamestack.Vector(p, p, p);

                                                this.framePos = new Gamestack.Vector(p, p, p);

                                                return this;
                                    }
                        }, {
                                    key: 'FramePos',
                                    value: function FramePos() {
                                                this.position = new Gamestack.Vector(p, p, p);

                                                this.framePos = new Gamestack.Vector(p, p, p);

                                                return this;
                                    }
                        }]);

                        return Frame;
            }();

            Gamestack.Frame = Frame;
})();
;

var Game = function Game(srcFile) {
            _classCallCheck(this, Game);
};

Gamestack.Game = Game;

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

Gamestack.ControllerEventKeys = ControllerEventKeys;

/**
 * Creates an instance of GamepadAdapter: --instead use the existing: Gamestack.GamepadAdapter, a working instance of this class.
 * -supports game-controller input for web-games
 * -accesses live gamepad input from the HTML5 Gamepad Api
 * @returns {GamepadAdapter} an instance of GamepadAdapter
 * */

Gamestack.gamepads = Gamestack.gamepads || [];

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
                        key: 'gamepads',
                        value: function gamepads() {

                                    return navigator.getGamepads();
                        }
            }, {
                        key: 'disconnect_all',
                        value: function disconnect_all() {

                                    for (var x = 0; x < this.intervals.length; x++) {

                                                window.clearInterval(this.intervals[x]);
                                    }
                        }
            }, {
                        key: 'disconnect_by_index',
                        value: function disconnect_by_index(game_pad_index) {

                                    window.clearInterval(this.intervals[game_pad_index]);
                        }
            }, {
                        key: 'hasAnyPad',
                        value: function hasAnyPad() {
                                    return "getGamepads" in navigator;
                        }
            }, {
                        key: 'Event',
                        value: function Event(key, game_pad, callback) {
                                    return {

                                                key: key, game_pad: game_pad, callback: callback

                                    };
                        }
            }, {
                        key: 'GamepadEvents',
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

                                    Gamestack.gamepads = this.__gamepads;

                                    return gp;
                        }
            }, {
                        key: 'getGamepads',
                        value: function getGamepads() {
                                    return Gamestack.gamepads;
                        }
            }, {
                        key: 'process',
                        value: function process(gp, gpEvents) {

                                    this.process_buttons(gp, gpEvents);

                                    this.process_axes(gp, gpEvents);
                        }
            }, {
                        key: 'process_axes',
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
                        key: 'process_buttons',
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
                        key: 'on',
                        value: function on(key, gpix, callback) {

                                    var keys = Typo.MakeArray(key || []),
                                        gps = Typo.MakeArray(gpix || []);;

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

if (!Gamestack.GamepadAdapter) {

            Gamestack.GamepadAdapter = new GamepadAdapter();

            // __gameInstance.gamepads.push(gamepad);
}
;
(function () {
            console.log('GameWindow class: creating');

            /**
             * Creates a GameWindow object.
             *
             * <iframe style='width:400px; height:450px; overflow:hidden;' src='../client/examples/js-class/GameWindow.html'> </iframe>
             *
             * @param   {Object} args object of arguments
             * @param   {Object} args.canvas the canvas element for this gameWindow. --GameWindow's constructor will create a full-screen canvas, if a canvas is not supplied in args.
             * @param   {Object} args.ctx a canvas context
             * @param   {Array} args.sprites list of sprites, to be applied with GameWindow
             * @param   {Array} args.forces the list of forces, such as gravity, to be applied with GameWindow
             * @returns {GameWindow} a Gamestack.GameWindow object
             * */

            var GameWindow = function () {
                        function GameWindow() {
                                    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                                        _ref$canvas = _ref.canvas,
                                        canvas = _ref$canvas === undefined ? false : _ref$canvas,
                                        objects = _ref.objects,
                                        update = _ref.update,
                                        camera = _ref.camera;

                                    _classCallCheck(this, GameWindow);

                                    this.objects = objects || [];

                                    this.bool_events = Gamestack.bool_events || [];

                                    this.canvas = canvas || false;

                                    if (!canvas) {
                                                console.info('GameWindow() had no {canvas:canvas} argument. Creating a new canvas in document.body...');
                                                this.canvas = document.createElement('CANVAS');
                                                this.canvas.setAttribute('class', 'gamewindow');
                                                document.body.append(this.canvas);
                                    }

                                    document.body.style.position = "absolute";

                                    document.body.style.width = "100%";

                                    document.body.style.height = "100%";

                                    this.camera = new Gamestack.Camera();

                                    this.camera.target = false;

                                    __gamestackInstance.camera = this.camera;

                                    if (typeof update == 'function') {
                                                this.onUpdate(update);
                                    }

                                    var __inst = this;

                                    this.Size();

                                    this.update_ext = [];

                                    window.onresize = function () {

                                                if (__inst.isAbsoluteSize) return;

                                                __inst.Size();
                                    };

                                    this.ctx = this.canvas.getContext('2d');

                                    Gamestack.game_windows.push(this);
                        }

                        _createClass(GameWindow, [{
                                    key: 'uniques',
                                    value: function uniques(list) {

                                                var listout = [];

                                                $Q.each(list, function (ix, item) {

                                                            if (!listout.indexOf(item.id) >= 0) {

                                                                        var str = item.name;

                                                                        listout.push({ "sprite": item });
                                                            }
                                                });

                                                return listout;
                                    }
                        }, {
                                    key: 'setPlayer',
                                    value: function setPlayer(player) {
                                                this.player = player;

                                                if (!this.objects.indexOf(player) >= 0) {
                                                            this.objects.push(player);
                                                }
                                    }
                        }, {
                                    key: 'onUpdate',
                                    value: function onUpdate(f) {

                                                this.update_ext.push(f);
                                    }
                        }, {
                                    key: 'update',
                                    value: function update() {

                                                Gamestack.each(this.objects, function (ix, item) {

                                                            if (item && typeof item.def_update == 'function') {

                                                                        item.def_update(item);
                                                            }

                                                            if (item && typeof item.update == 'function') {
                                                                        item.update(item);
                                                            }
                                                });

                                                Gamestack.each(this.bool_events, function (ix, item) {

                                                            if (item && item.bool()) {

                                                                        item.callback();
                                                            }
                                                });

                                                for (var x in this.update_ext) {
                                                            this.update_ext[x]();
                                                }
                                    }
                        }, {
                                    key: 'draw',
                                    value: function draw() {

                                                var _gw = this;

                                                if (this.before_draw_ext) {
                                                            this.before_draw_ext();
                                                }

                                                Gamestack.each(this.objects, function (ix, item) {

                                                            if (['Sprite', 'Background', 'Interactive', 'Terrain'].indexOf(item.constructor.name) >= 0 || item.__isDrawable) {

                                                                        Gamestack.Canvas.draw(item, _gw.ctx);
                                                            }
                                                });

                                                if (this.draw_ext) {
                                                            this.draw_ext();
                                                }
                                    }
                        }, {
                                    key: 'onDraw',
                                    value: function onDraw(f) {

                                                this.draw_ext = function () {
                                                            f();
                                                };
                                    }
                        }, {
                                    key: 'onBeforeDraw',
                                    value: function onBeforeDraw(f) {

                                                this.before_draw_ext = function () {
                                                            f();
                                                };
                                    }
                        }, {
                                    key: 'Size',
                                    value: function Size(w, h, isAbsoluteSize) {
                                                //call with no args to fill to browser-window-size;

                                                w = w || this.canvas.parentNode.clientWidth;

                                                h = h || this.canvas.parentNode.clientHeight;

                                                var c = document.getElementById('#gs-container');

                                                if (c) {
                                                            c.setAttribute('width', w);
                                                }
                                                ;

                                                if (c) {
                                                            c.setAttribute('height', h);
                                                }
                                                ;

                                                __gamestackInstance.WIDTH = w;

                                                __gamestackInstance.HEIGHT = h;

                                                this.canvas.width = w;

                                                this.canvas.height = h;

                                                this.isAbsoluteSize = isAbsoluteSize || false;

                                                return this;
                                    }
                        }, {
                                    key: 'add',
                                    value: function add(obj, onBottom) {
                                                //1: if Sprite(), Add object to the existing __gameWindow

                                                var __inst = this;

                                                if (obj instanceof Gamestack.Camera) {

                                                            this.camera = obj;
                                                } else if (obj instanceof Gamestack.GSEvent) {

                                                            if (__gamestackInstance.__running) {

                                                                        return console.error('Events can only be added before Gamstack.animate() is called::aka before the main update / loop begins');
                                                            } else {

                                                                        obj.apply();
                                                            }
                                                } else {

                                                            if (onBottom) {
                                                                        this.objects.splice(0, 0, obj);
                                                            } else {

                                                                        this.objects.push(obj);
                                                            }
                                                }

                                                this.collect(obj);

                                                return obj;
                                    }
                        }, {
                                    key: 'Background',
                                    value: function Background(c) {
                                                this.canvas.style.background = c;

                                                this.canvas.style.backgroundColor = c;

                                                return this;
                                    }
                        }, {
                                    key: 'remove',
                                    value: function remove(obj) {

                                                //1: if Sprite(), Add object to the existing __gameWindow

                                                var ix = this.objects.indexOf(obj);

                                                if (ix >= 0) {
                                                            this.objects.splice(ix, 1);
                                                }

                                                var ixG = Gamestack.all_objects.indexOf(obj);

                                                if (ixG >= 0) {
                                                            Gamestack.all_objects.splice(ixG, 1);
                                                }
                                    }
                        }, {
                                    key: 'collect',
                                    value: function collect(obj) {

                                                Gamestack.all_objects.push(obj);
                                    }
                        }, {
                                    key: 'animate',
                                    value: function animate(time) {

                                                var __inst = this;

                                                requestAnimationFrame(function () {

                                                            __inst.animate();
                                                });

                                                if (Gamestack.__stats) {
                                                            Gamestack.__stats.begin();
                                                            Gamestack.__statsMS.begin();
                                                            Gamestack.__statsMB.update();
                                                }

                                                __gamestackInstance.isAtPlay = true;

                                                if (window.TWEEN) TWEEN.update(time);

                                                __inst.update();

                                                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

                                                this.draw();

                                                if (Gamestack.__stats) {
                                                            Gamestack.__stats.end();
                                                            Gamestack.__statsMS.end();
                                                }
                                    }
                        }, {
                                    key: 'start',
                                    value: function start() {

                                                if (typeof Stats == 'function') //Stats library exists
                                                            {
                                                                        //basic stat animation
                                                                        Gamestack.__stats = new Stats();
                                                                        Gamestack.__stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom

                                                                        Gamestack.__stats.dom.style.left = '30%';

                                                                        Gamestack.__stats.dom.setAttribute('class', 'stat');

                                                                        this.canvas.parentNode.appendChild(Gamestack.__stats.dom);

                                                                        //basic stat animation
                                                                        Gamestack.__statsMS = new Stats();
                                                                        Gamestack.__statsMS.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom

                                                                        Gamestack.__statsMS.dom.style.left = '30%';

                                                                        Gamestack.__statsMS.dom.style.marginLeft = '90px';

                                                                        Gamestack.__statsMS.dom.setAttribute('class', 'stat');

                                                                        this.canvas.parentNode.appendChild(Gamestack.__statsMS.dom);

                                                                        //basic stat animation
                                                                        Gamestack.__statsMB = new Stats();
                                                                        Gamestack.__statsMB.showPanel(2); // 0: fps, 1: ms, 2: mb, 3+: custom

                                                                        Gamestack.__statsMB.dom.style.left = '30%';

                                                                        Gamestack.__statsMB.dom.setAttribute('class', 'stat');

                                                                        Gamestack.__statsMB.dom.style.marginLeft = '180px';

                                                                        this.canvas.parentNode.appendChild(Gamestack.__statsMB.dom);
                                                            }

                                                this.animate();
                                    }
                        }]);

                        return GameWindow;
            }();

            Gamestack.GameWindow = GameWindow;
})();;
(function () {
            console.log('GSEvent class... creating');

            var GSEvent = function GSEvent() {
                        var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                        _classCallCheck(this, GSEvent);

                        Gamestack.Modifiers.informable(this, args);
            };

            function GSEventLink(extendedObject, extendedKey, extendor, extendorKey) {
                        this.parent_id = extendedObject.id, this.child_id = extendor.id, this.parent_key = extendedKey, this.child_key = extendorKey;
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

            var InputEvent = function (_GSEvent) {
                        _inherits(InputEvent, _GSEvent);

                        function InputEvent(args) {
                                    _classCallCheck(this, InputEvent);

                                    var _this = _possibleConstructorReturn(this, (InputEvent.__proto__ || Object.getPrototypeOf(InputEvent)).call(this, args));

                                    var btnix = args.btnix || args.button_ix || false,
                                        gpix = args.gpix || args.gamepad_ix || 0,
                                        callback = args.callback || function () {};

                                    var six = args.stickix || args.six || args.stick_ix || false;

                                    var inputKey = six !== false ? 'stick_' + six : btnix !== false ? 'button_' + btnix : false;

                                    //Keys:

                                    var keyboardKeys = Typo.MakeArray(args.keys || []);

                                    //Run the Q() function

                                    if (keyboardKeys instanceof Array) {

                                                Gamestack.each(keyboardKeys, function (ix, keyitem) {

                                                            Gamestack.InputSystem.extendKey('key_' + keyitem.toLowerCase(), function () {

                                                                        callback(keyitem.toLowerCase());
                                                            });
                                                });
                                    }

                                    if (inputKey && gpix >= 0) {

                                                Gamestack.GamepadAdapter.on(inputKey, gpix, function (x, y) {

                                                            callback(x, y);
                                                });
                                    }
                                    return _this;
                        }

                        return InputEvent;
            }(GSEvent);

            ;

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

            var KeyboardEvent = function (_InputEvent) {
                        _inherits(KeyboardEvent, _InputEvent);

                        function KeyboardEvent() {
                                    var keys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : keys instanceof Array ? keys : [keys];
                                    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

                                    _classCallCheck(this, KeyboardEvent);

                                    var _this2 = _possibleConstructorReturn(this, (KeyboardEvent.__proto__ || Object.getPrototypeOf(KeyboardEvent)).call(this, {}));

                                    _this2.keys = keys;

                                    _this2.callback = callback;

                                    return _this2;
                        }

                        _createClass(KeyboardEvent, [{
                                    key: 'init',
                                    value: function init() {
                                                var keyboardKeys = this.keys;

                                                var __inst = this;

                                                if (keyboardKeys instanceof Array) {

                                                            Gamestack.each(keyboardKeys, function (ix, keyitem) {

                                                                        Gamestack.InputSystem.extendKey('key_' + keyitem.toLowerCase(), function () {

                                                                                    __inst.callback(keyitem.toLowerCase());
                                                                        });
                                                            });
                                                }
                                    }
                        }, {
                                    key: 'Keys',
                                    value: function Keys() {
                                                var keys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

                                                this.keys = Typo.MakeArray(keys);

                                                return this;
                                    }
                        }, {
                                    key: 'Call',
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
             * <info-bit> Gamestack.GamepadEvent runs a callback function when any specified gamepad-buttons or gamepad-sticks are pressed</info-bit>
             * @param   {Array | string} gamepadKeys the Array of gamepadKeys or single string-key, representing gamepad-buttons or gamepad-sticks for this event
             * @param   {Function} callback the callback-function to be called when this event is triggered
               * @returns {Gamestack.GamepadEvent}
             */

            var GamepadEvent = function (_InputEvent2) {
                        _inherits(GamepadEvent, _InputEvent2);

                        function GamepadEvent() {
                                    var keys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
                                    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

                                    _classCallCheck(this, GamepadEvent);

                                    var _this3 = _possibleConstructorReturn(this, (GamepadEvent.__proto__ || Object.getPrototypeOf(GamepadEvent)).call(this, {}));

                                    _this3.keys = keys;

                                    _this3.callback = callback;
                                    return _this3;
                        }

                        _createClass(GamepadEvent, [{
                                    key: 'Gamepads',
                                    value: function Gamepads() {
                                                var gps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

                                                this.gps = gps = Typo.MakeArray(gps || []);

                                                return this;
                                    }
                        }, {
                                    key: 'init',
                                    value: function init() {
                                                var gamepadKeys = Typo.MakeArray(this.keys || []);

                                                var __inst = this;

                                                Gamestack.GamepadAdapter.on(gamepadKeys, this.gps, function (x, y) {

                                                            __inst.callback(x, y);
                                                });
                                    }
                        }, {
                                    key: 'Keys',
                                    value: function Keys() {
                                                var keys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

                                                this.keys = Typo.MakeArray(keys);

                                                return this;
                                    }
                        }, {
                                    key: 'Call',
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
                                    key: 'OnCollision',
                                    value: function OnCollision(objects, siblings) {

                                                this.objects = Typo.MakeArray(objects || this.objects || []);

                                                this.siblings = Typo.MakeArray(siblings || this.siblings || []);

                                                return this;
                                    }

                                    /**
                                     * applies a callback to be called whenever the onBool function returns true
                                     * @memberof CollisionEvent
                                     * @param   {callbackFunction} callbackFunction the function to be called --replaces the value of collisionEvent.callback
                                       * @returns {CollisionEvent} the current instance of CollisionEvent, reference to 'this' keyword
                                     */

                        }, {
                                    key: 'Call',
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
               * @returns {BoolEvent} a Gamestack.BoolEvent object
             */

            var BoolEvent = function (_GSEvent3) {
                        _inherits(BoolEvent, _GSEvent3);

                        function BoolEvent(onBool, callback) {
                                    _classCallCheck(this, BoolEvent);

                                    var _this5 = _possibleConstructorReturn(this, (BoolEvent.__proto__ || Object.getPrototypeOf(BoolEvent)).call(this, {}));

                                    _this5.bool = onBool || function () {
                                                console.info('CustomBoolEvent():needs .on function(){}. --Add this as 1st argument or via chainable On() function returning bool argument');
                                    };
                                    /*Defaults to false to avoid broken code*/

                                    _this5.callback = callback || function () {
                                                console.info('CustomBoolEvent():needs .callback function(){} --Add this as 2nd argument or via chainable Call() function');
                                    };

                                    Gamestack.bool_events.push(_this5);

                                    return _this5;
                        }

                        /**
                         * applies a boolFunction to be tested for true each update
                         * @param   {boolFunction} boolFunction the function to be tested each update --replaces the value of boolEvent.onBool
                           * @returns {BoolEvent} the current instance of BoolEvent, reference to 'this' keyword
                         */

                        _createClass(BoolEvent, [{
                                    key: 'On',
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
                                    key: 'Call',
                                    value: function Call(callbackFunction) {

                                                this.callback = callbackFunction || this.callback || function () {};

                                                return this;
                                    }
                        }]);

                        return BoolEvent;
            }(GSEvent);

            ;

            BoolEvent.Bool = BoolEvent.On;

            Gamestack.GSEvent = GSEvent;

            Gamestack.GSEventLink = GSEventLink;

            Gamestack.InputEvent = InputEvent;

            Gamestack.GamepadEvent = GamepadEvent;

            Gamestack.KeyboardEvent = KeyboardEvent;

            Gamestack.CollisionEvent = CollisionEvent;

            Gamestack.BoxCollisionEvent = CollisionEvent;

            Gamestack.BoolEvent = BoolEvent;
})();; /*
       * Gamestack.GSProton: -An implementation of the Proton.js particle engine.
       * :instantiable
       * :data-persistent / json format
       * :reloadable
       * :__presets : various GSProton objects for in-game-use
       *
       * */

(function () {
            console.log('CanvasStack class... creating');

            /**
             * @ignore
             *
             * Takes arguments of image, canvas, parent, collideables?
               * @param   {image} the img
             * @param   {canvas} canvas to draw on
             * @param   {parent} the parent, either a position{x,y,z} or object with a 'position' property having x,y,z
             * @returns {GSProton} a GSProton object
             */

            var GSProton = function () {
                        function GSProton(image, canvas, parent, collideables) {
                                    _classCallCheck(this, GSProton);

                                    var args = { image: image, canvas: canvas, parent: parent, collideables: collideables };

                                    if (image.image && image.canvas) //image is a GS Proton passed back through constructor as first argument --enable data persistence
                                                {

                                                            args = image;
                                                }

                                    args.canvas = args.canvas || Gamestack.canvas;

                                    args.parent = args.parent || new Gamestack.Vector(0, 0, 0);

                                    args.image = args.image || new Gamestack.GameImage();

                                    this.name = args.name || "__NO-Name";

                                    this.description = args.description || "__NO-Description";

                                    this.image = args.image;

                                    this.active = false;

                                    this.image = args.image;

                                    this.canvas = args.canvas;

                                    this.emission_amount_min = 1;

                                    this.emission_amount_max = 1;

                                    this.radius = 0;

                                    this.mass = 1;

                                    this.emissions_frequency = 5;

                                    this.gravity = 0;

                                    this.proton = {};

                                    this.usingAttraction = false;

                                    this.usingRepulsion = false;

                                    this.usingPointZone = false;

                                    this.pointZoneX = 0;

                                    this.pointZoneY = 0;

                                    this.usingBlendAlpha = false;

                                    this.attraction = {

                                                position: new Vector(0, 0),

                                                min: 0,

                                                max: 0

                                    };

                                    this.repulsion = {

                                                position: new Gamestack.Vector(0, 0),

                                                min: 0,

                                                max: 0

                                    };

                                    this.startAlpha = 1.0;

                                    this.endAlpha = 1.0;

                                    this.startColor_asRandom = true;

                                    this.startColor = "#FFFFFF";

                                    this.startScale = 1.0;

                                    this.endScale = 1.0;

                                    this.endColor_asRandom = true;

                                    this.endColor = "#FFFFFF";

                                    this.positionX_asRandom = false;

                                    this.positionY_asRandom = false;

                                    this.positionX = 0;

                                    this.positionY = 0;

                                    this.vSpeedMin = 0.5;

                                    this.vSpeedMax = 1.5;

                                    this.vSpeedRotationMin = 0;

                                    this.vSpeedRotationMax = 360;

                                    this.lifeMin = 5;

                                    this.lifeMax = 10;

                                    for (var x in this) {
                                                if (args.hasOwnProperty(x)) {

                                                            this[x] = args[x];
                                                }
                                    }

                                    //the following instantiate to empty []

                                    this.initializers = [];

                                    this.behaviors = [];
                        }

                        _createClass(GSProton, [{
                                    key: 'replaceBehaviorByType',
                                    value: function replaceBehaviorByType(constructor, replacement) {

                                                for (var x in this.behaviors) //remove any existing object by type
                                                {
                                                            if (this.behaviors[x] instanceof constructor) {

                                                                        this.behaviors.splice(x, 1);
                                                            }
                                                }

                                                this.behaviors.push(replacement);

                                                this.ticker = 0;
                                    }
                        }, {
                                    key: 'Collideables',
                                    value: function Collideables(collideableArray) {
                                                this.collideables = collideableArray;
                                    }
                        }, {
                                    key: 'Rotation',
                                    value: function Rotation(minRot, maxRot) {

                                                maxRot = maxRot || minRot; //they are either positive-number or the same
                                                this.vSpeedRotationMin = minRot;

                                                this.vSpeedRotationMax = maxRot;

                                                this.replaceBehaviorByType(Proton.V, new Proton.V(new Proton.Span(this.vSpeedMin, this.vSpeedMax), new Proton.Span(this.vSpeedRotationMin, this.vSpeedRotationMax), 'polar'));
                                    }
                        }, {
                                    key: 'Gravity',
                                    value: function Gravity(grav) {

                                                this.gravity = grav;

                                                this.replaceBehaviorByType(Proton.Gravity, new Proton.Gravity(this.gravity));
                                    }
                        }, {
                                    key: 'Velocity',
                                    value: function Velocity(minV, maxV) {

                                                maxV = maxV || minV; //they are either positive-number or the same
                                                this.vSpeedMin = minV;

                                                this.vSpeedMax = maxV;

                                                this.replaceBehaviorByType(Proton.V, new Proton.V(new Proton.Span(this.vSpeedMin, this.vSpeedMax), new Proton.Span(this.vSpeedRotationMin, this.vSpeedRotationMax), 'polar'));
                                    }
                        }, {
                                    key: 'Attraction',
                                    value: function Attraction(position, min, max) {
                                                this.usingAttraction = true;

                                                this.attraction.position = position;

                                                this.attraction.min = min;

                                                this.attraction.max = max;
                                    }
                        }, {
                                    key: 'Repulsion',
                                    value: function Repulsion(x, y, min, max) {
                                                this.usingRepulsion = true;

                                                this.repulsion.position = position;

                                                this.repulsion.min = min;

                                                this.repulsion.max = max;
                                    }
                        }, {
                                    key: 'onUpdate',
                                    value: function onUpdate() {}
                        }, {
                                    key: 'isRectangularCollision',
                                    value: function isRectangularCollision(obj1, obj2) {

                                                return obj1.position.x + obj1.size.x > obj2.position.x && obj1.position.y + obj1.size.y > obj2.position.y && obj1.position.x < obj2.position.x + obj2.size.x && obj1.position.y < obj2.position.y + obj2.size.y;
                                    }
                        }, {
                                    key: 'collide',
                                    value: function collide(obj1, obj2) {
                                                console.log('collide() function UNSET');
                                    }
                        }, {
                                    key: 'update',
                                    value: function update(collideables) {

                                                collideables = collideables || this.collideables || [];

                                                this.ticker += 1;

                                                if (this.ticker % 100 == 0) {

                                                            console.log('Proton:update():');
                                                            console.log(this.emitter);
                                                }

                                                if (this.positionX_asRandom) {
                                                            this.emitter.p.x = Math.floor(Math.random() * canvas.width);
                                                } else {
                                                            this.emitter.p.x = this.positionX;
                                                }

                                                if (this.positionY_asRandom) {
                                                            this.emitter.p.y = Math.floor(Math.random() * canvas.width);
                                                } else {
                                                            this.emitter.p.y = this.positionY;
                                                }

                                                var particles = this.emitter.particles;

                                                for (var x = 0; x < particles.length; x++) {
                                                            var p = {

                                                                        size: {
                                                                                    x: Math.round(this.emitter.initializes[0].w * this.emitter.scale),

                                                                                    y: Math.round(this.emitter.initializes[0].h * this.emitter.scale)

                                                                        },

                                                                        position: particles[x].p

                                                            };
                                                            for (var y = 0; y < collideables.length; y++) {

                                                                        if (collideables[y].hasOwnProperty('position') && collideables[y].hasOwnProperty('size') && this.isRectangularCollision(p, collideables[y])) {

                                                                                    this.collide(p, collideables[y]);
                                                                        }
                                                            }
                                                }
                                    }
                        }, {
                                    key: 'init',
                                    value: function init() {

                                                this.proton = new Proton();

                                                this.emit_mode = this.emit_mode || "";

                                                this.emitter = new Proton.Emitter();

                                                this.emission_amount = this.emission_amount || 10;

                                                this.emissions_frequency = this.emissions_frequency || 10;

                                                var rps = 5 / this.emissions_frequency;

                                                this.emitter.rate = new Proton.Rate([this.emission_amount_min, this.emission_amount_max], rps);

                                                function allNumbers(list) {
                                                            for (var x in list) {
                                                                        if (typeof list[x] == 'number') {} else {
                                                                                    return false;
                                                                        }
                                                            }

                                                            return true;
                                                };

                                                this.initializers = [];

                                                this.behaviors = [];

                                                this.initializers.push(new Proton.ImageTarget(this.image));
                                                this.initializers.push(new Proton.Mass(this.mass));
                                                this.initializers.push(new Proton.Life(this.lifeMin, this.lifeMax));

                                                this.initializers.push(new Proton.V(new Proton.Span(this.vSpeedMin, this.vSpeedMax), new Proton.Span(this.vSpeedRotationMin, this.vSpeedRotationMax), 'polar'));

                                                if (this.usingPointZone) {

                                                            this.initializers.push(new Proton.Position(new Proton.PointZone(this.pointZoneX, this.pointZoneY)));
                                                }

                                                this.behaviors.push(new Proton.Gravity(this.gravity));

                                                this.behaviors.push(new Proton.Alpha(1, [this.startAlpha, this.endAlpha]));

                                                this.behaviors.push(new Proton.Color(this.startColor_asRandom ? 'random' : this.startColor, this.endColor_asRandom ? 'random' : this.endColor, Infinity, Proton.easeInSine));

                                                this.behaviors.push(new Proton.Scale(this.startScale, this.endScale));

                                                if (allNumbers([this.attractionX, this.attractionY, this.attractionMin, this.attractionMax])) {
                                                            console.info('Creating attraction');

                                                            this.behaviors.push(new Proton.Attraction({ x: this.attractionX, y: this.attractionY }, this.attractionMin, this.attractionMax));
                                                }

                                                if (allNumbers([this.repulsionX, this.repulsionY, this.repulsionMin, this.repulsionMax])) {
                                                            console.info('Creating repulsion');

                                                            this.behaviors.push(new Proton.Repulsion({ x: this.repulsionX, y: this.repulsionY }, this.repulsionMin, this.repulsionMax));
                                                }

                                                if (this.usingAttraction) {
                                                            this.behaviors.push(new Proton.Attraction(this.attraction.position, this.attraction.min, this.attraction.max));
                                                }

                                                if (this.usingRepulsion) {
                                                            this.behaviors.push(new Proton.Repulsion(this.repulsion.position, this.repulsion.min, this.repulsion.max));
                                                }

                                                if (this.radius > 0) {
                                                            this.initializers.push(new Proton.Radius(this.radius));
                                                }

                                                var i = this.initializers;

                                                for (var x in i) {
                                                            this.emitter.addInitialize(i[x]);
                                                }

                                                var b = this.behaviors;

                                                for (var x in b) {
                                                            this.emitter.addBehaviour(b[x]);
                                                }

                                                this.emitter.p = this.parent && this.parent.hasOwnProperty('x') ? new Vector(this.parent) : this.emitter.p;

                                                this.emitter.p = this.parent && this.parent.hasOwnProperty('position') && this.parent.position.hasOwnProperty('x') ? new Vector(this.parent.position) : this.emitter.p;

                                                this.emitter.p.x += this.positionX;
                                                this.emitter.p.y += this.positionY;

                                                this.emitter.emit();

                                                this.proton.addEmitter(this.emitter);

                                                this.renderer = new Proton.Renderer('canvas', this.proton, this.canvas);

                                                if (this.usingBlendAlpha) {
                                                            this.renderer.blendFunc("SRC_ALPHA", "ONE");
                                                }

                                                var __inst = this;

                                                this.renderer.start();

                                                this.tick();
                                    }
                        }, {
                                    key: 'on',
                                    value: function on() {
                                                this.init();
                                    }
                        }, {
                                    key: 'off',
                                    value: function off() {
                                                if (this.emitter && this.emitter.stopEmit) this.emitter.stopEmit();
                                    }
                        }, {
                                    key: 'tick',
                                    value: function tick() {

                                                requestAnimationFrame(function () {
                                                            __inst.tick();
                                                });

                                                var __inst = this;

                                                this.proton.update();
                                                // this.update();
                                    }
                        }]);

                        return GSProton;
            }();

            var ProtonPresets = {

                        //particleDemoName:new GSProton();   //add particleDemoObjects


            };

            Gamestack.GSProton = GSProton;
})();
;var head = document.head || document.getElementsByTagName('head')[0];

head.innerHTML += '<style>' + '\r\n' + '.speech-triangle { overflow:visible; }' + '.speech-triangle:before { content: "";' + 'position: absolute;' + 'z-index:-1;' + 'width: 0;' + 'height: 0;' + 'left: 38px;' + 'bottom: -18px;' + 'border-width: 8px 8px;' + 'border-style: solid;' + 'border-color: #fff transparent transparent #fff;' + ' } .farLeft:after{ right:0px; left:20px; } .farRight:after{ left:0px; right:20px; }   .flipX:after{  -moz-transform: scaleX(-1); -webkit-transform: scaleX(-1); -o-transform: scaleX(-1); transform: scaleX(-1); -ms-filter: fliph; /*IE*/ filter: fliph; /*IE*/  } ' + ' </style>';

(function () {
            console.log('HtmlExtra classes... creating');

            var HtmlExtra //to do apply a super object 'Extra'
            = function () {
                        function HtmlExtra() {
                                    var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                                    _classCallCheck(this, HtmlExtra);

                                    this.applyCSSArgs(args);
                        }

                        _createClass(HtmlExtra, [{
                                    key: 'applyCSSArgs',
                                    value: function applyCSSArgs(args) {

                                                var norms = Gamestack.normalArgs(args);

                                                this.widthFloat = Gamestack.getArg(norms, ['width', 'widthfloat', 'w'], 0.5);

                                                this.heightFloat = Gamestack.getArg(norms, ['height', 'heightfloat', 'h'], 0.5);

                                                this.topFloat = Gamestack.getArg(norms, ['top', 'topfloat', 't'], 0.5);

                                                this.bottomFloat = Gamestack.getArg(norms, ['bottom', 'bottomfloat', 'b'], false);

                                                this.color = norms.color || '#ffffff';

                                                this.backgroundColor = Gamestack.getArg(norms, ['backgroundcolor', 'backcolor', 'background', 'bc'], 'black');

                                                this.text = norms.text || "__BLANK";

                                                this.fontFamily = norms.font || norms.fontFamily || "appFont";

                                                this.border = "2px inset " + this.color;

                                                this.fontSize = norms.fontsize || "20px";

                                                if (this.bottomFloat >= 0) {

                                                            this.targetBottom = this.get_float_pixels(this.bottomFloat, document.body.clientHeight);
                                                } else {

                                                            this.targetTop = this.get_float_pixels(this.topFloat, document.body.clientHeight);
                                                }

                                                this.fadeTime = {

                                                            in: 200,

                                                            out: 200
                                                };
                                    }
                        }, {
                                    key: 'Opacity',
                                    value: function Opacity(o) {
                                                this.domElement.style.opacity = o;

                                                return this;
                                    }
                        }, {
                                    key: 'Top',
                                    value: function Top(v) {

                                                this.targetTop = this.get_float_pixels(v, document.body.clientHeight);

                                                this.domElement.style.bottom = 'auto';
                                                this.domElement.style.top = this.targetTop;

                                                return this;
                                    }
                        }, {
                                    key: 'Left',
                                    value: function Left(v) {

                                                this.targetLeft = this.get_float_pixels(v, document.body.clientWidth);

                                                this.domElement.style.right = 'auto';
                                                this.domElement.style.left = this.targetLeft;

                                                return this;
                                    }
                        }, {
                                    key: 'Bottom',
                                    value: function Bottom(v) {

                                                this.targetBottom = this.get_float_pixels(v, document.body.clientHeight);

                                                this.domElement.style.top = 'auto';
                                                this.domElement.style.bottom = this.targetBottom;

                                                return this;
                                    }
                        }, {
                                    key: 'Right',
                                    value: function Right(v) {

                                                this.targetRight = this.get_float_pixels(v, document.body.clientWidth);

                                                this.domElement.style.left = 'auto';
                                                this.domElement.style.right = this.targetRight;

                                                return this;
                                    }
                        }, {
                                    key: 'FontSize',
                                    value: function FontSize(v) {
                                                if (v.indexOf('px') == -1 && v.indexOf('em') == -1 && v.indexOf('%') == -1) {
                                                            //assume px:

                                                            v += 'px';
                                                }

                                                this.domElement.style.fontSize = v;

                                                return this;
                                    }
                        }, {
                                    key: 'FontFamily',
                                    value: function FontFamily(v) {

                                                this.domElement.style.fontFamily = v;

                                                return this;
                                    }
                        }, {
                                    key: 'Text',
                                    value: function Text(v) {
                                                this.domElement.innerText = v;

                                                return this;
                                    }
                        }, {
                                    key: 'Background',
                                    value: function Background(v) {
                                                this.domElement.style.background = v;

                                                return this;
                                    }
                        }, {
                                    key: 'Duration',
                                    value: function Duration(d) {

                                                this.duration = d;

                                                return this;
                                    }
                        }, {
                                    key: 'FadeTime',
                                    value: function FadeTime(fadeInTime, fadeOutTime) {

                                                this.fadeTime = {

                                                            in: fadeInTime || 250,

                                                            out: fadeOutTime || 250

                                                };

                                                return this;
                                    }
                        }, {
                                    key: 'Color',
                                    value: function Color(c) {
                                                this.domElement.style.color = c;

                                                return this;
                                    }
                        }, {
                                    key: 'TextColor',
                                    value: function TextColor(c) {
                                                this.domElement.style.color = c;

                                                return this;
                                    }
                        }, {
                                    key: 'Border',
                                    value: function Border(b) {
                                                this.domElement.style.border = b;
                                    }
                        }, {
                                    key: 'get_float_pixels',
                                    value: function get_float_pixels(float, dimen) {
                                                return Math.round(dimen * float) + 'px';
                                    }
                        }, {
                                    key: 'onComplete',
                                    value: function onComplete(fun) {

                                                this.complete = fun;

                                                return this;
                                    }
                        }, {
                                    key: 'show',
                                    value: function show(text, duration) {
                                                //create an html element

                                                document.body.append(this.domElement);

                                                var __inst = this;

                                                if (this.show_interval) {
                                                            clearInterval(this.show_interval);
                                                }

                                                this.show_interval = setInterval(function () {

                                                            var o = parseFloat(__inst.domElement.style.opacity);

                                                            if (o < 1.0) {
                                                                        o += 1.0 * (20 / __inst.fadeTime.in);

                                                                        __inst.domElement.style.opacity = o;
                                                            }
                                                }, 20);

                                                setTimeout(function () {

                                                            clearInterval(__inst.show_interval);

                                                            __inst.hide_interval = setInterval(function () {

                                                                        var o = parseFloat(__inst.domElement.style.opacity);

                                                                        if (o > 0) {
                                                                                    o -= 1.0 * (20 / __inst.fadeTime.out);

                                                                                    __inst.domElement.style.opacity = o;
                                                                        } else {

                                                                                    __inst.domElement.style.opacity = o;

                                                                                    if (typeof __inst.complete == 'function') {
                                                                                                __inst.complete();
                                                                                    }

                                                                                    clearInterval(__inst.hide_interval);
                                                                        }
                                                            }, 20);
                                                }, __inst.duration);

                                                return this;
                                    }
                        }, {
                                    key: 'update',
                                    value: function update() {}
                        }]);

                        return HtmlExtra;
            }();

            /**
             * Creates an instance of TextDisplay.
             *
             * <info-bit>Gamestack.TextDisplay shows text on-screen;
             * Composed of one or more HTML/Dom objects;
             * Uses chainable function-calls.
             * See the code examples below.</info-bit>
             *
             * <iframe style='width:400px; height:450px; overflow:hidden;' src='../client/examples/js-class/TextDisplay.html'> </iframe>
             *
             *
             * @param   {TextDisplay= | Object=} textDisplayArg the textDisplay instance OR data to use when creating this instance of TextDisplay
               *
             *@returns {TextDisplay} an instance of Gamestack.TextDisplay
             *
             * */

            var TextDisplay = function (_HtmlExtra) {
                        _inherits(TextDisplay, _HtmlExtra);

                        function TextDisplay() {
                                    var textDisplayArg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                                    _classCallCheck(this, TextDisplay);

                                    var args = textDisplayArg;

                                    var _this6 = _possibleConstructorReturn(this, (TextDisplay.__proto__ || Object.getPrototypeOf(TextDisplay)).call(this, args));

                                    if (!args) {
                                                args = {};
                                    }

                                    _this6.duration = args.duration || 5000;

                                    _this6.complete = args.complete || function () {};

                                    _this6.create_dom();
                                    return _this6;
                        }

                        _createClass(TextDisplay, [{
                                    key: 'create_dom',
                                    value: function create_dom() {
                                                this.domElement = document.createElement('SPAN');

                                                this.domElement.style.position = "fixed";

                                                this.domElement.style.color = this.color;

                                                this.domElement.style.padding = "5px";

                                                if (!this.targetBottom) {

                                                            this.domElement.style.top = Math.round(document.body.clientHeight * this.topFloat) + 'px';
                                                } else {

                                                            this.domElement.style.bottom = Math.round(document.body.clientHeight * this.bottomFloat) + 'px';
                                                }

                                                if (!this.targetRight) {

                                                            this.domElement.style.left = Math.round(document.body.clientWidth * this.leftFloat) + 'px';
                                                } else {

                                                            this.domElement.style.right = Math.round(document.body.clientWidth * this.rightFloat) + 'px';
                                                }

                                                this.domElement.style.width = '90%';

                                                this.domElement.style.left = "5%";

                                                this.domElement.style.height = 'auto';

                                                this.domElement.style.fontFamily = this.fontFamily;

                                                this.domElement.style.fontSize = this.fontSize;

                                                this.domElement.style.display = "block";

                                                this.domElement.style.textAlign = "center";

                                                this.domElement.style.zIndex = "9999";

                                                this.domElement.innerText = this.text;

                                                this.domElement.textContent = this.text;

                                                this.domElement.style.backgroundColor = 'transparent'; //always transparent

                                                this.domElement.style.opacity = this.fadeIn ? 0 : 1.0;

                                                this.domElement.id = Gamestack.create_id();
                                    }
                        }]);

                        return TextDisplay;
            }(HtmlExtra);

            Gamestack.TextDisplay = TextDisplay;

            /**
             * Creates an instance of ImageStatDisplay:
               * <info-bit>Gamestack.ImageStatDisplay displays item-counts or stats on the screen.
             * Composed of one or more HTML/Dom objects;
             * Uses chainable function-calls.
             * See the code examples below.</info-bit>
             *
             * <iframe style='width:400px; height:450px; overflow:hidden;' src='../client/examples/js-class/ImageStatDisplay.html'> </iframe>
             *
             *
             * @param   {ImageStatDisplay= | Object=} imageStatDisplayArgs the ImageStatDisplay instance OR data to use when creating this instance of ImageStatDisplay
               *
             *@returns {ImageStatDisplay} an instance of Gamestack.ImageStatDisplay
             *
             * */

            var ImageStatDisplay = function (_HtmlExtra2) {
                        _inherits(ImageStatDisplay, _HtmlExtra2);

                        function ImageStatDisplay() {
                                    var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                                    _classCallCheck(this, ImageStatDisplay);

                                    var _this7 = _possibleConstructorReturn(this, (ImageStatDisplay.__proto__ || Object.getPrototypeOf(ImageStatDisplay)).call(this, args));

                                    _this7.src = args.src || "__NONE";

                                    _this7.size = args.size || new Gamestack.Vector(50, 50);

                                    _this7.text_id = Gamestack.create_id();

                                    _this7.id = Gamestack.create_id();

                                    _this7.img_id = Gamestack.create_id();

                                    _this7.create_dom();

                                    return _this7;
                        }

                        _createClass(ImageStatDisplay, [{
                                    key: 'Src',
                                    value: function Src(src) {
                                                this.src = src;
                                                this.img.setAttribute('src', src);

                                                return this;
                                    }
                        }, {
                                    key: 'Source',
                                    value: function Source(src) //same as Src
                                    {
                                                this.src = src;
                                                this.img.setAttribute('src', src);

                                                return this;
                                    }
                        }, {
                                    key: 'Text',
                                    value: function Text(t) {

                                                var el = this.span;

                                                el.innerHTML = t;

                                                el.textContent = t;

                                                return this;
                                    }
                        }, {
                                    key: 'TextMarginTop',
                                    value: function TextMarginTop(v) {
                                                v = v + '';
                                                if (v.indexOf('px') == -1 && v.indexOf('em') == -1 && v.indexOf('%') == -1) {
                                                            //assume px:

                                                            v += 'px';
                                                }

                                                var el = this.span;

                                                el.style.marginTop = v;

                                                return this;
                                    }
                        }, {
                                    key: 'Size',
                                    value: function Size(x, y) {
                                                this.size = new Gamestack.Vector(x, y || x);

                                                this.img.style.width = this.size.x + 'px';

                                                this.img.style.height = 'auto';

                                                return this;
                                    }
                        }, {
                                    key: 'FontSize',
                                    value: function FontSize(v) {
                                                v = v + "";

                                                if (v.indexOf('px') == -1 && v.indexOf('em') == -1 && v.indexOf('%') == -1) {
                                                            //assume px:

                                                            v += 'px';
                                                }

                                                this.pixelFontSize = v;

                                                this.domElement.style.fontSize = v;

                                                return this;
                                    }
                        }, {
                                    key: 'FontFamily',
                                    value: function FontFamily(v) {

                                                this.domElement.style.fontFamily = v;

                                                return this;
                                    }
                        }, {
                                    key: 'setValue',
                                    value: function setValue(value) {
                                                document.getElementById(this.text_id);
                                                return this;
                                    }
                        }, {
                                    key: 'get_float_pixels',
                                    value: function get_float_pixels(float, dimen) {
                                                return Math.round(dimen * float) + 'px';
                                    }
                        }, {
                                    key: 'get_id',
                                    value: function get_id() {
                                                return this.id;
                                    }
                        }, {
                                    key: 'update',
                                    value: function update(v) {

                                                var e = document.getElementById(this.text_id);

                                                this.text = v + "";

                                                e.innerText = this.text;

                                                return this;
                                    }
                        }, {
                                    key: 'create_dom',
                                    value: function create_dom() {
                                                //create an html element

                                                this.domElement = document.createElement('DIV');

                                                this.domElement.style.position = 'fixed';

                                                this.domElement.setAttribute('class', 'gameStack-stats');

                                                this.img = document.createElement('IMG');

                                                this.img.id = this.img_id;

                                                this.img.src = this.src;

                                                this.img.style.width = this.size.x + 'px';

                                                this.img.style.height = 'auto';

                                                this.domElement.append(this.img);

                                                this.span = document.createElement('SPAN');

                                                this.span.id = this.text_id;

                                                this.span.style.padding = '2px';

                                                this.span.style.float = "right";

                                                this.span.style.height = this.size.y + 'px';

                                                this.span.style.display = 'table-cell';

                                                this.span.style.verticalAlign = 'middle';

                                                this.span.style.fontSize = 'inherit';

                                                this.span.textContent = this.text;

                                                this.domElement.append(this.span);

                                                this.domElement.style.color = this.color;

                                                //this.domElement.style.padding = "10px";

                                                this.domElement.style.fontFamily = this.fontFamily;

                                                this.domElement.style.fontSize = this.fontSize;

                                                this.domElement.style.zIndex = "9999";

                                                this.domElement.id = this.id;

                                                return this;
                                    }
                        }, {
                                    key: 'show',
                                    value: function show(x, y) {

                                                this.domElement.style.left = x + "px";

                                                this.domElement.style.top = y + "px";

                                                document.body.append(this.domElement);

                                                return this;
                                    }
                        }]);

                        return ImageStatDisplay;
            }(HtmlExtra);

            Gamestack.ImageStatDisplay = ImageStatDisplay;

            var Bar = function (_HtmlExtra3) {
                        _inherits(Bar, _HtmlExtra3);

                        function Bar(background, border) {
                                    _classCallCheck(this, Bar);

                                    var _this8 = _possibleConstructorReturn(this, (Bar.__proto__ || Object.getPrototypeOf(Bar)).call(this, {}));

                                    _this8.background = background;
                                    var e = document.createElement("SPAN");

                                    e.style.position = 'fixed';

                                    e.style.background = _this8.background;

                                    e.style.zIndex = "9999";

                                    e.style.backgroundSize = "100% 100%";

                                    e.style.backgroundPosition = "center bottom";

                                    if (border) {
                                                e.style.border = border;
                                    }

                                    _this8.domElement = e;

                                    return _this8;
                        }

                        _createClass(Bar, [{
                                    key: 'width',
                                    value: function width(w) {
                                                this.domElement.style.width = w;

                                                return this;
                                    }
                        }, {
                                    key: 'height',
                                    value: function height(h) {
                                                this.domElement.style.height = h;

                                                return this;
                                    }
                        }]);

                        return Bar;
            }(HtmlExtra);

            Gamestack.Bar = Bar;

            var BarFill = function (_HtmlExtra4) {
                        _inherits(BarFill, _HtmlExtra4);

                        function BarFill(background) {
                                    _classCallCheck(this, BarFill);

                                    var _this9 = _possibleConstructorReturn(this, (BarFill.__proto__ || Object.getPrototypeOf(BarFill)).call(this, {}));

                                    _this9.background = background;
                                    var e = document.createElement("SPAN");

                                    e.style.background = _this9.background;

                                    e.style.position = 'fixed';

                                    e.style.zIndex = "9995";

                                    _this9.domElement = e;

                                    return _this9;
                        }

                        _createClass(BarFill, [{
                                    key: 'width',
                                    value: function width(w) {
                                                this.domElement.style.width = w;

                                                return this;
                                    }
                        }, {
                                    key: 'height',
                                    value: function height(h) {
                                                this.domElement.style.height = h;

                                                return this;
                                    }
                        }]);

                        return BarFill;
            }(HtmlExtra);

            Gamestack.BarFill = BarFill;

            /**
             * Creates an instance of BarDisplay.
             * <info-bit>Gamestack.BarDisplay is an instantiable a health-bar;
             * Composed of one or more HTML/Dom objects;
             * Uses chainable function-calls.
             * See the code examples below.</info-bit>
             *
             * <iframe style='width:400px; height:450px; overflow:hidden;' src='../client/examples/js-class/BarDisplay.html'> </iframe>
             *
             *
             * @param   {BarDisplay= | Object=} barDisplayArgs the BarDisplay instance OR data to use when creating this instance of BarDisplay
               *
             *@returns {BarDisplay} an instance of Gamestack.BarDisplay
             *
             * */

            var BarDisplay = function (_HtmlExtra5) {
                        _inherits(BarDisplay, _HtmlExtra5);

                        //show BarDisplay as in 'health-bar'

                        function BarDisplay() {
                                    var barDisplayArgs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                                    _classCallCheck(this, BarDisplay);

                                    var args = barDisplayArgs || {};

                                    var _this10 = _possibleConstructorReturn(this, (BarDisplay.__proto__ || Object.getPrototypeOf(BarDisplay)).call(this, args));

                                    _this10.border = args.border || "none";

                                    _this10.inner = args.src || args.inner || 'darkorange';

                                    _this10.outer = args.outer_src || args.outer || 'transparent';

                                    _this10.width = args.width + '' || args.fill_width + '';

                                    if (_this10.width.indexOf('px') == -1) {
                                                _this10.width += 'px';
                                    }

                                    _this10.height = args.height + '' || args.fill_height + '';

                                    if (_this10.height.indexOf('px') == -1) {
                                                _this10.height += 'px';
                                    }

                                    _this10.color = args.color || args.fill_color;

                                    Gamestack.defSize();

                                    _this10.CreateDom();

                                    return _this10;
                        }

                        _createClass(BarDisplay, [{
                                    key: 'Top',
                                    value: function Top(v) {

                                                this.targetTop = this.get_float_pixels(v, document.body.clientHeight);

                                                for (var x in [this.innerDom, this.outerDom]) {
                                                            [this.innerDom, this.outerDom][x].Top(v);
                                                }

                                                return this;
                                    }
                        }, {
                                    key: 'Left',
                                    value: function Left(v) {

                                                this.targetLeft = this.get_float_pixels(v, document.body.clientWidth);

                                                for (var x in [this.innerDom, this.outerDom]) {
                                                            [this.innerDom, this.outerDom][x].Left(v);
                                                }

                                                return this;
                                    }
                        }, {
                                    key: 'Bottom',
                                    value: function Bottom(v) {

                                                this.targetBottom = this.get_float_pixels(v, document.body.clientHeight);

                                                for (var x in [this.innerDom, this.outerDom]) {
                                                            [this.innerDom, this.outerDom][x].Bottom(v);
                                                }

                                                return this;
                                    }
                        }, {
                                    key: 'Right',
                                    value: function Right(v) {

                                                this.targetRight = this.get_float_pixels(v, document.body.clientWidth);

                                                for (var x in [this.innerDom, this.outerDom]) {
                                                            [this.innerDom, this.outerDom][x].Right(v);
                                                }

                                                return this;
                                    }
                        }, {
                                    key: 'CreateDom',
                                    value: function CreateDom() {

                                                this.innerDom = new BarFill(this.inner).width(this.width || "80px").height(this.height || "10px");

                                                this.fill = this.innerDom;

                                                this.outerDom = new Bar(this.outer, this.border).width(this.width || "80px").height(this.height || "10px");

                                                this.bar = this.outerDom;
                                    }
                        }, {
                                    key: 'Inner',
                                    value: function Inner(color_or_src) {
                                                this.inner = color_or_src;

                                                this.CreateDom();

                                                return this;
                                    }
                        }, {
                                    key: 'Outer',
                                    value: function Outer(color_or_src) {
                                                this.outer = color_or_src;

                                                this.CreateDom();

                                                return this;
                                    }
                        }, {
                                    key: 'Border',
                                    value: function Border(css_border) {
                                                this.border = css_border;

                                                this.CreateDom();

                                                return this;
                                    }
                        }, {
                                    key: 'show',
                                    value: function show() {

                                                document.body.append(this.innerDom.domElement);

                                                document.body.append(this.outerDom.domElement);

                                                return this;
                                    }
                        }, {
                                    key: 'Show',
                                    value: function Show() {
                                                //same as lc show()

                                                document.body.append(this.innerDom.domElement);

                                                document.body.append(this.outerDom.domElement);

                                                return this;
                                    }
                        }, {
                                    key: 'Width',
                                    value: function Width(w) {
                                                this.portion_width(w);

                                                return this;
                                    }
                        }, {
                                    key: 'Height',
                                    value: function Height(h) {
                                                this.portion_height(h);

                                                return this;
                                    }
                        }, {
                                    key: 'get_float_pixels',
                                    value: function get_float_pixels(float, dimen) {
                                                return Math.round(dimen * float) + 'px';
                                    }
                        }, {
                                    key: 'portion_top',
                                    value: function portion_top(v) {

                                                this.fill.domElement.style.top = this.get_float_pixels(v || this.topFloat, Gamestack.HEIGHT);

                                                this.bar.domElement.style.top = this.get_float_pixels(v || this.topFloat, Gamestack.HEIGHT);
                                    }
                        }, {
                                    key: 'portion_left',
                                    value: function portion_left(v) {

                                                this.fill.domElement.style.left = this.get_float_pixels(v || this.leftFloat, Gamestack.WIDTH);

                                                this.bar.domElement.style.left = this.get_float_pixels(v || this.leftFloat, Gamestack.WIDTH);
                                    }
                        }, {
                                    key: 'portion_width',
                                    value: function portion_width(w) {

                                                this.fill.domElement.style.width = this.get_float_pixels(w || this.widthFloat, Gamestack.WIDTH);

                                                this.bar.domElement.style.width = this.get_float_pixels(w || this.widthFloat, Gamestack.WIDTH);
                                    }
                        }, {
                                    key: 'portion_height',
                                    value: function portion_height(h) {
                                                this.fill.domElement.style.height = this.get_float_pixels(h || this.heightFloat, Gamestack.HEIGHT);

                                                this.bar.domElement.style.height = this.get_float_pixels(h || this.heightFloat, Gamestack.HEIGHT);
                                    }
                        }, {
                                    key: 'update',
                                    value: function update(f) {
                                                this.fill.domElement.style.width = this.get_float_pixels(f || 0, parseFloat(this.bar.domElement.style.width));
                                    }
                        }]);

                        return BarDisplay;
            }(HtmlExtra);

            Gamestack.BarDisplay = BarDisplay;

            /**
             * Creates an instance of TextBubble.
             *
             * <info-bit>Gamestack.TextBubble is a text-bubble that shows on-screen, then fades.
             * Composed of one or more HTML/Dom objects;
             * Uses chainable function-calls.
             * See the code examples below.</info-bit>
             *
             *
             * @param   {Object} args the object of arguments
             * @param   {number} args.opacity the 0-1 starting opacity of the text-bubble
             * @param   {number} args.duration the duration in milliseconds that this text-bubble will stay visible / on-screen
             *@returns {TextBubble} an instance of Gamestack.BarDisplay
             * */

            var TextBubble = function (_HtmlExtra6) {
                        _inherits(TextBubble, _HtmlExtra6);

                        function TextBubble() //merely an element of text
                        {
                                    var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                                    _classCallCheck(this, TextBubble);

                                    var _this11 = _possibleConstructorReturn(this, (TextBubble.__proto__ || Object.getPrototypeOf(TextBubble)).call(this, args));

                                    _this11.opacity = args.opacity || 0.85;

                                    _this11.create_dom();

                                    _this11.duration = args.stay || args.duration || _this11.text.length * 100;

                                    return _this11;
                        }

                        _createClass(TextBubble, [{
                                    key: 'create_dom',
                                    value: function create_dom() {
                                                this.domElement = document.createElement('SPAN');

                                                this.domElement.setAttribute('class', 'speech-triangle');

                                                this.domElement.style.textAlign = "left"; //reset to left

                                                this.domElement.style.opacity = this.opacity;

                                                this.domElement.style.position = "fixed";

                                                this.domElement.style.color = this.color || 'white';

                                                if (this.backgroundColor == 'transparent') {
                                                            this.backgroundColor = 'black';
                                                }

                                                this.domElement.style.backgroundColor = this.backgroundColor || 'black';

                                                this.domElement.style.borderRadius = '0.4em';

                                                this.domElement.style.border = this.border || '1px outset snow';

                                                this.domElement.style.borderColor = this.borderColor || 'snow';

                                                this.domElement.style.padding = "5px";

                                                this.domElement.style.paddingBottom = "2px";

                                                this.domElement.style.height = 'auto'; //auto-wrap to text

                                                this.domElement.style.top = Math.round(document.body.clientHeight * this.topFloat) + 'px';

                                                this.domElement.style.left = Math.round(document.body.clientWidth * this.leftFloat) + 'px';

                                                this.domElement.style.width = 'auto';

                                                this.domElement.style.height = 'auto';

                                                this.domElement.style.fontFamily = this.fontFamily;

                                                this.domElement.style.fontSize = this.fontSize;

                                                this.domElement.style.display = "block";

                                                this.domElement.style.textAlign = "center";

                                                this.domElement.style.zIndex = "9999";

                                                this.domElement.innerText = this.text;

                                                this.domElement.textContent = this.text;

                                                this.domElement.style.opacity = this.fadeIn ? 0 : this.opacity;

                                                this.domElement.id = Gamestack.create_id();
                                    }
                        }]);

                        return TextBubble;
            }(HtmlExtra);

            Gamestack.TextBubble = TextBubble;
})();
;

var Level = function () {
            function Level() {
                        var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                        _classCallCheck(this, Level);

                        this.sprites = args.sprites || [];

                        this.backgrounds = args.backgrounds || [];

                        this.terrains = args.terrains || [];

                        this.interactives = args.interactives || [];

                        this.threes = args.threes || []; //3d objects
            }

            _createClass(Level, [{
                        key: 'add',
                        value: function add() {}
            }, {
                        key: 'add_all_to_game',
                        value: function add_all_to_game() {}
            }]);

            return Level;
}();

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

            Gamestack.Curves = Curves;

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

            Gamestack.Curves.InOut = inOutCurves;

            /**
             *
             * Creates an instance of Gamestack.Line
             *
             * --DevTODO --complete args & testing
             *
             * @param   {Object} args object of arguments
             * @param   {string} args.curve passed in as string, the key to a curveMethod, options are ['cubic', 'quartic', 'quadratic', 'quintic']
             * @param   {number} args.duration the millisecond duration of Line
             * @param   {Gamestack.Vector} args.position the position vector
             *
             * @param   {number} args.pointDisp the numeric point-distance
             *
             * @param   {Gamestack.Vector} args.size the size vector
             *
             * @param   {number} args.rotation the numeric rotation of -360 - 360
             *
             * @param   {number} args.growth the numeric growth
             *
             * -While a min and max Vector(x,y) will describe the grid of Animation frames, the termPoint will indicate the last frame to show on the grid (Animations may stop early on the 'grid')
             * @returns {Line} a Gamestack.Line object
             */

            var Line = function () {
                        function Line() {
                                    var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                                    _classCallCheck(this, Line);

                                    this.points = [];

                                    this.pointDisp = 1;

                                    this.size = args.size || new Gamestack.Vector(100, 100, 0);

                                    this.position = new Gamestack.Vector(0, 0, 0);
                        }

                        _createClass(Line, [{
                                    key: 'Rot',
                                    value: function Rot(r) {

                                                this.rotation = r;

                                                return this;
                                    }
                        }, {
                                    key: 'Pos',
                                    value: function Pos(p) {

                                                this.position = p;

                                                if (typeof p == 'number') {
                                                            this.position = new Gamestack.Vector(p, p, p);
                                                } else {

                                                            this.position = p;
                                                }

                                                return this;
                                    }
                        }, {
                                    key: 'Size',
                                    value: function Size(s) {

                                                this.size = s;

                                                if (typeof s == 'number') {
                                                            this.size = new Gamestack.Vector(s, s, s);
                                                }

                                                return this;
                                    }
                        }, {
                                    key: 'Dispersion',
                                    value: function Dispersion(num) {
                                                this.pointDisp = num;
                                                return this;
                                    }
                        }, {
                                    key: 'Curve',
                                    value: function Curve(c, size) {
                                                this.curve = c;

                                                this.curveMethod = Gamestack.Curves.InOut[this.curve.toLowerCase()];

                                                if (c) this.curve_size = new Gamestack.Vector(size);

                                                return this;
                                    }
                        }, {
                                    key: 'CurveSize',
                                    value: function CurveSize(s) {

                                                if (typeof s == 'number') {
                                                            this.curve_size = new Gamestack.Vector(s, s, s);
                                                } else {

                                                            this.curve_size = s;
                                                }

                                                return this;
                                    }
                        }, {
                                    key: 'Duration',
                                    value: function Duration(d) {
                                                this.duration = d;

                                                return this;
                                    }
                        }, {
                                    key: 'Fill',
                                    value: function Fill() {

                                                var current_point = new Gamestack.Vector(0, 0, 0);

                                                for (var x = 0; x <= Math.abs(this.size.x); x++) {

                                                            var position = new Gamestack.Vector(x, 0, 0);

                                                            if (current_point.trig_distance_xy(position) >= this.pointDisp) {
                                                                        this.points.push(new Gamestack.Vector(position));

                                                                        current_point = new Gamestack.Vector(position);
                                                            }
                                                }

                                                this.TransposeByRotation(this.rotation);

                                                return this;
                                    }
                        }, {
                                    key: 'TransposeByRotation',
                                    value: function TransposeByRotation(rotation) {

                                                this.rotation = rotation;

                                                function rotate(cx, cy, x, y, angle) {
                                                            var radians = Math.PI / 180 * angle,
                                                                cos = Math.cos(radians),
                                                                sin = Math.sin(radians),
                                                                nx = cos * (x - cx) + sin * (y - cy) + cx,
                                                                ny = cos * (y - cy) - sin * (x - cx) + cy;
                                                            return new Gamestack.Vector(nx, ny);
                                                }

                                                for (var x = 0; x < this.points.length; x++) {

                                                            var p = this.points[x];

                                                            var np = rotate(this.position.x, this.position.y, p.x, p.y, this.rotation);

                                                            this.points[x] = np;
                                                }

                                                return this;
                                    }
                        }, {
                                    key: 'Highlight',
                                    value: function Highlight(sprite, ctx, gameWindow) {

                                                this.highlight_sprites = this.highlight_sprites || [];

                                                ctx = ctx || Gamestack.ctx;

                                                var points = this.points;

                                                gameWindow = gameWindow || Gamestack.game_windows[0];

                                                for (var x in points) {

                                                            console.log(points[x]);

                                                            if (!this.highlight_sprites[x]) {
                                                                        this.highlight_sprites[x] = gameWindow.add(new Gamestack.Sprite(sprite), ctx);
                                                            }

                                                            var point = points[x];

                                                            this.highlight_sprites[x].position = new Gamestack.Vector(point.sub(sprite.size.div(2)));
                                                }

                                                return this;
                                    }
                        }, {
                                    key: 'RemoveHighlight',
                                    value: function RemoveHighlight(sprite, ctx, gameWindow) {
                                                gameWindow = gameWindow || Gamestack.game_windows[0];

                                                for (var x in this.highlight_sprites) {
                                                            gameWindow.remove(this.highlight_sprites[x]);
                                                }

                                                this.highlight_sprites = [];

                                                return this;
                                    }
                        }]);

                        return Line;
            }();

            Gamestack.Line = Line;

            /**
             *
             * Creates an instance of Gamestack.WaveLine
             * --A curving or wavy line, composed of iterations, which can reduce or grow in size-of-wave
             * --DevTODO --complete args & testing
             *
             * @returns {WaveLine} a Gamestack.WaveLine object
             */

            var WaveLine = function (_Line) {
                        _inherits(WaveLine, _Line);

                        function WaveLine(pos, size, curve_key) {
                                    _classCallCheck(this, WaveLine);

                                    var args = {};

                                    if (typeof size == 'number' || size instanceof Gamestack.Vector) {
                                                var _this12 = _possibleConstructorReturn(this, (WaveLine.__proto__ || Object.getPrototypeOf(WaveLine)).call(this, {}));
                                    } else if (size instanceof Object) {
                                                var _this12 = _possibleConstructorReturn(this, (WaveLine.__proto__ || Object.getPrototypeOf(WaveLine)).call(this, size));

                                                args = size;
                                    }

                                    _this12.Pos(pos);

                                    _this12.Size(size);

                                    _this12.curve_options = Curves; //Curves Object (of functions)

                                    curve_key = curve_key || args.curve_key || "quadratic";

                                    _this12.curve = curve_key ? curve_key.toLowerCase() : "quadratic";

                                    _this12.curve_options = ['cubic', 'quartic', 'quadratic', 'quintic', 'sine'];

                                    _this12.curveMethod = Gamestack.Curves.InOut[_this12.curve.toLowerCase()];

                                    _this12.points = args.points || [];

                                    _this12.is_highlighted = args.is_highlighted || false;

                                    _this12.offset = args.offset || new Gamestack.Vector(0, 0, 0);

                                    _this12.pointDisp = args.pointDisp || 5;

                                    _this12.rotation = args.rotation || 0;

                                    _this12.iterations = args.iterations || 1;

                                    _this12.max_size = args.max_size || _this12.size || new Gamestack.Vector(5000, 5000);

                                    _this12.growth = args.growth || 1.0;

                                    return _possibleConstructorReturn(_this12);
                        }

                        _createClass(WaveLine, [{
                                    key: 'Max',
                                    value: function Max(p) {

                                                this.target = p;

                                                if (typeof p == 'number') {
                                                            this.target = new Gamestack.Vector(p, p, p);
                                                } else {

                                                            this.target = p;
                                                }

                                                this.max = this.target; //'max' is synonymous with 'target'

                                                return this;
                                    }
                        }, {
                                    key: 'Min',
                                    value: function Min(p) {

                                                this.position = p;

                                                if (typeof p == 'number') {
                                                            this.position = new Gamestack.Vector(p, p, p);
                                                } else {

                                                            this.tposition = p;
                                                }

                                                this.min = this.position; //'max' is synonymous with 'target'

                                                return this;
                                    }
                        }, {
                                    key: 'Decay',
                                    value: function Decay(n) {
                                                if (n < -1.0) n = -1.0;

                                                if (n > 1.0) {
                                                            n = 1.0;
                                                }

                                                this.growth = 1.0 - n;

                                                return this;
                                    }
                        }, {
                                    key: 'next',
                                    value: function next(position) {

                                                var found = false;

                                                for (var x = 0; x < this.points.length; x++) {

                                                            if (position.equals(this.points[x]) && x < this.points.length - 1) {
                                                                        found = true;
                                                                        return new Gamestack.Vector(this.points[x + 1]);
                                                            }

                                                            if (x == this.points.length - 1 && !found) {

                                                                        return new Gamestack.Vector(this.points[0]);
                                                            }
                                                }
                                    }
                        }, {
                                    key: 'getGraphCanvas',
                                    value: function getGraphCanvas(curveCall, existing_canvas) {

                                                var canvas = existing_canvas || document.createElement('canvas');

                                                canvas.style.position = "relative";

                                                canvas.id = 'curve-display';

                                                canvas.setAttribute('class', 'motion-curve');

                                                canvas.width = 180;
                                                canvas.height = 100;

                                                canvas.style.background = "black";

                                                var context = canvas.getContext('2d');
                                                context.fillStyle = "rgb(0,0,0)";
                                                context.fillRect(0, 0, 180, 100);

                                                context.lineWidth = 0.5;
                                                context.strokeStyle = "rgb(230,230,230)";

                                                context.beginPath();
                                                context.moveTo(0, 20);
                                                context.lineTo(180, 20);
                                                context.moveTo(0, 80);
                                                context.lineTo(180, 80);
                                                context.closePath();
                                                context.stroke();

                                                context.lineWidth = 2;
                                                context.strokeStyle = "rgb(255,127,127)";

                                                var position = { x: 0, y: 80 };
                                                var position_old = { x: 0, y: 80 };

                                                this.test_graph_size = new Gamestack.Vector(185, 80 - 20);

                                                var points = this.get_line_segment(this.test_graph_size, 5, curveCall);

                                                for (var x in points) {
                                                            var position = new Gamestack.Vector(points[x].x, this.test_graph_size.y + 20 - points[x].y);

                                                            context.beginPath();
                                                            context.moveTo(position_old.x, position_old.y);
                                                            context.lineTo(position.x, position.y);
                                                            context.closePath();
                                                            context.stroke();

                                                            position_old.x = position.x;
                                                            position_old.y = position.y;
                                                }

                                                return canvas;
                                    }
                        }, {
                                    key: 'Fill',
                                    value: function Fill() {
                                                this.size = new Gamestack.Vector(this.size);

                                                var __inst = this;

                                                this.points = [];

                                                var current_point = new Gamestack.Vector(this.position),
                                                    yTrack = 0;

                                                var x = 1,
                                                    max_recursion = 300;

                                                var position = current_point;

                                                var dist = new Gamestack.Vector(20, 20, 20);

                                                var size = new Gamestack.Vector(this.curve_size || this.size);

                                                while (Math.abs(position.x) <= Math.abs(this.max_size.x) && size.x > 2 && dist.x > 2) {

                                                            position = new Gamestack.Vector(current_point);

                                                            var target = new Gamestack.Vector(position.add(size)),
                                                                start = new Gamestack.Vector(position),
                                                                curveMethod = this.curveMethod,
                                                                ptrack = new Gamestack.Vector(start);

                                                            for (position.x = position.x; position.x < Math.abs(target.x); position.x += 1) {

                                                                        dist = position.sub(start);

                                                                        var pct = dist.x / size.x;

                                                                        position.y = start.y + curveMethod(pct) * (x % 2 == 0 ? size.y : size.y * -1);

                                                                        //  position = position.round();

                                                                        if (current_point.trig_distance_xy(position) >= this.pointDisp) {

                                                                                    var p = new Gamestack.Vector(position);

                                                                                    this.points.push(p);

                                                                                    current_point = new Gamestack.Vector(position);
                                                                        }
                                                            }

                                                            size = size.mult(this.growth);

                                                            if (x > max_recursion) {
                                                                        return console.error('Too much recursion in SwagLine');
                                                            }

                                                            x += 1;
                                                }

                                                this.TransposeByRotation(this.rotation);

                                                return this;
                                    }
                        }, {
                                    key: 'Rotate',
                                    value: function Rotate(rotation) {
                                                this.rotation = rotation;

                                                if (_typeof(this.rotation) == 'object') {

                                                            this.rotation = this.rotation.x;
                                                }

                                                return this;
                                    }
                        }]);

                        return WaveLine;
            }(Line);

            Gamestack.WaveLine = WaveLine;

            /**
             * Creates an instance of Gamestack.ShapeLine
             * --A shaped-line, in shape of a square, circle, or equilateral-polygon with specified number of sides
             *
             * --DevTODO --complete class & docs: args & testing
             *
             * @returns {ShapeLine} a Gamestack.ShapeLine object
             */

            var ShapeLine = function (_Line2) {
                        _inherits(ShapeLine, _Line2);

                        function ShapeLine() {
                                    var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                                    _classCallCheck(this, ShapeLine);

                                    var _this13 = _possibleConstructorReturn(this, (ShapeLine.__proto__ || Object.getPrototypeOf(ShapeLine)).call(this, args));

                                    _this13.targetTotalPoints = args.total || 200;

                                    return _this13;
                        }

                        _createClass(ShapeLine, [{
                                    key: 'Total',
                                    value: function Total(t) {

                                                this.targetTotalPoints = t;
                                                return this;
                                    }
                        }, {
                                    key: 'Eliptical',
                                    value: function Eliptical(pos, size, rotation) {
                                                this.Pos(pos || this.position);

                                                this.Size(size || this.size);

                                                this.Rot(rotation || this.rotation);

                                                function fill(elipse) {

                                                            elipse.points = [];

                                                            var center = elipse.position.add(elipse.size.div(2));

                                                            var current_point = new Gamestack.Vector(0, 0, 0);

                                                            var a = Math.abs(elipse.size.x / 2),
                                                                b = Math.abs(elipse.size.y / 2);

                                                            var perim = 2 * Math.PI * Math.sqrt(a * a + b * b);

                                                            var step = Math.round(2 * Math.PI / elipse.targetTotalPoints * 1000) / 1000;

                                                            for (var i = 0 * Math.PI; i < 2 * Math.PI; i += step) {

                                                                        var p = new Gamestack.Vector(Math.round(center.x - a * Math.cos(i)), Math.round(center.y + b * Math.sin(i)));

                                                                        elipse.points.push(new Gamestack.Vector(p));

                                                                        current_point = new Gamestack.Vector(p);
                                                            }
                                                }

                                                fill(this);

                                                this.Fill = function () {

                                                            fill(this);

                                                            return this;
                                                };

                                                return this;
                                    }
                        }, {
                                    key: 'Quadrilateral',
                                    value: function Quadrilateral(pos, size, rotation) {
                                                this.Pos(pos || this.position);

                                                this.Size(size || this.size);

                                                this.Rot(rotation || this.rotation);

                                                function fill(quad) {

                                                            quad.points = [];

                                                            var current_point = new Gamestack.Vector(0, 0, 0);

                                                            var perim = 2 * quad.size.x + 2 * quad.size.y,
                                                                stepX = quad.size.x / (quad.targetTotalPoints * (quad.size.x / perim)),
                                                                stepY = quad.size.y / (quad.targetTotalPoints * (quad.size.y / perim));

                                                            for (var x = 0; x < quad.size.x; x += stepX) {
                                                                        var p1 = new Gamestack.Vector(x, 0).add(quad.position);

                                                                        quad.points.push(new Gamestack.Vector(p1));
                                                            }

                                                            for (var y = 0; y < quad.size.y; y += stepY) {
                                                                        var p1 = new Gamestack.Vector(quad.size.x, y).add(quad.position);

                                                                        quad.points.push(new Gamestack.Vector(p1));
                                                            }

                                                            for (var x = quad.size.x; x >= 0; x -= stepX) {
                                                                        var p1 = new Gamestack.Vector(x, quad.size.y).add(quad.position);

                                                                        quad.points.push(new Gamestack.Vector(p1));
                                                            }

                                                            for (var y = quad.size.y; y >= 0; y -= stepY) {
                                                                        var p1 = new Gamestack.Vector(0, y).add(quad.position);

                                                                        quad.points.push(new Gamestack.Vector(p1));
                                                            }
                                                }

                                                fill(this);

                                                this.Fill = function () {

                                                            fill(this);

                                                            return this;
                                                };

                                                return this;
                                    }
                        }]);

                        return ShapeLine;
            }(Line);

            ;

            Gamestack.ShapeLine = ShapeLine;
})();;

(function () {
            console.log('Motion class... creating');

            /*
             * TweenMotion constructors:
             *
             * new TweenMotion({motion_curve, distance(Vector), rotation(Vector)})
             *
             *  new Motion(new JaggedLine())
             *
             * */

            var Motion = function (_GSO) {
                        _inherits(Motion, _GSO);

                        function Motion() {
                                    var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                                    _classCallCheck(this, Motion);

                                    var _this14 = _possibleConstructorReturn(this, (Motion.__proto__ || Object.getPrototypeOf(Motion)).call(this, args));

                                    _this14.state_save = false;

                                    _this14.parent = args.parent || Gamestack.Modifiers.applyParentalArgs(_this14, args);

                                    Gamestack.Modifiers.informable(_this14, args);

                                    Gamestack.Modifiers.tweenable(_this14, args);

                                    return _this14;
                        }

                        _createClass(Motion, [{
                                    key: 'restoreState',
                                    value: function restoreState() {
                                                for (var x in this.state_save) {
                                                            this.parent[x] = this.state_save[x];
                                                }
                                    }
                        }]);

                        return Motion;
            }(GSO //extends GSO || GamestackOverrideable
            );

            ;

            Gamestack.Motion = Motion;

            /**
             * Creates an instance of TweenMotion object.
             * <info>Gamestack.TweenMotion animates smooth changes in position, rotation, and/or size within a specified time <info>
             * <iframe style='width:400px; height:450px; overflow:hidden;' src='../client/examples/js-class/TweenMotion.html'> </iframe>
             *
             * @param   {Object} Dev-TODO : define arguments for this class
             *
             * @returns {TweenMotion} a Gamestack.TweenMotion object
             */

            var TweenMotion = function (_Motion) {
                        _inherits(TweenMotion, _Motion);

                        //tween the state of an object, including 'position', 'size', and 'rotation' --rotation.x, etc..

                        function TweenMotion() {
                                    var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                                    _classCallCheck(this, TweenMotion);

                                    var _this15 = _possibleConstructorReturn(this, (TweenMotion.__proto__ || Object.getPrototypeOf(TweenMotion)).call(this, args));

                                    _this15.getArg = $Q.getArg;

                                    _this15.transition = args.trans || args.transition || "literal" || "add";
                                    _this15.transition_options = ['literal', 'add'];

                                    if (typeof args.curve == 'string') {
                                                args.curve_string = args.curve;
                                    }

                                    _this15.setTweenCurve(args.curve_string);

                                    _this15.target = false;

                                    _this15.target = args.target || {};

                                    _this15.curvesList = _this15.curvesToArray(); //Tween.Easing

                                    _this15.duration = Gamestack.getArg(args, 'duration', 500);

                                    _this15.delay = Gamestack.getArg(args, 'delay', 0);
                                    return _this15;
                        }

                        _createClass(TweenMotion, [{
                                    key: 'targetCheck',
                                    value: function targetCheck(parent) {

                                                if (!this.target.position) {
                                                            this.target.position = new Gamestack.Vector();
                                                }

                                                if (!this.target.size) {
                                                            this.target.size = new Gamestack.Vector();
                                                }

                                                if (!this.target.rotation) {
                                                            this.target.rotation = new Gamestack.Vector();
                                                }
                                    }
                        }, {
                                    key: 'AddPos',
                                    value: function AddPos(x, y) {
                                                this.transition = 'add';

                                                this.target.position = new Gamestack.Vector(x, y);

                                                return this;
                                    }
                        }, {
                                    key: 'Duration',
                                    value: function Duration(d) {
                                                this.duration = d;

                                                return this;
                                    }
                        }, {
                                    key: 'engage',
                                    value: function engage() {

                                                var __inst = this;

                                                __inst.call_on_run(); //call any on-run extensions

                                                this.tweens = [];

                                                var object = this.parent;

                                                this.targetCheck();

                                                if (!this.state_save) {

                                                            this.state_save = {
                                                                        position: new Gamestack.Vector(this.parent.position),
                                                                        rotation: new Gamestack.Vector(this.parent.rotation),
                                                                        size: new Gamestack.Vector(this.parent.size)
                                                            };
                                                }

                                                if (this.parent && !this.target) {

                                                            this.target = {

                                                                        position: new Gamestack.Vector(this.parent.position),

                                                                        rotation: new Gamestack.Vector(this.parent.rotation),

                                                                        size: new Gamestack.Vector(this.parent.size)

                                                            };
                                                } else if (!this.target) {

                                                            this.target = {

                                                                        position: new Gamestack.Vector(),

                                                                        rotation: new Gamestack.Vector(),

                                                                        size: new Gamestack.Vector()

                                                            };
                                                };

                                                if (this.transition !== 'literal') {
                                                            //transition is assumed to be additive

                                                            this.target.position = object.position.add(this.target.position);
                                                            this.target.rotation = object.rotation.add(this.target.rotation);
                                                            this.target.size = object.size.add(this.target.size);
                                                };

                                                //we always have a targetPosition
                                                //construct a tween::
                                                this.tweens.push(new TWEEN.Tween(object.position).easing(__inst.curve || __inst.motion_curve).to(this.target.position, __inst.duration).onUpdate(function () {
                                                            //console.log(objects[0].position.x,objects[0].position.y);


                                                }).onComplete(function () {
                                                            //console.log(objects[0].position.x, objects[0].position.y);
                                                            if (__inst.complete) {

                                                                        __inst.call_on_complete(); //only call once
                                                            }
                                                }));

                                                this.tweens.push(new TWEEN.Tween(object.rotation).easing(__inst.curve || __inst.motion_curve).to(this.target.rotation, __inst.duration).onUpdate(function () {
                                                            //console.log(objects[0].position.x,objects[0].position.y);


                                                }).onComplete(function () {
                                                            //console.log(objects[0].position.x, objects[0].position.y);
                                                            if (__inst.complete) {

                                                                        __inst.call_on_complete(); //only call once
                                                            }
                                                }));

                                                this.tweens.push(new TWEEN.Tween(object.size).easing(__inst.curve || __inst.motion_curve).to(this.target.size, __inst.duration).onUpdate(function () {
                                                            //console.log(objects[0].position.x,objects[0].position.y);


                                                }).onComplete(function () {
                                                            //console.log(objects[0].position.x, objects[0].position.y);
                                                            if (__inst.complete) {

                                                                        __inst.call_on_complete(); //only call once
                                                            }
                                                }));

                                                for (var x = 0; x < this.tweens.length; x++) {

                                                            this.tweens[x].start();
                                                };
                                    }

                                    /**
                                     * start the Motion transition
                                     *
                                     * @function
                                     * @memberof Motion
                                     *
                                     **********/

                        }, {
                                    key: 'start',
                                    value: function start() {

                                                this.engage();
                                    }

                                    // obj.getGraphCanvas( $(c.domElement), value.replace('_', '.'), TWEEN.Easing[parts[0]][parts[1]] );

                        }, {
                                    key: 'getGraphCanvas',
                                    value: function getGraphCanvas(t, f, c) {

                                                var canvas = c || document.createElement('canvas');

                                                canvas.style.position = "relative";

                                                canvas.id = 'curve-display';

                                                canvas.setAttribute('class', 'motion-curve');

                                                canvas.width = 180;
                                                canvas.height = 100;

                                                canvas.style.background = "black";

                                                var context = canvas.getContext('2d');
                                                context.fillStyle = "rgb(0,0,0)";
                                                context.fillRect(0, 0, 180, 100);

                                                context.lineWidth = 0.5;
                                                context.strokeStyle = "rgb(230,230,230)";

                                                context.beginPath();
                                                context.moveTo(0, 20);
                                                context.lineTo(180, 20);
                                                context.moveTo(0, 80);
                                                context.lineTo(180, 80);
                                                context.closePath();
                                                context.stroke();

                                                context.lineWidth = 2;
                                                context.strokeStyle = "rgb(255,127,127)";

                                                var position = { x: 5, y: 80 };
                                                var position_old = { x: 5, y: 80 };

                                                new TWEEN.Tween(position).to({ x: 175 }, 2000).easing(TWEEN.Easing.Linear.None).start();
                                                new TWEEN.Tween(position).to({ y: 20 }, 2000).easing(f).onUpdate(function () {

                                                            context.beginPath();
                                                            context.moveTo(position_old.x, position_old.y);
                                                            context.lineTo(position.x, position.y);
                                                            context.closePath();
                                                            context.stroke();

                                                            position_old.x = position.x;
                                                            position_old.y = position.y;
                                                }).start();

                                                return canvas;
                                    }
                        }, {
                                    key: 'getTweenPoints',
                                    value: function getTweenPoints(size, line) {

                                                //must have line.minPointDist

                                                var curve = line.curve,
                                                    duration = line.duration;

                                                var points = [];

                                                var position = new Vector(line.position);

                                                var target = new Vector(position).add(size);

                                                var start = new Vector(position);

                                                var dist = new Vector(0, 0, 0);

                                                var ptrack;

                                                var easeInOutQuad = function easeInOutQuad(t) {
                                                            return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
                                                };

                                                return points;

                                                var t1 = new TWEEN.Tween(position).to({ x: target.x }, 2000).easing(TWEEN.Easing.Linear.None).start();

                                                if (t2) {
                                                            t2.stop();
                                                }

                                                var t2 = new TWEEN.Tween(position).to({ y: target.y }, 2000).easing(curve).onUpdate(function () {

                                                            if (ptrack) {

                                                                        dist = ptrack.sub(p);

                                                                        var d = Math.sqrt(dist.x * dist.x + dist.y * dist.y);

                                                                        if (d >= line.minPointDist) {

                                                                                    points.push(p);

                                                                                    ptrack = new Vector(p);
                                                                        }
                                                            } else {
                                                                        ptrack = p;

                                                                        points.push(p);
                                                            }
                                                            ;
                                                }).onComplete(function () {

                                                            // alert(line.minPointDist);

                                                            line.first_segment = points.slice();

                                                            var extendLinePoints = function extendLinePoints(segment, points, ix) {

                                                                        var next_points = segment.slice();

                                                                        var last_point = points[points.length - 1];

                                                                        for (var x = 0; x < next_points.length; x++) {

                                                                                    var sr = new Vector(Gamestack.GeoMath.rotatePointsXY(line.size.x * ix, line.size.y * ix, line.rotation));

                                                                                    var p = next_points[x].add(sr);

                                                                                    if (points.indexOf(p) <= -1) {

                                                                                                points.push(p);
                                                                                    }
                                                                        }
                                                            };

                                                            for (var x = 0; x <= line.curve_iterations; x++) {
                                                                        if (x > 1) {

                                                                                    extendLinePoints(line.first_segment, line.points, x - 1);
                                                                        }
                                                            }
                                                }).start();

                                                return points;
                                    }
                        }]);

                        return TweenMotion;
            }(Motion);

            Gamestack.TweenMotion = TweenMotion;

            /**
             * Creates an instance of LineMotion.
             *
             * <info>Gamestack.LineMotion animates smooth motion over the points of Gamestack.Line</info>
             *
             * <br/>
             *
             * <iframe style='width:400px; height:450px; overflow:hidden;' src='../client/examples/js-class/LineMotion.html'> </iframe>
               *
             * @param   {Object} Dev-TODO : define arguments for this class
             *
             * @returns {LineMotion} a Gamestack.LineMotion object
             */

            var LineMotion = function (_Motion2) {
                        _inherits(LineMotion, _Motion2);

                        function LineMotion() {
                                    var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                                    _classCallCheck(this, LineMotion);

                                    var _this16 = _possibleConstructorReturn(this, (LineMotion.__proto__ || Object.getPrototypeOf(LineMotion)).call(this, args));

                                    Gamestack.Modifiers.spatial(_this16);

                                    _this16.total = args.total || 20;

                                    _this16.Size(args.size || new Gamestack.Vector(200, 200));

                                    _this16.Pos(args.size || new Gamestack.Vector(200, 200));

                                    _this16.Rot(args.size || new Gamestack.Vector(200, 200));

                                    return _this16;
                        }

                        _createClass(LineMotion, [{
                                    key: 'Total',
                                    value: function Total(t) {
                                                this.total = t;
                                                return this;
                                    }
                        }, {
                                    key: 'Highlight',
                                    value: function Highlight(spr, ctx, gameWindow) {
                                                this.line.Highlight(spr, ctx, gameWindow);

                                                return this;
                                    }
                        }, {
                                    key: 'Eliptical',
                                    value: function Eliptical(pos, size) {
                                                size = size || this.size;

                                                pos = pos || this.position;

                                                this.line = new Gamestack.ShapeLine().Total(this.total || 20).Eliptical(pos, size, 0).Fill();

                                                return this;
                                    }
                        }, {
                                    key: 'Box',
                                    value: function Box(pos, size) {
                                                size = size || this.size;

                                                pos = pos || this.position;

                                                this.line = new Gamestack.ShapeLine().Total(this.total || 20).Quadrilateral(pos, size, 0).Fill();

                                                return this;
                                    }
                        }, {
                                    key: 'QuadraticWave',
                                    value: function QuadraticWave(pos, size) {
                                                size = size || this.size;

                                                pos = pos || this.position;

                                                this.line = new Gamestack.WaveLine(pos, size, 'quadratic').Fill();

                                                return this;
                                    }
                        }, {
                                    key: 'CubicWave',
                                    value: function CubicWave(pos, size) {
                                                size = size || this.size;

                                                pos = pos || this.position;

                                                this.line = new Gamestack.WaveLine(pos, size, 'cubic').Fill();

                                                return this;
                                    }
                        }, {
                                    key: 'QuinticWave',
                                    value: function QuinticWave(pos, size) {
                                                size = size || this.size;

                                                pos = pos || this.position;

                                                this.line = new Gamestack.WaveLine(pos, size, 'quintic').Fill();

                                                return this;
                                    }
                        }]);

                        return LineMotion;
            }(Motion);

            Gamestack.LineMotion = LineMotion;
})();

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

                        this.animation = Gamestack.getArg(args, 'animation', new Animation());

                        this.parent_id = args.parent_id || args.object_id || "__blank"; //The parent object

                        this.name = Gamestack.getArg(args, 'name', "__");

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

                        this.description = Gamestack.getArg(args, 'description', false);

                        this.duration = Gamestack.getArg(args, 'duration', 500);

                        this.delay = Gamestack.getArg(args, 'delay', 0);

                        this.position = Gamestack.getArg(args, 'position', new Vector(0, 0, 0));

                        this.motion_curve = Gamestack.getArg(args, 'motion_curve', TWEEN.Easing.Linear.None);

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
                        key: 'onComplete',
                        value: function onComplete(fun) {
                                    this.complete = fun;
                        }
            }, {
                        key: 'onCollide',
                        value: function onCollide(fun) {
                                    this.collide = fun;
                        }
            }, {
                        key: 'setAnimation',
                        value: function setAnimation(anime) {

                                    this.animation = anime;

                                    return this;
                        }
            }, {
                        key: 'setMotionCurve',
                        value: function setMotionCurve(c) {

                                    this.motion_curve = c;

                                    return this;
                        }
            }, {
                        key: 'kill_one',
                        value: function kill_one() {

                                    var spr = this.sprites[this.sprites.length - 1];

                                    Gamestack.remove(spr);
                        }
            }, {
                        key: 'onRun',
                        value: function onRun(caller, callkey) {

                                    this.run_ext = this.run_ext || [];

                                    this.run_ext.push({ caller: caller, callkey: callkey });
                        }
            }, {
                        key: 'shoot_basic',
                        value: function shoot_basic(position, size, rot_offset, speed, numberShots, disp) {

                                    var __playerInst = this;

                                    var bx = position.x,
                                        by = position.y,
                                        bw = size.x,
                                        bh = size.y;

                                    var half = numberShots / 2;

                                    for (var x = half * -1; x <= half; x++) {
                                                var shot = Gamestack.add(new Sprite({

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
                        key: 'fire',
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
                                                                        Gamestack.remove(sprite);
                                                            }
                                                }
                                    });

                                    Gamestack.add(sprite);

                                    this.sprites.push(sprite);
                        }
            }]);

            return Projectile;
}();

Gamestack.Projectile = Projectile;

;

var Shapes = {

            circle: function circle(radius, freq) {

                        return {

                                    radius: radius,

                                    points: [],

                                    fill: function fill(center, freq) {}

                        };
            },

            square: function square(s, freq) {
                        console.error('STILL NEED TO BUILD THIS SQUARE IN GS-API');

                        return {

                                    size: new Gamestack.Vector(s, s),

                                    width: w,

                                    height: h,

                                    freq: freq,

                                    points: [],

                                    fill: function fill(start, freq) {}
                        };
            },

            rect: function rect(w, h, freq) {
                        console.error('STILL NEED TO BUILD THIS TRIANGLE');

                        return {

                                    size: new Gamestack.Vector(w, h),

                                    width: w,

                                    height: h,

                                    freq: freq,

                                    points: [],

                                    fill: function fill(start, freq) {}
                        };
            },

            triangle: function triangle(base, h, freq) {

                        console.error('STILL NEED TO BUILD THIS TRIANGLE');

                        return {

                                    base: base,

                                    height: height,

                                    freq: freq,

                                    points: [],

                                    fill: function fill(start, freq) {}
                        };
            }
};

Gamestack.Shapes = Shapes;
;

/**
 * Creates an instance of Shot.
 * <info-bit>Shot object fires a moving-animation from a sprite </info-bit>
 *
 * @param   {string} name the name of this Shot
 * @param   {GameImage | Animation} imageOrAnimation the GameImage or Animation to apply for this Shot
 * @returns {Shot} a Gamestack.Shot object
 */

var Shot = function () {
            function Shot(name, imageOrAnimation) {
                        _classCallCheck(this, Shot);

                        this.name = name || 'No-Name';

                        if (imageOrAnimation instanceof Gamestack.GameImage) {
                                    this.anime = new Animation(imageOrAnimation);
                        } else if (imageOrAnimation instanceof Gamestack.Animation) {
                                    this.anime = imageOrAnimation;
                        }

                        this.rotation = 0;

                        this.rot_disp = 0;

                        var args = name instanceof Object ? name : {};

                        //is name / first arg an entire instance of shot?

                        this.init(args);
            }

            _createClass(Shot, [{
                        key: 'init',
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

                                    Gamestack.Modifiers.informable(this);
                        }
            }, {
                        key: 'Image',
                        value: function Image(image) {

                                    this.anime = new Animation(image);
                        }
            }, {
                        key: 'Animation',
                        value: function Animation(anime) {
                                    this.anime = anime;
                                    return this;
                        }
            }, {
                        key: 'Total',
                        value: function Total(total, rot_disp_per_unit) {

                                    this.total = total;

                                    this.rot_disp = rot_disp_per_unit;

                                    return this;
                        }
            }, {
                        key: 'WaveGrowth',
                        value: function WaveGrowth(growth) {
                                    if (growth > 0) this.curve_growth = growth;
                        }
            }, {
                        key: 'CurveMode',
                        value: function CurveMode(key, size, growth) {
                                    this.curve = Gamestack.Curves.InOut[key.toLowerCase()];

                                    this.curve_key = key.toLowerCase();

                                    this.curve_size = size;

                                    if (growth > 0) this.curve_growth = growth;

                                    if (typeof this.curve_size == 'number') this.curve_size = new Gamestack.Vector(this.curve_size, this.curve_size);

                                    return this;
                        }
            }, {
                        key: 'RotDisp',
                        value: function RotDisp(rot_disp) {
                                    this.rot_disp = rot_disp;

                                    return this;
                        }
            }, {
                        key: 'Velocity',
                        value: function Velocity(v) {
                                    this.velocity = v;

                                    return this;
                        }
            }, {
                        key: 'Position',
                        value: function Position(p) {
                                    if (typeof p == 'number') {
                                                this.position = new Gamestack.Vector(p, p, p);
                                    } else {

                                                this.position = p;
                                    }

                                    return this;
                        }
            }, {
                        key: 'Size',
                        value: function Size(s) {
                                    if (typeof s == 'number') {
                                                this.size = new Gamestack.Vector(s, s, s);
                                    } else {

                                                this.size = s;
                                    }

                                    return this;
                        }
            }, {
                        key: 'Rotation',
                        value: function Rotation(r) {
                                    this.rotation = r;

                                    return this;
                        }
            }, {
                        key: 'onCollide',
                        value: function onCollide(collideables, callback) {}
            }]);

            return Shot;
}();

Gamestack.Shot = Shot;;

/**
 * Creates an instance of Rectangle.
 * @param   {Gamestack.Vector} min the minimum vector point (x,y)
 * @param   {Gamestack.Vector} max the maximum vector point (x,y)
 *
 * @returns {Rectangle} a Rectangle object
 */

var Rectangle = function () {
            function Rectangle(min, max) {
                        _classCallCheck(this, Rectangle);

                        this.min = new Gamestack.Vector(min);
                        this.max = new Gamestack.Vector(max);
            }

            _createClass(Rectangle, [{
                        key: 'toLine',
                        value: function toLine() {}
            }]);

            return Rectangle;
}();

;

var VectorBounds = Rectangle;

Gamestack.VectorBounds = VectorBounds;

Gamestack.Rectangle = Rectangle;

/**
 * Takes the min and max vectors plus termPoint ('termination-point'), returns VectorFrameBounds
 *  *use this to define the bounds of an Animation object.
 * @param   {Vector} min the minimum vector point (x,y)
 * @param   {Vector} max the maximum vector point (x,y)
 * @param   {Vector=} termPoint the optional termination vector point (x,y) : defaults to the value of 'max'
 * -While a min and max Gamestack.Vector(x,y) will describe the grid-size of Animation frames,
 * the termPoint will indicate the last frame on-grid for this set of frames --Animation may stop early on the 'grid')
 * @returns {VectorFrameBounds} a VectorFrameBounds object
 */

var VectorFrameBounds = function (_Rectangle) {
            _inherits(VectorFrameBounds, _Rectangle);

            function VectorFrameBounds(min, max, termPoint) {
                        _classCallCheck(this, VectorFrameBounds);

                        var _this17 = _possibleConstructorReturn(this, (VectorFrameBounds.__proto__ || Object.getPrototypeOf(VectorFrameBounds)).call(this, min, max));

                        _this17.termPoint = termPoint || new Gamestack.Vector(_this17.max.x, _this17.max.y, _this17.max.z);

                        return _this17;
            }

            return VectorFrameBounds;
}(Rectangle);

;

Gamestack.VectorFrameBounds = VectorFrameBounds;

/**
 * Takes several args and returns Line object. Intended for curved-line / trajectory of Projectile Object.
 * @param   {Object} args object of arguments
 * @param   {Easing} args.curve the curve applied to line see TWEEN.Easing , limited options for immediate line-drawing
 * @param   {number} args.duration the millisecond duration of Line
 * @param   {Gamestack.Vector} args.position the position vector
 *
 * @param   {number} args.pointDist the numeric point-distance
 *
 * @param   {Gamestack.Vector} args.size the size vector
 *
 * @param   {number} args.rotation the numeric rotation of -360 - 360
 *
 * @param   {number} args.growth the numeric growth
 *
 * -While a min and max Vector(x,y) will describe the grid of Animation frames, the termPoint will indicate the last frame to show on the grid (Animations may stop early on the 'grid')
 * @returns {VectorFrameBounds} a VectorFrameBounds object
 */

var Line = function () {
            function Line() {
                        var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                        _classCallCheck(this, Line);

                        this.curve_options = Curves; //Curves Object (of functions)
                        this.curve_string = args.curve_string || "linearNone";

                        this.curve = this.get_curve_from_string(this.curve_string);

                        this.motion_curve = args.motion_curve || TWEEN.Easing.Linear.None;

                        if (typeof args.curve == 'function') {
                                    this.curve = args.curve;
                        }

                        this.points = args.points || [];

                        this.position = args.position || new Gamestack.Vector();

                        this.is_highlighted = args.is_highlighted || false;

                        this.offset = args.offset || new Gamestack.Vector();

                        this.pointDist = 5;

                        this.size = args.size || new Gamestack.Vector();

                        this.rotation = args.rotation || 0;

                        this.origin = args.origin || new Gamestack.Vector(0, 0);

                        this.iterations = 1;

                        this.growth = args.growth || 1.2;
            }

            _createClass(Line, [{
                        key: 'Iterations',
                        value: function Iterations(n) {

                                    this.iterations = n;
                                    return this;
                        }
            }, {
                        key: 'Growth',
                        value: function Growth(n) {
                                    this.growth = n;

                                    return this;
                        }
            }, {
                        key: 'Origin',
                        value: function Origin(o) {
                                    this.position = o;
                                    this.origin = o;

                                    return this;
                        }
            }, {
                        key: 'Pos',
                        value: function Pos(p) {
                                    this.origin = p;
                                    this.position = p;
                                    return this;
                        }
            }, {
                        key: 'PointDisp',
                        value: function PointDisp(num) {
                                    this.minPointDist = num;
                                    return this;
                        }
            }, {
                        key: 'Curve',
                        value: function Curve(c) {
                                    this.curve = c;
                                    this.curve_string = this.get_curve_string(c);
                                    return this;
                        }
            }, {
                        key: 'Duration',
                        value: function Duration(d) {
                                    this.duration = d;

                                    return this;
                        }
            }, {
                        key: 'Rotation',
                        value: function Rotation(r) {
                                    this.rotation = r;
                                    return this;
                        }
            }, {
                        key: 'next',
                        value: function next(position) {

                                    var found = false;

                                    for (var x = 0; x < this.points.length; x++) {

                                                if (position.equals(this.points[x]) && x < this.points.length - 1) {
                                                            found = true;
                                                            return new Gamestack.Vector(this.points[x + 1]);
                                                }

                                                if (x == this.points.length - 1 && !found) {

                                                            return new Gamestack.Vector(this.points[0]);
                                                }
                                    }
                        }
            }, {
                        key: 'get_curve_from_string',
                        value: function get_curve_from_string(str) {

                                    console.log('Applying Line():curve:' + str);

                                    for (var x in this.curve_options) {

                                                if (x.toLowerCase() == str.toLowerCase()) {
                                                            return this.curve_options[x];
                                                }
                                    }
                        }
            }, {
                        key: 'get_curve_string',
                        value: function get_curve_string(c) {
                                    for (var x in this.curve_options) {

                                                if (this.curve_options[x] == c) {
                                                            return x;
                                                }
                                    }
                        }
            }, {
                        key: 'getGraphCanvas',
                        value: function getGraphCanvas(curveCall, existing_canvas) {

                                    var canvas = existing_canvas || document.createElement('canvas');

                                    canvas.style.position = "relative";

                                    canvas.id = 'curve-display';

                                    canvas.setAttribute('class', 'motion-curve');

                                    canvas.width = 180;
                                    canvas.height = 100;

                                    canvas.style.background = "black";

                                    var context = canvas.getContext('2d');
                                    context.fillStyle = "rgb(0,0,0)";
                                    context.fillRect(0, 0, 180, 100);

                                    context.lineWidth = 0.5;
                                    context.strokeStyle = "rgb(230,230,230)";

                                    context.beginPath();
                                    context.moveTo(0, 20);
                                    context.lineTo(180, 20);
                                    context.moveTo(0, 80);
                                    context.lineTo(180, 80);
                                    context.closePath();
                                    context.stroke();

                                    context.lineWidth = 2;
                                    context.strokeStyle = "rgb(255,127,127)";

                                    var position = { x: 0, y: 80 };
                                    var position_old = { x: 0, y: 80 };

                                    this.test_graph_size = new Gamestack.Vector(185, 80 - 20);

                                    var points = this.get_line_segment(this.test_graph_size, 5, curveCall);

                                    for (var x in points) {
                                                var position = new Gamestack.Vector(points[x].x, this.test_graph_size.y + 20 - points[x].y);

                                                context.beginPath();
                                                context.moveTo(position_old.x, position_old.y);
                                                context.lineTo(position.x, position.y);
                                                context.closePath();
                                                context.stroke();

                                                position_old.x = position.x;
                                                position_old.y = position.y;
                                    }

                                    return canvas;
                        }
            }, {
                        key: 'transpose',
                        value: function transpose(origin, rotation) {

                                    this.rotation = rotation;

                                    this.origin = origin;

                                    var t_points = [];

                                    for (var x = 0; x < this.points.length; x++) {

                                                var p = this.points[x];

                                                var np = new Gamestack.Vector(Gamestack.GeoMath.rotatePointsXY(p.x, p.y, this.rotation));

                                                t_points.push(np.add(origin));

                                                console.log(np);
                                    }

                                    return t_points;
                        }
            }, {
                        key: 'add_segment',
                        value: function add_segment(next_segment, offset) {
                                    for (var x = 0; x < next_segment.length; x++) {

                                                next_segment[x] = new Gamestack.Vector(next_segment[x]).add(offset);

                                                this.points.push(next_segment[x]);
                                    }
                        }
            }, {
                        key: 'get_flipped_segment',
                        value: function get_flipped_segment(points) {

                                    var t_points = points.slice(),
                                        t_len = t_points.length;

                                    for (var x = 0; x < points.length; x++) {

                                                t_points[t_len - x].x = points[x].x;
                                    }

                                    return t_points;
                        }
            }, {
                        key: 'Highlight',
                        value: function Highlight(origin, ctx) {

                                    ctx = ctx || Gamestack.ctx;

                                    var points = this.transpose(origin);

                                    for (var x in points) {

                                                var point = points[x];

                                                var dist = point.sub(Gamestack.point_highlighter.position);

                                                var d = Math.sqrt(dist.x * dist.x + dist.y * dist.y);

                                                if (d >= 10) {
                                                            Gamestack.point_highlighter.position = new Gamestack.Vector(points[x]);
                                                }

                                                Canvas.draw(Gamestack.point_highlighter, ctx);
                                    }

                                    return this;
                        }
            }]);

            return Line;
}();

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

Gamestack.GeoMath = GeoMath;
;
/**
 * Creates a Sound instance. Implements HTML5-Audio object
 * --DevTODO : complete docs for the Sound class
 *
 * @param   {string} src the source-path of the targeted sound-file
 * @returns {Sound} instance of Gamestack.Sound
 * */

var Sound = function () {
            function Sound(src, data) {
                        _classCallCheck(this, Sound);

                        if ((typeof src === 'undefined' ? 'undefined' : _typeof(src)) == 'object') {

                                    this.sound = document.createElement('audio');

                                    this.sound.src = src.src;

                                    this.src = src.src;
                        } else if (typeof src == 'string') {

                                    this.sound = document.createElement('audio');

                                    this.sound.src = src;

                                    this.src = src;
                        }

                        if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) == 'object') {
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
                        key: 'Loop',
                        value: function Loop(loop) {
                                    this.sound.loop = loop || true;

                                    return this;
                        }
            }, {
                        key: 'loop',
                        value: function loop(_loop) //same as Loop()
                        {
                                    this.sound.loop = _loop || true;

                                    return this;
                        }
            }, {
                        key: 'Volume',
                        value: function Volume(val) {

                                    this.sound.volume = val;

                                    return this;
                        }
            }, {
                        key: 'volume',
                        value: function volume(val) //same as Volume()
                        {

                                    this.sound.volume = val;

                                    return this;
                        }
            }, {
                        key: 'Play',
                        value: function Play() {
                                    if (_typeof(this.sound) == 'object' && typeof this.sound.play == 'function') {

                                                this.sound.play();
                                    }

                                    return this;
                        }
            }, {
                        key: 'play',
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
                        key: 'add',
                        value: function add(src, name) {
                                    if ((typeof src === 'undefined' ? 'undefined' : _typeof(src)) == 'object' && src.src) {
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
                        key: 'Volume',
                        value: function Volume(v) {
                                    for (var x = 0; x < this.sounds.length; x++) {
                                                this.sounds[x].volume(v);
                                    }

                                    return this;
                        }
            }, {
                        key: 'volume',
                        value: function volume(v) {
                                    for (var x = 0; x < this.sounds.length; x++) {
                                                this.sounds[x].volume(v);
                                    }

                                    return this;
                        }
            }, {
                        key: 'PlayNext',
                        value: function PlayNext() {
                                    this.sounds[this.cix % this.sounds.length].play();

                                    this.cix += 1;
                        }
            }, {
                        key: 'Play',
                        value: function Play() {

                                    this.sounds[this.cix % this.sounds.length].play();

                                    this.cix += 1;
                        }
            }, {
                        key: 'playNext',
                        value: function playNext() //same as PlayNext()
                        {
                                    this.sounds[this.cix % this.sounds.length].play();

                                    this.cix += 1;
                        }
            }, {
                        key: 'play',
                        value: function play() //same as Play()
                        {

                                    this.sounds[this.cix % this.sounds.length].play();

                                    this.cix += 1;
                        }
            }]);

            return SoundList;
}();

Gamestack.Sound = Sound;

Gamestack.SoundList = SoundList;
;(function () {
            console.log('Sprite class... creating');

            /**
             * Creates an instance of Sprite.
             *
             * <info-bit>Gamestack.Sprite is a container for the properties and behaviors associated with a single 2d-game-entity.
             *
             * Sprites hold reference to their-own Animations, Motions, Shots, and Sounds.</info-bit>
               * <iframe style='width:400px; height:450px; overflow:hidden;' src='../client/examples/js-class/Sprite.html'> </iframe>
               * @param   {string=} [src] the srcPath (image) of this Sprite
             * @param   {Animation=} [anime] the animation to be applied
             * @param   {Object | Sprite=} [sprite] the Sprite-data to be returned as fully unique instance
             * @param   {number} [scale] the scale to be applied to the sprite's image
             *
             * @returns {Sprite} a Gamestack.Sprite object
             *
             * @example
             *
             * //Create Animation using Chainable functions of Gamestack.Animation
             * var anime = new Gamestack.Animation('../images/characters/full/spaceman1.png') //constructor is called
             * .FrameSize(130, 130) //FrameSize(x, y) are applied
             * .FrameBounds(new Gamestack.Vector(9, 0), new Gamestack.Vector(23, 0), new Gamestack.Vector(23, 0)) //Defines a frame-grid of min-max(x,y), and termPoint(x, y)
             * .Seesaw() //The Animation will play back-and-forth repeatedly (cycle through frames forwards, then backwards and so on.
             * .Duration(900); //Animation lasts 900 millis OR just under 1 second
             *
             * //Use the anime to create Sprite...
             * var spaceman = new Gamestack.Sprite(anime);
             *
             * //OR Create Sprite(), then set the animation using Sprite.setAnimation:
             * spaceman = new Gamestack.Sprite();
             * spaceman.setAnimation(anime);
             *
             */

            var Sprite = function () {
                        function Sprite() {
                                    var src = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                                    var scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1.0;

                                    _classCallCheck(this, Sprite);

                                    var args = (typeof src === 'undefined' ? 'undefined' : _typeof(src)) == 'object' ? src : {};

                                    if (args instanceof Gamestack.Animation) //instantiate from animation
                                                {

                                                            args = { selected_animation: args, image: args.image, size: new Gamestack.Vector(args.frameSize) };
                                                }

                                    //apply image from string 'src'

                                    if (typeof src == 'string') {

                                                this.src = src;
                                                this.image = new Gamestack.GameImage(src);
                                                this.selected_animation = new Gamestack.Animation(src);
                                                this.selected_animation.setToSingleFrame();
                                    }

                                    this.animations = [];

                                    //create size property
                                    this.size = new Gamestack.Vector(0, 0);

                                    if (typeof scale == 'number') //image plus 'scale' argument
                                                {
                                                            this.scale = scale || 1.0;
                                                }

                                    Gamestack.Modifiers.spatial(this);

                                    this.active = true; //defaults to active or visible

                                    //apply remaining args
                                    this.apply_args(args);

                                    if (!this.selected_animation) this.setToSingleFrame();
                        }

                        /**
                         * runs a function when the sprite's image has loaded
                         *
                         * @function
                         * @params {Function} f the function to be called on load
                         * @memberof Sprite
                         **********/

                        _createClass(Sprite, [{
                                    key: 'onLoad',
                                    value: function onLoad(f) {

                                                var __inst = this;

                                                var img = this.image.domElement,
                                                    load = img.onload;

                                                img.onload = function () {

                                                            onload(false, __inst);

                                                            f(false, __inst);
                                                };

                                                img.onerror = function (err) {

                                                            f(true, __inst);
                                                };

                                                return this;
                                    }

                                    /**********
                                     * @ignore
                                     **********/

                        }, {
                                    key: 'apply_args',
                                    value: function apply_args() {
                                                var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


                                                this.FromData(args, true); //Using a FUNCTIONAL COPY --heavy to process

                                                if (args.image instanceof Gamestack.GameImage && !this.image) {
                                                            this.image = args.image;
                                                }

                                                this.name = args.name || "__blankName";

                                                this.life = args.life || 999999999999;

                                                this.description = args.description || "__spriteDesc";

                                                this.id = Gamestack.getArg(args, 'id', this.create_id());

                                                this.animations = Gamestack.getArg(args, 'animations', []);

                                                this.motions = Gamestack.getArg(args, 'motions', []);

                                                this.particles = Gamestack.getArg(args, 'particles', []);

                                                this.shots = Gamestack.getArg(args, 'shots', []);

                                                this.sounds = Gamestack.getArg(args, 'sounds', []);

                                                this.__initializers = Gamestack.getArg(args, '__initializers', []);

                                                this.group = Gamestack.getArg(args, 'group', 'one');

                                                this.scrollFactor = args.scrollFactor || 1.0;

                                                this.noScroll = args.noScroll || false;

                                                if (this.noScroll) {
                                                            this.scrollFactor = 0;
                                                }

                                                this.speed = new Gamestack.Vector(Gamestack.getArg(args, 'speed', new Gamestack.Vector(0, 0)));

                                                this.size = new Gamestack.Vector(Gamestack.getArg(args, 'size', new Gamestack.Vector(0, 0)));

                                                this.position = new Gamestack.Vector(Gamestack.getArg(args, 'position', new Gamestack.Vector(0, 0, 0)));

                                                this.collision_bounds = Gamestack.getArg(args, 'collision_bounds', new Gamestack.VectorBounds(new Gamestack.Vector(0, 0, 0), new Gamestack.Vector(0, 0, 0)));

                                                this.rotation = new Gamestack.Vector(Gamestack.getArg(args, 'rotation', new Gamestack.Vector(0, 0, 0)));

                                                this.scale = args.scale || 1.0;

                                                this.acceleration = Gamestack.getArg(args, 'acceleration', new Gamestack.Vector(0, 0, 0));

                                                this.rot_speed = new Gamestack.Vector(Gamestack.getArg(args, 'rot_speed', new Gamestack.Vector(0, 0)));

                                                this.rot_accel = new Gamestack.Vector(Gamestack.getArg(args, 'rot_accel', new Gamestack.Vector(0, 0)));

                                                this.padding = Gamestack.getArg(args, 'padding', new Gamestack.Vector(0, 0, 0));

                                                var __inst = this;

                                                //Apply / instantiate Sound(), Gamestack.Motion(), and Gamestack.Animation() args...


                                                Gamestack.each(this.shots, function (ix, item) {

                                                            __inst.shots[ix] = new Gamestack.Shot(item);
                                                });

                                                Gamestack.each(this.sounds, function (ix, item) {

                                                            __inst.sounds[ix] = new Gamestack.Sound(item);
                                                });

                                                Gamestack.each(this.motions, function (ix, item) {

                                                            __inst.motions[ix] = new Gamestack.TweenMotion(item);
                                                });

                                                Gamestack.each(this.animations, function (ix, item) {

                                                            __inst.animations[ix] = new Gamestack.Animation(item);
                                                });

                                                Gamestack.each(this.particles, function (ix, item) {

                                                            __inst.particles[ix] = new Gamestack.GSProton(item);
                                                });

                                                //Apply initializers:

                                                Gamestack.each(this.__initializers, function (ix, item) {

                                                            __inst.onInit(item);
                                                });

                                                Gamestack.Modifiers.informable(this);

                                                if (!this.selected_animation && args.selected_animation) {

                                                            //log('applying animation:' + jstr(args.selected_animation));

                                                            this.selected_animation = new Gamestack.Animation(args.selected_animation);
                                                }
                                    }
                        }, {
                                    key: 'FromData',
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
                                    key: 'Scale',
                                    value: function Scale(scaleFloat) {

                                                this.scale = scaleFloat;

                                                this.size = new Gamestack.Vector(this.image.domElement.width * scaleFloat, this.image.domElement.height * scaleFloat);

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
                                    key: 'ScrollFactor',
                                    value: function ScrollFactor(s) {
                                                this.scrollFactor = s;

                                                return this;
                                    }
                        }, {
                                    key: 'engage',
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
                                    key: 'Life',
                                    value: function Life(v) {

                                                this.life = v;

                                                return this;
                                    }

                                    /**
                                     * @ignore
                                     **********/

                        }, {
                                    key: 'singleFrame',
                                    value: function singleFrame() {
                                                var __inst = this;

                                                console.log('Sprite.singleFrame():');

                                                __inst.size = __inst.size || new Gamestack.Vector(0, 0);

                                                if (__inst.size.x == 0 && __inst.size.y == 0) //if size[x, y] are zero, then size according to image.domElement...
                                                            {
                                                                        __inst.size = new Gamestack.Vector(__inst.image.domElement.width, __inst.image.domElement.height);

                                                                        __inst.Scale(__inst.scale || 1.0);
                                                            }

                                                if (!__inst.selected_animation) {

                                                            console.log('setting Animation with :' + this.image.domElement.src);

                                                            __inst.setAnimation(new Gamestack.Animation({

                                                                        image: __inst.image,

                                                                        frameSize: new Gamestack.Vector(__inst.image.domElement.width, __inst.image.domElement.height),

                                                                        frameBounds: new Gamestack.VectorFrameBounds(new Gamestack.Vector(), new Gamestack.Vector())

                                                            }));
                                                }

                                                return this;
                                    }

                                    /**
                                     * initializes sprites. triggers all functions previously passed to the onInit function.
                                     * Use this function when a sprite, instantiated from json-data, carries initializers.
                                     * --This feature is built for the purpose of data-persistence. --sprites from json-file may carry behaviors onto the scene.
                                     *
                                     * @function
                                     * @memberof Sprite
                                     **********/

                        }, {
                                    key: 'init',
                                    value: function init() {}

                                    /**
                                     * extends the init function.
                                     * @function
                                     * @memberof Sprite
                                     * @param {function} fun the function to be passed into the init function of the sprite
                                     **********/

                        }, {
                                    key: 'onInit',
                                    value: function onInit(fun) {

                                                if (typeof fun == 'string') {

                                                            if (this.__initializers.indexOf(fun) < 0) {

                                                                        this.__initializers.push(fun);
                                                            }
                                                            ;

                                                            var __inst = this;

                                                            var keys = fun.split('.');

                                                            console.log('finding init from string:' + fun);

                                                            if (!keys.length >= 2) {
                                                                        return console.error('need min 2 string keys separated by "."');
                                                            }

                                                            var f = Gamestack.options.SpriteInitializers[keys[0]][keys[1]];

                                                            if (typeof f == 'function') {

                                                                        var __inst = this;

                                                                        var f_init = this.init;

                                                                        this.init = function () {

                                                                                    f_init(__inst);

                                                                                    f(__inst);
                                                                        };
                                                            }
                                                } else if (typeof fun == 'function') {

                                                            console.log('extending init:');

                                                            var f_init = this.init;
                                                            var __inst = this;

                                                            this.init = function () {

                                                                        f_init(__inst);

                                                                        fun(__inst);
                                                            };
                                                } else if ((typeof fun === 'undefined' ? 'undefined' : _typeof(fun)) == 'object') {

                                                            console.log('extending init:');

                                                            console.info('Quick2D does not yet implement onInit() from arg of object type');
                                                }
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
                                    key: 'get_id',
                                    value: function get_id() {
                                                return this.id;
                                    }

                                    /**********
                                     * @ignore
                                     **********/

                        }, {
                                    key: 'to_map_object',
                                    value: function to_map_object(size, framesize) {

                                                this.__mapSize = new Gamestack.Vector(size || this.size);

                                                this.frameSize = new Gamestack.Vector(framesize || this.size);

                                                return this;
                                    }

                                    /*****************************
                                     * Setters and Creators
                                     ***************************/

                                    /**
                                     * @ignore
                                     * creates a unique string id for the purpose of identifying objects.
                                     * @function
                                     * @memberof Sprite
                                     * @returns {string}
                                     **********/

                        }, {
                                    key: 'create_id',
                                    value: function create_id() {

                                                return Gamestack.create_id();
                                    }

                                    /**
                                     * sets the size of the Sprite()
                                     * @function
                                     * @memberof Sprite
                                     **********/

                        }, {
                                    key: 'setSize',
                                    value: function setSize(size) {

                                                this.size = new Gamestack.Vector(size.x, size.y, size.z);
                                    }

                                    /**
                                     * sets the position of the Sprite()
                                     * @function
                                     * @memberof Sprite
                                     **********/

                        }, {
                                    key: 'setPos',
                                    value: function setPos(pos) {
                                                this.position = new Gamestack.Vector(pos.x, pos.y, pos.z || 0);
                                    }
                        }, {
                                    key: 'setFrame',
                                    value: function setFrame(ix) {
                                                if (this.selected_animation) {

                                                            this.selected_animation.selected_frame = this.selected_animation.frames[ix];
                                                }
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
                                    key: 'getSizeByMax',
                                    value: function getSizeByMax(mx, my) {

                                                var size = new Gamestack.Vector(this.size);

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
                                     *  @memberof Sprite
                                     *  assert the existence of a speed{} object
                                     *  sprite.speed (vector) is created if absent from sprite
                                     ***************************/

                        }, {
                                    key: 'assertSpeed',
                                    value: function assertSpeed() {
                                                if (!this.speed) {

                                                            this.speed = new Gamestack.Vector(0, 0, 0);
                                                }
                                    }

                                    /*****************************
                                     *  setAnimation(anime)
                                     *  -set the select_animation of this sprite
                                     ***************************/

                                    /**
                                     * sets the 'selected_animation' property of the sprite
                                     * @function
                                     * @memberof Sprite
                                     * @param {Animation}
                                     **********/

                        }, {
                                    key: 'setAnimation',
                                    value: function setAnimation(anime) {

                                                if (anime instanceof Gamestack.Animation && this.animations.indexOf(anime) < 0) {
                                                            this.animations.push(anime);
                                                }

                                                this.selected_animation = anime;

                                                this.image = this.selected_animation.image || new Gamestack.GameImage(this.selected_animation.src);

                                                Gamestack.log('set the animation');

                                                return this;
                                    }

                                    /**
                                     * sets the 'selected_animation' property to a single-frame-animation, from sprite.image
                                     * @function
                                     * @memberof Sprite
                                     **********/

                        }, {
                                    key: 'setToSingleFrame',
                                    value: function setToSingleFrame() {

                                                if (!this.image || !this.image.domElement) {
                                                            return this;
                                                }

                                                var __inst = this,
                                                    load = this.image.domElement.onload || function () {};

                                                this.image.domElement.onload = function () {

                                                            load(false, __inst);

                                                            __inst.size = new Gamestack.Vector(__inst.image.domElement.width, __inst.image.domElement.height);
                                                            __inst.selected_animation = new Gamestack.Animation(__inst.image).FrameSize(__inst.size);
                                                            __inst.Scale(__inst.scale || 1.0);
                                                };

                                                Gamestack.log('set single-frame animation');

                                                return this;
                                    }
                        }, {
                                    key: 'LifeSpan',
                                    value: function LifeSpan(value) {
                                                this.life = value;
                                    }
                        }, {
                                    key: 'Life',
                                    value: function Life(value) //same as LifeSpan
                                    {
                                                this.life = value;
                                    }
                        }, {
                                    key: 'isDead',
                                    value: function isDead(gw) {

                                                gw = gw || Gamestack.game_windows[0];

                                                return this.hasOwnProperty('life') && this.life <= 0;
                                    }
                        }, {
                                    key: 'die',
                                    value: function die(gw) {

                                                this.life = 0;

                                                return this;
                                    }

                                    /**
                                     * indicates if any portion of the sprite is within screen bounds --uses Gamestack.WIDTH, Gamestack.HEIGHT OR any w,h arguments passed to this method
                                     * @function
                                     * @memberof Sprite
                                     * @param {number} w optional screen-width argument, defaults to Gamestack.WIDTH
                                     * @param {number} h optional screen-height argument, defaults to Gamestack.HEIGHT
                                     * @returns {boolean} a true or false value to show if any part of the sprite is on-screen
                                     **********/

                        }, {
                                    key: 'onScreen',
                                    value: function onScreen(w, h, gw) {

                                                w = w || Gamestack.WIDTH;

                                                h = h || Gamestack.HEIGHT;

                                                gw = gw || Gamestack.game_windows[0];

                                                var camera = gw.camera || Gamestack.camera || { position: new Gamestack.Vector(0, 0, 0) },
                                                    scrollFactor = this.noScroll ? 0 : this.scrollFactor;

                                                var camPos = new Gamestack.Vector(camera.position).mult(scrollFactor);

                                                var p = new Gamestack.Vector(this.position.x - camPos.x, this.position.y - camPos.y, this.position.z - camPos.z);

                                                return p.x + this.size.x > -1000 - w && p.x < w + 1000 && p.y + this.size.y > 0 - 1000 - h && p.y < h + 1000;
                                    }

                                    /*****************************
                                     * Updates
                                     ***************************/

                                    /*****************************
                                     * update()
                                     * -starts empty:: is applied recursively by Gamestack.js as the main sprite-update
                                     ***************************/

                                    /**
                                     * the main update for the sprite --applied recursively by GameWindow after gameWindow.start is called
                                     * @function
                                     * @memberof Sprite
                                     **********/

                        }, {
                                    key: 'update',
                                    value: function update(sprite) {}

                                    /*****************************
                                     * def_update()
                                     * -applies speed and other default factors of movement
                                     * -is used by Quick2d.js as the system def_update (default update)
                                     ***************************/

                                    /**
                                     * Automatically updates various speed and rotational properties for the Sprite()
                                     * @function
                                     *
                                     * @memberof Sprite
                                     *
                                     *
                                     * @example
                                     * // applies a constant speed
                                     * mySprite.rot_speed = new Gamestack.Vector(3);
                                     * //def_update() will run automatically with the gamestack update. The above sprite will rotate at a constant speed of 3.
                                     * @example
                                     * // if automatic speed updates are undesired, replace the def_update() function with a 'do nothing' function.
                                     * mySprite.def_update = function()
                                     *                      {
                                     *                     //do nothing
                                     *                     };
                                     **********/

                        }, {
                                    key: 'def_update',
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
                                     * This function resolves a function nested in an object, from a string-key, and it is applied by Gamestack.js for persistence of data and Sprite() behaviors
                                     * @ignore
                                     * -REMOVED FROM DOCS : SYSTEM USE ONLY
                                     **********/

                        }, {
                                    key: 'resolveFunctionFromDoubleKeys',
                                    value: function resolveFunctionFromDoubleKeys(keyString1, keyString2, obj, callback) {

                                                callback(typeof obj[keyString1][keyString2] == 'function' ? obj[keyString1][keyString2] : {});
                                    }

                                    /**
                                     * extends an existing function, and is applied by Gamestack in onInit();
                                     * @ignore
                                     * -REMOVED FROM DOCS : SYSTEM USE ONLY
                                     **********/

                        }, {
                                    key: 'extendFunc',
                                    value: function extendFunc(fun, extendedFunc) {

                                                console.log('extending func');

                                                var ef = extendedFunc;

                                                var __inst = this;

                                                return function () {

                                                            ef(__inst);

                                                            //any new function comes after

                                                            fun(__inst);
                                                };
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
                                    key: 'onUpdate',
                                    value: function onUpdate(fun) {

                                                var id = this.create_id();

                                                fun = this['update_' + id] = fun || function () {};

                                                //  console.log('created sprite update with key:' + 'update_' + id);

                                                var update = this.update;

                                                var __inst = this;

                                                this.update = function (__inst) {

                                                            update(__inst);

                                                            for (var x in __inst) {
                                                                        if (__inst[x] == fun) {
                                                                                    //console.log('calling update');
                                                                                    __inst[x](__inst);
                                                                        }
                                                            }
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
                                    key: 'travelLineTwoWay',
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

                                                var ixChange = Gamestack.Curves.InOut[curveKey](pctFloat) * speed * 0.5;

                                                if (curveKey == 'linear') {
                                                            ixChange = speed;
                                                }

                                                ixChange = Math.ceil(ixChange);

                                                if (ixChange < 1) {
                                                            ixChange = 1;
                                                }

                                                __inst.position = new Gamestack.Vector(line.points[__inst.__crtLineIx]);

                                                //console.log(ixChange);

                                                __inst.__crtLineIx += ixChange;

                                                if (__inst.__crtLineIx >= line.points.length) {

                                                            line.points = line.points.reverse();
                                                            __inst.__crtLineIx = 0;
                                                }

                                                if (offset instanceof Gamestack.Vector) {
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
                                    key: 'travelLineOnLoop',
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

                                                var ixChange = Gamestack.Curves.InOut[curveKey](pctFloat) * speed * 0.5;

                                                if (curveKey == 'linear') {
                                                            ixChange = speed;
                                                }

                                                ixChange = Math.ceil(ixChange);

                                                if (ixChange < 1) {
                                                            ixChange = 1;
                                                }

                                                __inst.position = new Gamestack.Vector(line.points[__inst.__crtLineIx]);

                                                // console.log(ixChange);

                                                __inst.__crtLineIx += ixChange;

                                                if (__inst.__crtLineIx >= line.points.length) {
                                                            __inst.__crtLineIx = 0;
                                                }

                                                if (offset instanceof Gamestack.Vector) {
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
                                    key: 'hasColorCollision',
                                    value: function hasColorCollision(sprite) {

                                                var grid1 = this.selected_animation.getCurrentColorMap() || [{ position: this.position, size: this.size }],
                                                    grid2 = sprite.selected_animation.getCurrentColorMap() || [{ position: spr.position, size: sprite.size }];

                                                for (var x in grid1) {
                                                            for (var y in grid2) {

                                                                        if (Gamestack.Collision.basicBoxCollision(grid1[x].position, grid1[x].size, grid2[y].position, grid2[y].size)) {
                                                                                    return true;
                                                                        }
                                                            }
                                                }

                                                return false;
                                    }

                                    /**
                                     * returns a true || false value for immediate box-collision --between this sprite and the sprite argument
                                     * @function
                                     * @memberof Sprite
                                     * @param {Sprite} sprite the alternate Sprite for collision detection
                                     * @returns {boolean} a true or false value to show if collision is happening
                                     **********/

                        }, {
                                    key: 'hasBoxCollision',
                                    value: function hasBoxCollision(sprite) {

                                                return Gamestack.Collision.spriteRectanglesCollide(this, sprite);
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
                                     * @param {Gamestack.Animation} animation the animation to fire from the Sprite
                                     * @param {number} speed the speed of the shot that is projected
                                     * @param {Gamestack.Vector} position the initial position of the shot: defaults to current Sprite position
                                     * @param {Gamestack.Vector} size the Vector size of the shot
                                     * @param {Gamestack.Vector} rot_offset the rotational offset to apply: controls direction of the shot
                                     **********/

                        }, {
                                    key: 'shoot',
                                    value: function shoot(options, gw) {
                                                //character shoots an animation

                                                gw = gw || Gamestack.game_windows[0];

                                                this.prep_key = 'shoot';

                                                var animation = options.bullet || options.animation || options.anime || new Gamestack.Animation();

                                                var speed = options.speed || options.velocity || 1;

                                                var size = options.size || new Gamestack.Vector(10, 10, 0);

                                                var position = new Gamestack.Vector(options.position) || new Gamestack.Vector(this.position);

                                                var rot_offset = options.rot_offset || options.rotation || 0;

                                                var total = options.total || 1;

                                                var rot_disp = options.rot_disp || 0; //the full rotational-dispersion of the bullets

                                                var curve = options.curve,
                                                    curve_size = options.curve_size,
                                                    curve_growth = options.curve_growth || 1.0;

                                                var curve_key = options.curve_key || 'quintic';

                                                var life = options.life || 900;

                                                var shots = [];

                                                for (var x = 0; x < total; x++) {

                                                            var __playerInst = this;

                                                            if (Gamestack.isAtPlay) {

                                                                        var bx = position.x,
                                                                            by = position.y,
                                                                            bw = size.x,
                                                                            bh = size.y;

                                                                        var shot = new Gamestack.Sprite({

                                                                                    active: true,

                                                                                    position: new Gamestack.Vector(position),

                                                                                    size: new Gamestack.Vector(size),

                                                                                    speed: speed,

                                                                                    image: animation.image,

                                                                                    rotation: new Gamestack.Vector(0, 0, 0),

                                                                                    flipX: false,

                                                                                    life: options.life

                                                                        });

                                                                        shot.noScroll = true;

                                                                        shot.setAnimation(animation);

                                                                        rot_offset = new Gamestack.Vector(rot_offset, 0, 0);

                                                                        shot.position.x = bx, shot.position.y = by;

                                                                        //Danger On this line: annoying math --dispersing rotation of bullets by rot_disp

                                                                        var div = rot_disp / total;

                                                                        var rotPlus = div * x + div / 2 - rot_disp / 2;

                                                                        shot.rotation.x = rot_offset.x + rotPlus;

                                                                        shot.origin = new Gamestack.Vector(position);

                                                                        shot.speed = new Gamestack.Vector(Math.cos(shot.rotation.x * 3.14 / 180) * speed, Math.sin(shot.rotation.x * 3.14 / 180) * speed);

                                                                        shots.push(shot);

                                                                        if (!curve) {

                                                                                    shot.onUpdate(function (spr) {
                                                                                                // console.log('update:rotation:' + shot.rotation.x);


                                                                                    });
                                                                        } else {

                                                                                    shot.ticker = 0;

                                                                                    var r = shot.rotation.x + 0;

                                                                                    shot.line = new Gamestack.CurvedLine().Pos(position).Curve(curve_key).SegmentSize(curve_size).MaxSize(2000).Growth(1.5).Rotate(r).Fill();

                                                                                    shot.onUpdate(function (spr) {

                                                                                                spr.ticker += 1;

                                                                                                if (spr.ticker < spr.line.points.length) spr.position = new Gamestack.Vector(spr.line.points[spr.ticker]);
                                                                                    });
                                                                        }

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
                                     * @returns {Sprite} a Gamestack.Sprite object
                                     **********/

                        }, {
                                    key: 'subsprite',
                                    value: function subsprite(options, gw) {

                                                gw = gw || Gamestack.game_windows[0];

                                                var animation = options.animation || new Gamestack.Animation();

                                                var position = options.position || new Gamestack.Vector(this.position);

                                                var offset = options.offset || new Gamestack.Vector(0, 0, 0);

                                                var size = new Gamestack.Vector(options.size || this.size);

                                                if (Gamestack.isAtPlay) {

                                                            var subsprite = gw.add(new Gamestack.Sprite({

                                                                        active: true,

                                                                        position: position,

                                                                        size: size,

                                                                        offset: offset,

                                                                        image: animation.image,

                                                                        rotation: new Gamestack.Vector(0, 0, 0),

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
                                    key: 'animate',
                                    value: function animate(animation) {

                                                if (Gamestack.isAtPlay) {

                                                            if (animation) {
                                                                        this.setAnimation(animation);
                                                            }

                                                            this.selected_animation.animate();
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
                                    key: 'onAnimationComplete',
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
                                    key: 'accelY',
                                    value: function accelY(accel, max) {

                                                accel = Math.abs(accel);

                                                if (typeof max == 'number') {
                                                            max = { y: max };
                                                }

                                                this.assertSpeed();

                                                var diff = max.y - this.speed.y;

                                                if (diff > 0) {
                                                            this.speed.y += Math.abs(diff) >= accel ? accel : diff;
                                                }
                                                ;

                                                if (diff < 0) {
                                                            this.speed.y -= Math.abs(diff) >= accel ? accel : diff;
                                                }
                                                ;
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
                                    key: 'accelX',
                                    value: function accelX(accel, max) {

                                                accel = Math.abs(accel);

                                                if (typeof max == 'number') {
                                                            max = { x: max };
                                                }

                                                this.assertSpeed();

                                                var diff = max.x - this.speed.x;

                                                if (diff > 0) {
                                                            this.speed.x += Math.abs(diff) >= accel ? accel : diff;
                                                }
                                                ;

                                                if (diff < 0) {
                                                            this.speed.x -= Math.abs(diff) >= accel ? accel : diff;
                                                }
                                                ;
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
                                    key: 'decelY',
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
                                    key: 'decelX',
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
                                    key: 'accel',
                                    value: function accel(object, key, _accel, max) {

                                                var prop = object;

                                                _accel = Math.abs(_accel);

                                                if (typeof max == 'number') {
                                                            max = { x: max };
                                                }

                                                var speed = prop[key];

                                                // this.assertSpeed();

                                                var diff = max.x - prop[key];

                                                if (diff > 0) {
                                                            prop[key] += Math.abs(diff) >= _accel ? _accel : diff;
                                                }
                                                ;

                                                if (diff < 0) {
                                                            prop[key] -= Math.abs(diff) >= _accel ? _accel : diff;
                                                }
                                                ;
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
                                    key: 'decel',
                                    value: function decel(prop, key, rate) {
                                                if ((typeof rate === 'undefined' ? 'undefined' : _typeof(rate)) == 'object') {

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
                                    key: 'SmoothMotion',
                                    value: function SmoothMotion(x, y, duration) {
                                                if ((typeof x === 'undefined' ? 'undefined' : _typeof(x)) == 'object') //argument coercion: x is a vector, y is duration
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

                                                var t = new TWEEN.Tween(this.position).easing(TWEEN.Easing.Quadratic.InOut).to(new Gamestack.Vector(x, y), duration).onUpdate(function () {
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
                                    key: 'SmoothRotate',
                                    value: function SmoothRotate(r, duration) {

                                                if (!TWEEN instanceof Object) {
                                                            return console.error('TWEEN.js required for SmoothRotate();');
                                                }

                                                r = r + this.rotation.x;

                                                var t = new TWEEN.Tween(this.rotation).easing(TWEEN.Easing.Quadratic.InOut).to(new Gamestack.Vector(r), duration).onUpdate(function () {
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
                                    key: 'center',
                                    value: function center() {

                                                return new Gamestack.Vector(this.position.x + this.size.x / 2, this.position.y + this.size.y / 2, 0);
                                    }

                                    /*****************************
                                     *  System Use / Collision
                                     ***************************/

                                    /*****************************
                                     * @ignore
                                     ***************************/

                        }, {
                                    key: 'shortest_stop',
                                    value: function shortest_stop(item, callback) {

                                                var diff_min_y = item.min ? item.min.y : Math.abs(item.position.y - this.position.y + this.size.y);

                                                var diff_min_x = item.min ? item.min.x : Math.abs(item.position.x - this.position.x + this.size.x);

                                                var diff_max_y = item.max ? item.max.y : Math.abs(item.position.y + item.size.y - this.position.y);

                                                var diff_max_x = item.max ? item.max.x : Math.abs(item.position.x + item.size.x - this.position.y);

                                                var dimens = { top: diff_min_y, left: diff_min_x, bottom: diff_max_y, right: diff_max_x };

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
                                    key: 'overlap_x',
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
                                    key: 'overlap_y',
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
                                    key: 'collide_stop_x',
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
                                    key: 'collide_stop',
                                    value: function collide_stop(item) {

                                                if (this.id == item.id) {
                                                            return false;
                                                }

                                                this.speed = this.speed || new Gamestack.Vector(0, 0, 0);

                                                this.padding = this.padding || new Gamestack.Vector(0, 0, 0);

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
                                                                                                }
                                                                                                ;

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
                                    key: 'collide_stop_top',
                                    value: function collide_stop_top(item) {

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
                                    key: 'restoreFrom',
                                    value: function restoreFrom(data) {
                                                data.image = new GameImage(data.src || data.image.src);

                                                return new Gamestack.Sprite(data);
                                    }

                                    /*****************************
                                     * @ignore
                                     * #IN-TESTING
                                     *  fromFile(file_path)
                                     *  -TODO : complete this function based on code to load Sprite() from file, located in the spritemaker.html file
                                     *  -TODO: test this function
                                     ***************************/

                        }, {
                                    key: 'fromFile',
                                    value: function fromFile(file_path) {

                                                if (typeof file_path == 'string') {

                                                            var __inst = this;

                                                            $.getJSON(file_path, function (data) {

                                                                        __inst = new Gamestack.Sprite(data);
                                                            });
                                                }
                                    }

                                    /*****************************
                                     * return a decycled json-string for the sprite --without circular references
                                     * @returns {string} a json string
                                     ***************************/

                        }, {
                                    key: 'toJSONString',
                                    value: function toJSONString() {
                                                return jstr(JSON.decycle(this));
                                    }
                        }]);

                        return Sprite;
            }();

            ;

            Gamestack.Sprite = Sprite;
})();
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

                                    if ((typeof x === 'undefined' ? 'undefined' : _typeof(x)) == 'object' && x.hasOwnProperty('x') && x.hasOwnProperty('y')) //optionally pass vector3
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
                                    key: 'valid_check',
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
                                    key: 'sub',
                                    value: function sub(v) {
                                                if (typeof v == 'number') {
                                                            v = { x: v, y: v, z: v };
                                                }
                                                ;

                                                return new Gamestack.Vector(this.x - v.x, this.y - v.y, this.z - v.z);
                                    }

                                    /**
                                     * Adds another Vector to this vector and returns a vector for the resulting sum.
                                     *
                                     * @function
                                     * @param {Vector} v the vector to be added to this vector
                                     * @memberof Vector
                                     **********/

                        }, {
                                    key: 'add',
                                    value: function add(v) {
                                                if (typeof v == 'number') {
                                                            v = { x: v, y: v, z: v };
                                                }
                                                ;

                                                return new Gamestack.Vector(this.x + v.x, this.y + v.y, this.z + v.z);
                                    }

                                    /**
                                     * Multiplies another Vector by this vector and returns a vector for the resulting product.
                                     *
                                     * @function
                                     * @param {Vector} v the vector that this vector will by muliplied by
                                     * @memberof Vector
                                     **********/

                        }, {
                                    key: 'mult',
                                    value: function mult(v) {
                                                if (typeof v == 'number') {
                                                            v = { x: v, y: v, z: v };
                                                }
                                                ;

                                                return new Gamestack.Vector(this.x * v.x, this.y * v.y, this.z * v.z);
                                    }

                                    /**
                                     * Divides another Vector by this vector and returns a vector for the resulting quotient.
                                     *
                                     * @function
                                     * @param {Vector} v the vector for this vector to be divided by
                                     * @memberof Vector
                                     **********/

                        }, {
                                    key: 'div',
                                    value: function div(v) {
                                                if (typeof v == 'number') {
                                                            v = { x: v, y: v, z: v };
                                                }
                                                ;

                                                return new Gamestack.Vector(this.x / v.x, this.y / v.y, this.z / v.z);
                                    }

                                    /**
                                     * Rounds this vector to the nearest set of whole numbers and returns the result.
                                     *
                                     * @function
                                     * @memberof Vector
                                     * @returns {Vector} a Gamestack.Vector object
                                     **********/

                        }, {
                                    key: 'round',
                                    value: function round() {
                                                return new Gamestack.Vector(Math.round(this.x), Math.round(this.y), Math.round(this.z));
                                    }

                                    /**
                                     * Floors this vector to the nearest set of whole numbers and returns the result (subtractive-only, an x of 1.7 becomes 1)
                                     *
                                     * @function
                                     * @memberof Vector
                                     * @returns {Vector} a Gamestack.Vector object
                                     **********/

                        }, {
                                    key: 'floor',
                                    value: function floor() {
                                                return new Gamestack.Vector(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z));
                                    }

                                    /**
                                     * Ceils this vector to the nearest set of whole numbers  and returns the result (additive-only, an x of 1.2 becomes 2)
                                     *
                                     * @function
                                     * @memberof Vector
                                     * @returns {Vector} a Gamestack.Vector object
                                     **********/

                        }, {
                                    key: 'ceil',
                                    value: function ceil() {
                                                return new Gamestack.Vector(Math.ceil(this.x), Math.ceil(this.y), Math.ceil(this.z));
                                    }

                                    /**
                                     * An equals-test for vectors. Returns true OR false.
                                     *
                                     * @function
                                     * @memberof Vector
                                     * @returns {boolean} a true OR false value
                                     **********/

                        }, {
                                    key: 'equals',
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
                                    key: 'trig_distance_xy',
                                    value: function trig_distance_xy(v) {

                                                var dist = this.sub(v);

                                                return Math.sqrt(dist.x * dist.x + dist.y * dist.y);
                                    }
                        }, {
                                    key: 'is_between',
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
                                    key: 'randomize',
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
                                    key: 'rotationalSpeedPoint',
                                    value: function rotationalSpeedPoint(rotation, speed) {
                                                var r = rotation;

                                                if (isNaN(speed)) {
                                                            speed = 1;
                                                }

                                                if ((typeof rotation === 'undefined' ? 'undefined' : _typeof(rotation)) == 'object' && rotation.x) {
                                                            r = rotation.x;
                                                }

                                                return new Gamestack.Vector(Math.cos(r * 3.14 / 180) * speed, Math.sin(r * 3.14 / 180) * speed);
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
                                    key: 'angleBetween',
                                    value: function angleBetween(p1, p2) {

                                                return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
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

            Gamestack.Vector = Vector;

            Gamestack.Rotation = Vector;

            Gamestack.Pos = Vector;

            Gamestack.Position = Vector;

            Gamestack.Size = Vector;

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

            Gamestack.VectorMath = VectorMath;
})();;
var Background = function (_Gamestack$Sprite) {
            _inherits(Background, _Gamestack$Sprite);

            function Background() {
                        var arg1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                        var arg2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

                        _classCallCheck(this, Background);

                        var _this18 = _possibleConstructorReturn(this, (Background.__proto__ || Object.getPrototypeOf(Background)).call(this, arg1, arg2));

                        var args = (typeof arg1 === 'undefined' ? 'undefined' : _typeof(arg1)) == 'object' ? arg1 : {};

                        _this18.type = args.type || "parallax" || "basic" || false;

                        _this18.source_objects = args.objects || args.source_objects || [];

                        _this18.members = [];

                        _this18.rows = args.rows || 1; //The Y number of repititions

                        _this18.cols = args.cols || 1; //The X number of repetitions of the images

                        _this18.flip = args.flip || false;

                        _this18.fill = args.fill || false;

                        _this18.flip = args.flip || false;

                        return _this18;
            }

            _createClass(Background, [{
                        key: 'Flip',
                        value: function Flip(value) {
                                    if (value == undefined) {
                                                this.flip = true;
                                    } else if (value == true || value == false) {
                                                this.flip = value;
                                    }

                                    return this;
                        }
            }, {
                        key: 'Rows',
                        value: function Rows(r) {
                                    this.rows = r;
                                    return this;
                        }
            }, {
                        key: 'Cols',
                        value: function Cols(c) {
                                    this.cols = c;
                                    return this;
                        }
            }, {
                        key: 'Fill',
                        value: function Fill(approxRows, approxCols, gw) {

                                    approxRows = approxRows || this.rows || 1;

                                    approxCols = approxCols || this.cols || 1;

                                    this.members.push(new Background(this)); //"This" or base image is always applied

                                    for (var x = 0; x < this.source_objects.length; x++) {
                                                this.members.push(new Background(this.source_objects[x])); //src strings OR Sprites()
                                    }

                                    gw = gw || Gamestack.game_windows[0];

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
                        key: 'add',
                        value: function add(object) {
                                    var cleanCheck = object instanceof Gamestack.Sprite || object instanceof Array && object[0] instanceof Gamestack.Sprite; //is Sprite

                                    if (!cleanCheck) {
                                                return console.error('Must have: valid contents (Gamestack.Sprite OR [] of Gamestack.Sprite())');
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
}(Gamestack.Sprite);

Gamestack.Background = Background;;

(function () {
            console.log('Interactive class... creating');

            var Interactive = function (_Gamestack$Sprite2) {
                        _inherits(Interactive, _Gamestack$Sprite2);

                        function Interactive() {
                                    var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                                    _classCallCheck(this, Interactive);

                                    //init as Gamestack.Sprite()

                                    var _this19 = _possibleConstructorReturn(this, (Interactive.__proto__ || Object.getPrototypeOf(Interactive)).call(this, args));

                                    _this19.collision_settings = new Gamestack.CollisionSettings(args);

                                    _this19.collideables = args.collideables || [];

                                    Gamestack.Extendors.collideable(_this19, args); //overwrites the onCollide():

                                    return _this19;
                        }

                        _createClass(Interactive, [{
                                    key: 'Collideables',
                                    value: function Collideables(c) {
                                                this.collideables = c || [];

                                                if (!this.collideables instanceof Array) {
                                                            return console.error('Must pass array for "c" argument');
                                                }

                                                return this;
                                    }
                        }, {
                                    key: 'onCollide',
                                    value: function onCollide() // Gamestack.Interactive instance should have an onCollide() function
                                    {}
                        }]);

                        return Interactive;
            }(Gamestack.Sprite);

            Gamestack.Interactive = Interactive;
})();;

(function () {
            console.log('Terrain class... creating');

            var Terrain = function (_Gamestack$Sprite3) {
                        _inherits(Terrain, _Gamestack$Sprite3);

                        function Terrain() {
                                    var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                                    _classCallCheck(this, Terrain);

                                    //init as Gamestack.Sprite()

                                    var _this20 = _possibleConstructorReturn(this, (Terrain.__proto__ || Object.getPrototypeOf(Terrain)).call(this, args));

                                    _this20.collision_settings = new Gamestack.CollisionSettings(args);

                                    _this20.collideables = args.collideables || args.colliders || [];

                                    Gamestack.Extendors.collideable(_this20, args); //overwrites the onCollide():


                                    return _this20;
                        }

                        _createClass(Terrain, [{
                                    key: 'Collideables',
                                    value: function Collideables(c) {
                                                this.collideables = c || [];

                                                if (!this.collideables instanceof Array) {
                                                            return console.error('Must pass array for "c" argument');
                                                }

                                                return this;
                                    }
                        }, {
                                    key: 'onCollide',
                                    value: function onCollide() // Gamestack.Terrain instance should have an onCollide() function
                                    {}
                        }]);

                        return Terrain;
            }(Gamestack.Sprite);

            Gamestack.Terrain = Terrain;
})();
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

var Three = function (_Gamestack$Sprite4) {
            _inherits(Three, _Gamestack$Sprite4);

            function Three() {
                        var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                        _classCallCheck(this, Three);

                        //init as Sprite()

                        var _this21 = _possibleConstructorReturn(this, (Three.__proto__ || Object.getPrototypeOf(Three)).call(this, args));

                        if (!THREE) //THREE.js library must be loaded
                                    {
                                                var _ret;

                                                return _ret = console.error('ThreeJSObject():Library: Three.js is required for this object.'), _possibleConstructorReturn(_this21, _ret);
                                    }

                        _this21.scene = new THREE.Scene();

                        if (args.geometry instanceof String && THREE[args.geometry]) {
                                    _this21.geometry = new THREE[args.geometry]();
                        } else {

                                    _this21.geometry = args.geometry || new THREE.TorusGeometry(50, 10, 16, 100);
                        }

                        _this21.scene.add(new THREE.AmbientLight(0xffffff, 1.0));

                        _this21.renderer = Gamestack.renderer || new THREE.WebGLRenderer({
                                    preserveDrawingBuffer: true,
                                    alpha: true
                        });

                        _this21.renderer.setSize(1000, 1000);

                        _this21.camera = new THREE.PerspectiveCamera(70, 1, 1, 1000);

                        _this21.camera.position.z = 1000 / 8;

                        var __inst = _this21;

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

                        return _this21;
            }

            _createClass(Three, [{
                        key: 'three_update',
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
                        key: 'applyAnimativeState',
                        value: function applyAnimativeState() {}
            }]);

            return Three;
}(Gamestack.Sprite //dependency: THREE.js
);

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

                                    switch (typeof value === 'undefined' ? 'undefined' : _typeof(value)) {
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

                                    if (value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
                                                if (Object.prototype.toString.apply(value) === '[object Array]') {
                                                            for (i = 0; i < value.length; i += 1) {
                                                                        item = value[i];
                                                                        if (item && (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object') {
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

//Attach to the global Gamestack object

/***************
 *
 * @memberOf Gamestack
 *
 * *****************/

Gamestack.TWEEN = TWEEN;

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

function CreateGamestack() {

            return Gamestack;
}

// UMD (Universal Module Definition)
(function (root) {

            if (typeof define === 'function' && define.amd) {

                        // AMD
                        define([], function () {
                                    return Gamestack;
                        });
            } else if (typeof module !== 'undefined' && (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {

                        // Node.js
                        module.exports = Gamestack;
            } else if (root !== undefined) {

                        // Global variable
                        root.Gamestack = Gamestack;
            }
})(undefined);
//# sourceMappingURL=Gamestack.js.map
