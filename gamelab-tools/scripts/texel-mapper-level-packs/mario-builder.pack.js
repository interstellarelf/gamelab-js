

module.exports = function(sourceTexels){

    if(!sourceTexels instanceof Array)
    {
        return console.error('1st argument must be extended array class');
    }

    this.sourceTexels = sourceTexels;

    this.sourceTexels.do(function() {

      this.push(new Gamelab.Sprite('./images/mario-tribute/texel2d-00.png'));

      this.last().name = '0';

      this.last().describe = 'An empty texel, zeroth texel in stack.';

      this.last().group = 'empty-texel';

    });



        this.sourceTexels.do(function() {

          this.push(new Gamelab.Sprite('./images/mario-tribute/texel2d-stone-brick-01.png'));

          this.last().name = 'stone-brick-01';
          this.last().describe = 'stone-brick-01';

          this.last().group = 'terrain';

        });



        this.sourceTexels.do(function() {

          this.push(new Gamelab.Sprite('./images/mario-tribute/texel2d-stone-brick-01.png'));

          this.last().name = 'stone-brick-01';
          this.last().describe = 'stone-brick-01';

          this.last().group = 'terrain';

        });




    this.sourceTexels.do(function() {

      this.push(new Gamelab.Sprite('./images/mario-tribute/texel2d-01.png'));

      this.last().name = '01';

      this.last().DRAWOFFSCREEN = true;

      this.last().describe = 'A basic texel bearing the number 1. Use it for any level-tile';

    this.last().group = 'numbers';



    });

    this.sourceTexels.do(function() {

      this.push(new Gamelab.Sprite('./images/mario-tribute/texel2d-02.png'));

      this.last().name = '02';

      this.last().describe = 'A basic texel bearing the number 2. Use it for any level-tile';
        this.last().group = 'numbers';

    });


    this.sourceTexels.do(function() {

      this.push(new Gamelab.Sprite('./images/mario-tribute/texel2d-03.png'));

      this.last().name = '03';

      this.last().describe = 'A basic texel bearing the number 3. Use it for any level-tile';

        this.last().group = 'numbers';

    });




      return this.sourceTexels;

};
