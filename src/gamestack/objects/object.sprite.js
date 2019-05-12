/**
 * Creates a new Sprite.
 *
 * <info-bit>Gamestack.Sprite is a container for 2D Animations.
 * -apply Sprite class to create a 2D game-object.
 *
 * Sprites hold reference to their-own Animations and Sounds.</info-bit>
 * <iframe style='width:400px; height:450px; overflow:hidden;' src='../client/examples/js-class/Sprite.html'> </iframe>

 * @param   {string} src the srcPath for the image of the Sprite
 * @param   {number} scale=1.0 the scale to be applied to size of each animation-frame
 *
 * @returns {Sprite} a Gamestack.Sprite object
 *
 *
 *
 */

class Sprite extends Scriptable {
  constructor(src = {}, scale = 1.0) {
    super();
    this.Object(this);

    var args = typeof src == 'object' ? src : {};


    if (args instanceof Gamestack.Animation) //instantiate from animation
    {
      console.dev('args was Gamestack.Animation', args);
      args = {
        selected_animation: args,
        image: args.image,
        size: new Gamestack.Vector(args.frameSize)
      };
    }

    //apply image from string 'src'

    if (typeof src == 'string') {
      this.src = src;
      this.selected_animation = new Gamestack.Animation(src);
      this.image = this.selected_animation.image;
      this.SingleFrame();
    }

    this.animations = [];

    //create size property



    this.size = new Gamestack.Vector(0, 0);

    if (typeof(scale) == 'number') //image plus 'scale' argument
    {
      this.scale = scale || 1.0;

    }

    this.active = true; //defaults to active or visible

    //apply remaining args
    this.apply_args(args);

    if (!this.selected_animation)
      this.SingleFrame();
  }


  static_image_load(img) {

    this.size = new Gamestack.Vector(img.width * this.scale, img.height * this.scale).round();

  }

  /**
   * runs a function for the onload event of this sprite's image
   *
   * @function
   * @param {Function} f the function to be called on load
   * @memberof Sprite
   **********/

  onLoad(f) {

    var img = this.image.domElement,

      load = img.onload;

    f = f || function() {};

    f.bind(this);

    this.load_call = f;

    var $sprite = this;

    img.onload = function() {

      $sprite.load_total += 1;

      load.bind($sprite).call($sprite);

      //  $sprite.static_image_load(img);

      $sprite.load_call($sprite);

    };

    img.onerror = function(err) {

      $sprite.load_call(false, $sprite);

    };

    return this;
  }


  /**********
   * @ignore
   **********/

