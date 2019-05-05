

(function(){
    console.log('Camera class... creating');

    /**
     * Creates an instance of 2d-camera to be applied as the viewing-point for a GameWindow.

     * @param {number} x an optional position-x
     * @param {number} y an optional position-y
     * @param {number} z an optional position-z
     * @returns {Camera}
     *
     */


    class Camera
{
    constructor(x, y, z)
    {
        if(isNaN(x))
        {
          x = 0;
        }

        if(isNaN(y))
        {
            y = 0;
        }

        if(isNaN(z))
        {
            z = 0;
        }

      this.position = new Gamestack.Vector(x, y, z);
    }

}

Gamestack.Camera = Camera;

})();
