


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
