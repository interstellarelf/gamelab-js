

module.exports = function(sourceTexels){

    if(!sourceTexels instanceof Array)
    {
        return console.error('1st argument must be extended array class');
    }

    this.sourceTexels = sourceTexels;

    this.sourceTexels.do(function() {

      this.push(new Gamelab.Sprite('./images/town-style-01/texel2d-00.png'));

      this.last().name = '0';

      this.last().describe = 'An empty texel, zeroth texel in stack.';

      this.last().group = 'empty-texel';

    });


    this.sourceTexels.do(function() {

      this.push(new Gamelab.Sprite('./images/town-style-01/texel2d-01.png'));

      this.last().name = '01';

      this.last().DRAWOFFSCREEN = true;

      this.last().describe = 'A basic texel bearing the number 1. Use it for any level-tile';

    this.last().group = 'numbers';



    });

    this.sourceTexels.do(function() {

      this.push(new Gamelab.Sprite('./images/town-style-01/texel2d-02.png'));

      this.last().name = '02';

      this.last().describe = 'A basic texel bearing the number 2. Use it for any level-tile';
        this.last().group = 'numbers';

    });


    this.sourceTexels.do(function() {

      this.push(new Gamelab.Sprite('./images/town-style-01/texel2d-03.png'));

      this.last().name = '03';

      this.last().describe = 'A basic texel bearing the number 3. Use it for any level-tile';

        this.last().group = 'numbers';

    });


  
    this.sourceTexels.do(function() {

      this.push(new Gamelab.Sprite('./images/town-style-01/texel2d-house-01.png'));

      this.last().name = 'house-01';
      this.last().describe = 'Use this texel for any 2d-building';

      this.last().group = 'buildings';

      this.last().unitSize = new Gamelab.Vector(3, 3);

    });

    this.sourceTexels.do(function() {

      this.push(new Gamelab.Sprite('./images/town-style-01/texel2d-house-02.png'));

      this.last().name = 'house-02';
      this.last().describe = 'Use this texel for any 2d-building';

      this.last().group = 'buildings';

      this.last().unitSize = new Gamelab.Vector(3, 3);

    });


    this.sourceTexels.do(function() {

      this.push(new Gamelab.Sprite('./images/town-style-01/texel2d-house-03.png'));

      this.last().name = 'house-03';
      this.last().describe = 'Use this texel for any 2d-building';

      this.last().group = 'buildings';

      this.last().unitSize = new Gamelab.Vector(3, 3);

    });

    this.sourceTexels.do(function() {

      this.push(new Gamelab.Sprite('./images/town-style-01/texel2d-house-04.png'));

      this.last().name = 'house-04';
      this.last().describe = 'Use this texel for any 2d-building';

      this.last().group = 'buildings';

      this.last().unitSize = new Gamelab.Vector(3, 3);

    });


    this.sourceTexels.do(function() {

      this.push(new Gamelab.Sprite('./images/town-style-01/texel2d-tall-building.png'));

      this.last().name = 'tall-building';
      this.last().describe = 'a tall building';

      this.last().group = 'buildings';

      this.last().unitSize = new Gamelab.Vector(3, 5);

    });


    this.sourceTexels.do(function() {

      this.push(new Gamelab.Sprite('./images/town-style-01/texel2d-medium-building.png'));

      this.last().name = 'medium-building';
      this.last().describe = 'a medium-height building.';

      this.last().group = 'buildings';

        this.last().unitSize = new Gamelab.Vector(3, 2);

    });


    this.sourceTexels.do(function() {

      this.push(new Gamelab.Sprite('./images/town-style-01/texel2d-short-building.png'));

      this.last().name = 'short-building';
      this.last().describe = 'a short building.';

      this.last().group = 'buildings';

      this.last().unitSize = new Gamelab.Vector(3, 1);

    });

    this.sourceTexels.do(function() {

      this.push(new Gamelab.Sprite('./images/town-style-01/texel2d-castle-entrance.png'));

      this.last().name = 'castle-entrance';
      this.last().describe = 'castle-entrance';

      this.last().group = 'entrance';

      this.last().unitSize = new Gamelab.Vector(3, 3);

    });


    this.sourceTexels.do(function() {

      this.push(new Gamelab.Sprite('./images/town-style-01/texel2d-cave-entrance.png'));

      this.last().name = 'cave-entrance';
      this.last().describe = 'cave-entrance';

      this.last().group = 'entrance';

        this.last().unitSize = new Gamelab.Vector(2, 2);

    });


    this.sourceTexels.do(function() {

      this.push(new Gamelab.Sprite('./images/town-style-01/texel2d-stone-01.png'));

      this.last().name = 'stone-01';
      this.last().describe = 'stone-01';

      this.last().group = 'terrain';



    });


    this.sourceTexels.do(function() {

      this.push(new Gamelab.Sprite('./images/town-style-01/texel2d-stone-02.png'));

      this.last().name = 'stone-02';
      this.last().describe = 'stone-02';

      this.last().group = 'terrain';

    });


    this.sourceTexels.do(function() {

      this.push(new Gamelab.Sprite('./images/town-style-01/texel2d-stone-03.png'));

      this.last().name = 'stone-03';
      this.last().describe = 'stone-03';

        this.last().group = 'terrain';

    });




      this.sourceTexels.do(function() {

        this.push(new Gamelab.Sprite('./images/town-style-01/texel2d-bombable-stone-01.png'));

        this.last().name = 'bombable-stone-01';
        this.last().describe = 'bombable-stone-01';

        this.last().group = 'terrain';

      });


      this.sourceTexels.do(function() {

        this.push(new Gamelab.Sprite('./images/town-style-01/texel2d-bombable-stone-02.png'));

        this.last().name = 'bombable-stone-02';
        this.last().describe = 'bombable-stone-02';

        this.last().group = 'terrain';

      });


      this.sourceTexels.do(function() {

        this.push(new Gamelab.Sprite('./images/town-style-01/texel2d-bombable-stone-03.png'));

        this.last().name = 'bombable-stone-03';
        this.last().describe = 'bombable-stone-03';

          this.last().group = 'terrain';

      });



    this.sourceTexels.do(function() {

      this.push(new Gamelab.Sprite('./images/town-style-01/texel2d-brick-01.png'));

      this.last().name = 'brick-01';
      this.last().describe = 'brick-01';

        this.last().group = 'terrain';

    });


    this.sourceTexels.do(function() {

      this.push(new Gamelab.Sprite('./images/town-style-01/texel2d-brick-02.png'));

      this.last().name = 'brick-02';
      this.last().describe = 'brick-02';

        this.last().group = 'terrain';

    });


    this.sourceTexels.do(function() {

      this.push(new Gamelab.Sprite('./images/town-style-01/texel2d-brick-03.png'));

      this.last().name = 'brick-03';
      this.last().describe = 'brick-03';

        this.last().group = 'terrain';

    });


    this.sourceTexels.do(function() {

      this.push(new Gamelab.Sprite('./images/town-style-01/texel2d-caves.png'));

      this.last().name = 'caves';
      this.last().describe = 'caves';

      this.last().group = 'passages';

    });


    this.sourceTexels.do(function() {

      this.push(new Gamelab.Sprite('./images/town-style-01/texel2d-bridge.png'));

      this.last().name = 'bridge';
      this.last().describe = 'bridge over land or water';

          this.last().group = 'bridges';

    });


    this.sourceTexels.do(function() {

      this.push(new Gamelab.Sprite('./images/town-style-01/texel2d-waterfall.png'));

      this.last().name = 'waterfall';
      this.last().describe = 'a waterfall texel';

        this.last().group = 'water';

    });


    this.sourceTexels.do(function() {

      this.push(new Gamelab.Sprite('./images/town-style-01/texel2d-water.png'));

      this.last().name = 'water';
      this.last().describe = 'water';

      this.last().group = 'water';

    });


    this.sourceTexels.do(function() {

      this.push(new Gamelab.Sprite('./images/town-style-01/texel2d-watertop.png'));

      this.last().name = 'watertop';
      this.last().describe = 'watertop';

          this.last().group = 'water';

    });


    this.sourceTexels.do(function() {

      this.push(new Gamelab.Sprite('./images/town-style-01/texel2d-player.png'));

      this.last().name = 'player';
      this.last().describe = 'Player-Texel';

      this.last().group = 'characters';

    });

    this.sourceTexels.do(function() {

      this.push(new Gamelab.Sprite('./images/town-style-01/texel2d-gems.png'));

      this.last().name = 'gems';
      this.last().describe = 'gems texel';

      this.last().group = 'items';

    });





      this.sourceTexels.do(function() {

        this.push(new Gamelab.Sprite('./images/town-style-01/texel2d-little-enemy.png'));

        this.last().name = 'little-enemy';
        this.last().describe = 'little-enemy texel';

      });


      this.sourceTexels.do(function() {

        this.push(new Gamelab.Sprite('./images/town-style-01/texel2d-medium-enemy.png'));

        this.last().name = 'medium-enemy';
        this.last().describe = 'medium enemy texel';

        this.last().unitSize = new Gamelab.Vector(2, 2);


      });


      this.sourceTexels.do(function() {

        this.push(new Gamelab.Sprite('./images/town-style-01/texel2d-big-enemy.png'));

        this.last().name = 'big-enemy';
        this.last().describe = 'big enemy texel';

          this.last().unitSize = new Gamelab.Vector(3, 3);

      });


      this.sourceTexels.do(function() {

        this.push(new Gamelab.Sprite('./images/town-style-01/texel2d-food.png'));

        this.last().name = 'food-enemy';
        this.last().describe = 'food enemy texel';

      });


      this.sourceTexels.do(function() {

        this.push(new Gamelab.Sprite('./images/town-style-01/texel2d-money.png'));

        this.last().name = 'money';
        this.last().describe = 'money enemy texel';

      });

      this.sourceTexels.do(function() {

        this.push(new Gamelab.Sprite('./images/town-style-01/texel2d-weapon.png'));

        this.last().name = 'weapon';
        this.last().describe = 'weapon texel';

      });

      this.sourceTexels.do(function() {

        this.push(new Gamelab.Sprite('./images/town-style-01/texel2d-armor.png'));

        this.last().name = 'armor';
        this.last().describe = 'armor texel';

      });


      return this.sourceTexels;

};
