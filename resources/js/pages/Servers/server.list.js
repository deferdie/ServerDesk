import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import _ from 'lodash';
import { useToasts } from 'react-toast-notifications';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';

// Components
import {
  ServerForm,
  ServerTable,
  ServersToolbar
} from './components';
import Modal from '../../components/Modal';
import { destructServerErrors } from '../../helpers/error';
import PageLoader from '../../components/PageLoader/PageLoader';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const ServerList = (props) => {
  const { auth, showList } = props;
  const classes = useStyles();
  const { addToast } = useToasts();
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showServerForm, setShowServerForm] = useState(false);
  const [serverFormErrors, setServerFormErrors] = useState([]);
  const [serverFormData, setServerFormData] = useState({
    name: '',
    plan: null,
    php_version: '',
    mysql_version: '',
    wants_php: false,
    wants_node: false,
    wants_mysql: false,
    server_provider_id: '',
    provider_server_region: null,
    user_server_provider_credential_id: ''
  });

  useEffect(() => {
    // Fetch all of the servers for the user
    axios.get('/api/servers').then((data) => {
      let servers = data.data.data;
      setServers(servers);

      servers.map((server) => {
        connectServerToSocket(server);
      });

      setLoading(false);
    });
  }, []);

  const submitServerCreateForm = () => {
    const serverCopy = [...servers];

    axios.post('/api/servers', serverFormData).then(data => {
      const createdServer = data.data.data;
      setShowServerForm(false);
      addToast(`Creating server '${createdServer.name}'`, { appearance: 'success', autoDismiss: true });

      serverCopy.push(createdServer);
      setServers(serverCopy);

      // Lets listen to the servers channel then add the server to the servers list
      connectServerToSocket(createdServer);
    }).catch(error => setServerFormErrors(destructServerErrors(error)));
  };

  const connectServerToSocket = (server) => {
    const serverCopy = [...servers];
    auth.echo.private(`server.${server.id}`).listen('ServerUpdated', data => {
      let serverToUpdate = _.findIndex(serverCopy, function (o) {
        return o.id === data.server.id;
      });

      serverCopy.splice(serverToUpdate, 1, data.server);
      setServers(serverCopy);
      addToast(`Server '${data.server.name}' updated`, {
        appearance: 'success',
        autoDismiss: true
      });
    }).listen('ServerFailedToCreate', data => {
      let serverToRemove = _.findIndex(serverCopy, function (o) {
        return o.id === data.server;
      });
      if (serverToRemove) {
        serverCopy.splice(serverToRemove, 1);
        setServers(serverCopy);
        addToast(`Server failed to create`, {
          appearance: 'error',
          autoDismiss: true
        });
      }
    });
  };

  if (loading) {
    return (
      <PageLoader loading={loading} />
    );
  }

  if (showList === false) {
    return (
      <ServerForm
        formErrors={serverFormErrors}
        serverFormData={serverFormData}
        formAction={submitServerCreateForm}
        setServerFormData={setServerFormData}
      />
    );
  }

  return (
    <div className={classes.root}>
      <ServersToolbar onAddServer={() => setShowServerForm(true)}/>
      <div className={classes.content}>
        <ServerTable
          servers={servers}
        />
      </div>
      <Modal
        showActionButtons={false}
        title="Add a new server"
        open={showServerForm}
        onClose={() => setShowServerForm(false)}
      >
        <ServerForm
          formErrors={serverFormErrors}
          serverFormData={serverFormData}
          formAction={submitServerCreateForm}
          setServerFormData={setServerFormData}
        />
      </Modal>
    </div>
  );
};

ServerList.defaultProps = {
  showList: true
};

ServerList.propTypes = {
  auth: PropTypes.object,
  showList: PropTypes.bool
};

const mapStateToProps = ({ auth, echo }) => ({ auth, echo });

export default connect(mapStateToProps, null, null)(ServerList);
