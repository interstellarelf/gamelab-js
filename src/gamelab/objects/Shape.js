class Elipsoid {
  constructor() {
    this.position = new Gamelab.Vector(0, 0);
    this.rotation = new Gamelab.Vector(0, 0);
    this.size = new Gamelab.Vector(0, 0);
    this.origin = new Gamelab.Vector(0, 0);
    this.gradient = undefined;
    this.borderGradient = undefined;
    this.active = true;
    this.invisible = false;
    this.fill = false;
  }
  Rotation(r) {
    this.rotation = new Gamelab.Vector(r);
    return this;
  }
  Origin(x, y) {
    this.origin = new Gamelab.Vector(x, y);
    return this;
  }
  Position(x, y) {
    this.position = new Gamelab.Vector(x, y);
    return this;
  }
  Size(x, y) {
    this.size = new Gamelab.Vector(x, y);
    return this;
  }
  Fill(fill){
    this.fill = fill || true;
    return this;
  }
  BorderGradient(a, b) {
    this.borderGradientColorA = a;
    this.borderGradientColorB = b;
    return this;
  }
  Gradient(a, b) {
    this.gradientColorA = a;
    this.gradientColorB = b;
    this.Fill(true);
    return this;
  }
  BorderThickness(bt) {
    this.borderThickness = bt;
    return this;
  }
  draw(ctx, camera) {

    ctx.save();

    let startX = this.position.x-this.origin.x;

    if (!this.invisible && this.active) {
      this.ctx = ctx;
      let gradient = this.ctx.createLinearGradient(startX, 0, startX + this.size.x, 0);
      gradient.addColorStop(0, this.gradientColorA || 'white');
      gradient.addColorStop(1.0, this.gradientColorB || 'white');
      this.gradient = gradient;

      let borderGradient = this.ctx.createLinearGradient(startX, 0, startX + this.size.x, 0);
      borderGradient.addColorStop(0, this.borderGradientColorA || 'white');
      borderGradient.addColorStop(1.0, this.borderGradientColorB || 'white');
      this.borderGradient = borderGradient;

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



      ctx.strokeStyle = this.borderGradient || 'white';
      ctx.lineWidth = this.borderThickness || 4.0;

      ctx.beginPath();
      ctx.arc(this.position.x+this.origin.x,this.position.y+this.origin.y,this.size.x / 2.0,2 * Math.PI, false);

      if(this.fill)
      {
        ctx.fillStyle = this.gradient || 'white';
        ctx.fill();
      }

    }

    ctx.restore();

  }
}



class Rectangle {
  constructor() {
    this.position = new Gamelab.Vector(0, 0);
    this.rotation = new Gamelab.Vector(0, 0);
    this.size = new Gamelab.Vector(0, 0);
    this.origin = new Gamelab.Vector(0, 0);
    this.gradient = undefined;
    this.borderGradient = undefined;
    this.active = true;
    this.invisible = false;
    this.fill = false;
  }
  Rotation(r) {
    this.rotation = new Gamelab.Vector(r);
    return this;
  }
  Origin(x, y) {
    this.origin = new Gamelab.Vector(x, y);
    return this;
  }
  Position(x, y) {
    this.position = new Gamelab.Vector(x, y);
    return this;
  }
  Size(x, y) {
    this.size = new Gamelab.Vector(x, y);
    return this;
  }
  Fill(fill){
    this.fill = fill || true;
    return this;
  }
  BorderGradient(a, b) {
    this.borderGradientColorA = a;
    this.borderGradientColorB = b;
    return this;
  }
  Gradient(a, b) {
    this.gradientColorA = a;
    this.gradientColorB = b;
    this.Fill(true);
    return this;
  }
  BorderThickness(bt) {
    this.borderThickness = bt;
    return this;
  }
  draw(ctx, camera) {

    ctx.save();

    let startX = this.position.x-this.origin.x;

    if (!this.invisible && this.active) {
      this.ctx = ctx;
      let gradient = this.ctx.createLinearGradient(startX, 0, startX + this.size.x, 0);
      gradient.addColorStop(0, this.gradientColorA || 'white');
      gradient.addColorStop(1.0, this.gradientColorB || 'white');
      this.gradient = gradient;

      let borderGradient = this.ctx.createLinearGradient(startX, 0, startX + this.size.x, 0);
      borderGradient.addColorStop(0, this.borderGradientColorA || 'white');
      borderGradient.addColorStop(1.0, this.borderGradientColorB || 'white');
      this.borderGradient = borderGradient;

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

      if(this.fill)
      {
        ctx.fillStyle = this.gradient || 'white';
        ctx.fillRect(this.position.x-this.origin.x,this.position.y-this.origin.y,this.size.x,this.size.y);
      }

      ctx.strokeStyle = this.borderGradient || 'white';
      ctx.lineWidth = this.borderThickness || 4.0;

      ctx.beginPath();
      ctx.strokeRect(this.position.x-this.origin.x,this.position.y-this.origin.y,this.size.x,this.size.y);

    }

    ctx.restore();

  }
}



Gamelab.Rectangle = Rectangle;
Gamelab.RectangularLine = Rectangle;

Gamelab.CircleShape = Elipsoid;
Gamelab.Elipsoid = Elipsoid;
