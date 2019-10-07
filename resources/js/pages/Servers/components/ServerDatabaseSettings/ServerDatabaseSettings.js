import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  Typography
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: '15px'
  },
  details: {
    display: 'flex'
  }
}));

const ServerDatabaseSettings = (props) => {
  const { className, server, ...rest } = props;

  const classes = useStyles();

  return (
    <React.Fragment>
      <Card
        {...rest}
        className={clsx(classes.root, className)}
      >
        <CardContent>
          <React.Fragment>
            <Typography
              gutterBottom
              variant="h4"
            >
              Database settings
            </Typography>
          </React.Fragment>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

ServerDatabaseSettings.propTypes = {
  server: PropTypes.object,
  className: PropTypes.object
};

export default ServerDatabaseSettings;
