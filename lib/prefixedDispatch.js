'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.default = prefixedDispatch;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _prefixType = require('./prefixType');

var _prefixType2 = _interopRequireDefault(_prefixType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function prefixedDispatch(dispath, model) {
  return function (action) {
    var type = action.type;

    (0, _invariant2.default)(type, 'dispatch: action should be plain Object with type');
    return dispath((0, _extends3.default)({}, action, { type: (0, _prefixType2.default)(type, model) }));
  };
}