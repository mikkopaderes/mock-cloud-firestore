const {
  endAt,
  endBefore,
  limit,
  orderBy,
  startAfter,
  startAt,
  where,
} = require('./');
const MockFirebase = require('../../');

QUnit.module('Unit | Util | query', () => {
  QUnit.module('function: endAt', () => {
    QUnit.test('should return records <= to the numerical value', (assert) => {
      assert.expect(1);

      // Arrange
      const records = {
        user_a: { age: 10 },
        user_b: { age: 15 },
        user_c: { age: 20 },
      };

      // Act
      const result = endAt(records, 'age', 15);

      // Assert
      assert.deepEqual(result, {
        user_a: { age: 10 },
        user_b: { age: 15 },
      });
    });

    QUnit.test('should return records <= to the string value', (assert) => {
      assert.expect(1);

      // Arrange
      const records = {
        user_a: { name: 'Bar' },
        user_b: { name: 'Faw' },
        user_c: { name: 'Foo' },
      };

      // Act
      const result = endAt(records, 'name', 'Fo');

      // Assert
      assert.deepEqual(result, {
        user_a: { name: 'Bar' },
        user_b: { name: 'Faw' },
      });
    });
  });

  QUnit.module('function: endBefore', () => {
    QUnit.test('should return records < to the numerical value', (assert) => {
      assert.expect(1);

      // Arrange
      const records = {
        user_a: { age: 10 },
        user_b: { age: 15 },
        user_c: { age: 20 },
      };

      // Act
      const result = endBefore(records, 'age', 15);

      // Assert
      assert.deepEqual(result, {
        user_a: { age: 10 },
      });
    });

    QUnit.test('should return records < to the string value', (assert) => {
      assert.expect(1);

      // Arrange
      const records = {
        user_a: { name: 'Bar' },
        user_b: { name: 'Faw' },
        user_c: { name: 'Foo' },
      };

      // Act
      const result = endBefore(records, 'name', 'Fo');

      // Assert
      assert.deepEqual(result, {
        user_a: { name: 'Bar' },
        user_b: { name: 'Faw' },
      });
    });
  });

  QUnit.module('function: limit', () => {
    QUnit.test('should return records within the limit', (assert) => {
      assert.expect(1);

      // Arrange
      const records = {
        user_a: { age: 10 },
        user_b: { age: 15 },
        user_c: { age: 20 },
      };

      // Act
      const result = limit(records, 2);

      // Assert
      assert.deepEqual(result, {
        user_a: { age: 10 },
        user_b: { age: 15 },
      });
    });
  });

  QUnit.module('function: orderBy', () => {
    QUnit.test('should return numerical ordered records in ascending order', (assert) => {
      assert.expect(1);

      // Arrange
      const records = {
        user_a: { age: 10 },
        user_b: { age: 20 },
        user_c: { age: 15 },
      };

      // Act
      const result = orderBy(records, 'age');

      // Assert
      assert.deepEqual(result, {
        user_a: { age: 10 },
        user_c: { age: 15 },
        user_b: { age: 20 },
      });
    });

    QUnit.test('should return numerical ordered records in descending order', (assert) => {
      assert.expect(1);

      // Arrange
      const records = {
        user_a: { age: 10 },
        user_b: { age: 20 },
        user_c: { age: 15 },
      };

      // Act
      const result = orderBy(records, 'age', 'desc');

      // Assert
      assert.deepEqual(result, {
        user_b: { age: 20 },
        user_c: { age: 15 },
        user_a: { age: 10 },
      });
    });

    QUnit.test('should return string ordered records in ascending order', (assert) => {
      assert.expect(1);

      // Arrange
      const records = {
        user_a: { name: 'Foo' },
        user_b: { name: 'Bar' },
        user_c: { name: 'Faw' },
      };

      // Act
      const result = orderBy(records, 'name');

      // Assert
      assert.deepEqual(result, {
        user_b: { name: 'Bar' },
        user_c: { name: 'Faw' },
        user_a: { name: 'Foo' },
      });
    });

    QUnit.test('should return string ordered records in descending order', (assert) => {
      assert.expect(1);

      // Arrange
      const records = {
        user_a: { name: 'Foo' },
        user_b: { name: 'Bar' },
        user_c: { name: 'Faw' },
      };

      // Act
      const result = orderBy(records, 'name', 'desc');

      // Assert
      assert.deepEqual(result, {
        user_a: { name: 'Foo' },
        user_c: { name: 'Faw' },
        user_b: { name: 'Bar' },
      });
    });
  });

  QUnit.module('function: startAfter', () => {
    QUnit.test('should return records > to the numerical value', (assert) => {
      assert.expect(1);

      // Arrange
      const records = {
        user_a: { age: 10 },
        user_b: { age: 15 },
        user_c: { age: 20 },
      };

      // Act
      const result = startAfter(records, 'age', 15);

      // Assert
      assert.deepEqual(result, {
        user_c: { age: 20 },
      });
    });

    QUnit.test('should return records > to the string value', (assert) => {
      assert.expect(1);

      // Arrange
      const records = {
        user_a: { name: 'Bar' },
        user_b: { name: 'Faw' },
        user_c: { name: 'Foo' },
      };

      // Act
      const result = startAfter(records, 'name', 'Faw');

      // Assert
      assert.deepEqual(result, {
        user_c: { name: 'Foo' },
      });
    });
  });

  QUnit.module('function: startAt', () => {
    QUnit.test('should return records >= to the numerical value', (assert) => {
      assert.expect(1);

      // Arrange
      const records = {
        user_a: { age: 10 },
        user_b: { age: 15 },
        user_c: { age: 20 },
      };

      // Act
      const result = startAt(records, 'age', 15);

      // Assert
      assert.deepEqual(result, {
        user_b: { age: 15 },
        user_c: { age: 20 },
      });
    });

    QUnit.test('should return records >= to the string value', (assert) => {
      assert.expect(1);

      // Arrange
      const records = {
        user_a: { name: 'Bar' },
        user_b: { name: 'Faw' },
        user_c: { name: 'Foo' },
      };

      // Act
      const result = startAt(records, 'name', 'F');

      // Assert
      assert.deepEqual(result, {
        user_b: { name: 'Faw' },
        user_c: { name: 'Foo' },
      });
    });
  });

  QUnit.module('function: where', () => {
    QUnit.test('should return records matching the < filter', (assert) => {
      assert.expect(1);

      // Arrange
      const records = {
        user_a: { age: 10 },
        user_b: { age: 15 },
        user_c: { age: 20 },
      };

      // Act
      const result = where(records, 'age', '<', 15);

      // Assert
      assert.deepEqual(result, {
        user_a: { age: 10 },
      });
    });

    QUnit.test('should return records matching the <= filter', (assert) => {
      assert.expect(1);

      // Arrange
      const records = {
        user_a: { age: 10 },
        user_b: { age: 15 },
        user_c: { age: 20 },
      };

      // Act
      const result = where(records, 'age', '<=', 15);

      // Assert
      assert.deepEqual(result, {
        user_a: { age: 10 },
        user_b: { age: 15 },
      });
    });

    QUnit.test('should return records matching the == filter', (assert) => {
      assert.expect(1);

      // Arrange
      const records = {
        user_a: { age: 10 },
        user_b: { age: 15 },
        user_c: { age: 20 },
      };

      // Act
      const result = where(records, 'age', '==', 15);

      // Assert
      assert.deepEqual(result, {
        user_b: { age: 15 },
      });
    });

    QUnit.test('should return records matching the == filter for DocumentReference', (assert) => {
      assert.expect(2);

      // Arrange
      const db = new MockFirebase().firestore();
      const records = {
        user_a: { username: db.collection('usernames').doc('user_a') },
        user_b: { username: db.collection('usernames').doc('user_b') },
        user_c: { username: db.collection('usernames').doc('user_c') },
      };

      // Act
      const result = where(
        records,
        'username',
        '==',
        db.collection('usernames').doc('user_b')
      );

      // Assert
      assert.equal(Object.keys(result).length, 1);
      assert.ok(result.hasOwnProperty('user_b'));
    });

    QUnit.test('should return records matching the >= filter', (assert) => {
      assert.expect(1);

      // Arrange
      const records = {
        user_a: { age: 10 },
        user_b: { age: 15 },
        user_c: { age: 20 },
      };

      // Act
      const result = where(records, 'age', '>=', 15);

      // Assert
      assert.deepEqual(result, {
        user_b: { age: 15 },
        user_c: { age: 20 },
      });
    });

    QUnit.test('should return records matching the > filter', (assert) => {
      assert.expect(1);

      // Arrange
      const records = {
        user_a: { age: 10 },
        user_b: { age: 15 },
        user_c: { age: 20 },
      };

      // Act
      const result = where(records, 'age', '>', 15);

      // Assert
      assert.deepEqual(result, {
        user_c: { age: 20 },
      });
    });
  });
});
