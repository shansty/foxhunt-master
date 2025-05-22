import React from 'react';
import ReactDOM from 'react-dom';

import Axios from 'axios';
import App from './App';
import * as serviceWorker from './serviceWorker';

Axios.defaults.baseURL = 'http://localhost:8080';
Axios.defaults.headers.common['AUTHORIZATION'] = 'AUTH TOKEN';
Axios.defaults.headers.common['Content-Type'] = 'application/json';

ReactDOM.render(<App />, document.getElementById('root'));

Axios.interceptors.request.use(
  (request) => {
    console.log(request);
    return request;
  },
  (error) => {
    console.log(error);
    Promise.reject(error);
  },
);

Axios.interceptors.response.use(
  (response) => {
    console.log(response);
    return response;
  },
  (error) => {
    console.log(error);
    Promise.reject(error);
  },
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
