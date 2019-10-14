class Bone {

  constructor(target={}, size) {

    this.size = size || target.size;

    if (typeof target == 'Object' && target.id)
      this.target_id = target.id;

    this.targetAnimation = target;

    this.parentAnimation = {};

    this.origin = target.origin || new Gamelab.Vector(0, 0, 0);

    this.rotation = target.rotation || new Gamelab.Vector(0, 0, 0);

    this.parentOffset = new Gamelab.Vector(0, 0, 0);

    this.size = size;

    //every frame of the target object gets same size::

    if(target.Size)
    {
        target.Size(size.x, size.y, size.z);
    }

  }

  Target(t){

    this.targetAnimation = t;
    return this;
  }


  Parent(p){

      this.parentAnimation = p;
      return this;
    }

  ParentOffset(x, y)
  {
    this.parentOffset = new Gamelab.Vector(x, y);
    return this;
  }

  Origin(x, y, z){

    this.origin = new Gamelab.Vector(x, y, z);
    this.targetAnimation.Origin(x, y, z);
    return this;
  }

  Size(x, y, z){

    this.size = new Gamelab.Vector(x, y, z);
    this.targetAnimation.Size(x, y, z);

  }

  Rotation(x, y, z)
  {
    this.rotation = new Gamelab.Vector(x, y, z);
    this.targetAnimation.Rotation(this.rotation);
    return this;
  }

  update(){

          console.log('Bone.js :: onPosition, --setting');

          var rotatedOffset = Gamelab.VectorMath.rotatePointsXY(this.parentOffset.x, this.parentOffset.y, this.parentAnimation.rotation.x),

          fullPosition = this.parentAnimation.position.add(rotatedOffset);

          this.targetAnimation.Position(fullPosition);

  }

}


class BoneState {

  constructor(boneList) {

    var states = [];

    boneList.forEach(function(bone) {

      states.push({
        bone:bone,
        offset: new Gamelab.Vector(),
        rotation: new Gamelab.Vector(),
        size: new Gamelab.Vector(),
      });

    });

  }

}
Gamelab.BoneState = BoneState;
Gamelab.Bone = Bone;
