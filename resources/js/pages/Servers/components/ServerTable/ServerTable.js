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
  const { className, servers, ...rest } = props;
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
                </TableRow>
              </TableHead>
              <TableBody>
                {servers.map(server => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={server.id}
                  >
                    <TableCell>
                      <Typography variant="body1">{_.get(server, 'name')}</Typography>
                    </TableCell>
                    <TableCell>{_.get(server, 'serverProvider.name')}</TableCell>
                    <TableCell>
                      {_.get(server, 'ip_address')}
                    </TableCell>
                    <TableCell>
                      {_.get(server, 'ram')} / {_.get(server, 'cpu')}
                    </TableCell>
                    <TableCell>
                      {moment(server.created_at).format('DD/MM/YYYY')}
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
