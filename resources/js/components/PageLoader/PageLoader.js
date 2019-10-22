import React from 'react';
import PropTypes from 'prop-types';
import ClipLoader from 'react-spinners/ClipLoader';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh',
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center'
  }
}));

const PageLoader = (props) => {
  const {
    label,
    loading
  } = props;
  const classes = useStyles();

  return (
    <div>
      <div className={classes.root}>
        <ClipLoader
          sizeUnit={'px'}
          size={50}
          color={'#123abc'}
          loading={loading}
        />
        {label !== '' && (
          <p>{label}</p>
        )}
      </div>
    </div>
  );
};

PageLoader.propTypes = {
  label: PropTypes.string,
  loading: PropTypes.bool.isRequired
};

export default PageLoader;
