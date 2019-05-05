

class Text {

  constructor(value){
    this.Text(value);

    this.FontSize(15);
    this.FontFamily('Arial');

    this.color = 'white';

    this.position = new Gamestack.Vector(0, 0);
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
      var offset = this.window_offset || new Gamestack.Vector(0, 0);
      return pos.add(offset);
    }

  draw(ctx, camera){

    var x = this.position.x + camera.position.x,
     y = this.position.y + camera.position.y;

     if(ctx.save)
     {
    ctx.save();
    }
    
    ctx.fillStyle = this.color;

    ctx.font = this.fontSize + ' ' + this.fontFamily;

    var pos = new Gamestack.Vector(x, y),
    realPos = this.getOffsetPos(pos);

    ctx.fillText(this.text, realPos.x, realPos.y);

    ctx.restore();

  }
}


Gamestack.Text = Text;
