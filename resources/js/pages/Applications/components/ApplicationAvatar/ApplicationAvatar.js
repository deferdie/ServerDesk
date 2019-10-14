import React from 'react';
import PropTypes from 'prop-types';
import { Avatar } from '@material-ui/core';

const ApplicationAvatar = (props) => {
  const { application, className } = props;

  const types = {
    'Laravel': '/images/applications/laravel.png',
    'Static HTML': '/images/applications/html.png'
  };

  return (
    <Avatar
      className={className}
      src={types[application.type]}
    />
  );
};

ApplicationAvatar.propTypes = {
  className: PropTypes.object,
  application: PropTypes.object.isRequired
};

export default ApplicationAvatar;
