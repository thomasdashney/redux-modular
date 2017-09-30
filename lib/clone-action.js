'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createAction = require('./create-action');

var _createAction2 = _interopRequireDefault(_createAction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (actionCreator, newType) {
  var clone = (0, _createAction2.default)(newType, actionCreator._payloadCreator, actionCreator._metaCreator);

  clone._type = actionCreator._type;

  return clone;
};