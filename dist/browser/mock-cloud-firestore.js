var MockFirebase =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildPathFromReference = buildPathFromReference;
exports.cleanPath = cleanPath;
exports.validatePath = validatePath;
function buildPathFromReference(ref) {
  let url = '';
  let currentRef = ref;
  let hasParentRef = true;

  while (hasParentRef) {
    if (currentRef.id) {
      url = `${currentRef.id}/${url}`;

      if (!currentRef.parent) {
        hasParentRef = false;
      }

      currentRef = currentRef.parent;
    } else {
      break;
    }
  }

  return `__ref__:${url.slice(0, -1)}`;
}

function cleanPath(path) {
  if (path.startsWith('/')) {
    // Remove staring slash
    return path.substr(1);
  }

  return path;
}

function validatePath(path) {
  if (path.includes('//')) {
    throw new Error(`Invalid path (${path}). Paths must not contain // in them.`);
  }
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getOrSetDataNode;
/* eslint no-param-reassign: 'off' */

function getOrSetDataNode(data = {}, path, id) {
  if (!Object.prototype.hasOwnProperty.call(data, path)) {
    data[path] = {};
  }

  if (!Object.prototype.hasOwnProperty.call(data[path], id)) {
    if (path === '__collection__') {
      data[path][id] = {};
    } else {
      data[path][id] = { __isDirty__: true };
    }
  }

  return data[path][id];
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = validateReference;

var _path = __webpack_require__(0);

function validateReference(ref, type) {
  const path = (0, _path.buildPathFromReference)(ref).substr(8);
  const pathNodes = path.split('/');

  if (type === 'collection' && pathNodes.length % 2 !== 1) {
    throw new Error(`Invalid collection reference. Collection references must have an odd number of segments, but ${path} has ${pathNodes.length}`);
  } else if (type === 'doc' && pathNodes.length % 2 !== 0) {
    throw new Error(`Invalid document reference. Document references must have an even number of segments, but ${path} has ${pathNodes.length}`);
  }
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = __webpack_require__(0);

var _query = __webpack_require__(4);

var _documentReference = __webpack_require__(5);

var _documentReference2 = _interopRequireDefault(_documentReference);

var _query2 = __webpack_require__(12);

var _query3 = _interopRequireDefault(_query2);

var _generateIdForRecord = __webpack_require__(13);

var _generateIdForRecord2 = _interopRequireDefault(_generateIdForRecord);

var _getOrSetDataNode = __webpack_require__(1);

var _getOrSetDataNode2 = _interopRequireDefault(_getOrSetDataNode);

var _reference = __webpack_require__(2);

var _reference2 = _interopRequireDefault(_reference);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

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
      const id = (0, _generateIdForRecord2.default)();
      const dataNode = (0, _getOrSetDataNode2.default)(_this._data, '__doc__', id);
      const ref = new _documentReference2.default(id, dataNode, _this);

      yield ref.set(data);

      return ref;
    })();
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
    onNext((0, _query.querySnapshot)(this._data, this));

    return () => {};
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

    return new _documentReference2.default(id, data, this, this.firestore);
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

    (0, _reference2.default)(ref);

    return ref;
  }
}
exports.default = CollectionReference;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.endAt = endAt;
exports.endBefore = endBefore;
exports.limit = limit;
exports.orderBy = orderBy;
exports.startAfter = startAfter;
exports.startAt = startAt;
exports.where = where;
exports.querySnapshot = querySnapshot;

var _path = __webpack_require__(0);

var _documentReference = __webpack_require__(5);

var _documentReference2 = _interopRequireDefault(_documentReference);

var _documentSnapshot = __webpack_require__(6);

var _documentSnapshot2 = _interopRequireDefault(_documentSnapshot);

var _querySnapshot = __webpack_require__(11);

