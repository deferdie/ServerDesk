import Echo from 'laravel-echo';
import { SET_AUTHENTICATED, SET_USER_DATA, SET_ECHO } from '../actions/auth';

export default (state = { user: null, authenticated: false }, action) => {
  switch (action.type) {
    case SET_USER_DATA:
      return Object.assign({}, state, { user: action.user });
    case SET_AUTHENTICATED:
      return Object.assign({}, state, { authenticated: action.authenticated });
    case SET_ECHO:
      let echo = new Echo({
        broadcaster: 'pusher',
        key: process.env.MIX_PUSHER_APP_KEY,
        cluster: process.env.MIX_PUSHER_APP_CLUSTER,
        encrypted: true,
        authEndpoint: '/api/broadcasting/auth',
        auth: {
          headers: {
            Authorization: 'Bearer ' + action.echo
          }
        }
      });
      return Object.assign({}, state, { echo: echo });
    default:
      return state;
  }
};
