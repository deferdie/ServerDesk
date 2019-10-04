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

const ApplicationTable = props => {
  const { className, applications, ...rest } = props;
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
                  <TableCell>Domain</TableCell>
                  <TableCell>Server Provider</TableCell>
                  <TableCell>Server Name</TableCell>
                  <TableCell>Application Created</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applications.map(provider => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={provider.id}
                  >
                    <TableCell>
                      <Typography variant="body1">{_.get(provider, 'name')}</Typography>
                    </TableCell>
                    <TableCell>{_.get(provider, 'server_provider.name')}</TableCell>
                    <TableCell>
                      {moment(provider.created_at).format('DD/MM/YYYY')}
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

ApplicationTable.propTypes = {
  className: PropTypes.string,
  applications: PropTypes.array.isRequired
};

export default ApplicationTable;
