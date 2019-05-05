
/**
 * Creates an instance of TextDisplay.
 *
 * <info-bit>Gamestack.TextDisplay shows text on-screen;
 * Composed of one or more HTML/Dom objects;
 * Uses chainable function-calls.
 * See the code examples below.</info-bit>
 *
 * <iframe style='width:400px; height:450px; overflow:hidden;' src='../client/examples/js-class/TextDisplay.html'> </iframe>
 *
 *
 * @param   {Text | Object=} textDisplayArg the textDisplay instance OR data to use when creating this instance of TextDisplay

 *
 *@returns {Text} an instance of Gamestack.TextDisplay
 *
 * */



 var head = document.head || document.getElementsByTagName('head')[0];

 head.innerHTML += '<style>'+
     '\r\n' +
     '.speech-triangle { overflow:visible; }' +
     '.speech-triangle:before { content: "";' +
 'position: absolute;' +
         'z-index:-1;'+
 'width: 0;' +
 'height: 0;' +
 'left: 38px;' +
     'bottom: -18px;' +
 'border-width: 8px 8px;' +
 'border-style: solid;' +
 'border-color: #fff transparent transparent #fff;' +
     ' } .farLeft:after{ right:0px; left:20px; } .farRight:after{ left:0px; right:20px; }   .flipX:after{  -moz-transform: scaleX(-1); -webkit-transform: scaleX(-1); -o-transform: scaleX(-1); transform: scaleX(-1); -ms-filter: fliph; /*IE*/ filter: fliph; /*IE*/  } ' +
    ' </style>';




class Text extends DomHtml {

  constructor() {
    super();
    document.body.append(this.domElement);
    this.default();
  }

  Duration(d) {
    this.duration = d;
    return this;
  }

  FadeTime(fadeInTime, fadeOutTime) {
    this.fadeTime = { in: fadeInTime || 250,
      out: fadeOutTime || 250
    }
    return this;
  }

  get_float_pixels(float, dimen) {
    return Math.round(dimen * float) + 'px';
  }

  onComplete(fun) {
    this.complete = fun;
    return this;
  }

  show(text, duration) {

    //create an html element
    var __inst = this;
    if (this.show_interval) {
      clearInterval(this.show_interval);
    }

    this.show_interval = setInterval(function() {
      var o = parseFloat(__inst.domElement.style.opacity);
      if (o < 1.0) {
        o += 1.0 * (20 / __inst.fadeTime.in);
        __inst.domElement.style.opacity = o;
      }

    }, 20);

    setTimeout(function() {

      clearInterval(__inst.show_interval);

      __inst.hide_interval = setInterval(function() {
        var o = parseFloat(__inst.domElement.style.opacity);

        if (o > 0) {
          o -= 1.0 * (20 / __inst.fadeTime.out);

          __inst.domElement.style.opacity = o;
        } else {

          __inst.domElement.style.opacity = o;

          if (typeof(__inst.complete) == 'function') {
            __inst.complete();
          }

          clearInterval(__inst.hide_interval);
        }
      }, 20);
    }, __inst.duration);
    return this;
  }

  then(cb) {
    this.complete = cb || function() {};
  }

}


class GChar extends Text{
  constructor(args={}) {
    super(args);
  }
}


DomFx.Text = Text;





class TextBubble extends Text {

    constructor(args = {}) //merely an element of text
    {
        super(args);

        this.opacity = args.opacity || 0.85;

        this.text = '';

        this.FadeTime(250, 250);

        this.create_dom();

        this.duration = args.stay || args.duration || this.text.length * 100;

    }

    create_dom() {
        this.domElement = document.createElement('SPAN');

        this.domElement.setAttribute('class', 'speech-triangle')

        this.domElement.style.textAlign = "left"; //reset to left

        this.domElement.style.opacity = this.opacity;

        this.domElement.style.position = "fixed";

        this.domElement.style.color = this.color || 'white';

        if (this.backgroundColor == 'transparent') {
            this.backgroundColor = 'black';
        }

        this.domElement.style.backgroundColor = this.backgroundColor || 'black';

        this.domElement.style.borderRadius = '0.4em';

        this.domElement.style.border = this.border || '1px outset snow';

        this.domElement.style.borderColor = this.borderColor || 'snow';

        this.domElement.style.padding = "5px";

        this.domElement.style.paddingBottom = "2px";

        this.domElement.style.height = 'auto'; //auto-wrap to text

        this.domElement.style.top = Math.round(document.body.clientHeight * this.topFloat) + 'px';

        this.domElement.style.left = Math.round(document.body.clientWidth * this.leftFloat) + 'px';

        this.domElement.style.width = 'auto';

        this.domElement.style.height = 'auto';

        this.domElement.style.fontFamily = this.fontFamily;

        this.domElement.style.fontSize = this.fontSize;

        this.domElement.style.display = "block";

        this.domElement.style.textAlign = "center";

        this.domElement.style.zIndex = "9999";

        this.domElement.innerText = this.text;

        this.domElement.textContent = this.text;

        this.domElement.style.opacity = this.fadeIn ? 0 : this.opacity;

        document.body.append(this.domElement);
    }
}

DomFx.TextBubble = TextBubble;
