'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _query = require('../../../utils/query');

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
module.exports = exports['default'];