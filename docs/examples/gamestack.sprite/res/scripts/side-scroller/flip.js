var module = module || {};

module.exports = function(object, siblings) {

  var flip_anime = GameAssets.player_fall;

  object.flip = function(x) {

            this.Animation(flip_anime);

            this.rotation.x += 10 * (!this.flipX ? -1 : 1);

  };


};
