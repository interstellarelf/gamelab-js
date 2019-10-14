class Line2d extends Scriptable {

  constructor() {
    super();
    this.Object(this);
    this.points = [];
    this.position = new Gamelab.Vector(0, 0);
    this.size = new Gamelab.Vector(0, 0);
    this.index = 0;
    this.lineWidth = 1.0;
    this.call = function() {};
  }

  StepFunction(call) {
    this.call = call;
    return this;
  }

  next() {
    this.index += 1;
    return this.points[this.index % this.points.length];
  }

  Color(c) {
    this.color = c;
    return this;
  }

  Fill() {

    for (var x = 1; x <= this.size.x; x++) {
          var x_total = this.size.x;
          var out_of_1 = x / x_total;
          var next_x = this.position.x + x;
          console.log('using x portion::' + out_of_1);
          var next_y = this.position.y + (this.size.y * this.call(out_of_1, 1.0)),
            next_point = new Gamelab.Vector(next_x, next_y);
          this.points.push(next_point);
      }

    return this;
  }

  getOffsetPos(pos){
    var offset = this.window_offset || new Gamelab.Vector(0, 0);
    return pos.add(offset);
  }

  LineWidth(number)
  {
    this.lineWidth = number;
    return this;
  }

  draw(ctx, camera) {

    ctx = ctx || Gamelab.game_windows[0].ctx;
    camera = camera || Gamelab.game_windows[0].camera;

    var points = this.points;

    ctx.save();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.lineWidth;

    ctx.beginPath();
    if (points instanceof Array) {
      for (var x = 0; x < points.length; x++) {
        var p = points[x];

        var position = p.position || p;

        var real_pos = this.getOffsetPos(position);

        if (real_pos.hasOwnProperty('x') && real_pos.hasOwnProperty('y')) {
          if (x == 0)
            ctx.moveTo(real_pos.x, real_pos.y)
          else {
            ctx.lineTo(real_pos.x, real_pos.y);
          }
        }
      }
    }

    ctx.stroke();
    ctx.restore();

  }

}

Gamelab.Line2d = Line2d;

Gamelab.Line2D = Line2d;
