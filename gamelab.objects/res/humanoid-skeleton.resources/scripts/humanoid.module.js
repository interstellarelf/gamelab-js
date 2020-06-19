function getSpriteByName(sprites, name) {
  for (var x = 0; x < sprites.length; x++) {
    var s = sprites[x];
    if (s.name == name) {
      s.origin = s.origin || new Gamelab.Vector(0, 0, 0);
      return s;
    }
  }
  return false;
};


module.exports = function(sprites, prefix) {

  this.sprites = sprites;

  var bones = [];

  var head = getSpriteByName(sprites, prefix + '-head'),
    hip = getSpriteByName(sprites, prefix + '-hip'),
    torso = getSpriteByName(sprites, prefix + '-torso'),
    leftArmTop = getSpriteByName(sprites, prefix + '-arm-top-left'),
    rightArmTop = getSpriteByName(sprites, prefix + '-arm-top-right'),

    leftArmBottom = getSpriteByName(sprites, prefix + '-arm-bottom-left'),
    rightArmBottom = getSpriteByName(sprites, prefix + '-arm-bottom-right'),

    centerHip = getSpriteByName(sprites, prefix + '-hip'),
    centerTorso = getSpriteByName(sprites, prefix + '-torso'),

    leftLegTop = getSpriteByName(sprites, prefix + '-leg-top-left'),
    rightLegTop = getSpriteByName(sprites, prefix + '-leg-top-right'),

    leftLegBottom = getSpriteByName(sprites, prefix + '-leg-bottom-left'),
    rightLegBottom = getSpriteByName(sprites, prefix + '-leg-bottom-right'),

    leftFoot = getSpriteByName(sprites, prefix + '-foot-left'),
    rightFoot = getSpriteByName(sprites, prefix + '-foot-right');


  //TODO Position all parts on an animation controller;

  if (head && leftArmTop && rightArmTop && leftArmBottom &&
    rightArmBottom && centerHip && centerTorso &&
    leftLegTop && rightLegTop && leftLegBottom && rightLegBottom &&
    leftFoot && rightFoot) {

    [head, leftArmTop, rightArmTop, leftArmBottom,
      rightArmBottom, centerHip, centerTorso,
      leftLegTop, rightLegTop, leftLegBottom, rightLegBottom,
      leftFoot, rightFoot
    ].forEach(function(s) {
      //s.Position(-200, -200, 0);
    });


    if (centerTorso && head) {
      //alert('got centerTorso + head');
      centerTorso.Position(0, 0, 0);
      head.Position(0, 0, 2);

      centerTorso.Origin(35, 135, 0);
      head.Origin(32, 61, 0);
      head.boneOffset = new Gamelab.Vector(0, 60);
      head.rotSpeed = 0; // 0.2; // 0.5;
      centerTorso.children = centerTorso.children || [];
      var hBone = new Gamelab.Bone3D();
      hBone.Parent(centerTorso);
      hBone.Target(head);
      centerTorso.children.push(hBone);
      bones.push(hBone);
    }

    if (centerTorso && hip) {
      //alert('got centerTorso + hip');
      hip.Position(0, 0, 0);
      hip.Origin(23, 8, 0);
      hip.boneOffset = new Gamelab.Vector(-10, -100);
      hip.rotSpeed = 0; // 0.25; // 0.5;
      centerTorso.children = centerTorso.children || [];
      var hBone = new Gamelab.Bone3D();
      hBone.Parent(centerTorso);
      hBone.Target(hip);
      centerTorso.children.push(hBone);
      bones.push(hBone);
    }


    if (hip && rightLegTop && rightLegBottom && rightFoot) {
      //alert('got hip + rightLegTop + rightLegBottom + rightFoot');
      hip.children = hip.children || [];
      var ltBone = new Gamelab.Bone3D();
      rightLegTop.Scale(0.9);
      rightLegTop.Origin(13, 11, 0);
      rightLegTop.boneOffset = new Gamelab.Vector(-14, -8);

      ltBone.Parent(hip);
      ltBone.Target(rightLegTop);
      hip.children.push(ltBone);
      bones.push(ltBone);

      var lbBone = new Gamelab.Bone3D();

      rightLegTop.children = rightLegTop.children || [];

      rightLegBottom.Origin(9, 8, 0);
      rightLegBottom.Scale(0.9);
      rightLegBottom.boneOffset = new Gamelab.Vector(-2, -100);

      lbBone.Parent(rightLegTop);
      lbBone.Target(rightLegBottom);
      rightLegTop.children.push(lbBone);
      bones.push(lbBone);


      var rftBone = new Gamelab.Bone3D();

      rightLegBottom.children = rightLegBottom.children || [];

      rightFoot.Origin(30, 6, 0);
      rightFoot.Scale(0.9);

      rightFoot.boneOffset = new Gamelab.Vector(6, -100);

      rightFoot.Rotation(0, 0, 90);

      rftBone.Parent(rightLegBottom);
      rftBone.Target(rightFoot);
      rightLegBottom.children.push(rftBone);
      bones.push(rftBone);
    }


    if (hip && leftLegTop && leftLegBottom && leftFoot) {
      //  alert('got hip + leftLegTop + leftLegBottom + leftFoot');
      hip.children = hip.children || [];
      var ltBone = new Gamelab.Bone3D();
      leftLegTop.Scale(0.9);
      leftLegTop.Origin(13, 11, 0);
      leftLegTop.boneOffset = new Gamelab.Vector(-7, -8);

      ltBone.Parent(hip);
      ltBone.Target(leftLegTop);
      hip.children.push(ltBone);
      bones.push(ltBone);

      var lbBone = new Gamelab.Bone3D();
      leftLegTop.children = leftLegTop.children || [];

      leftLegTop.position.z = 1;
      leftLegBottom.position.z = 1;
      leftFoot.position.z = 1;

      leftLegBottom.Origin(9, 8, 0);
      leftLegBottom.Scale(0.9);
      leftLegBottom.boneOffset = new Gamelab.Vector(-2, -100);

      lbBone.Parent(leftLegTop);
      lbBone.Target(leftLegBottom);
      leftLegTop.children.push(lbBone);
      bones.push(lbBone);

      var lftBone = new Gamelab.Bone3D();

      leftLegBottom.children = leftLegBottom.children || [];

      leftFoot.Origin(30, 6, 0);
      leftFoot.Scale(0.9);

      leftFoot.boneOffset = new Gamelab.Vector(6, -100);
      leftFoot.Rotation(0, 0, 90);

      lftBone.Parent(leftLegBottom);
      lftBone.Target(leftFoot);
      leftLegBottom.children.push(lftBone);
      bones.push(lftBone);
    }


    if (torso && rightArmTop && rightArmBottom) {
      //alert('got torso + rightArmTop + rightArmBottom');
      torso.children = torso.children || [];
      var rtBone = new Gamelab.Bone3D();
      rightArmTop.Scale(0.9);
      rightArmTop.Origin(14, 12, 0);
      rightArmTop.boneOffset = new Gamelab.Vector(-22, 0);
      rightArmBottom.meshScaleOffset = new Gamelab.Vector(0.5, 0);

      rtBone.Parent(torso);
      rtBone.Target(rightArmTop);
      torso.children.push(rtBone);
      bones.push(rtBone);

      rightArmTop.rotSpeed = 0.2;
      rightArmBottom.rotSpeed = 0.4;

      rightArmTop.position.z = 4;
      rightArmBottom.position.z = 4;

      var lbBone = new Gamelab.Bone3D();

      rightArmTop.children = rightArmTop.children || [];

      rightArmBottom.Origin(9, 8, 0);
      rightArmBottom.Scale(0.9);
      rightArmBottom.boneOffset = new Gamelab.Vector(2, -90);

      rightArmBottom.meshScaleOffset = new Gamelab.Vector(0.5, 0);
      rightArmBottom.memberOffset = new Gamelab.Vector(0, 0);

      lbBone.Parent(rightArmTop);
      lbBone.Target(rightArmBottom);
      rightArmTop.children.push(lbBone);
      bones.push(lbBone);
    }


    if (torso && leftArmTop && leftArmBottom) {
      //alert('got torso + leftArmTop + leftArmBottom');
      torso.children = torso.children || [];
      var rtBone = new Gamelab.Bone3D();
      leftArmTop.Scale(0.9);
      leftArmTop.Origin(14, 12, 0);
      leftArmTop.boneOffset = new Gamelab.Vector(-22, 0);

      leftArmBottom.meshScaleOffset = new Gamelab.Vector(0.5, 0);

      rtBone.Parent(torso);
      rtBone.Target(leftArmTop);
      torso.children.push(rtBone);
      bones.push(rtBone);

      leftArmTop.rotSpeed = 0.1;
      leftArmBottom.rotSpeed = 0.2;

      var lbBone = new Gamelab.Bone3D();

      leftArmTop.children = leftArmTop.children || [];

      leftArmBottom.Origin(9, 8, 0);
      leftArmBottom.Scale(0.9);
      leftArmBottom.boneOffset = new Gamelab.Vector(2, -90);

      leftArmBottom.meshScaleOffset = new Gamelab.Vector(0.5, 0);
      leftArmBottom.memberOffset = new Gamelab.Vector(0, 0);

      lbBone.Parent(leftArmTop);
      lbBone.Target(leftArmBottom);
      leftArmTop.children.push(lbBone);
      bones.push(lbBone);
    }


  } else {
    console.error('VAR CHECK FAILED');
    alert('VAR CHECK FAILED --humanoid.module');
  }


};