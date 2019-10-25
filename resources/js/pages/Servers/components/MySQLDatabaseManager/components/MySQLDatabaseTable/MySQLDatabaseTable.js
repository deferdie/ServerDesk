import React from 'react';
import PropTypes from 'prop-types';
import {
  Fab,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import moment from 'moment';
import _ from 'lodash';

const MySQLDatabaseTable = (props) => {
  const {
    databases,
    setShowDatabaseUserForm,
    setShowDatabaseDeleteConfirm
  } = props;

  return (
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
                  color="primary"
                  aria-label="Users"
                  onClick={() => setShowDatabaseUserForm(index)}
                >
                  <GroupAddIcon />
                </Fab>
                <Fab
                  size="small"
                  color="secondary"
                  aria-label="Delete"
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
  );
};

MySQLDatabaseTable.propTypes = {
  databases: PropTypes.array,
  setShowDatabaseUserForm: PropTypes.func,
  setShowDatabaseDeleteConfirm: PropTypes.func
};

export default MySQLDatabaseTable;
