const FieldValue = require('./firestore/field-value');
const Firestore = require('./firestore');

class MockFirebase {
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

module.exports = MockFirebase;
