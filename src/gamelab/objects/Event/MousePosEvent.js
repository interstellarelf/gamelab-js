class MousePosEvent {
  constructor(callback) {
    callback = callback || function(x, y) {};

    this.Callback(callback);
  }
  Callback(cb) {
    Gamelab.InputSystem.extend('mousepos', function(x, y) {
      cb(x, y);
    });
  }
};

Gamelab.MousePosEvent = MousePosEvent;