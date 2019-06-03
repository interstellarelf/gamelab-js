class Bone {

  constructor(parent, size) {
    this.size = size || new Gamestack.Vector(0, 0);

    if (typeof parent == 'Object' && parent.id)
      this.parent_id = parent.id;


    this.parent = parent;

    this.size = size;

    //every frame of the parent object gets same size::

    if(parent.Size)
    {
        parent.Size(size.x, size.y, size.z);
    }

  }

  Origin(x, y, z){

    this.origin = new Gamestack.Vector(x, y, z);

    this.parent.Origin(x, y, z);
    return this;
  }

  Size(x, y, z){

    this.size = new Gamestack.Vector(x, y, z);

    this.parent.Size(x, y, z);

  }

  Rotation(x, y, z)
  {
    this.rotation = new Gamestack.Vector(x, y, z);
    this.parent.Rotation(this.rotation);
    return this;
  }

  onPosition(callback){

    callback = callback.bind(this);

    this.parent.onRun(function(){

        callback();

    });
    return this;
  }

}


class BoneState {

  constructor(boneList) {

    var states = [];

    boneList.forEach(function(bone) {

      states.push({
        offset: new Gamestack.Vector(),
        rotation: new Gamestack.Vector(),
        size: new Gamestack.Vector(),
      });

    });

  }

}
Gamestack.BoneState = BoneState;
Gamestack.Bone = Bone;
