import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SweetAlert from 'sweetalert-react';
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
import _ from 'lodash';
import axios from 'axios';

// Components
import Modal from '../../../../components/Modal';
import MySQLDatabaseForm from './MySQLDatabaseForm';
import { destructServerErrors } from '../../../../helpers/error';
import {
  MySQLUserForm,
  MySQLUsersTable,
  MySQLDatabaseTable,
  MySQLDatabaseUserForm
} from './components';

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: '15px'
  },
  details: {
    display: 'flex'
  }
}));

const MySQLDatabaseManager = (props) => {
  const { className, server, ...rest } = props;

  const [users, setUsers] = useState([]);
  const [databases, setDatabases] = useState([]);

  // Sweet states
  const [showUserDeleteConfirm, setShowUserDeleteConfirm] = useState(false);
  const [showDatabaseDeleteConfirm, setShowDatabaseDeleteConfirm] = useState(false);

  // Form states
  const [serverFormErrors, setServerFormErrors] = useState([]);
  const [userFormData, setUserFormData] = useState({ name: '' });
  const [serverFormData, setServerFormData] = useState({ name: '' });

  // Modal states
  const [showDatabaseUserForm, setShowDatabaseUserForm] = useState(false);
  const [showDatabaseCreateForm, setShowDatabaseCreateForm] = useState(false);
  const [showDatabaseUserCreateForm, setShowDatabaseUserCreateForm] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    setDatabases(server.my_s_q_l_database);
    setUsers(server.my_s_q_l_users);
  }, []);

  const createDatabase = () => {
    axios.post(`/api/servers/${server.id}/mysql`, serverFormData).then(data => {
      setServerFormData({name: ''});
      setShowDatabaseCreateForm(false);
      let d = [...databases];
      d.push(data.data.data);
      setDatabases(d);
      setServerFormErrors([]);
    }).catch(error => setServerFormErrors(destructServerErrors(error)));
  };

  const createUser = () => {
    axios.post(`/api/servers/${server.id}/mysql-user`, userFormData).then(data => {
      setUserFormData({name: ''});
      setShowDatabaseUserCreateForm(false);
      let d = [...users];
      d.push(data.data.data);
      setUsers(d);
      setServerFormErrors([]);
    }).catch(error => setServerFormErrors(destructServerErrors(error)));
  };

  const deleteDatabase = () => {
    axios.delete(`/api/servers/${server.id}/mysql/${_.get(databases, [showDatabaseDeleteConfirm, 'id'])}`)
      .then(() => {
        let d = [...databases];
        d.splice(showDatabaseDeleteConfirm, 1);
        setDatabases(d);
        setShowDatabaseDeleteConfirm(false);
      });
  };

  return (
    <React.Fragment>
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
                  Database settings - MySQL
                </Typography>
                {/* Databases */}
                <PerfectScrollbar>
                  <div className={classes.inner}>
                    <MySQLDatabaseTable
                      databases={databases}
                      setShowDatabaseUserForm={setShowDatabaseUserForm}
                      setShowDatabaseDeleteConfirm={setShowDatabaseDeleteConfirm}
                    />
                  </div>
                </PerfectScrollbar>
              </React.Fragment>
            </CardContent>
            <Divider />
            <CardActions>
              <Button
                color="primary"
                variant="contained"
                onClick={() => setShowDatabaseCreateForm(true)}
              >
                Create database
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid
          item
          md={5}
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
                  Database users
                </Typography>
                {/* Databases */}
                <PerfectScrollbar>
                  <div className={classes.inner}>
                    <MySQLUsersTable
                      users={users}
                      setShowUserDeleteConfirm={setShowUserDeleteConfirm}
                    />
                  </div>
                </PerfectScrollbar>
              </React.Fragment>
            </CardContent>
            <Divider />
            <CardActions>
              <Button
                color="primary"
                variant="contained"
                onClick={() => setShowDatabaseUserCreateForm(true)}
              >
                Create database users
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {/* Modal to create a new database */}
      <Modal
        title="Add a new database"
        open={showDatabaseCreateForm}
        onClose={() => setShowDatabaseCreateForm(false)}
        onSave={createDatabase}
        saveButton="Create database"
      >
        <MySQLDatabaseForm
          formData={serverFormData}
          formErrors={serverFormErrors}
          setServerFormData={setServerFormData}
        />
      </Modal>

      {/* Modal to manage database users */}
      <Modal
        showActionButtons={false}
        title="Manage database users"
        open={Boolean(showDatabaseUserForm !== false)}
        onClose={() => setShowDatabaseUserForm(false)}
        onSave={createDatabase}
      >
        <MySQLDatabaseUserForm
          users={users}
          database={databases[showDatabaseUserForm]}
        />
      </Modal>

      {/* Modal to create a new users */}
      <Modal
        title="Add a new database user"
        open={showDatabaseUserCreateForm}
        onClose={() => setShowDatabaseUserCreateForm(false)}
        onSave={createUser}
        saveButton="Create database user"
      >
        <MySQLUserForm
          formData={userFormData}
          formErrors={serverFormErrors}
          setUserFormData={setUserFormData}
        />
      </Modal>

      {/* Alert to delete a database */}
      <SweetAlert
        show={Boolean(showDatabaseDeleteConfirm !== false)}
        showCancelButton
        title="Delete database?"
        text={`You are about to delete database ${_.get(databases, [showDatabaseDeleteConfirm, 'name'])}`}
        onConfirm={deleteDatabase}
        onCancel={() => {
          setShowDatabaseDeleteConfirm(false);
        }}
      />

      {/* Alert to delete a user */}
      <SweetAlert
        show={showUserDeleteConfirm}
        showCancelButton
        title="Delete user?"
        text={`This will delete a the database user from the server`}
        onConfirm={deleteDatabase}
        onCancel={() => {
          setShowUserDeleteConfirm(false);
        }}
      />

      {/* <ListManager selectedList={[]} avaliableList={} /> */}
    </React.Fragment>
  );
};

MySQLDatabaseManager.propTypes = {
  server: PropTypes.object,
  databases: PropTypes.array,
  className: PropTypes.object
};

export default MySQLDatabaseManager;
