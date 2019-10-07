import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';

// Components
import { ServerProfile, ServerDatabaseSettings } from './components';

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
            <ServerDatabaseSettings server={server} />
          )}
        </div>
      )}
    </div>
  );
};

ServerEdit.propTypes = {
  match: PropTypes.object
};

export default ServerEdit;
