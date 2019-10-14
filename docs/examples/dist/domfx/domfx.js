"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**************************
 *
 **************************/
var DomFx = {
  Tag: function Tag(tagName) {
    return document.createElement(tagName);
  },


  create_id: function create_id() {
    var S4 = function S4() {
      return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
    };
    return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
  }
};
;
var DomHtml = function () {
  function DomHtml(tagName) {
    _classCallCheck(this, DomHtml);

    this.domElement = document.createElement(tagName || 'SPAN');

    if (Object.getPrototypeOf(this) === DomHtml.prototype) {
      this.default();
    }
  }

  _createClass(DomHtml, [{
    key: "dom",
    value: function dom() {
      return this.domElement;
    }
  }, {
    key: "style",
    value: function style() {
      return this.dom().style;
    }
  }, {
    key: "default",
    value: function _default() {

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

      this.Text('--DOMHtml--');
      document.body.append(this.domElement);
    }
  }, {
    key: "Position",
    value: function Position(v) {

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
  }, {
    key: "Opacity",
    value: function Opacity(o) {
      this.domElement.style.opacity = o;
      return this;
    }
  }, {
    key: "ScalePos",
    value: function ScalePos() {
      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      this.ScaleTop(y);
      this.ScaleLeft(x);
    }
  }, {
    key: "ScaleTop",
    value: function ScaleTop(t) {
      this.targetTop = this.get_float_pixels(t, document.body.clientHeight);
      this.domElement.style.bottom = 'auto';
      this.domElement.style.top = this.targetTop;
      return this;
    }
  }, {
    key: "ScaleLeft",
    value: function ScaleLeft(l) {
      this.targetLeft = this.get_float_pixels(l, document.body.clientWidth);
      this.domElement.style.right = 'auto';
      this.domElement.style.left = this.targetLeft;
      return this;
    }
  }, {
    key: "ScaleBottom",
    value: function ScaleBottom(v) {
      this.targetBottom = this.get_float_pixels(v, document.body.clientHeight);
      this.domElement.style.top = 'auto';
      this.domElement.style.bottom = this.targetBottom;
      return this;
    }
  }, {
    key: "ScaleRight",
    value: function ScaleRight(v) {
      this.targetRight = this.get_float_pixels(v, document.body.clientWidth);
      this.domElement.style.left = 'auto';
      this.domElement.style.right = this.targetRight;
      return this;
    }
  }, {
    key: "Top",
    value: function Top(v) {
      v = parseFloat(v) + 'px';
      this.domElement.style.top = v;
      return this;
    }
  }, {
    key: "Left",
    value: function Left(v) {
      v = parseFloat(v) + 'px';
      this.domElement.style.left = v;
      return this;
    }
  }, {
    key: "Bottom",
    value: function Bottom(v) {
      v = parseFloat(v) + 'px';
      this.domElement.style.bottom = v;
      return this;
    }
  }, {
    key: "Right",
    value: function Right(v) {
      v = parseFloat(v) + 'px';
      this.domElement.style.right = v;
      return this;
    }
  }, {
    key: "ScaleX",
    value: function ScaleX(x) {
      this.targetLeft = this.get_float_pixels(x, document.body.clientWidth);
      this.domElement.style.right = 'auto';
      this.domElement.style.left = this.targetLeft;
      return this;
    }
  }, {
    key: "ScaleY",
    value: function ScaleY(y) {
      this.targetTop = this.get_float_pixels(y, document.body.clientHeight);
      this.domElement.style.bottom = 'auto';
      this.domElement.style.top = this.targetTop;
      return this;
    }
  }, {
    key: "Offset",
    value: function Offset(x, y) {
      var px = parseFloat(this.domElement.style.left),
          py = parseFloat(this.domElement.style.top);
      this.Pos(px + x, py + y);
      return this;
    }
  }, {
    key: "CenterPos",
    value: function CenterPos() {
      this.ScaleX(0.5);
      this.Offset(this.domElement.offsetWidth / 2 * -1, 0);

      this.ScaleY(0.5);
      this.Offset(0, this.domElement.offsetHeight / 2 * -1);

      return this;
    }
  }, {
    key: "X",
    value: function X(x) {
      this.targetLeft = Math.round(x) + 'px';
      this.domElement.style.right = 'auto';
      this.domElement.style.left = this.targetLeft;
      return this;
    }
  }, {
    key: "Y",
    value: function Y(y) {
      this.targetTop = Math.round(y) + 'px';
      this.domElement.style.bottom = 'auto';
      this.domElement.style.top = this.targetTop;
      return this;
    }
  }, {
    key: "ScalePos",
    value: function ScalePos(x, y) {
      this.ScaleX(x);
      this.ScaleY(y);
      return this;
    }
  }, {
    key: "Pos",
    value: function Pos(x, y) {
      this.X(x);
      this.Y(y);
      return this;
    }
  }, {
    key: "Size",
    value: function Size(x, y) {
      this.style().width = x + 'px';
      this.style().height = y + 'px';
      return this;
    }
  }, {
    key: "ScaleSize",
    value: function ScaleSize(s) {
      var pct = this.height / this.width;
      this.width = this.get_float_pixels(s, document.body.clientWidth);
      this.height = Math.round(this.width * pct);
      return this;
    }
  }, {
    key: "FontSize",
    value: function FontSize(v) {
      v = v + '';
      if (v.indexOf('px') == -1 && v.indexOf('em') == -1 && v.indexOf('%') == -1) {
        //assume px:
        v += 'px';
      }
      this.domElement.style.fontSize = v;
      return this;
    }
  }, {
    key: "FontFamily",
    value: function FontFamily(v) {
      v = v + '';
      this.domElement.style.fontFamily = v;
      return this;
    }
  }, {
    key: "Text",
    value: function Text(v) {
      v = v + '';
      this.domElement.innerText = v;
      return this;
    }
  }, {
    key: "Background",
    value: function Background(v) {
      this.domElement.style.background = v;
      return this;
    }
  }, {
    key: "Padding",
    value: function Padding(p) {

      p = parseFloat(p) + 'px';

      this.domElement.style.padding = p;

      return this;
    }
  }, {
    key: "Color",
    value: function Color(c) {
      this.domElement.style.color = c;
      return this;
    }
  }, {
    key: "TextColor",
    value: function TextColor(c) {
      this.domElement.style.color = c;
      return this;
    }
  }, {
    key: "Border",
    value: function Border(b) {
      this.domElement.style.border = b;
      return this;
    }
  }, {
    key: "BorderTop",
    value: function BorderTop(b) {
      this.domElement.borderTop = b;
      return this;
    }
  }, {
    key: "BorderLeft",
    value: function BorderLeft(b) {
      this.domElement.borderLeft = b;
      return this;
    }
  }, {
    key: "BorderBottom",
    value: function BorderBottom(b) {
      this.domElement.borderBottom = b;
      return this;
    }
  }, {
    key: "BorderRight",
    value: function BorderRight(b) {
      this.domElement.borderRight = b;
      return this;
    }
  }, {
    key: "BorderRadius",
    value: function BorderRadius(v) {
      this.style().borderRadius = v;
      return this;
    }
  }, {
    key: "TextAlign",
    value: function TextAlign(v) {
      this.style().textAlign = v;
      return this;
    }
  }, {
    key: "VerticalAlign",
    value: function VerticalAlign(v) {

      this.style().VerticalAlign = v;
      return this;
    }
  }, {
    key: "LineHeight",
    value: function LineHeight(v) {

      this.style().LineHeight = v;
      return this;
    }
  }, {
    key: "Cursor",
    value: function Cursor(v) {
      this.domElement.style.cursor = v;
      return this;
    }

    //Math helpers / CSS ::

  }, {
    key: "get_float_pixels",
    value: function get_float_pixels(portion, total) {
      return Math.round(portion * total) + 'px';
    }
  }]);

  return DomHtml;
}();

;

var MagicDom = function (_DomHtml) {
  _inherits(MagicDom, _DomHtml);

  function MagicDom(tagName) {
    _classCallCheck(this, MagicDom);

    var _this = _possibleConstructorReturn(this, (MagicDom.__proto__ || Object.getPrototypeOf(MagicDom)).call(this, tagName || 'SPAN'));

    _this.styleTargets = {};
    _this.callerKey = undefined; //track the last called function
    return _this;
  }

  _createClass(MagicDom, [{
    key: "Css",
    value: function Css(key, value) {
      for (var x in this.style()) {
        if (x.toLowerCase() == key.toLowerCase()) this.style()[key] = value;
      }
      return this;
    }
  }, {
    key: "StyleTarget",
    value: function StyleTarget(key, value) {
      this.styleTargets[key] = value;
      return this;
    }
  }, {
    key: "TransitionCurve",
    value: function TransitionCurve(easingArg_One, easingArg_Two) {
      this.transitionCurve = typeof easingArg_One == 'function' ? easingArg_One : EasingCurves.get(easingArg_One, easingArg_Two);
      return this;
    }
  }, {
    key: "then",
    value: function then(f) {
      this[this.callerKey + '_' + 'complete'] = f;
      return this;
    }
  }, {
    key: "onComplete",
    value: function onComplete(fun) {
      this.complete = fun;
      return this;
    }
  }, {
    key: "ScaleTop",
    value: function ScaleTop(t) {
      this.targetTop = this.get_float_pixels(t, document.body.clientHeight);
      this.domElement.style.bottom = 'auto';
      this.domElement.style.top = this.targetTop;
      return this;
    }
  }, {
    key: "ScaleLeft",
    value: function ScaleLeft(l) {
      this.targetLeft = this.get_float_pixels(l, document.body.clientWidth);
      this.domElement.style.right = 'auto';
      this.domElement.style.left = this.targetLeft;
      return this;
    }
  }, {
    key: "ScaleBottom",
    value: function ScaleBottom(v) {
      this.targetBottom = this.get_float_pixels(v, document.body.clientHeight);
      this.domElement.style.top = 'auto';
      this.domElement.style.bottom = this.targetBottom;
      return this;
    }
  }, {
    key: "ScaleRight",
    value: function ScaleRight(v) {
      this.targetRight = this.get_float_pixels(v, document.body.clientWidth);
      this.domElement.style.left = 'auto';
      this.domElement.style.right = this.targetRight;
      return this;
    }
  }]);

  return MagicDom;
}(DomHtml //to do apply a super object 'Extra'
);

;

var Bar = function (_DomHtml2) {
  _inherits(Bar, _DomHtml2);

  function Bar(background, border) {
    _classCallCheck(this, Bar);

    var _this2 = _possibleConstructorReturn(this, (Bar.__proto__ || Object.getPrototypeOf(Bar)).call(this));

    _this2.background = background;
    var e = document.createElement("SPAN");
    e.style.position = 'fixed';
    e.style.background = _this2.background;
    e.style.zIndex = "9999";
    e.style.backgroundSize = "100% 100%";
    e.style.backgroundPosition = "center bottom";

    if (border) {
      e.style.border = border;
    }

    _this2.domElement = e;
    return _this2;
  }

  _createClass(Bar, [{
    key: "width",
    value: function width(w) {
      this.domElement.style.width = w;

      return this;
    }
  }, {
    key: "height",
    value: function height(h) {
      this.domElement.style.height = h;

      return this;
    }
  }]);

  return Bar;
}(DomHtml);

var BarFill = function (_DomHtml3) {
  _inherits(BarFill, _DomHtml3);

  function BarFill(background) {
    _classCallCheck(this, BarFill);

    var _this3 = _possibleConstructorReturn(this, (BarFill.__proto__ || Object.getPrototypeOf(BarFill)).call(this));

    _this3.background = background;
    var e = document.createElement("SPAN");

    e.style.background = _this3.background;

    e.style.position = 'fixed';

    e.style.zIndex = "9995";

    _this3.domElement = e;

    return _this3;
  }

  _createClass(BarFill, [{
    key: "width",
    value: function width(w) {
      this.domElement.style.width = w;

      return this;
    }
  }, {
    key: "height",
    value: function height(h) {
      this.domElement.style.height = h;

      return this;
    }
  }]);

  return BarFill;
}(DomHtml);

/**
 * Creates an instance of BarDisplay.
 * <info-bit>Gamelab.BarDisplay is an instantiable a health-bar;
 * Composed of one or more HTML/Dom objects;
 * Uses chainable function-calls.
 * See the code examples below.</info-bit>
 *
 * <iframe style='width:400px; height:450px; overflow:hidden;' src='../client/examples/js-class/BarDisplay.html'> </iframe>
 *
 *
 * @param   {BarDisplay= | Object=} barDisplayArgs the BarDisplay instance OR data to use when creating this instance of BarDisplay

 *
 *@returns {BarDisplay} an instance of Gamelab.BarDisplay
 *
 * */

var BarDisplay = function (_DomHtml4) {
  _inherits(BarDisplay, _DomHtml4);

  //show BarDisplay as in 'health-bar'

  function BarDisplay() {
    var barDisplayArgs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, BarDisplay);

    var args = barDisplayArgs || {};

    var _this4 = _possibleConstructorReturn(this, (BarDisplay.__proto__ || Object.getPrototypeOf(BarDisplay)).call(this, 'DIV'));

    _this4.border = args.border || "none";
    _this4.inner = args.src || args.inner || 'darkorange';
    _this4.outer = args.outer_src || args.outer || 'transparent';
    _this4.width = args.width + '' || args.fill_width + '';

    if (_this4.width.indexOf('px') == -1) {
      _this4.width += 'px';
    }

    _this4.height = args.height + '' || args.fill_height + '';
    if (_this4.height.indexOf('px') == -1) {
      _this4.height += 'px';
    }

    _this4.color = args.color || args.fill_color;
    Gamelab.defSize();
    _this4.CreateDom();

    return _this4;
  }

  _createClass(BarDisplay, [{
    key: "Top",
    value: function Top(v) {
      this.targetTop = this.get_float_pixels(v, document.body.clientHeight);

      for (var x in [this.innerDom, this.outerDom]) {
        [this.innerDom, this.outerDom][x].Top(v);
      }
      return this;
    }
  }, {
    key: "Left",
    value: function Left(v) {
      this.targetLeft = this.get_float_pixels(v, document.body.clientWidth);

      for (var x in [this.innerDom, this.outerDom]) {
        [this.innerDom, this.outerDom][x].Left(v);
      }

      return this;
    }
  }, {
    key: "Bottom",
    value: function Bottom(v) {
      this.targetBottom = this.get_float_pixels(v, document.body.clientHeight);

      for (var x in [this.innerDom, this.outerDom]) {
        [this.innerDom, this.outerDom][x].Bottom(v);
      }

      return this;
    }
  }, {
    key: "Right",
    value: function Right(v) {
      this.targetRight = this.get_float_pixels(v, document.body.clientWidth);

      for (var x in [this.innerDom, this.outerDom]) {
        [this.innerDom, this.outerDom][x].Right(v);
      }
      return this;
    }
  }, {
    key: "CreateDom",
    value: function CreateDom() {
      this.innerDom = new BarFill(this.inner).width(this.width || "80px").height(this.height || "10px");
      this.fill = this.innerDom;
      this.outerDom = new Bar(this.outer, this.border).width(this.width || "80px").height(this.height || "10px");
      this.bar = this.outerDom;
    }
  }, {
    key: "Inner",
    value: function Inner(color_or_src) {
      this.inner = color_or_src;
      this.CreateDom();
      return this;
    }
  }, {
    key: "Outer",
    value: function Outer(color_or_src) {
      this.outer = color_or_src;
      this.CreateDom();
      return this;
    }
  }, {
    key: "Border",
    value: function Border(css_border) {
      this.border = css_border;
      this.CreateDom();
      return this;
    }
  }, {
    key: "show",
    value: function show() {
      document.body.append(this.innerDom.domElement);
      document.body.append(this.outerDom.domElement);
      return this;
    }
  }, {
    key: "Show",
    value: function Show() {
      //same as lc show()
      document.body.append(this.innerDom.domElement);
      document.body.append(this.outerDom.domElement);
      return this;
    }
  }, {
    key: "Width",
    value: function Width(w) {
      this.portion_width(w);
      return this;
    }
  }, {
    key: "Height",
    value: function Height(h) {
      this.portion_height(h);
      return this;
    }
  }, {
    key: "get_float_pixels",
    value: function get_float_pixels(float, dimen) {
      return Math.round(dimen * float) + 'px';
    }
  }, {
    key: "portion_top",
    value: function portion_top(v) {
      this.fill.domElement.style.top = this.get_float_pixels(v || this.topFloat, Gamelab.HEIGHT);
      this.bar.domElement.style.top = this.get_float_pixels(v || this.topFloat, Gamelab.HEIGHT);
    }
  }, {
    key: "portion_left",
    value: function portion_left(v) {
      this.fill.domElement.style.left = this.get_float_pixels(v || this.leftFloat, Gamelab.WIDTH);
      this.bar.domElement.style.left = this.get_float_pixels(v || this.leftFloat, Gamelab.WIDTH);
    }
  }, {
    key: "portion_width",
    value: function portion_width(w) {
      this.fill.domElement.style.width = this.get_float_pixels(w || this.widthFloat, Gamelab.WIDTH);
      this.bar.domElement.style.width = this.get_float_pixels(w || this.widthFloat, Gamelab.WIDTH);
    }
  }, {
    key: "portion_height",
    value: function portion_height(h) {
      this.fill.domElement.style.height = this.get_float_pixels(h || this.heightFloat, Gamelab.HEIGHT);
      this.bar.domElement.style.height = this.get_float_pixels(h || this.heightFloat, Gamelab.HEIGHT);
    }
  }, {
    key: "update",
    value: function update(f) {
      this.fill.domElement.style.width = this.get_float_pixels(f || 0, parseFloat(this.bar.domElement.style.width));
    }
  }]);

  return BarDisplay;
}(DomHtml);

