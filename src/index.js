import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import invariant from 'invariant';
import createHashHistory from 'history/createHashHistory';
import * as core from './core';
import { isFunction, isString, isHTMLElement } from './utils';

export default function (opts = {}) {
  const history = opts.history || createHashHistory();
  const createOpts = {
    setupApp(app) {
      app._history = patchHistory(history);
    },
  };
  const app = core.create(opts, createOpts);
  const oldAppStart = app.start;
  app.router = router;
  app.start = start;
  return app;

  function start(container) {
    if (isString(container)) {
      container = document.querySelector(container);
      invariant(
        container,
        `[app.start] container ${container} not found`,
      );
    }

    invariant(
      !container || isHTMLElement(container),
      `[app.start] container should be HTMLElement`,
    );

    invariant(
      app._router,
      `[app.router] router must be registered before app.start()`,
    );

    if (!app._store) {
      oldAppStart.call(app);
    }

    const store = app._store;

    if (container) {
      render(container, store, app, app._router);
    } else {
      return getProvider(store, this, this._router);
    }
  }

  function router(router) {
    invariant(
      isFunction(router),
      `[app.router] router should be function, but got ${typeof router}`,
    );
    app._router = router;
  }
}

function getProvider(store, app, router) {
  return (
    <Provider store={store}>
      {router({ app })}
    </Provider>
  );
}

function render(container, store, app, router) {
  ReactDOM.render(getProvider(store, app, router), container);
}

function patchHistory(history) {
  const oldListen = history.listen;
  history.listen = (callback) => {
    callback(history.location);
    return oldListen.call(history, callback);
  };
  return history;
}
