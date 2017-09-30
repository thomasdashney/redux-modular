'use strict';

var _globalActions = require('../global-actions');

var _globalActions2 = _interopRequireDefault(_globalActions);

var _createActions = require('../create-actions');

var _createActions2 = _interopRequireDefault(_createActions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-env jest */

it('creates actions with types including the state path', function () {
  var actions = (0, _globalActions2.default)('path.to.state', {
    increment: function increment() {
      return null;
    }
  });
  expect(actions).toHaveProperty('increment');
  expect(actions.increment.toString()).toEqual('increment (path.to.state)');

  actions = (0, _globalActions2.default)(['path', 'to', 'state'], {
    increment: function increment() {
      return null;
    }
  });
  expect(actions.increment.toString()).toEqual('increment (path.to.state)');
});

it('creates actions with payload creators', function () {
  var actions = (0, _globalActions2.default)('path.to.state', {
    increment: function increment(param1, param2) {
      return { param1: param1, param2: param2 };
    }
  });

  var action = actions.increment('test1', 'test2');
  expect(action).toHaveProperty('payload');
  expect(action.payload).toEqual({
    param1: 'test1',
    param2: 'test2'
  });
});

it('interopts with actions created with createActions', function () {
  var actions = (0, _createActions2.default)({
    increment: function increment(param1, param2) {
      return { param1: param1, param2: param2 };
    }
  });

  var globalizedActions = (0, _globalActions2.default)('path.to.state', actions);
  expect(globalizedActions).toHaveProperty('increment');
  expect(globalizedActions.increment.toString()).toEqual('increment (path.to.state)');
  expect(globalizedActions.increment('test1', 'test2').payload).toEqual({
    param1: 'test1',
    param2: 'test2'
  });
});