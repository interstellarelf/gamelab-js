

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
