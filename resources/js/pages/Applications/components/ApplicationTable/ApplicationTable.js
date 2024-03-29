import React, { forwardRef } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import { NavLink as RouterLink } from 'react-router-dom';
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
import EditIcon from '@material-ui/icons/Edit';
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
                  <TableCell>Domain</TableCell>
                  <TableCell>Server Provider</TableCell>
                  <TableCell>Server Name</TableCell>
                  <TableCell>Application Created</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applications && (
                  applications.map(app => (
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
                      <TableCell>
                        {app.status !== 'deleting' && (
                          <React.Fragment>
                            <Fab
                              to={`/applications/${app.id}`}
                              size="small"
                              color="primary"
                              aria-label="edit"
                              component={CustomRouterLink}
                            >
                              <EditIcon />
                            </Fab>
                          </React.Fragment>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>
    </Card>
  );
};

ApplicationTable.defaultProps = {
  applications: []
};

ApplicationTable.propTypes = {
  className: PropTypes.string,
  applications: PropTypes.array.isRequired
};

export default ApplicationTable;
