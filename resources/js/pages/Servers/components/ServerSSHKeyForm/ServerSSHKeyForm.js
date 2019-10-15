import React from 'react';
import PropTypes from 'prop-types';
import {
  TextField
} from '@material-ui/core';
import _ from 'lodash';

// Components
import { hasError, getError } from '../../../../helpers/error';

const ServerSSHKeyForm = (props) => {
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
        multiline
        rows="10"
        margin="dense"
        variant="outlined"
        onChange={handleChange}
        name="key"
        label="Public key"
        defaultValue={_.get(formData, 'key', '')}
        error={hasError(formErrors, 'key')}
        helperText={hasError(formErrors, 'key') ? getError(formErrors, 'key') : 'Please enter your public key'}
      />
    </React.Fragment>
  );
};

ServerSSHKeyForm.propTypes = {
  server: PropTypes.object,
  formData: PropTypes.object,
  setFormData: PropTypes.func,
  formErrors: PropTypes.object
};

export default ServerSSHKeyForm;
