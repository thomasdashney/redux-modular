'use strict';

var _combineReducers = require('../combine-reducers');

var _combineReducers2 = _interopRequireDefault(_combineReducers);

var _createActions = require('../create-actions');

var _createActions2 = _interopRequireDefault(_createActions);

var _createReducer2 = require('../create-reducer');

var _createReducer3 = _interopRequireDefault(_createReducer2);

var _modularize = require('../modularize');

var _modularize2 = _interopRequireDefault(_modularize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } /* eslint-env jest */

it('enables dynamic modularization of actions', function () {
  var createLogic = (0, _modularize2.default)({
    actions: {
      increment: function increment() {
        return null;
      }
    }
  });

  var logic = createLogic('path.to.module');
  expect(logic).toHaveProperty('actions');
  expect(logic.actions).toHaveProperty('increment');
  expect(logic.actions.increment.toString()).toEqual('increment (path.to.module)');
});

it('enables dynamic modularization of reducers to actions', function () {
  var localizedActions = (0, _createActions2.default)({
    increment: function increment() {
      return null;
    }
  });

  var localizedReducer = function localizedReducer(actions) {
    var _createReducer;

    return (0, _combineReducers2.default)({
      value: (0, _createReducer3.default)(0, (_createReducer = {}, _defineProperty(_createReducer, actions.increment, function (prev) {
        return prev + 1;
      }), _defineProperty(_createReducer, 'SET_TO_0', function SET_TO_0() {
        return 0;
      }), _createReducer))
    });
  };
  var createLogic = (0, _modularize2.default)({ actions: localizedActions, reducer: localizedReducer });
  var logic = createLogic('path.to.module');
  expect(logic).toHaveProperty('reducer');

  var reducer = logic.reducer,
      actions = logic.actions;

  expect(reducer(undefined, { type: '@@INIT' })).toEqual(localizedReducer(localizedActions)(undefined, { type: '@@INIT' }));

  expect(reducer({ value: 1 }, localizedActions.increment())).toEqual({ value: 1 });
  expect(reducer({ value: 1 }, actions.increment())).toEqual({ value: 2 });
  expect(reducer({ value: 5 }, { type: 'SET_TO_0' })).toEqual({ value: 0 });
});

it('enables dynamic modularization of selectors', function () {
  var logic = (0, _modularize2.default)({
    selectors: function selectors(localSelector) {
      return {
        mySelector: function mySelector(state) {
          return localSelector(state);
        }
      };
    }
  })('nested.path');

  expect(logic).toHaveProperty('selectors');
  expect(logic.selectors).toHaveProperty('mySelector');
  var state = {
    nested: {
      path: { modularized: 'state' }
    }
  };
  expect(logic.selectors.mySelector(state)).toEqual({ modularized: 'state' });
});