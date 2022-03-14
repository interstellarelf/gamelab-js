class Line2d extends Scriptable {
  constructor() {
    super();
    this.Object(this);
    this.points = [];
    this.position = new Gamelab.Vector(0, 0);
    this.rotation = new Gamelab.Vector(0, 0);
    this.size = new Gamelab.Vector(0, 0);
    this.index = 0;
    this.lineWidth = 1.0;
    this.timer = 0;
    this.phase_index = 0;
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

  GradientCall(fxn, colorStops=[]){
    this.colorStops = colorStops;
    this.gradient_call = fxn.bind(this);
      return this;
  }

  ShadowBlur(shadowBlur, color){
      this.shadowBlur = shadowBlur;
      this.shadowColor = color;
    return this;
  }

  Opacity(o){
    this.opacity = o;
    return this;
  }

  AnimateShadowBlur(minBlur, maxBlur, color, stepFunction){
    this.shadowBlur = minBlur;
    this.shadowColor = color;
    this.minBlur = minBlur;
    this.maxBlur = maxBlur;
    this.blurStepFunction = stepFunction.bind(this);
    this.blurTimer = 0;
    return this;
  }

  collide(gameObject, lineCollisionCallback=function(){}){
    var gop = gameObject.position, gos = gameObject.size;
    var COLLIDE = false, LINE = this;
    this.points.forEach(function(p){
      if(p.x  >= gop.x && p.x <= gop.x + gos.x &&
      p.y  >= gop.y && p.y <= gop.y + gos.y)
      {
        COLLIDE = true;
        lineCollisionCallback(p, LINE.points);
      }
    });
    return COLLIDE;
  }

  Fill() {
    for (var x = 1; x <= this.size.x; x++) {
          var x_total = this.size.x;
          var out_of_1 = x / x_total;
        //  console.log('using x portion::' + out_of_1);
          var y = (this.size.y * this.call(out_of_1, 1.0)),
          pos = new Gamelab.Vector(Gamelab.VectorMath.rotatePointsXY(x, y, this.rotation.x));
                    var next_x = this.position.x + pos.x,
            next_y = this.position.y + pos.y,
          last_point = this.points[this.points.length - 1];
          if(!last_point)
          {
            last_point = new Gamelab.Vector(0, 0);
          }
          var next_point = new Gamelab.Vector(next_x, next_y);
          next_point.r = next_point.angleBetween(last_point, next_point);
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

  Layer(l)
  {
    this.layer = l;
    return this;
  }

  GlobalComposite(gc)
  {
    this.globalComposite = gc;
    return this;
  }

  draw(ctx, camera) {
    ctx = ctx || Gamelab.game_windows[0].ctx;
    camera = camera || Gamelab.game_windows[0].camera;

    this.ctx = ctx;
    var points = this.points;
    ctx.save();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.lineWidth;
    ctx.beginPath();
    this.timer += 1;
    var lastPoint = false;

    if (points instanceof Array) {
      for (var x = 0; x < points.length; x++) {
        var p = points[x];
        if(x >= 1)
        {
          lastPoint = points[x];
          if(this.gradient_call)
          {
            this.gradient = this.gradient_call(lastPoint, p, this.colorStops);
            ctx.strokeStyle = this.gradient || this.color;
          }
        }
        var position = p.position || p;
        var real_pos = position.sub(camera.position);
        if (real_pos.hasOwnProperty('x') && real_pos.hasOwnProperty('y')) {
          ctx.lineTo(real_pos.x, real_pos.y);
        }
      }
    }

    var blurTime = this.timer % (this.maxBlur - this.minBlur),
    blurLen = this.maxBlur - this.minBlur;
    this.phase_index = Math.floor(this.timer / (this.maxBlur - this.minBlur));

    if(this.shadowBlur)
    {
        ctx.shadowBlur = this.shadowBlur;
    }
    if(this.blurStepFunction)
    {
      ctx.shadowBlur = this.minBlur +  this.blurStepFunction(blurTime / blurLen, 1.0) * (this.maxBlur - this.minBlur);
    }
    if(this.shadowColor)
    {
      ctx.shadowColor = this.shadowColor;
    }
    if(this.globalComposite)
    {
      ctx.globalCompositeOperation = this.globalComposite;
    }
    if(typeof this.opacity == 'number')
    {
      ctx.globalAlpha = this.opacity;
    }

    ctx.stroke();

    if(this.fillStyle)
    {
      ctx.fillStyle = this.fillStyle;
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

}

Gamelab.Line2d = Line2d;

Gamelab.Line2D = Line2d;
