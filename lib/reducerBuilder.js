'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toArray2 = require('babel-runtime/helpers/toArray');

var _toArray3 = _interopRequireDefault(_toArray2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

exports.default = function (opts) {
  var models = opts.models,
      onReducer = opts.onReducer;

  var groups = new Map();
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = models[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var model = _step.value;

      (0, _invariant2.default)((0, _utils.isArray)(model), 'model should be Array');
      collect(groups, model);
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

  var reducers = {};
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = groups.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var _ref = _step2.value;

      var _ref2 = (0, _slicedToArray3.default)(_ref, 2);

      var key = _ref2[0];
      var reducerGroup = _ref2[1];

      reducers[key] = initial(reducerGroup, onReducer);
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

  return (0, _redux.combineReducers)(reducers);
};

var _redux = require('redux');

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function collect(groups, reducers) {
  for (var index = 0; index < reducers.length; index += 1) {
    var reducer = reducers[index];
    var keys = reducer.namespace.split('.');

    var _keys = (0, _toArray3.default)(keys),
        groupKey = _keys[0],
        subKeys = _keys.slice(1);

    var group = groups.get(groupKey);
    if (!group) {
      group = new Map();
      groups.set(groupKey, group);
    }
    if (subKeys.length === 0) {
      reducer.single = true;
    } else {
      reducer.subKeys = subKeys;
    }
    (0, _invariant2.default)(!(group.has(reducer.namespace) && !reducer.single), 'Duplicate namespace ' + reducer.namespace);
    group.set(reducer.namespace, reducer);
  }
}

function initial(group, onReducer) {
  var handlers = {};
  var initialState = {};
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = group.values()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var model = _step3.value;
      var namespace = model.namespace,
          state = model.state,
          subKeys = model.subKeys,
          single = model.single,
          reducer = model.reducer;

      var value = typeof state === 'undefined' || state === null ? {} : state;
      if (single) {
        initialState = value;
      } else {
        overrideState(initialState, subKeys, value);
      }
      if ((0, _utils.isFunction)(reducer)) {
        handlers[namespace] = reducerHandler(model, reducer, onReducer);
      } else {
        for (var key in reducer) {
          if (Object.prototype.hasOwnProperty.call(reducer, key)) {
            handlers[namespace + '.' + key] = reducerHandler(model, reducer[key], onReducer);
          }
        }
      }
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

  return createReducer(initialState, handlers);
}

function overrideState(state, keys) {
  var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var previous = state;
  for (var i = 0; i < keys.length; i += 1) {
    var next = previous[keys[i]];
    if (i === keys.length - 1) {
      previous[keys[i]] = value;
    } else {
      if (!next) {
        previous[keys[i]] = {};
        next = previous[keys[i]];
      }
      previous = next;
    }
  }
}

function createReducer(initialState, handlers) {
  (0, _invariant2.default)(!(typeof initialState === 'undefined' || initialState === null), 'Initial state is required');
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments[1];

    if (!action || !action.type) {
      return state;
    }
    var handler = handlers[action.type];
    return handler ? handler(state, action) : state;
  };
}

function reducerHandler(model, handler, onReducer) {
  return function (state, action) {
    if (typeof onReducer === 'function') {
      state = onReducer(state, action) || state;
    }
    if (model.single) {
      state = handler(state, action);
    } else {
      overrideState(state, model.subKeys, handler(state, action));
    }
    return state;
  };
}