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
    domain: null,
    directory: '',
    respository: '',
    server_id: null,
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
        title="Add your new application"
        saveButton="Add application"
        open={showApplicationForm}
        onClose={() => setShowApplicationForm(false)}
        onSave={submitApplicationCreateForm}
      >
        <ApplicationForm
          formErrors={applicationFormErrors}
          applicationFormData={applicationFormData}
          setApplicationFormData={setApplicationFormData}
        />
      </Modal>
    </div>
  );
};

export default ApplicationList;
