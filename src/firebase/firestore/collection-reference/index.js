const { querySnapshot } = require('../../../utils/query');
const DocumentReference = require('../document-reference');
const Query = require('../query');
const generateIdForRecord = require('../../../utils/generate-id-for-record');
const getOrSetDataNode = require('../../../utils/get-or-set-data-node');

class CollectionReference {
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

  async add(data) {
    const id = generateIdForRecord();
    const dataNode = getOrSetDataNode(this._data, '__doc__', id);
    const ref = new DocumentReference(id, dataNode, this);

    await ref.set(data);

    return ref;
  }

  doc(id) {
    if (!id) {
      id = generateIdForRecord();
    }

    const data = getOrSetDataNode(this._data, '__doc__', id);

    return new DocumentReference(id, data, this);
  }

  endAt(...args) {
    return new Query(this._data, this).endAt(...args);
  }

  endBefore(...args) {
    return new Query(this._data, this).endBefore(...args);
  }

  get() {
    return Promise.resolve(querySnapshot(this._data, this));
  }

  limit(...args) {
    return new Query(this._data, this).limit(...args);
  }

  onSnapshot(onNext) {
    onNext(querySnapshot(this._data, this));

    return () => {};
  }

  orderBy(...args) {
    return new Query(this._data, this).orderBy(...args);
  }

  startAfter(...args) {
    return new Query(this._data, this).startAfter(...args);
  }

  startAt(...args) {
    return new Query(this._data, this).startAt(...args);
  }

  where(...args) {
    return new Query(this._data, this).where(...args);
  }
}

module.exports = CollectionReference;
