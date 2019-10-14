

var Trigonometry = {

  rotate_from_xy:function(cx, cy, x, y, angle) {
      var radians = (Math.PI / 180) * angle,
          cos = Math.cos(radians),
          sin = Math.sin(radians),
          nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
          ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
      return new Gamelab.Vector(nx, ny);
  },

  rotational_speed:function(angle, speed){
    // Move towards the player
    var radians = (angle / 360) * Math.PI * 2.0;
    return new Gamelab.Vector(Math.cos(radians) * speed, Math.sin(radians) * speed);
  },

  find_point_on_circle:function(x, y, radius, degrees){

  }
};


Gamelab.Trig = Trigonometry;
Gamelab.Trigonometry = Trigonometry;
