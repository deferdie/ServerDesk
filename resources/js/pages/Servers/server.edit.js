import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import { useToasts } from 'react-toast-notifications';
import _ from 'lodash';

// Components
import {
  ServerProfile,
  ServerSSHKeys,
  MySQLDatabaseManager,
  ServerServiceManager,
  ServerProcessManager
} from './components';
import Tabs from '../../components/Tabs';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const ServerEdit = (props) => {
  const { match } = props;
  const classes = useStyles();
  const [server, setServer] = useState(null);
  const { Echo } = window;
  const { addToast } = useToasts();

  useEffect(() => {
    axios.get(`/api/servers/${match.params.server}`).then((data) => {
      setServer(data.data.data);
      Echo.private(`server.${match.params.server}`)
        .listen('ServerUpdated', data => {
          addToast(data.message, { appearance: 'success', autoDismiss: true });
          setServer(data.server);
        });
    });
  }, []);

  return (
    <div className={classes.root}>
      {server && (
        <div className={classes.content}>
          <ServerProfile server={server} />
          <Tabs
            tabs={[
              {
                label: 'Database settings',
                content: (
                  <MySQLDatabaseManager server={server} databases={_.get(server, 'my_s_q_l_database', [])} />
                )
              },
              {
                label: 'Background Processes',
                content: (
                  <ServerProcessManager server={server} setServer={setServer} />
                )
              },
              {
                label: 'SSK keys',
                content: (
                  <ServerSSHKeys server={server} setServer={setServer} />
                )
              },
              {
                label: 'Services',
                content: (
                  <ServerServiceManager
                    server={server}
                    setServer={setServer}
                  />
                )
              }
            ]}
          />
        </div>
      )}
    </div>
  );
};

ServerEdit.propTypes = {
  match: PropTypes.object
};

export default ServerEdit;
