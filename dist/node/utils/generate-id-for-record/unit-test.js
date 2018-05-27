'use strict';

var _ = require('./');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

QUnit.module('Unit | Util | generate-id-for-record', () => {
  QUnit.module('function: generateIdForRecord', () => {
    QUnit.test('should return a random string', assert => {
      assert.expect(1);

      // Act
      const result = (0, _2.default)();

      // Assert
      assert.ok(typeof result === 'string');
    });
  });
});