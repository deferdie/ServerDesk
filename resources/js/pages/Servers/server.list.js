import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';

// Components
import { ServersToolbar, ServerTable } from './components';
import Modal from '../../components/Modal';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const UserList = () => {
  const classes = useStyles();

  const [servers, setServers] = useState([]);

  useEffect(() => {
    // Fetch all of the servers for the user
    axios.get('/api/servers').then((data) => {
      setServers(data.data.data);
    });
  }, []);

  return (
    <div className={classes.root}>
      <ServersToolbar />
      <div className={classes.content}>
        <ServerTable servers={servers} />
      </div>
      <Modal open title="test">
        <ServerTable servers={servers} />

      </Modal>
    </div>
  );
};

export default UserList;
