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
            SSH keys
          </Typography>
          <Typography
            gutterBottom
            variant="subtitle2"
          >
            Manage your SSH keys for this server
          </Typography>
          {/* Databases */}
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell style={{ textAlign: 'right' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {server.public_keys.map((key, index) => (
                    <TableRow
                      className={classes.tableRow}
                      hover
                      key={key.id}
                    >
                      <TableCell>
                        <Typography variant="body1">{_.get(key, 'name')}</Typography>
                      </TableCell>
                      <TableCell style={{ textAlign: 'right' }}>
                        <React.Fragment>
                          {/* Delete Sever */}
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
          Add key
        </Button>
      </CardActions>
    </Card>
  );
};

ServerProcessManager.propTypes = {
  server: PropTypes.object.isRequired
};

export default ServerProcessManager;
