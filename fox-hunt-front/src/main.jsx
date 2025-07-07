import React from 'react';
import Axios from 'axios';
import App from './App';
import ReactDOM from 'react-dom/client';

Axios.defaults.baseURL = 'http://localhost:8080';
Axios.defaults.headers.common['AUTHORIZATION'] = 'AUTH TOKEN';
Axios.defaults.headers.common['Content-Type'] = 'application/json';

Axios.interceptors.request.use(
  (request) => {
    console.log('Request:', request);
    return request;
  },
  (error) => {
    console.log('Request error:', error);
    return Promise.reject(error);
  },
);

Axios.interceptors.response.use(
  (response) => {
    console.log('Response:', response);
    return response;
  },
  (error) => {
    console.log('Response error:', error);
    return Promise.reject(error);
  },
);

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>,
  //https://github.com/gribnoysup/react-yandex-maps/issues/333
  //https://stackoverflow.com/questions/61254372/my-react-component-is-rendering-twice-because-of-strict-mode
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
