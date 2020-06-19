class Bone {
  constructor() {
    this.parent = undefined;
    this.target = undefined;
    this.offset = new Gamelab.Vector(0, 0);
  }
  updatePositionRotation() {
    //  console.log('Parent-Rotation:' + this.parentAnimation.rotation.x);
    var rotatedOffset = Gamelab.VectorMath.rotatePointsXY(this.offset.x, this.offset.y, this.parent.rotation.x),
      fullPosition = this.parent.position.add(this.parent.origin).sub(this.target.origin).add(rotatedOffset);
    this.target.Position(fullPosition);
    this.RotateTarget(this.target.rotation);
    return fullPosition;
  }

  RotateTarget(x, y, z) {
    this.target.Rotation(x, y, z);
    return this;
  }

  Parent(p) {
    this.parent = p;
    return this;
  }
  Target(t) {
    this.target = t;
    return this;
  }

  Offset(o) {
    this.offset = o;
    return this;
  }
}

Gamelab.Bone = Bone;


class Bone3D {
  constructor() {
    this.parent = undefined;
    this.target = undefined;
    this.offset = new Gamelab.Vector(0, 0);
  }
  getRotatedOffset() {
    //  console.log('Parent-Rotation:' + this.parentAnimation.rotation.x);
    //apply rotation, convert radians to degrees
    if (!this.parent || !this.parent.member) {
      return console.error('cannot update bone3d without parent and parent.member ');
    }

    var scale = this.target.threejsScale;

    var previousOffset = this.parent.rotOffset || new Gamelab.Vector(0, 0, 0);

    var rotatedOffset = Gamelab.VectorMath.rotatePointsXY(this.offset.x, this.offset.y, this.parent.rotation.z),
      targetRotOffset = new Gamelab.Vector(0, 0, 0)
      .add(this.parent.origin)
      .sub(this.target.origin).add(rotatedOffset);
    var rotOffset = targetRotOffset;
    return rotOffset;
  }

  Parent(p) {
    this.parent = p;
    return this;
  }
  Target(t) {
    this.target = t;
    return this;
  }

  Offset(o) {
    this.offset = o;
    return this;
  }
}

Gamelab.Bone3D = Bone3D;
let Bone3d = Bone3D;
Gamelab.Bone3D = Bone3D;


class BoneState {
  constructor(boneList) {
    var states = [];
    boneList.forEach(function(bone) {
      states.push({
        bone: bone,
        offset: new Gamelab.Vector(),
        rotation: new Gamelab.Vector(),
        size: new Gamelab.Vector(),
      });
    });
  }
}

Gamelab.BoneState = BoneState;