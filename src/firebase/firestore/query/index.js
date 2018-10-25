import {
  endAt,
  endBefore,
  limit,
  orderBy,
  querySnapshot,
  startAfter,
  startAt,
  where,
} from '../../../utils/query';

export default class Query {
  constructor(data, collection) {
    this._data = data;
    this._collection = collection;
    this._option = {};
  }

  _querySnapshot() {
    const data = Object.assign({}, this._data);

    if (this._option.orderBy) {
      data.__doc__ = orderBy(
        data.__doc__,
        this._option.orderBy,
        this._option.orderByDirection,
      );
    }

    if (this._option.endAt) {
      data.__doc__ = endAt(
        data.__doc__,
        this._option.orderBy,
        this._option.endAt,
      );
    }

    if (this._option.endBefore) {
      data.__doc__ = endBefore(
        data.__doc__,
        this._option.orderBy,
        this._option.endBefore,
      );
    }

    if (this._option.limit) {
      data.__doc__ = limit(
        data.__doc__,
        this._option.limit,
      );
    }

    if (this._option.startAt) {
      data.__doc__ = startAt(
        data.__doc__,
        this._option.orderBy,
        this._option.startAt,
      );
    }

    if (this._option.startAfter) {
      data.__doc__ = startAfter(
        data.__doc__,
        this._option.orderBy,
        this._option.startAfter,
      );
    }

    if (this._option.where) {
      Object.keys(this._option.where).forEach((prop) => {
        const { operator, value } = this._option.where[prop];
        data.__doc__ = where(
          data.__doc__,
          prop,
          operator,
          value,
        );
      });
    }

    return data;
  }

  get firestore() {
    return this._collection.firestore;
  }

  endAt(value) {
    if (!this._isOrdered()) {
      throw new Error('endAt() queries requires orderBy()');
    }

    this._option.endAt = value;

    return this;
  }

  endBefore(value) {
    if (!this._isOrdered()) {
      throw new Error('endBefore() queries requires orderBy()');
    }

    this._option.endBefore = value;

    return this;
  }

  get() {
    return Promise.resolve(querySnapshot(this._querySnapshot(), this._collection));
  }

  limit(threshold) {
    this._option.limit = threshold;
    return this;
  }

  onSnapshot(onNext) {
    setTimeout(() => onNext(querySnapshot(this._querySnapshot(), this._collection)), 10);

    return this.firestore._onSnapshot(() => {
      onNext(querySnapshot(this._querySnapshot(), this._collection));
    });
  }

  orderBy(key, order) {
    this._option.orderBy = key;
    this._option.orderByDirection = order;

    return this;
  }

  startAfter(value) {
    if (!this._isOrdered()) {
      throw new Error('startAfter queries requires orderBy()');
    }

    this._option.startAfter = value;

    return this;
  }

  startAt(value) {
    if (!this._isOrdered()) {
      throw new Error('startAt() queries requires orderBy()');
    }

    this._option.startAt = value;

    return this;
  }

  where(prop, operator, value) {
    this._option.where = { [prop]: { operator, value } };
    return this;
  }

  _isOrdered() {
    return this._option.orderBy;
  }
}
