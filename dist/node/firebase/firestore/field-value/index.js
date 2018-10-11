'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
class FieldValue {
  arrayUnion(...args) {
    return {
      _methodName: 'FieldValue.arrayUnion',
      _elements: [...args]
    };
  }

  arrayRemove(...args) {
    return {
      _methodName: 'FieldValue.arrayRemove',
      _elements: [...args]
    };
  }

  serverTimestamp() {
    return { _methodName: 'FieldValue.serverTimestamp' };
  }
}
exports.default = FieldValue;
module.exports = exports['default'];