/**************************
 *
 **************************/
var DomFx = {
  Tag(tagName) {
    return document.createElement(tagName);
  },

  create_id: function() {
    var S4 = function() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
  },
};
;class DomHtml {

  constructor(tagName) {

    this.domElement = document.createElement(tagName || 'SPAN');

    if (Object.getPrototypeOf(this) === DomHtml.prototype) {
      this.default();
    }

  }
  dom() {
    return this.domElement;
  }
  style() {
    return this.dom().style;
  }
  default () {

    this.widthFloat = 0.5;
    this.heightFloat = 0.5;

    this.topFloat = 0.5;
    this.bottomFloat = false;

    this.domElement.style.position = 'absolute';
    this.domElement.style.color = 'white';
    this.domElement.style.opacity = 0;

    if (this.bottomFloat == false) {
      this.targetTop = this.get_float_pixels(this.topFloat, document.body.clientHeight);
    } else {
      this.targetBottom = this.get_float_pixels(this.bottomFloat, document.body.clientHeight);
    }

    this.FadeTime(250, 250);

    this.Text('--DOMHtml--')
    document.body.append(this.domElement);
  }

  Position(v) {

    switch (v.toLowerCase()) {

      case 'r':
      case 'rel':
      case 'relative':

        this.style().position = 'relative';

        break;

      case 'a':
      case 'abs':
      case 'absolute':

        this.style().position = 'absolute';

        break;

      case 'f':
      case 'fix':
      case 'fixed':

        this.style().position = 'fixed';

        break;

      case 'stick':
      case 'sticky':

        this.style().position = 'sticky';

        break;

      case 's':
      case 'static':

        this.style().position = 'relative';

        break;

      default:

        this.style().position = 'inherit';
    }
  }

  Opacity(o) {
    this.domElement.style.opacity = o;
    return this;
  }

  ScalePos(x = 0, y = 0) {
    this.ScaleTop(y);
    this.ScaleLeft(x);
  }

  ScaleTop(t) {
    this.targetTop = this.get_float_pixels(t, document.body.clientHeight);
    this.domElement.style.bottom = 'auto';
    this.domElement.style.top = this.targetTop;
    return this;
  }

  ScaleLeft(l) {
    this.targetLeft = this.get_float_pixels(l, document.body.clientWidth);
    this.domElement.style.right = 'auto';
    this.domElement.style.left = this.targetLeft;
    return this;
  }


    ScaleBottom(v) {
      this.targetBottom = this.get_float_pixels(v, document.body.clientHeight);
      this.domElement.style.top = 'auto';
      this.domElement.style.bottom = this.targetBottom;
      return this;
    }

    ScaleRight(v) {
      this.targetRight = this.get_float_pixels(v, document.body.clientWidth);
      this.domElement.style.left = 'auto';
      this.domElement.style.right = this.targetRight;
      return this;
    }




    Top(v) {
      v = parseFloat(v) + 'px';
      this.domElement.style.top = v;
      return this;
    }

    Left(v) {
      v = parseFloat(v) + 'px';
      this.domElement.style.left = v;
      return this;
    }


    Bottom(v) {
      v = parseFloat(v) + 'px';
      this.domElement.style.bottom = v;
        return this;
      }

    Right(v) {
      v = parseFloat(v) + 'px';
      this.domElement.style.right = v;
        return this;
      }




  ScaleX(x) {
    this.targetLeft = this.get_float_pixels(x, document.body.clientWidth);
    this.domElement.style.right = 'auto';
    this.domElement.style.left = this.targetLeft;
    return this;
  }
  ScaleY(y) {
    this.targetTop = this.get_float_pixels(y, document.body.clientHeight);
    this.domElement.style.bottom = 'auto';
    this.domElement.style.top = this.targetTop;
    return this;
  }

  Offset(x, y) {
    var px = parseFloat(this.domElement.style.left),
      py = parseFloat(this.domElement.style.top);
    this.Pos(px + x, py + y);
    return this;
  }

  CenterPos() {
    this.ScaleX(0.5);
    this.Offset(this.domElement.offsetWidth / 2 * -1, 0);

    this.ScaleY(0.5);
    this.Offset(0, this.domElement.offsetHeight / 2 * -1);

    return this;
  }

  X(x) {
    this.targetLeft = Math.round(x) + 'px';
    this.domElement.style.right = 'auto';
    this.domElement.style.left = this.targetLeft;
    return this;
  }

  Y(y) {
    this.targetTop = Math.round(y) + 'px';
    this.domElement.style.bottom = 'auto';
    this.domElement.style.top = this.targetTop;
    return this;
  }

  ScalePos(x, y) {
    this.ScaleX(x);
    this.ScaleY(y);
    return this;
  }

  Pos(x, y) {
    this.X(x);
    this.Y(y);
    return this;
  }

  Size(x, y) {
    this.style().width = x + 'px';
    this.style().height = y + 'px';
    return this;
  }

  ScaleSize(s) {
    var pct = this.height / this.width;
    this.width = this.get_float_pixels(s, document.body.clientWidth);
    this.height = Math.round(this.width * pct);
    return this;
  }

  FontSize(v) {
    v = v + '';
    if (v.indexOf('px') == -1 && v.indexOf('em') == -1 && v.indexOf('%') == -1) {
      //assume px:
      v += 'px';
    }
    this.domElement.style.fontSize = v;
    return this;
  }

  FontFamily(v) {
    v = v + '';
    this.domElement.style.fontFamily = v;
    return this;
  }

  Text(v) {
    v = v + '';
    this.domElement.innerText = v;
    return this;
  }

  Background(v) {
    this.domElement.style.background = v;
    return this;
  }

  Padding(p) {

    p = parseFloat(p) + 'px';

    this.domElement.style.padding = p;

    return this;

  }

  Color(c) {
    this.domElement.style.color = c;
    return this;
  }

  TextColor(c) {
    this.domElement.style.color = c;
    return this;
  }

  Border(b) {
    this.domElement.style.border = b;
    return this;
  }

  BorderTop(b) {
    this.domElement.borderTop = b;
    return this;
  }
  BorderLeft(b) {
    this.domElement.borderLeft = b;
    return this;
  }
  BorderBottom(b) {
    this.domElement.borderBottom = b;
    return this;
  }
  BorderRight(b) {
    this.domElement.borderRight = b;
    return this;
  }

  BorderRadius(v) {
    this.style().borderRadius = v;
    return this;
  }

  TextAlign(v) {
    this.style().textAlign = v;
    return this;
  }

  VerticalAlign(v) {

    this.style().VerticalAlign = v;
    return this;
  }

  LineHeight(v) {

    this.style().LineHeight = v;
    return this;
  }

  Cursor(v) {
    this.domElement.style.cursor = v;
    return this;
  }

  //Math helpers / CSS ::

  get_float_pixels(portion, total) {
    return Math.round(portion * total) + 'px';
  }

}
;

