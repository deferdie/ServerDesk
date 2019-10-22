import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import { useToasts } from 'react-toast-notifications';

// Components
import Modal from '../../components/Modal';
import { destructServerErrors } from '../../helpers/error';
import { ServerProviderToolbar, ServerProviderTable, ServerProviderForm } from './components';
import PageLoader from '../../components/PageLoader/PageLoader';

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
  const { addToast } = useToasts();
  const [providers, setProviders] = useState([]);
  const [showProviderForm, setShowProviderForm] = useState(false);
  const [providerFormErrors, setProviderFormErrors] = useState({});
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const initialFormState = {
    key: null,
    name: null,
    server_provider_id: ''
  };
  const [providerFormData, setProviderFormData] = useState(initialFormState);

  useEffect(() => {
    axios.get('/api/user/server-providers').then((data) => {
      setProviders(data.data.data);
      setPageLoading(false);
    });
  }, []);

  const closeModal = () => {
    setShowProviderForm(false);
    setProviderFormData(initialFormState);
  };

  const submitProviderCreateForm = () => {
    setLoading(true);
    axios.post('/api/user/server-providers', providerFormData).then(data => {
      const p = [...providers];
      let provider = data.data.data;
      p.push(provider);
      setProviders(p);
      closeModal();
      setLoading(false);
      addToast(`We successfully linked your ${provider.name} to your account`, { appearance: 'success', autoDismiss: true });
    }).catch((error) => {
      setProviderFormErrors(destructServerErrors(error));
      setLoading(false);
    });
  };

  if (pageLoading) {
    return (
      <PageLoader loading={pageLoading} />
    );
  }

  return (
    <div className={classes.root}>
      <ServerProviderToolbar onAddProvider={() => setShowProviderForm(true)} />
      <div className={classes.content}>
        <ServerProviderTable
          providers={providers}
          setProviders={setProviders}
        />
      </div>
      <Modal
        loading={loading}
        title="Link your provider"
        saveButton="Create Provider"
        open={showProviderForm}
        onClose={closeModal}
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
