import React, { forwardRef } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { NavLink as RouterLink } from 'react-router-dom';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import {
  Fab,
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
import EditIcon from '@material-ui/icons/Edit';

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
    ...rest
  } = props;
  const classes = useStyles();

  const CustomRouterLink = forwardRef((props, ref) => (
    <RouterLink {...props} ref={ref} />
  ));

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
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {servers.length === 0 ? (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key="No Servers"
                  >
                    <TableCell>
                      <Typography variant="body1">You have no servers created.</Typography>
                    </TableCell>
                  </TableRow>
                ) : ''}
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
                      <ServerStatusIcon server={server} />
                    </TableCell>
                    <TableCell>
                      <React.Fragment>
                        <Fab
                          to={`/servers/${server.id}`}
                          size="small"
                          color="secondary"
                          aria-label="edit"
                          component={CustomRouterLink}
                        >
                          <EditIcon />
                        </Fab>
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
  servers: PropTypes.array.isRequired
};

export default ServerTable;
