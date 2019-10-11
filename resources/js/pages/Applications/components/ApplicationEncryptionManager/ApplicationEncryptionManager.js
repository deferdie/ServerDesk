import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import {
  Card,
  TextField,
  Typography,
  CardContent,
  CardActions,
} from '@material-ui/core';
import _ from 'lodash';

// Components
import EncryptionProfile from './EncryptionProfile';
import ApplicationStatusIcon from '../ApplicationStatusIcon';
import Button from '../../../../components/Button';
import clsx from 'clsx';
import SweetAlert from 'sweetalert-react';

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: '15px'
  }
}));

const ApplicationEncryptionManager = (props) => {
  const { application, setApplication, className } = props;
  const classes = useStyles();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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
    }).then((data) => {
      setApplication(data.data.data);
    });
  };

  const handleChange = (event) => {
    console.log(event);
  };

  const deleteSSL = () => {
    setShowDeleteModal(false);
    axios.delete(`/api/applications/${application.id}/decrypt`).then((data) => {
      setApplication(data.data.data);
    });
  };

  return (
    <Card
      className={clsx(classes.root, className)}
    >
      <CardContent>
        <Typography
          gutterBottom
          variant="h4"
        >
          Application SSL settings
        </Typography>
        <EncryptionProfile />
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          className={classes.deploy}
          loading={application.status === 'deploying'}
        >
          {application.status === 'running' ? 'Deploy' : <ApplicationStatusIcon application={application} />}
        </Button>
        {application.ssl_provider_id && (
          <Button
            variant="contained"
            color="secondary"
            className={classes.deploy}
            onClick={() => setShowDeleteModal(true)}
            loading={application.status === 'deploying'}
          >
            {application.status === 'running' ? 'Delete SSL' : <ApplicationStatusIcon application={application} />}
          </Button>
        )}
      </CardActions>

      {/* Alert to delete a cert */}
      <SweetAlert
        type="error"
        show={showDeleteModal}
        showCancelButton
        title="You are about to delete the SSL certificate for this application!!"
        text={`Are you sure you want to remove the SSL for : ${_.get(application, 'domain')}`}
        onConfirm={deleteSSL}
        onCancel={() => {
          setShowDeleteModal(false);
        }}
      />
    </Card>
  );
};

ApplicationEncryptionManager.propTypes = {
  className: PropTypes.object.isRequired,
  application: PropTypes.object.isRequired
};

export default ApplicationEncryptionManager;
