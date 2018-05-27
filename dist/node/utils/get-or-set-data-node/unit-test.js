'use strict';

var _ = require('./');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

QUnit.module('Unit | Util | get-or-set-data-node', () => {
  QUnit.module('function: getOrSetDataNode', () => {
    QUnit.test('should create an empty __collection__ data node object when it does not exist', assert => {
      assert.expect(1);

      // Arrange
      const data = {};

      // Act
      (0, _2.default)(data, '__collection__', 'users');

      // Assert
      assert.deepEqual(data, {
        __collection__: {
          users: {}
        }
      });
    });

    QUnit.test('should create an object __doc__ data node with __isDirty__ prop when it does not exist', assert => {
      assert.expect(1);

      // Arrange
      const data = {};

      // Act
      (0, _2.default)(data, '__doc__', 'user_a');

      // Assert
      assert.deepEqual(data, {
        __doc__: {
          user_a: { __isDirty__: true }
        }
      });
    });
  });
});