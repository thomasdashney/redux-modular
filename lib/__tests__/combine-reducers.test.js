'use strict';

var _combineReducers = require('../combine-reducers');

var _combineReducers2 = _interopRequireDefault(_combineReducers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

it('combines reducers', function () {
  var reduce = (0, _combineReducers2.default)({
    value1: function value1() {
      return 1;
    },
    value2: function value2() {
      return 2;
    }
  });

  expect(reduce(undefined, { type: '@@INIT' })).toEqual({
    value1: 1,
    value2: 2
  });
}); /* eslint-env jest */

it('sets the original reducer map on a property', function () {
  var reducerMap = {
    value1: function value1() {
      return 1;
    },
    value2: function value2() {
      return 2;
    }
  };

  var combinedReducer = (0, _combineReducers2.default)(reducerMap);
  expect(combinedReducer._reducerMap).toEqual(reducerMap);
});