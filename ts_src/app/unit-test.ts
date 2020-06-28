import App from '.';
import Firestore from '../firestore';
import FixtureManager from '../utils/fixture-manager';

QUnit.module('Unit | app', () => {
  QUnit.test('should return instance of Firestore when calling firestore', (assert) => {
    assert.expect(1);

    const data = {};
    const fixtureManager = new FixtureManager(data);
    const app = new App(fixtureManager);

    const result = app.firestore();

    assert.ok(result instanceof Firestore);
  });
});
