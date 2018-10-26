import { cleanPath, validatePath } from '../../utils/path';
import CollectionReference from './collection-reference';
import WriteBatch from './write-batch';
import getOrSetDataNode from '../../utils/get-or-set-data-node';
import validateReference from '../../utils/reference';

export default class Firestore {
  constructor(data, options) {
    this._data = data;
    this._options = options || {};
    this._listeners = [];
  }

  _dataChanged() {
    if (this._options.isNaiveSnapshotListenerEnabled) {
      const listeners = this._listeners.splice(0);
      setTimeout(() => listeners.forEach(listener => listener()), 10);
    }
  }

  _onSnapshot(listener) {
    if (this._options.isNaiveSnapshotListenerEnabled) {
      this._listeners.push(listener);
      return () => {
        if (this._listeners.indexOf(listener) > -1) {
          this._listeners.splice(this._listeners.indexOf(listener), 1);
        }
      };
    }

    return () => {};
  }

  batch() {
    return new WriteBatch();
  }

  collection(id) {
    return this._getReference(id, 'collection');
  }

  doc(id) {
    return this._getReference(id, 'doc');
  }

  settings(settings) {
    this._settings = settings;
  }

  _collection(id) {
    const data = getOrSetDataNode(this._data, '__collection__', id);

    return new CollectionReference(id, data, null, this);
  }

  _getReference(path, type) {
    validatePath(path);

    const cleanedPath = cleanPath(path);
    const nodes = cleanedPath.split('/');
    let ref = this;

    nodes.forEach((node, index) => {
      if (index % 2 === 0) {
        if (ref.batch) {
          ref = ref._collection(node);
        } else {
          ref = ref.collection(node);
        }
      } else {
        ref = ref.doc(node);
      }
    });

    validateReference(ref, type);

    return ref;
  }
}
