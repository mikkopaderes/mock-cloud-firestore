'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('../../utils/path');

var _collectionReference = require('./collection-reference');

var _collectionReference2 = _interopRequireDefault(_collectionReference);

var _writeBatch = require('./write-batch');

var _writeBatch2 = _interopRequireDefault(_writeBatch);

var _getOrSetDataNode = require('../../utils/get-or-set-data-node');

var _getOrSetDataNode2 = _interopRequireDefault(_getOrSetDataNode);

var _reference = require('../../utils/reference');

var _reference2 = _interopRequireDefault(_reference);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Firestore {
  constructor(data) {
    this._data = data;
  }

  batch() {
    return new _writeBatch2.default();
  }

  collection(id) {
    return this._getReference(id, 'collection');
  }

  doc(id) {
    return this._getReference(id, 'doc');
  }

  settings(settings) {
    this._settings = settings;
  }

  _collection(id) {
    const data = (0, _getOrSetDataNode2.default)(this._data, '__collection__', id);

    return new _collectionReference2.default(id, data, null, this);
  }

  _getReference(path, type) {
    (0, _path.validatePath)(path);

    const cleanedPath = (0, _path.cleanPath)(path);
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

    (0, _reference2.default)(ref, type);

    return ref;
  }
}
exports.default = Firestore;
module.exports = exports['default'];