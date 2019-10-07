import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Card,
  CardContent
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';

// Components
import { ServerProfile } from './components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const ServerEdit = (props) => {
  const { className, match } = props;
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
        </div>
      )}
    </div>
  );
};

ServerEdit.propTypes = {
  className: PropTypes.object
};

export default ServerEdit;
