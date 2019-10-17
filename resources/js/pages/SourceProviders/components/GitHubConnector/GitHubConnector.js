import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import _ from 'lodash';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import uuid from 'uuid';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import PropTypes from 'prop-types';
import LoopIcon from '@material-ui/icons/Loop';

const useStyles = makeStyles(theme => ({
  media: {
    height: 140,
    backgroundSize: 'contain'
  }
}));

const GitHubConnector = (props) => {
  const { location, match, userProviders, setUserProviders, sourceProvider } = props;
  const classes = useStyles();
  const [connectingTo, setConnectingTo] = useState(null);

  useEffect(() => {
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

  const connectToGitHub = () => {
    const { MIX_GITHUB_CLIENT_ID, MIX_GITHUB_REDIRECT_URI } = process.env;
    let uri = `https://github.com/login/oauth/authorize?client_id=${MIX_GITHUB_CLIENT_ID}&redirect_uri=${MIX_GITHUB_REDIRECT_URI}&state=${uuid()}`;
    window.open(uri, '_blank');
  };

  const renderGitHubConnectButton = () => {
    return (
      <Button variant="contained" size="small" color="primary" onClick={connectToGitHub} fullWidth disabled={connectingTo === 'github'}>
        {connectingTo === 'github' ? (
          <React.Fragment>
            <LoopIcon className="icon-spin" color="action" /> Connecting to GitHub... Please wait
          </React.Fragment>
        ) : 'Connect'}
      </Button>
    );
  };

  return (
    <Card className={classes.card}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image="/images/github.jpg"
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            GitHub
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        {userProviders.length === 0 && (
          renderGitHubConnectButton()
        )}

        {userProviders.length > 0 && (
          userProviders.map(provider => {
            if (provider.access_token == null) {
              return (
                renderGitHubConnectButton()
              );
            } else {
              return (
                <Button variant="contained" size="small" color="secondary" fullWidth>
                  Connected to GitHub
                </Button>
              );
            }
          })
        )}
      </CardActions>
    </Card>
  );
};

GitHubConnector.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object,
  userProviders: PropTypes.array,
  setUserProviders: PropTypes.func
};

export default withRouter(GitHubConnector);
