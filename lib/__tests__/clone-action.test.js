'use strict';

var _createAction = require('../create-action');

var _createAction2 = _interopRequireDefault(_createAction);

var _cloneAction = require('../clone-action');

var _cloneAction2 = _interopRequireDefault(_cloneAction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-env jest */

it('maintains functionality', function () {
  var action = (0, _createAction2.default)('SOME_TYPE', function (param) {
    return { param: param };
  });
  var cloned = (0, _cloneAction2.default)(action, 'SOME_TYPE');
  expect(cloned(1)).toEqual({
    type: 'SOME_TYPE',
    payload: { param: 1 },
    meta: null
  });

  expect(cloned.toString()).toEqual('SOME_TYPE');
});

it('allows the type to be set without affecting the original action', function () {
  var action = (0, _createAction2.default)('FIRST');
  var cloned = (0, _cloneAction2.default)(action, 'SECOND');
  expect(action.toString()).toEqual('FIRST');
  expect(cloned.toString()).toEqual('SECOND');
  expect(action().type).toEqual('FIRST');
  expect(cloned().type).toEqual('SECOND');
});

it('maintains _type property', function () {
  var action = (0, _createAction2.default)('TYPE');
  action._type = 'meta';
  var cloned = (0, _cloneAction2.default)(action);
  expect(cloned._type).toEqual('meta');
});