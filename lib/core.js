'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

exports.create = create;

var _reduxSaga = require('redux-saga');

var _reduxSaga2 = _interopRequireDefault(_reduxSaga);

var _createStore = require('./createStore');

var _createStore2 = _interopRequireDefault(_createStore);

var _reducerBuilder = require('./reducerBuilder');

var _reducerBuilder2 = _interopRequireDefault(_reducerBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function create() {
  var hooksAndOpts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var app = {
    _models: [],
    model: model,
    models: models,
    start: start,
    reducerMiddleware: reducerMiddleware
  };

  return app;

  function model(model) {
    app._models.push(model);
  }

  function models(models) {
    app._models = [].concat((0, _toConsumableArray3.default)(app._models), (0, _toConsumableArray3.default)(models));
  }

  function reducerMiddleware(middleware) {
    app._reducerMiddleware = middleware;
  }

  function start() {
    var sagaMiddleware = (0, _reduxSaga2.default)();
    var store = (0, _createStore2.default)({
      reducers: (0, _reducerBuilder2.default)({
        models: app._models,
        reducerMiddleware: app._reducerMiddleware
      }),
      initialState: hooksAndOpts.initialState || {},
      sagaMiddleware: sagaMiddleware
    });
    store.runSaga = sagaMiddleware.run;
    app._store = store;
  }
}