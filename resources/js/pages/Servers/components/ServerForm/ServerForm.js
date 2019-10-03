import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  TextField
} from '@material-ui/core';
import axios from 'axios';
import _ from 'lodash';

// Components
import { hasError, getError } from '../.././../../helpers/error';

const ServerForm = (props) => {
  const { setServerFormData, formErrors, serverFormData } = props;

  const [serverProviders, setServerProviders] = useState([]);
  const [serverProviderPlans, setServerProviderPlans] = useState({});

  useEffect(() => {
    axios.get('/api/server-providers').then(data => {
      setServerProviders(data.data.data);
    });
  }, []);

  const handleChange = event => {
    setServerFormData({
      ...serverFormData,
      [event.target.name]: event.target.value
    });
  };

  /**
   * Get the plans for the provider
   * @param {SyntheticEvent} event The event fired from the change
   */
  const serverChanged = event => {
    axios.get(`/api/server-providers/${event.target.value}/plans`).then(data => {
      const providerPlans = { ...serverProviderPlans };
      _.set(providerPlans, event.target.value, data.data.data);
      setServerProviderPlans(providerPlans);
    });

    setServerFormData({
      ...serverFormData,
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
          label="Server name"
          margin="dense"
          name="name"
          onChange={handleChange}
          required
          value={serverFormData.name}
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
          label="Select server provider"
          margin="dense"
          name="server_provider_id"
          onChange={serverChanged}
          required
          select
          SelectProps={{ native: true }}
          value={serverFormData.server_provider_id}
          variant="outlined"
          helperText={hasError(formErrors, 'server_provider_id') ? getError(formErrors, 'server_provider_id') : 'Please select your server provider'}
          error={hasError(formErrors, 'server_provider_id')}
        >
          <option selected>Please select</option>
          {serverProviders.map(option => (
            <option
              key={option.name}
              value={option.name}
            >
              {option.name}
            </option>
          ))}
        </TextField>
      </Grid>

      {serverFormData.server_provider_id !== '' && (
        <Grid
          item
          md={12}
          xs={12}
        >
          <TextField
            fullWidth
            label="Select your plan"
            margin="dense"
            name="plan"
            onChange={serverChanged}
            required
            select
            SelectProps={{ native: true }}
            value={serverFormData.plan}
            variant="outlined"
            helperText={hasError(formErrors, 'plan') ? getError(formErrors, 'plan') : 'Please select your plan for this provider'}
            error={hasError(formErrors, 'plan')}
          >
            <option selected>Please select</option>
            {serverProviders.map(option => (
              <option
                key={option.name}
                value={option.name}
              >
                {option.name}
              </option>
            ))}
          </TextField>
        </Grid>
      )}
    </Grid>
  );
};

ServerForm.propTypes = {
  serverFormData: PropTypes.object.isRequired,
  setServerFormData: PropTypes.func.isRequired
};

export default ServerForm;