  apply_args(args = {}) {

    this.FromData(args, true); //Using a FUNCTIONAL COPY --heavy to process

    if (args.image instanceof Gamestack.GameImage && !this.image) {
      this.image = args.image;
    }

    this.name = args.name || "__blankName";

    this.life = args.life || 999999999999;

    this.description = args.description || "__spriteDesc";

    /**
     * @property {String} id the unique identifier of the Sprite --called automatically on constructor.
     * @memberof Sprite
     **********/

    this.id = this.create_id();


    /**
     * @property {Array} animations the array of animations attached to the Sprite
     * @memberof Sprite
     **********/

    this.animations = Gamestack.getArg(args, 'animations', []);

    /**
     * @property {Array} scripts the array of scripts attached to the Sprite
     * @memberof Sprite
     **********/

    this.scripts = Gamestack.getArg(args, 'scripts', []);

    this.motions = Gamestack.getArg(args, 'motions', []);

    this.particles = Gamestack.getArg(args, 'particles', []);

    this.shots = Gamestack.getArg(args, 'shots', []);

    this.sounds = Gamestack.getArg(args, 'sounds', []);

    this.init_ext = Gamestack.getArg(args, 'init_ext', []);

    this.group = Gamestack.getArg(args, 'group', 'one');

    this.scrollFactor = args.scrollFactor || 1.0;

    this.noScroll = args.noScroll || false;

    if (this.noScroll) {
      this.scrollFactor = 0;
    }


    /**
     * @property {Vector} speed the speed of the Sprite
     * @memberof Sprite
     **********/

    this.speed = new Gamestack.Vector(Gamestack.getArg(args, 'speed', new Gamestack.Vector(0, 0)));

    /**
     * @property {Vector} size the vector-size of the Sprite
     * @memberof Sprite
     **********/

    this.size = new Gamestack.Vector(Gamestack.getArg(args, 'size', new Gamestack.Vector(0, 0)));



    /**
     * @property {Vector} position the position of the Sprite
     * @memberof Sprite
     **********/

    this.position = new Gamestack.Vector(Gamestack.getArg(args, 'position', new Gamestack.Vector(0, 0, 0)));

    this.collision_bounds = Gamestack.getArg(args, 'collision_bounds', new Gamestack.VectorBounds(new Gamestack.Vector(0, 0, 0), new Gamestack.Vector(0, 0, 0)));


    /**
     *
     *
     * @property {Vector} rotation the rotation of the Sprite
     * @memberof Sprite
     **********/

    this.rotation = new Gamestack.Vector(Gamestack.getArg(args, 'rotation', new Gamestack.Vector(0, 0, 0)));


    /**
     * @property {number} scale the scale of the Sprite, controls draw-size
     * @memberof Sprite
     **********/

    this.scale = args.scale || 1.0;

    this.acceleration = Gamestack.getArg(args, 'acceleration', new Gamestack.Vector(0, 0, 0));

    this.rot_speed = new Gamestack.Vector(Gamestack.getArg(args, 'rot_speed', new Gamestack.Vector(0, 0)));

    this.rot_accel = new Gamestack.Vector(Gamestack.getArg(args, 'rot_accel', new Gamestack.Vector(0, 0)));

    this.padding = Gamestack.getArg(args, 'padding', new Gamestack.Vector(0, 0, 0));


    var __inst = this;

    //Apply / instantiate Sound(), Gamestack.Motion(), and Gamestack.Animation() args...


    Gamestack.each(this.shots, function(ix, item) {

      __inst.shots[ix] = new Gamestack.Shot(item);

    });

    Gamestack.each(this.sounds, function(ix, item) {

      __inst.sounds[ix] = new Gamestack.Sound(item);

    });

    Gamestack.each(this.motions, function(ix, item) {

      __inst.motions[ix] = new Gamestack.TweenMotion(item);

    });

    Gamestack.each(this.animations, function(ix, item) {

      __inst.animations[ix] = new Gamestack.Animation(item);

    });

    Gamestack.each(this.particles, function(ix, item) {

      __inst.particles[ix] = new Gamestack.GSProton(item);

    });

    //Apply initializers:

    Gamestack.each(this.init_ext, function(ix, item) {

      __inst.addInitializer(item);

    });

    if (!this.selected_animation && args.selected_animation) {

      console.dev('applying animation:' + jstr(args.selected_animation));

      this.selected_animation = new Gamestack.Animation(args.selected_animation);

    }
  }


  /**
   * Clones a sprite from existing data
   *
   * @function
   * @param {Object} object the data to be cloned
   * @memberof Sprite
   **********/

   Clone(sprite){
     console.log('using Clone() function');

     var clone = new Gamestack.Sprite(sprite.src);

     clone.Anime(new Gamestack.Animation(sprite.anime));

     clone.apply_args(sprite);

     return clone;
   }

   draw(ctx, camera) {

     var sprite = this;

     camera = camera || Gamestack.game_windows[0].camera || {
       position: new Gamestack.Vector(0, 0, 0)
     };

     if (sprite.active && (this.DRAWOFFSCREEN || sprite.onScreen(Gamestack.WIDTH, Gamestack.HEIGHT))) {
       this.draw_current_frame(ctx, camera);
     }
   }

