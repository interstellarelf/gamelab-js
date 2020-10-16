Gamelab.assign3DGroupMesh = function(key, mesh, sprite) {
  Gamelab.ThreejsGroups = Gamelab.ThreejsGroups || [];
  Gamelab.ThreejsGroups[key] = Gamelab.ThreejsGroups[key] || new THREE.Object3D();
  Gamelab.ThreejsGroups[key].countOps = Gamelab.ThreejsGroups[key].countOps || 1.0;
  Gamelab.ThreejsGroups[key].countOps += 1.0;
  Gamelab.ThreejsGroups[key].add(mesh);
  mesh.layer = sprite.layer;
  return Gamelab.ThreejsGroups[key];
};

class Sprite3D {
  constructor(gamelabSprite, scale) {
    var sprite = gamelabSprite,
      texture = new THREE.TextureLoader().load(sprite.src);
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
    var w = sprite.image.domElement.width,
      h = sprite.image.domElement.height;

    this.w = w;
    this.h = h;

    var geometry = new THREE.PlaneGeometry(w, h, 256, Math.round(256 * (w / h)));

    this.geometry = geometry;

    this.vertices = this.geometry.vertices;

    var material = new THREE.MeshPhongMaterial({
      map: texture,
      transparent: true
    });
    //material.colorWrite = false;
    material.side = THREE.DoubleSide;

    var mesh = new THREE.Mesh(geometry, material);

    material.needsUpdate = true;

    sprite.threejsScale = scale * sprite.scale;

    this.spriteScale = scale;

    mesh.scale.set(sprite.threejsScale, sprite.threejsScale, 1);

    this.size3D = new Gamelab.Vector(w * this.threejsScale, h * this.threejsScale);

    this.size3d = this.size3D;

    // Add to pivot group
    var member = new THREE.Object3D();

    member.add(mesh);

    this.mesh = mesh;

    this.member = member;
    sprite.builderGroup = sprite.builderGroup || 'MASTER';
    this.threejsGroup = Gamelab.assign3DGroupMesh(sprite.builderGroup, this.member, sprite);
    this.threejsMesh = mesh;

    var realSize = new Gamelab.Vector(sprite.image.domElement.width, sprite.image.domElement.height, 1).mult(sprite.threejsScale);

    this.group = this.threejsGroup;

    this.threejsGroup.needsUpdate = true;

    var t3d = this;

    sprite.onLoad(function() {

      var size2D = t3d.visibleSize(camera, renderer).size;

      while (size2D.x > sprite.size.x) {
        scale -= 0.02;
        t3d.Scale(scale);
        size2D = t3d.visibleSize(camera, renderer).size;
        camera.updateMatrixWorld();
      }

      while (size2D.x < this.size.x) {
        scale += 0.02;
        t3d.Scale(scale);
        size2D = t3d.visibleSize(camera, renderer).size;
        camera.updateMatrixWorld();
      }
    });


  }
  ScreenSize(camera) {
    var mesh = this.mesh;
    var vertices = mesh.geometry.vertices;
    var vertex = new THREE.Vector3();
    var min = new THREE.Vector3(1, 1, 1);
    var max = new THREE.Vector3(-1, -1, -1);

    for (var i = 0; i < vertices.length; i++) {
      var vertexWorldCoord = vertex.copy(vertices[i]).applyMatrix4(mesh.matrixWorld);
      var vertexScreenSpace = vertexWorldCoord.project(camera);
      min.min(vertexScreenSpace);
      max.max(vertexScreenSpace);
    }

    return new THREE.Box2(min, max);
  }
  Scale(scaleValue) {
    this.threejsScale = scaleValue * this.spriteScale;
    this.mesh.scale.set(this.threejsScale, this.threejsScale, 1);
    this.size3D = new Gamelab.Vector(this.w * this.threejsScale, this.h * this.threejsScale);
    return this;
  }
  visibleSize(camera, renderer) {
    var obj = this.threejsGroup;
    var box = new THREE.Box3().setFromObject(this.mesh);
    var size = box.getSize();
    console.log(size);

    // Calc distance of obj from camera
    var distance = camera.position.distanceTo(obj.position);
    console.log('distance: ', distance);
    distance = camera.position.z - obj.position.z - (size.z / 2);

    var aspect = renderer.domElement.width / renderer.domElement.height;
    // Calc height and width
    var vFOV = THREE.Math.degToRad(camera.fov); // convert vertical fov to radians
    var height = 2 * Math.tan(vFOV / 2) * distance; // visible height
    var width = height * aspect; //camera.aspect;           // visible width

    var ratio = distance / height; // height per 1 of z-depth
    console.log('depath ratio: ', ratio);

    width = size.x / ratio * aspect;
    height = size.y / ratio * aspect;

    // Calc position
    var vector = new THREE.Vector3();
    var viewProjectionMatrix = new THREE.Matrix4();
    var viewMatrix = new THREE.Matrix4();
    viewMatrix.copy(camera.matrixWorldInverse);
    viewProjectionMatrix.multiplyMatrices(camera.projectionMatrix, viewMatrix);
    var widthHalf = 0.5 * renderer.domElement.width;
    var heightHalf = 0.5 * renderer.domElement.height;
    obj.updateMatrixWorld();
    vector.setFromMatrixPosition(obj.matrixWorld);
    //vector.project(camera);
    vector.applyMatrix4(viewProjectionMatrix);

    vector.x = (vector.x * widthHalf) + widthHalf;
    vector.y = -(vector.y * heightHalf) + heightHalf;
    /*
        vector.x = 2 * (vector.x / renderer.domElement.width) - 1;
        vector.y = 1 - 2 * ( vector.y / renderer.domElement.height );*/
    var x = vector.x;
    var y = vector.y;

    var result = {
      position: new Gamelab.Vector(x - width / 2, y - height / 2),
      size: new Gamelab.Vector(width, height)
    };
    console.info(result);
    return result;
  }

