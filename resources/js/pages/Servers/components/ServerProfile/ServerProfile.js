import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  Typography,
  CardContent,
  CardActions
} from '@material-ui/core';
import _ from 'lodash';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

// Components
import SweetAlert from 'sweetalert-react';
import Button from '../../../../components/Button';
import { ServerProviderLogo } from '../../../ServerProviders/components';

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: '15px'
  },
  details: {
    display: 'flex'
  },
  avatar: {
    marginLeft: 'auto',
    height: 110,
    width: 100,
    flexShrink: 0,
    flexGrow: 0
  }
}));

const ServerProfile = (props) => {
  const { className, server, history, ...rest } = props;
  const classes = useStyles();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const deleteServer = () => {
    setShowDeleteModal(false);
    axios.delete(`/api/servers/${server.id}`).then((data) => {
      history.push('/servers');
    });
  };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent>
        <div className={classes.details}>
          <div>
            <Typography
              gutterBottom
              variant="h2"
            >
              {server.name}
            </Typography>
            <Typography
              className={classes.locationText}
              color="textSecondary"
              variant="body1"
            >
              {server.ip_address}
            </Typography>
            <Typography
              className={classes.dateText}
              color="textSecondary"
              variant="body1"
            >
              {moment(server.created_at).format('DD/MM/YYYY')}
            </Typography>
          </div>
          <ServerProviderLogo className={classes.avatar} serverProvider={server.server_provider} />
        </div>
      </CardContent>
      <CardActions>
        <Button
          onClick={() => setShowDeleteModal(true)}
          color="secondary"
        >
          Delete Server
        </Button>
      </CardActions>

      {/* Alert to delete a server */}
      <SweetAlert
        type="error"
        show={showDeleteModal}
        showCancelButton
        title="You are about to delete this server!!"
        text={`Are you sure you want to delete server : ${_.get(server, 'name')}`}
        onConfirm={deleteServer}
        onCancel={() => {
          setShowDeleteModal(false);
        }}
      />
    </Card>
  );
};

ServerProfile.propTypes = {
  server: PropTypes.object,
  history: PropTypes.object,
  className: PropTypes.object
};

export default withRouter(ServerProfile);
