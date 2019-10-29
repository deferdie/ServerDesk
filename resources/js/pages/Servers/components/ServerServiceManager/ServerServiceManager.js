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
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import axios from 'axios';
import _ from 'lodash';
import ClipLoader from 'react-spinners/ClipLoader';

// Components
import { ServerSoftwareManager } from '../index';

const ServerServiceManager = (props) => {
  const { server, setServer } = props;

  const restartService = (service) => {
    axios.post(`/api/servers/${server.id}/restart-service`, {
      server_service_id: service.id
    }).then(data => {
      setServer(data.data.data);
    });
  };

  return (
    <Card>
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
          <div>
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

                          <ClipLoader
                            sizeUnit={'px'}
                            size={20}
                            color={'#123abc'}
                            loading={service.status === 'installing'}
                          />
                        </React.Fragment>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {/* Avaliable services to install */}
            <ServerSoftwareManager
              server={server}
              setServer={setServer}
            />
          </div>
        </React.Fragment>
      </CardContent>
      <Divider />
    </Card>
  );
};

ServerServiceManager.propTypes = {
  server: PropTypes.object.isRequired,
  setServer: PropTypes.func.isRequired
};

export default ServerServiceManager;
