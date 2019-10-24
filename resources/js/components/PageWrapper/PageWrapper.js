import React from 'react';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const PageWrapper = (props) => {
  const { children } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {children}
    </div>
  );
};

PageWrapper.propTypes = {
  children: PropTypes.any
};

export default PageWrapper;
