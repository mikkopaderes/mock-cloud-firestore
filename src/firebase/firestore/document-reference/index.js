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

    return this._firestore._onSnapshot(() => {
      onNext(documentSnapshot);
    });
  }

  set(data, option = {}) {
    if (!option.merge) {
      Object.keys(this._data).forEach((key) => {
        if (key !== '__collection__') {
          delete this._data[key];
        }
      });
    }

    Object.assign(this._data, this._parseDataForSet(data, option), { __isDirty__: false });

    Object.keys(this._data).forEach((key) => {
      if (this._data[key] === undefined) {
        delete this._data[key];
      }
    });

    this._firestore._dataChanged();

    return Promise.resolve();
  }

  update(data) {
    if (this._data.__isDirty__ || this._data.__isDeleted__) {
      throw new Error('Document doesn\'t exist');
    }

    Object.assign(this._data, this._parseDataForUpdate(data));

    Object.keys(this._data).forEach((key) => {
      if (this._data[key] === undefined) {
        delete this._data[key];
      }
    });

    this._firestore._dataChanged();

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

  _processArrayUnion(arrayUnion, oldArray = []) {
    const newArray = [...oldArray];

    arrayUnion._elements.forEach((unionItem) => {
      if (!newArray.find(item => item === unionItem)) {
        newArray.push(unionItem);
      }
    });

    return newArray;
  }

  _processArrayRemove(arrayRemove, oldArray = []) {
    let newArray = [...oldArray];

    arrayRemove._elements.forEach((unionItem) => {
      newArray = newArray.filter(item => item !== unionItem);
    });

    return newArray;
  }

  _parseValue(newValue, oldValue) {
    let parsedValue = newValue;

    if (newValue instanceof DocumentReference) {
      parsedValue = buildPathFromReference(newValue);
    } else if (
      typeof newValue === 'object'
      && newValue !== null
      && Object.prototype.hasOwnProperty.call(newValue, '_methodName')
    ) {
      const { _methodName: methodName } = newValue;

      if (methodName === 'FieldValue.serverTimestamp') {
        parsedValue = new Date();
      } else if (methodName === 'FieldValue.arrayUnion') {
        parsedValue = this._processArrayUnion(newValue, oldValue);
      } else if (methodName === 'FieldValue.arrayRemove') {
        parsedValue = this._processArrayRemove(newValue, oldValue);
      } else if (methodName === 'FieldValue.delete') {
        parsedValue = undefined;
      }
    }

    return parsedValue;
  }

  _processNestedField(keys, value, currentData) {
    let currentNewDataNode = {};
    let currentOldDataNode;
    let rootDataNode;

    keys.forEach((key, index) => {
      if (index === 0) {
        currentNewDataNode[key] = currentData[key] || {};
        currentNewDataNode = currentNewDataNode[key];
        currentOldDataNode = currentData[key] || {};
        rootDataNode = currentNewDataNode;
      } else if (index < keys.length - 1) {
        currentNewDataNode[key] = currentOldDataNode[key] || {};
        currentNewDataNode = currentNewDataNode[key];
        currentOldDataNode = currentOldDataNode[key] || {};
      } else {
        const newValue = this._parseValue(value, currentOldDataNode[key]);

        if (newValue === undefined) {
          delete currentNewDataNode[key];
        } else {
          currentNewDataNode[key] = newValue;
        }
      }
    });

    return rootDataNode;
  }

  _parseDataForSet(newData, option) {
    const parsedData = Object.assign({}, this._data);

    Object.keys(newData).forEach((key) => {
      if (newData[key] === undefined) {
        throw new Error(`Error: Function DocumentReference.set() called with invalid data. Unsupported field value: undefined (found in field ${key})`);
      } else if (
        typeof newData[key] === 'object'
        && newData[key] !== null
        && Object.prototype.hasOwnProperty.call(newData[key], '_methodName')
        && newData[key]._methodName === 'FieldValue.delete'
        && !option.merge
      ) {
        throw new Error(`Error: Function DocumentReference.set() called with invalid data. FieldValue.delete() cannot be used with set() unless you pass {merge:true} (found in field ${key})`);
      }

      parsedData[key] = this._parseValue(newData[key], parsedData[key]);
    });

    return parsedData;
  }

  _parseDataForUpdate(newData) {
    const parsedData = Object.assign({}, this._data);

    Object.keys(newData).forEach((key) => {
      if (newData[key] === undefined) {
        throw new Error(`Error: Function DocumentReference.update() called with invalid data. Unsupported field value: undefined (found in field ${key})`);
      }

      const keyNodes = key.split('.');

      if (keyNodes.length > 1) {
        parsedData[keyNodes[0]] = Object.assign(
          {},
          this._processNestedField(keyNodes, newData[key], parsedData),
        );
      } else {
        parsedData[keyNodes[0]] = this._parseValue(newData[key], parsedData[key]);
      }
    });

    return parsedData;
  }
}
