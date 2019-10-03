import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';

// Components
import { ServerProviderToolbar, ServerProviderTable, ServerProviderForm } from './components';
import Modal from '../../components/Modal';

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

  useEffect(() => {
    // Fetch all of the server providers for this user
    axios.get('/api/user/server-providers').then((data) => {
      setProviders(data.data.data);
    });
  }, []);

  return (
    <div className={classes.root}>
      <ServerProviderToolbar onAddProvider={() => setShowProviderForm(true)} />
      <div className={classes.content}>
        <ServerProviderTable providers={providers} />
      </div>
      <Modal title="test" open={showProviderForm} onClose={() => setShowProviderForm(false)}>
        <ServerProviderForm providers={providers} />
      </Modal>
    </div>
  );
};

export default ServerProviderList;
