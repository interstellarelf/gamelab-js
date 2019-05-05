
//Author: Jordan E. Blake


class Effect {
  constructor() {


  }

  isAnimation() {


  }

  isParticleEffect() {


  }

  isSoundEffect() {


  }

  commit() {


  }

}

class SpriteMove {
  constructor(args = {}) {
    this.line = 100;

    this.timeLimit = 350;

    this.degreesRotated = 90;
  }


  setAnimation() {


  }



  setAnimationForward() //set the basic animation OR 'forward anime'
  {


  }

  setAnimationBackard() //set the backward animation OR 'backward-anime'
  {


  }


  setLineBack() //set the 'backward movement', should the Sprite need to return from the move
  {


  }


  setLine() //set the basic line OR 'forward movement'
  {



  }


  setLineForward() //set the basic line OR 'forward movement'
  {


  }

  setLineBack() //set the 'backward movement', should the Sprite need to return from the move
  {


  }

  setImmediateEffects() //Effects triggered when the SpriteMove starts
  {

  }

  setAfterEffects() //Effects triggered when the SpriteMove completes
  {

  }


  commit() {



  }

  then() {


  }
}

class Jump {
  constructor(spriteMove) {

  }

  setAnimation() {


  }

  setTimeLimit() {


  }

  setUpward(distance, duration) {


  }

  setDownward(distance, duration) {


  }

  commit() {



  }
}

class Vault {
  constructor(forward, back, afterEffects) {


  }

  commit() {


  }


  setForwardMove(line, curve, duration) {


  }


  setBackwardMove(line, curve, duration) {


  }


  onForwardDone(psuedoEffect) {


  }
  onBackwardDone(psuedoEffect) {


  }
}


class Attack {
  constructor(spriteMove, rpsLevel, powerLevel, afterEffects) {


  }

  commit() {


  }

  setAfterEffects(afterEffects) {



  }

  setRpsLevel(rpsLevel) {


  }

  setPowerLevel(pLevel) {


  }

}
