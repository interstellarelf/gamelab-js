/**
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
