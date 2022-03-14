class Particle {

  constructor(options = {}, gameWindow) {

    var canvas = document.createElement('CANVAS');
    options.size = options.size || new Gamelab.Vector(2000, 2000);
    this.options = options;
    this.trackableSpeed = false;

    canvas.width = options.size.x;
    canvas.height = options.size.y;
    canvas.style.display = 'none';

    this.duration = 500;

    //refers to an approxomated size
    this.referenceSize = new Gamelab.Vector(0, 0);

    this.startSize = this.referenceSize;

    if (!this.life)
      this.Life(70, 70, 'random');

    this.DefaultValues();

    this.NormalizeOptions(options);

    this.Options(options);

    if (options.duration)
      this.duration = options.duration;

    var sourceSprites = [],
      livingSprites = [],
      ctx = canvas.getContext('2d');

    this.sourceSprites = [];

    this.gameWindow = gameWindow;
    this.ctx = ctx;
    this.canvas = canvas;

    this.sprites = [];
    this.layer = 0;
    this.ticker = 0;
    this.total = 0;
    this.position = new Gamelab.Vector(200, 200);
  }

  Layer(l) {
    this.layer = l;
    return this;
  }

  Prerender(inTestMode = false) {

    this.prerendered = true;
    this.precanvas = document.createElement('CANVAS');

    this.precanvas.width = 200;
    this.precanvas.height = 200;


    var testDom;

    if (inTestMode) {
      testDom = document.createElement('DIV');
      testDom.style.position = 'fixed';
      testDom.style.overflow = 'scroll';
      testDom.style.width = '60%';
      testDom.style.height = '60%';
      this.testDom = testDom;
    }

    this.prectx = this.precanvas.getContext('2d');

    this.image = document.createElement('img');
    this.image.src = this.options.src;

    this.portions = [];

    this.presprites = [];

    for (var x = 0; x <= 64; x++) {
      this.portions.push(Math.round((x / 64) * 100) / 100);
    }

    var $object = this;

    var fw = 0,
      fh = 0;


    var $sprite = new Gamelab.Sprite(this.image.src);

    this.isPrerendered = true;

    var V = Gamelab.Vector;

    this.presprite = $sprite;

    $sprite.onLoad(function() {

      fw = this.size.x;
      fh = this.size.y;

      $object.precanvas.style.width = this.size.x * 64 + 'px';
      $object.precanvas.style.height = this.size.y + 'px';

      $object.precanvas.width = this.size.x * 64;
      $object.precanvas.height = this.size.y;

      if ($object.testDom)
        $object.testDom.style.height = (this.size.y + 35) + 'px';

      this.testSize = this.size;

      var colorOptions = $object.options.color,
        colorOptionSet = numbers.getMinAndMaxByPair(colorOptions.a, colorOptions.b);

      var colors = new Gamelab.ColorFeildSpan(colorOptionSet.min, colorOptionSet.max, 'linear').PrepareColors();

      var all_colors = colors.colors,
        max_ix = 64;

      var frames = [];

      $sprite.effectDataList = [];

      for (var ix = 0; ix < 64; ix++) {

        var colorIndex = Math.floor((ix / max_ix) * all_colors.length);

        this.pushColorEffectCanvas(all_colors[colorIndex % all_colors.length]);
        this.ColorEffect(all_colors[colorIndex % all_colors.length]);

        this.Position(ix * fw, 0);
        this.draw($object.prectx);
      }


      //modify the draw function
      $object.presprite.draw = function(ctx, camera) {

        var sprite = this;

        this.Layer($object.layer);

        this.ScrollFactor(0);

        var frame = false;

        if (sprite.active) {

          if (sprite.selected_animation instanceof Object && sprite.selected_animation.hasOwnProperty('selected_frame')) {
            frame = sprite.selected_animation.selected_frame;
          }

          //match frame position w/ sprite position
          frame.Position(sprite.position);

          var xpos = frame.position.x,
            ypos = frame.position.y;

          var p = sprite.position;

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

          var pct = this.ticker / (this.life + 1);

          if (pct > 1.0 || isNaN(pct))
            pct = 1.0;

          if (!(this.effectCanvasList instanceof Array))
            alert('not an array');

          var index = Math.floor((this.effectCanvasList.length - 1) * pct);

          if (isNaN(index) || index > this.effectCanvasList.length)
            index = 0;

          var targetCanvas = this.effectCanvasList[index];

          if (targetCanvas instanceof HTMLCanvasElement)
          {
            let imageFrameArgs = {
                image:targetCanvas,
                framePos:frame.framePos,
                frameSize:frame.frameSize,
                position:new Gamelab.Vector2D(Math.round(xpos + (origin.x)), Math.round(ypos + (origin.y))),
                size:new Gamelab.Vector2D(realWidth, realHeight),
                rotation:rotation % 360,
                canvasContext:ctx,
                flipX:sprite.flipX,
                flipY:sprite.flipY,
                origin:origin,
                globalAlpha:this.opacity,
                globalComposite:false
            };
            Gamelab.Canvas.draw_image_frame(imageFrameArgs);
          }

        }
      };

      if (this.testDom) {
        testDom.style.zIndex = 9999;
        testDom.style.top = '20%';
        testDom.style.left = '20%';
        testDom.appendChild($object.precanvas);
        document.body.appendChild(testDom);
      }

    });



    return this;
  }

  DefaultValues() {

    var def_life = 50;

    if (!(this.options.composite || this.options.globalComposite || this.options.gobalCompositeOperation))
      this.Composite('source-over');

    if (!this.options.scale)
      this.Scale(0.6, 0.8, 'quadratic', def_life);

    if (!this.options.speed)
      this.Speed(7.5, 1.0, 'linear', def_life);

    if (!(this.options.alpha || this.options.opacity))
      this.Alpha(1.0, 0.1, 'quintic', def_life);

    if (!this.options.color)
      this.Color(false);
  }

  NormalizeOptions(options) {

    if (typeof options.angle == 'number')
      options.angle = {
        a: options.angle
      };

    if (typeof options.scale == 'number')
      options.scale = {
        a: options.scale
      };

    if (typeof options.speed == 'number')
      options.speed = {
        a: options.speed
      };

    if (typeof options.alpha == 'number')
      options.alpha = {
        a: options.alpha
      };

    if (typeof options.color == 'string')
      options.color = {
        a: options.color
      };

  }

  Options(options) {

    this.Composite(options.composite || options.globalComposite || options.gobalCompositeOperation || 'source-over');

    if (options.life)
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

    var options = this.options;

    var maxlife;

    if(options.life instanceof Object)
    {
       maxlife = options.life.a && !options.life.b ? options.life.a : options.life.a > options.life.b ? options.life.a : options.life.b;
    }

    else if(typeof options.life == 'number')
    {
      maxlife = options.life;
    }

    this.options.max = maxlife * 60;

      if(this.options.max > 2000)
      {
        this.options.max = 2000;
      }

    for (var x = 0; x < this.options.max; x++) {
      var sprite = new Gamelab.Sprite(this.options.src).Scale(this.options.scale.a);

      var particle = this;

      if (x == 0)
        sprite.onLoad(function() {
          particle.referenceSize = this.size;
        });

      sprite.options = this.options;
      this.sourceSprites.push(sprite);
    }


    this.sourceSprites.oldest = function() {

      var maxTicker = 0,
        nextObjectIndex = 0;

      for (var x = 0; x < this.length; x++) {
        if (typeof this[x] == 'object' && this[x].ticker >= maxTicker) {
          maxTicker = this[x].ticker;
          nextObjectIndex = x;
        }
      }
      return this[nextObjectIndex];
    };

    this.sourceSprites.countLiving = function() {
      var total = 0;
      for (var x = 0; x < this.length; x++) {
        if (this[x].ticker >= 1) {
          total++;
        }
      }

    //  console.log('TOTAL LIVING blts::' + total);
      return total;
    };


    return this;
  }

  //Total particles to draw from
  Stock(stock) {
    this.options.stock = stock;
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
    if(!a)
    {
      this.options.color = false;
      return false;
    }
    this.options.color = new Gamelab.ColorFeildSpan(a, b, transition, life).PrepareColors();
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

  LockRotation(r) {
    this.lockedRotation = r;
    return this;
  }


  addParticles(total) {

    var options = this.options;

    var positions = [];

    if (options.shape instanceof Gamelab.Circle)
      positions = ['border', 'perimeter'].indexOf(options.pointMode) >= 0 ? options.shape.getRandomCircumferencePoints(total) : options.shape.getRandomPoints(total);
    for (var x = 0; x < total; x++) {

      this.total += 1;
      var sprite;

      var ix = x + this.sourceSprites.countLiving();

      if(ix < this.sourceSprites.length)
      sprite = this.sourceSprites[ix];
      else{
        sprite = this.sourceSprites.oldest();
      }
    //  console.info(sprite);
    //  console.info(this.sourceSprites);
      if (this.total >= this.sourceSprites.length) {
        //console.info(sprite);
      }
      this.lastSprite = sprite;
    //  console.info(sprite);
    //  console.log(ix);
    //  console.log(this.sourceSprites.length);
      sprite.ticker = 0;
      sprite.speed = new Gamelab.Vector(0, 0);


      //temp scroll factor -zero

      sprite.ScrollFactor(0);

      if (this.presprite && this.options.color && this.options.color.hasVariance()) {
        sprite.effectCanvasList = this.presprite.effectCanvasList;
        sprite.draw = this.presprite.draw;
      }

      if (this.gameWindow.has(sprite))
        this.gameWindow.remove(sprite);

      if (this.sprites.indexOf(sprite) >= 0)
        this.sprites.splice(this.sprites.indexOf(sprite), 1);

      if (sprite.constructor.name !== 'Sprite') {
        console.error('not a sprite');
      }

      sprite.detached_particle = false;
      sprite.flipX = this.flipX;

      var particle = this;

      sprite.flyByRotation = function(angle, speed) {
        this.speed = Gamelab.Trig.rotational_speed(angle, speed);
        this.position = this.position.add(this.speed);
      };

      sprite.speed = new Gamelab.Vector(0, 0);

      sprite.gunOptions = {};

      sprite.gunOptions.life = this.life.Clone();

      sprite.life = sprite.gunOptions.life.getValue();

      if (isNaN(sprite.life) || sprite.life == 0)
        console.error('Not a number OR isZero --sprite.life');

      sprite.gunOptions.angle = options.angle.Duration(sprite.life).Clone();

      if (options.color && options.color.hasVariance())
      sprite.gunOptions.color = options.color.Duration(sprite.life).Clone();

      sprite.gunOptions.alpha = options.alpha.Duration(sprite.life).Clone();

      sprite.gunOptions.speed = options.speed.Duration(sprite.life).Clone();

      sprite.gunOptions.scale = options.scale.Duration(sprite.life).Clone();

      sprite.opacity = sprite.gunOptions.alpha.getValue();

      if (this.options.color && !this.presprite && this.options.color.hasVariance()) {
        sprite.color = sprite.gunOptions.color.getValue();
      }


      sprite.scale = sprite.gunOptions.scale.getValue();

      if (!this.presprite && this.options.color && this.options.color.hasVariance())
        sprite.ColorEffect(sprite.color);


      sprite.globalCompositeOperation = options.globalCompositeOperation || 'lighter';


      var angleDiff = Math.abs(options.angle.a - options.angle.b);

      if(sprite.hasOwnProperty('r'))
      {
       sprite.fly_angle = sprite.r;
      }
      else{
        sprite.fly_angle = sprite.gunOptions.angle.getValue();
      }


      sprite.Scale(sprite.scale);

      if (positions.length >= 1) {
        if (x < positions.length) {
          sprite.Position(this.position.add(positions[x]));

          if(positions[x] && positions[x].hasOwnProperty('r') && !isNaN(positions[x].r) &&
           positions[x].r >= -360 && positions[x].r <= 360)
          {
            sprite.r = positions[x].r;
          }
        } else {
          sprite.Position(this.position);
        }

      } else {
        sprite.Position(this.trackablePosition || this.position);
      }

      var gameWindow = this.gameWindow;


      if (this.lockedRotation) {
        sprite.Rotation(this.lockedRotation);
      }

      sprite.update = function() {

        this.ticker += 1;

        this.life -= 1;

        if (this.life <= 0) {
          //console.log('REMOVING PARTICLE');
          particle.sprites.splice(particle.sprites.indexOf(this), 1);
          gameWindow.remove(this);
        }

        this.scale = this.gunOptions.scale.getValue();

        this.Scale(this.scale);

        if (!particle.isPrerendered && particle.options.color && particle.options.color.hasVariance()) {
          this.color = this.gunOptions.color.getValue();
          this.ColorEffect(this.color);
        }

        this.Opacity(this.gunOptions.alpha.getValue());

        this.gunSpeed = this.gunOptions.speed.getValue();

        this.flyByRotation(this.r ? this.r % 360 : this.fly_angle % 360, this.gunSpeed);

        if (particle.trackableSpeed) {
          this.position = this.position.add(particle.trackableSpeed);
        }
        if (particle.trackablePosition) {
          this.position = particle.trackablePosition;
        }
      };

      this.sprites.push(sprite);
      this.gameWindow.add(sprite);
    }
  }

  resetTicker() {
    this.ticker = 0;
    return this;
  }


  assignTrackableSpeed(speed) {

    this.trackableSpeed = speed;
    return this;
  }


  assignTrackablePosition(position) {

    this.trackablePosition = position;
    return this;
  }

  assignLinesAndSelector(lineList, lineSelector) {
    this.lines = lines;
    return this;
  }


  enter(number) {

    this.ticker += 1;

    this.addParticles(number);

    //return an api for assigning various updates::

    var $p = this;

    return this;

  }
}

Gamelab.Particle = Particle;

class Effect extends Particle {

  constructor() {
    super(...arguments);

  }
}

Gamelab.Effect = Effect;
