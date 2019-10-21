import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  TextField
} from '@material-ui/core';
import axios from 'axios';
import ClipLoader from 'react-spinners/ClipLoader';
import { useToasts } from 'react-toast-notifications';

// Components
import Modal from '../../../../components/Modal';

const ApplicationEnvironment = (props) => {
  const { application } = props;
  const { addToast } = useToasts();
  const [env, setEnv] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [showEnvForm, setShowEnvForm] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.post(`/api/applications/${application.id}/env`).then((data) => {
      setLoading(false);
      console.log(data.data)
      setEnv(data.data);
    });
  }, []);

  const updateEnv = () => {
    setModalLoading(true);
    axios.put(`/api/applications/${application.id}/env`, {
      'env': env
    }).then(() => {
      setShowEnvForm(false);
      setModalLoading(false);
      addToast(`Environment file updated`, { appearance: 'success', autoDismiss: true });
    });
  };

  return (
    <React.Fragment>
      <Button
        variant="contained"
        onClick={() => setShowEnvForm(true)}
      >
        Manage .env
      </Button>

      <Modal
        title="Update .env"
        open={showEnvForm}
        onClose={() => setShowEnvForm(false)}
        onSave={updateEnv}
        saveButton="Update .env"
        loading={modalLoading}
      >
        <ClipLoader
          sizeUnit={'px'}
          size={20}
          color={'#123abc'}
          loading={loading}
        />
        {!loading && <TextField
          fullWidth
          multiline
          margin="dense"
          rows="10"
          variant="outlined"
          name="env"
          onChange={(e) => setEnv(e.target.value)}
          defaultValue={env}
          label="Update your .env settings here for your application"
          helperText={'Your .env settings will never be saved on your servers'}
        />}
      </Modal>
    </React.Fragment>
  );
};

ApplicationEnvironment.propTypes = {
  application: PropTypes.object.isRequired
};

export default ApplicationEnvironment;
