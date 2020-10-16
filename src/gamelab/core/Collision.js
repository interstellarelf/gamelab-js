//http://www.blackpawn.com/texts/pointinpoly/
function pointInTriangle(point, triangle) {
  //compute vectors & dot products
  var cx = point.x,
    cy = point.y,
    t0 = triangle[0],
    t1 = triangle[1],
    t2 = triangle[2],
    v0x = t2.x - t0.x,
    v0y = t2.y - t0.y,
    v1x = t1.x - t0.x,
    v1y = t1.y - t0.y,
    v2x = cx - t0.x,
    v2y = cy - t0.y,
    dot00 = v0x * v0x + v0y * v0y,
    dot01 = v0x * v1x + v0y * v1y,
    dot02 = v0x * v2x + v0y * v2y,
    dot11 = v1x * v1x + v1y * v1y,
    dot12 = v1x * v2x + v1y * v2y

  // Compute barycentric coordinates
  var b = (dot00 * dot11 - dot01 * dot01),
    inv = b === 0 ? 0 : (1 / b),
    u = (dot11 * dot02 - dot01 * dot12) * inv,
    v = (dot00 * dot12 - dot01 * dot02) * inv
  return u >= 0 && v >= 0 && (u + v < 1)
};


let Collision = {

  /*Collide straight boxes no-rotate*/
  boxCollide(pos1, size1, pos2, size2) {
    return pos1.x >= pos2.x - size1.x &&
      pos1.x <= pos2.x + size2.x &&
      pos1.y >= pos2.y - size1.y &&
      pos1.y <= pos2.y + size2.y;
  },

  //determine if point is inside box / allows rotation
  pointInBox(point, box) {
    var triangles = Gamelab.Trig.getTrianglesByBox(box);
    box.collisionPoints = triangles;
    return pointInTriangle(point, triangles[0]) ||
      pointInTriangle(point, triangles[1]);
  },


  /* Collide objects with NO-rotation */
  spriteMouseCollide(obj1, obj2, gw) {

    gw = gw || Gamelab.game_windows[0];
    let scale = gw.scale || 1.0;
    if (gw.settings && gw.settings.hasOwnProperty(scale)) {
      scale = gw.settings.scale;
    }
    var camPos = new Gamelab.Vector(0, 0, 0);
    obj1.padding = obj1.padding || new Gamelab.Vector(0, 0, 0);

    let S = function(value) {
      return value * scale;
    };

    var paddingX = Math.round(obj1.padding.x * S(obj1.size.x)),
      paddingY = Math.round(obj1.padding.y * S(obj1.size.y)),
      left = S(obj1.position.x) + paddingX + camPos.x,
      right = S(obj1.position.x) + S(obj1.size.x) - paddingX + camPos.x,
      top = S(obj1.position.y) + camPos.y + paddingY,
      bottom = S(obj1.position.y) + S(obj1.size.y) - paddingY + camPos.y;
    if (right > obj2.position.x && left < obj2.position.x + obj2.size.x &&
      bottom > obj2.position.y && top < obj2.position.y + obj2.size.y) {
      return true;
    }
  },

  /* Collide Sprites NO-Rotation */
  spriteBoxCollide(obj1, obj2, gw) {
    gw = gw || Gamelab.game_windows[0];
    let scale = gw.scale || 1.0;
    var camPos = new Gamelab.Vector(0, 0, 0);
    obj1.padding = obj1.padding || new Gamelab.Vector(0, 0, 0);

    let S = function(value) {
      return value * scale;
    };

    var paddingX = Math.round(obj1.padding.x * S(obj1.size.x)),
      paddingY = Math.round(obj1.padding.y * S(obj1.size.y)),
      left = S(obj1.position.x) + paddingX + camPos.x,
      right = S(obj1.position.x) + S(obj1.size.x) - paddingX + camPos.x,
      top = S(obj1.position.y) + camPos.y + paddingY,
      bottom = S(obj1.position.y) + S(obj1.size.y) - paddingY + camPos.y;
    if (right > S(obj2.position.x) && left < S(obj2.position.x) + S(obj2.size.x) &&
      bottom > S(obj2.position.y) && top < S(obj2.position.y) + S(obj2.size.y)) {
      return true;
    }
  },


  //takes 2 arrays, returns array (empy array means no-collision)
  spriteCollideArray(obj1, obj2, gw) {

    var collisions = [],
      spritesX = obj1 instanceof Array ? obj1 : [obj1],
      spritesY = obj2 instanceof Array ? obj2 : [obj2];

    for (var x = 0; x < spritesX.length; x++) {
      for (var y = 0; y < spritesY.length; y++) {
        if (this.spriteCollide(spritesX[x], spritesY[y])) {
          collisions.push({
            object: spritesX[x],
            collider: spritesY[y]
          });
        }
      }
    }

    return collisions;
  },

  spriteCollideTop(obj1, obj2, gw) {
    gw = gw || Gamelab.game_windows[0];

    var camPos = new Gamelab.Vector(0, 0, 0);

    obj1.padding = obj1.padding || new Gamelab.Vector(0, 0, 0);

    var paddingX = Math.round(obj1.padding.x * obj1.size.x),

      paddingY = Math.round(obj1.padding.y * obj1.size.y),
      left = obj1.position.x + paddingX + camPos.x,

      right = obj1.position.x + obj1.size.x - paddingX + camPos.x,

      top = obj1.position.y + camPos.y + paddingY,
      bottom = obj1.position.y + obj1.size.y - paddingY + camPos.y;

    if (right > obj2.position.x && left < obj2.position.x + obj2.size.x &&
      bottom > obj2.position.y && top < obj2.position.y + obj2.size.y
    ) {
      return true;
    }
  },


  /*
   *
   *  ##Not known to be working -->> Below function
   *
   * */

  getSpatialGrid(sourceSprite, spatialDivider = 5.0) {
    if (sourceSprite.anime && sourceSprite.anime.getCurrentPixelMap) {
      let pixelGrid = sourceSprite.anime.getCurrentPixelMap(spatialDivider);
      return pixelGrid;
    } else {
      return [];
    }
  }
};


Gamelab.Collision = Collision;