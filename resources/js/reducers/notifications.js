import { SHOW_NOTIFICATIONS } from '../actions/notifications';

export default (state = false, action) => {
  switch (action.type) {
    case SHOW_NOTIFICATIONS:
      return action.showNotifications;
    default:
      return state;
  }
};