DomFx.BarDisplay = BarDisplay;
;

/***************************
*   Incomplete Elements (html)
*
* Wanted Elements : Caption, various ImageSelects, etc...
****************************/

var Caption = function (_MagicDom) {
  _inherits(Caption, _MagicDom);

  function Caption(src, scale) {
    _classCallCheck(this, Caption);

    var _this5 = _possibleConstructorReturn(this, (Caption.__proto__ || Object.getPrototypeOf(Caption)).call(this, src));

    _this5.ScaleSize(scale || 1.0);
    return _this5;
  }

  return Caption;
}(MagicDom);

var CaptionRow = function (_MagicDom2) {
  _inherits(CaptionRow, _MagicDom2);

  function CaptionRow(src, scale) {
    _classCallCheck(this, CaptionRow);

    var _this6 = _possibleConstructorReturn(this, (CaptionRow.__proto__ || Object.getPrototypeOf(CaptionRow)).call(this, src));

    _this6.ScaleSize(scale || 1.0);
    return _this6;
  }

  _createClass(CaptionRow, [{
    key: "Borders",
    value: function Borders(top, bottom, selector) {}
  }, {
    key: "WidthPortion",
    value: function WidthPortion(scaleX) {}
  }]);

  return CaptionRow;
}(MagicDom);

