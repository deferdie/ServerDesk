import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import { useToasts } from 'react-toast-notifications';
import _ from 'lodash';

// Components
import { ApplicationToolbar, ApplicationTable, ApplicationForm } from './components';
import Modal from '../../components/Modal';
import { destructServerErrors } from '../../helpers/error';
import PageLoader from '../../components/PageLoader/PageLoader';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const ApplicationList = () => {
  const { Echo } = window;
  const classes = useStyles();
  const { addToast } = useToasts();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationFormErrors, setApplicationFormErrors] = useState({});
  const [applicationFormData, setApplicationFormData] = useState({
    type: '',
    domain: '',
    directory: '',
    server_id: '',
    respository: '',
    env_variables: '',
    user_source_provider_id: ''
  });

  useEffect(() => {
    // Fetch all of the server applications for this user
    axios.get('/api/applications').then((data) => {
      setApplications(data.data.data);

      data.data.data.map((application) => {
        connectApplicationToSocket(application);
      });

      setLoading(false);
    });
  }, []);

  const submitApplicationCreateForm = () => {
    axios.post('/api/applications', applicationFormData).then(data => {
      let a = [...applications];
      a.push(data.data.data);
      setApplications(a);
      setShowApplicationForm(false);
      setApplicationFormErrors({});
      addToast(`Crafting your application, please wait`, { appearance: 'success', autoDismiss: true });
    }).catch(error => setApplicationFormErrors(destructServerErrors(error)));
  };

  const connectApplicationToSocket = (application) => {
    const applicationsCopy = [...applications];
    Echo.private(`application.${application.id}`).listen('ApplicationDeployed', data => {
      let applicationToUpdate = _.findIndex(applicationsCopy, function (o) { return o.id === data.application.id; });
      applicationsCopy.splice(applicationToUpdate, 1, data.application);
      setApplications(applicationsCopy);
      addToast(`Application '${data.application.domain}' created`, { appearance: 'success', autoDismiss: true });
    });
  };

  if (loading) {
    return (
      <PageLoader loading={loading} />
    );
  }

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
