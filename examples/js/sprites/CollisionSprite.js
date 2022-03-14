

function CollisionSprite(sprite){
  Object.keys(CollisionSpriteFxns).forEach(function(key){
    sprite[key] = CollisionSpriteFxns[key];
  });

  return sprite;
};

let CollisionSpriteFxns = {
    /**
     * returns a true || false value for immediate color-collision --non-transparent-pixels --between colored-pixels of this sprite and the sprite argument
     * @function
     * @memberof Sprite
     * @param {Sprite} spr the sprite object to be collided
     * @returns {boolean} a true or false value to show if collision is happening
     **********/

    hasPixelCollision(sprite) {

      if (!TypeCode.truthyPropsPerArray([this, sprite], 'selected_animation'))
        return;

      if (!TypeCode.truthyPropsPerArray([this.selected_animation, sprite.selected_animation], 'getCurrentPixelMap'))
        return;

      let anime = this.selected_animation,
        alt_anime = sprite.selected_animation;

      var grid1 = anime.selectedFramePixelMap = this.selected_animation.getCurrentPixelMap(),

        grid2 = alt_anime.selectedFramePixelMap = alt_anime.getCurrentPixelMap();

      for (var x in grid1) {
        for (var y in grid2) {
          if (Gamelab.Collision.boxesCollide(grid1[x].position, grid1[x].size, grid2[y].position, grid2[y].size)) {
            return true;

          }

        }
      }

      return false;
    },

    init_pixelCollision() {
      let anime = this.selected_animation;

      this.selectedFramePixelMap = anime.getCurrentPixelMap(anime.scaleOf(this.size));
      this.colliderHighlights = this.colliderHighlights || [];
    },

    init_colliderHighlights(unitMarker) {
      while (this.colliderHighlights.length < 100) {
        var sprite = new Gamelab.Sprite(unitMarker);
        this.colliderHighlights.push(sprite);
        Gamelab.game_windows[0].add(sprite);
      }
    },


    set_colliderHighlights(hSprite, on) {
      this.collider_highlightsOn = on || false;

      this.init_pixelCollision();

      this.init_colliderHighlights(hSprite);

      let anime = this.selected_animation;

      for (var x in this.colliderHighlights) {
        this.colliderHighlights[x].active = false;
      }

      if (hSprite && this.collider_highlightsOn)
        for (var x in this.selectedFramePixelMap) {
          if (!this.colliderHighlights[x]) {
            continue;
          }

          let gridPiece = this.selectedFramePixelMap[x];

          let anime_scale = anime.scaleOf(this.size),
            real_gridPiece_pos = gridPiece.position.mult(anime_scale),
            real_gridPiece_size = gridPiece.size.mult(anime_scale);

          this.colliderHighlights[x].Pos(this.position.add(new Gamelab.Vector(real_gridPiece_pos.x, real_gridPiece_pos.y).sub(anime.selected_frame.framePos.mult(anime_scale))));

          this.colliderHighlights[x].Size(real_gridPiece_size);

          this.colliderHighlights[x].active = true;
        };

    },

    onPixelCollision(sprite, callback, highlightSprite) {

      let anime = this.selected_animation;

      this.onUpdate(function() {

        var anime = this.selected_animation;

        if (this.hasPixelCollision(sprite)) {

          if (!this.colliderHighlights) {


          } else
            for (var x in colliderHighlights) {
              gameWindow.remove(colliderHighlights[x]);
            };

          callback(this, sprite);

        };

      });
    },


    /**
     * returns a true || false value for immediate box-collision --between this sprite and the sprite argument
     * @function
     * @memberof Sprite
     * @param {Sprite} sprite the alternate Sprite for collision detection
     * @returns {boolean} a true or false value to show if collision is happening
     **********/

    hasBoxCollision(sprite) {

      return Gamelab.Collision.spriteCollide(this, sprite);

    },

    onBoxCollision(sprite, callback) {
      this.onUpdate(function() {

        if (this.hasBoxCollision(sprite, this.boxCollisionSettings.padding)) {

          callback(this, sprite);

        };
      });
    },


    /*************
     * #BE CAREFUL
     * -with this function :: change sensitive / tricky / 4 way collision
     * *************/


    /**
     * Trigger a fourway collision-stop between this and another Sprite ::
     * objects will behave clastically and resist passing through one-another
     *
     * @function
     * @memberof Sprite
     * @param {Sprite} item the Sprite to collide with
     *
     **********/

    collide_stop(item) {

      if (this.id == item.id) {
        return false;
      }

      this.speed = this.speed || new Gamelab.Vector(0, 0, 0);
      this.padding = this.padding || new Gamelab.Vector(0, 0, 0);

      // this.position = this.position.sub(this.speed);

      if (this.hasBoxCollision(item)) {
        var diff = this.center().sub(item.center());
        if (this.overlap_x(item, this.padding.x + 0.1) && Math.abs(diff.x) < Math.abs(diff.y)) {
          var apart = false;
          var ct = 1000;

          while (!apart && ct > 0) {
            ct--;
            var diffY = this.center().sub(item.center()).y;
            var distY = Math.abs(this.size.y / 2 + item.size.y / 2 - Math.round(this.size.y * this.padding.y));

            if (Math.abs(diffY) < distY) {
              this.position.y -= diffY > 0 ? -1 : diffY < 0 ? 1 : 0;
              this.position.y = Math.round(this.position.y);
            } else {

              if (!this.jumping && this.speed.y > 0) {
                this.speed.y = 0;
              }
              return apart = true;
            }
          }
        }

        if (this.overlap_y(item, this.padding.y) && Math.abs(diff.y) < Math.abs(diff.x)) {
          this.collide_stop_x(item);
        }
      }
    },

    /**
     * collide-stop only from the top (of the sprite passed as argument) ::
     *
     * @function
     * @memberof Sprite
     * @param {Sprite} item the Sprite to collide with
     *
     **********/

    collide_stop_top(item, callback) {

      if (this.id == item.id) {
        return false;
      }

      if (this.overlap_x(item, this.padding.x + 0.1)) {

        console.log('OVERLAP_X');
        var paddingY = this.padding.y * this.size.y;
        var p1 = this.position,
          p2 = item.position;

        if (p1.y + this.size.y - paddingY <= p2.y) {
          this.groundMaxY = p2.y - this.size.y + paddingY;
        }
      }
    }



};