;

var MagicElipse = function (_MagicDom3) {
  _inherits(MagicElipse, _MagicDom3);

  function MagicElipse() {
    var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, MagicElipse);

    var _this7 = _possibleConstructorReturn(this, (MagicElipse.__proto__ || Object.getPrototypeOf(MagicElipse)).call(this, args));

    _this7.BorderRadius('50%');
    return _this7;
  }

  return MagicElipse;
}(MagicDom);

;
;
var MagicDomFadeable = function (_MagicDom4) {
  _inherits(MagicDomFadeable, _MagicDom4);

  function MagicDomFadeable(tagName) {
    _classCallCheck(this, MagicDomFadeable);

    var _this8 = _possibleConstructorReturn(this, (MagicDomFadeable.__proto__ || Object.getPrototypeOf(MagicDomFadeable)).call(this, tagName || 'SPAN'));

    _this8.domElement = document.createElement(tagName);
    _this8.default();
    _this8.TransitionCurve('linear', 'none');
    _this8.callerKey = undefined; //track the last called function


    _this8.fadeTime = { in: 2500, out: 2500, remain: 0 };
    _this8.fadeValues = { in: [], out: [] };
    return _this8;
  }

  _createClass(MagicDomFadeable, [{
    key: "TransitionCurve",
    value: function TransitionCurve(easingArg_One, easingArg_Two) {
      this.transitionCurve = typeof easingArg_One == 'function' ? easingArg_One : EasingCurves.get(easingArg_One, easingArg_Two);
      return this;
    }
  }, {
    key: "FadeTiming",
    value: function FadeTiming(_in, _out, _remain) {
      this.fadeTime = { in: _in || 2500,
        out: _out || _in || 2500,
        remain: _remain || 0
      };

      this.ComputeFade();

      return this;
    }
  }, {
    key: "DelayFade",
    value: function DelayFade(timing, in_out_phase) {
      console.dev('FadeDelay() in_out_phase = "in" || "out"');

      this.fadeDelays = { in: in_out_phase == 'in' ? timing : 0,
        out: in_out_phase == 'out' ? timing : 0
      };
      return this;
    }
  }, {
    key: "ComputeFade",
    value: function ComputeFade() {

      //create an html element
      var $magicDom = this;

      var computeValue = function computeValue(step_Index, stepLimit) {
        var floatPortionTotal = $magicDom.transitionCurve(step_Index / stepLimit);
        //x / totalSteps be the float-time-portion 0-1.0 of the transition in linear time

        return floatPortionTotal * 1.0;
        //1.0 --opacity 1.0 be the total
      };

      ['in', 'out'].forEach(function (key) {

        var totalSteps = Math.ceil($magicDom.fadeTime[key] / 10); //total # of steps

        var values = [];

        for (var x = 0; x < totalSteps; x += 1) {
          values.push(computeValue(x, totalSteps));

          if (key == 'out') {
            var v = values[values.length - 1];
            values[values.length - 1] = 1.0 - v;
          }
        }

        console.log(values.length);

        $magicDom.fadeValues[key] = values.reverse(); //fadeValues[in || out] is set to the result--array
      });

      return this;
    }
  }, {
    key: "seesaw",
    value: function seesaw() {

      var $magicDom = this;

      $magicDom.show().then(function () {

        $magicDom.hide().then(function () {

          $magicDom.seesaw();
        });
      });
    }
  }, {
    key: "show",
    value: function show(duration, callback) {

      var $magicDom = this;

      this.callerKey = 'show';

      this['show_complete'] = function () {};

      callback = callback || function () {};

      var copy_values_in = $magicDom.fadeValues.in.slice();

      function go() {
        if (copy_values_in.length > 1) {
          $magicDom.Css('opacity', copy_values_in.pop());
          setTimeout(function () {
            go();
          }, 10);
        } else {
          callback();
          if ($magicDom[$magicDom.callerKey + '_' + 'complete']) $magicDom[$magicDom.callerKey + '_' + 'complete']();
        }
      }

      go();
      return this;
    }
  }, {
    key: "hide",
    value: function hide(duration, callback) {
      var $magicDom = this;
      this.callerKey = 'hide';

      callback = callback || function () {};

      this['hide_complete'] = function () {};

      var copy_values_out = $magicDom.fadeValues.out.slice();

      function go() {
        if (copy_values_out.length > 1) {
          $magicDom.Css('opacity', copy_values_out.pop());
          setTimeout(function () {
            go();
          }, 10);
        } else {
          callback();
          if ($magicDom[$magicDom.callerKey + '_' + 'complete']) $magicDom[$magicDom.callerKey + '_' + 'complete']();
        }
      }

      delay(go, this.fadeTime.remain);

      return this;
    }
  }, {
    key: "then",
    value: function then(f) {
      this[this.callerKey + '_' + 'complete'] = f;
      return this;
    }
  }]);

  return MagicDomFadeable;
}(MagicDom //to do apply a super object 'Extra'
);

