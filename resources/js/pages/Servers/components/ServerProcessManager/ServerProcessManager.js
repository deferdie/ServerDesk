import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Fab,
  Card,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CardContent,
  CardActions,
  Typography
} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import DeleteIcon from '@material-ui/icons/Delete';
import _ from 'lodash';

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: '15px'
  }
}));

const ServerProcessManager = (props) => {
  const { server } = props;
  const classes = useStyles();

  return (
    <Card>
      <CardContent>
        <React.Fragment>
          <Typography
            gutterBottom
            variant="h4"
          >
            Background Processes
          </Typography>
          <Typography
            gutterBottom
            variant="subtitle2"
          >
            Manage your servers background processes
          </Typography>
          {/* Databases */}
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Command</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Instances</TableCell>
                    <TableCell style={{ textAlign: 'right' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {server.processes.map((item) => (
                    <TableRow
                      className={classes.tableRow}
                      hover
                      key={item.id}
                    >
                      <TableCell>
                        <Typography variant="body1">{_.get(item, 'name')}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1">{_.get(item, 'command')}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1">{_.get(item, 'user')}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1">{_.get(item, 'process_count')}</Typography>
                      </TableCell>
                      <TableCell style={{ textAlign: 'right' }}>
                        <React.Fragment>
                          {/* Delete process */}
                          <Fab
                            size="small"
                            color="secondary"
                            aria-label="edit"
                          >
                            <DeleteIcon />
                          </Fab>
                        </React.Fragment>
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
          fullWidth
          color="primary"
          variant="contained"
        >
          Create process
        </Button>
      </CardActions>
    </Card>
  );
};

ServerProcessManager.propTypes = {
  server: PropTypes.object.isRequired
};

export default ServerProcessManager;
