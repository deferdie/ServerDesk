import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
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
const TeamTable = props => {
  const {
    className,
    teams,
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
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teams.map((team, index) => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={team.id}
                  >
                    <TableCell>
                      <Typography variant="body1">{_.get(team, 'name')}</Typography>
                    </TableCell>
                    <TableCell>
                      <React.Fragment>
                        <Fab
                          size="small"
                          color="secondary"
                          aria-label="edit"
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

TeamTable.propTypes = {
  className: PropTypes.string,
  teams: PropTypes.array.isRequired
};

export default TeamTable;
