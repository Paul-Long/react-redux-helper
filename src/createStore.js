import {createStore, compose} from 'redux';

export default function (opts = {}) {
  const {
    reducers,
    initialState
  } = opts;
  return createStore(reducers, initialState, compose());
}
