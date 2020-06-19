class GSEvent {
  constructor(args = {}) {}
}

Gamelab.GSEvent = GSEvent;
Gamelab.Event = GSEvent;

class GSEventLink {
  constructor(extendedObject, extendedKey, extendor, extendorKey) {
    this.parent_id = extendedObject.id,
      this.child_id = extendor.id,
      this.parent_key = extendedKey,
      this.child_key = extendorKey;
  }
};

Gamelab.GSEventLink = GSEventLink;
Gamelab.EventLink = GSEventLink;