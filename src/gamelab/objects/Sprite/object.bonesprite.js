/**
 * Creates a new BoneSprite.
 *
 * <info-bit>Gamelab.BoneSprite is a container for 2D Animations.
 * -apply Sprite class to create a 2D game-object.
 *
 * BoneSprites are a group of moving animations.</info-bit>
 * <iframe style='width:400px; height:450px; overflow:hidden;' src='../client/examples/js-class/Sprite.html'> </iframe>

 * @param   {string} src the srcPath for the image of the Sprite
 * @param   {number} scale=1.0 the scale to be applied to size of each animation-frame
 *
 * @returns {Sprite} a Gamelab.BoneSprite object
 */

class BoneSprite extends Sprite {
  constructor(src = {}, scale = 1.0) {
    super(src, scale);
    this.bones = [];
  }
  addBone(oncreate) {
    var bone = new Bone(this, this.size);
    oncreate.bind(bone).call();
  }
  draw_current_frame(ctx, camera) {

    var sprite = this;
    var frameList = [];
    if (sprite.active) {

      if (sprite.selected_animation instanceof Array && sprite.selected_animation.length >= 1) {
        sprite.selected_animation.forEach(function(anime) {

          anime.selected_frame.parent = anime;
          frameList.push(anime.selected_frame);

        });
      }

      var origin = sprite.origin || new Gamelab.Vector(0, 0);
      var rotation = sprite.rotation.x;

      frameList.reverse().forEach(function(frame){

        var realWidth = frame.size.x;
        var realHeight = frame.size.y;

        var x = frame.position.x,
          y = frame.position.y;

        if (frame.rotation && typeof frame.rotation.x == 'number') {
          rotation = frame.rotation.x;
        }

        if (frame.origin) {
          origin = frame.origin;
          //console.log('drawing with origin:' + origin.x + ':' + origin.y);
        }

        var frame_offset = new Gamelab.Vector(0, 0);

        if(frame.parent && frame.parent.frameOffset instanceof Gamelab.Vector)
        {
          //console.log('object.bonesprite.js:: frame-parent-offset');
          frame_offset = frame.parent.frameOffset;
        }

        if (frame && frame.image)
          Gamelab.Canvas.draw_image_frame(frame.image.domElement, new Gamelab.Vector(frame.framePos).add(frame_offset), frame.frameSize, new Gamelab.Vector2D(Math.round(x + (origin.x)), Math.round(y + (origin.y))), new Gamelab.Vector2D(realWidth, realHeight), rotation % 360, ctx, sprite.flipX, sprite.flipY, origin);
      });

    }

  }
};

Gamelab.BoneSprite = BoneSprite;
