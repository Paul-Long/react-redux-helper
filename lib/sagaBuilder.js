'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

exports.default = sagaBuilder;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _effects3 = require('redux-saga/lib/effects');

var sagaEffects = _interopRequireWildcard(_effects3);

var _sagaHelpers = require('redux-saga/lib/internal/sagaHelpers');

var _constants = require('./constants');

var _prefixType = require('./prefixType');

var _prefixType2 = _interopRequireDefault(_prefixType);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sagaBuilder(opts) {
  var models = opts.models;

  var sagas = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = models[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var model = _step.value;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = model[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var m = _step2.value;

          if (m.effects) {
            sagas.push(createSaga(m.effects, m));
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

  console.log(sagas);
  return sagas;
}

function createSaga(effects, model) {
  return (/*#__PURE__*/_regenerator2.default.mark(function _callee3() {
      var _this = this;

      var key;
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              console.log(effects);
              _context3.t0 = _regenerator2.default.keys(effects);

            case 2:
              if ((_context3.t1 = _context3.t0()).done) {
                _context3.next = 8;
                break;
              }

              key = _context3.t1.value;

              if (!Object.prototype.hasOwnProperty.call(effects, key)) {
                _context3.next = 6;
                break;
              }

              return _context3.delegateYield( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                var watcher, task;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        watcher = getWatcher({
                          key: key,
                          _effects: effects[key],
                          model: model,
                          onEffect: []
                        });
                        _context2.next = 3;
                        return sagaEffects.fork(watcher);

                      case 3:
                        task = _context2.sent;
                        _context2.next = 6;
                        return sagaEffects.fork( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                          return _regenerator2.default.wrap(function _callee$(_context) {
                            while (1) {
                              switch (_context.prev = _context.next) {
                                case 0:
                                  _context.next = 2;
                                  return sagaEffects.take('' + model.namespace + _constants.NAMESPACE_SEP + 'CANCEL_EFFECTS');

                                case 2:
                                  _context.next = 4;
                                  return sagaEffects.cancel(task);

                                case 4:
                                case 'end':
                                  return _context.stop();
                              }
                            }
                          }, _callee, this);
                        }));

                      case 6:
                      case 'end':
                        return _context2.stop();
                    }
                  }
                }, _callee2, _this);
              })(), 't2', 6);

            case 6:
              _context3.next = 2;
              break;

            case 8:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    })
  );
}

function getWatcher(_ref) {
  var _marked = /*#__PURE__*/_regenerator2.default.mark(sagaWithCatch);

  var key = _ref.key,
      _effects = _ref._effects,
      model = _ref.model,
      onEffect = _ref.onEffect;

  var effect = _effects;
  var type = 'takeEvery';
  var ms = void 0;
  if (Array.isArray(_effects)) {
    var _effects2 = (0, _slicedToArray3.default)(_effects, 2),
        e = _effects2[0],
        opts = _effects2[1];

    effect = e;
    var t = opts.type;
    var m = opts.ms;
    if (opts && t) {
      type = t;
    }
    if (type === 'throttle') {
      (0, _invariant2.default)(m, 'model.effect: opts.ms should be defined if type is throttle');
      ms = m;
    }
    (0, _invariant2.default)(['takeEvery', 'takeLatest', 'throttle'].indexOf(type) > -1, 'model.effect: effect type should be takeEvery, takeLatest, throttle');
  }

  function sagaWithCatch() {
    for (var _len = arguments.length, arg = Array(_len), _key = 0; _key < _len; _key++) {
      arg[_key] = arguments[_key];
    }

    return _regenerator2.default.wrap(function sagaWithCatch$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            console.log(arg);
            _context4.prev = 1;
            _context4.next = 4;
            return effect.apply(undefined, arg);

          case 4:
            _context4.next = 9;
            break;

          case 6:
            _context4.prev = 6;
            _context4.t0 = _context4['catch'](1);
            throw Error(_context4.t0);

          case 9:
          case 'end':
            return _context4.stop();
        }
      }
    }, _marked, this, [[1, 6]]);
  }

  var sagaWithOnEffect = applyOnEffect({ onEffect: onEffect, sagaWithCatch: sagaWithCatch, model: model, key: key });

  var action = '' + model.namespace + _constants.NAMESPACE_SEP + key;

  switch (type) {
    case 'watcher':
      return sagaWithCatch;
    case 'takeLatest':
      return (/*#__PURE__*/_regenerator2.default.mark(function _callee4() {
          return _regenerator2.default.wrap(function _callee4$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  _context5.next = 2;
                  return (0, _sagaHelpers.takeLatestHelper)(action, sagaWithOnEffect);

                case 2:
                case 'end':
                  return _context5.stop();
              }
            }
          }, _callee4, this);
        })
      );
    case 'throttle':
      return (/*#__PURE__*/_regenerator2.default.mark(function _callee5() {
          return _regenerator2.default.wrap(function _callee5$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  _context6.next = 2;
                  return (0, _sagaHelpers.throttleHelper)(ms, action, sagaWithOnEffect);

                case 2:
                case 'end':
                  return _context6.stop();
              }
            }
          }, _callee5, this);
        })
      );
    default:
      return (/*#__PURE__*/_regenerator2.default.mark(function _callee6() {
          return _regenerator2.default.wrap(function _callee6$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  _context7.next = 2;
                  return (0, _sagaHelpers.takeEveryHelper)(action, sagaWithOnEffect);

                case 2:
                case 'end':
                  return _context7.stop();
              }
            }
          }, _callee6, this);
        })
      );
  }
}

function applyOnEffect(_ref2) {
  var onEffect = _ref2.onEffect,
      sagaWithCatch = _ref2.sagaWithCatch,
      model = _ref2.model,
      key = _ref2.key;
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = onEffect[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var fn = _step3.value;

      sagaWithCatch = fn(sagaWithCatch, sagaEffects, model, key);
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  return sagaWithCatch;
}