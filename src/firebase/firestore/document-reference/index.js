const { buildPathFromReference, cleanPath, validatePath } = require('../../../utils/path');
const { validateReference } = require('../../../utils/reference');
const DocumentSnapshot = require('../document-snapshot');
const getOrSetDataNode = require('../../../utils/get-or-set-data-node');

class DocumentReference {
  constructor(id, data, parent, firestore) {
    this._id = id;
    this._data = data;
    this._parent = parent;
    this._firestore = firestore;
  }

  get id() {
    return this._id;
  }

  get firestore() {
    return this._firestore;
  }

  get parent() {
    return this._parent;
  }

  collection(id) {
    return this._getCollectionReference(id);
  }

  delete() {
    if (this._data) {
      this._data.__isDirty__ = false;
      this._data.__isDeleted__ = true;
    }

    return Promise.resolve();
  }

  get() {
    const documentSnapshot = new DocumentSnapshot(this._id, this._data, this);

    return Promise.resolve(documentSnapshot);
  }

  onSnapshot(onNext) {
    const documentSnapshot = new DocumentSnapshot(this._id, this._data, this);

    onNext(documentSnapshot);

    return () => {};
  }

  set(data, option = {}) {
    if (!option.merge) {
      for (const key of Object.keys(this._data)) {
        if (key !== '__collection__') {
          delete this._data[key];
        }
      }
    }

    const parsedData = Object.assign({}, data);

    for (const field of Object.keys(parsedData)) {
      if (parsedData[field] instanceof DocumentReference) {
        parsedData[field] = buildPathFromReference(parsedData[field]);
      }
    }

    Object.assign(this._data, parsedData, { __isDirty__: false });

    return Promise.resolve();
  }

  update(data) {
    if (this._data.__isDirty__ || this._data.__isDeleted__) {
      throw new Error('Document doesn\'t exist');
    }

    const parsedData = Object.assign({}, data);

    for (const field of Object.keys(parsedData)) {
      if (parsedData[field] instanceof DocumentReference) {
        parsedData[field] = buildPathFromReference(parsedData[field]);
      }
    }

    Object.assign(this._data, parsedData);

    return Promise.resolve();
  }

  _collection(id) {
    // eslint-disable-next-line global-require
    const CollectionReference = require('../collection-reference');
    const data = getOrSetDataNode(this._data, '__collection__', id);

    return new CollectionReference(id, data, this, this.firestore);
  }

  _getCollectionReference(path) {
    validatePath(path);

    const cleanedPath = cleanPath(path);
    const nodes = cleanedPath.split('/');
    let ref = this;

    nodes.forEach((node, index) => {
      if (index % 2 === 0) {
        ref = ref._collection(node);
      } else {
        ref = ref.doc(node);
      }
    });

    validateReference(ref);

    return ref;
  }
}

module.exports = DocumentReference;
