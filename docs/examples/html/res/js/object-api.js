

class ObjectApi {
  constructor(object, siblings) {
    this.object = object;
    this.siblings = siblings;
  }
  load(url, callback) {
    var $api = this;
    new Gamelab.Module().load(url, function(lib){
        var instance = new lib();
        callback();
    });
  }
}
