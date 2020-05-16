

var Trigonometry = {

  rotatePointsByOrigin:function(points, origin, rotation){
      for(var x = 0; x < points.length; x++)
      {
        points[x] = this.rotate_from_xy(origin.x,
                           origin.y,
                            points[x].x,
                            points[x].y,
                            typeof rotation == 'number' ? rotation : rotation.x);
      }

      return points;
  },

  getTrianglesByBox:function(box){
    box.origin = box.origin || new Gamelab.Vector(0, 0, 0);
    var point_a1 = box.position.copy(),
    point_a2 = box.position.add(box.size.x, 0),
    point_a3 = box.position.add(box.size.x, box.size.y),
    point_b1 = box.position.copy(),
    point_b2 = box.position.add(0, box.size.y),
    point_b3 = box.position.add(box.size.x, box.size.y);

    var plista = this.rotatePointsByOrigin([point_a1, point_a2, point_a3],
                                            box.origin.add(box.position),
                                            box.rotation.negate());

    var plistb = this.rotatePointsByOrigin([point_b1, point_b2, point_b3],
                                            box.origin.add(box.position),
                                            box.rotation.negate());

    return [
      plista,plistb
    ];
  },

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
