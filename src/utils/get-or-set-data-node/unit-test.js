import getOrSetDataNode from '.';

QUnit.module('Unit | Util | get-or-set-data-node', () => {
  QUnit.module('function: getOrSetDataNode', () => {
    QUnit.test('should create an empty __collection__ data node object when it does not exist', (assert) => {
      assert.expect(1);

      // Arrange
      const data = {};

      // Act
      getOrSetDataNode(data, '__collection__', 'users');

      // Assert
      assert.deepEqual(data, {
        __collection__: {
          users: {},
        },
      });
    });

    QUnit.test('should create an object __doc__ data node with __isDirty__ prop when it does not exist', (assert) => {
      assert.expect(1);

      // Arrange
      const data = {};

      // Act
      getOrSetDataNode(data, '__doc__', 'user_a');

      // Assert
      assert.deepEqual(data, {
        __doc__: {
          user_a: { __isDirty__: true },
        },
      });
    });
  });
});
