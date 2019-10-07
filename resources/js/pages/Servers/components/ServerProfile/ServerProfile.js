import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  Typography
} from '@material-ui/core';

// Components
import { ServerProviderLogo } from '../../../ServerProviders/components';

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: '15px'
  },
  details: {
    display: 'flex'
  },
  avatar: {
    marginLeft: 'auto',
    height: 110,
    width: 100,
    flexShrink: 0,
    flexGrow: 0
  }
}));

const ServerProfile = (props) => {
  const { className, server, ...rest } = props;

  const classes = useStyles();

  return (
    <React.Fragment>
      <Card
        {...rest}
        className={clsx(classes.root, className)}
      >
        <CardContent>
          <div className={classes.details}>
            <div>
              <Typography
                gutterBottom
                variant="h2"
              >
                {server.name}
              </Typography>
              <Typography
                className={classes.locationText}
                color="textSecondary"
                variant="body1"
              >
                {server.ip_address}
              </Typography>
              <Typography
                className={classes.dateText}
                color="textSecondary"
                variant="body1"
              >
                {moment(server.created_at).format('DD/MM/YYYY')}
              </Typography>
            </div>
            <ServerProviderLogo className={classes.avatar} serverProvider={server.server_provider} />
          </div>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

ServerProfile.propTypes = {
  server: PropTypes.object,
  className: PropTypes.object
};

export default ServerProfile;
