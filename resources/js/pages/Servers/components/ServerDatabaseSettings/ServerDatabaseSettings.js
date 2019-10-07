import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  Button,
  Divider,
  CardContent,
  CardActions,
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
              Database settings - MySQL
            </Typography>
            {/* Databases */}

          </React.Fragment>
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            color="primary"
            variant="contained"
          >
            Create database
          </Button>
          <Button
            color="primary"
            variant="contained"
          >
            Add user
          </Button>
        </CardActions>
      </Card>
    </React.Fragment>
  );
};

ServerDatabaseSettings.propTypes = {
  server: PropTypes.object,
  className: PropTypes.object
};

export default ServerDatabaseSettings;
