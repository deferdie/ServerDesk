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
  const { location, match, sourceProvider, setProviders } = props;
  const classes = useStyles();
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    const provider = _.get(match.params, 'provider', false);
    if (provider === 'github') {
      const queryParams = queryString.parse(location.search);
      setConnecting('github');
      axios.post('/api/source-providers/connect/github', {
        code: _.get(queryParams, 'code', null),
        state: _.get(queryParams, 'state', null)
      }).then(data => {
        setConnecting(false);
        setProviders(data.data.data);
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
      <Button variant="contained" size="small" color="primary" onClick={connectToGitHub} fullWidth disabled={connecting}>
        {connecting === true ? (
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
        {sourceProvider.user_credential == null && (
          renderGitHubConnectButton()
        )}

        {sourceProvider.user_credential != null && (
          <Button variant="contained" size="small" color="secondary" fullWidth>
            Connected to GitHub
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

GitHubConnector.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object,
  setProviders: PropTypes.func,
  sourceProvider: PropTypes.object
};

export default withRouter(GitHubConnector);
