class HumanSkeleton extends ScriptLoader {

  constructor() {
    super();
    Object.assign(this, __SpriteAssembly.Skeleton());

    this.callstack = [];

  }

  loadGame(gameWindow) {

    gameWindow.add(this.left_leg);

    gameWindow.add(this.left_arm);

    gameWindow.add(this.skeletonParts);

    gameWindow.add(this.right_leg);

    gameWindow.add(this.right_arm);

    return this;
  }


  prepareMove(callback)
  {
      callback.bind(this).call();
  }


};


var __SpriteAssembly = __SpriteAssembly || {};

__SpriteAssembly.Skeleton = function() {

  var Skeleton = {};

  var skeletonParts = new Gamestack.RobotixArray();

  var skull = new Gamestack.Sprite(`res/images/parts/head.png`).Scale(0.87),

    torso = new Gamestack.Sprite(`res/images/parts/torso.png`),

    hip = new Gamestack.Sprite(`res/images/parts/hip.png`);

  var right_leg = new Gamestack.RobotixVerticalChain(),

    right_arm = new Gamestack.RobotixVerticalChain(),

    left_arm = new Gamestack.RobotixVerticalChain();

  right_leg.add(new Gamestack.Sprite(`res/images/parts/leg-top.png`));

  right_leg.add(new Gamestack.Sprite(`res/images/parts/leg-bottom.png`));

  right_arm.add(new Gamestack.Sprite(`res/images/parts/arm-top.png`));

  right_arm.add(new Gamestack.Sprite(`res/images/parts/arm-bottom.png`));

  left_arm.add(new Gamestack.Sprite(`res/images/parts/arm-top.png`).Scale(0.9));

  left_arm.add(new Gamestack.Sprite(`res/images/parts/arm-bottom.png`).Scale(0.9));


  //apply origin

  right_arm.sprites[0].onUpdate(function() {

    this.origin = new Gamestack.Vector(this.size.x / 2, 0);

    this.offset = new Gamestack.Vector(0, 0);

  });

  right_arm.sprites[1].onUpdate(function() {

    this.origin = new Gamestack.Vector(this.size.x / 2, 0);

    this.offset = new Gamestack.Vector(-11, -8);

  });

  left_arm.sprites[0].onUpdate(function() {

    this.origin = new Gamestack.Vector(this.size.x / 2, 0);

    this.offset = new Gamestack.Vector(0, 0);

  });

  left_arm.sprites[1].onUpdate(function() {

    this.origin = new Gamestack.Vector(this.size.x / 2, 0);

    this.offset = new Gamestack.Vector(-11, -8);

  });

  right_leg.sprites[0].onUpdate(function() {

    this.origin = new Gamestack.Vector(this.size.x / 2, 0);

    this.offset = new Gamestack.Vector(0, 0);

  });

  right_leg.sprites[1].onUpdate(function() {

    this.origin = new Gamestack.Vector(this.size.x / 2, 0);

    this.offset = new Gamestack.Vector(0, 0);

    //   this.rotation.x += 1;

  });


  var rfoot = new Gamestack.Sprite(`res/images/parts/foot.png`);

  rfoot.onUpdate(function() {

    this.origin = new Gamestack.Vector(this.size.x * 0.2, this.size.y * 0.2);

    this.offset = new Gamestack.Vector(-22, 30);

  });

  rfoot.onUpdate(function() {

    this.rotation.x = right_leg.sprites[1].rotation.x - 90;

  });

  right_leg.add(rfoot);

  var lfoot = new Gamestack.Sprite(`res/images/parts/foot.png`).Scale(0.9);

  lfoot.onUpdate(function() {

    this.origin = new Gamestack.Vector(this.size.x * 0.2, this.size.y * 0.2);

    this.offset = new Gamestack.Vector(-22, 30);

  });

  lfoot.onUpdate(function() {

    this.rotation.x = left_leg.sprites[1].rotation.x - 90;

  });


  var left_leg = new Gamestack.RobotixVerticalChain();

  left_leg.add(new Gamestack.Sprite(`res/images/parts/leg-top.png`).Scale(0.9));

  left_leg.add(new Gamestack.Sprite(`res/images/parts/leg-bottom.png`).Scale(0.9));

  left_leg.add(lfoot);

  left_leg.sprites[0].onUpdate(function() {

    this.origin = new Gamestack.Vector(this.size.x / 2, 0);

    this.offset = new Gamestack.Vector(0, 0);

  });

  left_leg.sprites[1].onUpdate(function() {

    this.origin = new Gamestack.Vector(this.size.x / 2, 0);

    this.offset = new Gamestack.Vector(0, 0);

  });


  function place_legs() {

    right_leg.sprites[0].position = new Gamestack.Vector(260, 200);

    left_leg.sprites[0].position = new Gamestack.Vector(260, 192);

  }

  function place_arms() {

    right_arm.sprites[0].position = new Gamestack.Vector(263, 76);

    left_arm.sprites[0].position = new Gamestack.Vector(263, 74);

  }

  //  skull.setToSingleFrame();

  skull.position.x = 252;

  skull.position.y = 56;

  torso.position.x = 250;

  torso.position.y = 105;

  hip.position.x = 255;

  hip.position.y = 245;

  //add to the skeletonParts
  skeletonParts.add(skull);

  //add to the skeletonParts
  skeletonParts.add(torso);

  //add to the skeletonParts
  skeletonParts.add(hip);

  place_legs();

  place_arms();

  //size all when loaded
  skeletonParts.onLoadSprites(function(sprites) {
    this.each(function(ix, item) {
      console.log('sprite loaded:: size:' + jstr(item.size) + "::" + jstr(item.position));

      console.log('sprite animation:' + jstr(item.selected_animation));
    });

  });


  Skeleton.head = skull;

  Skeleton.torso = torso;

  Skeleton.hip = hip;

  Skeleton.left_arm = left_arm;

  Skeleton.right_arm = right_arm;

  Skeleton.left_leg = left_leg;

  Skeleton.right_leg = right_leg;

  Skeleton.skeletonParts = skeletonParts;

  return Skeleton;

};
