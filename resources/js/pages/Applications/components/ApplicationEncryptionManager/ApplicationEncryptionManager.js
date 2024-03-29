import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import {
  Card,
  TextField,
  Typography,
  CardContent,
  CardActions
} from '@material-ui/core';
import _ from 'lodash';
import clsx from 'clsx';
import SweetAlert from 'sweetalert-react';

// Components
import EncryptionProfile from './EncryptionProfile';
import ApplicationStatusIcon from '../ApplicationStatusIcon';
import Button from '../../../../components/Button';
import Modal from '../../../../components/Modal';

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: '15px'
  }
}));

const ApplicationEncryptionManager = (props) => {
  const { application, setApplication, className } = props;
  const classes = useStyles();
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [encryptionTypes, setEncryptionTypes] = useState([]);
  const [formData, setFormData] = useState({
    ssl_provider_id: null
  });

  useEffect(() => {
    // Get all of the encryption types
    axios.get('/api/ssl-providers').then((data) => {
      setEncryptionTypes(data.data.data);
    });
  }, []);

  const deploy = () => {
    axios.post(`/api/applications/${application.id}/encrypt`, formData).then((data) => {
      setApplication(data.data.data);
      setShowInstallModal(false);
    });
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
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
        {application.ssl_enabled === 1 && (
          <EncryptionProfile application={application} />
        )}
      </CardContent>
      <CardActions>
        {application.ssl_provider_id === null && (
          <Button
            variant="contained"
            className={classes.deploy}
            onClick={() => setShowInstallModal(true)}
            loading={application.status === 'deploying'}
          >
            {application.status === 'running' ? 'Install certificate' : <ApplicationStatusIcon application={application} />}
          </Button>
        )}
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

      <Modal
        title="Add an SSL to your site"
        open={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        onSave={deploy}
        saveButton="Install"
      >
        <TextField
          fullWidth
          label="Select your provider"
          margin="dense"
          name="ssl_provider_id"
          onChange={handleChange}
          required
          select
          SelectProps={{ native: true }}
          value={formData.ssl_provider_id}
          variant="outlined"
        >
          <option selected>Please select</option>
          {encryptionTypes.map(option => (
            <option
              key={option.id}
              value={option.id}
            >
              {option.label}
            </option>
          ))}
        </TextField>
      </Modal>
    </Card>
  );
};

ApplicationEncryptionManager.propTypes = {
  className: PropTypes.object.isRequired,
  application: PropTypes.object.isRequired,
  setApplication: PropTypes.func.isRequired
};

export default ApplicationEncryptionManager;
