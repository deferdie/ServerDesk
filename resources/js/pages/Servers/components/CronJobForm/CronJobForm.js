import React from 'react';
import PropTypes from 'prop-types';
import {
  TextField
} from '@material-ui/core';
import _ from 'lodash';

// Components
import { hasError, getError } from '../../../../helpers/error';

const CronJobForm = (props) => {
  const { formData, setFormData, formErrors } = props;

  const handleChange = event => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  return (
    <React.Fragment>
      <TextField
        fullWidth
        margin="dense"
        label="Name"
        variant="outlined"
        onChange={handleChange}
        name="name"
        defaultValue={_.get(formData, 'name', '')}
        error={hasError(formErrors, 'name')}
        helperText={hasError(formErrors, 'name') ? getError(formErrors, 'name') : 'Please provide a name for this private key'}
      />

      <TextField
        fullWidth
        margin="dense"
        label="Command"
        variant="outlined"
        onChange={handleChange}
        name="command"
        defaultValue={_.get(formData, 'command', '')}
        error={hasError(formErrors, 'command')}
        helperText={hasError(formErrors, 'command') ? getError(formErrors, 'command') : 'The command that should run'}
      />

      <TextField
        fullWidth
        margin="dense"
        label="User"
        variant="outlined"
        onChange={handleChange}
        name="user"
        defaultValue={_.get(formData, 'user', '')}
        error={hasError(formErrors, 'user')}
        helperText={hasError(formErrors, 'user') ? getError(formErrors, 'user') : 'The user the command should run under'}
      />
    </React.Fragment>
  );
};

CronJobForm.propTypes = {
  formData: PropTypes.object,
  setFormData: PropTypes.func,
  formErrors: PropTypes.object
};

export default CronJobForm;