class MagicDom extends DomHtml //to do apply a super object 'Extra'
{
  constructor(tagName) {
    super(tagName || 'SPAN');
    this.styleTargets = {};
    this.callerKey = undefined; //track the last called function
  }
    Css(key, value) {
      for (var x in this.style()) {
        if (x.toLowerCase() == key.toLowerCase())
          this.style()[key] = value;
      }
      return this;
    }
      StyleTarget(key, value) {
        this.styleTargets[key] = value;
        return this;
      }
  TransitionCurve(easingArg_One, easingArg_Two) {
    this.transitionCurve = typeof easingArg_One == 'function' ? easingArg_One :
      EasingCurves.get(easingArg_One, easingArg_Two);
    return this;
  }

  then(f) {
    this[this.callerKey + '_' + 'complete'] = f;
    return this;
  }

  onComplete(fun) {
    this.complete = fun;
    return this;
  }



      ScaleTop(t) {
        this.targetTop = this.get_float_pixels(t, document.body.clientHeight);
        this.domElement.style.bottom = 'auto';
        this.domElement.style.top = this.targetTop;
        return this;
      }

      ScaleLeft(l) {
        this.targetLeft = this.get_float_pixels(l, document.body.clientWidth);
        this.domElement.style.right = 'auto';
        this.domElement.style.left = this.targetLeft;
        return this;
      }


    ScaleBottom(v) {
      this.targetBottom = this.get_float_pixels(v, document.body.clientHeight);
      this.domElement.style.top = 'auto';
      this.domElement.style.bottom = this.targetBottom;
      return this;
    }

    ScaleRight(v) {
      this.targetRight = this.get_float_pixels(v, document.body.clientWidth);
      this.domElement.style.left = 'auto';
      this.domElement.style.right = this.targetRight;
      return this;
    }


}
;

