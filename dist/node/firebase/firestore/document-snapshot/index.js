'use strict';

(Object.defineProperty(exports, "__esModule", {
  value: true
}), function _objectEntries(obj) {
  var entries = [];
  var keys = Object.keys(obj);

  for (var k = 0; k < keys.length; ++k) entries.push([keys[k], obj[keys[k]]]);

  return entries;
})
class DocumentSnapshot {
  constructor(id, data, ref) {
    this._id = id;
    this._data = data;
    this._ref = ref;
  }

  get exists() {
    const data = this._data;

    return !(data.__isDirty__ || data.__isDeleted__);
  }

  get id() {
    return this._id;
  }

  get ref() {
    return this._ref;
  }

  data() {
    return this.exists ? this._getData() : undefined;
  }

  get(path) {
    if (!this.exists) {
      return undefined;
    }
    const keys = path.split('.');
    let data = this._getData();

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        const key = _step.value;

        if (Object.prototype.hasOwnProperty.call(data, key)) {
          data = data[key];
        } else {
          data = undefined;
          break;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return data;
  }

  _getData() {
    const data = this._traverseObject(Object.assign({}, this._data));

    delete data.__isDirty__;
    delete data.__collection__;

    return data;
  }

  _traverseObject(o) {
    if (typeof o === 'string') {
      if (o.startsWith('__ref__:')) {
        return this._buildRefFromPath(this.ref.firestore, o.replace('__ref__:', ''));
      }
      return o;
    } else if (typeof o === 'object' && o !== null) {
      if (o.constructor === Object) {
        return _objectEntries(o).reduce((accumulator, [key, value]) => {
          if (key === '__collection__' || key === '__doc__') {
            return Object.assign({}, accumulator, this._traverseObject.call(this, value));
          } else {
            return Object.assign({}, accumulator, {
              [key]: this._traverseObject.call(this, value)
            });
          }
        }, {});
      } else if (o.constructor === Array) {
        return o.map(this._traverseObject.bind(this));
      } else if (o.constructor === Date) {
        return {
          toDate() {
            return o;
          }
        };
      }
    }
    return o;
  }

  _buildRefFromPath(db, path) {
    const nodes = path.split('/');
    let ref = db;

    nodes.forEach((node, index) => {
      if (node) {
        if (index % 2 === 0) {
          ref = ref.collection(node);
        } else {
          ref = ref.doc(node);
        }
      }
    });

    return ref;
  }
}
exports.default = DocumentSnapshot;
module.exports = exports['default'];