'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = run;

var _utils = require('./utils');

var _prefixedDispatch = require('./prefixedDispatch');

var _prefixedDispatch2 = _interopRequireDefault(_prefixedDispatch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function run(subs, model, app, onError) {
  var funcs = [];
  var nonFuncs = [];
  for (var key in subs) {
    if (Object.prototype.hasOwnProperty.call(subs, key)) {
      var sub = subs[key];
      var unListener = sub({
        dispatch: (0, _prefixedDispatch2.default)(app._store.dispatch, model),
        history: app._history
      }, onError);
      if ((0, _utils.isFunction)(unListener)) {
        funcs.push(unListener);
      } else {
        nonFuncs.push(key);
      }
    }
  }
  return { funcs: funcs, nonFuncs: nonFuncs };
}