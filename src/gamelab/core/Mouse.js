
class Mouse {
  constructor(domElement){
    this.position = new Gamelab.Vector(0, 0);
    this.domElement = domElement.domElement || domElement;
  }
  onMouseMove(call)
  {
    let $mouse = this;
    this.domElement.addEventListener('mousemove', function(evt){
        $mouse.position = new Gamelab.Vector(evt.clientX, evt.clientY);
        call.bind($mouse)($mouse.position.x, $mouse.position.y);
    });
    return this;
  }
  onMouseUp(call)
  {
    let $mouse = this;
    this.domElement.addEventListener('mouseup', function(evt){
        call.bind($mouse)(true);
    });
    return this;
  }
  onMouseDown(call)
  {
    let $mouse = this;
    this.domElement.addEventListener('mousedown', function(evt){
        call.bind($mouse)(false);
    });
    return this;
  }
  onMouseOver(call)
  {
    let $mouse = this;
    this.domElement.addEventListener('mouseover', function(evt){
      $mouse.position = new Gamelab.Vector(evt.clientX, evt.clientY);
      call.bind($mouse)($mouse.position.x, $mouse.position.y);
    });
    return this;
  }
  onMouseOut(call)
  {
    let $mouse = this;
    this.domElement.addEventListener('mouseout', function(evt){
      $mouse.position = new Gamelab.Vector(evt.clientX, evt.clientY);
      call.bind($mouse).call($mouse.position.x, $mouse.position.y);
    });
    return this;
  }

  onLeftClick(call)
  {
    let $mouse = this;
    this.domElement.addEventListener('click', function(evt){
      evt = evt || window.event;
      if(evt.which == 1)
      (function(){
        $mouse.position = new Gamelab.Vector(evt.clientX, evt.clientY);
        call.bind($mouse)($mouse.position.x, $mouse.position.y);
      })();
    });
  }
  onRightClick(call)
  {
    let $mouse = this;
    this.domElement.addEventListener('contextmenu', function(evt){

      (function(){
        $mouse.position = new Gamelab.Vector(evt.clientX, evt.clientY);
        call.bind($mouse)($mouse.position.x, $mouse.position.y);
      })();

      evt.preventDefault();

      return false;

    });
  }
  onMouseWheel(call){

    var $mouse = this;

    window.addEventListener("wheel", event => {
        const delta = Math.sign(event.deltaY);
        call.bind($mouse)(event.deltaY);
    });

  }
  onMiddleButton(call)
  {
    var $mouse = this;
    this.domElement.addEventListener('click', function(evt){
      evt = evt || window.event;
      if(evt.which == 2)
      (function(){
        $mouse.position = new Gamelab.Vector(evt.clientX, evt.clientY);
        call.bind($mouse)($mouse.position.x, $mouse.position.y);
      })();
    });
  }
};

Gamelab.Mouse = Mouse;
