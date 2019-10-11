import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import { useToasts } from 'react-toast-notifications';

// Components
import {
  ApplicationProfile,
  DeploymentScriptEditor,
  ApplicationEncryptionManager
} from './components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const ApplicationEdit = (props) => {
  const { match } = props;
  const { Echo } = window;
  const classes = useStyles();
  const { addToast } = useToasts();
  const [application, setApplication] = useState(null);

  useEffect(() => {
    axios.get(`/api/applications/${match.params.application}`).then((data) => {
      setApplication(data.data.data);
      Echo.private(`application.${match.params.application}`)
        .listen('DeployingApplication', data => {
          addToast(data.message, { appearance: 'warning', autoDismiss: true });
          setApplication(data.application);
        })
        .listen('DeployingApplicationSuccess', data => {
          addToast(data.message, { appearance: 'success', autoDismiss: true });
          setApplication(data.application);
        });
    });
  }, []);

  return (
    <div className={classes.root}>
      {application && (
        <div className={classes.content}>
          <ApplicationProfile application={application} />

          <DeploymentScriptEditor
            application={application}
            setApplication={setApplication}
          />

          {/* Application SSL */}
          <ApplicationEncryptionManager
            application={application}
            setApplication={setApplication}
          />
        </div>
      )}
    </div>
  );
};

ApplicationEdit.propTypes = {
  match: PropTypes.object
};

export default ApplicationEdit;
