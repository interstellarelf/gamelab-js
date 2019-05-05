(function() {
  console.log('Vector class... creating');

  /**
   * Creates a Vector object with x, y, and z properties.
   * <info-bit>Vector-2D requires only x and y args --new Vector(10, 10)
   * For Vector-3D, use x,y, and z --new Vector(10, 10, 10)
   * Pass an existing Vector as the sole argument in order to copy that Vector to a new instance</info-bit>
   * @param   {number} x the x coordinate
   * @param   {number} y the y coordinate
   * @param   {number} z the optional z coordinate
   * @param   {number} r the optional r value
   * @returns {Vector} a Vector object
   */

  class Vector {
    constructor(x, y, z, r) {

      var copied = false;

      if (typeof(x) == 'object' && x.hasOwnProperty('x') && x.hasOwnProperty('y')) //optionally pass vector3
      {
        this.x = x.x;
        this.y = x.y;
        this.z = x.z || 0;

        if (this.z == null) {
          this.z = 0;
        }

        this.valid_check();

        copied = true;
      }

      if (z == null) {
        z = 0;
      }

      if (!copied) {

        this.x = x;
        this.y = y;
        this.z = z;
        this.r = r;

        this.valid_check();

      }
    }

    valid_check() {
      if (this.x == undefined) {
        this.x = 0;
      }
      if (this.y == undefined) {
        this.y = 0;
      }
      if (this.z == undefined) {
        this.z = 0;
      }
    }

    /**
     * Subtracts another Vector from this vector and returns a vector for the resulting difference.
     *
     * @function
     * @param {Vector} v the vector to be subtracted from this vector
     * @memberof Vector
     **********/

    sub(v) {
      if (typeof(v) == 'number') {
        v = {
          x: v,
          y: v,
          z: v
        };
      };

      return new Gamestack.Vector(this.x - v.x, this.y - v.y, this.z - v.z);

    }

    /**
     * Adds another Vector to this vector and returns a vector for the resulting sum.
     *
     * @function
     * @param {Vector} v the vector to be added to this vector
     * @memberof Vector
     **********/

    add(v) {
      if (typeof(v) == 'number') {
        v = {
          x: v,
          y: v,
          z: v
        };
      };

      return new Gamestack.Vector(this.x + v.x, this.y + v.y, this.z + v.z);

    }

    /**
     * Multiplies another Vector by this vector and returns a vector for the resulting product.
     *
     * @function
     * @param {Vector} v the vector that this vector will by muliplied by
     * @memberof Vector
     **********/

    mult(v) {
      if (typeof(v) == 'number') {
        v = {
          x: v,
          y: v,
          z: v
        };
      };

      return new Gamestack.Vector(this.x * v.x, this.y * v.y, this.z * v.z);

    }

    /**
     * Gets vector of absolute values.
     *
     * @function
     * @param {Vector} v the absolute vector
     * @memberof Vector
     **********/

    abs() {

      return new Gamestack.Vector(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z));

    }

    /**
     * Divides another Vector by this vector and returns a vector for the resulting quotient.
     *
     * @function
     * @param {Vector} v the vector for this vector to be divided by
     * @memberof Vector
     **********/

    div(v) {
      if (typeof(v) == 'number') {
        v = {
          x: v,
          y: v,
          z: v
        };
      };

      return new Gamestack.Vector(this.x / v.x, this.y / v.y, this.z / v.z);
    }

    /**
     * Rounds this vector to the nearest set of whole numbers and returns the result.
     *
     * @function
     * @memberof Vector
     * @returns {Vector} a Gamestack.Vector object
     **********/

    round() {
      return new Gamestack.Vector(Math.round(this.x), Math.round(this.y), Math.round(this.z));

    }

    /**
     * Floors this vector to the nearest set of whole numbers and returns the result (subtractive-only, an x of 1.7 becomes 1)
     *
     * @function
     * @memberof Vector
     * @returns {Vector} a Gamestack.Vector object
     **********/

    floor() {
      return new Gamestack.Vector(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z));

    }

    /**
     * Ceils this vector to the nearest set of whole numbers  and returns the result (additive-only, an x of 1.2 becomes 2)
     *
     * @function
     * @memberof Vector
     * @returns {Vector} a Gamestack.Vector object
     **********/

    ceil() {
      return new Gamestack.Vector(Math.ceil(this.x), Math.ceil(this.y), Math.ceil(this.z));

    }

    /**
     * Creates new vector, with the negated x,y,z values (-x-y-z), returns the resulting vector
     *
     * @function
     * @memberof Vector
     * @returns {Vector} a Gamestack.Vector object
     **********/

    neg() {
      return new Gamestack.Vector(-this.x, -this.y, -this.z);
    }

    /**
     * An equals-test for vectors. Returns true OR false.
     *
     * @function
     * @memberof Vector
     * @returns {boolean} a true OR false value
     **********/

    equals(v) {

      return this.x == v.x && this.y == v.y && this.z == v.z;
    }

    /**
     * Gets  the specific distance between this and the argument-vector. --applies to x and y of two vectors. Returns a single number.
     *
     * @function
     * @memberof Vector
     * @returns {number} the specific distance between this and the argument-vector
     **********/

    trig_distance_xy(v) {

      var dist = this.sub(v);

      return Math.sqrt(dist.x * dist.x + dist.y * dist.y);

    }


    is_between(v1, v2) {
      //TODO : overlap vectors return boolean

      return this.x >= v1.x && this.x <= v2.x &&
        this.y >= v1.y && this.y <= v2.y &&
        this.z >= v1.z && this.z <= v2.z;


    }

    /**
     * Returns a vector-multiple: the original-size, multiplied by a random between the minFloat and maxFloat arguments.
     *
     * @function
     * @memberof Vector
     * @returns {Vector} the resulting vector.
     **********/

    randomize(minFloat, maxFloat) {

      var random = (Math.random() * (maxFloat - minFloat) + minFloat) * 1000 / 1000;

      return this.mult(random);

    }

    /**
     * Returns a speed vector, based on rotation.
     *
     * @function
     * @param {number} rotation in degrees, 0-360
     * @param {number} speed the level of speed to apply, default being 1
     * @returns {Vector}
     * @memberof Vector
     **********/

    rotationalSpeedPoint(rotation, speed) {
      var r = rotation;

      if (isNaN(speed)) {
        speed = 1;
      }

      if (typeof(rotation) == 'object' && rotation.x) {
        r = rotation.x;
      }

      return new Gamestack.Vector(Math.cos((r) * 3.14 / 180) * speed, Math.sin((r) * 3.14 / 180) * speed);

    }

    /**
     * Returns the right-handed angle of degrees between two two position-vectors.

     * @memberof Vector
     * @function
     * @param {Vector} p1 the 1st vector-argument
     * @param {Vector} p2 the 2nd vector-argument
     * @returns {number} the resulting angle in degrees.
     **********/

    angleBetween(p1, p2) {

      return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
    }

    //apply minimum value to all values
    min2d() {

      function minimize(object, key1, key2) {
        if (object[key1] < object[key2])
          object[key2] = object[key1];

        if (object[key2] < object[key1])
          object[key1] = object[key2];
      };

      minimize(this, 'x', 'y');

      return this;
    }


    //apply maximum value to all values
    max2d() {

      function maximize(object, key1, key2) {
        if (object[key1] > object[key2])
          object[key2] = object[key1];

        if (object[key2] > object[key1])
          object[key1] = object[key2];
      };

      maximize(this, 'x', 'y');

      return this;
    }

  };

  let Vector3 = Vector,
    Pos = Vector,
    Size = Vector,
    Position = Vector,
    Vector2 = Vector,
    Rotation = Vector;

  Gamestack.Vector = Vector;

  //synonymous w/ Vector::
  Gamestack.Vector2d = Vector;
  Gamestack.Vector2D = Vector;
  Gamestack.Rotation = Vector;
  Gamestack.Pos = Vector;
  Gamestack.Position = Vector;
  Gamestack.Size = Vector;

  //The above are a list of synonymous expressions for Vector. All of these do the same thing in this library (store and manipulate x,y,z values)

  var VectorMath = {

    rotatePointsXY(x, y, angle) {

      var theta = angle * Math.PI / 180;

      var point = {};
      point.x = x * Math.cos(theta) - y * Math.sin(theta);
      point.y = x * Math.sin(theta) + y * Math.cos(theta);

      point.z = 0;

      return point
    }

  }

  Gamestack.VectorMath = VectorMath;

})();
