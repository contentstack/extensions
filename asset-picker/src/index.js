import React from 'react';
import ReactDOM from 'react-dom';
import '@contentstack/venus-components/build/main.css'
import './index.css';
import App from './App';

const root = document.getElementById('root');
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  root
);

