var ThreeJsMath = {
  getScreenXY: function(position, camera, div) {
    var pos = position.clone();
    var projScreenMat = new THREE.Matrix4();
    projScreenMat.multiply(camera.projectionMatrix, camera.matrixWorldInverse);
    projScreenMat.multiplyVector3(pos);
    var offset = this.findOffset(div);
    return {
      x: (pos.x + 1) * div.width / 2 + offset.left,
      y: (-pos.y + 1) * div.height / 2 + offset.top
    };
    return offset;
  },
  findOffset: function(element) {
    var pos = new Object();
    pos.left = pos.top = 0;
    if (element.offsetParent) {
      do {
        pos.left += element.offsetLeft;
        pos.top += element.offsetTop;
      } while (element = element.offsetParent);
    }
    return pos;
  }
};

Gamelab.ThreeJsMath = ThreeJsMath;

class ThreeJsWindow {
  constructor(container, threejs) {

    var THREE = window.THREE || threejs;

    if (!THREE)
      return console.error('Needs three.js library in window.');

    var scene = this.scene = new THREE.Scene();
    var camera = this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1.0, 5000);
    var renderer = this.renderer = new THREE.WebGLRenderer({
      alpha: true
    });
    var defaultLight = this.defaultLight = new THREE.AmbientLight(0xffffff); // soft white light
    scene.add(defaultLight);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.background = new THREE.Color(0xffffff);
    if (typeof container == 'string') {
      container = document.querySelector(container);
    }
    if (container instanceof HTMLCollection) {
      container = container[0];
    }
    if (!(container instanceof HTMLElement)) {
      container = document.body;
    }
    container.appendChild(renderer.domElement);
  }
  add(object) {
    this.scene.add(object);
  }
  animate() {
    let $window = this;
    requestAnimationFrame(function() {
      $window.animate();
    });
    this.renderer.render(this.scene, this.camera);
  }
  start() {
    this.animate();
  }
}

Gamelab.ThreeJsWindow = ThreeJsWindow;
let ThreeJSWindow = ThreeJsWindow;
Gamelab.ThreeJSWindow = ThreeJSWindow;
let ThreejsWindow = ThreeJsWindow;
Gamelab.ThreejsWindow = ThreejsWindow;