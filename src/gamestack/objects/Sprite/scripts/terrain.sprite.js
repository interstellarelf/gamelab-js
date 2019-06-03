


(function(){
    console.log('Terrain class... creating');

class Terrain extends Gamestack.Sprite
{
    constructor(args={})
    {
        super(args); //init as Gamestack.Sprite()

        this.collideables = args.collideables || args.colliders || [];

    }

    Collideables(c)
    {
        this.collideables = c || [];

        if(!this.collideables instanceof Array)
        {
            return console.error('Must pass array for "c" argument');

        }

        return this;
    }
    onCollide(callback) // Gamestack.Terrain instance should have an onCollide() function
    {

      this.collideables.forEach(function(sprite){

        if(sprite.onUpdate)
        {

          sprite.onUpdate(function(){

            

          });

        }

      });

    }

}


    Gamestack.Terrain= Terrain;

})();
