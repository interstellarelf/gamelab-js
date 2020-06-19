class MouseLeftClickEvent {
  constructor(callback) {
    callback = callback || function(x, y) {};

    this.Callback(callback);
  }
  Callback(cb) {
    Gamelab.InputSystem.extend('leftclick', function(x, y) {
      cb(x, y);
    });
  }
};

Gamelab.MouseLeftClickEvent = MouseLeftClickEvent;