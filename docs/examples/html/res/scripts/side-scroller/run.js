var module = module || {};

module.exports = function(object, siblings) {


  object.traction = {

    go_x: 0.8,

    stop_x: 3.2,

    idle_x: 2.0,

    air_x: 0.25

  };


  object.target_speeds = {
    stop: 0,
    go: 3.5,
    air_go: 2.0
  }

  object.boost = 1.5;

  object.tractions = {
    stop: 0.4,
    go: 0.4,
    air_go: 0.4
  };

  var run_anime = GameAssets.player_run, idle_anime= GameAssets.player_idle;

  object.runLeft = function() {
        this.flipX = false;
        if (this.GROUNDED) {
            this.Anime(run_anime);
              this.selected_animation.animate();
          this.rotation.x = 0;
          if (this.speed.x > (this.target_speeds.go * -1))
            this.speed.x -= this.tractions.go;
        } else {
          if (this.speed.x > (this.target_speeds.air_go * -1))
            this.speed.x -= this.tractions.air_go;
        }

  };


  object.runRight = function() {
        this.flipX = true;
        if (this.GROUNDED) {
          this.Anime(run_anime);
            this.selected_animation.animate();
          this.rotation.x = 0;
          if (this.speed.x < this.target_speeds.go)
            this.speed.x += this.tractions.go;
        } else {
          if (this.speed.x < this.target_speeds.air_go)
            this.speed.x += this.tractions.air_go;
        }
  }


  object.slowDown = function() {

    if (this.GROUNDED) {
      this.Anime(idle_anime);
        this.selected_animation.animate();
      this.decel(this.speed, 'x', 0.3 * this.traction.idle_x);

    }
    //  metroidSamus.setAnimation(SAMUS_ANIMATIONS.idle);
    this.selected_animation.cix = 0;
  }


  object.onUpdate(function(){

                      if(!(this.runSwitch.LEFT || this.runSwitch.RIGHT))
                      {
                        this.slowDown();
                      }

          })


};
