



class Texel {
  constructor(x, y, w, h){
    this.size = new Gamelab.Vector(w, h);
    this.x = x;
    this.y = y;
  }
}


class TexelArray {

  constructor(texels, onCreate){

      onCreate = onCreate || function(){};

      var array = this;

      texels = texels || [];

      this.texels = [];

      this.id = Gamelab.create_id();

      var $object = this;

      texels.forEach(function(v){

        $object.texels.push(v);

      });

      onCreate.bind(this).call();
  }

  Clone(object){
    if(object.texels instanceof Array)
    return new Gamelab.TexelArray(object.texels);
    else
    return console.error('needs array-type@ on 1st arg: .texels');
  }

  push(item){
    this.texels.push(item);
  }
  add(item)
  {
    this.texels.push(item);
  }

  FromData(data)
  {
    var jsonData = JSON.parse(JSON.stringify(data));
    return new TexelArray(jsonData.texels);
  }
}

Gamelab.Texel = Texel;
Gamelab.TexelArray = TexelArray;
