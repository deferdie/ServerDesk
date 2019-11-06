/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React, { forwardRef } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { List, ListItem, Button, colors, Divider } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import { connect } from 'react-redux';

// Components
import { setShowNotifications } from '../../../../../../actions/notifications';

const useStyles = makeStyles(theme => ({
  root: {},
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0
  },
  button: {
    color: '#fff',
    padding: '10px 8px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    fontWeight: theme.typography.fontWeightMedium
  },
  icon: {
    color: '#fff',
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1)
  },
  active: {
    color: '#a0ff81',
    fontWeight: theme.typography.fontWeightMedium,
    '& $icon': {
      color: '#a0ff81'
    }
  }
}));

const CustomRouterLink = forwardRef((props, ref) => (
  <div
    ref={ref}
    style={{ flexGrow: 1 }}
  >
    <RouterLink {...props} />
  </div>
));

const SidebarNav = props => {
  const {
    pages,
    className,
    setShowNotifications
  } = props;

  const classes = useStyles();

  return (
    <List
      className={clsx(classes.root, className)}
    >
      {pages.map(page => (
        <ListItem
          className={classes.item}
          disableGutters
          key={page.title}
        >
          <Button
            activeClassName={classes.active}
            className={classes.button}
            component={CustomRouterLink}
            to={page.href}
          >
            <div className={classes.icon}>{page.icon}</div>
            {page.title}
          </Button>
        </ListItem>
      ))}

      <Divider />

      <ListItem
        className={classes.item}
        disableGutters
      >
        <Button
          activeClassName={classes.active}
          className={classes.button}
          onClick={() => setShowNotifications(true) }
        >
          <div className={classes.icon}>
            <NotificationsIcon />
          </div>
          Notifications
        </Button>
      </ListItem>
    </List>
  );
};

SidebarNav.propTypes = {
  className: PropTypes.string,
  pages: PropTypes.array.isRequired,
  setShowNotifications: PropTypes.func.isRequired
};

const mapDispatchToProps = {
  setShowNotifications
};

export default connect(null, mapDispatchToProps)(SidebarNav);
