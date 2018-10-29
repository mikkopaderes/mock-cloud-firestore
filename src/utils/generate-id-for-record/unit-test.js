import generateIdForRecord from '.';

QUnit.module('Unit | Util | generate-id-for-record', () => {
  QUnit.module('function: generateIdForRecord', () => {
    QUnit.test('should return a random string', (assert) => {
      assert.expect(1);

      // Act
      const result = generateIdForRecord();

      // Assert
      assert.ok(typeof result === 'string');
    });
  });
});
