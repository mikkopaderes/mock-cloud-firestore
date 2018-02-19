const DocumentSnapshot = require('../document-snapshot');
const getOrSetDataNode = require('../../../utils/get-or-set-data-node');

class DocumentReference {
  constructor(id, data, parent) {
    this._id = id;
    this._data = data;
    this._parent = parent;
  }

  get id() {
    return this._id;
  }

  get parent() {
    return this._parent;
  }

  collection(id) {
    const CollectionReference = require('../collection-reference');
    const data = getOrSetDataNode(this._data, '__collection__', id);

    return new CollectionReference(id, data, this);
  }

  delete() {
    if (this._data) {
      this._data.__isDirty__ = false;
      this._data.__isDeleted__ = true;
    }

    return Promise.resolve();
  }

  get() {
    const documentSnapshot = new DocumentSnapshot(
      this._id,
      this._data,
      this
    );

    return Promise.resolve(documentSnapshot);
  }

  onSnapshot(onNext) {
    const documentSnapshot = new DocumentSnapshot(
      this._id,
      this._data,
      this
    );

    onNext(documentSnapshot);

    return () => {};
  }

  set(data, option = {}) {
    if (!option.merge) {
      for (const key in this._data) {
        if (
          Object.prototype.hasOwnProperty.call(this._data, key)
          && key !== '__collection__'
        ) {
          delete this['_data'][key];
        }
      }
    }

    Object.assign(this._data, data, { __isDirty__: false });

    return Promise.resolve();
  }

  update(data) {
    if (this._data.__isDirty__ || this._data.__isDeleted__) {
      throw new Error('Document doesn\'t exist');
    }

    Object.assign(this._data, data);

    return Promise.resolve();
  }
}

module.exports = DocumentReference;
