class Player extends Sprite
{
  constructor()
  {
      super(...arguments);
  }

  OnInput(inputDevice, arg1, arg2, callback)
  {
    console.info('Player.OnInput: Feature not implemented');
  }

}


Gamestack.Player = Player;
