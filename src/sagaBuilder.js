import invariant from 'invariant';
import * as sagaEffects from 'redux-saga/lib/effects';
import {
  takeEveryHelper as takeEvery,
  takeLatestHelper as takeLatest,
  throttleHelper as throttle,
} from 'redux-saga/lib/internal/sagaHelpers';
import { NAMESPACE_SEP } from './constants';
import prefixType from './prefixType';

type BuilderOpts = {
  models: Array
};
export default function sagaBuilder(opts: BuilderOpts) {
  const { models } = opts;
  const sagas = [];
  for (const model of models) {
    for (const m of model) {
      if (m.effects) {
        sagas.push(createSaga(m.effects, m));
      }
    }
  }
  return sagas;
}

function createSaga(effects, model) {
  return function* () {
    for (const key in effects) {
      if (Object.prototype.hasOwnProperty.call(effects, key)) {
        const watcher = getWatcher({
          key,
          effects: effects[key],
          model,
          onEffect: [],
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


function getWatcher({ key, _effect, model, onEffect }) {
  let effect = _effect;
  let type = 'takeEvery';
  let ms;
  if (Array.isArray(_effect)) {
    const [e, opts] = _effect;
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
      yield effect(...arg);
    } catch (err) {
      throw Error(err);
    }
  }

  const sagaWithOnEffect = applyOnEffect({ onEffect, sagaWithCatch, model, key });

  const action = prefixType(key, model);

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
  for (const fn of onEffect) {
    sagaWithCatch = fn(sagaWithCatch, sagaEffects, model, key);
  }
  return sagaWithCatch;
}
