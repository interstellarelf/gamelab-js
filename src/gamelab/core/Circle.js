
// Converts from degrees to radians.
Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
Math.degrees = function(radians) {
  return radians * 180 / Math.PI;
};

class Circle {
constructor(radius){
this.radius = radius;
}
Radius(r)
{
  this.radius = r;
  return this;
}
getRandomCircumferencePoints(count){
  if(isNaN(count))
  return console.error('needs 1st argument of number --count');
  var points = [], radius = this.radius;
  while (count) {
      var pt_angle = Math.random() * 2 * Math.PI;
      var p = new Gamelab.Vector(Math.cos(pt_angle)*this.radius, Math.sin(pt_angle)* this.radius);
      p.r = pt_angle * 180 / Math.PI;
      points.push(p);
      count--;
  }
  return points;
}
getRandomPoints(count=1.0){
  if(isNaN(count))
  return console.error('needs 1st argument of number --count');
  var points = [], radius = this.radius;
  while (count) {
      var pt_angle = Math.random() * 2 * Math.PI;
      var pt_radius_sq = Math.random() * radius * radius;
      var x = Math.sqrt(pt_radius_sq) * Math.cos(pt_angle);
      var y = Math.sqrt(pt_radius_sq) * Math.sin(pt_angle);
      points.push(new Gamelab.Vector(x, y));
      count--;
  }
  return points;
}

getCircumferencePoint(r)
{
  var pt_angle = Math.radians(r);
  var p = new Gamelab.Vector(Math.cos(pt_angle)*this.radius, Math.sin(pt_angle)* this.radius);
  return p;
}


}


Gamelab.Circle = Circle;
