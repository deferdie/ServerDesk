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

const BitBucketConnector = (props) => {
  const { location, match, sourceProvider, setProviders, history } = props;
  const classes = useStyles();
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    let provider = _.get(match.params, 'provider', false);

    if (provider === false) {
      provider = _.get(queryString.parse(location.search), 'source_provider', false);
    }

    if (provider === 'bitbucket') {
      const queryParams = queryString.parse(location.search);
      setConnecting(true);
      axios.post('/api/source-providers/connect/bitbucket', {
        code: _.get(queryParams, 'code', null)
      }).then(data => {
        setConnecting(false);
        setProviders(data.data.data);
        history.push(location.pathname);
      });
    }
  }, []);

  const connectToBitBucket = () => {
    const { MIX_BITBUCKET_KEY } = process.env;
    let uri = `https://bitbucket.org/site/oauth2/authorize?client_id=${MIX_BITBUCKET_KEY}&response_type=code`;
    window.open(uri, '_blank');
  };

  const renderBitBucketConnectButton = () => {
    return (
      <Button variant="contained" size="small" color="primary" onClick={connectToBitBucket} fullWidth disabled={connecting}>
        {connecting === true ? (
          <React.Fragment>
            <LoopIcon className="icon-spin" color="action" /> Connecting to BitBucket... Please wait
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
          image="/images/bitbucket.png"
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            BitBucket
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        {sourceProvider.user_credential == null && (
          renderBitBucketConnectButton()
        )}

        {sourceProvider.user_credential != null && (
          <Button variant="contained" size="small" color="secondary" fullWidth>
            Connected to BitBucket
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

BitBucketConnector.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
  location: PropTypes.object,
  setProviders: PropTypes.func,
  sourceProvider: PropTypes.object
};

export default withRouter(BitBucketConnector);
