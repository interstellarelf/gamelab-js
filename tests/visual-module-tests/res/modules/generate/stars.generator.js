
const starArguments = {

  birthrate: 10,

  life: {
    a: 100000000,
    b: 100000000,
    transition: 'linear'
  },

  shape:new Gamelab.Circle(900),

  pointMode:'normal',

  speed: {
    a: 0,
    b: 0,
    transition: 'linear'
  },
  scale: {
    a: 0.025,
    b: 0.125,
    transition: 'random-once'
  },
  angle: {
    a: 0,
    b: 360,
    transition: 'random'
  },
  alpha: {
    a: 1.0,
    b: 1.0,
    transition: 'random'
  }
};


module.exports = function() {


    var stars = new Gamelab.Particle(starArguments, gameWindow).Src('./res/images/particles/star.png');
    stars.Composite('lighter');

    var enterred = false;

    gameWindow.onBeforeDraw(function(){

      stars.Position(new Gamelab.Vector(gameWindow.canvas.width / 2, gameWindow.canvas.height / 2));

      if(!enterred)
      {
        stars.enter(60);
        enterred = true;
      }

    });

  var $MOD = {
    update: function() {


    }
  };

};
