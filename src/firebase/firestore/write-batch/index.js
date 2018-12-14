/* eslint no-await-in-loop: off */

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
        default:
          break;
      }
    }
  }

  delete(ref) {
    this._writeBatch.push({ type: 'delete', ref });
  }

  set(ref, data, option = {}) {
    this._writeBatch.push({
      ref,
      data,
      option,
      type: 'set',
    });
  }

  update(ref, data) {
    this._writeBatch.push({ type: 'update', ref, data });
  }
}
