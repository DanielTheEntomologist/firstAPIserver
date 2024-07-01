import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';

import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.scss';

const root = ReactDOM.createRoot(
  document.querySelector('#root')
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>
);
