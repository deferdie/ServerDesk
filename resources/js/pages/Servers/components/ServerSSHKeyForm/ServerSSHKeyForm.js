import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  TextField,
} from '@material-ui/core';
import axios from 'axios';
import { useToasts } from 'react-toast-notifications';
import _ from 'lodash';

// Components
import { hasError, getError, destructServerErrors } from '../../../../helpers/error';

const ServerSSHKeyForm = (props) => {
  const { server } = props;
  const { addToast } = useToasts();
  const [formErrors, setFormErrors] = useState({});

  const handleChange = event => {
    console.log('changin')
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
        defaultValue={_.get(server, 'name', '')}
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
        defaultValue={_.get(server, 'key', '')}
        error={hasError(formErrors, 'key')}
        helperText={hasError(formErrors, 'key') ? getError(formErrors, 'key') : 'Please enter your public key'}
      />
    </React.Fragment>
  );
};

ServerSSHKeyForm.propTypes = {
  server: PropTypes.object
};

export default ServerSSHKeyForm;
