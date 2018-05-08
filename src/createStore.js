import { createStore, compose } from 'redux';

export default function (opts = {}) {
  const {
    reducers,
    initialState,
  } = opts;
  let devtools = () => noop => noop;
  if (
    process.env.NODE_ENV !== 'production' &&
    window.__REDUX_DEVTOOLS_EXTENSION__
  ) {
    devtools = window.__REDUX_DEVTOOLS_EXTENSION__;
  }
  const enhancers = [
    devtools(window.__REDUX_DEVTOOLS_EXTENSION__OPTIONS),
  ];
  return createStore(reducers, initialState, compose(...enhancers));
}
