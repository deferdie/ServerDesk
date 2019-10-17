import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import _ from 'lodash';
import Button from '@material-ui/core/Button';
import uuid from 'uuid';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import PropTypes from 'prop-types';
import LoopIcon from '@material-ui/icons/Loop';
import Grid from '@material-ui/core/Grid';

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

const SourceProviders = (props) => {
  const { location, match } = props;
  const classes = useStyles();
  const [connectingTo, setConnectingTo] = useState(null);
  const [providers, setProviders] = useState([]);
  const [userProviders, setUserProviders] = useState([]);

  useEffect(() => {
    axios.get('/api/source-providers').then(data => {
      setProviders(data.data.data);
    });

    axios.get('/api/user/source-providers').then(data => {
      setUserProviders(data.data.data);
    });

    const provider = _.get(match.params, 'provider', false);
    if (provider === 'github') {
      const queryParams = queryString.parse(location.search);
      setConnectingTo('github');
      axios.post('/api/source-providers/connect/github', {
        code: _.get(queryParams, 'code', null),
        state: _.get(queryParams, 'state', null)
      }).then(data => {
        if (userProviders.length === 0) {
          const u = [...userProviders];
          u.push(data.data.data);
          setUserProviders(u);
        }
      });
    }
  }, []);

  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid
        item
        md={4}
        xs={12}
      >
        <GitHubConnector
          providers={providers}
          userProviders={userProviders}
          setUserProviders={setUserProviders}
        />
      </Grid>
      <Grid
        item
        md={4}
        xs={12}
      >
        <BitBucketConnector
          providers={providers}
          userProviders={userProviders}
          setUserProviders={setUserProviders}
        />
      </Grid>
    </Grid>
  );
};

SourceProviders.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object
};

export default withRouter(SourceProviders);
