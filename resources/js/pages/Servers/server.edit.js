import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import {
  Grid
} from '@material-ui/core';

// Components
import {
  ServerProfile,
  ServerSSHKeys,
  MySQLDatabaseManager,
  ServerServiceManager
} from './components';

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

  useEffect(() => {
    axios.get(`/api/servers/${match.params.server}`).then(data => setServer(data.data.data));
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
              />
            </Grid>
            <Grid
              item
              md={5}
              xs={12}
            >
              <ServerSSHKeys server={server} setServer={setServer} />
            </Grid>
          </Grid>
        </div>
      )}
    </div>
  );
};

ServerEdit.propTypes = {
  match: PropTypes.object
};

export default ServerEdit;
