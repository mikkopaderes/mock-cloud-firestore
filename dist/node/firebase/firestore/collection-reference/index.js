'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('../../../utils/path');

var _query = require('../../../utils/query');

var _documentReference = require('../document-reference');

var _documentReference2 = _interopRequireDefault(_documentReference);

var _query2 = require('../query');

var _query3 = _interopRequireDefault(_query2);

var _generateIdForRecord = require('../../../utils/generate-id-for-record');

var _generateIdForRecord2 = _interopRequireDefault(_generateIdForRecord);

var _getOrSetDataNode = require('../../../utils/get-or-set-data-node');

var _getOrSetDataNode2 = _interopRequireDefault(_getOrSetDataNode);

var _reference = require('../../../utils/reference');

var _reference2 = _interopRequireDefault(_reference);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

  async add(data) {
    const id = (0, _generateIdForRecord2.default)();
    const dataNode = (0, _getOrSetDataNode2.default)(this._data, '__doc__', id);
    const ref = new _documentReference2.default(id, dataNode, this, this._firestore);

    await ref.set(data);

    return ref;
  }

  doc(id = (0, _generateIdForRecord2.default)()) {
    return this._getDocumentReference(id);
  }

  endAt(...args) {
    return new _query3.default(this._data, this).endAt(...args);
  }

  endBefore(...args) {
    return new _query3.default(this._data, this).endBefore(...args);
  }

  get() {
    return Promise.resolve((0, _query.querySnapshot)(this._data, this));
  }

  limit(...args) {
    return new _query3.default(this._data, this).limit(...args);
  }

  onSnapshot(onNext) {
    setTimeout(() => onNext((0, _query.querySnapshot)(this._data, this)), 10);

    return this._firestore._onSnapshot(() => {
      onNext((0, _query.querySnapshot)(this._data, this));
    });
  }

  orderBy(...args) {
    return new _query3.default(this._data, this).orderBy(...args);
  }

  startAfter(...args) {
    return new _query3.default(this._data, this).startAfter(...args);
  }

  startAt(...args) {
    return new _query3.default(this._data, this).startAt(...args);
  }

  where(...args) {
    return new _query3.default(this._data, this).where(...args);
  }

  _doc(id) {
    const data = (0, _getOrSetDataNode2.default)(this._data, '__doc__', id);

    return new _documentReference2.default(id, data, this, this._firestore);
  }

  _getDocumentReference(path) {
    (0, _path.validatePath)(path);

    const cleanedPath = (0, _path.cleanPath)(path);
    const nodes = cleanedPath.split('/');
    let ref = this;

    nodes.forEach((node, index) => {
      if (index % 2 === 0) {
        ref = ref._doc(node);
      } else {
        ref = ref.collection(node);
      }
    });

    (0, _reference2.default)(ref, 'doc');

    return ref;
  }
}
exports.default = CollectionReference;
module.exports = exports['default'];