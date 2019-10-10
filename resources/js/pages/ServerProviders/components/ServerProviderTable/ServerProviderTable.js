import React, { useState } from 'react';
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
import DeleteIcon from '@material-ui/icons/Delete';
import SweetAlert from 'sweetalert-react';
import axios from 'axios';
import { useToasts } from 'react-toast-notifications';

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

const ServerProviderTable = props => {
  const { className, providers, setProviders, ...rest } = props;
  const classes = useStyles();
  const [providerToDelete, setProviderToDelete] = useState(false);
  const { addToast } = useToasts();

  const deleteProvider = () => {
    axios.delete(`/api/user/server-providers/${_.get(providers, [providerToDelete, 'id'])}`).then((data) => {
      let p = [...providers];
      p.splice(providerToDelete, 1);
      setProviders(p);
      setProviderToDelete(false);
      addToast(`We successfully removed the provider from your account`, { appearance: 'success', autoDismiss: true });
    });
  };

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
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {providers.map((provider, index) => {
                  return (
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
                        <Fab
                          size="small"
                          color="secondary"
                          aria-label="edit"
                          onClick={() => setProviderToDelete(index)}
                        >
                          <DeleteIcon />
                        </Fab>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>
      {/* Alert to delete a database */}
      <SweetAlert
        show={Boolean(providerToDelete !== false)}
        showCancelButton
        type="error"
        title="Are you sure you want to delete this provider?"
        text={`You are about to this provider ${_.get(providers, [providerToDelete, 'name'])}`}
        onConfirm={deleteProvider}
        onCancel={() => {
          setProviderToDelete(false);
        }}
      />
    </Card>
  );
};

ServerProviderTable.propTypes = {
  className: PropTypes.string,
  providers: PropTypes.array.isRequired,
  setProviders: PropTypes.func.isRequired,
};

export default ServerProviderTable;