;
/**
 * Creates an instance of ...

 * */

var Numeric = function (_DomHtml5) {
  _inherits(Numeric, _DomHtml5);

  function Numeric() {
    _classCallCheck(this, Numeric);

    var _this9 = _possibleConstructorReturn(this, (Numeric.__proto__ || Object.getPrototypeOf(Numeric)).call(this));

    _this9.domElement = document.createElement('SPAN');
    document.body.appendChild(_this9.domElement);
    _this9.default();
    return _this9;
  }

  _createClass(Numeric, [{
    key: "Duration",
    value: function Duration(d) {
      this.duration = d;
      return this;
    }
  }, {
    key: "FadeTime",
    value: function FadeTime(fadeInTime, fadeOutTime) {
      this.fadeTime = { in: fadeInTime || 250,
        out: fadeOutTime || 250
      };
      return this;
    }
  }, {
    key: "Visible",
    value: function Visible() {

      this.style.opacity = 1.0;
      return this;
    }
  }, {
    key: "get_float_pixels",
    value: function get_float_pixels(float, dimen) {
      return Math.round(dimen * float) + 'px';
    }
  }, {
    key: "onComplete",
    value: function onComplete(fun) {
      this.complete = fun;
      return this;
    }
  }, {
    key: "Number",
    value: function Number(n) {

      this.domElement.innerText = n;
      return this;
    }
  }, {
    key: "Countdown",
    value: function Countdown(mode) {

      var dom = this;

      if (mode == 'seconds') window.setInterval(function () {

        var number = parseFloat(dom.domElement.innerText);

        number -= 1;

        dom.domElement.innerText = number;
      }, 1000);

      return this;
    }
  }, {
    key: "show",
    value: function show(text, duration) {

      //create an html element
      var __inst = this;
      if (this.show_interval) {
        clearInterval(this.show_interval);
      }

      this.show_interval = setInterval(function () {
        var o = parseFloat(__inst.domElement.style.opacity);
        if (o < 1.0) {
          o += 1.0 * (20 / __inst.fadeTime.in);
          __inst.domElement.style.opacity = o;
        }
      }, 20);

      setTimeout(function () {

        clearInterval(__inst.show_interval);

        __inst.hide_interval = setInterval(function () {
          var o = parseFloat(__inst.domElement.style.opacity);

          if (o > 0) {
            o -= 1.0 * (20 / __inst.fadeTime.out);

            __inst.domElement.style.opacity = o;
          } else {

            __inst.domElement.style.opacity = o;

            if (typeof __inst.complete == 'function') {
              __inst.complete();
            }

            clearInterval(__inst.hide_interval);
          }
        }, 20);
      }, __inst.duration);
      return this;
    }
  }, {
    key: "then",
    value: function then(cb) {
      this.complete = cb || function () {};
    }
  }]);

  return Numeric;
}(DomHtml);

