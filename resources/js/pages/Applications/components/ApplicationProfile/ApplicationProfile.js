import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  Button,
  Typography,
  CardContent,
  CardActions
} from '@material-ui/core';

// Components
import {
  ApplicationAvatar,
  DeployApplication,
  ApplicationEnvironment
} from '../../components';

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
  },
  cardAction: {
    background: '#e7e7e7'
  }
}));

const ApplicationProfile = (props) => {
  const { className, application, ...rest } = props;

  const classes = useStyles();

  return (
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
              {application.domain}
            </Typography>
            <Typography
              className={classes.ip_address}
              color="textSecondary"
              variant="body1"
            >
              Deployed on : {application.server.name}
            </Typography>
            <Typography
              className={classes.dateText}
              color="textSecondary"
              variant="body1"
            >
              {moment(application.created_at).format('DD/MM/YYYY')}
            </Typography>
          </div>
          <ApplicationAvatar className={classes.avatar} application={application} />
        </div>
      </CardContent>
      <CardActions className={classes.cardAction}>
        {/* Deploy application */}
        <DeployApplication application={application} />

        {/* Application environment settings */}
        <ApplicationEnvironment application={application} />
      </CardActions>
    </Card>
  );
};

ApplicationProfile.propTypes = {
  className: PropTypes.object,
  application: PropTypes.object
};

export default ApplicationProfile;