   draw_current_frame(ctx, camera){

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


       var origin = sprite.origin || new Gamestack.Vector(realWidth / 2, realHeight / 2);

       //optional animation : offset

       if (sprite.selected_animation && sprite.selected_animation.hasOwnProperty('offset')) {
         x += sprite.selected_animation.offset.x;

         y += sprite.selected_animation.offset.y;

       }


       var rotation;

       if (typeof(sprite.rotation) == 'object') {

         rotation = sprite.rotation.x;


       } else {
         rotation = sprite.rotation;

       }

       var frame = sprite.selected_animation.selected_frame;

       sprite.realPosition = new Gamestack.Vector(x, y);

       if (frame && frame.image && frame.image.data) {

         ctx.putImageData(frame.image.data, x, y, 0, 0, sprite.size.x, sprite.size.y);

       } else {

         if (!sprite.selected_animation || !sprite.selected_animation.selected_frame.image.domElement)
           return;

         if (frame.image.domElement instanceof HTMLImageElement) {

           Gamestack.Canvas.draw_image_frame(frame.image.domElement, frame.framePos, frame.frameSize, new Gamestack.Vector2D(Math.round(x + (realWidth / 2)), Math.round(y + (realHeight / 2))), new Gamestack.Vector2D(realWidth, realHeight), rotation % 360, ctx, sprite.flipX, sprite.flipY, origin);

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

    if (object instanceof Gamestack.Animation) {
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
    if(anime)
    this.selected_animation = anime;
    return this;
  }


    Animation(anime) {
      if(anime)
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

  /**************************************************************
   * scales the sprite.size property according to image-size.
   * @param {number} scaleFloat a 0-1+ value
   *
   * @function
   * @memberof Sprite
   **************************************************************/

  Scale(scaleFloat) {

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

    this.__mapSize = new Gamestack.Vector(size || this.size);

    this.frameSize = new Gamestack.Vector(framesize || this.size);

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

    return Gamestack.create_id();

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
   *  assert the existence of a speed{} property
   *  sprite.speed (vector) is created if not existing in sprite
   *  @memberof Sprite
   ***************************/

  assertSpeed() {
    if (!this.speed) {
      this.speed = new Gamestack.Vector(0, 0, 0);
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

    this.image.domElement.onload = function() {

      load(false, __inst);

      if (_obj.size && _obj.size.x !== 0 && _obj.size.y !== 0)
        {

        }
        else{
            __inst.size = new Gamestack.Vector(__inst.image.domElement.width, __inst.image.domElement.height);
            __inst.selected_animation = new Gamestack.Animation(__inst.image).FrameSize(__inst.size);
            __inst.Scale(__inst.scale || 1.0);
        }

    };

    Gamestack.log('set single-frame animation');

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

    gw = gw || Gamestack.game_windows[0];

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
   * indicates if any portion of the sprite is within screen bounds --uses Gamestack.WIDTH, Gamestack.HEIGHT OR any w,h arguments passed to this method
   * @function
   * @memberof Sprite
   * @param {number} w optional screen-width argument, defaults to Gamestack.WIDTH
   * @param {number} h optional screen-height argument, defaults to Gamestack.HEIGHT
   * @returns {boolean} a true or false value to show if any part of the sprite is on-screen
   **********/

  onScreen(w, h, gw) {

    w = w || Gamestack.WIDTH;

    h = h || Gamestack.HEIGHT;

    gw = gw || Gamestack.game_windows[0];

    var camera = gw.camera || Gamestack.camera || {
        position: new Gamestack.Vector(0, 0, 0)
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
   * -starts empty:: is applied recursively by Gamestack.js as the main sprite-update
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
   * mySprite.rot_speed = new Gamestack.Vector(3);
   * //def_update() will run automatically with the gamestack update. The above sprite will rotate at a constant speed of 3.
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
   * extends an existing function, and is applied by Gamestack in addInitializer();
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

  hasPixelCollision(sprite) {

    if (!Larva.truthyPropsPerArray([this, sprite], 'selected_animation'))
      return;

    if (!Larva.truthyPropsPerArray([this.selected_animation, sprite.selected_animation], 'getCurrentPixelMap'))
      return;

    let anime = this.selected_animation,
      alt_anime = sprite.selected_animation;

    var grid1 = anime.selectedFramePixelMap = this.selected_animation.getCurrentPixelMap(),

      grid2 = alt_anime.selectedFramePixelMap = alt_anime.getCurrentPixelMap();

    for (var x in grid1) {
      for (var y in grid2) {
        if (Gamestack.Collision.boxesCollide(grid1[x].position, grid1[x].size, grid2[y].position, grid2[y].size)) {
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
      var sprite = new Gamestack.Sprite(unitMarker);
      this.colliderHighlights.push(sprite);
      Gamestack.game_windows[0].add(sprite);
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

        this.colliderHighlights[x].Pos(this.position.add(new Gamestack.Vector(real_gridPiece_pos.x, real_gridPiece_pos.y).sub(anime.selected_frame.framePos.mult(anime_scale))));

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

    return Gamestack.Collision.spriteBoxesCollide(this, sprite);

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
   * @param {Gamestack.Animation} animation the animation to fire from the Sprite
   * @param {number} speed the speed of the shot that is projected
   * @param {Gamestack.Vector} position the initial position of the shot: defaults to current Sprite position
   * @param {Gamestack.Vector} size the Vector size of the shot
   * @param {Gamestack.Vector} rot_offset the rotational offset to apply: controls direction of the shot
   **********/

  shoot(options, gw) {
    //character shoots an animation

    gw = gw || Gamestack.game_windows[0];

    this.prep_key = 'shoot';

    let animation = options.bullet || options.animation || options.anime || new Gamestack.Animation();

    let speed = options.speed || options.velocity || 1;


    let size = options.size || new Gamestack.Vector(10, 10, 0);

    let position = new Gamestack.Vector(options.position) || new Gamestack.Vector(this.position);


    let rot_offset = options.rot_offset || options.rotation || 0;

    let total = options.total || 1;

    let rot_disp = options.rot_disp || 0; //the full rotational-dispersion of the bullets

    let life = options.life || 900;

    var shots = [];

    for (var x = 0; x < total; x++) {

      var __playerInst = this;

      if (Gamestack.isAtPlay) {

        var bx = position.x,
          by = position.y,
          bw = size.x,
          bh = size.y;

        var shot = new Gamestack.Sprite().FromData({

          active: true,

          position: new Gamestack.Vector(position),

          size: new Gamestack.Vector(size),

          speed: speed,

          image: animation.image,

          rotation: new Gamestack.Vector(0, 0, 0),

          flipX: false,

          life: options.life,

          noScroll:true

        });


        shot.Animation(animation);

        rot_offset = new Gamestack.Vector(rot_offset, 0, 0);

        shot.position.x = bx, shot.position.y = by;

        //Danger On this line: annoying math --dispersing rotation of bullets by rot_disp

        var div = rot_disp / total;

        var rotPlus = div * x + div / 2 - rot_disp / 2;

        shot.rotation.x = rot_offset.x + rotPlus;

        //  shot.origin = new Gamestack.Vector(position);

        shot.speed = new Gamestack.Vector(Math.cos((shot.rotation.x) * 3.14 / 180) * speed, Math.sin((shot.rotation.x) * 3.14 / 180) * speed);

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
   * @returns {Sprite} a Gamestack.Sprite object
   **********/

  subsprite(options, gw) {

    gw = gw || Gamestack.game_windows[0];

    let animation = options.animation || new Gamestack.Animation();

    let position = options.position || new Gamestack.Vector(this.position);

    let offset = options.offset || new Gamestack.Vector(0, 0, 0);

    let size = new Gamestack.Vector(options.size || this.size);

    if (Gamestack.isAtPlay) {

      var subsprite = gw.add(new Gamestack.Sprite().FromData({

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

    if (Gamestack.isAtPlay) {

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

      .to(new Gamestack.Vector(x, y), duration)
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

      .to(new Gamestack.Vector(r), duration)
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

    return new Gamestack.Vector(this.position.x + this.size.x / 2, this.position.y + this.size.y / 2, 0);

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

  overlap_y(item, padding) {
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

  restoreFrom(data) {
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

  fromFile(file_path) {

    if (typeof file_path == 'string') {

      var __inst = this;

      $.getJSON(file_path, function(data) {

        __inst = new Gamestack.Sprite(data);

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

Gamestack.Sprite = Sprite;
