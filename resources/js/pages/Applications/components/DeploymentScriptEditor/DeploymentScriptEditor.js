import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  Button,
  TextField,
  CardContent,
  CardActions
} from '@material-ui/core';
import clsx from 'clsx';
import axios from 'axios';
import { useToasts } from 'react-toast-notifications';
import _ from 'lodash';

// Components
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
  },
  cardAction: {
    background: '#e7e7e7'
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

  const updateScript = () => {
    axios.put(`/api/applications/${application.id}`, application).then((data) => {
      setApplication(data.data.data);
      addToast(`Script updated`, { appearance: 'success', autoDismiss: true });
    }).catch(error => setFormErrors(destructServerErrors(error)));
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
      <CardActions className={classes.cardAction}>
        <Button
          color="primary"
          onClick={updateScript}
          variant="contained"
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
