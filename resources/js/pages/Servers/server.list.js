import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import _ from 'lodash';

// Components
import { ServersToolbar, ServerTable, ServerForm } from './components';
import Modal from '../../components/Modal';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const ServerList = () => {
  const { Echo } = window;
  const classes = useStyles();
  const [servers, setServers] = useState([]);

  useEffect(() => {
    // Fetch all of the servers for the user
    axios.get('/api/servers').then((data) => {
      let servers = data.data.data;
      setServers(servers);

      servers.map((server) => {
        Echo.private(`server.${server.id}`).listen('ServerUpdated', data => {
          const s = [...servers];
          let serverToUpdate = _.findIndex(s, function (o) { return o.id === data.server.id; });

          s.splice(serverToUpdate, 1, data.server);
          setServers(s);
        });
      });
    });
  }, []);

  return (
    <div className={classes.root}>
      <ServersToolbar />
      <div className={classes.content}>
        <ServerTable servers={servers} />
      </div>
      <Modal title="test">
        <ServerForm />
      </Modal>
    </div>
  );
};

export default ServerList;
