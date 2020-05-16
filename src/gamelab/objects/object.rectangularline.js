class RectangularLine {
  constructor() {
    this.position = new Gamelab.Vector(0, 0);
    this.rotation = new Gamelab.Vector(0, 0);
    this.size = new Gamelab.Vector(0, 0);
    this.origin = new Gamelab.Vector(0, 0);
    this.gradient = undefined;
    this.active = true;
    this.invisible = false;
  }
  Rotation(r) {
    this.rotation = new Gamelab.Vector(r);
    return this;
  }
  Origin(o) {
    this.origin = new Gamelab.Vector(o);
    return this;
  }
  Position(p) {
    this.position = new Gamelab.Vector(p);
    return this;
  }
  Size(s) {
    this.size = new Gamelab.Vector(s);
    return this;
  }
  Gradient(a, b) {
    this.gradientColorA = a;
    this.gradientColorB = b;
    return this;
  }
  Thickness(t) {
    this.thickness = t;
    return this;
  }
  draw(ctx, camera) {

    ctx.save();

    if (!this.invisible && this.active) {
      this.ctx = ctx;
      let gradient = this.ctx.createLinearGradient(0, 0, this.size.x, 0);
      gradient.addColorStop(0, this.gradientColorA || 'white');
      gradient.addColorStop(0, this.gradientColorB || 'white');
      this.gradient = gradient;

      ctx.translate(this.position.x + this.origin.x, this.position.y + this.origin.y);
      ctx.rotate(Math.PI / 180 * this.rotation.x);

      ctx.translate(0, ctx.width);

      if (this.flipX) {
        ctx.scale(-1, 1);
      } else {

      }

      if (this.flipY) {
        ctx.scale(1, -1);
      } else {

      }

      ctx.strokeStyle = this.gradient || 'white';
      ctx.lineWidth = this.thickness || 4.0;

      ctx.beginPath();
      ctx.strokeRect(-this.origin.x, -this.origin.y, this.size.x, this.size.y);
    }

    ctx.restore();

  }
}

Gamelab.RectangularLine = RectangularLine;