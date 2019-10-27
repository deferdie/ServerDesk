import React from 'react';
import PropPypes from 'prop-types';
import {
  Fab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import clsx from 'clsx';
import GetAppIcon from '@material-ui/icons/GetApp';

const ServerSoftwareManager = (props) => {
  const {
    server,
    serServer
  } = props;

  return (
    <React.Fragment>
      <Typography
        gutterBottom
        variant="h4"
      >
        Install additional services
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Service</TableCell>
            <TableCell style={{ textAlign: 'right' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow
            hover
          >
            <TableCell>
              <Typography variant="body1">
                NodeJS
              </Typography>
            </TableCell>
            <TableCell style={{ textAlign: 'right' }}>
              <React.Fragment>
                <Fab
                  size="small"
                  color="secondary"
                  aria-label="edit"
                  onClick={() => console.log('install service')}
                >
                  <GetAppIcon />
                </Fab>
              </React.Fragment>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </React.Fragment>
  );
};

ServerSoftwareManager.propTypes = {
  server: PropPypes.object.isRequired,
  setServer: PropPypes.func.isRequired
};

export default ServerSoftwareManager;
