'use strict';

var _createAction = require('../create-action');

var _createAction2 = _interopRequireDefault(_createAction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

it('creates an FSA-compliant action creator', function () {
  var someAction = (0, _createAction2.default)('SOME_TYPE');

  expect(someAction('test1', 'test2')).toEqual({
    type: 'SOME_TYPE',
    payload: null,
    meta: null
  });
}); /* eslint-env jest */

it('creates the action using optional payload and meta creators', function () {
  var someAction = (0, _createAction2.default)('SOME_TYPE', function (param1, param2) {
    return { param1: param1, param2: param2 };
  }, function (param1, param2) {
    return { meta1: param1, meta2: param2 };
  });

  expect(someAction('test1', 'test2')).toEqual({
    type: 'SOME_TYPE',
    payload: {
      param1: 'test1',
      param2: 'test2'
    },
    meta: {
      meta1: 'test1',
      meta2: 'test2'
    }
  });
});

it('exposes the action type via toString', function () {
  var TYPE = 'SOME_TYPE';
  expect((0, _createAction2.default)(TYPE).toString()).toEqual(TYPE);
});