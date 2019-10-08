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
import moment from 'moment';

const MySQLDatabaseTable = (props) => {
  const { databases, setShowDatabaseDeleteConfirm } = props;

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
  );
};

MySQLDatabaseTable.propTypes = {
  databases: PropTypes.array,
  setShowDatabaseDeleteConfirm: PropTypes.object
};

export default MySQLDatabaseTable;
