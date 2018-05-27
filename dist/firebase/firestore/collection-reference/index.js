function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const { cleanPath, validatePath } = require('../../../utils/path');
const { querySnapshot } = require('../../../utils/query');
const { validateReference } = require('../../../utils/reference');
const DocumentReference = require('../document-reference');
const Query = require('../query');
const generateIdForRecord = require('../../../utils/generate-id-for-record');
const getOrSetDataNode = require('../../../utils/get-or-set-data-node');

class CollectionReference {
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

  add(data) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const id = generateIdForRecord();
      const dataNode = getOrSetDataNode(_this._data, '__doc__', id);
      const ref = new DocumentReference(id, dataNode, _this);

      yield ref.set(data);

      return ref;
    })();
  }

  doc(id = generateIdForRecord()) {
    return this._getDocumentReference(id);
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

  _doc(id) {
    const data = getOrSetDataNode(this._data, '__doc__', id);

    return new DocumentReference(id, data, this, this.firestore);
  }

  _getDocumentReference(path) {
    validatePath(path);

    const cleanedPath = cleanPath(path);
    const nodes = cleanedPath.split('/');
    let ref = this;

    nodes.forEach((node, index) => {
      if (index % 2 === 0) {
        ref = ref._doc(node);
      } else {
        ref = ref.collection(node);
      }
    });

    validateReference(ref);

    return ref;
  }
}

module.exports = CollectionReference;