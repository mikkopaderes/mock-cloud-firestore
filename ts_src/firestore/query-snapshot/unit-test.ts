import QuerySnapshot from '.';

QUnit.module('Unit | firestore/query-snapshot', () => {
  QUnit.test('should have a property containing all query document snapshots', (assert) => {
    assert.expect(1);

    const queryDocumentSnapshots = [];
    const querySnapshot = new QuerySnapshot(queryDocumentSnapshots);

    const result = querySnapshot.docs;

    assert.deepEqual(result, queryDocumentSnapshots);
  });

  QUnit.test('should have a property containing false if there are documents', (assert) => {
    assert.expect(1);

    const queryDocumentSnapshots = [{}];
    const querySnapshot = new QuerySnapshot(queryDocumentSnapshots);

    const result = querySnapshot.empty;

    assert.equal(result, false);
  });

  QUnit.test('should have a property containing true if there are no documents', (assert) => {
    assert.expect(1);

    const queryDocumentSnapshots = [];
    const querySnapshot = new QuerySnapshot(queryDocumentSnapshots);

    const result = querySnapshot.empty;

    assert.equal(result, true);
  });

  QUnit.test('should have a property containing the number of documents', (assert) => {
    assert.expect(1);

    const queryDocumentSnapshots = [];
    const querySnapshot = new QuerySnapshot(queryDocumentSnapshots);

    const result = querySnapshot.size;

    assert.equal(result, 0);
  });

  QUnit.test('should be able to trigger callbacks per each document', (assert) => {
    assert.expect(2);

    const queryDocumentSnapshots = [{}, {}];
    const querySnapshot = new QuerySnapshot(queryDocumentSnapshots);

    querySnapshot.forEach((doc) => {
      assert.ok(queryDocumentSnapshots.includes(doc));
    });
  });
});