;

var Table = function (_MagicDom5) {
  _inherits(Table, _MagicDom5);

  function Table() {
    var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Table);

    var _this10 = _possibleConstructorReturn(this, (Table.__proto__ || Object.getPrototypeOf(Table)).call(this, args));

    _this10.domElement = document.createElement('table');

    _this10.cols = [];
    return _this10;
  }

  _createClass(Table, [{
    key: "Heading",
    value: function Heading(v) {
      var th = dfx.Tag('TH');
    }
  }, {
    key: "addRow",
    value: function addRow() {
      var tr = dfx.Tag('TR');
    }
  }, {
    key: "addData",
    value: function addData(row_index, column_index) {
      var tr = dfx.Tag('TD');
    }
  }]);

  return Table;
}(MagicDom);

;
;
/**
 * Creates an instance of TextDisplay.
 *
 * <info-bit>Gamelab.TextDisplay shows text on-screen;
 * Composed of one or more HTML/Dom objects;
 * Uses chainable function-calls.
 * See the code examples below.</info-bit>
 *
 * <iframe style='width:400px; height:450px; overflow:hidden;' src='../client/examples/js-class/TextDisplay.html'> </iframe>
 *
 *
 * @param   {Text | Object=} textDisplayArg the textDisplay instance OR data to use when creating this instance of TextDisplay

 *
 *@returns {Text} an instance of Gamelab.TextDisplay
 *
 * */

