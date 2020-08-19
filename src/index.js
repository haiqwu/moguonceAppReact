import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './Routes';
import './index.css';

import 'bootstrap/dist/js/bootstrap.bundle';
import 'bootstrap/dist/css/bootstrap.css';

import ReduxPromise from 'redux-promise';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { rootReducer } from './reducers/root.reducer';
const createStoreWithMiddleware = applyMiddleware(ReduxPromise)(createStore);

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(rootReducer)}>
    <Routes />
  </Provider>,
  document.getElementById('root')
);
