import { cleanPath, validatePath } from '../../../utils/path';
import CollectionReference from '../collection-reference';
import DocumentSnapshot from '../document-snapshot';
import getOrSetDataNode from '../../../utils/get-or-set-data-node';
import parseValue from '../../../utils/parse-value';
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

  getCollections() {
    if (this._data.__collection__ === undefined) {
      return Promise.resolve([]);
    }

    const collectionIds = Object.keys(this._data.__collection__);
    const collectionReferences = collectionIds.map(id => this._getCollectionReference(id));

    return Promise.resolve(collectionReferences);
  }

  listCollections() {
    return this.getCollections();
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
    this._firestore._dataChanged();

    return Promise.resolve();
  }

  update(data) {
    if (this._data.__isDirty__ || this._data.__isDeleted__) {
      throw new Error('Document doesn\'t exist');
    }

    Object.assign(this._data, this._parseDataForUpdate(data));
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
        const newValue = parseValue(value, currentOldDataNode[key], { type: 'update' });

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
      parsedData[key] = parseValue(newData[key], parsedData[key], {
        type: `set:merge-${option.merge || false}`,
      });
    });

    return this._removeDeletedFields(parsedData);
  }

  _parseDataForUpdate(newData) {
    const parsedData = Object.assign({}, this._data);

    Object.keys(newData).forEach((key) => {
      const keyNodes = key.split('.');

      if (keyNodes.length > 1) {
        parsedData[keyNodes[0]] = Object.assign(
          {},
          this._processNestedField(keyNodes, newData[key], parsedData),
        );
      } else {
        parsedData[keyNodes[0]] = parseValue(newData[key], parsedData[key], { type: 'update' });
      }
    });

    return this._removeDeletedFields(parsedData);
  }

  _removeDeletedFields(data) {
    const newData = Object.assign({}, data);

    Object.keys(data).forEach((key) => {
      const field = newData[key];

      if (field === '__FieldValue.delete__') {
        delete newData[key];
        delete this._data[key];
      } else if (Object.prototype.toString.call(field) === '[object Object]') {
        newData[key] = this._removeDeletedFields(field);
      }
    });

    return newData;
  }
}
