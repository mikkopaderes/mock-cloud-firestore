import validateReference from '.';

QUnit.module('Unit | Util | reference', () => {
  QUnit.module('function: validateReference', () => {
    QUnit.test('should not throw an error path to collection refers to a collection', (assert) => {
      assert.expect(1);

      // Act
      validateReference({ id: 'user_a' }, 'collection');

      // Assert
      assert.ok(true);
    });

    QUnit.test('should not throw an error path to collection refers to a document', (assert) => {
      assert.expect(1);

      // Act
      validateReference({
        id: 'user_a',
        parent: {
          id: 'users',
        },
      }, 'doc');

      // Assert
      assert.ok(true);
    });

    QUnit.test('should throw an error path to collection does not refer to a collection', (assert) => {
      assert.expect(1);

      // Act & Assert
      assert.throws(() => {
        validateReference({
          id: 'user_a',
          parent: {
            id: 'users',
          },
        }, 'collection');
      }, new Error('Invalid collection reference. Collection references must have an odd number of segments, but users/user_a has 2.'));
    });

    QUnit.test('should throw an error path to document does not refer to a document', (assert) => {
      assert.expect(1);

      // Act & Assert
      assert.throws(() => {
        validateReference({ id: 'users' }, 'doc');
      }, new Error('Invalid document reference. Document references must have an even number of segments, but users has 1.'));
    });
  });
});
