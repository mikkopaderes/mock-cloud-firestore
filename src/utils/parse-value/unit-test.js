import firebase from 'firebase';

import fixtureData from '../test-helpers/fixture-data';
import parseValue from '.';
import MockFirebase from '../..';

QUnit.module('Unit | Util | parse-value', () => {
  QUnit.module('function: parseValue', () => {
    QUnit.test('should throw an error when value is undefined', (assert) => {
      assert.expect(1);

      try {
        // Arrange
        const newValue = undefined;
        const oldValue = undefined;

        // Act
        parseValue(newValue, oldValue, { type: 'set:merge-false' });
      } catch (error) {
        // Assert
        assert.ok(true);
      }
    });

    QUnit.test('should throw an error when value is FieldValue.delete() under an add operation type', (assert) => {
      assert.expect(1);

      try {
        // Arrange
        const newValue = { foo: firebase.firestore.FieldValue.delete() };
        const oldValue = undefined;

        // Act
        parseValue(newValue, oldValue, { type: 'set:merge-false' });
      } catch (error) {
        // Assert
        assert.ok(true);
      }
    });

    QUnit.test('should throw an error when value is FieldValue.delete() under a set:merge-false operation type', (assert) => {
      assert.expect(1);

      try {
        // Arrange
        const newValue = { foo: firebase.firestore.FieldValue.delete() };
        const oldValue = undefined;

        // Act
        parseValue(newValue, oldValue, { type: 'set:merge-false' });
      } catch (error) {
        // Assert
        assert.ok(true);
      }
    });

    QUnit.test('should throw an error when value is FieldValue.delete() under an update operation type nested object field', (assert) => {
      assert.expect(1);

      try {
        // Arrange
        const newValue = { foo: firebase.firestore.FieldValue.delete() };
        const oldValue = undefined;

        // Act
        parseValue(newValue, oldValue, { type: 'update' });
      } catch (error) {
        // Assert
        assert.ok(true);
      }
    });

    QUnit.test('should throw an error when value is of FieldValue type and is inside an array', (assert) => {
      assert.expect(1);

      try {
        // Arrange
        const newValue = {
          foo: [
            {
              bar: firebase.firestore.FieldValue.serverTimestamp(),
            },
          ],
        };
        const oldValue = undefined;

        // Act
        parseValue(newValue, oldValue, { type: 'set:merge-false' });
      } catch (error) {
        // Assert
        assert.ok(true);
      }
    });

    QUnit.test('should return as-is when parsing a string', (assert) => {
      assert.expect(1);

      // Arrange
      const newValue = 'foo';
      const oldValue = undefined;

      // Act
      const result = parseValue(newValue, oldValue, { type: 'set:merge-false' });

      // Assert
      assert.equal(result, 'foo');
    });

    QUnit.test('should return as-is when parsing a number', (assert) => {
      assert.expect(1);

      // Arrange
      const newValue = 1;
      const oldValue = undefined;

      // Act
      const result = parseValue(newValue, oldValue, { type: 'set:merge-false' });

      // Assert
      assert.equal(result, 1);
    });

    QUnit.test('should return as-is when parsing a boolean', (assert) => {
      assert.expect(1);

      // Arrange
      const newValue = true;
      const oldValue = undefined;

      // Act
      const result = parseValue(newValue, oldValue, { type: 'set:merge-false' });

      // Assert
      assert.equal(result, true);
    });

    QUnit.test('should return as-is when parsing an array', (assert) => {
      assert.expect(1);

      // Arrange
      const newValue = ['foo'];
      const oldValue = undefined;

      // Act
      const result = parseValue(newValue, oldValue, { type: 'set:merge-false' });

      // Assert
      assert.deepEqual(result, ['foo']);
    });

    QUnit.test('should return array of paths when parsing an array of DocumentReferences', (assert) => {
      assert.expect(1);

      // Arrange
      const mockFirebase = new MockFirebase(fixtureData());
      const newValue = [mockFirebase.firestore().doc('users/user_a')];
      const oldValue = undefined;

      // Act
      const result = parseValue(newValue, oldValue, { type: 'set:merge-false' });

      // Assert
      assert.deepEqual(result, ['__ref__:users/user_a']);
    });

    QUnit.test('should return path when parsing a DocumentReference', (assert) => {
      assert.expect(1);

      // Arrange
      const mockFirebase = new MockFirebase(fixtureData());
      const newValue = mockFirebase.firestore().doc('users/user_a');
      const oldValue = undefined;

      // Act
      const result = parseValue(newValue, oldValue, { type: 'set:merge-false' });

      // Assert
      assert.equal(result, '__ref__:users/user_a');
    });

    QUnit.test('should return a new date when parsing a FieldValue.serverTimestamp', (assert) => {
      assert.expect(1);

      // Arrange
      const newValue = firebase.firestore.FieldValue.serverTimestamp();
      const oldValue = undefined;

      // Act
      const result = parseValue(newValue, oldValue, { type: 'set:merge-false' });

      // Assert
      assert.ok(result instanceof Date);
    });

    QUnit.test('should return a unioned array when parsing a FieldValue.arrayUnion', (assert) => {
      assert.expect(1);

      // Arrange
      const newValue = firebase.firestore.FieldValue.arrayUnion('foo', 'bar');
      const oldValue = undefined;

      // Act
      const result = parseValue(newValue, oldValue, { type: 'set:merge-false' });

      // Assert
      assert.deepEqual(result, ['foo', 'bar']);
    });

    QUnit.test('should return a unioned array with the old value when parsing a FieldValue.arrayUnion', (assert) => {
      assert.expect(1);

      // Arrange
      const newValue = firebase.firestore.FieldValue.arrayUnion('foo', 'bar');
      const oldValue = ['hello', 'world'];

      // Act
      const result = parseValue(newValue, oldValue, { type: 'set:merge-false' });

      // Assert
      assert.deepEqual(result, ['hello', 'world', 'foo', 'bar']);
    });

    QUnit.test('should return an empty array when parsing a FieldValue.arrayRemove without an old value', (assert) => {
      assert.expect(1);

      // Arrange
      const newValue = firebase.firestore.FieldValue.arrayRemove('foo', 'bar');
      const oldValue = undefined;

      // Act
      const result = parseValue(newValue, oldValue, { type: 'set:merge-false' });

      // Assert
      assert.deepEqual(result, []);
    });

    QUnit.test('should return a filtered array without the FieldValue.arrayRemove values', (assert) => {
      assert.expect(1);

      // Arrange
      const newValue = firebase.firestore.FieldValue.arrayRemove('hello', 'world');
      const oldValue = ['hello', 'world', 'waow'];

      // Act
      const result = parseValue(newValue, oldValue, { type: 'set:merge-false' });

      // Assert
      assert.deepEqual(result, ['waow']);
    });

    QUnit.test('should return __FieldValue.delete__ when parsing a FieldValue.delete', (assert) => {
      assert.expect(1);

      // Arrange
      const newValue = firebase.firestore.FieldValue.delete();
      const oldValue = undefined;

      // Act
      const result = parseValue(newValue, oldValue, { type: 'update' });

      // Assert
      assert.equal(result, '__FieldValue.delete__');
    });

    QUnit.test('should return a merged object when operation type is set:merge-true and new and old value is an object', (assert) => {
      assert.expect(1);

      // Arrange
      const newValue = {
        test1: 'foo',
        test2: {
          test1a: firebase.firestore.FieldValue.arrayUnion('bar'),
          test2a: firebase.firestore.FieldValue.arrayUnion('bar'),
        },
      };
      const oldValue = {
        test1: 'foo',
        test2: {
          test1a: ['foo'],
        },
        test3: 'foo',
      };

      // Act
      const result = parseValue(newValue, oldValue, { type: 'set:merge-true' });

      // Assert
      assert.deepEqual(result, {
        test1: 'foo',
        test2: {
          test1a: ['foo', 'bar'],
          test2a: ['bar'],
        },
        test3: 'foo',
      });
    });

    QUnit.test('should return a new object when operation type is set:merge-false and new is an object', (assert) => {
      assert.expect(1);

      // Arrange
      const newValue = {
        test1: 'foo',
        test2: {
          test1a: firebase.firestore.FieldValue.arrayUnion('bar'),
          test2a: firebase.firestore.FieldValue.arrayUnion('bar'),
        },
      };
      const oldValue = {
        test1: 'foo',
        test2: {
          test1a: ['foo'],
        },
        test3: 'foo',
      };

      // Act
      const result = parseValue(newValue, oldValue, { type: 'set:merge-false' });

      // Assert
      assert.deepEqual(result, {
        test1: 'foo',
        test2: {
          test1a: ['bar'],
          test2a: ['bar'],
        },
      });
    });

    QUnit.test('should return a new object when operation type is update and new is an object', (assert) => {
      assert.expect(1);

      // Arrange
      const newValue = {
        test1: 'foo',
        test2: {
          test1a: firebase.firestore.FieldValue.arrayUnion('bar'),
          test2a: firebase.firestore.FieldValue.arrayUnion('bar'),
        },
      };
      const oldValue = {
        test1: 'foo',
        test2: {
          test1a: ['foo'],
        },
        test3: 'foo',
      };

      // Act
      const result = parseValue(newValue, oldValue, { type: 'update' });

      // Assert
      assert.deepEqual(result, {
        test1: 'foo',
        test2: {
          test1a: ['bar'],
          test2a: ['bar'],
        },
      });
    });
  });
});
