class FiringClock {
  constructor() {
    this.ticker = 0;
    this.skip = 0;
    this.duration = 200;
    this.repeats = 0;
    this.callback = function() {};
    this.callback_arguments = {};
    this.chance = 1.0;
    this.every = 1.0;
    this.skipMin = -1;
    this.skipMax = -1;
    this.lockout = 0; //when > 0 cannot fire / locked;
  }

  Reset() {
    this.ticker = 0;
    return this;
  }

  NeverDie() {
    this.duration = Infinity;
    return this;
  }

  Callback(c, args) {
    this.callback = c;
    this.callback_arguments = args;
    return this;
  }

  Repeat(repeats) {
    this.repeats = repeats;
    return this;
  }

  Skip(min, max) {
    this.skipMin = min;
    this.skipMax = max;
    return this;
  }

  Duration(d) {
    this.duration = d;
    return this;
  }

  Lockout(l) {
    this.lockout = l;
    return this;
  }

  Every(millis) {
    if (millis >= 1)
      this.every = millis;
    return this;
  }

  Chance(c) {
    this.chance = c;
    return this;
  }

  hasChance() {
    return this.lockout <= 0 && Math.random() * 1.0 <= this.chance;
  }

  skipTime() {
    return this.ticker >= this.skipMin && this.ticker <= this.skipMax;
  }

  fire(callback) {

    this.lockout--;

    if (!this.hasChance())
      return;

    if (callback)
      this.callback = callback;

    if (this.ticker % this.every !== 0)
      return;

    if (this.repeat > 0 && this.ticker >= this.duration) {
      this.ticker = 0;
      this.repeat--;
    }

    if (this.ticker <= this.duration && !this.skipTime()) {
      this.callback(this.callback_arguments);
    }

    this.ticker += 1;
  }
}

Gamelab.FiringClock = FiringClock;