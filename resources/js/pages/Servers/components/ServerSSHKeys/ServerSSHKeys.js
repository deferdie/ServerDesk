import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Fab,
  Card,
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
import SweetAlert from 'sweetalert-react';

// Components
import Modal from '../../../../components/Modal';
import { ServerSSHKeyForm } from '../../components';
import { destructServerErrors } from '../../../../helpers/error';

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: '15px'
  }
}));

const ServerSSHKeys = (props) => {
  const { className, server, setServer, ...rest } = props;
  const classes = useStyles();
  const [showSSHKeyForm, setShowSSHKeyForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [sshKeyFormData, setSshKeyFormData] = useState({
    name: '',
    key: ''
  });

  const createSSHKey = () => {
    axios.post(`/api/servers/${server.id}/public-key`, sshKeyFormData).then((data) => {
      let s = {...server};
      s.public_keys.push(data.data.data);
      setServer(s);
      closeForm();
    }).catch(error => setFormErrors(destructServerErrors(error)));
  };

  const deleteKey = () => {
    let key = _.get(server.public_keys, [showDeleteModal, 'id']);
    axios.delete(`/api/servers/${server.id}/public-key/${key}`).then((data) => {
      let s = { ...server };
      s.public_keys.splice(showDeleteModal, 1);
      setServer(s);
      setShowDeleteModal(false);
    });
  };

  const closeForm = () => {
    setSshKeyFormData({
      name: '',
      key: ''
    });
    setShowSSHKeyForm(false);
  };

  return (
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
                            onClick={() => setShowDeleteModal(index)}
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
      {/* Modal to create a new users */}
      <Modal
        title="Add a new SSH key"
        open={showSSHKeyForm}
        onClose={closeForm}
        onSave={createSSHKey}
        saveButton="Create SSH key"
      >
        <ServerSSHKeyForm
          server={server}
          formData={sshKeyFormData}
          setFormData={setSshKeyFormData}
          formErrors={formErrors}
        />
      </Modal>

      {/* Alert to delete a database */}
      <SweetAlert
        show={Boolean(showDeleteModal !== false)}
        showCancelButton
        title="Delete public key?"
        text={`You are about to this public key ${_.get(server.public_keys, [showDeleteModal, 'name'])}`}
        onConfirm={deleteKey}
        onCancel={() => {
          setShowDeleteModal(false);
        }}
      />
    </Card>
  );
};

ServerSSHKeys.propTypes = {
  server: PropTypes.object,
  setServer: PropTypes.func,
  className: PropTypes.object
};

export default ServerSSHKeys;
