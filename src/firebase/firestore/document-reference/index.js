import { buildPathFromReference, cleanPath, validatePath } from '../../../utils/path';
import CollectionReference from '../collection-reference';
import DocumentSnapshot from '../document-snapshot';
import getOrSetDataNode from '../../../utils/get-or-set-data-node';
import validateReference from '../../../utils/reference';

export default class DocumentReference {
  constructor(id, data, parent, firestore) {
    this._id = id;
    this._data = data;
    this._parent = parent;
    this._firestore = firestore;
  }

  get id() {
    return this._id;
  }

  get firestore() {
    return this._firestore;
  }

  get parent() {
    return this._parent;
  }

  collection(id) {
    return this._getCollectionReference(id);
  }

  delete() {
    if (this._data) {
      this._data.__isDirty__ = false;
      this._data.__isDeleted__ = true;
    }

    return Promise.resolve();
  }

  get() {
    const documentSnapshot = new DocumentSnapshot(this._id, this._data, this);

    return Promise.resolve(documentSnapshot);
  }

  onSnapshot(onNext) {
    const documentSnapshot = new DocumentSnapshot(this._id, this._data, this);

    setTimeout(() => onNext(documentSnapshot), 10);

    return () => {};
  }

  set(data, option = {}) {
    if (!option.merge) {
      Object.keys(this._data).forEach((key) => {
        if (key !== '__collection__') {
          delete this._data[key];
        }
      });
    }

    Object.assign(this._data, this._parseData(data), { __isDirty__: false });

    return Promise.resolve();
  }

  update(data) {
    if (this._data.__isDirty__ || this._data.__isDeleted__) {
      throw new Error('Document doesn\'t exist');
    }

    Object.assign(this._data, this._parseData(data));

    return Promise.resolve();
  }

  _collection(id) {
    const data = getOrSetDataNode(this._data, '__collection__', id);

    return new CollectionReference(id, data, this, this.firestore);
  }

  _getCollectionReference(path) {
    validatePath(path);

    const cleanedPath = cleanPath(path);
    const nodes = cleanedPath.split('/');
    let ref = this;

    nodes.forEach((node, index) => {
      if (index % 2 === 0) {
        ref = ref._collection(node);
      } else {
        ref = ref.doc(node);
      }
    });

    validateReference(ref, 'collection');

    return ref;
  }

  _parseData(newData) {
    const parsedData = Object.assign({}, newData);

    Object.keys(parsedData).forEach((key) => {
      if (parsedData[key]) {
        if (parsedData[key] instanceof DocumentReference) {
          parsedData[key] = buildPathFromReference(parsedData[key]);
        }

        if (
          typeof parsedData[key] === 'object'
          && Object.prototype.hasOwnProperty.call(parsedData[key], '_methodName')
        ) {
          const { _methodName: methodName } = parsedData[key];

          if (methodName === 'FieldValue.serverTimestamp') {
            parsedData[key] = new Date();
          } else if (methodName === 'FieldValue.arrayUnion') {
            parsedData[key] = this._processArrayUnion(key, parsedData[key]);
          } else if (methodName === 'FieldValue.arrayRemove') {
            parsedData[key] = this._processArrayRemove(key, parsedData[key]);
          } else if (methodName === 'FieldValue.delete') {
            delete parsedData[key];
            delete this._data[key];
          }
        }
      }
    });

    return parsedData;
  }

  _processArrayUnion(key, arrayUnion) {
    const newArray = [...this._data[key]];

    arrayUnion._elements.forEach((unionItem) => {
      if (!newArray.find(item => item === unionItem)) {
        newArray.push(unionItem);
      }
    });

    return newArray;
  }

  _processArrayRemove(key, arrayRemove) {
    let newArray = [...this._data[key]];

    arrayRemove._elements.forEach((unionItem) => {
      newArray = newArray.filter(item => item !== unionItem);
    });

    return newArray;
  }
}