var _querySnapshot2 = _interopRequireDefault(_querySnapshot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function filterByCursor(data, prop, value, cursor) {
  const filteredData = {};
  const ids = Object.keys(data).filter(id => {
    if (cursor === 'endAt') {
      return data[id][prop] <= value;
    } else if (cursor === 'endBefore') {
      return data[id][prop] < value;
    } else if (cursor === 'startAfter') {
      return data[id][prop] > value;
    }

    return data[id][prop] >= value;
  });

  for (const id of ids) {
    filteredData[id] = data[id];
  }

  return filteredData;
}

function endAt(data, prop, value) {
  return filterByCursor(data, prop, value, 'endAt');
}

function endBefore(data, prop, value) {
  return filterByCursor(data, prop, value, 'endBefore');
}

function limit(data, threshold) {
  const filteredData = {};
  const ids = Object.keys(data).slice(0, threshold);

  for (const id of ids) {
    filteredData[id] = data[id];
  }

  return filteredData;
}

function orderBy(data, key, order) {
  const filteredData = {};
  let ids;

  if (order === 'desc') {
    ids = Object.keys(data).slice().sort((a, b) => {
      if (typeof data[a][key] === 'number') {
        return data[b][key] - data[a][key];
      }
      if (data[a][key] > data[b][key]) {
        return -1;
      } else if (data[a][key] < data[b][key]) {
        return 1;
      }

      return 0;
    });
  } else {
    ids = Object.keys(data).slice().sort((a, b) => {
      if (typeof data[a][key] === 'number') {
        return data[a][key] - data[b][key];
      }
      if (data[a][key] < data[b][key]) {
        return -1;
      } else if (data[a][key] > data[b][key]) {
        return 1;
      }

      return 0;
    });
  }

  for (const id of ids) {
    filteredData[id] = data[id];
  }

  return filteredData;
}

function startAfter(data, prop, value) {
  return filterByCursor(data, prop, value, 'startAfter');
}

function startAt(data, prop, value) {
  return filterByCursor(data, prop, value, 'startAt');
}

function where(data = {}, key, operator, value) {
  const filteredData = {};
  const ids = Object.keys(data).filter(id => {
    if (operator === '<') {
      return data[id][key] < value;
    } else if (operator === '<=') {
      return data[id][key] <= value;
    } else if (operator === '==') {
      if (value instanceof _documentReference2.default) {
        return data[id][key] && data[id][key].startsWith('__ref__:') && data[id][key] === (0, _path.buildPathFromReference)(value);
      }

      return data[id][key] === value;
    } else if (operator === '>=') {
      return data[id][key] >= value;
    }

    return data[id][key] > value;
  });

  for (const id of ids) {
    filteredData[id] = data[id];
  }

  return filteredData;
}

function querySnapshot(data, collection) {
  const documentSnapshots = [];

  if (data && Object.prototype.hasOwnProperty.call(data, '__doc__')) {
    for (const key of Object.keys(data.__doc__)) {
      const documentRecord = data.__doc__[key];
      const documentReference = new _documentReference2.default(key, documentRecord, collection, collection.firestore);
      const documentSnapshot = new _documentSnapshot2.default(key, documentRecord, documentReference);

      documentSnapshots.push(documentSnapshot);
    }
  }

  const snapshot = new _querySnapshot2.default(documentSnapshots);

  return snapshot;
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = __webpack_require__(0);

var _collectionReference = __webpack_require__(3);

var _collectionReference2 = _interopRequireDefault(_collectionReference);

var _documentSnapshot = __webpack_require__(6);

var _documentSnapshot2 = _interopRequireDefault(_documentSnapshot);

var _getOrSetDataNode = __webpack_require__(1);

var _getOrSetDataNode2 = _interopRequireDefault(_getOrSetDataNode);

var _reference = __webpack_require__(2);

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

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
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

    for (const key of keys) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        data = data[key];
      } else {
        data = undefined;
        break;
      }
    }

    return data;
  }

  _getData() {
    const data = Object.assign({}, this._data);

    for (const key of Object.keys(data)) {
      if (typeof data[key] === 'string' && data[key].startsWith('__ref__:')) {
        data[key] = this._buildRefFromPath(this.ref.firestore, data[key].replace('__ref__:', ''));
      } else if (data[key] instanceof Date) {
        const date = data[key];

        data[key] = {
          toDate() {
            return date;
          }
        };
      }
    }

    delete data.__isDirty__;
    delete data.__collection__;

    return data;
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

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _firebase = __webpack_require__(8);

var _firebase2 = _interopRequireDefault(_firebase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _firebase2.default;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fieldValue = __webpack_require__(9);

var _fieldValue2 = _interopRequireDefault(_fieldValue);

var _firestore = __webpack_require__(10);

var _firestore2 = _interopRequireDefault(_firestore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class MockFirebase {
  constructor(data) {
    this._data = data;
    this.firestore.FieldValue = new _fieldValue2.default();
  }

  initializeApp() {
    return this;
  }

  firestore() {
    return new _firestore2.default(this._data);
  }
}
exports.default = MockFirebase;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
class FieldValue {
  serverTimestamp() {
    return new Date();
  }
}
exports.default = FieldValue;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = __webpack_require__(0);

var _collectionReference = __webpack_require__(3);

var _collectionReference2 = _interopRequireDefault(_collectionReference);

var _writeBatch = __webpack_require__(14);

var _writeBatch2 = _interopRequireDefault(_writeBatch);

var _getOrSetDataNode = __webpack_require__(1);

var _getOrSetDataNode2 = _interopRequireDefault(_getOrSetDataNode);

var _reference = __webpack_require__(2);

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
    return this._getReference(id);
  }

  doc(id) {
    return this._getReference(id);
  }

  settings(settings) {
    this._settings = settings;
  }

  _collection(id) {
    const data = (0, _getOrSetDataNode2.default)(this._data, '__collection__', id);

    return new _collectionReference2.default(id, data, null, this);
  }

  _getReference(path) {
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

    (0, _reference2.default)(ref);

    return ref;
  }
}
exports.default = Firestore;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
class QuerySnapshot {
  constructor(data) {
    this._data = data;
  }

  get docs() {
    return this._data;
  }

  get empty() {
    return this._data.length === 0;
  }

  get size() {
    return this._data.length;
  }

  forEach(callback) {
    for (const data of this._data) {
      callback(data);
    }
  }
}
exports.default = QuerySnapshot;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _query = __webpack_require__(4);

class Query {
  constructor(data, collection) {
    this._data = Object.assign({}, data);
    this._collection = collection;
    this._option = {};
  }

  get firestore() {
    return this._collection.firestore;
  }

  endAt(value) {
    if (!this._isOrdered()) {
      throw new Error('endAt() queries requires orderBy()');
    }

    this._data.__doc__ = (0, _query.endAt)(this._data.__doc__, this._option.orderBy, value);
    this._option.endAt = value;

    return this;
  }

  endBefore(value) {
    if (!this._isOrdered()) {
      throw new Error('endBefore() queries requires orderBy()');
    }

    this._data.__doc__ = (0, _query.endBefore)(this._data.__doc__, this._option.orderBy, value);
    this._option.endBefore = value;

    return this;
  }

  get() {
    return Promise.resolve((0, _query.querySnapshot)(this._data, this._collection));
  }

  limit(threshold) {
    this._data.__doc__ = (0, _query.limit)(this._data.__doc__, threshold);
    this._option.limit = threshold;

    return this;
  }

  onSnapshot(onNext) {
    onNext((0, _query.querySnapshot)(this._data, this._collection));

    return () => {};
  }

  orderBy(key, order) {
    this._data.__doc__ = (0, _query.orderBy)(this._data.__doc__, key, order);
    this._option.orderBy = key;

    return this;
  }

  startAfter(value) {
    if (!this._isOrdered()) {
      throw new Error('startAfter queries requires orderBy()');
    }

    this._data.__doc__ = (0, _query.startAfter)(this._data.__doc__, this._option.orderBy, value);
    this._option.startAfter = value;

    return this;
  }

  startAt(value) {
    if (!this._isOrdered()) {
      throw new Error('startAt() queries requires orderBy()');
    }

    this._data.__doc__ = (0, _query.startAt)(this._data.__doc__, this._option.orderBy, value);
    this._option.startAt = value;

    return this;
  }

  where(prop, operator, value) {
    this._data.__doc__ = (0, _query.where)(this._data.__doc__, prop, operator, value);
    this._option.where = { prop: { operator, value } };

    return this;
  }

  _isOrdered() {
    return this._option.orderBy;
  }
}
exports.default = Query;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = generateIdForRecord;
function generateIdForRecord() {
  return Math.random().toString(32).slice(2).substr(0, 5);
}

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
class WriteBatch {
  constructor() {
    this._writeBatch = { delete: [], set: [], update: [] };
  }

  commit() {
    for (const write of this._writeBatch.set) {
      write.ref.set(write.data, write.option);
    }

    for (const write of this._writeBatch.update) {
      write.ref.update(write.data);
    }

    for (const ref of this._writeBatch.delete) {
      ref.delete();
    }

    return Promise.resolve();
  }

  delete(ref) {
    this._writeBatch.delete.push(ref);
  }

  set(ref, data, option = {}) {
    this._writeBatch.set.push({ ref, data, option });
  }

  update(ref, data) {
    this._writeBatch.update.push({ ref, data });
  }
}
exports.default = WriteBatch;

/***/ })
/******/ ]);