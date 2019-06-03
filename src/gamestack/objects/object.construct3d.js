


function calc3DPointTo2DPoint(vectorOne) {

  var vector = new THREE.Vector3();

  vector.set(vectorOne.x, vectorOne.y, vectorOne.z);

  vector.project(Gamestack.threejs.camera);

  var result = new Object();
  result.x = Math.round(vector.x * (renderer.domElement.width / 2));
  result.y = Math.round(vector.y * (renderer.domElement.height / 2));

  return result;

}

Gamestack.Object2D3D = function(arg1, arg2){

    this.screenSize2D = function(){
      var renderer = Gamestack.threejs.renderer;
      return {x:renderer.domElement.width, y:renderer.domElement.height}
    };

    this.mesh = new THREE.Mesh(arg1, arg2);

    this.mesh.get2DPosition = function() {

      var renderer = Gamestack.threejs.renderer,
        camera = Gamestack.threejs.camera;

        var scene = Gamestack.threejs.scene;

      scene.updateMatrixWorld(true);
      this.position.setFromMatrixPosition(this.matrixWorld );

      var vector = calc3DPointTo2DPoint(this.position);

      return vector;

    };

    this.mesh.get2DSize = function(){

      var renderer = Gamestack.threejs.renderer,
        camera = Gamestack.threejs.camera;

        var scene = Gamestack.threejs.scene;

      var widthHalf = 0.5 * renderer.context.canvas.width;
      var heightHalf = 0.5 * renderer.context.canvas.height;

      scene.updateMatrixWorld();

      var box = new THREE.Box3().setFromObject(this);

      var vector = calc3DPointTo2DPoint(box.min);

      return vector;

    };

    this.mesh.getImageData = function(){

      var canvas = Gamestack.threejs.renderer.domElement;

              var renderer = Gamestack.threejs.renderer,
                camera = Gamestack.threejs.camera;

                var scene = Gamestack.threejs.scene;

              renderer.render(scene, camera);

      var position = this.get2DPosition(),
        size = this.get2DSize();

      var gl = canvas.getContext('webgl');

      console.log(size);

      console.log(position);

      size.x = Math.abs(size.x);

      size.y = Math.abs(size.y);

      var posX = position.x,
      posY =position.y;

      var ScreenSize = THREE.screenSize2D();

      var pixels = new Uint8Array(size.x * 2 * size.y * 2 * 4);
      gl.readPixels((ScreenSize.x / 2) - size.x, (ScreenSize.y / 2) - size.y, size.x * 2, size.y * 2, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

      return pixels;

    };



    return this.mesh;

};



class Animation3D{


  constructor(){


  }
}


Gamestack.Animation3D = Animation3D;
