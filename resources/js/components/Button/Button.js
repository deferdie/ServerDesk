import React from 'react';
import PropTypes from 'prop-types';
import { Button as MuiButton } from '@material-ui/core';
import ClipLoader from 'react-spinners/ClipLoader';

const Button = (props) => {
  const { children, loading, ...rest } = props;
  return (
    <MuiButton
      {...rest}
      variant="contained"
      disabled={loading}
    >
      {loading ? (<ClipLoader
        sizeUnit={'px'}
        size={20}
        color={'#123abc'}
        loading={loading}
      />) : children}
    </MuiButton>
  );
};

Button.defaultProps = {
  loading: false
};

Button.propTypes = {
  loading: PropTypes.bool,
  children: PropTypes.any
};

export default Button;
