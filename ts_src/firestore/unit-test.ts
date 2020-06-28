import Collection from './collection-reference';
import Firestore from '.';
import FixtureManager from '../utils/fixture-manager';

QUnit.module('Unit | firestore', () => {
  QUnit.test('should return instance of CollectionReference when calling collection', (assert) => {
    assert.expect(1);

    const data = {};
    const fixtureManager = new FixtureManager(data);
    const db = new Firestore(fixtureManager);

    const result = db.collection('users');

    assert.ok(result instanceof Collection);
  });
});
