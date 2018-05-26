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