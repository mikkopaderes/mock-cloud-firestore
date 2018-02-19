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

  forEach(callback) {
    for (const data of this._data) {
      callback(data);
    }
  }
}

module.exports = QuerySnapshot;
