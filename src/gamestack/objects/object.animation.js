(function() {
  console.log('Animation class... creating');

  /**
   *
   * Creates an instance of Animation with one or more Frames.
   *
   * <iframe style='width:400px; height:450px; overflow:hidden;' src='../client/examples/js-class/Animation.html'> </iframe>
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
   * var multiFrameAnime = new Gamestack.Animation('../images/characters/full/spaceman1.png') //constructor is called
   * .FrameSize(130, 130)
   * .FrameBounds(new Gamestack.Vector(9, 0), new Gamestack.Vector(23, 0), new Gamestack.Vector(23, 0))
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

      //Gamestack.Modifiers.informable(this, args);

      if (typeof src == 'string') {
        this.Src(src, args.frameBounds);
      } else if (args instanceof Gamestack.GameImage) {
        console.log('Animation(): args are an instance of GameImage');

        this.image = args;
      } else if (args instanceof HTMLImageElement) {
        console.log('Animation(): args was an instance of HTMLImageElement');

        this.image = new Gamestack.GameImage(args);
      } else if (args instanceof Gamestack.Animation) {

        this.image = args.image;

      } else if (typeof(args) == 'object' && args.src) {
        this.src = args.src;
        this.image = new Gamestack.GameImage(args.src);
      }


      this.visible = args.visible || false;


      /**
       * @property {Vector} frameSize the frameSize of the Animation
       * @memberof Animation
       **********/

      this.frameSize = this.frameSize || new Gamestack.Vector(args.frameSize || new Gamestack.Vector(0, 0));


      if (args.frameBounds && args.frameBounds.min && args.frameBounds.max) {

        /**
         * @property {VectorFrameBounds} frameBounds the frameBounds of the Animation, has three Vectors
         * @memberof Animation
         **********/

        this.frameBounds = new Gamestack.VectorFrameBounds(args.frameBounds.min, args.frameBounds.max, args.frameBounds.termPoint);

      } else {

        this.frameBounds = new Gamestack.VectorFrameBounds(new Gamestack.Vector(0, 0, 0), new Gamestack.Vector(0, 0, 0), new Gamestack.Vector(0, 0, 0));

      }


      this.origin = new Gamestack.Vector(0, 0, 0);

      this.frameOffset = this.getArg(args, 'frameOffset', new Gamestack.Vector(0, 0, 0));

      this.apply2DFrames();

      this.flipX = this.getArg(args, 'flipX', false);

      this.cix = 0;

      /**
       * @property {Frame} selected_frame the selected_frame of the Animation, a Gamestack.Frame
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

    Origin(x, y, z) {

      this.origin = new Gamestack.Vector(x, y, z);

      this.frames.forEach(function($f) {

        $f.origin = new Gamestack.Vector(x, y, z);

      });

      if(this.selected_frame)
      {
        this.selected_frame.origin = new Gamestack.Vector(x, y, z);
      }

      return this;
    }

    Position(x, y, z) {
      this.position = new Gamestack.Vector(x, y, z);

      this.frames.forEach(function($f) {

        $f.position = new Gamestack.Vector(x, y, z);

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

      this.rotation = new Gamestack.Vector(x, y, z);

      this.frames.forEach(function($frame) {

        $frame.Rotation(x, y, z);

      });

      return this;

    }

    Src(src, options = {}) {

      if (typeof src == 'string') {

        console.log('setting GameImage with string:' + src);
        this.src = src;
        this.image = new Gamestack.GameImage(src);

      } else if (src instanceof GameImage) {
        console.log('Animation(): args are an instance of GameImage');

        this.image = src;
      } else if (src instanceof HTMLImageElement) {
        console.log('Animation(): args was an instance of HTMLImageElement');

        this.image = new Gamestack.GameImage(src);
      }

      if (!options.frameBounds)
        this.init_singleFrame();

      return this;

    }

    Size(x, y, z) {

      this.size = new Gamestack.Vector(x, y, z);

      this.frames.forEach(function(f) {

        f.size = new Gamestack.Vector(x, y, z);

      });

      return this;
    }

    Image(src) {

      if (typeof(src) == 'string') {

        console.log('setting GameImage with string:' + src);
        this.src = src;
        this.image = new Gamestack.GameImage(src);

      } else if (src instanceof Gamestack.GameImage) {
        console.log('Animation(): args are an instance of GameImage');

        this.image = src;
      } else if (src instanceof HTMLImageElement) {
        console.log('Animation(): args was an instance of HTMLImageElement');

        this.image = new Gamestack.GameImage(src);
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

      var __inst = this;

      this.image.domElement.onload = function() {
        if (!__inst.__isInit)
          __inst.FrameSize(__inst.image.domElement.width, __inst.image.domElement.height)
          .FrameBounds(new Gamestack.Vector(0, 0), new Gamestack.Vector(0, 0));

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
      this.frameSize = new Gamestack.Vector(w, h);

      this.__isInit = true;

      this.run();

      return this;

    }

    Hang() {

      this._hang = true;
      return this;

    }

    FrameBounds(minVector, maxVector, termVector) {
      this.frameBounds = new Gamestack.VectorFrameBounds(minVector, maxVector, termVector);

      this.__isInit = true;

      this.run();

      return this;
    }

    FrameOffset(x, y) {
      this.frameOffset = new Gamestack.Vector(x, y);
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
     * Declares the animation a a single frame / full-image.
     *
     * @function
     * @param {Vector} frameSize optional size param
     * @memberof Animation
     **********/

    SingleFrame() {

      this.__frametype = 'single';

      this.frameSize = new Gamestack.Vector(this.image.domElement.width, this.image.domElement.height);

      this.frameBounds = false;

      this.selected_frame = new Gamestack.Frame().Image(this.image).FrameSize(this.frameSize).Size(this.frameSize);

      this.frames = [];

      this.frames[0] = this.selected_frame;

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

          var f = new Gamestack.Frame().Image(this.image).FrameSize(this.frameSize).Origin(this.origin).Size(this.size || this.frameSize).Position(this.position || framePos);


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

      this.frames[0] = this.selected_frame = this.frames[0] || new Gamestack.Frame().Image(this.image).FrameSize(this.frameSize).Size(this.frameSize);

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

      var s = Larva.getPreferredPropertyByKey(sized_Object, 'size', 'argument had nested size variable. Using this instead.');

      return s.div(this.frameSize);

    }

    init_colorMap() {
      Larva.info('init_colorMap()');

      if (!Larva.allDefined([this.image, this.image.domElement]))
        return [];

      this.canvasObject = this.canvasObject || new Gamestack.OffscreenCanvasRendering(this.image);

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

            var vector = new Gamestack.Vector(x, y),

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

      Larva.info('getCurrentPixelMap()');

      var map = [];

      var frame = this.selected_frame;

      let __inst = this;

      this.colorMap = this.init_colorMap();

      for (var x in this.colorMap) {
        var c = this.colorMap[x];

        if (Gamestack.Collision.boxesCollide(frame.framePos, frame.frameSize, c.position, c.size)) {

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

    update() {

      if (this._hang && this.cix >= this.frames.length - 1) {
        this.cix = this.frames.length - 1
      }

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

    animate() {


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

    engage(duration) {

      this.call_on_run();

      duration = duration || this.duration || this.frames.length * 20;

      if (this.__frametype == 'single') {
        return 0;
      }


      let __inst = this;

      //we have a target
      this.tween = new TWEEN.Tween(this)
        .easing(__inst.curve || TWEEN.Easing.Linear.None)

        .to({
          cix: __inst.frames.length - 1
        }, duration)
        .onUpdate(function() {
          //console.log(objects[0].position.x,objects[0].position.y);

          //   __inst.cix = Math.ceil(__inst.cix);

          __inst.update();

        })
        .onComplete(function() {
          //console.log(objects[0].position.x, objects[0].position.y);

          __inst.cix = 0;

          __inst.call_on_complete();

          __inst.isComplete = true;

        });


      if (this.cix == 0)
        this.tween.start();

      if (this.cix >= this.frames.length && !this._hang) {
        this.cix = 0;
      }


    }
  };

  /** @memberof Gamestack */

  Gamestack.Animation = Animation;

  Gamestack.Animation.continuous = Gamestack.Animation.run; //'continuous is an alternate reference to 'run'.'

  Gamestack.Animation.continue = Gamestack.Animation.run; //'continue is an alternate reference to 'run'.'

  Gamestack.Animation.animate = Gamestack.Animation.run; //'animate is an alternate reference to 'run'.'

})();
