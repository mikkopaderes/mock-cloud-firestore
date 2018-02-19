function getOrSetDataNode(data = {}, path, id) {
  if (!data.hasOwnProperty(path)) {
    data[path] = {};
  }

  if (!data[path].hasOwnProperty(id)) {
    if (path === '__collection__') {
      data[path][id] = {};
    } else {
      data[path][id] = { __isDirty__: true };
    }
  }

  return data[path][id];
}

module.exports = getOrSetDataNode;
