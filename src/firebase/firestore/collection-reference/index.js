import { cleanPath, validatePath } from '../../../utils/path';
import { querySnapshot } from '../../../utils/query';
import DocumentReference from '../document-reference';
import Query from '../query';
import generateIdForRecord from '../../../utils/generate-id-for-record';
import getOrSetDataNode from '../../../utils/get-or-set-data-node';
import validateReference from '../../../utils/reference';

export default class CollectionReference {
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

  async add(data) {
    const id = generateIdForRecord();
    const dataNode = getOrSetDataNode(this._data, '__doc__', id);
    const ref = new DocumentReference(id, dataNode, this, this._firestore);

    await ref.set(data);

    return ref;
  }

  doc(id = generateIdForRecord()) {
    return this._getDocumentReference(id);
  }

  endAt(...args) {
    return new Query(this._data, this).endAt(...args);
  }

  endBefore(...args) {
    return new Query(this._data, this).endBefore(...args);
  }

  get() {
    return Promise.resolve(querySnapshot(this._data, this));
  }

  limit(...args) {
    return new Query(this._data, this).limit(...args);
  }

  onSnapshot(onNext) {
    setTimeout(() => onNext(querySnapshot(this._data, this)), 10);

    return this._firestore._onSnapshot(() => {
      onNext(querySnapshot(this._data, this));
    });
  }

  orderBy(...args) {
    return new Query(this._data, this).orderBy(...args);
  }

  startAfter(...args) {
    return new Query(this._data, this).startAfter(...args);
  }

  startAt(...args) {
    return new Query(this._data, this).startAt(...args);
  }

  where(...args) {
    return new Query(this._data, this).where(...args);
  }

  _doc(id) {
    const data = getOrSetDataNode(this._data, '__doc__', id);

    return new DocumentReference(id, data, this, this._firestore);
  }

  _getDocumentReference(path) {
    validatePath(path);

    const cleanedPath = cleanPath(path);
    const nodes = cleanedPath.split('/');
    let ref = this;

    nodes.forEach((node, index) => {
      if (index % 2 === 0) {
        ref = ref._doc(node);
      } else {
        ref = ref.collection(node);
      }
    });

    validateReference(ref, 'doc');

    return ref;
  }
}
