

var module = module || {};

module.exports = function(){

return {

  append: function (side_key, sprites, base_sprite, fit_total, layer_num) {

    side_key = side_key.toLowerCase();

    var total = 0;

    var MyTopSprites = [];

    var size_x = Math.round(base_sprite.size.x / fit_total);

    var size_y = Math.round(base_sprite.size.y / fit_total);

    var index = -1;

    sprites.next = function(){
        index += 1;
        return this[index % this.length];
    };

    var sizeFactor = 2000;

    if(side_key == 'top' || side_key == 'bottom')
    {
      sizeFactor = base_sprite.size.x;
    }

    if(side_key == 'left' || side_key == 'right')
    {
      sizeFactor = base_sprite.size.y;
    }


    while (total < sizeFactor) {

                    var S = new Gamestack.Sprite().FromData(sprites.next());

                    var h_to_w = S.size.y / S.size.x,

                    w_to_h = S.size.x / S.size.y;

                    if(side_key == 'top' || side_key == 'bottom')
                    {
                      S.onLoad(function(){

                          alert('sprite loaded');
                      });

                      S.size.x = size_x;
                      S.size.y = size_x * h_to_w;
                      S.Pos(base_sprite.position.x + total, base_sprite.position.y - (S.size.y / 2)  + (side_key == 'bottom' ? base_sprite.size.y : 0));
                        total += size_x;
                    }

                    if(side_key == 'left')
                    {
                      S.onLoad(function(){

                          alert('sprite loaded');
                      });


                                              S.Size(size_y * w_to_h, size_y);
                        S.Pos(base_sprite.position.x - S.size.x / 2, base_sprite.position.y + total);

                      total += size_y;
                    }

                    if(side_key == 'right')
                    {

                              S.Size(size_y * w_to_h, size_y);
                        S.Pos(base_sprite.position.x + base_sprite.size.x - S.size.x / 2, base_sprite.position.y + total);

                      total += size_y;
                    }


                    EdgeSpritesInGame.push(S);
                    gameWindow.add(EdgeSpritesInGame[EdgeSpritesInGame.length - 1], {layer: layer_num});

    }
  }

}

};
