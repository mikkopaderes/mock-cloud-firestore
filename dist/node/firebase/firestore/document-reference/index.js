'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('../../../utils/path');

var _collectionReference = require('../collection-reference');

var _collectionReference2 = _interopRequireDefault(_collectionReference);

var _documentSnapshot = require('../document-snapshot');

var _documentSnapshot2 = _interopRequireDefault(_documentSnapshot);

var _getOrSetDataNode = require('../../../utils/get-or-set-data-node');

var _getOrSetDataNode2 = _interopRequireDefault(_getOrSetDataNode);

var _reference = require('../../../utils/reference');

var _reference2 = _interopRequireDefault(_reference);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    const documentSnapshot = new _documentSnapshot2.default(this._id, this._data, this);

    return Promise.resolve(documentSnapshot);
  }

  onSnapshot(onNext) {
    const documentSnapshot = new _documentSnapshot2.default(this._id, this._data, this);

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
      if (parsedData[field]) {
        if (parsedData[field] instanceof DocumentReference) {
          parsedData[field] = (0, _path.buildPathFromReference)(parsedData[field]);
        }

        if (typeof parsedData[field] === 'object' && Object.prototype.hasOwnProperty.call(parsedData[field], 'methodName') && parsedData[field].methodName === 'FieldValue.serverTimestamp') {
          parsedData[field] = new Date();
        }
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
      if (parsedData[field]) {
        if (parsedData[field] instanceof DocumentReference) {
          parsedData[field] = (0, _path.buildPathFromReference)(parsedData[field]);
        }

        if (typeof parsedData[field] === 'object' && Object.prototype.hasOwnProperty.call(parsedData[field], 'methodName') && parsedData[field].methodName === 'FieldValue.serverTimestamp') {
          parsedData[field] = new Date();
        }
      }
    }

    Object.assign(this._data, parsedData);

    return Promise.resolve();
  }

  _collection(id) {
    const data = (0, _getOrSetDataNode2.default)(this._data, '__collection__', id);

    return new _collectionReference2.default(id, data, this, this.firestore);
  }

  _getCollectionReference(path) {
    (0, _path.validatePath)(path);

    const cleanedPath = (0, _path.cleanPath)(path);
    const nodes = cleanedPath.split('/');
    let ref = this;

    nodes.forEach((node, index) => {
      if (index % 2 === 0) {
        ref = ref._collection(node);
      } else {
        ref = ref.doc(node);
      }
    });

    (0, _reference2.default)(ref);

    return ref;
  }
}
exports.default = DocumentReference;
module.exports = exports['default'];