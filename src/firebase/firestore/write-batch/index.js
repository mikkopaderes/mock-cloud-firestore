export default class WriteBatch {
  constructor() {
    this._writeBatch = [];
  }

  async commit() {
    for (const write of this._writeBatch) {
      switch (write.type) {
        case 'set':
          await write.ref.set(write.data, write.option);
          break;
        case 'update':
          await write.ref.update(write.data);
          break;
        case 'delete':
          await write.ref.delete();
          break;
      }
    }
  }

  delete(ref) {
    this._writeBatch.push({ type: 'delete', ref });
  }

  set(ref, data, option = {}) {
    this._writeBatch.push({ type: 'set', ref, data, option });
  }

  update(ref, data) {
    this._writeBatch.push({ type: 'update', ref, data });
  }
}
