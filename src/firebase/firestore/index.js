const { cleanPath, validatePath } = require('../../utils/path');
const { validateReference } = require('../../utils/reference');
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
    return this._getReference(id);
  }

  doc(id) {
    return this._getReference(id);
  }

  settings(settings) {
    this._settings = settings;
  }

  _collection(id) {
    const data = getOrSetDataNode(this._data, '__collection__', id);

    return new CollectionReference(id, data, null, this);
  }

  _getReference(path) {
    validatePath(path);

    const cleanedPath = cleanPath(path);
    const nodes = cleanedPath.split('/');
    let ref = this;

    nodes.forEach((node, index) => {
      if (index % 2 === 0) {
        if (ref.batch) {
          ref = ref._collection(node);
        } else {
          ref = ref.collection(node);
        }
      } else {
        ref = ref.doc(node);
      }
    });

    validateReference(ref);

    return ref;
  }
}

module.exports = Firestore;
