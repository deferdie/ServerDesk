import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import { useToasts } from 'react-toast-notifications';
import _ from 'lodash';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

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

const ApplicationList = (props) => {
  const { auth } = props;
  const classes = useStyles();
  const { addToast } = useToasts();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationFormErrors, setApplicationFormErrors] = useState({});
  const defaultState = {
    type: '',
    domain: '',
    directory: '',
    server_id: '',
    respository: '',
    env_variables: '',
    mysql_database_id: '',
    user_source_provider_id: ''
  };
  const [applicationFormData, setApplicationFormData] = useState(defaultState);

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
      connectApplicationToSocket(data.data.data);
      setApplicationFormData(defaultState);
      addToast(`Crafting your application, please wait`, { appearance: 'success', autoDismiss: true });
    }).catch(error => setApplicationFormErrors(destructServerErrors(error)));
  };

  const connectApplicationToSocket = (application) => {
    auth.echo.private(`application.${application.id}`)
      .listen('ApplicationDeployed', data => {
        const applicationsCopy = [...applications];
        let applicationToUpdate = _.findIndex(applicationsCopy, function (o) {
          return o.id === data.application.id;
        });
        applicationsCopy.splice(applicationToUpdate, 1, data.application);
        setApplications(applicationsCopy);
        addToast(`Application '${data.application.domain}' created`, {
          appearance: 'success',
          autoDismiss: true
        });
      })
      .listen('ApplicationDeleted', data => {
        const applicationsCopy = [...applications];
        let applicationDelete = _.findIndex(applicationsCopy, function (o) {
          return o.id === data.applicationID;
        });
        applicationsCopy.splice(applicationDelete, 1);
        setApplications(applicationsCopy);
        addToast(`Application deleted`, {
          appearance: 'success',
          autoDismiss: true
        });
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

ApplicationList.propTypes = {
  auth: PropTypes.object
};

const mapStateToProps = ({ auth }) => ({ auth });

export default connect(mapStateToProps, null, null)(ApplicationList);
