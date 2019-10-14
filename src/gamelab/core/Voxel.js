
class Voxel {

  constructor(x, y, w, h){
    this.size = new Gamelab.Vector(w, h);
    this.x = x;
    this.y = y;
  }

}


class VoxelArray {

  constructor(voxels, onCreate){

      onCreate = onCreate || function(){};

      var array = this;

      voxels = voxels || [];

      this.voxels = [];

      this.id = Gamelab.create_id();

      voxels.forEach(function(v){

        array.push(v);

      });

      onCreate.bind(this).call();
  }

  Clone(object){
    if(object.voxels instanceof Array)
    return new Gamelab.VoxelArray(object.voxels);
    else
    return console.error('needs array-type@ on 1st arg: .voxels');
  }

  push(item){
    this.voxels.push(item);
  }
  add(item)
  {
    this.voxels.push(item);
  }

  FromData(data)
  {
    var jsonData = JSON.parse(JSON.stringify(data));
    return new VoxelArray(jsonData.voxels);
  }
}

Gamelab.Voxel = Voxel;
Gamelab.VoxelArray = VoxelArray;
