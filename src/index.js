import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

console.log('Environment variables check at startup:');
console.log('REACT_APP_OIDC_AUTHORITY:', process.env.REACT_APP_OIDC_AUTHORITY);
console.log('REACT_APP_OIDC_CLIENT_ID:', process.env.REACT_APP_OIDC_CLIENT_ID);
console.log('REACT_APP_OIDC_REDIRECT_URI:', process.env.REACT_APP_OIDC_REDIRECT_URI);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
