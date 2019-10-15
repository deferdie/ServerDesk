import axios from 'axios';
import _ from 'lodash';
import loadProgressBar from './helpers/progress-bar';
import Echo from 'laravel-echo';
import localforage from 'localforage';
import jwtDecode from 'jwt-decode';

window._ = _;
window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

let token = document.head.querySelector('meta[name="csrf-token"]');

if (token) {
  window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
  console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

loadProgressBar(window.axios);

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

window.Pusher = require('pusher-js');

localforage.getItem('authtoken').then((jwt) => {
  window.Echo = new Echo({
    broadcaster: 'pusher',
    key: process.env.MIX_PUSHER_APP_KEY,
    cluster: process.env.MIX_PUSHER_APP_CLUSTER,
    encrypted: true,
    authEndpoint: '/api/broadcasting/auth',
    auth: {
      headers: {
        Authorization: 'Bearer ' + jwt
      }
    }
  });

  // // Setup an interceptor for axios to check if the jwt has expired
  // window.axios.interceptors.request.use(function (config) {
  //   return config;
  // }, () => {
  //   if ((new Date().getTime() / 1000) > jwtDecode(jwt).exp) {
  //     // Redirect the user back to the login
  //     window.location.href = '/login';
  //   }
  // });
});
