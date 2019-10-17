import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import uuid from 'uuid';

// Components
import {
  GitHubConnector,
  BitBucketConnector
} from './components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
    root: {
      flexGrow: 1
    }
  }
}));

const SourceProviders = () => {
  const classes = useStyles();
  const [providers, setProviders] = useState([]);
  const [userProviders, setUserProviders] = useState([]);

  useEffect(() => {
    axios.get('/api/source-providers').then(data => {
      setProviders(data.data.data);
    });
  }, []);

  return (
    <Grid container className={classes.root} spacing={2}>
      {providers.map((provider) => {
        return <Grid
          key={uuid()}
          item
          md={4}
          xs={12}
        >
          {provider.name === 'BitBucket' && (
            <BitBucketConnector
              setProviders={setProviders}
              sourceProvider={provider}
              userProviders={userProviders}
              setUserProviders={setUserProviders}
            />
          )}
          {provider.name === 'GitHub' && (
            <GitHubConnector
              setProviders={setProviders}
              sourceProvider={provider}
              userProviders={userProviders}
              setUserProviders={setUserProviders}
            />
          )}
        </Grid>;
      })}
    </Grid>
  );
};

export default SourceProviders;
