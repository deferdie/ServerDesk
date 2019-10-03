import './bootstrap';
import React from 'react';
import ReactDOM from 'react-dom';
import store from './store';
import App from './router';
import { Provider } from 'react-redux';
import { ToastProvider } from 'react-toast-notifications';

ReactDOM.render(
  <Provider store={store}>
    <ToastProvider placement="bottom-right">
      <App />
    </ToastProvider>
  </Provider>,
  document.getElementById('app')
);
