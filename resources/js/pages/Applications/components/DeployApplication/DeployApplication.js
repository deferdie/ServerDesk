import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';

// Components
import ApplicationStatusIcon from '../ApplicationStatusIcon';
import Button from '../../../../components/Button';

const useStyles = makeStyles(theme => ({
  deploy: {
    background: '#dd8d3a'
  }
}));

const DeployApplication = (props) => {
  const { application } = props;
  const classes = useStyles();

  const deploy = () => {
    axios.post(`/api/applications/${application.id}/deploy`);
  };

  return (
    <Button
      onClick={deploy}
      variant="contained"
      className={classes.deploy}
      disabled={application.status === 'deploying'}
    >
      {application.status === 'running' ? 'Deploy' : <ApplicationStatusIcon application={application} />}
    </Button>
  );
};

DeployApplication.propTypes = {
  application: PropTypes.object.isRequired
};

export default DeployApplication;
