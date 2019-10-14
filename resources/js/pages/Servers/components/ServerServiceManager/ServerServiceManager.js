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
import _ from 'lodash';
import ClipLoader from 'react-spinners/ClipLoader';

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: '15px'
  }
}));

const ServerServiceManager = (props) => {
  const { server, setServer, className } = props;
  const classes = useStyles();

  const restartService = (service) => {
    axios.post(`/api/servers/${server.id}/restart-service`, {
      server_service_id: service.id
    }).then(data => {
      setServer(data.data.data);
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
            You can restart some of your server processes here
          </Typography>
          {/* Databases */}
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Service</TableCell>
                  <TableCell style={{ textAlign: 'right' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {_.get(server, 'services', []).map((service) => {
                  return (
                    <TableRow
                      key={service.id}
                      className={classes.tableRow}
                      hover
                    >
                      <TableCell>
                        <Typography variant="body1">
                          {_.get(service, 'service.name', '')}
                        </Typography>
                      </TableCell>
                      <TableCell style={{ textAlign: 'right' }}>
                        <React.Fragment>
                          {/* Button to restart the service */}
                          {service.status !== 'restarting' && (
                            <Fab
                              size="small"
                              color="secondary"
                              aria-label="edit"
                              onClick={() => restartService(service)}
                            >
                              <SettingsBackupRestoreIcon />
                            </Fab>
                          )}

                          <ClipLoader
                            sizeUnit={'px'}
                            size={20}
                            color={'#123abc'}
                            loading={service.status === 'restarting'}
                          />
                        </React.Fragment>
                      </TableCell>
                    </TableRow>
                  );
                })}
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
  server: PropTypes.object.isRequired,
  setServer: PropTypes.func.isRequired
};

export default ServerServiceManager;
