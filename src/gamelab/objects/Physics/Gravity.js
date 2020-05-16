
console.log('TODO:: complete Gamelab.Gravity class');

class Gravity {
  constructor(){

  }
  //pull single object or list of objects
  pull(object, accel=1.0, max=100){
    var list = object instanceof Array ? object : [object];
    list.forEach(function(item){
        if(item.speed.y < max)
        {
          item.__inAir = true;
          item.speed.y += accel;
        }
        else
        {
            item.speed.y = max;
        }

    });
  }
}

Gamelab.Gravity = Gravity;
