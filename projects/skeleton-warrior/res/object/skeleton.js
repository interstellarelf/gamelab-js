class HumanSkeleton extends Scriptable {

  constructor() {
    super();
    this.Object(this);
    Object.assign(this, __SpriteAssembly.Skeleton());
  }

  loadGame(gameWindow) {

    function load_each(part) {
      part.each(function(ix, sprite) {

        if (sprite instanceof Gamestack.Sprite) {
          gameWindow.add(sprite);
        }

      });
    };

    load_each(this.left_leg);

    load_each(this.left_arm);

    load_each(this.right_leg);

    load_each(this.middleParts);

        load_each(this.right_arm);

    return this;
  }
};


var __SpriteAssembly = __SpriteAssembly || {};

__SpriteAssembly.Skeleton = function() {

  var Skeleton = {};

  var middleParts = new Gamestack.SpriteArray();

  var skull = new Gamestack.Sprite(`res/images/parts/head.png`).Scale(0.87),

    torso = new Gamestack.Sprite(`res/images/parts/torso.png`),

    hip = new Gamestack.Sprite(`res/images/parts/hip.png`);

  var right_leg = new Gamestack.SpriteVerticalChain(),

    right_arm = new Gamestack.SpriteVerticalChain(),

    left_arm = new Gamestack.SpriteVerticalChain();

  right_leg.add(new Gamestack.Sprite(`res/images/parts/leg-top.png`).Scale(0.9));

  right_leg.add(new Gamestack.Sprite(`res/images/parts/leg-bottom.png`).Scale(0.9));

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

  right_leg.add(rfoot.Scale(0.8));

  var lfoot = new Gamestack.Sprite(`res/images/parts/foot.png`).Scale(0.9);

  lfoot.onUpdate(function() {

    this.origin = new Gamestack.Vector(this.size.x * 0.2, this.size.y * 0.2);

    this.offset = new Gamestack.Vector(-22, 30);

  });

  lfoot.onUpdate(function() {

    this.rotation.x = left_leg.sprites[1].rotation.x - 90;

  });


  var left_leg = new Gamestack.SpriteVerticalChain();

  left_leg.add(new Gamestack.Sprite(`res/images/parts/leg-top.png`).Scale(0.9));

  left_leg.add(new Gamestack.Sprite(`res/images/parts/leg-bottom.png`).Scale(0.9));

  left_leg.add(lfoot.Scale(0.85));

  left_leg.sprites[0].onUpdate(function() {

    this.origin = new Gamestack.Vector(this.size.x / 2, 0);

    this.offset = new Gamestack.Vector(0, 0);

  });

  left_leg.sprites[1].onUpdate(function() {

    this.origin = new Gamestack.Vector(this.size.x / 2, 0);

    this.offset = new Gamestack.Vector(0, 0);

  });


  function place_legs() {

    right_leg.sprites[0].position = new Gamestack.Vector(260, 202);

    left_leg.sprites[0].position = new Gamestack.Vector(260, 200);

  }

  function place_arms() {

    right_arm.sprites[0].position = new Gamestack.Vector(258, 80);

    left_arm.sprites[0].position = new Gamestack.Vector(258, 78);

  }

  //  skull.setToSingleFrame();

  skull.position.x = 202;

  skull.position.y = 29;

  torso.position.x = 200;

  torso.position.y = 40;

  hip.position.x = 232;

  hip.position.y = 231;

  //add to the middleParts
  middleParts.add(skull);

  //add to the middleParts
  middleParts.add(torso);

  //add to the middleParts
  middleParts.add(hip);

  place_legs();

  place_arms();

  //size all when loaded
  middleParts.onLoadSprites(function(sprites) {
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

  Skeleton.middleParts = middleParts;

  return Skeleton;

};
