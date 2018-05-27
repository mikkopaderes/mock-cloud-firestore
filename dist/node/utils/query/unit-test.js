'use strict';

var _ = require('./');

var _2 = require('../../');

var _3 = _interopRequireDefault(_2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

QUnit.module('Unit | Util | query', () => {
  QUnit.module('function: endAt', () => {
    QUnit.test('should return records <= to the numerical value', assert => {
      assert.expect(1);

      // Arrange
      const records = {
        user_a: { age: 10 },
        user_b: { age: 15 },
        user_c: { age: 20 }
      };

      // Act
      const result = (0, _.endAt)(records, 'age', 15);

      // Assert
      assert.deepEqual(result, {
        user_a: { age: 10 },
        user_b: { age: 15 }
      });
    });

    QUnit.test('should return records <= to the string value', assert => {
      assert.expect(1);

      // Arrange
      const records = {
        user_a: { name: 'Bar' },
        user_b: { name: 'Faw' },
        user_c: { name: 'Foo' }
      };

      // Act
      const result = (0, _.endAt)(records, 'name', 'Fo');

      // Assert
      assert.deepEqual(result, {
        user_a: { name: 'Bar' },
        user_b: { name: 'Faw' }
      });
    });
  });

  QUnit.module('function: endBefore', () => {
    QUnit.test('should return records < to the numerical value', assert => {
      assert.expect(1);

      // Arrange
      const records = {
        user_a: { age: 10 },
        user_b: { age: 15 },
        user_c: { age: 20 }
      };

      // Act
      const result = (0, _.endBefore)(records, 'age', 15);

      // Assert
      assert.deepEqual(result, {
        user_a: { age: 10 }
      });
    });

    QUnit.test('should return records < to the string value', assert => {
      assert.expect(1);

      // Arrange
      const records = {
        user_a: { name: 'Bar' },
        user_b: { name: 'Faw' },
        user_c: { name: 'Foo' }
      };

      // Act
      const result = (0, _.endBefore)(records, 'name', 'Fo');

      // Assert
      assert.deepEqual(result, {
        user_a: { name: 'Bar' },
        user_b: { name: 'Faw' }
      });
    });
  });

  QUnit.module('function: limit', () => {
    QUnit.test('should return records within the limit', assert => {
      assert.expect(1);

      // Arrange
      const records = {
        user_a: { age: 10 },
        user_b: { age: 15 },
        user_c: { age: 20 }
      };

      // Act
      const result = (0, _.limit)(records, 2);

      // Assert
      assert.deepEqual(result, {
        user_a: { age: 10 },
        user_b: { age: 15 }
      });
    });
  });

  QUnit.module('function: orderBy', () => {
    QUnit.test('should return numerical ordered records in ascending order', assert => {
      assert.expect(1);

      // Arrange
      const records = {
        user_a: { age: 10 },
        user_b: { age: 20 },
        user_c: { age: 15 }
      };

      // Act
      const result = (0, _.orderBy)(records, 'age');

      // Assert
      assert.deepEqual(result, {
        user_a: { age: 10 },
        user_c: { age: 15 },
        user_b: { age: 20 }
      });
    });

    QUnit.test('should return numerical ordered records in descending order', assert => {
      assert.expect(1);

      // Arrange
      const records = {
        user_a: { age: 10 },
        user_b: { age: 20 },
        user_c: { age: 15 }
      };

      // Act
      const result = (0, _.orderBy)(records, 'age', 'desc');

      // Assert
      assert.deepEqual(result, {
        user_b: { age: 20 },
        user_c: { age: 15 },
        user_a: { age: 10 }
      });
    });

    QUnit.test('should return string ordered records in ascending order', assert => {
      assert.expect(1);

      // Arrange
      const records = {
        user_a: { name: 'Foo' },
        user_b: { name: 'Bar' },
        user_c: { name: 'Faw' }
      };

      // Act
      const result = (0, _.orderBy)(records, 'name');

      // Assert
      assert.deepEqual(result, {
        user_b: { name: 'Bar' },
        user_c: { name: 'Faw' },
        user_a: { name: 'Foo' }
      });
    });

    QUnit.test('should return string ordered records in descending order', assert => {
      assert.expect(1);

      // Arrange
      const records = {
        user_a: { name: 'Foo' },
        user_b: { name: 'Bar' },
        user_c: { name: 'Faw' }
      };

      // Act
      const result = (0, _.orderBy)(records, 'name', 'desc');

      // Assert
      assert.deepEqual(result, {
        user_a: { name: 'Foo' },
        user_c: { name: 'Faw' },
        user_b: { name: 'Bar' }
      });
    });
  });

  QUnit.module('function: startAfter', () => {
    QUnit.test('should return records > to the numerical value', assert => {
      assert.expect(1);

      // Arrange
      const records = {
        user_a: { age: 10 },
        user_b: { age: 15 },
        user_c: { age: 20 }
      };

      // Act
      const result = (0, _.startAfter)(records, 'age', 15);

      // Assert
      assert.deepEqual(result, {
        user_c: { age: 20 }
      });
    });

    QUnit.test('should return records > to the string value', assert => {
      assert.expect(1);

      // Arrange
      const records = {
        user_a: { name: 'Bar' },
        user_b: { name: 'Faw' },
        user_c: { name: 'Foo' }
      };

      // Act
      const result = (0, _.startAfter)(records, 'name', 'Faw');

      // Assert
      assert.deepEqual(result, {
        user_c: { name: 'Foo' }
      });
    });
  });

  QUnit.module('function: startAt', () => {
    QUnit.test('should return records >= to the numerical value', assert => {
      assert.expect(1);

      // Arrange
      const records = {
        user_a: { age: 10 },
        user_b: { age: 15 },
        user_c: { age: 20 }
      };

      // Act
      const result = (0, _.startAt)(records, 'age', 15);

      // Assert
      assert.deepEqual(result, {
        user_b: { age: 15 },
        user_c: { age: 20 }
      });
    });

    QUnit.test('should return records >= to the string value', assert => {
      assert.expect(1);

      // Arrange
      const records = {
        user_a: { name: 'Bar' },
        user_b: { name: 'Faw' },
        user_c: { name: 'Foo' }
      };

      // Act
      const result = (0, _.startAt)(records, 'name', 'F');

      // Assert
      assert.deepEqual(result, {
        user_b: { name: 'Faw' },
        user_c: { name: 'Foo' }
      });
    });
  });

  QUnit.module('function: where', () => {
    QUnit.test('should return records matching the < filter', assert => {
      assert.expect(1);

      // Arrange
      const records = {
        user_a: { age: 10 },
        user_b: { age: 15 },
        user_c: { age: 20 }
      };

      // Act
      const result = (0, _.where)(records, 'age', '<', 15);

      // Assert
      assert.deepEqual(result, {
        user_a: { age: 10 }
      });
    });

    QUnit.test('should return records matching the <= filter', assert => {
      assert.expect(1);

      // Arrange
      const records = {
        user_a: { age: 10 },
        user_b: { age: 15 },
        user_c: { age: 20 }
      };

      // Act
      const result = (0, _.where)(records, 'age', '<=', 15);

      // Assert
      assert.deepEqual(result, {
        user_a: { age: 10 },
        user_b: { age: 15 }
      });
    });

    QUnit.test('should return records matching the == filter', assert => {
      assert.expect(1);

      // Arrange
      const records = {
        user_a: { age: 10 },
        user_b: { age: 15 },
        user_c: { age: 20 }
      };

      // Act
      const result = (0, _.where)(records, 'age', '==', 15);

      // Assert
      assert.deepEqual(result, {
        user_b: { age: 15 }
      });
    });

    QUnit.test('should return records matching the == filter for DocumentReference', assert => {
      assert.expect(2);

      // Arrange
      const db = new _3.default().firestore();
      const records = {
        user_a: { username: '__ref__:usernames/user_a' },
        user_b: { username: '__ref__:usernames/user_b' },
        user_c: { username: '__ref__:usernames/user_c' },
        user_d: { username: null }
      };

      // Act
      const result = (0, _.where)(records, 'username', '==', db.collection('usernames').doc('user_b'));

      // Assert
      assert.equal(Object.keys(result).length, 1);
      assert.ok(result.user_b);
    });

    QUnit.test('should return records matching the >= filter', assert => {
      assert.expect(1);

      // Arrange
      const records = {
        user_a: { age: 10 },
        user_b: { age: 15 },
        user_c: { age: 20 }
      };

      // Act
      const result = (0, _.where)(records, 'age', '>=', 15);

      // Assert
      assert.deepEqual(result, {
        user_b: { age: 15 },
        user_c: { age: 20 }
      });
    });

    QUnit.test('should return records matching the > filter', assert => {
      assert.expect(1);

      // Arrange
      const records = {
        user_a: { age: 10 },
        user_b: { age: 15 },
        user_c: { age: 20 }
      };

      // Act
      const result = (0, _.where)(records, 'age', '>', 15);

      // Assert
      assert.deepEqual(result, {
        user_c: { age: 20 }
      });
    });
  });

  QUnit.module('function: querySnapshot', () => {
    QUnit.test('should return undeleted documents', assert => {
      assert.expect(1);

      // Arrange
      const data = {
        __doc__: {
          user_a: {
            name: 'User A'
          },
          user_b: {
            name: 'User B',
            __isDeleted__: true
          },
          user_c: {
            name: 'User C'
          }
        }
      };

      // Act
      const result = (0, _.querySnapshot)(data, {});

      // Assert
      assert.equal(result.size, 2);
    });
  });
});