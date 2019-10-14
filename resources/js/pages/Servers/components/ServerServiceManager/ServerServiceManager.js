import React from 'react';
import PropTypes from 'prop-types';
import {
  Fab,
  Card,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CardContent,
  Typography
} from '@material-ui/core';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: '15px'
  },
  details: {
    display: 'flex'
  }
}));

const ServerServiceManager = (props) => {
  const { server, className } = props;
  const classes = useStyles();

  const restartService = (service) => {
    axios.post(`/api/servers/${server.id}/restart-service`, {
      service: service
    }).then(data => {
      console.log(data);
    });
  };

  return (
    <Card
      className={clsx(classes.root, className)}
    >
      <CardContent>
        <React.Fragment>
          <Typography
            gutterBottom
            variant="h4"
          >
            Services
          </Typography>
          <Typography
            gutterBottom
            variant="subtitle2"
          >
            Manage your SSH keys for this server
          </Typography>
          {/* Databases */}
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell style={{ textAlign: 'right' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow
                  className={classes.tableRow}
                  hover
                >
                  <TableCell>
                    <Typography variant="body1">
                      Nginx
                    </Typography>
                  </TableCell>
                  <TableCell style={{ textAlign: 'right' }}>
                    <React.Fragment>
                      {/* Delete Sever */}
                      <Fab
                        size="small"
                        color="secondary"
                        aria-label="edit"
                        onClick={() => restartService('nginx')}
                      >
                        <SettingsBackupRestoreIcon />
                      </Fab>
                    </React.Fragment>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </React.Fragment>
      </CardContent>
      <Divider />
    </Card>
  );
};

ServerServiceManager.propTypes = {
  className: PropTypes.object,
  server: PropTypes.object.isRequired
};

export default ServerServiceManager;
