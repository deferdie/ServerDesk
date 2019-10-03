import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField
} from '@material-ui/core';
import axios from 'axios';
import _ from 'lodash';

const ServerProviderForm = () => {

  const [values, setValues] = useState({
    key: null,
    name: null,
    server_provider_id: ''
  });

  const [serverProviders, setServerProviders] = useState([]);

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
          helperText="Please specify a name for your credentials"
          label="Name for your credentials"
          margin="dense"
          name="name"
          onChange={handleChange}
          required
          value={values.name}
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
          onChange={handleChange}
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

      <Grid
        item
        md={12}
        xs={12}
      >
        <TextField
          fullWidth
          helperText="API key for your provider"
          label="Enter the API key for your provider"
          margin="dense"
          name="key"
          type="password"
          onChange={handleChange}
          required
          value={values.key}
          variant="outlined"
        />
      </Grid>
    </Grid>
  );
};

export default ServerProviderForm;
