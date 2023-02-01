var data = {
  getTree(list, item) {
    item.children = [];
    for (let i = list.length - 1; i >= 0; i--) {
      if (list[i].parent_id === item.id) {
        item.children.push(list[i]);
        list.splice(i, 1);
      }
    }
    item.children.reverse();
    for (let i = 0; i < item.children.length; i++) {
      this.getTree(list, item.children[i]);
    }
  },
  getTreeWithDepth(list, item, maxDepth, depth) {
    if (depth > maxDepth) return;
    item.children = [];
    for (let i = list.length - 1; i >= 0; i--) {
      if (list[i].parent_id === item.id) {
        item.children.push(list[i]);
        list.splice(i, 1);
      }
    }
    item.children.reverse();
    for (let i = 0; i < item.children.length; i++) {
      this.getTreeWithDepth(list, item.children[i], maxDepth, depth + 1);
    }
  }
};

module.exports = data;