'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

exports.default = function () {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var onError = opts.onError,
      onEffect = opts.onEffect,
      onReducer = opts.onReducer;

  var history = opts.history || (0, _createHashHistory2.default)();
  var createOpts = {
    setupApp: function setupApp(app) {
      app._history = patchHistory(history);
    },

    onError: onError,
    onEffect: onEffect,
    onReducer: onReducer
  };
  var app = (0, _core2.default)(opts, createOpts);
  var oldAppStart = app.start;
  app.router = router;
  app.start = start;
  return app;

  function start(container) {
    if ((0, _utils.isString)(container)) {
      container = document.querySelector(container);
      (0, _invariant2.default)(container, '[app.start] container ' + container + ' not found');
    }

    (0, _invariant2.default)(!container || (0, _utils.isHTMLElement)(container), '[app.start] container should be HTMLElement');

    (0, _invariant2.default)(app._router, '[app.router] router must be registered before app.start()');

    if (!app._store) {
      oldAppStart.call(app);
    }

    var store = app._store;

    if (container) {
      render(container, store, app, app._router);
    } else {
      return getProvider(store, this, this._router);
    }
  }

  function router(router) {
    (0, _invariant2.default)((0, _utils.isFunction)(router), '[app.router] router should be function, but got ' + (typeof router === 'undefined' ? 'undefined' : (0, _typeof3.default)(router)));
    app._router = router;
  }
};

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRedux = require('react-redux');

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _createHashHistory = require('history/createHashHistory');

var _createHashHistory2 = _interopRequireDefault(_createHashHistory);

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getProvider(store, app, router) {
  return _react2.default.createElement(
    _reactRedux.Provider,
    { store: store },
    router({ app: app })
  );
}

function render(container, store, app, router) {
  _reactDom2.default.render(getProvider(store, app, router), container);
}

function patchHistory(history) {
  var oldListen = history.listen;
  history.listen = function (callback) {
    callback(history.location);
    return oldListen.call(history, callback);
  };
  return history;
}