var head = document.head || document.getElementsByTagName('head')[0];

head.innerHTML += '<style>' + '\r\n' + '.speech-triangle { overflow:visible; }' + '.speech-triangle:before { content: "";' + 'position: absolute;' + 'z-index:-1;' + 'width: 0;' + 'height: 0;' + 'left: 38px;' + 'bottom: -18px;' + 'border-width: 8px 8px;' + 'border-style: solid;' + 'border-color: #fff transparent transparent #fff;' + ' } .farLeft:after{ right:0px; left:20px; } .farRight:after{ left:0px; right:20px; }   .flipX:after{  -moz-transform: scaleX(-1); -webkit-transform: scaleX(-1); -o-transform: scaleX(-1); transform: scaleX(-1); -ms-filter: fliph; /*IE*/ filter: fliph; /*IE*/  } ' + ' </style>';

var Text = function (_DomHtml6) {
  _inherits(Text, _DomHtml6);

  function Text() {
    _classCallCheck(this, Text);

    var _this11 = _possibleConstructorReturn(this, (Text.__proto__ || Object.getPrototypeOf(Text)).call(this));

    document.body.append(_this11.domElement);
    _this11.default();
    return _this11;
  }

  _createClass(Text, [{
    key: "Duration",
    value: function Duration(d) {
      this.duration = d;
      return this;
    }
  }, {
    key: "FadeTime",
    value: function FadeTime(fadeInTime, fadeOutTime) {
      this.fadeTime = { in: fadeInTime || 250,
        out: fadeOutTime || 250
      };
      return this;
    }
  }, {
    key: "get_float_pixels",
    value: function get_float_pixels(float, dimen) {
      return Math.round(dimen * float) + 'px';
    }
  }, {
    key: "onComplete",
    value: function onComplete(fun) {
      this.complete = fun;
      return this;
    }
  }, {
    key: "show",
    value: function show(text, duration) {

      //create an html element
      var __inst = this;
      if (this.show_interval) {
        clearInterval(this.show_interval);
      }

      this.show_interval = setInterval(function () {
        var o = parseFloat(__inst.domElement.style.opacity);
        if (o < 1.0) {
          o += 1.0 * (20 / __inst.fadeTime.in);
          __inst.domElement.style.opacity = o;
        }
      }, 20);

      setTimeout(function () {

        clearInterval(__inst.show_interval);

        __inst.hide_interval = setInterval(function () {
          var o = parseFloat(__inst.domElement.style.opacity);

          if (o > 0) {
            o -= 1.0 * (20 / __inst.fadeTime.out);

            __inst.domElement.style.opacity = o;
          } else {

            __inst.domElement.style.opacity = o;

            if (typeof __inst.complete == 'function') {
              __inst.complete();
            }

            clearInterval(__inst.hide_interval);
          }
        }, 20);
      }, __inst.duration);
      return this;
    }
  }, {
    key: "then",
    value: function then(cb) {
      this.complete = cb || function () {};
    }
  }]);

  return Text;
}(DomHtml);

