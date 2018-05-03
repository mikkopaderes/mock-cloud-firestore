const buildPathFromref = require('./');

QUnit.module('Unit | Util | build-path-from-ref', () => {
  QUnit.module('function: buildPathFromref', () => {
    QUnit.test('should return a random string', (assert) => {
      assert.expect(1);

      // Arrange
      const ref = {
        id: 'user_a',
        parent: {
          id: 'users',
        },
      };

      // Act
      const result = buildPathFromref(ref);

      // Assert
      assert.equal(result, '__ref__:users/user_a');
    });
  });
});
