import createSagaMiddleware from 'redux-saga';
import createStore from './createStore';
import reducerBuilder from './reducerBuilder';
import {
  run as runSubscription,
} from './subscription';

export function create(hooksAndOpts = {}, createOpts = {}) {
  const { setupApp } = createOpts;
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
        reducerMiddleware: app._reducerMiddleware,
      }),
      initialState: hooksAndOpts.initialState || {},
      sagaMiddleware,
    });
    store.runSaga = sagaMiddleware.run;
    app._store = store;

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
