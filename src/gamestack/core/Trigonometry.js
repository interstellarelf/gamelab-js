

var Trigonometry = {

  rotate_from_xy:function(cx, cy, x, y, angle) {
      var radians = (Math.PI / 180) * angle,
          cos = Math.cos(radians),
          sin = Math.sin(radians),
          nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
          ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
      return new Gamestack.Vector(nx, ny);
  },

  find_point_on_circle:function(x, y, radius, degrees){

  }
};


Gamestack.Trig = Trigonometry;
Gamestack.Trigonometry = Trigonometry;
