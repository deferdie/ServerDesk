import React from 'react';
import { Avatar } from '@material-ui/core';
import PropTypes from 'prop-types';

const ServerProviderLogo = (props) => {
  const { className, serverProvider } = props;

  const serverLogos = {
    'Digital Ocean': '/images/providers/do.png'
  };

  return (
    <Avatar
      className={className}
      src={serverLogos[serverProvider.name]}
    />
  );
};

ServerProviderLogo.propTypes = {
  className: PropTypes.string,
  serverProvider: PropTypes.object
};

export default ServerProviderLogo;
