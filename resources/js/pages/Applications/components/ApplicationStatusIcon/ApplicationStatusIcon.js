import React from 'react';
import PropTypes from 'prop-types';
import CheckIcon from '@material-ui/icons/Check';
import LoopIcon from '@material-ui/icons/Loop';

const ApplicationStatusIcon = (props) => {
  const { application } = props;

  const renderIcon = () => {
    if (application.status === 'running') {
      return <CheckIcon color="primary" />;
    }

    if (application.status === 'deploying') {
      return <LoopIcon className="icon-spin" color="action" />;
    }

    if (application.status === 'deleting') {
      return <LoopIcon className="icon-spin" color="error" />;
    }

    return <LoopIcon className="icon-spin" color="action" />;
  };

  return (
    renderIcon()
  );
};

ApplicationStatusIcon.propTypes = {
  application: PropTypes.object.isRequired
};

export default ApplicationStatusIcon;
