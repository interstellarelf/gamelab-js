Gamelab.assign3DGroupMesh = function(key, mesh, sprite) {
  Gamelab.ThreejsGroups = Gamelab.ThreejsGroups || [];
  Gamelab.ThreejsGroups[key] = Gamelab.ThreejsGroups[key] || new THREE.Object3D();
  Gamelab.ThreejsGroups[key].countOps = Gamelab.ThreejsGroups[key].countOps || 1.0;
  Gamelab.ThreejsGroups[key].countOps += 1.0;
  Gamelab.ThreejsGroups[key].add(mesh);
  mesh.layer = sprite.layer;
  return Gamelab.ThreejsGroups[key];
};

class Sprite3d {
  constructor(gamelabSprite, scale) {
    var sprite = gamelabSprite,
      texture = new THREE.TextureLoader().load(sprite.src);
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
    var w = sprite.image.domElement.width,
      h = sprite.image.domElement.height;
    var geometry = new THREE.PlaneGeometry(w, h, 1, 1);
    var material = new THREE.MeshPhongMaterial({
      map: texture,
      transparent: true
    });
    //material.colorWrite = false;
    material.side = THREE.DoubleSide;
    var mesh = new THREE.Mesh(geometry, material);

    material.needsUpdate = true;

    sprite.threejsScale = scale * sprite.scale;

    mesh.scale.set(sprite.threejsScale, sprite.threejsScale, 1);

    // Add to pivot group
    var member = new THREE.Object3D();

    if (gamelabSprite.memberOffset) {
      sprite.memberOffset = gamelabSprite.memberOffset;
    }

    if (gamelabSprite.meshScaleOffset) {
      sprite.meshScaleOffset = gamelabSprite.meshScaleOffset;
    }


    member.add(mesh);

    sprite.member = member;

    sprite.builderGroup = sprite.builderGroup || 'MASTER';

    sprite.threejsGroup = Gamelab.assign3DGroupMesh(sprite.builderGroup, sprite.member, sprite);

    sprite.threejsMesh = mesh;

    var realSize = new Gamelab.Vector(sprite.image.domElement.width, sprite.image.domElement.height, 1).mult(sprite.threejsScale);

    sprite.threejsGroup.position.x = sprite.position.x - realSize.x;
    sprite.threejsGroup.position.y = sprite.position.y - realSize.y;
    sprite.threejsGroup.position.z = sprite.position.z - 500;

    sprite.threejsGroup.needsUpdate = true;

    sprite.applyBoneTargetOffset = function() {
      if (this.children instanceof Array) {
        this.children.forEach(function(child) {
          if (child.target && child.target.boneOffset && child instanceof Bone3D) {
            child.Offset(child.target.boneOffset);
            child.target.rotOffset = child.getRotatedOffset();
            if (child.parent.rotOffset) {
              child.target.rotOffset = child.target.rotOffset.add(child.parent.rotOffset);
            }
          }
        });
      }
    };

    sprite.onUpdate(function() {
      var maxRadians = 6.28,
        halfMaxRadians = maxRadians / 2.0;
      var realSize = new Gamelab.Vector(this.image.domElement.width, this.image.domElement.height, 1).mult(this.threejsScale);
      this.threejsPosition = this.position.mult(this.threejsScale);

      this.realSize = realSize;

      this.threejsMesh.position.x = realSize.x / 2.0;
      this.threejsMesh.position.y = realSize.y / 2.0;

      if (this.meshScaleOffset) {
        this.threejsMesh.position.x += this.meshScaleOffset.x * this.realSize.x;
        this.threejsMesh.position.y += this.meshScaleOffset.y * this.realSize.y;
      }

      this.member.position.x = 0;
      this.member.position.y = 0;
      this.member.position.z = 0;

      if (this.memberOffset) {
        this.member.position.x += this.memberOffset.x * this.threejsScale;
        this.member.position.y += this.memberOffset.y * this.threejsScale;
        this.member.position.z += this.memberOffset.z * this.threejsScale;
      }

      this.applyBoneTargetOffset();

      if (this.rotOffset) {
        this.member.position.x += this.rotOffset.x * this.threejsScale;
        this.member.position.y += this.rotOffset.y * this.threejsScale;
        this.member.position.z += this.rotOffset.z * this.threejsScale;
        this.member.position.z += this.rotOffset.z * this.threejsScale;
      } else {
        this.member.position.z = 0;
      }

      this.memberIndex = this.memberIndex || 1;

      this.member.position.z += this.flipX ? this.layer * -0.1 : this.layer * 0.1;

      this.member.position.z += this.threejsPosition.z;

      this.threejsGroup.position.x = this.threejsPosition.x - realSize.x;
      this.threejsGroup.position.y = -this.threejsPosition.y + realSize.y;
      this.threejsGroup.position.z = this.threejsPosition.z - 500;

      var originSize = this.origin.mult(this.threejsScale),
        originDiff = realSize.sub(originSize);

      var halfSizeDiff = realSize.half().sub(originSize);

      this.threejsMesh.position.x -= originDiff.x;
      this.threejsMesh.position.y -= originDiff.y;

      if (this.groupType == 'singular') {
        this.threejsGroup.position.x += realSize.x / 2.0;
      }

      if (this.flipX) {
        this.threejsGroup.rotation.y = halfMaxRadians;
        this.threejsGroup.position.x -= realSize.x / 2.0;
      } else {
        this.threejsGroup.position.x += realSize.x / 2.0;
      }

      if (this.flipY) {
        this.threejsGroup.rotation.x = halfMaxRadians;
        this.threejsGroup.position.y -= realSize.y / 2.0;
      } else {
        this.threejsGroup.position.y += realSize.y / 2.0;
      }

      this.rotation.z += this.rotSpeed * 10.0 || 0;

      this.member.rotation.x = THREE.Math.degToRad(this.rotation.x);
      this.member.rotation.y = THREE.Math.degToRad(this.rotation.y);
      this.member.rotation.z = THREE.Math.degToRad(this.rotation.z);


    });

    return {
      group: sprite.threejsGroup,
      member: sprite.member
    };
  }
}
let Sprite3D = Sprite3d;

Gamelab.Sprite3d = Sprite3d;
Gamelab.Sprite3D = Sprite3D;

class SpriteController {
  constructor() {
    this.sprites = [];
  }
  get(index) {
    return this.sprites[index];
  }
  add(sprite) {
    this.sprites.push(sprite);
  }
};

Gamelab.SpriteController = SpriteController;