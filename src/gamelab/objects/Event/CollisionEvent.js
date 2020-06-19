class CollisionEvent extends GSEvent {
  constructor(args = {}) {
    super(args);
  }

  /**
   * applies objects and siblings to be compared for the CollisionEvent instance
   * @memberof CollisionEvent
   * @param   {Array} objects the main-objects for collision processing
   * @param   {Array} siblings the comparable-objects for collision processing
   * @returns {CollisionEvent} the current instance of CollisionEvent, reference to 'this' keyword
   */

  OnCollision(objects, siblings) {
    this.objects = TypeCode.arrayWrap(objects || this.objects || []);
    this.siblings = TypeCode.arrayWrap(siblings || this.siblings || []);
    return this;
  }

  /**
   * applies a callback to be called whenever the onBool function returns true
   * @memberof CollisionEvent
   * @param   {callbackFunction} callbackFunction the function to be called --replaces the value of collisionEvent.callback

   * @returns {CollisionEvent} the current instance of CollisionEvent, reference to 'this' keyword
   */

  Call(callbackFunction) {
    this.callback = callbackFunction || this.callback || function() {};
    let $collision = this;
    this.objects.forEach(function($obj) {
      $obj.onUpdate(function() {
        var $sprite = this;
        $collision.siblings.forEach(function($sib) {
          if (Gamelab.Collision.spriteBoxCollide($sprite, $sib)) {
            $collision.callback($sprite, $sib);
          }
        });
      });
    });

    return this;
  }
};

Gamelab.CollisionEvent = CollisionEvent;
Gamelab.BoxCollisionEvent = CollisionEvent;