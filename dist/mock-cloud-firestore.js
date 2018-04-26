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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

function getOrSetDataNode(data = {}, path, id) {
  if (!data.hasOwnProperty(path)) {
    data[path] = {};
  }

  if (!data[path].hasOwnProperty(id)) {
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
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const { querySnapshot } = __webpack_require__(2);
const DocumentReference = __webpack_require__(3);
const Query = __webpack_require__(10);
const generateIdForRecord = __webpack_require__(11);
const getOrSetDataNode = __webpack_require__(0);

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

    return new DocumentReference(id, data, this, this.firestore);
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


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const DocumentReference = __webpack_require__(3);
const DocumentSnapshot = __webpack_require__(4);
const QuerySnapshot = __webpack_require__(9);

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
      } else {
        if (data[a][key] > data[b][key]) {
          return -1;
        } else if (data[a][key] < data[b][key]) {
          return 1;
        } else {
          return 0;
        }
      }
    });
  } else {
    ids = Object.keys(data).slice().sort((a, b) => {
      if (typeof data[a][key] === 'number') {
        return data[a][key] - data[b][key];
      } else {
        if (data[a][key] < data[b][key]) {
          return -1;
        } else if (data[a][key] > data[b][key]) {
          return 1;
        } else {
          return 0;
        }
      }
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
  const ids = Object.keys(data).filter((id) => {
    if (operator === '<') {
      return data[id][key] < value;
    } else if (operator === '<=') {
      return data[id][key] <= value;
    } else if (operator === '==') {
      if (value instanceof DocumentReference) {
        return (
          data[id][key]
          && data[id][key].startsWith('__ref__:')
          && data[id][key] === buildPathFromRef(value)
        );
      }

      return data[id][key] === value;
    } else if (operator === '>=') {
      return data[id][key] >= value;
    } else if (operator === '>') {
      return data[id][key] > value;
    }
  });

  for (const id of ids) {
    filteredData[id] = data[id];
  }

  return filteredData;
}

function querySnapshot(data, collection) {
  const documentSnapshots = [];

  if (data) {
    for (const key in data.__doc__) {
      if (data.__doc__.hasOwnProperty(key)) {
        const documentRecord = data['__doc__'][key];
        const documentReference = new DocumentReference(
          key,
          documentRecord,
          collection,
          collection.firestore
        );
        const documentSnapshot = new DocumentSnapshot(
          key,
          documentRecord,
          documentReference
        );

        documentSnapshots.push(documentSnapshot);
      }
    }
  }

  const querySnapshot = new QuerySnapshot(documentSnapshots);

  return querySnapshot;
}

function filterByCursor(data, prop, value, cursor) {
  const filteredData = {};
  const ids = Object.keys(data).filter((id) => {
    if (cursor === 'endAt') {
      return data[id][prop] <= value;
    } else if (cursor === 'endBefore') {
      return data[id][prop] < value;
    } else if (cursor === 'startAfter') {
      return data[id][prop] > value;
    } else if (cursor === 'startAt') {
      return data[id][prop] >= value;
    }
  });

  for (const id of ids) {
    filteredData[id] = data[id];
  }

  return filteredData;
}

function buildPathFromRef(ref) {
  let url = '';
  let currentRef = ref;
  let hasParentRef = true;

  while (hasParentRef) {
    url = `${currentRef.id}/${url}`;

    if (!currentRef.parent) {
      hasParentRef = false;
    }

    currentRef = currentRef.parent;
  }

  return `__ref__:${url.slice(0, -1)}`;
}

module.exports = {
  endAt,
  endBefore,
  limit,
  orderBy,
  querySnapshot,
  startAfter,
  startAt,
  where,
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const DocumentSnapshot = __webpack_require__(4);
const getOrSetDataNode = __webpack_require__(0);

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
    const CollectionReference = __webpack_require__(1);
    const data = getOrSetDataNode(this._data, '__collection__', id);

    return new CollectionReference(id, data, this, this.firestore);
  }

  delete() {
    if (this._data) {
      this._data.__isDirty__ = false;
      this._data.__isDeleted__ = true;
    }

    return Promise.resolve();
  }

  get() {
    const documentSnapshot = new DocumentSnapshot(
      this._id,
      this._data,
      this
    );

    return Promise.resolve(documentSnapshot);
  }

  onSnapshot(onNext) {
    const documentSnapshot = new DocumentSnapshot(
      this._id,
      this._data,
      this
    );

    onNext(documentSnapshot);

    return () => {};
  }

  set(data, option = {}) {
    if (!option.merge) {
      for (const key in this._data) {
        if (this._data.hasOwnProperty(key) && key !== '__collection__') {
          delete this['_data'][key];
        }
      }
    }

    Object.assign(this._data, data, { __isDirty__: false });

    return Promise.resolve();
  }

  update(data) {
    if (this._data.__isDirty__ || this._data.__isDeleted__) {
      throw new Error('Document doesn\'t exist');
    }

    Object.assign(this._data, data);

    return Promise.resolve();
  }
}

module.exports = DocumentReference;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

class DocumentSnapshot {
  constructor(id, data, ref) {
    this._id = id;
    this._data = data;
    this._ref = ref;
  }

  get exists() {
    const data = this._data;

    return data.__isDirty__ || data.__isDeleted__ ? false : true;
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
    } else {
      const keys = path.split('.');
      let data = this._getData();

      for (const key of keys) {
        if (data.hasOwnProperty(key)) {
          data = data[key];
        } else {
          data = undefined;
          break;
        }
      }

      return data;
    }
  }

  _getData() {
    const data = Object.assign({}, this._data);

    for (const key in data) {
      if (
        data.hasOwnProperty(key)
        && typeof data[key] === 'string'
        && data[key].startsWith('__ref__:')
      ) {
        data[key] = this._buildRefFromPath(
          this.ref.firestore,
          data[key].replace('__ref__:', '')
        );
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const MockFirebase = __webpack_require__(6);

module.exports = MockFirebase;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const FieldValue = __webpack_require__(7);
const Firestore = __webpack_require__(8);

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
/* 7 */
/***/ (function(module, exports) {

class FieldValue {
  serverTimestamp() {
    return new Date();
  }
}

module.exports = FieldValue;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const CollectionReference = __webpack_require__(1);
const WriteBatch = __webpack_require__(12);
const getOrSetDataNode = __webpack_require__(0);

class Firestore {
  constructor(data) {
    this._data = data;
  }

  batch() {
    return new WriteBatch();
  }

  collection(id) {
    const data = getOrSetDataNode(this._data, '__collection__', id);

    return new CollectionReference(id, data, null, this);
  }
}

module.exports = Firestore;


/***/ }),
/* 9 */
/***/ (function(module, exports) {

class QuerySnapshot {
  constructor(data) {
    this._data = data;
  }

  get docs() {
    return this._data;
  }

  get empty() {
    return this._data.length === 0 ? true : false;
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
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

const {
  endAt,
  endBefore,
  limit,
  orderBy,
  querySnapshot,
  startAfter,
  startAt,
  where,
} = __webpack_require__(2);

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

    this._data.__doc__ = endBefore(
      this._data.__doc__,
      this._option.orderBy,
      value
    );
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

    this._data.__doc__ = startAfter(
      this._data.__doc__,
      this._option.orderBy,
      value
    );
    this._option.startAfter = value;

    return this;
  }

  startAt(value) {
    if (!this._isOrdered()) {
      throw new Error('startAt() queries requires orderBy()');
    }

    this._data.__doc__ = startAt(
      this._data.__doc__,
      this._option.orderBy,
      value
    );
    this._option.startAt = value;

    return this;
  }

  where(prop, operator, value) {
    this._data.__doc__ = where(this._data.__doc__, prop, operator, value);
    this._option.where = { prop: { operator, value } };

    return this;
  }

  _isOrdered() {
    return this._option.orderBy ? true : false;
  }
}

module.exports = Query;


/***/ }),
/* 11 */
/***/ (function(module, exports) {

function generateIdForRecord() {
  return Math.random().toString(32).slice(2).substr(0, 5);
}

module.exports = generateIdForRecord;


/***/ }),
/* 12 */
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