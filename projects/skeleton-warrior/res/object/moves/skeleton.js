



class HumanSkeleton Extends ScriptedConstruct {

  constructor(){

    Object.assign(this, __SpriteAssembly.Skeleton());

  }
};


var __SpriteAssembly = __SpriteAssembly || {};

__SpriteAssembly.Skeleton = function(){

    var Skeleton = {};

    var skull = new Gamestack.Sprite(`../images/gothic/skeleton-warrior/head.png`).Scale(0.87),

      torso = new Gamestack.Sprite(`../images/gothic/skeleton-warrior/torso.png`),

      hip = new Gamestack.Sprite(`../images/gothic/skeleton-warrior/hip.png`);

    var right_leg = new Gamestack.RobotixVerticalChain(),

      right_arm = new Gamestack.RobotixVerticalChain(),

      left_arm = new Gamestack.RobotixVerticalChain();

    right_leg.add(new Gamestack.Sprite(`../images/gothic/skeleton-warrior/leg-top.png`));

    right_leg.add(new Gamestack.Sprite(`../images/gothic/skeleton-warrior/leg-bottom.png`));

    right_arm.add(new Gamestack.Sprite(`../images/gothic/skeleton-warrior/arm-top.png`));

    right_arm.add(new Gamestack.Sprite(`../images/gothic/skeleton-warrior/arm-bottom.png`));

    left_arm.add(new Gamestack.Sprite(`../images/gothic/skeleton-warrior/arm-top.png`).Scale(0.9));

    left_arm.add(new Gamestack.Sprite(`../images/gothic/skeleton-warrior/arm-bottom.png`).Scale(0.9));




  //apply origin

    right_arm.sprites[0].onUpdate(function () {

      this.origin = new Gamestack.Vector(this.size.x / 2, 0);

      this.offset = new Gamestack.Vector(0, 0);

    });

    right_arm.sprites[1].onUpdate(function () {

      this.origin = new Gamestack.Vector(this.size.x / 2, 0);

      this.offset = new Gamestack.Vector(-11, -8);

    });

    left_arm.sprites[0].onUpdate(function () {

      this.origin = new Gamestack.Vector(this.size.x / 2, 0);

      this.offset = new Gamestack.Vector(0, 0);

    });

    left_arm.sprites[1].onUpdate(function () {

      this.origin = new Gamestack.Vector(this.size.x / 2, 0);

      this.offset = new Gamestack.Vector(-11, -8);

    });

    right_leg.sprites[0].onUpdate(function () {

      this.origin = new Gamestack.Vector(this.size.x / 2, 0);

      this.offset = new Gamestack.Vector(0, 0);

    });

    right_leg.sprites[1].onUpdate(function () {

      this.origin = new Gamestack.Vector(this.size.x / 2, 0);

      this.offset = new Gamestack.Vector(0, 0);

      //   this.rotation.x += 1;

    });


    var rfoot = new Gamestack.Sprite(`../images/gothic/skeleton-warrior/foot.png`);

    rfoot.onUpdate(function () {

      this.origin = new Gamestack.Vector(this.size.x * 0.2, this.size.y * 0.2);

      this.offset = new Gamestack.Vector(-22, 30);

    });

    rfoot.onUpdate(function () {

      this.rotation.x = right_leg.sprites[1].rotation.x - 90;

    });

    right_leg.add(rfoot);

    var lfoot = new Gamestack.Sprite(`../images/gothic/skeleton-warrior/foot.png`).Scale(0.9);

    lfoot.onUpdate(function () {

      this.origin = new Gamestack.Vector(this.size.x * 0.2, this.size.y * 0.2);

      this.offset = new Gamestack.Vector(-22, 30);

    });

    lfoot.onUpdate(function () {

      this.rotation.x = left_leg.sprites[1].rotation.x - 90;

    });


    var left_leg = new Gamestack.RobotixVerticalChain();

    left_leg.add(new Gamestack.Sprite(`../images/gothic/skeleton-warrior/leg-top.png`).Scale(0.9));

    left_leg.add(new Gamestack.Sprite(`../images/gothic/skeleton-warrior/leg-bottom.png`).Scale(0.9));

    left_leg.add(lfoot);

    left_leg.sprites[0].onUpdate(function () {

      this.origin = new Gamestack.Vector(this.size.x / 2, 0);

      this.offset = new Gamestack.Vector(0, 0);

    });

    left_leg.sprites[1].onUpdate(function () {

      this.origin = new Gamestack.Vector(this.size.x / 2, 0);

      this.offset = new Gamestack.Vector(0, 0);

    });


    function place_legs() {

      right_leg.sprites[0].position = new Gamestack.Vector(260, 200);

      left_leg.sprites[0].position = new Gamestack.Vector(260, 190);

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

    gameWindow.add(left_leg);

    //add to the skeletonList
    skeletonList.add(skull);

    //add to the skeletonList
    skeletonList.add(torso);

    //add to the skeletonList
    skeletonList.add(hip);

    place_legs();

    place_arms();

    //size all when loaded
    skeletonList.onLoadSprites(function (sprites) {
      this.each(function (ix, item) {
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

    return Skeleton;

};
