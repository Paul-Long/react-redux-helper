import createSagaMiddleware from 'redux-saga';
import createStore from './createStore';
import reducerBuilder from './reducerBuilder';

const helpModel = {
  namespace: '',
  action: '',
  state: 0,
  effect: () => null,
  reducer: (state) => state + 1
};

export function create(hooksAndOpts = {}, createOpts = {}) {

  const app = {
    _models: [],
    model,
    start
  };

  return app;

  function model(model) {
    app._models.push(model);
  }

  function start() {
    const sagaMiddleware = createSagaMiddleware();
    const store = createStore({
      reducers: reducerBuilder()
    });
    store.runSaga = sagaMiddleware.run;
    app._store = store;
  }
}
