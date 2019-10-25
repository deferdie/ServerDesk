import React, { useState, useEffect } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Toolbar, Badge, Hidden, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import InputIcon from '@material-ui/icons/Input';
import { connect } from 'react-redux';
import axios from 'axios';
import _ from 'lodash';
import { useToasts } from 'react-toast-notifications';

// Components
import { logoutUser } from '../../../../actions/auth';
import { setShowNotifications } from '../../../../actions/notifications';
import Modal from '../../../../components/Modal';
import NotificationList from '../../../../components/Notifications';

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none'
  },
  flexGrow: {
    flexGrow: 1
  },
  signOutButton: {
    marginLeft: theme.spacing(1)
  }
}));

const Topbar = props => {
  const {
    auth,
    history,
    className,
    logoutUser,
    onSidebarOpen,
    showNotifications,
    setShowNotifications,
    ...rest
  } = props;
  const classes = useStyles();
  const [notifications, setNotifications] = useState({});
  const { Echo } = window;
  const { addToast } = useToasts();

  useEffect(() => {
    // Get the user notifications
    axios.get('/api/notifications').then((data) => {
      setNotifications(data.data);

      if (_.get(auth, 'user.id', false)) {
        if (Echo) {
          Echo.private(`App.User.${auth.user.id}`)
            .notification((notification) => {
              let alert = _.get(notification, 'data.alert', 'info');
              let title = _.get(notification, 'data.title');
              updateNotifications(notification, data.data);
              addToast(`${title}`, { appearance: alert, autoDismiss: true });
            });
        }
      }
    });
  }, []);

  const handleLogout = () => {
    logoutUser(() => history.push('/'));
  };

  const updateNotifications = (notification, data) => {
    data.data.unshift(notification);
    setNotifications(data);
  };

  return (
    <AppBar
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Toolbar>
        <RouterLink to="/">
          <img src="/logo.png" style={{height: '50px'}} />
        </RouterLink>
        <div className={classes.flexGrow} />
        <Hidden mdDown>
          <IconButton
            color="inherit"
            onClick={() => setShowNotifications(true)}
          >
            <Badge
              badgeContent={notifications.length}
              color="secondary"
              variant="dot"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            onClick={handleLogout}
            className={classes.signOutButton}
            color="inherit"
          >
            <InputIcon />
          </IconButton>
        </Hidden>
        <Hidden lgUp>
          <IconButton
            color="inherit"
            onClick={onSidebarOpen}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>

      <Modal
        showActionButtons={false}
        title="Your notifications"
        open={showNotifications}
        onClose={() => setShowNotifications(false)}
      >
        <NotificationList
          notifications={notifications}
          setNotifications={setNotifications}
        />
      </Modal>
    </AppBar>
  );
};

Topbar.propTypes = {
  auth: PropTypes.object,
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func,
  history: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
  showNotifications: PropTypes.bool.isRequired,
  setShowNotifications: PropTypes.func.isRequired
};

const mapDispatchToProps = {
  logoutUser,
  setShowNotifications
};
const mapStateToProps = ({ auth, showNotifications }) => ({ auth, showNotifications });

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { pure: false }
)(withRouter(Topbar));
