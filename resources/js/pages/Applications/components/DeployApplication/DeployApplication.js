import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Button
} from '@material-ui/core';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
  deploy: {
    background: '#dd8d3a'
  }
}));

const DeployApplication = (props) => {
  const { application } = props;
  const classes = useStyles();

  const deploy = () => {
    axios.post(`/api/applications/${application.id}/deploy`).then((data) => {
      console.log('deploying', data);
    });
  };

  return (
    <Button
      className={classes.deploy}
      variant="contained"
      onClick={deploy}
    >
      Deploy
    </Button>
  );
};

DeployApplication.propTypes = {
  application: PropTypes.object.isRequired
};

export default DeployApplication;
