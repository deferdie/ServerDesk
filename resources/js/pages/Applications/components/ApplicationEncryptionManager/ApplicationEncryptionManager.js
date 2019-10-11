import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';

// Components
import ApplicationStatusIcon from '../ApplicationStatusIcon';
import Button from '../../../../components/Button';

const useStyles = makeStyles(theme => ({
  deploy: {
    background: '#71bd2c'
  }
}));

const ApplicationEncryptionManager = (props) => {
  const { application } = props;
  const classes = useStyles();
  const [encryptionTypes, setEncryptionTypes] = useState([]);

  useEffect(() => {
    // Get all of the encryption types
    axios.get('/api/ssl-providers').then((data) => {
      setEncryptionTypes(data.data.data);
    });
  }, []);

  const deploy = () => {
    axios.post(`/api/applications/${application.id}/encrypt`, {
      ssl_provider_id: 1
    });
  };

  return (
    <Button
      onClick={deploy}
      variant="contained"
      className={classes.deploy}
      loading={application.status === 'deploying'}
    >
      {application.status === 'running' ? 'Deploy' : <ApplicationStatusIcon application={application} />}
    </Button>
  );
};

ApplicationEncryptionManager.propTypes = {
  application: PropTypes.object.isRequired
};

export default ApplicationEncryptionManager;
