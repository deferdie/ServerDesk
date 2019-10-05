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

// Components
import ApplicationStatusIcon from '../ApplicationStatusIcon';

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
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applications.map(app => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={app.id}
                  >
                    <TableCell>
                      <Typography variant="body1">
                        {_.get(app, 'domain')}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      {_.get(app, 'server.server_provider.name')}
                    </TableCell>

                    <TableCell>
                      {_.get(app, 'server.name')}
                    </TableCell>

                    <TableCell>
                      <ApplicationStatusIcon application={app} />
                    </TableCell>

                    <TableCell>
                      {moment(app.created_at).format('DD/MM/YYYY')}
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
