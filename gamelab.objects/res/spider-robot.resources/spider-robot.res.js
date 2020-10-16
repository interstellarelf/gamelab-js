var module = module || {};


function cloneSprite(sprite, flipX, flipY, name, builderGroup) {
  var copySprite = new Gamelab.Sprite(sprite.src);
  copySprite.Origin(sprite.origin);
  copySprite.Layer(sprite.layer);
  copySprite.Scale(sprite.scale);
  copySprite.boneOffset = new Gamelab.Vector(sprite.boneOffset);
  copySprite.flipX = flipX;
  copySprite.flipY = flipY;
  copySprite.Position(sprite.position);
  copySprite.Rotation(sprite.rotation);
  copySprite.rotSpeed = sprite.rotSpeed || 0;
  copySprite.builderGroup = builderGroup;
  copySprite.name = name;
  return copySprite;
};

module.exports = function() {

  let sprites = [];
  let legSources = ['./res/spider-robot.resources/spider-robot/leg-a.png',
    //    './res/spider-robot.resources/spider-robot/leg-b.png',
    './res/spider-robot.resources/spider-robot/leg-c.png',
    './res/spider-robot.resources/spider-robot/leg-d.png',
    './res/spider-robot.resources/spider-robot/rot-gun-a.png'
  ];

  let centerSource = './res/spider-robot.resources/spider-robot/center-new.png';
  let legix = 0;

  let bonesLeft = [],
    bonesRight = [];

  legSources.forEach(function(src) {
    let sprite = new Gamelab.Sprite(src);
    sprite.Name(src.split('/').pop().split('.')[0]);
    legix += 1;
    sprite.builderGroup = 'spiderRobotLegs';
    sprite.scale = 0.5;
    var origin = new Gamelab.Vector(0, 0, 0);
    sprite.Origin(origin);

    if (sprite.name == 'leg-a') {
      var origin = new Gamelab.Vector(98, 344, 0);
      sprite.Origin(origin);
      sprite.Layer(3);

      var rightLeg = new Gamelab.Sprite(src);

      rightLeg.Layer(3);
      rightLeg.scale = 0.5;

      sprite.boneOffset = new Gamelab.Vector(0, 0, 0);
      rightLeg.boneOffset = new Gamelab.Vector(0, 0, 0);

      sprite.Rotation(0, 0, 50);

      rightLeg.Rotation(0, 0, 50);


      sprite.rotSpeed = 0.5; // 0.25;
      rightLeg.rotSpeed = 0.5; // 0.25;

      sprite.Name(src.split('/').pop().split('.')[0] + '-left');
      sprite.builderGroup = 'leftLeg';


      rightLeg.Name(src.split('/').pop().split('.')[0] + '-right');
      rightLeg.builderGroup = 'rightLeg';


      rightLeg.flipX = true;

      rightLeg.Origin(origin);

      sprite.position = new Gamelab.Vector(-350, 200, 0);

      rightLeg.position = new Gamelab.Vector(350, 200, 0);

      sprites.push(rightLeg);
      sprites.push(sprite);
      sprites.push(cloneSprite(sprite, false, true, 'left-a-2', 'leftLowerLeg'));
      sprites.push(cloneSprite(rightLeg, true, true, 'right-a-2', 'rightLowerLeg'));
    }

    if (sprite.name == 'leg-b') {
      console.log('Skipping load on leg-b');
    }
    if (sprite.name == 'leg-c') {

      var origin = new Gamelab.Vector(110, 270, 0);
      sprite.Origin(origin);
      sprite.Layer(2);
      var rightLeg = new Gamelab.Sprite(src);
      rightLeg.Layer(2);
      rightLeg.scale = 0.5;

      sprite.boneOffset = new Gamelab.Vector(0, 260, 0);
      rightLeg.boneOffset = new Gamelab.Vector(0, 260, 0);

      sprite.Rotation(0, 0, 120);
      rightLeg.Rotation(0, 0, 120);

      sprite.rotSpeed = 0.5; // 0.5;
      rightLeg.rotSpeed = 0.5; // 0.5;

      sprite.Name(src.split('/').pop().split('.')[0] + '-left');
      sprite.builderGroup = 'leftLeg';
      rightLeg.Name(src.split('/').pop().split('.')[0] + '-right');
      rightLeg.builderGroup = 'rightLeg';
      rightLeg.flipX = true;
      rightLeg.Origin(origin);

      sprite.position = new Gamelab.Vector(-350, 200, 0);
      rightLeg.position = new Gamelab.Vector(350, 200, 0);

      sprites.push(rightLeg);
      sprites.push(sprite);
      sprites.push(cloneSprite(sprite, false, true, 'left-c-2', 'leftLowerLeg'));
      sprites.push(cloneSprite(rightLeg, true, true, 'right-c-2', 'rightLowerLeg'));
    }
    if (sprite.name == 'leg-d') {

      sprite.scale = 0.5;
      var origin = new Gamelab.Vector(112, 462, 0);
      sprite.Origin(origin);
      sprite.Scale(sprite.scale);
      sprite.Layer(1);
      var rightLeg = new Gamelab.Sprite(src);
      rightLeg.Layer(1);
      rightLeg.scale = 0.5;


      sprite.boneOffset = new Gamelab.Vector(0, 240, 0);
      rightLeg.boneOffset = new Gamelab.Vector(0, 240, 0);

      sprite.Rotation(0, 0, 30);
      rightLeg.Rotation(0, 0, 30);

      sprite.rotSpeed = 0.5; // 0.85;
      rightLeg.rotSpeed = 0.5; // 0.85;


      sprite.Name(src.split('/').pop().split('.')[0] + '-left');
      sprite.builderGroup = 'leftLeg';
      rightLeg.Name(src.split('/').pop().split('.')[0] + '-right');
      rightLeg.builderGroup = 'rightLeg';
      rightLeg.flipX = true;
      rightLeg.Origin(origin);

      sprite.position = new Gamelab.Vector(-350, 200, 0);
      rightLeg.position = new Gamelab.Vector(350, 200, 0);


      sprites.push(rightLeg);
      sprites.push(sprite);

      sprites.push(cloneSprite(sprite, false, true, 'left-d-2', 'leftLowerLeg'));
      sprites.push(cloneSprite(rightLeg, true, true, 'right-d-2', 'rightLowerLeg'));
    }
    if (sprite.name == 'rot-gun-a') {

    }
  });

  let centerSprite = new Gamelab.Sprite(centerSource);
  centerSprite.Name('spider-center');
  centerSprite.scale = 0.5;
  centerSprite.Layer(5);
  centerSprite.Origin(290, 320);

  centerSprite.position = new Gamelab.Vector(0, 0, 0);
  centerSprite.builderGroup = 'spider-robot-center';
  centerSprite.isGroupMaster = true;


  sprites.getByName = function(n) {

    for (var x = 0; x < this.length; x++) {

      if (this[x].name == n) {
        return this[x];
      }

    }
    return false;
  };

  var leftLegA = sprites.getByName('leg-a-left'),
    leftLegC = sprites.getByName('leg-c-left'),
    leftLegD = sprites.getByName('leg-d-left'),
    rightLegA = sprites.getByName('leg-a-right'),
    rightLegC = sprites.getByName('leg-c-right'),
    rightLegD = sprites.getByName('leg-d-right');

  var leftLegA2 = sprites.getByName('left-a-2'),
    leftLegC2 = sprites.getByName('left-c-2'),
    leftLegD2 = sprites.getByName('left-d-2'),
    rightLegA2 = sprites.getByName('right-a-2'),
    rightLegC2 = sprites.getByName('right-c-2'),
    rightLegD2 = sprites.getByName('right-d-2');


  var mainBoneL = new Gamelab.Bone3D(),
    mainBoneR = new Gamelab.Bone3D();
  mainBoneL.Parent(centerSprite);
  mainBoneR.Parent(centerSprite);
  centerSprite.children = centerSprite.children || [];
  mainBoneL.Target(leftLegA);
  mainBoneR.Target(rightLegA);

  leftLegA.isBoneMaster = true;

  rightLegA.isBoneMaster = true;

  //  centerSprite.children.push(mainBoneL);
  //  centerSprite.children.push(mainBoneR);


  var bones = [];


  if (leftLegA && leftLegC) {
    //alert('got left Leg A + C');
    leftLegA.children = leftLegA.children || [];
    var lBone = new Gamelab.Bone3D();
    lBone.Parent(leftLegA);
    lBone.Target(leftLegC);
    leftLegA.children.push(lBone);
    bones.push(lBone);
  }

  if (leftLegA2 && leftLegC2) {
    //alert('got left Leg A2 + C2');
    leftLegA2.children = leftLegA2.children || [];
    var lBone = new Gamelab.Bone3D();
    lBone.Parent(leftLegA2);
    lBone.Target(leftLegC2);
    leftLegA2.children.push(lBone);
    bones.push(lBone);
  }

  if (rightLegA && rightLegC) {
    //alert('got right Leg A + C');
    rightLegA.children = rightLegA.children || [];
    var rBone = new Gamelab.Bone3D();
    rBone.Parent(rightLegA);
    rBone.Target(rightLegC);
    rightLegA.children.push(rBone);
    bones.push(rBone);
  }

  if (rightLegA2 && rightLegC2) {
    //alert('got right Leg A2 + C2');
    rightLegA2.children = rightLegA2.children || [];
    var rBone = new Gamelab.Bone3D();
    rBone.Parent(rightLegA2);
    rBone.Target(rightLegC2);
    rightLegA2.children.push(rBone);
    bones.push(rBone);
  }

  if (leftLegC && leftLegD) {
    //alert('got left Leg C + D');
    leftLegC.children = leftLegC.children || [];
    var lBone = new Gamelab.Bone3D();
    lBone.Parent(leftLegC);
    lBone.Target(leftLegD);
    leftLegC.children.push(lBone);
    bones.push(lBone);
  }

  if (leftLegC2 && leftLegD2) {
    //alert('got left Leg C2 + D2');
    leftLegC2.children = leftLegC2.children || [];
    var lBone = new Gamelab.Bone3D();
    lBone.Parent(leftLegC2);
    lBone.Target(leftLegD2);
    leftLegC2.children.push(lBone);
    bones.push(lBone);
  }

  if (rightLegC && rightLegD) {
    //alert('got right Leg C + D');
    rightLegC.children = rightLegC.children || [];
    var rBone = new Gamelab.Bone3D();
    rBone.Parent(rightLegC);
    rBone.Target(rightLegD);
    rightLegC.children.push(rBone);
    bones.push(rBone);
  }

  if (rightLegC2 && rightLegD2) {
    //alert('got right Leg C2 + D2');
    rightLegC2.children = rightLegC2.children || [];
    var rBone = new Gamelab.Bone3D();
    rBone.Parent(rightLegC2);
    rBone.Target(rightLegD2);
    rightLegC2.children.push(rBone);
    bones.push(rBone);
  }

  sprites.push(centerSprite);
  return sprites.concat(bones);
};


window.module = module;