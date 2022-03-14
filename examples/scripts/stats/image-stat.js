class DomHtml {

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


class ImageStat extends DomHtml {

  constructor(args = {}) {

    super();

    this.src = args.src || "__NONE";

    this.size = args.size || new Gamelab.Vector(50, 50);

    this.text_id = Gamelab.create_id();

    this.id = Gamelab.create_id();

    this.img_id = Gamelab.create_id();

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

  MarginTop(v) {
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
    this.size = new Gamelab.Vector(x, y || x);
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

    this.domElement.setAttribute('class', 'Gamelab-stats');

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

Gamelab.ImageStat = ImageStat;
