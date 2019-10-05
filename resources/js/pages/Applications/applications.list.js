import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';

// Components
import { ApplicationToolbar, ApplicationTable, ApplicationForm } from './components';
import Modal from '../../components/Modal';
import { destructServerErrors } from '../../helpers/error';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const ApplicationList = () => {
  const classes = useStyles();

  const [applications, setApplications] = useState([]);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationFormErrors, setApplicationFormErrors] = useState({});
  const [applicationFormData, setApplicationFormData] = useState({
    type: '',
    domain: null,
    directory: '',
    respository: '',
    server_id: '',
    user_source_provider_id: ''
  });

  useEffect(() => {
    // Fetch all of the server applications for this user
    axios.get('/api/applications').then((data) => {
      setApplications(data.data.data);
    });
  }, []);

  const submitApplicationCreateForm = () => {
    axios.post('/api/applications', applicationFormData).then(data => {
      setApplicationFormErrors({});
    }).catch(error => setApplicationFormErrors(destructServerErrors(error)));
  };

  return (
    <div className={classes.root}>
      <ApplicationToolbar
        onAddApplication={() => setShowApplicationForm(true)}
      />
      <div className={classes.content}>
        <ApplicationTable applications={applications} />
      </div>
      <Modal
        showActionButtons={false}
        open={showApplicationForm}
        title="Add your new application"
        onClose={() => setShowApplicationForm(false)}
      >
        <ApplicationForm
          formErrors={applicationFormErrors}
          formAction={submitApplicationCreateForm}
          applicationFormData={applicationFormData}
          setApplicationFormData={setApplicationFormData}
        />
      </Modal>
    </div>
  );
};

export default ApplicationList;
