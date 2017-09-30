'use strict';

var _createReducer3 = require('../create-reducer');

var _createReducer4 = _interopRequireDefault(_createReducer3);

var _createAction = require('../create-action');

var _createAction2 = _interopRequireDefault(_createAction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } /* eslint-env jest */

it('sets initial state', function () {
  var initialState = { initial: 'state' };
  var reduce = (0, _createReducer4.default)(initialState, {});
  expect(reduce(undefined, { type: '@@INIT' })).toEqual(initialState);
});

it('modifies state based on action types', function () {
  var _createReducer;

  var INCREMENT = 'INCREMENT';
  var DECREMENT = 'DECREMENT';
  var increment = (0, _createAction2.default)(INCREMENT);
  var decrement = (0, _createAction2.default)(DECREMENT);

  var reduce = (0, _createReducer4.default)(0, (_createReducer = {}, _defineProperty(_createReducer, INCREMENT, function (prev) {
    return prev + 1;
  }), _defineProperty(_createReducer, DECREMENT, function (prev) {
    return prev - 1;
  }), _createReducer));

  expect(reduce(1, increment())).toEqual(2);
  expect(reduce(2, decrement())).toEqual(1);
});

it('modifies state based on action creators', function () {
  var _createReducer2;

  var increment = (0, _createAction2.default)('INCREMENT');
  var decrement = (0, _createAction2.default)('DECREMENT');

  var reduce = (0, _createReducer4.default)(0, (_createReducer2 = {}, _defineProperty(_createReducer2, increment, function (prev) {
    return prev + 1;
  }), _defineProperty(_createReducer2, decrement, function (prev) {
    return prev - 1;
  }), _createReducer2));

  expect(reduce(1, increment())).toEqual(2);
  expect(reduce(2, decrement())).toEqual(1);
});

it('returns the previous state given an unknown action', function () {
  var reduce = (0, _createReducer4.default)(0, {
    EXPECTED: function EXPECTED(prev) {
      return prev + 1;
    }
  });

  expect(reduce(1, { type: 'UNEXPECTED' })).toEqual(1);
});