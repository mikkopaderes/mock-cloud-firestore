import FieldValue from './firestore/field-value';
import Firestore from './firestore';

export default class MockFirebase {
  constructor(data) {
    this._data = data;
    this.firestore.FieldValue = new FieldValue();
  }

  initializeApp() {
    return this;
  }

  firestore() {
    return new Firestore(this._data);
  }
}
