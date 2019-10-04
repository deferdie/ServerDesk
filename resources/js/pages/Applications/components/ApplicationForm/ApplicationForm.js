import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  TextField
} from '@material-ui/core';
import axios from 'axios';
import _ from 'lodash';

// Components
import { hasError, getError } from '../../../../helpers/error';

const ApplicationForm = (props) => {
  const { applicationFormData, setApplicationFormData, formErrors } = props;

  const [userSourceProviders, setUserSourceProviders] = useState([]);
  const [servers, setServers] = useState([]);
  const [selectedSourceProvider, setSelectedSourceProvider] = useState(null);

  useEffect(() => {
    axios.get('/api/servers').then(data => {
      setServers(data.data.data);
    });
    axios.get('/api/user/source-providers').then(data => {
      setUserSourceProviders(data.data.data);
    });
  }, []);

  const handleChange = event => {
    setApplicationFormData({
      ...applicationFormData,
      [event.target.name]: event.target.value
    });
  };

  const sourceProviderChanged = event => {
    // Find the provider
    let provider = _.find(userSourceProviders, (o) => { return o.id == event.target.value; });

    if (provider) {
      setSelectedSourceProvider(provider.source_provider.name);
    }

    handleChange(event);
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
          label="What type of application do you want to deploy"
          margin="dense"
          name="type"
          onChange={handleChange}
          required
          select
          SelectProps={{ native: true }}
          value={applicationFormData.type}
          variant="outlined"
          helperText={hasError(formErrors, 'type') ? getError(formErrors, 'type') : 'Please select your app type'}
          error={hasError(formErrors, 'type')}
        >
          <option selected>Please select</option>
          {[
            'PHP',
            'Laravel'
          ].map(option => (
            <option
              key={option}
              value={option}
            >
              {option}
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
          label="What server would you like to deploy to?"
          margin="dense"
          name="server_id"
          onChange={sourceProviderChanged}
          required
          select
          SelectProps={{ native: true }}
          value={applicationFormData.server_id}
          variant="outlined"
          helperText={hasError(formErrors, 'server_id') ? getError(formErrors, 'server_id') : 'Please select your server'}
          error={hasError(formErrors, 'server_id')}
        >
          <option selected>Please select</option>
          {servers.map(option => (
            <option
              key={option.id}
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
          label="Where would you like to deply from?"
          margin="dense"
          name="user_source_provider_id"
          onChange={sourceProviderChanged}
          required
          select
          SelectProps={{ native: true }}
          value={applicationFormData.user_source_provider_id}
          variant="outlined"
          helperText={hasError(formErrors, 'user_source_provider_id') ? getError(formErrors, 'user_source_provider_id') : 'Please select your server provider'}
          error={hasError(formErrors, 'user_source_provider_id')}
        >
          <option selected>Please select</option>
          {userSourceProviders.map(option => (
            <option
              key={option.id}
              value={option.id}
            >
              {option.source_provider.name}
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
          required
          type="text"
          margin="dense"
          variant="outlined"
          name="domain"
          onChange={handleChange}
          value={applicationFormData.domain}
          error={hasError(formErrors, 'domain')}
          label="Enter domain for this application"
          helperText={hasError(formErrors, 'domain') ? getError(formErrors, 'domain') : 'The domain which the application will be accessed on'}
        />
      </Grid>

      {selectedSourceProvider === 'GitHub' && <Grid
        item
        md={12}
        xs={12}
      >
        <TextField
          fullWidth
          required
          type="text"
          margin="dense"
          variant="outlined"
          name="respository"
          onChange={handleChange}
          value={applicationFormData.respository}
          error={hasError(formErrors, 'respository')}
          placeholder="you_github_user/repository_name"
          label="Enter your GitHub repository that you would like to deploy"
          helperText={hasError(formErrors, 'respository') ? getError(formErrors, 'respository') : 'The GitHub repository of the application'}
        />
      </Grid>
      }

      <Grid
        item
        md={12}
        xs={12}
      >
        <TextField
          fullWidth
          required
          type="text"
          margin="dense"
          variant="outlined"
          name="directory"
          onChange={handleChange}
          value={applicationFormData.directory}
          error={hasError(formErrors, 'directory')}
          label="Enter directory the application should be served from"
          helperText={hasError(formErrors, 'directory') ? getError(formErrors, 'directory') : 'The directory which the application will be accessed on'}
        />
      </Grid>
    </Grid>
  );
};

ApplicationForm.propTypes = {
  formErrors: PropTypes.object,
  applicationFormData: PropTypes.object,
  setApplicationFormData: PropTypes.func
};

export default ApplicationForm;
