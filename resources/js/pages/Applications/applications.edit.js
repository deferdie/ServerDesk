import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import { useToasts } from 'react-toast-notifications';
import { connect } from 'react-redux';

// Components
import {
  ApplicationProfile,
  DeploymentScriptEditor,
  ApplicationEncryptionManager
} from './components';
import PageLoader from '../../components/PageLoader/PageLoader';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const ApplicationEdit = (props) => {
  const { match, auth } = props;
  const classes = useStyles();
  const { addToast } = useToasts();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/applications/${match.params.application}`).then((data) => {
      setApplication(data.data.data);
      auth.echo.private(`application.${match.params.application}`)
        .listen('DeployingApplication', data => {
          addToast(data.message, { appearance: 'warning', autoDismiss: true });
          setApplication(data.application);
        })
        .listen('DeployingApplicationSuccess', data => {
          addToast(data.message, { appearance: 'success', autoDismiss: true });
          setApplication(data.application);
        })
        .listen('ApplicationUpdated', data => {
          addToast(data.message, { appearance: 'success', autoDismiss: true });
          setApplication(data.application);
        });
      setLoading(false);
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

      {loading && (
        <PageLoader loading={loading} label="Getting details about your server" />
      )}
    </div>
  );
};

ApplicationEdit.propTypes = {
  auth: PropTypes.object,
  match: PropTypes.object
};

const mapStateToProps = ({ auth }) => ({ auth });

export default connect(mapStateToProps, null, null)(ApplicationEdit);
