class WebGLWindow {
  constructor(container) {
    if (typeof container == 'string') {
      container = document.querySelector(container);
    }

    this.container = container;
    var canvasBox = document.createElement('div');
    canvasBox.classList.add('control');

    var canvas = document.createElement('CANVAS');

    canvas.style.position = 'relative';
    canvas.style.width = '500px';
    canvas.style.height = '500px';
    canvas.width = 500;
    canvas.height = 500;
    canvas.style.marginTop = '30px';

    var scene = this.scene = new THREE.Scene();
    var camera = this.camera = new THREE.PerspectiveCamera(75, canvasBox.clientWidth / canvasBox.clientHeight, 0.1, 1000);
    var renderer = this.renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    canvasBox.appendChild(renderer.domElement);
    container.append(canvasBox);
  }
  update(scene, renderer) {
    console.dev_log('updating');
  }
  //animate(): begins the update-interval
  animate() {
    var $webgl = this;
    var update = this.update;

    function run() {
      update($webgl.scene, $webgl.renderer);
      requestAnimationFrame(run);
      renderer.render($webgl.scene, $webgl.camera);
    }
    run();
  }
  //start() :: calls animate to begin the update-interval
  start() {
    this.animate();
  }
}


Gamelab.WebGLWindow = WebGLWindow;