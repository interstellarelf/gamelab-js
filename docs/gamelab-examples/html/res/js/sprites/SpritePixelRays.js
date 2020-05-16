class SpritePixelRays {
  constructor() {

  }
  project(sprite, totalPoints = 90) {
    sprite.anime.init_colorMap();
    let map = sprite.anime.colorMap;
    console.info(map[0]);

    let sizeMax = sprite.size.x > sprite.size.y ? sprite.size.x : sprite.size.y;
    let rstep = 360 / totalPoints;
    let spriteCenter = sprite.position.add(sprite.size.div(2.0));

    map.sort(function(itemA, itemB) {
      var absDistA = Math.abs(spriteCenter.distance(itemA.position)),
        absDistB = Math.abs(spriteCenter.distance(itemB.position));
      return absDistA < absDistB ? 1 : -1;
    });

    map.hasPosition = function(position, distance) {
      for (var x = 0; x < this.length; x++) {
        if (Math.abs(position.distance(this[x].position)) <= distance)
          return true;
      }
      return false;
    };

    let lineCount = 0;

    for (var x = 0; x < totalPoints; x++) {

      var line = new Gamelab.Line2D().Size(sizeMax, sizeMax)
        .StepFunction(function(xval) {
          return xval;
        });

      line.Position(spriteCenter).Rotation(rstep * x, 0).Fill();

      var y = 0;

      while (y < line.points.length) {
        var point = line.points[y];
        if (!map.hasPosition(point.sub(sprite.position), 2.0)) {
          line.points.splice(y, 1);
        } else {
          ++y;
        }
      }

      lineCount += 1;
      gameWindow.add(line);
    }

  }
}
