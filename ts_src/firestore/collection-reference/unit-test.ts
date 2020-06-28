import sinon from 'sinon';

import Collection from '.';
import FixtureManager from '../../utils/fixture-manager';
import QuerySnapshot from '../query-snapshot';

QUnit.module('Unit | firestore/collection-reference', () => {
  QUnit.test('should return instance of QuerySnapshot when executing a query', async (assert) => {
    assert.expect(1);

    const data = {};
    const fixtureManager = new FixtureManager(data);
    const collection = new Collection('users', fixtureManager);

    const result = await collection.get();

    assert.ok(result instanceof QuerySnapshot);
  });

  QUnit.test('should return result of fixture manager query when executing a get request', async (assert) => {
    assert.expect(2);

    const data = {};
    const fixtureManager = new FixtureManager(data);
    const querySnapshot = new QuerySnapshot([]);
    const queryStub = sinon.stub(fixtureManager, 'query').returns(querySnapshot);
    const collection = new Collection('users', fixtureManager);

    const result = await collection.get();

    assert.ok(queryStub.calledWithExactly('users', []));
    assert.deepEqual(result, querySnapshot);
  });
});
