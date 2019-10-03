import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';

// Components
import { ServerProviderToolbar, ServerProviderTable, ServerProviderForm } from './components';
import Modal from '../../components/Modal';
import { destructServerErrors } from '../../helpers/error';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const ServerProviderList = () => {
  const classes = useStyles();

  const [providers, setProviders] = useState([]);
  const [showProviderForm, setShowProviderForm] = useState(false);
  const [providerFormErrors, setProviderFormErrors] = useState({});
  const [providerFormData, setProviderFormData] = useState({
    key: null,
    name: null,
    server_provider_id: ''
  });

  useEffect(() => {
    // Fetch all of the server providers for this user
    axios.get('/api/user/server-providers').then((data) => {
      setProviders(data.data.data);
    });
  }, []);

  const submitProviderCreateForm = () => {
    axios.post('/api/user/server-providers', providerFormData).then(data => {
      const p = [...providers];
      p.push(data.data.data);
      setProviders(p);
      setShowProviderForm(false);
    }).catch(error => setProviderFormErrors(destructServerErrors(error)));
  };

  return (
    <div className={classes.root}>
      <ServerProviderToolbar onAddProvider={() => setShowProviderForm(true)} />
      <div className={classes.content}>
        <ServerProviderTable providers={providers} />
      </div>
      <Modal
        title="Link your provider"
        saveButton="Create Provider"
        open={showProviderForm}
        onClose={() => setShowProviderForm(false)}
        onSave={submitProviderCreateForm}
      >
        <ServerProviderForm
          providers={providers}
          formErrors={providerFormErrors}
          providerFormData={providerFormData}
          setProviderFormData={setProviderFormData}
        />
      </Modal>
    </div>
  );
};

export default ServerProviderList;
