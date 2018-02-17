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
