'use strict';

var _ = require('./');

QUnit.module('Unit | Util | path', () => {
  QUnit.module('function: buildPathFromReference', () => {
    QUnit.test('should return a path representation of a reference', assert => {
      assert.expect(1);

      // Arrange
      const ref = {
        id: 'user_a',
        parent: {
          id: 'users'
        }
      };

      // Act
      const result = (0, _.buildPathFromReference)(ref);

      // Assert
      assert.equal(result, '__ref__:users/user_a');
    });
  });

  QUnit.module('function: cleanPath', () => {
    QUnit.test('should remove leading slash when available', assert => {
      assert.expect(1);

      // Act
      const result = (0, _.cleanPath)('/users');

      // Assert
      assert.equal(result, 'users');
    });
  });

  QUnit.module('function: validatePath', () => {
    QUnit.test('should throw an error path contains //', assert => {
      assert.expect(1);

      // Act & Assert
      assert.throws(() => {
        (0, _.validatePath)('//users');
      }, new Error('Invalid path (//users). Paths must not contain // in them.'));
    });
  });
});