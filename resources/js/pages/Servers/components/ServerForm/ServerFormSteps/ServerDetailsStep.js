import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Switch,
  TextField,
  FormControlLabel
} from '@material-ui/core';

// Components
import { hasError, getError } from '../.././../../../helpers/error';

const ServerDetailsStep = (props) => {
  const {
    formData,
    formErrors,
    handleChange,
    serverChanged,
    userServerCreds
  } = props;

  return (
    <React.Fragment>
      <Grid
        item
        md={12}
        xs={12}
      >
        <TextField
          fullWidth
          label="Server name"
          margin="dense"
          name="name"
          onChange={handleChange}
          required
          value={formData.name}
          variant="outlined"
          helperText={hasError(formErrors, 'name') ? getError(formErrors, 'name') : 'Please specify the server name'}
          error={hasError(formErrors, 'name')}
        />
      </Grid>

      <Grid
        item
        md={12}
        xs={12}
      >
        <TextField
          fullWidth
          label="Select your login"
          margin="dense"
          name="user_server_provider_credential_id"
          onChange={serverChanged}
          required
          select
          SelectProps={{ native: true }}
          value={formData.user_server_provider_credential_id}
          variant="outlined"
          helperText={hasError(formErrors, 'user_server_provider_credential_id') ? getError(formErrors, 'user_server_provider_credential_id') : 'Please select your credentials for this provider'}
          error={hasError(formErrors, 'user_server_provider_credential_id')}
        >
          <option selected>Please select</option>
          {userServerCreds.map(option => (
            <option
              key={option.name}
              value={option.id}
            >
              {option.name}
            </option>
          ))}
        </TextField>
      </Grid>
    </React.Fragment>
  );
};

ServerDetailsStep.propTypes = {
  formData: PropTypes.object,
  formErrors: PropTypes.object,
  handleChange: PropTypes.func,
  serverChanged: PropTypes.func,
  userServerCreds: PropTypes.array
};

export default ServerDetailsStep;
