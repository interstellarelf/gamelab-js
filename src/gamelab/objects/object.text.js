class Text {

  constructor(value) {
    this.Text(value);
    this.FontSize(15);
    this.FontFamily('Arial');
    this.color = 'white';
    this.shadowColor = 'black';
    this.shadowBlur = 0;
    this.position = new Gamelab.Vector(0, 0);
  }

  Text(t) {
    this.text = t;
    this.value = t;
    return this;
  }

  Shadow(color, blur) {
    this.shadowColor = color;
    this.shadowBlur = blur;
    return this;
  }

  Font(fsize, ffamily) {
    this.FontSize(fsize);
    this.FontFamily(ffamily)
    return this;
  }

  Color(c) {
    this.color = c;
    return this;
  }

  FontSize(value) {
    if (typeof value !== 'string')
      value = value + '';
    value = value.replace('px', '') + 'px';
    this.fontSize = value;
    return this;
  }
  FontFamily(value) {
    this.fontFamily = value;
    return this;
  }
  getOffsetPos(pos) {
    var offset = this.window_offset || new Gamelab.Vector(0, 0);
    return pos.add(offset);
  }

  draw(ctx, camera) {
    console.log("DRAWING object.text.js");
    var x = this.position.x + camera.position.x,
      y = this.position.y + camera.position.y;

    if (ctx.save) {
      ctx.save();
    }

    ctx.fillStyle = this.color;
    ctx.font = this.fontSize + ' ' + this.fontFamily;

    var size = ctx.measureText(this.text);

    ctx.shadowColor = this.shadowColor;
    ctx.shadowBlur = this.shadowBlur;

    //use the width of capital M as approximate text height

    this.size = new Gamelab.Vector(size.width, ctx.measureText('M').width);

    var pos = new Gamelab.Vector(x, y),
      realPos = this.getOffsetPos(pos);

    ctx.fillText(this.text, realPos.x, realPos.y);
    ctx.restore();
  }
}


Gamelab.Text = Text;
