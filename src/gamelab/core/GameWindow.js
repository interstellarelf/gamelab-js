
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
