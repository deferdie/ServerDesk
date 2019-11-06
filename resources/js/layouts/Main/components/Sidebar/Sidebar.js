import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Divider, Drawer } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import CloudIcon from '@material-ui/icons/Cloud';
import DnsIcon from '@material-ui/icons/Dns';
import MergeTypeIcon from '@material-ui/icons/MergeType';
import AppsIcon from '@material-ui/icons/Apps';
import GroupIcon from '@material-ui/icons/Group';
import ImportExportIcon from '@material-ui/icons/ImportExport';

// Components
import { SidebarNav, UpgradePlan } from './components';

const useStyles = makeStyles(theme => ({
  drawer: {
    width: 240,
    [theme.breakpoints.up('lg')]: {
      marginTop: 64,
      height: 'calc(100% - 64px)'
    }
  },
  root: {
    color: '#fff',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    background: 'linear-gradient(-45deg, rgb(19, 19, 40) 0%, rgb(31, 47, 80) 100%);'
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  nav: {
    marginBottom: theme.spacing(2)
  }
}));

const Sidebar = props => {
  const { open, variant, onClose, className, ...rest } = props;

  const classes = useStyles();

  const pages = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: <DashboardIcon />
    },
    {
      title: 'Applications',
      href: '/applications',
      icon: <AppsIcon />
    },
    {
      title: 'Servers',
      href: '/servers',
      icon: <DnsIcon />
    },
    {
      title: 'Uptime',
      href: '/uptime',
      icon: <ImportExportIcon />
    },
    {
      title: 'Servers providers',
      href: '/server-providers',
      icon: <CloudIcon />
    },
    {
      title: 'Source provider',
      href: '/source-providers',
      icon: <MergeTypeIcon />
    },
    {
      title: 'Team',
      href: '/teams',
      icon: <GroupIcon />
    }
  ];

  return (
    <Drawer
      anchor="left"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}
    >
      <div
        {...rest}
        className={clsx(classes.root, className)}
      >
        <SidebarNav
          className={classes.nav}
          pages={pages}
        />
        <UpgradePlan />
      </div>
    </Drawer>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired
};

export default Sidebar;
