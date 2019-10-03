import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  TextField
} from '@material-ui/core';
import axios from 'axios';
import _ from 'lodash';

const ServerForm = (props) => {

  const [values, setValues] = useState({
    name: null,
    server_provider_id: '',
    plan: null
  });

  const [serverProviders, setServerProviders] = useState([]);
  const [serverProviderPlans, setServerProviderPlans] = useState({});

  useEffect(() => {
    axios.get('/api/server-providers').then(data => {
      setServerProviders(data.data.data);
    });
  }, []);

  const handleChange = event => {
    setValues({
      ...values,
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

    setValues({
      ...values,
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
          helperText="Please specify the server name"
          label="First name"
          margin="dense"
          name="firstName"
          onChange={handleChange}
          required
          value={values.firstName}
          variant="outlined"
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
          helperText="Please select your server provider"
          margin="dense"
          name="server_provider_id"
          onChange={serverChanged}
          required
          select
          SelectProps={{ native: true }}
          value={values.server_provider_id}
          variant="outlined"
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

      {values.server_provider_id !== '' && (
        <Grid
          item
          md={12}
          xs={12}
        >
          <TextField
            fullWidth
            label="Select server provider"
            helperText="Please select your server provider"
            margin="dense"
            name="server_provider_id"
            onChange={serverChanged}
            required
            select
            SelectProps={{ native: true }}
            value={values.server_provider_id}
            variant="outlined"
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

};

export default ServerForm;
