import createSagaMiddleware from 'redux-saga';
import createStore from './createStore';
import reducerBuilder from './reducerBuilder';
import sagaBuilder from './sagaBuilder';
import {
  run as runSubscription,
} from './subscription';
import { onError as errorHelper } from './utils';

export default function create(hooksAndOpts = {}, createOpts = {}) {
  const { setupApp, onError: onErr, onEffect, onReducer } = createOpts;
  const app = {
    _models: [],
    model,
    models,
    start,
    reducerMiddleware,
  };

  return app;

  function model(model) {
    app._models.push(model);
  }

  function models(models) {
    app._models = [...app._models, ...models];
  }

  function reducerMiddleware(middleware) {
    app._reducerMiddleware = middleware;
  }

  function start() {
    const sagaMiddleware = createSagaMiddleware();
    const store = createStore({
      reducers: reducerBuilder({
        models: app._models,
        onReducer,
      }),
      initialState: hooksAndOpts.initialState || {},
      sagaMiddleware,
    });
    app._store = store;

    store.runSaga = sagaMiddleware.run;
    const onError = errorHelper(app, onErr);
    const sagas = sagaBuilder({ models: app._models, onError, onEffect });

    sagas.forEach(sagaMiddleware.run);
    setupApp(app);

    for (const model of this._models) {
      for (const m of model) {
        if (m.subscriptions) {
          runSubscription(m.subscriptions, m, app, () => null);
        }
      }
    }
  }
}
