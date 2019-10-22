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

// Components
import { logoutUser } from '../../../../actions/auth';
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
    className,
    onSidebarOpen,
    logoutUser,
    history,
    ...rest
  } = props;
  const classes = useStyles();
  const [notifications, setNotifications] = useState({});
  const [showNotifications, setShowNotifications] = useState(false);
  const { Echo } = window;

  useEffect(() => {
    Echo.private(`App.User.${auth.user.id}`)
      .notification((notification) => {
        console.log(notification);
      });

    // Get the user notifications
    axios.get('/api/notifications').then((data) => {
      setNotifications(data.data);
    });
  }, []);

  const handleLogout = () => {
    logoutUser(() => history.push('/'));
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
        <NotificationList notifications={notifications} />
      </Modal>
    </AppBar>
  );
};

Topbar.propTypes = {
  auth: PropTypes.object,
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func,
  history: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired
};

const mapDispatchToProps = { logoutUser };
const mapStateToProps = ({ auth }) => ({ auth });

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { pure: false }
)(withRouter(Topbar));
