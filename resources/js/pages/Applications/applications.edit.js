import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';

// Components
import { ApplicationProfile, DeploymentScriptEditor } from './components';

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
  const classes = useStyles();
  const [application, setApplication] = useState(null);

  useEffect(() => {
    axios.get(`/api/applications/${match.params.application}`).then(data => setApplication(data.data.data));
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
        </div>
      )}
    </div>
  );
};

ApplicationEdit.propTypes = {
  match: PropTypes.object
};

export default ApplicationEdit;
