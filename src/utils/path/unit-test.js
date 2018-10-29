import { buildPathFromReference, cleanPath, validatePath } from '.';

QUnit.module('Unit | Util | path', () => {
  QUnit.module('function: buildPathFromReference', () => {
    QUnit.test('should return a path representation of a reference', (assert) => {
      assert.expect(1);

      // Arrange
      const ref = {
        id: 'user_a',
        parent: {
          id: 'users',
        },
      };

      // Act
      const result = buildPathFromReference(ref);

      // Assert
      assert.equal(result, '__ref__:users/user_a');
    });
  });

  QUnit.module('function: cleanPath', () => {
    QUnit.test('should remove leading slash when available', (assert) => {
      assert.expect(1);

      // Act
      const result = cleanPath('/users');

      // Assert
      assert.equal(result, 'users');
    });
  });

  QUnit.module('function: validatePath', () => {
    QUnit.test('should throw an error path contains //', (assert) => {
      assert.expect(1);

      // Act & Assert
      assert.throws(() => {
        validatePath('//users');
      }, new Error('Invalid path (//users). Paths must not contain // in them.'));
    });
  });
});