var GChar = function (_Text) {
  _inherits(GChar, _Text);

  function GChar() {
    var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, GChar);

    return _possibleConstructorReturn(this, (GChar.__proto__ || Object.getPrototypeOf(GChar)).call(this, args));
  }

  return GChar;
}(Text);

DomFx.Text = Text;

var TextBubble = function (_Text2) {
  _inherits(TextBubble, _Text2);

  function TextBubble() //merely an element of text
  {
    var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, TextBubble);

    var _this13 = _possibleConstructorReturn(this, (TextBubble.__proto__ || Object.getPrototypeOf(TextBubble)).call(this, args));

    _this13.opacity = args.opacity || 0.85;

    _this13.text = '';

    _this13.FadeTime(250, 250);

    _this13.create_dom();

    _this13.duration = args.stay || args.duration || _this13.text.length * 100;

    return _this13;
  }

  _createClass(TextBubble, [{
    key: "create_dom",
    value: function create_dom() {
      this.domElement = document.createElement('SPAN');

      this.domElement.setAttribute('class', 'speech-triangle');

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
  }]);

  return TextBubble;
}(Text);

DomFx.TextBubble = TextBubble;
; /**
  * Creates an instance of ImStat:
  
  * <info-bit>Gamelab.ImStat displays item-counts or stats on the screen.
  * Composed of one or more HTML/Dom objects;
  * Uses chainable function-calls.
  * See the code examples below.</info-bit>
  *
  * <iframe style='width:400px; height:450px; overflow:hidden;' src='../client/examples/js-class/ImStat.html'> </iframe>
  *
  *
  * @param   {ImageStat= | Object=} ImStatArgs the ImStat instance OR data to use when creating this instance of ImStat
  
  *
  *@returns {ImageStat} an instance of Gamelab.ImStat
  *
  * */

