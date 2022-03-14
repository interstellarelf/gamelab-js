

class TitleScreen extends HTMLElement {

  constructor(){

    super();

  }

  connectedCallback() {

    alert('connected!');

    this.style.position = 'absolute';
    this.style.top = '0px';
    this.style.left = '0px';
    this.style.width = '100%';
    this.style.height = '100%';

    this.gameProcess = undefined;

    var canvas = document.createElement(
      'canvas'
    );

    canvas.classList.add('title-screen');

    this.appendChild(canvas);

    this.gameWindow = new Gamelab.GameWindow(canvas).Background('black');

    this.gameWindow.animate();

    if(this.oncreate)
    {
      this.oncreate();
    }
  }

  onCreate(oncreate) {
    this.oncreate = oncreate;
    return this;
  }


  addPositionedImage(imageUrl, pctWidth, pctTop, pctLeft) {

    this.images = this.images || [];

    var img = new Image();
    img.src = imageUrl;

    var w = this.parentElement.clientWidth,
    h = this.parentElement.clientHeight;

    img.style.width = w * pctWidth + 'px';
    img.style.height = 'auto';
    img.style.position = 'absolute';

    img.style.top = h * pctTop + 'px';
    img.style.left = w * pctLeft + 'px';

    this.parentElement.appendChild(img);

    this.images.push(img);

    return this;
  }

  addCenteredImage(imageUrl, pctWidth, pctTop) {

    this.images = this.images || [];

    var img = new Image();
    img.src = imageUrl;

    var w = this.parentElement.clientWidth,
    h = this.parentElement.clientHeight;

    img.style.width = w * pctWidth + 'px';
    img.style.height = 'auto';

    img.style.position = 'absolute';
    img.style.left = '50%';

    img.style.marginLeft = w * -pctWidth + 'px';
    img.style.top = h * pctTop + 'px';

    this.parentElement.appendChild(img);

    this.images.push(img);

    return this;

  }

  CenterTitle(text, fontFamily='monospace', fontSize='90px', pctTop='0.25') {

    var fsPx = true, fsPct = false;

    if(typeof fontSize == 'string' && fontSize.indexOf('px') >= 0)
    {
      fontSize = fontSize.replace('px', '');
    }

    if(typeof fontSize == 'string' && fontSize.indexOf('%') >= 0)
    {
      fontSize = fontSize.replace('px', '');
      fsPct = true;
      fsPx = false;
    }

    var titleSpan = document.createElement('span');

    titleSpan.style.position = 'absolute';

    titleSpan.style.display = 'block';
    titleSpan.style.textAlign = 'center';

    titleSpan.style.fontFamily = fontFamily;
    titleSpan.innerText = text;

    titleSpan.style.overflow = 'visible';

    titleSpan.style.width = '600px';

    titleSpan.style.color = 'lightgrey';

    titleSpan.style.left = '50%';

    titleSpan.style.marginLeft = '-300px';

    titleSpan.style.top = '25%';

    titleSpan.style.letterSpacing = '17px';

    titleSpan.style.fontSize = fontSize + (fsPct ? '%' : 'px');


    this.appendChild(titleSpan);

    return this;

  }

  EnterStart(text, fontFamily='monospace', fontSize='30px', paddingV='9px', paddingH='7px') {

    var fsPx = true, fsPct = false;

    if(typeof fontSize == 'string' && fontSize.indexOf('px') >= 0)
    {
      fontSize = fontSize.replace('px', '');
    }

    if(typeof fontSize == 'string' && fontSize.indexOf('%') >= 0)
    {
      fontSize = fontSize.replace('px', '');
      fsPct = true;
      fsPx = false;
    }

    if(typeof paddingV == 'string' && paddingV.indexOf('px') >= 0)
    {
      paddingV = paddingV.replace('px', '');
    }

    if(typeof paddingH == 'string' && paddingH.indexOf('px') >= 0)
    {
      paddingH = paddingH.replace('px', '');
    }

    var startElement = document.createElement('span');

    startElement.style.fontFamily = fontFamily;
    startElement.innerText = text;

    startElement.style.position = 'absolute';
    startElement.style.display = 'block';
    startElement.style.textAlign = 'center';

    startElement.style.top = '60%';
    startElement.style.fontSize = fontSize + (fsPct ? '%' : 'px');

    startElement.style.paddingLeft = paddingH + 'px';
    startElement.style.paddingRight = paddingH + 'px';

    startElement.style.paddingTop = paddingV + 'px';
    startElement.style.paddingBottom = paddingV + 'px';

    startElement.style.color = 'lightgrey';

    startElement.style.minWidth = '300px';
    startElement.style.left = '50%';

    startElement.style.marginLeft = '-150px';

    var $controller = this;

    startElement.onclick = function(){

      if($controller.onstart)
      {
        $controller.onstart();
      }

    };

    window.addEventListener('keypress', function(event){

      if (event.keyCode == 13) {
         $controller.onstart();
         //set to empty function
         $controller.onstart = function(){};
         return true;
      } else {
         return false;
      }

    });

    this.appendChild(startElement);

    return this;

  }

  GamepadStartButton(fontFamily, fontSize, text, paddingV, paddingH) {

    if(typeof fontSize == 'string' && fontSize.indexOf('px') >= 0)
    {
      fontSize = fontSize.replace('px', '');
    }

    var startElement = document.createElement('button');

    startElement.style.fontFamily = fontFamily;
    startElement.innerText = text;
    startElement.style.display = 'block';

    startElement.style.position = 'relative';
    startElement.style.fontSize = sizePx + 'px';

    this.parentElement.appendChild(startElement);

    return this;

  }

  onStart(onstart){
    this.onstart = onstart;
    return this;
  }

  onStartProcess(onstartprocess){
    this.onstartprocess = onstartprocess;
    return this;
  }

  start() {

    if(this.onstart)
    {
      this.onstart();
    }
    else if(this.onstartprocess)
    {

      if(typeof this.onstartprocess == 'string')
      {
        alert('todo: start by url');
      }

      if(typeof this.onstartprocess == 'function')
      {
        alert('todo: start by function');
      }

      if(typeof this.onstartprocess == 'object')
      {
        alert('todo: start by api-object.onstart');
      }

    }

  }

  destroy() {

  }

}


if(customElements)
{
  customElements.define('title-screen', TitleScreen);
}
else if(window.customElements) {
  window.customElements.define('title-screen', TitleScreen);
}
