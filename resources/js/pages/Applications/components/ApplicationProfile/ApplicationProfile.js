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
import { ApplicationAvatar } from '../../components';

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

const ApplicationProfile = (props) => {
  const { className, application, ...rest } = props;

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
                {application.domain}
              </Typography>
              <Typography
                className={classes.ip_address}
                color="textSecondary"
                variant="body1"
              >
                on server : {application.server.name}
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
      </Card>
    </React.Fragment>
  );
};

ApplicationProfile.propTypes = {
  className: PropTypes.object,
  application: PropTypes.object
};

export default ApplicationProfile;