  fitCamera(camera, scene, offset) {

    offset = offset || 1.25;

    const boundingBox = new THREE.Box3();

    var object = this.mesh;

    // get bounding box of object - this will be used to setup controls and camera
    boundingBox.setFromObject(object);

    const center = boundingBox.getCenter();

    const size = boundingBox.getSize();

    // get the max side of the bounding box (fits to width OR height as needed )
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / 2 * Math.tan(fov * 2)); //Applied fifonik correction

    cameraZ *= offset; // zoom out a little so that objects don't fill the screen

    // <--- NEW CODE
    //Method 1 to get object's world position
    scene.updateMatrixWorld(); //Update world positions
    var objectWorldPosition = new THREE.Vector3();
    objectWorldPosition.setFromMatrixPosition(object.matrixWorld);

    //Method 2 to get object's world position
    //objectWorldPosition = object.getWorldPosition();

    const directionVector = camera.position.sub(objectWorldPosition); //Get vector from camera to object
    const unitDirectionVector = directionVector.normalize(); // Convert to unit vector
    camera.position = unitDirectionVector.multiplyScalar(cameraZ); //Multiply unit vector times cameraZ distance
    camera.lookAt(objectWorldPosition); //Look at object
    // --->

    const minZ = boundingBox.min.z;
    const cameraToFarEdge = (minZ < 0) ? -minZ + cameraZ : cameraZ - minZ;

    camera.far = cameraToFarEdge * 3;
    camera.updateProjectionMatrix();
  }
  get2DSize(camera, div) {
    this.size3D = new THREE.Vector3(this.size3D.x, this.size3D.y, 0);
    var size = new Gamelab.Vector(Gamelab.ThreeJsMath.getScreenXY(this.size3D, camera, div));
    return size;
  }
}

let Sprite3d = Sprite3D;

Gamelab.Sprite3D = Sprite3D;
Gamelab.Sprite3d = Sprite3d;