class ThreeJsWindow {
  constructor(container) {
    if (!THREE in window) {
      return console.error('Needs three.js library in window.');
    }
    var scene = this.scene = new THREE.Scene();
    var camera = this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1.0, 5000);
    var renderer = this.renderer = new THREE.WebGLRenderer();
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