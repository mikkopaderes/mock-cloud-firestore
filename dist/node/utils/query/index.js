'use strict';

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

var _path = require('../path');

var _documentReference = require('../../firebase/firestore/document-reference');

var _documentReference2 = _interopRequireDefault(_documentReference);

var _documentSnapshot = require('../../firebase/firestore/document-snapshot');

var _documentSnapshot2 = _interopRequireDefault(_documentSnapshot);

var _querySnapshot = require('../../firebase/firestore/query-snapshot');

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