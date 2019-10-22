import React, { useState } from 'react';
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
import axios from 'axios';
import SweetAlert from 'sweetalert-react';
import { useToasts } from 'react-toast-notifications';
import ReplayIcon from '@material-ui/icons/Replay';

// Components
import Modal from '../../../../components/Modal';
import { CronJobForm } from '../../components';
import { destructServerErrors } from '../../../../helpers/error';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  }
}));

const ServerCronJobs = (props) => {
  const { server, setServer } = props;
  const classes = useStyles();
  const { addToast } = useToasts();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRestartModal, setShowRestartModal] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const defaultFormState = {
    name: '',
    user: 'root',
    cron: '* * * * *',
    command: '',
    recurrence: ''
  };
  const [formLoaders, setFormLoaders] = useState({
    creatingCron: false
  });
  const [jobFormData, setJobFormData] = useState(defaultFormState);

  const deleteJob = () => {
    let jobId = _.get(server.cronjobs, [showDeleteModal, 'id']);
    axios.delete(`/api/servers/${server.id}/cron-job/${jobId}`).then(() => {
      let s = { ...server };
      s.cronjobs.splice(showDeleteModal, 1);
      setShowDeleteModal(false);
      setServer(s);
      addToast(`Job deleted`, { appearance: 'success', autoDismiss: true });
    });
  };

  const createJob = () => {
    setFormLoaders(...formLoaders, {
      creatingCron: true
    });
    axios.post(`/api/servers/${server.id}/cron-job`, jobFormData).then((data) => {
      let s = { ...server };
      s.cronjobs.push(data.data.data);
      setServer(s);
      closeForm();
      addToast(`Installing job`, { appearance: 'success', autoDismiss: true });
      setFormLoaders(...formLoaders, {
        creatingCron: false
      });
    }).catch(error => setFormErrors(destructServerErrors(error)));
  };

  const restartJob = () => {
    let jobId = _.get(server.cronjobs, [showRestartModal, 'id']);
    axios.put(`/api/servers/${server.id}/cron-job/${jobId}`).then((data) => {
      let s = { ...server };
      s.cronjobs[showRestartModal] = data.data.data;
      setServer(s);
      setShowRestartModal(false);
      addToast(`Job restarting`, { appearance: 'success', autoDismiss: true });
    });
  };

  const closeForm = () => {
    setFormErrors({});
    setJobFormData(defaultFormState);
    setShowJobForm(false);
  };

  return (
    <Card className={classes.root}>
      <CardContent>
        <React.Fragment>
          <Typography
            gutterBottom
            variant="h4"
          >
            Cron Jobs
          </Typography>
          <Typography
            gutterBottom
            variant="subtitle2"
          >
            Manage your servers cron jobs
          </Typography>
          {/* Databases */}
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Command</TableCell>
                    <TableCell>recurrence</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Cron</TableCell>
                    <TableCell style={{ textAlign: 'right' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {_.get(server, 'cronjobs', []).map((item, index) => (
                    <TableRow
                      className={classes.tableRow}
                      hover
                      key={item.id + index}
                    >
                      <TableCell>
                        <Typography variant="body1">{_.get(item, 'name')}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1">{_.get(item, 'command')}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1">{_.get(item, 'recurrence')}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1">{_.get(item, 'user')}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1">{_.get(item, 'cron')}</Typography>
                      </TableCell>
                      <TableCell style={{ textAlign: 'right' }}>
                        <React.Fragment>
                          {/* Delete process */}
                          <Fab
                            size="small"
                            color="secondary"
                            aria-label="edit"
                            onClick={() => setShowDeleteModal(index)}
                          >
                            <DeleteIcon />
                          </Fab>

                          {/* Restart process */}
                          <Fab
                            size="small"
                            color="inherit"
                            aria-label="edit"
                            onClick={() => setShowRestartModal(index)}
                          >
                            <ReplayIcon />
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
          onClick={() => setShowJobForm(true)}
        >
          Create job
        </Button>
      </CardActions>

      {/* Alert to delete a job */}
      <SweetAlert
        show={Boolean(showDeleteModal !== false)}
        showCancelButton
        title="Delete job?"
        text={`You are about to delete this job: ${_.get(server.cronjobs, [showDeleteModal, 'name'])}`}
        onConfirm={deleteJob}
        onCancel={() => {
          setShowDeleteModal(false);
        }}
      />

      {/* Alert to restart */}
      <SweetAlert
        show={Boolean(showRestartModal !== false)}
        showCancelButton
        title="Restart job?"
        text={`You are about to this restart this job: ${_.get(server.cronjobs, [showRestartModal, 'name'])}`}
        onConfirm={restartJob}
        onCancel={() => {
          setShowRestartModal(false);
        }}
      />

      {/* Modal to create a new process */}
      <Modal
        title="Create a new job"
        open={showJobForm}
        onClose={closeForm}
        onSave={createJob}
        saveButton="Create job"
        loading={formLoaders.creatingCron}
      >
        <CronJobForm
          formData={jobFormData}
          formErrors={formErrors}
          setFormData={setJobFormData}
        />
      </Modal>
    </Card>
  );
};

ServerCronJobs.propTypes = {
  server: PropTypes.object.isRequired,
  setServer: PropTypes.func.isRequired
};

export default ServerCronJobs;
