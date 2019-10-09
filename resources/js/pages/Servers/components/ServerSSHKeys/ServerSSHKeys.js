import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  Grid,
  Button,
  Divider,
  CardContent,
  CardActions,
  Typography
} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';

// Components
import Modal from '../../../../components/Modal';
import { ServerSSHKeyForm } from '../../components';

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: '15px'
  },
  details: {
    display: 'flex'
  }
}));

const ServerSSHKeys = (props) => {
  const { className, server, ...rest } = props;
  const classes = useStyles();
  const [showSSHKeyForm, setShowSSHKeyForm] = useState(false);

  const createSSHKey = () => {
    console.log('creating key');
  };

  return (
    <Grid
      container
      spacing={3}
    >
      <Grid
        item
        md={12}
        xs={12}
      >
        <Card
          {...rest}
          className={clsx(classes.root, className)}
        >
          <CardContent>
            <React.Fragment>
              <Typography
                gutterBottom
                variant="h4"
              >
                SSH keys
              </Typography>
              <Typography
                gutterBottom
                variant="subtitle2"
              >
                Add your SSH keys to this server.
              </Typography>
              {/* Databases */}
              <PerfectScrollbar>
                <div className={classes.inner}>

                </div>
              </PerfectScrollbar>
            </React.Fragment>
          </CardContent>
          <Divider />
          <CardActions>
            <Button
              color="primary"
              variant="contained"
              onClick={() => setShowSSHKeyForm(true)}
            >
              Add key
            </Button>
          </CardActions>
        </Card>
      </Grid>
      {/* Modal to create a new users */}
      <Modal
        title="Add a new SSH key"
        open={showSSHKeyForm}
        onClose={() => setShowSSHKeyForm(false)}
        onSave={createSSHKey}
        saveButton="Create SSH key"
      >
        <ServerSSHKeyForm
          server={server}
        />
      </Modal>
    </Grid>
  );
};

ServerSSHKeys.propTypes = {
  server: PropTypes.object,
  className: PropTypes.object
};

export default ServerSSHKeys;
