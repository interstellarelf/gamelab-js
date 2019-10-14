
var getTextHeight = function(font) {

  var text = $('<span>Hg</span>').css({ fontFamily: font });
  var block = $('<div style="display: inline-block; width: 1px; height: 0px;"></div>');

  var div = $('<div></div>');
  div.append(text, block);

  var body = $('body');
  body.append(div);

  try {

    var result = {};

    block.css({ verticalAlign: 'baseline' });
    result.ascent = block.offset().top - text.offset().top;

    block.css({ verticalAlign: 'bottom' });
    result.height = block.offset().top - text.offset().top;

    result.descent = result.height - result.ascent;

  } finally {
    div.remove();
  }

  return result;
};


class Text {

  constructor(value){
    
    this.Text(value);

    this.FontSize(15);
    this.FontFamily('Arial');

    this.color = 'white';

    this.position = new Gamelab.Vector(0, 0);

  }

  Text(t){

    this.text = t;
    this.value = t;
    return this;
  }

  Font(fsize, ffamily){
    this.FontSize(fsize);
    this.FontFamily(ffamily)
    return this;
  }

  FontSize(value){
    if(typeof value !== 'string')
    value = value + '';

    value = value.replace('px', '') + 'px';

    this.fontSize = value;
    return this;
  }
  FontFamily(value)
  {
    this.fontFamily = value;
    return this;
  }


    getOffsetPos(pos){
      var offset = this.window_offset || new Gamelab.Vector(0, 0);
      return pos.add(offset);
    }

  draw(ctx, camera){

    console.log("DRAWING object.text.js");

    var x = this.position.x + camera.position.x,
     y = this.position.y + camera.position.y;

     if(ctx.save)
     {
    ctx.save();
    }

    ctx.fillStyle = this.color;

    ctx.font = this.fontSize + ' ' + this.fontFamily;

    var size = ctx.measureText(this.text);

    this.size = new Gamelab.Vector(size.width, getTextHeight(ctx.font).height);

    var pos = new Gamelab.Vector(x, y),
    realPos = this.getOffsetPos(pos);

    ctx.fillText(this.text, realPos.x, realPos.y);

    ctx.restore();

  }
}


Gamelab.Text = Text;