var ImageStat = function (_DomHtml7) {
  _inherits(ImageStat, _DomHtml7);

  function ImageStat() {
    var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, ImageStat);

    var _this14 = _possibleConstructorReturn(this, (ImageStat.__proto__ || Object.getPrototypeOf(ImageStat)).call(this));

    _this14.src = args.src || "__NONE";

    _this14.size = args.size || new Gamelab.Vector(50, 50);

    _this14.text_id = DomFx.create_id();

    _this14.id = DomFx.create_id();

    _this14.img_id = DomFx.create_id();

    _this14.create_dom();

    return _this14;
  }

  _createClass(ImageStat, [{
    key: "Src",
    value: function Src(src) {
      this.src = src;
      this.img.setAttribute('src', src);

      return this;
    }
  }, {
    key: "Source",
    value: function Source(src) //same as Src
    {
      this.src = src;
      this.img.setAttribute('src', src);
      return this;
    }
  }, {
    key: "Text",
    value: function Text(t) {
      this.span.innerHTML = t;
      this.span.textContent = t;
      return this;
    }
  }, {
    key: "MarginTop",
    value: function MarginTop(v) {
      v = v + '';
      v = v.replace('px', '');
      this.domElement.style.marginTop = v + 'px';
      return this;
    }
  }, {
    key: "TextMarginTop",
    value: function TextMarginTop(v) {
      v = v + '';
      if (v.indexOf('px') == -1 && v.indexOf('em') == -1 && v.indexOf('%') == -1) {
        //assume px:
        v += 'px';
      }

      var el = this.span;

      el.style.marginTop = v;

      return this;
    }
  }, {
    key: "Size",
    value: function Size(x, y) {
      this.size = new Gamelab.Vector(x, y || x);
      this.img.style.width = this.size.x + 'px';
      this.img.style.height = 'auto';

      return this;
    }
  }, {
    key: "FontSize",
    value: function FontSize(v) {

      v = v + "";

      if (v.indexOf('px') == -1 && v.indexOf('em') == -1 && v.indexOf('%') == -1) {
        //assume px:
        v += 'px';
      }

      this.pixelFontSize = v;

      this.domElement.style.fontSize = v;

      return this;
    }
  }, {
    key: "FontFamily",
    value: function FontFamily(v) {
      this.domElement.style.fontFamily = v;
      return this;
    }
  }, {
    key: "setValue",
    value: function setValue(value) {
      document.getElementById(this.text_id);
      return this;
    }
  }, {
    key: "get_id",
    value: function get_id() {
      return this.id;
    }
  }, {
    key: "update",
    value: function update(v) {
      var e = document.getElementById(this.text_id);
      this.text = v + "";
      e.innerText = this.text;
      return this;
    }
  }, {
    key: "create_dom",
    value: function create_dom() {
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
  }]);

  return ImageStat;
}(DomHtml);

DomFx.ImageStat = ImageStat;

DomFx.ImgStat = ImageStat;
;var EasingCurves = { //ALL HAVE INPUT AND OUTPUT OF: 0-1.0

  match: function match(string_one, string_two) {
    if (string_one == 'match') return console.error('cannot refer to match function within match function.');

    if (!string_two && typeof this[string_one] == 'function') return this[string_one];

    var fc_upper = function fc_upper(string) {
      var s = string.toLowerCase();
      return s.charAt(0).toUpperCase() + s.slice(1);
    };

    var lc_match = function lc_match(s1, s2) {
      return s1.toLowerCase() == s2.toLowerCase();
    };

    var uc_two = fc_upper(string_two);

    for (var x in this) {

      if (_typeof(this[x]) == 'object') {
        if (lc_match(x, string_one) && string_two && typeof this[x][uc_two] == 'function') return this[x][uc_two];
      }
    }
    return false;
  },

  get: function get(string_one, string_two) {

    var $CURVES = this;

    return this.match(string_one, string_two);
  },

  // no easing, no acceleration
  Linear: {
    None: function None(t) {
      return t;
    }
  },

  Quadratic: {
    In: function In(t) {
      return t * t;
    },
    Out: function Out(t) {
      return t * (2 - t);
    },
    InOut: function InOut(t) {
      return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
  },

  Cubic: {
    In: function In(t) {
      return t * t * t;
    },
    Out: function Out(t) {
      return --t * t * t + 1;
    },
    InOut: function InOut(t) {
      return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }
  },

  Quartic: {
    In: function In(t) {
      return t * t * t * t;
    },
    Out: function Out(t) {
      return 1 - --t * t * t * t;
    },
    InOut: function InOut(t) {
      return t < .5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
    }
  },

  Quintic: {
    In: function In(t) {
      return t * t * t * t * t;
    },
    Out: function Out(t) {
      return 1 + --t * t * t * t * t;
    },
    InOut: function InOut(t) {
      return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
    }
  },

  quadratic: function quadratic(t) {
    return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  },

  cubic: function cubic(t) {
    return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  },

  quartic: function quartic(t) {
    return t < .5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
  },

  quintic: function quintic(t) {
    return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
  },

  linear: function linear(t) {
    return t;
  } //provided for consistency / in case 'linear' is needed

};
//# sourceMappingURL=domfx.js.map