class Bar extends DomHtml {
  constructor(background, border) {
    super();

    this.background = background;
    var e = document.createElement("SPAN");
    e.style.position = 'fixed';
    e.style.background = this.background;
    e.style.zIndex = "9999";
    e.style.backgroundSize = "100% 100%";
    e.style.backgroundPosition = "center bottom";

    if (border) {
      e.style.border = border;
    }

    this.domElement = e;
  }

  width(w) {
    this.domElement.style.width = w;

    return this;
  }

  height(h) {
    this.domElement.style.height = h;

    return this;
  }
}



class BarFill extends DomHtml {
  constructor(background) {

    super();

    this.background = background;
    var e = document.createElement("SPAN");

    e.style.background = this.background;

    e.style.position = 'fixed';

    e.style.zIndex = "9995";

    this.domElement = e;

  }

  width(w) {
    this.domElement.style.width = w;

    return this;
  }

  height(h) {
    this.domElement.style.height = h;

    return this;
  }

}



/**
 * Creates an instance of BarDisplay.
 * <info-bit>Gamestack.BarDisplay is an instantiable a health-bar;
 * Composed of one or more HTML/Dom objects;
 * Uses chainable function-calls.
 * See the code examples below.</info-bit>
 *
 * <iframe style='width:400px; height:450px; overflow:hidden;' src='../client/examples/js-class/BarDisplay.html'> </iframe>
 *
 *
 * @param   {BarDisplay= | Object=} barDisplayArgs the BarDisplay instance OR data to use when creating this instance of BarDisplay

 *
 *@returns {BarDisplay} an instance of Gamestack.BarDisplay
 *
 * */


class BarDisplay extends DomHtml { //show BarDisplay as in 'health-bar'

  constructor(barDisplayArgs = {}) {
    var args = barDisplayArgs || {};
    super('DIV');

    this.border = args.border || "none";
    this.inner = args.src || args.inner || 'darkorange';
    this.outer = args.outer_src || args.outer || 'transparent';
    this.width = args.width + '' || args.fill_width + '';

    if (this.width.indexOf('px') == -1) {
      this.width += 'px';
    }

    this.height = args.height + '' || args.fill_height + '';
    if (this.height.indexOf('px') == -1) {
      this.height += 'px';
    }

    this.color = args.color || args.fill_color;
    Gamestack.defSize();
    this.CreateDom();

  }

  Top(v) {
    this.targetTop = this.get_float_pixels(v, document.body.clientHeight);

    for (var x in [this.innerDom, this.outerDom]) {
      [this.innerDom, this.outerDom][x].Top(v);
    }
    return this;

  }

  Left(v) {
    this.targetLeft = this.get_float_pixels(v, document.body.clientWidth);

    for (var x in [this.innerDom, this.outerDom]) {
      [this.innerDom, this.outerDom][x].Left(v);
    }

    return this;
  }

  Bottom(v) {
    this.targetBottom = this.get_float_pixels(v, document.body.clientHeight);

    for (var x in [this.innerDom, this.outerDom]) {
      [this.innerDom, this.outerDom][x].Bottom(v);
    }

    return this;
  }

  Right(v) {
    this.targetRight = this.get_float_pixels(v, document.body.clientWidth);

    for (var x in [this.innerDom, this.outerDom]) {
      [this.innerDom, this.outerDom][x].Right(v);
    }
    return this;
  }


  CreateDom() {
    this.innerDom = new BarFill(this.inner).width(this.width || "80px").height(this.height || "10px");
    this.fill = this.innerDom;
    this.outerDom = new Bar(this.outer, this.border).width(this.width || "80px").height(this.height || "10px");
    this.bar = this.outerDom;
  }

  Inner(color_or_src) {
    this.inner = color_or_src;
    this.CreateDom();
    return this;
  }

  Outer(color_or_src) {
    this.outer = color_or_src;
    this.CreateDom();
    return this;
  }

  Border(css_border) {
    this.border = css_border;
    this.CreateDom();
    return this;
  }

  show() {
    document.body.append(this.innerDom.domElement);
    document.body.append(this.outerDom.domElement);
    return this;
  }

  Show() { //same as lc show()
    document.body.append(this.innerDom.domElement);
    document.body.append(this.outerDom.domElement);
    return this;
  }

