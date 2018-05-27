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
/***/ (function(module, exports) {

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

module.exports = { buildPathFromReference, cleanPath, validatePath };

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const { buildPathFromReference } = __webpack_require__(0);

function validateReference(ref, type) {
  const path = buildPathFromReference(ref).substr(8);
  const pathNodes = path.split('/');

  if (type === 'collection' && pathNodes.length % 2 !== 1) {
    throw new Error(`Invalid collection reference. Collection references must have an odd number of segments, but ${path} has ${pathNodes.length}`);
  } else if (type === 'doc' && pathNodes.length % 2 !== 0) {
    throw new Error(`Invalid document reference. Document references must have an even number of segments, but ${path} has ${pathNodes.length}`);
  }
}

module.exports = { validateReference };

/***/ }),
/* 2 */
/***/ (function(module, exports) {

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

module.exports = getOrSetDataNode;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const { cleanPath, validatePath } = __webpack_require__(0);
const { querySnapshot } = __webpack_require__(4);
const { validateReference } = __webpack_require__(1);
const DocumentReference = __webpack_require__(5);
const Query = __webpack_require__(12);
const generateIdForRecord = __webpack_require__(13);
const getOrSetDataNode = __webpack_require__(2);

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

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const { buildPathFromReference } = __webpack_require__(0);
const DocumentReference = __webpack_require__(5);
const DocumentSnapshot = __webpack_require__(6);
const QuerySnapshot = __webpack_require__(11);

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
      if (value instanceof DocumentReference) {
        return data[id][key] && data[id][key].startsWith('__ref__:') && data[id][key] === buildPathFromReference(value);
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
      const documentReference = new DocumentReference(key, documentRecord, collection, collection.firestore);
      const documentSnapshot = new DocumentSnapshot(key, documentRecord, documentReference);

      documentSnapshots.push(documentSnapshot);
    }
  }

  const snapshot = new QuerySnapshot(documentSnapshots);

  return snapshot;
}

module.exports = {
  endAt,
  endBefore,
  limit,
  orderBy,
  querySnapshot,
  startAfter,
  startAt,
  where
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const { buildPathFromReference, cleanPath, validatePath } = __webpack_require__(0);
const { validateReference } = __webpack_require__(1);
const DocumentSnapshot = __webpack_require__(6);
const getOrSetDataNode = __webpack_require__(2);

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
    const documentSnapshot = new DocumentSnapshot(this._id, this._data, this);

    return Promise.resolve(documentSnapshot);
  }

  onSnapshot(onNext) {
    const documentSnapshot = new DocumentSnapshot(this._id, this._data, this);

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
          parsedData[field] = buildPathFromReference(parsedData[field]);
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
          parsedData[field] = buildPathFromReference(parsedData[field]);
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
    // eslint-disable-next-line global-require
    const CollectionReference = __webpack_require__(3);
    const data = getOrSetDataNode(this._data, '__collection__', id);

    return new CollectionReference(id, data, this, this.firestore);
  }

  _getCollectionReference(path) {
    validatePath(path);

    const cleanedPath = cleanPath(path);
    const nodes = cleanedPath.split('/');
    let ref = this;

    nodes.forEach((node, index) => {
      if (index % 2 === 0) {
        ref = ref._collection(node);
      } else {
        ref = ref.doc(node);
      }
    });

    validateReference(ref);

    return ref;
  }
}

module.exports = DocumentReference;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

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

module.exports = DocumentSnapshot;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const MockFirebase = __webpack_require__(8);

module.exports = MockFirebase;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const FieldValue = __webpack_require__(9);
const Firestore = __webpack_require__(10);

class MockFirebase {
  constructor(data) {
    this._data = data;
    this.firestore.FieldValue = new FieldValue();
  }

  initializeApp() {
    return this;
  }

  firestore() {
    return new Firestore(this._data);
  }
}

module.exports = MockFirebase;

/***/ }),
/* 9 */
/***/ (function(module, exports) {

class FieldValue {
  serverTimestamp() {
    return new Date();
  }
}

module.exports = FieldValue;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

const { cleanPath, validatePath } = __webpack_require__(0);
const { validateReference } = __webpack_require__(1);
const CollectionReference = __webpack_require__(3);
const WriteBatch = __webpack_require__(14);
const getOrSetDataNode = __webpack_require__(2);

class Firestore {
  constructor(data) {
    this._data = data;
  }

  batch() {
    return new WriteBatch();
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
    const data = getOrSetDataNode(this._data, '__collection__', id);

    return new CollectionReference(id, data, null, this);
  }

  _getReference(path) {
    validatePath(path);

    const cleanedPath = cleanPath(path);
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

    validateReference(ref);

    return ref;
  }
}

module.exports = Firestore;

/***/ }),
/* 11 */
/***/ (function(module, exports) {

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

module.exports = QuerySnapshot;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

const {
  endAt,
  endBefore,
  limit,
  orderBy,
  querySnapshot,
  startAfter,
  startAt,
  where
} = __webpack_require__(4);

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

    this._data.__doc__ = endAt(this._data.__doc__, this._option.orderBy, value);
    this._option.endAt = value;

    return this;
  }

  endBefore(value) {
    if (!this._isOrdered()) {
      throw new Error('endBefore() queries requires orderBy()');
    }

    this._data.__doc__ = endBefore(this._data.__doc__, this._option.orderBy, value);
    this._option.endBefore = value;

    return this;
  }

  get() {
    return Promise.resolve(querySnapshot(this._data, this._collection));
  }

  limit(threshold) {
    this._data.__doc__ = limit(this._data.__doc__, threshold);
    this._option.limit = threshold;

    return this;
  }

  onSnapshot(onNext) {
    onNext(querySnapshot(this._data, this._collection));

    return () => {};
  }

  orderBy(key, order) {
    this._data.__doc__ = orderBy(this._data.__doc__, key, order);
    this._option.orderBy = key;

    return this;
  }

  startAfter(value) {
    if (!this._isOrdered()) {
      throw new Error('startAfter queries requires orderBy()');
    }

    this._data.__doc__ = startAfter(this._data.__doc__, this._option.orderBy, value);
    this._option.startAfter = value;

    return this;
  }

  startAt(value) {
    if (!this._isOrdered()) {
      throw new Error('startAt() queries requires orderBy()');
    }

    this._data.__doc__ = startAt(this._data.__doc__, this._option.orderBy, value);
    this._option.startAt = value;

    return this;
  }

  where(prop, operator, value) {
    this._data.__doc__ = where(this._data.__doc__, prop, operator, value);
    this._option.where = { prop: { operator, value } };

    return this;
  }

  _isOrdered() {
    return this._option.orderBy;
  }
}

module.exports = Query;

/***/ }),
/* 13 */
/***/ (function(module, exports) {

function generateIdForRecord() {
  return Math.random().toString(32).slice(2).substr(0, 5);
}

module.exports = generateIdForRecord;

/***/ }),
/* 14 */
/***/ (function(module, exports) {

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

module.exports = WriteBatch;

/***/ })
/******/ ]);