import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  TextField
} from '@material-ui/core';
import axios from 'axios';

// Components
import { hasError, getError } from '../.././../../helpers/error';

const ServerProviderForm = (props) => {
  const [serverProviders, setServerProviders] = useState([]);
  const { providerFormData, setProviderFormData, formErrors } = props;

  useEffect(() => {
    axios.get('/api/server-providers').then(data => {
      setServerProviders(data.data.data);
    });
  }, []);

  const handleChange = event => {
    setProviderFormData({
      ...providerFormData,
      [event.target.name]: event.target.value
    });
  };

  return (
    <Grid
      container
      spacing={3}
    >
      <Grid
        item
        md={12}
        xs={12}
      >
        <TextField
          fullWidth
          label="Name for your credentials"
          margin="dense"
          name="name"
          onChange={handleChange}
          required
          value={providerFormData.name}
          variant="outlined"
          helperText={hasError(formErrors, 'name') ? getError(formErrors, 'name') : 'Please specify a name for your credentials'}
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
          label="Select server provider"
          margin="dense"
          name="server_provider_id"
          onChange={handleChange}
          required
          select
          SelectProps={{ native: true }}
          value={providerFormData.server_provider_id}
          variant="outlined"
          helperText={hasError(formErrors, 'server_provider_id') ? getError(formErrors, 'server_provider_id') : 'Please select your server provider'}
          error={hasError(formErrors, 'server_provider_id')}
        >
          <option selected>Please select</option>
          {serverProviders.map(option => (
            <option
              key={option.name}
              value={option.id}
            >
              {option.name}
            </option>
          ))}
        </TextField>
      </Grid>

      <Grid
        item
        md={12}
        xs={12}
      >
        <TextField
          fullWidth
          label="Enter the API key for your provider"
          margin="dense"
          name="key"
          type="password"
          onChange={handleChange}
          required
          value={providerFormData.key}
          variant="outlined"
          helperText={hasError(formErrors, 'key') ? getError(formErrors, 'key') : 'API key for your provider'}
          error={hasError(formErrors, 'key')}
        />
      </Grid>
    </Grid>
  );
};

ServerProviderForm.propTypes = {
  formErrors: PropTypes.object,
  providerFormData: PropTypes.object,
  setProviderFormData: PropTypes.func
};

export default ServerProviderForm;
