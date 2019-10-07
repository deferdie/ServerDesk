import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SweetAlert from 'sweetalert-react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Fab,
  Card,
  Button,
  Divider,
  CardContent,
  CardActions,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import _ from 'lodash';
import moment from 'moment';
import axios from 'axios';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

// Components
import Modal from '../../../../components/Modal';
import MySQLDatabaseForm from './MySQLDatabaseForm';
import ListManager from '../../../../components/ListManager';
import { destructServerErrors } from '../../../../helpers/error';

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

  const [databases, setDatabases] = useState([]);
  const [serverFormErrors, setServerFormErrors] = useState([]);
  const [serverFormData, setServerFormData] = useState({ name: '' });
  const [showDatabaseCreateForm, setShowDatabaseCreateForm] = useState(false);
  const [showDatabaseDeleteConfirm, setShowDatabaseDeleteConfirm] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    setDatabases(server.my_s_q_l_database);
  }, []);

  const createDatabase = () => {
    axios.post(`/api/servers/${server.id}/mysql`, serverFormData).then(data => {
      setServerFormData({name: ''});
      setShowDatabaseCreateForm(false);
      let d = [...databases];
      d.push(data.data.data);
      setDatabases(d);
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
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Database created</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {databases.map((database, index) => {
                      return (
                        <TableRow
                          className={classes.tableRow}
                          hover
                          key={database.id}
                        >
                          <TableCell>
                            <Typography variant="body1">{_.get(database, 'name')}</Typography>
                          </TableCell>
                          <TableCell>
                            {moment(database.created_at).format('DD/MM/YYYY')}
                          </TableCell>
                          <TableCell>
                            <Fab
                              size="small"
                              color="secondary"
                              aria-label="edit"
                              onClick={() => setShowDatabaseDeleteConfirm(index)}
                            >
                              <DeleteForeverIcon />
                            </Fab>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
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
          <Button
            color="primary"
            variant="contained"
          >
            Manage users
          </Button>
        </CardActions>
      </Card>

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

      <SweetAlert
        show={Boolean(showDatabaseDeleteConfirm === false ? false : true)}
        showCancelButton
        title="Delete database?"
        text={`You are about to delete database ${_.get(databases, [showDatabaseDeleteConfirm, 'name'])}`}
        onConfirm={deleteDatabase}
        onCancel={() => {
          setShowDatabaseDeleteConfirm(false);
        }}
      />

      <ListManager selectedList={[]} avaliableList={[]} />
    </React.Fragment>
  );
};

MySQLDatabaseManager.propTypes = {
  server: PropTypes.object,
  databases: PropTypes.array,
  className: PropTypes.object
};

export default MySQLDatabaseManager;
