const CollectionReference = require('./collection-reference');
const WriteBatch = require('./write-batch');
const getOrSetDataNode = require('../../utils/get-or-set-data-node');

class Firestore {
  constructor(data) {
    this._data = data;
  }

  batch() {
    return new WriteBatch();
  }

  collection(id) {
    const data = getOrSetDataNode(this._data, '__collection__', id);

    return new CollectionReference(id, data);
  }
}

module.exports = Firestore;
