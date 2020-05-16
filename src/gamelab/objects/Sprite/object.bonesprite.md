object.bonesprite.js ::

Design

Start with the simplest code-expression for creating the object.

var bonesprite = new BoneSprite();

bonesprite.addBone(function(){
  this.Origin();
  this.Position();
});
