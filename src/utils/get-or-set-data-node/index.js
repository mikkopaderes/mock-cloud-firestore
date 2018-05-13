/* eslint no-param-reassign: 'off' */

function getOrSetDataNode(data = {}, path, id) {
  if (!Object.prototype.hasOwnProperty.call(data, path)) {
    data[path] = {};
  }

  if (!Object.prototype.hasOwnProperty.call(data[path], id)) {
    if (path === '__collection__') {
      data[path][id] = {};
    } else {
      data[path][id] = { __isDirty__: true };
    }
  }

  return data[path][id];
}

module.exports = getOrSetDataNode;
