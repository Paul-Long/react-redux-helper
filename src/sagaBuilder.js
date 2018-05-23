import invariant from 'invariant';
import * as sagaEffects from 'redux-saga/lib/effects';
import {
  takeEveryHelper as takeEvery,
  takeLatestHelper as takeLatest,
  throttleHelper as throttle,
} from 'redux-saga/lib/internal/sagaHelpers';
import { NAMESPACE_SEP } from './constants';

type BuilderOpts = {
  models: Array,
  onError: Function,
  onEffect: Function
};
export default function sagaBuilder(opts: BuilderOpts) {
  const { models, onError, onEffect } = opts;
  const sagas = [];
  for (const model of models) {
    for (const m of model) {
      if (m.effects) {
        sagas.push(createSaga(m.effects, m, onError, onEffect));
      }
    }
  }
  return sagas;
}

function createSaga(effects, model, onError, onEffect) {
  return function* () {
    for (const key in effects) {
      if (Object.prototype.hasOwnProperty.call(effects, key)) {
        const watcher = getWatcher({
          key,
          _effects: effects[key],
          model,
          onEffect,
          onError,
        });
        const task = yield sagaEffects.fork(watcher);
        yield sagaEffects.fork(function* () {
          yield sagaEffects.take(`${model.namespace}${NAMESPACE_SEP}CANCEL_EFFECTS`);
          yield sagaEffects.cancel(task);
        });
      }
    }
  };
}


function getWatcher({ key, _effects, model, onEffect, onError }) {
  let effect = _effects;
  let type = 'takeEvery';
  let ms;
  if (Array.isArray(_effects)) {
    const [e, opts] = _effects;
    effect = e;
    const t = opts.type;
    const m = opts.ms;
    if (opts && t) {
      type = t;
    }
    if (type === 'throttle') {
      invariant(
        m,
        'model.effect: opts.ms should be defined if type is throttle',
      );
      ms = m;
    }
    invariant(
      ['takeEvery', 'takeLatest', 'throttle'].indexOf(type) > -1,
      'model.effect: effect type should be takeEvery, takeLatest, throttle',
    );
  }

  function* sagaWithCatch(...arg) {
    try {
      yield effect(...arg, sagaEffects);
    } catch (err) {
      onError(err);
    }
  }

  const sagaWithOnEffect = applyOnEffect({ onEffect, sagaWithCatch, model, key });

  const action = `${model.namespace}${NAMESPACE_SEP}${key}`;

  switch (type) {
    case 'watcher':
      return sagaWithCatch;
    case 'takeLatest':
      return function* () {
        yield takeLatest(action, sagaWithOnEffect);
      };
    case 'throttle':
      return function* () {
        yield throttle(ms, action, sagaWithOnEffect);
      };
    default:
      return function* () {
        yield takeEvery(action, sagaWithOnEffect);
      };
  }
}

function applyOnEffect({ onEffect, sagaWithCatch, model, key }) {
  if (typeof onEffect === 'function') {
    sagaWithCatch = onEffect(sagaWithCatch, sagaEffects, model, key);
  }
  return sagaWithCatch;
}
