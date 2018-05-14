'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var reducers = opts.reducers,
      initialState = opts.initialState,
      sagaMiddleware = opts.sagaMiddleware;

  var devtools = function devtools() {
    return function (noop) {
      return noop;
    };
  };
  if (process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION__) {
    devtools = window.__REDUX_DEVTOOLS_EXTENSION__;
  }
  var middlewares = [sagaMiddleware];
  var enhancers = [_redux.applyMiddleware.apply(undefined, middlewares), devtools(window.__REDUX_DEVTOOLS_EXTENSION__OPTIONS)];
  return (0, _redux.createStore)(reducers, initialState, _redux.compose.apply(undefined, enhancers));
};

var _redux = require('redux');