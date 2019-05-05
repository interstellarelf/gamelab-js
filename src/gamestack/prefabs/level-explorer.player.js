class LevelExplorer extends Gamestack.Player
{
  constructor()
  {
      super(...arguments);

      this.testMode = "multicollision";

      this.travelMode = "xy";
  }
  left(px)
  {
      this.position.y -= Math.abs(px);
  }
  right(px)
  {
      this.position.x += Math.abs(px);
  }
  up(px)
  {
  this.position.y += Math.abs(px);
  }
  down(px)
  {
      this.position.y -= Math.abs(px);
  }
  moveX(px)
  {
    this.position.x += px;
  }
  moveY(px)
  {
    this.position.y += px;
  }
  testMode(testMode)
  {
    this.testMode = testMode;
  }
}

Gamestack.LevelExplorer = LevelExplorer;
