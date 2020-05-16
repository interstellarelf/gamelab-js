/*UniqueList : store only unique array items*/
let UniqueList = (list) => {
  list.addUnique = function(i) {
    if (this.indexOf(i) == -1) {
      this.push(i)
    }
  };
  return list;
};

let GameData = {
  applyParentAndChildRelationship(parent, child, trackBy) {
    parent.children = parent.children || [];
    parent.children = UniqueList(parent.children);
    child.parent = parent;
    parent.children.addUnique(child);
  }
};


Gamelab.GameData = GameData;