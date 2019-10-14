

/**
 * Creates an instance of Rectangle.
 * @param   {Gamelab.Vector} min the minimum vector point (x,y)
 * @param   {Gamelab.Vector} max the maximum vector point (x,y)
 *
 * @returns {Rectangle} a Rectangle object
 */

class Rectangle {
    constructor(x1, y1, x2, y2) {
      this.Min(x1, y1);
      this.Max(x2, y2);
    }
    Min(x, y)
    {
      this.min = new Gamelab.Vector(x, y);
      return this;
    }
    Max(x, y)
    {
      this.max = new Gamelab.Vector(x, y);
      return this;
    }
}
;



let VectorBounds = Rectangle;

Gamelab.VectorBounds =VectorBounds;

Gamelab.Rectangle = Rectangle;

/**
 * Takes the min and max vectors plus termPoint ('termination-point'), returns VectorFrameBounds
 *  *use this to define the bounds of an Animation object.
 * @param   {Vector} min the minimum vector point (x,y)
 * @param   {Vector} max the maximum vector point (x,y)
 * @param   {Vector=} termPoint the optional termination vector point (x,y) : defaults to the value of 'max'
 * -While a min and max Gamelab.Vector(x,y) will describe the grid-size of Animation frames,
 * the termPoint will indicate the last frame on-grid for this set of frames --Animation may stop early on the 'grid')
 * @returns {VectorFrameBounds} a VectorFrameBounds object
 */

class VectorFrameBounds {
    constructor(min, max, termPoint) {
        this.min = min;
        this.max = max;
        this.termPoint = termPoint || new Gamelab.Vector(this.max.x, this.max.y, this.max.z);
    }
}
;

Gamelab.VectorFrameBounds = VectorFrameBounds;


var GeoMath = {

        rotatePointsXY:function(x,y,angle) {

            var theta = angle*Math.PI/180;

            var point = {};
            point.x = x * Math.cos(theta) - y * Math.sin(theta);
            point.y = x * Math.sin(theta) + y * Math.cos(theta);

            point.z = 0;

            return point
        }

}

Gamelab.GeoMath = GeoMath;
