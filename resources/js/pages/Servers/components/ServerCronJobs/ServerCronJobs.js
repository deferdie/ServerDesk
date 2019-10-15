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
  const [jobFormData, setJobFormData] = useState({
    name: '',
    user: 'root',
    command: '',
    recurrence: ''
  });

  const deleteJob = () => {
    let processId = _.get(server.processes, [showDeleteModal, 'id']);
    axios.delete(`/api/servers/${server.id}/process/${processId}`).then((data) => {
      let s = { ...server };
      s.processes.splice(showDeleteModal, 1);
      setServer(s);
      setShowDeleteModal(false);
      addToast(`Process deleted`, { appearance: 'success', autoDismiss: true });
    });
  };

  const createJob = () => {
    axios.post(`/api/servers/${server.id}/process`, jobFormData).then((data) => {
      let s = { ...server };
      s.processes.push(data.data.data);
      setServer(s);
      closeForm();
      addToast(`Installing process`, { appearance: 'success', autoDismiss: true });
    }).catch(error => setFormErrors(destructServerErrors(error)));
  };

  const restartJob = () => {
    let processId = _.get(server.processes, [showRestartModal, 'id']);
    axios.put(`/api/servers/${server.id}/process/${processId}`).then((data) => {
      let s = { ...server };
      s.processes[showRestartModal] = data.data.data;
      setServer(s);
      setShowRestartModal(false);
      addToast(`Process restarting`, { appearance: 'success', autoDismiss: true });
    });
  };

  const closeForm = () => {
    setFormErrors({});
    setJobFormData({
      name: '',
      user: 'root',
      command: '',
      process_count: 1
    });
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
                  {_.get(server, 'processes', []).map((item, index) => (
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
        text={`You are about to delete this job: ${_.get(server.processes, [showDeleteModal, 'name'])}`}
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
        text={`You are about to this restart this job: ${_.get(server.processes, [showRestartModal, 'name'])}`}
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