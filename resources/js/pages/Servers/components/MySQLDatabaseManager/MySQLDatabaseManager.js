import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  Button,
  Divider,
  CardContent,
  CardActions,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import _ from 'lodash';
import moment from 'moment';

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: '15px'
  },
  details: {
    display: 'flex'
  }
}));

const MySQLDatabaseManager = (props) => {
  const { className, server, ...rest } = props;
  const [databases, setDatabases] = useState([]);

  const classes = useStyles();

  return (
    <React.Fragment>
      <Card
        {...rest}
        className={clsx(classes.root, className)}
      >
        <CardContent>
          <React.Fragment>
            <Typography
              gutterBottom
              variant="h4"
            >
              Database settings - MySQL
            </Typography>
            {/* Databases */}
            <PerfectScrollbar>
              <div className={classes.inner}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Database created</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {databases.map(provider => (
                      <TableRow
                        className={classes.tableRow}
                        hover
                        key={provider.id}
                      >
                        <TableCell>
                          <Typography variant="body1">{_.get(provider, 'name')}</Typography>
                        </TableCell>
                        <TableCell>
                          {moment(provider.created_at).format('DD/MM/YYYY')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </PerfectScrollbar>
          </React.Fragment>
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            color="primary"
            variant="contained"
          >
            Create database
          </Button>
          <Button
            color="primary"
            variant="contained"
          >
            Add user
          </Button>
        </CardActions>
      </Card>
    </React.Fragment>
  );
};

MySQLDatabaseManager.propTypes = {
  server: PropTypes.object,
  className: PropTypes.object
};

export default MySQLDatabaseManager;
