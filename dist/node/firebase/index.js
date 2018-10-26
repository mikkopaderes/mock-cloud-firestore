'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fieldValue = require('./firestore/field-value');

var _fieldValue2 = _interopRequireDefault(_fieldValue);

var _firestore = require('./firestore');

var _firestore2 = _interopRequireDefault(_firestore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class MockFirebase {
  constructor(data, options) {
    this._data = data;
    this._options = options;
    this.firestore.FieldValue = new _fieldValue2.default();
  }

  initializeApp() {
    return this;
  }

  firestore() {
    return new _firestore2.default(this._data, this._options);
  }
}
exports.default = MockFirebase;
module.exports = exports['default'];