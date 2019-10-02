export default class TransactionWriteBatch {
  delete(ref) {
    return ref.delete();
  }

  set(ref, data, option = {}) {
    return ref.set(data, option);
  }

  update(ref, data) {
    return ref.update(data);
  }

  get(ref) {
    return ref.get();
  }

  getAll(...refs) {
    return Promise.all(refs.map(r => r.get()));
  }
}
