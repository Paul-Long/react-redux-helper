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

var _sagaBuilder = require('./sagaBuilder');

var _sagaBuilder2 = _interopRequireDefault(_sagaBuilder);

var _subscription = require('./subscription');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function create() {
  var hooksAndOpts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var createOpts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var setupApp = createOpts.setupApp;

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
    var sagas = (0, _sagaBuilder2.default)({ models: app._models });
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

    sagas.forEach(sagaMiddleware.run);
    setupApp(app);

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this._models[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _model = _step.value;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = _model[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var m = _step2.value;

            if (m.subscriptions) {
              (0, _subscription.run)(m.subscriptions, m, app, function () {
                return null;
              });
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }
}