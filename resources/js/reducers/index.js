import { combineReducers } from 'redux';
import auth from './auth';
import loading from './loading';
import showNotifications from './notifications';

export default combineReducers({
  auth,
  loading,
  showNotifications
});
