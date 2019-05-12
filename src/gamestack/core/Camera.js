(function() {
  console.log('Camera class... creating');

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
          *
          * @property {Vector} position the Vector position of Camera, having numeric x, y, and z values
          * @memberof Camera
          **********/


      this.position = new Gamestack.Vector(x, y, z);
    }

  }

  Gamestack.Camera = Camera;

})();
