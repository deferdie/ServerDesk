import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  TextField,
  CardContent,
  CardActions
} from '@material-ui/core';
import clsx from 'clsx';
import axios from 'axios';
import { useToasts } from 'react-toast-notifications';
import _ from 'lodash';

// Components
import Button from '../../../../components/Button';
import { hasError, getError, destructServerErrors } from '../../../../helpers/error';

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: '15px'
  },
  details: {
    display: 'flex'
  },
  avatar: {
    marginLeft: 'auto',
    height: 110,
    width: 100,
    flexShrink: 0,
    flexGrow: 0
  }
}));

const DeploymentScriptEditor = (props) => {
  const {
    className,
    application,
    setApplication
  } = props;
  const classes = useStyles();
  const { addToast } = useToasts();
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const updateScript = () => {
    setLoading(true);
    axios.put(`/api/applications/${application.id}`, application).then((data) => {
      setApplication(data.data.data);
      addToast(`Script updated`, { appearance: 'success', autoDismiss: true });
      setLoading(false);
    }).catch((error) => {
      setLoading(false);
      setFormErrors(destructServerErrors(error));
    });
  };

  const handleChange = event => {
    setApplication({
      ...application,
      [event.target.name]: event.target.value
    });
  };

  return (
    <Card
      className={clsx(classes.root, className)}
    >
      <CardContent>
        <div className={classes.details}>
          <TextField
            fullWidth
            multiline
            rows="10"
            margin="dense"
            variant="outlined"
            onChange={handleChange}
            name="deployment_script"
            defaultValue={_.get(application, 'deployment_script', '')}
            error={hasError(formErrors, 'deployment_script')}
            helperText={hasError(formErrors, 'deployment_script') ? getError(formErrors, 'deployment_script') : 'Please make sure this script is working before trying to deploy'}
          />
        </div>
      </CardContent>
      <CardActions>
        <Button
          color="primary"
          loading={loading}
          variant="contained"
          onClick={updateScript}
        >
          Save script
        </Button>
      </CardActions>
    </Card>
  );
};

DeploymentScriptEditor.propTypes = {
  className: PropTypes.object,
  application: PropTypes.object,
  setApplication: PropTypes.func
};

export default DeploymentScriptEditor;
