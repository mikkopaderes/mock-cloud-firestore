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
    this._operations = [];
  }

  _querySnapshot() {
    const data = Object.assign({}, this._data);

    this._operations.forEach((operation) => {
      if (operation.type === 'orderBy') {
        data.__doc__ = orderBy(data.__doc__ || {}, operation.param.key, operation.param.sorting);
      }

      if (operation.type === 'startAt') {
        data.__doc__ = startAt(data.__doc__, operation.param.order.key, operation.param.value);
      }

      if (operation.type === 'startAfter') {
        data.__doc__ = startAfter(data.__doc__, operation.param.order.key, operation.param.value);
      }

      if (operation.type === 'endAt') {
        data.__doc__ = endAt(data.__doc__, operation.param.order.key, operation.param.value);
      }

      if (operation.type === 'endBefore') {
        data.__doc__ = endBefore(data.__doc__, operation.param.order.key, operation.param.value);
      }

      if (operation.type === 'limit') {
        data.__doc__ = limit(data.__doc__, operation.param.value);
      }

      if (operation.type === 'where') {
        data.__doc__ = where(
          data.__doc__,
          operation.param.key,
          operation.param.operator,
          operation.param.value,
        );
      }
    });

    return data;
  }

  get firestore() {
    return this._collection.firestore;
  }

  endAt(value) {
    const order = this._getOrder();

    if (!order) {
      throw new Error('endAt() queries requires orderBy()');
    }

    this._operations.push({
      type: 'endAt',
      param: { value, order },
    });

    return this;
  }

  endBefore(value) {
    const order = this._getOrder();

    if (!order) {
      throw new Error('endBefore() queries requires orderBy()');
    }

    this._operations.push({
      type: 'endBefore',
      param: { value, order },
    });

    return this;
  }

  get() {
    return Promise.resolve(querySnapshot(this._querySnapshot(), this._collection));
  }

  limit(value) {
    this._operations.push({
      type: 'limit',
      param: { value },
    });

    return this;
  }

  onSnapshot(onNext) {
    setTimeout(() => onNext(querySnapshot(this._querySnapshot(), this._collection)), 10);

    return this.firestore._onSnapshot(() => {
      onNext(querySnapshot(this._querySnapshot(), this._collection));
    });
  }

  orderBy(key, sorting) {
    this._operations.push({
      type: 'orderBy',
      param: { key, sorting },
    });

    return this;
  }

  startAfter(value) {
    const order = this._getOrder();

    if (!order) {
      throw new Error('startAfter() queries requires orderBy()');
    }

    this._operations.push({
      type: 'startAfter',
      param: { value, order },
    });

    return this;
  }

  startAt(value) {
    const order = this._getOrder();

    if (!order) {
      throw new Error('startAt() queries requires orderBy()');
    }

    this._operations.push({
      type: 'startAt',
      param: { value, order },
    });

    return this;
  }

  where(key, operator, value) {
    this._operations.push({
      type: 'where',
      param: { key, operator, value },
    });

    return this;
  }

  _getOrder() {
    return this._operations.find(operation => operation.type === 'orderBy').param;
  }
}