  Width(w) {
    this.portion_width(w);
    return this;
  }

  Height(h) {
    this.portion_height(h);
    return this;
  }

  get_float_pixels(float, dimen) {
    return Math.round(dimen * float) + 'px';
  }

  portion_top(v) {
    this.fill.domElement.style.top = this.get_float_pixels(v || this.topFloat, Gamestack.HEIGHT);
    this.bar.domElement.style.top = this.get_float_pixels(v || this.topFloat, Gamestack.HEIGHT);
  }

  portion_left(v) {
    this.fill.domElement.style.left = this.get_float_pixels(v || this.leftFloat, Gamestack.WIDTH);
    this.bar.domElement.style.left = this.get_float_pixels(v || this.leftFloat, Gamestack.WIDTH);
  }

  portion_width(w) {
    this.fill.domElement.style.width = this.get_float_pixels(w || this.widthFloat, Gamestack.WIDTH);
    this.bar.domElement.style.width = this.get_float_pixels(w || this.widthFloat, Gamestack.WIDTH);
  }

  portion_height(h) {
    this.fill.domElement.style.height = this.get_float_pixels(h || this.heightFloat, Gamestack.HEIGHT);
    this.bar.domElement.style.height = this.get_float_pixels(h || this.heightFloat, Gamestack.HEIGHT);
  }

  update(f) {
    this.fill.domElement.style.width = this.get_float_pixels(f || 0, parseFloat(this.bar.domElement.style.width));
  }
}


DomFx.BarDisplay = BarDisplay;
;

/***************************
*   Incomplete Elements (html)
*
* Wanted Elements : Caption, various ImageSelects, etc...
****************************/


class Caption extends  MagicDom {

  constructor(src, scale){
    super(src);
    this.ScaleSize(scale || 1.0);
  }

}


class CaptionRow extends MagicDom {

  constructor(src, scale){
    super(src);
    this.ScaleSize(scale || 1.0);
  }

  Borders(top, bottom, selector)
  {

  }

  WidthPortion(scaleX)
  {

  }

}
;

class MagicElipse extends MagicDom
{
  constructor(args={}) {
    super(args);
    this.BorderRadius('50%');
  }

};
;class MagicDomFadeable extends MagicDom //to do apply a super object 'Extra'
{
  constructor(tagName) {
    super(tagName || 'SPAN');
    this.domElement = document.createElement(tagName);
    this.default();
    this.TransitionCurve('linear', 'none');
    this.callerKey = undefined; //track the last called function


    this.fadeTime = {in:2500, out:2500, remain:0};
    this.fadeValues = { in:[], out:[] };
  }

  TransitionCurve(easingArg_One, easingArg_Two) {
    this.transitionCurve = typeof easingArg_One == 'function' ? easingArg_One :
      EasingCurves.get(easingArg_One, easingArg_Two);
    return this;
  }

  FadeTiming(_in, _out, _remain) {
    this.fadeTime = { in: _in || 2500,
      out: _out || _in || 2500,
      remain: _remain || 0
    }

    this.ComputeFade();

    return this;
  }

  DelayFade(timing, in_out_phase) {
    console.dev('FadeDelay() in_out_phase = "in" || "out"');

    this.fadeDelays = { in: in_out_phase == 'in' ? timing : 0,
      out: in_out_phase == 'out' ? timing : 0
    }
    return this;
  }

  ComputeFade() {

    //create an html element
    var $magicDom = this;

    let computeValue = function(step_Index, stepLimit) {
      var floatPortionTotal =
        $magicDom.transitionCurve(step_Index / stepLimit);
      //x / totalSteps be the float-time-portion 0-1.0 of the transition in linear time

      return floatPortionTotal * 1.0;
      //1.0 --opacity 1.0 be the total
    };

    ['in', 'out'].forEach(function(key) {

      var totalSteps = Math.ceil($magicDom.fadeTime[key] / 10); //total # of steps

      var values = [];

      for (var x = 0; x < totalSteps; x+= 1) {
        values.push(computeValue(x, totalSteps));

        if(key == 'out')
        {
          var v = values[values.length - 1];
          values[values.length - 1] = 1.0 - v;
        }
      }

      console.log(values.length);

      $magicDom.fadeValues[key] = values.reverse(); //fadeValues[in || out] is set to the result--array
    });

    return this;
  }

  seesaw(){

    var $magicDom = this;

    $magicDom.show().then(function() {

      $magicDom.hide().then(function() {

        $magicDom.seesaw();

      })
    })
  }

  show(duration, callback) {

    var $magicDom = this;

    this.callerKey = 'show';

    this['show_complete'] = function(){};

    callback = callback || function() {};

    var copy_values_in = $magicDom.fadeValues.in.slice();

    function go() {
      if (copy_values_in.length > 1) {
        $magicDom.Css('opacity', copy_values_in.pop());
        setTimeout(function() {
          go();
        }, 10);
      } else {
        callback();
        if ($magicDom[$magicDom.callerKey + '_' + 'complete'])
          $magicDom[$magicDom.callerKey + '_' + 'complete']();
      }
    }

    go();
    return this;
  }

  hide(duration, callback) {
    var $magicDom = this;
    this.callerKey = 'hide';

    callback = callback || function() {};

      this['hide_complete'] = function(){};

    var copy_values_out = $magicDom.fadeValues.out.slice();

    function go() {
      if (copy_values_out.length > 1) {
        $magicDom.Css('opacity', copy_values_out.pop());
        setTimeout(function() {
          go();
        }, 10);
      } else {
        callback();
        if ($magicDom[$magicDom.callerKey + '_' + 'complete'])
          $magicDom[$magicDom.callerKey + '_' + 'complete']();
      }
    }

    delay(go, this.fadeTime.remain);

    return this;
  }

  then(f) {
    this[this.callerKey + '_' + 'complete'] = f;
    return this;
  }
}
;
/**
 * Creates an instance of ...

 * */

