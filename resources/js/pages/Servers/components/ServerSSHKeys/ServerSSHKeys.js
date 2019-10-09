import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Fab,
  Card,
  Grid,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CardContent,
  CardActions,
  Typography
} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import axios from 'axios';
import _ from 'lodash';
import DeleteIcon from '@material-ui/icons/Delete';

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
  const [sshKeyFormData, setSshKeyFormData] = useState({
    name: '',
    key: ''
  });

  const createSSHKey = () => {
    axios.post(`/api/servers/${server.id}/public-key`, sshKeyFormData).then((data) => {
      console.log(data);
    });
  };

  return (
    <Grid
      container
      spacing={3}
    >
      <Grid
        item
        md={7}
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
                Manage your SSH keys for this server
              </Typography>
              {/* Databases */}
              <PerfectScrollbar>
                <div className={classes.inner}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell style={{ textAlign: 'right' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {server.public_keys.map((key, index) => (
                        <TableRow
                          className={classes.tableRow}
                          hover
                          key={key.id}
                        >
                          <TableCell>
                            <Typography variant="body1">{_.get(key, 'name')}</Typography>
                          </TableCell>
                          <TableCell style={{textAlign: 'right'}}>
                            <React.Fragment>
                              {/* Delete Sever */}
                              <Fab
                                size="small"
                                color="secondary"
                                aria-label="edit"
                              >
                                <DeleteIcon />
                              </Fab>
                            </React.Fragment>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </PerfectScrollbar>
            </React.Fragment>
          </CardContent>
          <Divider />
          <CardActions>
            <Button
              fullWidth
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
          formData={sshKeyFormData}
          setFormData={setSshKeyFormData}
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
