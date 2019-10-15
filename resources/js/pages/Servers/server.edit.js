import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import {
  Grid
} from '@material-ui/core';
import { useToasts } from 'react-toast-notifications';

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
          {server.wants_mysql === 1 && (
            <MySQLDatabaseManager server={server} databases={server.my_s_q_l_database} />
          )}

          <Grid
            container
            spacing={3}
          >
            {/* Services */}
            <Grid
              item
              md={7}
              xs={12}
            >
              <ServerServiceManager
                server={server}
                setServer={setServer}
              />
            </Grid>
            <Grid
              item
              md={5}
              xs={12}
            >
              <ServerSSHKeys server={server} setServer={setServer} />
            </Grid>

            <Grid
              item
              md={12}
              xs={12}
            >
              <ServerProcessManager server={server} setServer={setServer} />
            </Grid>
          </Grid>
        </div>
      )}

      <Tabs />
    </div>
  );
};

ServerEdit.propTypes = {
  match: PropTypes.object
};

export default ServerEdit;