class Numeric extends DomHtml {

  constructor() {
    super();
    this.domElement = document.createElement('SPAN');
    document.body.appendChild(this.domElement);
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

  Visible(){

    this.style.opacity = 1.0;
    return this;

  }

  get_float_pixels(float, dimen) {
    return Math.round(dimen * float) + 'px';
  }

  onComplete(fun) {
    this.complete = fun;
    return this;
  }

  Number(n){

    this.domElement.innerText = n;
    return this;
  }

  Countdown(mode){

    var dom = this;

    if(mode == 'seconds')
    window.setInterval(function(){

        var number = parseFloat(dom.domElement.innerText);

        number -= 1;

        dom.domElement.innerText = number;

    }, 1000);

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
;

class Table extends MagicDom {
  constructor(args={}) {
    super(args);

      this.domElement = document.createElement('table');

      this.cols = [];
  }

  Heading(v){
    var th = dfx.Tag('TH');

  }

  addRow(){
    var tr = dfx.Tag('TR');

  }

  addData(row_index, column_index) {
        var tr = dfx.Tag('TD');

  }
};
;
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
;/**
 * Creates an instance of ImStat:

 * <info-bit>Gamestack.ImStat displays item-counts or stats on the screen.
 * Composed of one or more HTML/Dom objects;
 * Uses chainable function-calls.
 * See the code examples below.</info-bit>
 *
 * <iframe style='width:400px; height:450px; overflow:hidden;' src='../client/examples/js-class/ImStat.html'> </iframe>
 *
 *
 * @param   {ImageStat= | Object=} ImStatArgs the ImStat instance OR data to use when creating this instance of ImStat

 *
 *@returns {ImageStat} an instance of Gamestack.ImStat
 *
 * */


class ImageStat extends DomHtml {

  constructor(args = {}) {

    super();

    this.src = args.src || "__NONE";

    this.size = args.size || new Gamestack.Vector(50, 50);

    this.text_id = DomFx.create_id();

    this.id = DomFx.create_id();

    this.img_id = DomFx.create_id();

    this.create_dom();

  }

  Src(src) {
    this.src = src;
    this.img.setAttribute('src', src);


    return this;

  }

  Source(src) //same as Src
  {
    this.src = src;
    this.img.setAttribute('src', src);
    return this;
  }

  Text(t) {
    this.span.innerHTML = t;
    this.span.textContent = t;
    return this;
  }

  MarginTop(v)
  {
    v = v + '';
    v = v.replace('px', '')
    this.domElement.style.marginTop = v + 'px';
    return this;
  }

  TextMarginTop(v) {
    v = v + '';
    if (v.indexOf('px') == -1 && v.indexOf('em') == -1 && v.indexOf('%') == -1) {
      //assume px:
      v += 'px';
    }

    var el = this.span;

    el.style.marginTop = v;

    return this;

  }


  Size(x, y) {
    this.size = new Gamestack.Vector(x, y || x);
    this.img.style.width = this.size.x + 'px';
    this.img.style.height = 'auto';

    return this;
  }


  FontSize(v) {

    v = v + "";

    if (v.indexOf('px') == -1 && v.indexOf('em') == -1 && v.indexOf('%') == -1) {
      //assume px:
      v += 'px';

    }

    this.pixelFontSize = v;

    this.domElement.style.fontSize = v;

    return this;
  }

  FontFamily(v) {
    this.domElement.style.fontFamily = v;
    return this;
  }

  setValue(value) {
    document.getElementById(this.text_id);
    return this;
  }


  get_id() {
    return this.id;
  }

  update(v) {
    var e = document.getElementById(this.text_id);
    this.text = v + "";
    e.innerText = this.text;
    return this;
  }

  create_dom() {
    //create an html element
    this.domElement = document.createElement('DIV');

    this.domElement.style.position = 'fixed';

    this.domElement.setAttribute('class', 'gameStack-stats');

    this.img = document.createElement('IMG');

    this.img.id = this.img_id;

    this.img.src = this.src;

    this.img.style.width = this.size.x + 'px';

    this.img.style.height = 'auto';

    document.body.append(this.domElement);

    this.domElement.append(this.img);

    this.span = document.createElement('SPAN');

    this.span.id = this.text_id;

    this.span.style.padding = '2px';

    this.span.style.float = "right";

    this.span.style.height = this.size.y + 'px';

    this.span.style.display = 'table-cell';

    this.span.style.verticalAlign = 'middle';

    this.span.style.fontSize = 'inherit';

    this.span.textContent = this.text;

    this.span.style.color = 'snow';

    this.domElement.append(this.span);

    this.domElement.style.color = this.color;

    //this.domElement.style.padding = "10px";

    this.domElement.style.fontFamily = this.fontFamily;

    this.domElement.style.fontSize = this.fontSize;

    this.domElement.style.zIndex = "9999";

    this.domElement.id = this.id;

    return this;
  }

}

DomFx.ImageStat = ImageStat;

DomFx.ImgStat = ImageStat;
;var EasingCurves = { //ALL HAVE INPUT AND OUTPUT OF: 0-1.0

  match: function(string_one, string_two) {
    if (string_one == 'match')
      return console.error('cannot refer to match function within match function.')

    if (!string_two && typeof this[string_one] == 'function')
      return this[string_one];

    let fc_upper = function(string) {
      var s = string.toLowerCase();
      return s.charAt(0).toUpperCase() + s.slice(1);
    };

    let lc_match = function(s1, s2) {
      return s1.toLowerCase() == s2.toLowerCase();
    };

    let uc_two = fc_upper(string_two);

    for (var x in this) {

      if (typeof this[x] == 'object') {
        if (lc_match(x, string_one) && string_two && typeof this[x][uc_two] == 'function')
          return this[x][uc_two];
      }
    }
    return false;

  },

  get: function(string_one, string_two) {

    var $CURVES = this;

    return this.match(string_one, string_two);
  },

  // no easing, no acceleration
  Linear: {
    None: function(t) {
      return t;
    }
  },

  Quadratic: {
    In: function(t) {
      return t * t;
    },
    Out: function(t) {
      return t * (2 - t);
    },
    InOut: function(t) {
      return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
  },

  Cubic: {
    In: function(t) {
      return t * t * t;
    },
    Out: function(t) {
      return (--t) * t * t + 1;
    },
    InOut: function(t) {
      return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }
  },

  Quartic: {
    In: function(t) {
      return t * t * t * t;
    },
    Out: function(t) {
      return 1 - (--t) * t * t * t;
    },
    InOut: function(t) {
      return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
    }
  },

  Quintic: {
    In: function(t) {
      return t * t * t * t * t;
    },
    Out: function(t) {
      return 1 + (--t) * t * t * t * t;
    },
    InOut: function(t) {
      return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
    }
  }

  ,

  quadratic: function(t) {
    return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  },

  cubic: function(t) {
    return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
  },

  quartic: function(t) {
    return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t
  },

  quintic: function(t) {
    return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t
  },

  linear: function(t) {
    return t;
  } //provided for consistency / in case 'linear' is needed

};
