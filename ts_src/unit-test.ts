import App from './app';
import Firestore from './firestore';
import MockFirebase from '.';

QUnit.module('Unit | mock-cloud-firestore', () => {
  QUnit.test('should return instance of App when initializing app', (assert) => {
    assert.expect(1);

    const fixtureData = {};
    const firebase = new MockFirebase(fixtureData);

    const result = firebase.initializeApp();

    assert.ok(result instanceof App);
  });

  QUnit.test('should return instance of Firestore when calling firestore', (assert) => {
    assert.expect(1);

    const fixtureData = {};
    const firebase = new MockFirebase(fixtureData);

    const result = firebase.firestore();

    assert.ok(result instanceof Firestore);
  });
});
