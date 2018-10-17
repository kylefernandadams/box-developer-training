import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl-redux';
import { ConnectedRouter } from 'connected-react-router';
import store, { history } from './store';
import App from './components/app';
import './index.css';

const target = document.querySelector('#root');

render(
  <Provider store={store}>
      <ConnectedRouter history={history}>
        <div className="app">
          <App />
        </div>
      </ConnectedRouter>
  </Provider>,
  target
);