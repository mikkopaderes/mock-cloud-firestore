import { isObject } from '../../../utils/parse-value';

export default class DocumentSnapshot {
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

  isReference(value) {
    return typeof value === 'string' && value.startsWith('__ref__:');
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
    this._normalizeData(data);
    return data;
  }

  _normalizeData(data) {
    const normalizedData = data;

    delete normalizedData.__isDirty__;
    delete normalizedData.__collection__;

    for (const key of Object.keys(data)) {
      normalizedData[key] = this._normalizeValue(data[key]);
    }

    return normalizedData;
  }

  _normalizeValue(value) {
    let normalizedValue = value;

    if (this.isReference(value)) {
      normalizedValue = this._buildRefFromPath(this.ref.firestore, value.replace('__ref__:', ''));
    } else if (value instanceof Date) {
      const date = value;
      normalizedValue = {
        toDate() {
          return date;
        },
      };
    } else if (value !== '__collection__' && isObject(value)) {
      normalizedValue = this._normalizeData(value);
    } else if (Array.isArray(value)) {
      normalizedValue = value.map(v => this._normalizeValue(v));
    }

    return normalizedValue;
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
