(function() {

  /**
   * Creates a new Camera
   * @param {number} x=0 position-x
   * @param {number} y=0 position-y
   * @param {number} z=0 position-z
   * @returns {Camera}
   */

  class Camera {
    constructor(x, y, z) {
      if (isNaN(x)) {
        x = 0;
      }

      if (isNaN(y)) {
        y = 0;
      }

      if (isNaN(z)) {
        z = 0;
      }

         /**
          * @property {Vector} position the vector-position of Camera
          * @memberof Camera
          **********/

      this.position = new Gamelab.Vector(x, y, z);

      this.speed = new Gamelab.Vector(0, 0, 0);
    }

    update(){
        this.position.x += this.speed.x;
        this.position.y += this.speed.y;
    }

  }

  Gamelab.Camera = Camera;

})();
