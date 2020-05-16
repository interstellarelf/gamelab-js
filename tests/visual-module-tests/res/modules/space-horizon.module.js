


var sunBurnArguments = {

  globalCompositeOperation: 'lighter',

  birthrate: 200,

  shape:new Gamelab.Circle(20),

  pointMode:'perimeter',

  life: {
    a: 10,
    b: 10,
    transition: 'random'
  },

  speed: {
    a: 0,
    b: 5,
    transition: 'linear'
  },
  scale: {
    a: 0.4,
    b: 0.8,
    transition: 'linear'
  },
  angle: {
    a: 0,
    b: 360,
    transition: 'random'
  },
  alpha: {
    a: 0.8,
    b: 0.2,
    transition: 'linear'
  }
},

sunBodyArguments = {

  globalCompositeOperation: 'lighter',

  birthrate: 10,

  shape:new Gamelab.Circle(4),

  pointMode:'normal',

  life: {
    a: 10,
    b: 10,
    transition: 'random'
  },

  speed: {
    a: 0,
    b: 0,
    transition: 'linear'
  },
  scale: {
    a: 0.4,
    b: 0.6,
    transition: 'linear'
  },
  angle: {
    a: 0,
    b: 360,
    transition: 'random'
  },
  alpha: {
    a: 0.8,
    b: 0.2,
    transition: 'linear'
  }
};






module.exports = function(){

  var sunBurn1 = new Gamelab.Particle(sunBurnArguments, gameWindow).Src('./res/images/particles/fire.png');
  sunBurn1.Composite('lighter');

  var sunBody1 = new Gamelab.Particle(sunBodyArguments, gameWindow).Src('./res/images/particles/fire.png');
  sunBody1.Composite('lighter');



  var moonSprite = new Gamelab.Sprite('./res/images/space/moon.png').Scale(0.12);


  gameWindow.add(moonSprite);

  setInterval(function(){

  //console.log('enterring particle');


  $MOD.update();

   sunBurn1.enter(20);
   sunBody1.enter(5);


  }, 40);

  var $MOD = {};

  $MOD = {

    r:-32,

    orbit:new Gamelab.Circle(3000),

    update:function(){

      this.r -= 0.02;

      this.orbitTop = new Gamelab.Vector(gameWindow.canvas.width / 2, 200);

      this.position = this.orbitTop.add(0, 3000);

      moonSprite.Pos(this.position);

      var p1 = this.position.add(this.orbit.getCircumferencePoint(this.r - 45));

      moonSprite.Pos(moonSprite.position.add(this.orbit.getCircumferencePoint(this.r - 105)));

      sunBurn1.Position(p1);

      sunBody1.Position(p1);

      gameWindow.removeDeadObjects();

    }
  }

  return $MOD;

};
