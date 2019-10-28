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
import _ from 'lodash';
import GetAppIcon from '@material-ui/icons/GetApp';
import Axios from 'axios';

const ServerSoftwareManager = (props) => {
  const {
    server,
    setServer
  } = props;

  const installService = (service, index) => {
    const s = {...server};
    s.avaliable_service_installs.splice(index, 1);
    setServer(s);

    Axios.post(`/api/servers/${server.id}/services/${service.id}`).then((data) => {
      console.log(data);
    });
  };

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
          {_.get(server, 'avaliable_service_installs', []).map((service, index) => {
            return (
              <TableRow
                hover
                key={service.id}
              >
                <TableCell>
                  <Typography variant="body1">
                    {service.name}
                  </Typography>
                </TableCell>
                <TableCell style={{ textAlign: 'right' }}>
                  <React.Fragment>
                    <Fab
                      size="small"
                      color="secondary"
                      aria-label="edit"
                      onClick={() => installService(service, index)}
                    >
                      <GetAppIcon />
                    </Fab>
                  </React.Fragment>
                </TableCell>
              </TableRow>
            );
          })}
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
