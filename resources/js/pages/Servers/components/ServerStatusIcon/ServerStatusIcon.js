import React from 'react';
import PropTypes from 'prop-types';
import StopIcon from '@material-ui/icons/Stop';
import CheckIcon from '@material-ui/icons/Check';
import LoopIcon from '@material-ui/icons/Loop';
import IconButton from '@material-ui/core/IconButton';

const ServerStatusIcon = (props) => {
  const { server } = props;

  const renderIcon = () => {
    if (server.status === 'stopped') {
      return <StopIcon color="error" />;
    }

    if (server.status === 'running') {
      return <CheckIcon color="primary" />;
    }

    if (server.status === 'creating') {
      return <LoopIcon className="icon-spin" color="action" />;
    }
  };

  return (
    <IconButton>
      {renderIcon()}
    </IconButton>
  );
};

ServerStatusIcon.propTypes = {
  server: PropTypes.object.isRequired
};

export default ServerStatusIcon;
