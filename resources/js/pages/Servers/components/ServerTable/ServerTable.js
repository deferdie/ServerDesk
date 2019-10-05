import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import _ from 'lodash';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

// Components
import ServerStatusIcon from '../ServerStatusIcon';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 1050
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));

const ServerTable = props => {
  const {
    className,
    servers,
    deleteServer,
    ...rest
  } = props;
  const classes = useStyles();

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Server Provider</TableCell>
                  <TableCell>IP</TableCell>
                  <TableCell>RAM / CPU</TableCell>
                  <TableCell>Server created</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {servers.map((server, index) => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={server.id}
                  >
                    <TableCell>
                      <Typography variant="body1">{_.get(server, 'name')}</Typography>
                    </TableCell>
                    <TableCell>{_.get(server, 'server_provider.name')}</TableCell>
                    <TableCell>
                      {_.get(server, 'ip_address')}
                    </TableCell>
                    <TableCell>
                      {_.get(server, 'memory')} / {_.get(server, 'cpus')}
                    </TableCell>
                    <TableCell>
                      {moment(server.created_at).format('DD/MM/YYYY')}
                    </TableCell>
                    <TableCell>
                      <React.Fragment>
                        <ServerStatusIcon server={server} />

                        {/* Delete Sever */}
                        <IconButton
                          onClick={() => deleteServer(server, index)}
                          color="error"
                          aria-label="delete"
                          className={classes.button}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </React.Fragment>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>
    </Card>
  );
};

ServerTable.propTypes = {
  className: PropTypes.string,
  servers: PropTypes.array.isRequired,
  deleteServer: PropTypes.func.isRequired
};

export default ServerTable;
