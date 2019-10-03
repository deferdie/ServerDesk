import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Switch,
  TextField,
  FormControlLabel
} from '@material-ui/core';
import axios from 'axios';
import _ from 'lodash';

// Components
import { hasError, getError } from '../.././../../helpers/error';

const ServerForm = (props) => {
  const { setServerFormData, formErrors, serverFormData } = props;

  const [serverProviders, setServerProviders] = useState([]);
  const [userServerCreds, setUserServerCreds] = useState([]);
  const [serverProviderPlans, setServerProviderPlans] = useState([]);

  useEffect(() => {
    axios.get('/api/server-providers').then(data => {
      setServerProviders(data.data.data);
    });

    axios.get('/api/user/server-providers').then(data => {
      setUserServerCreds(data.data.data);
    });
  }, []);

  const handleChange = event => {
    console.log(event.target.name, event.target.value);
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
    let provider = event.target.value;

    if (serverFormData.user_server_provider_credential_id !== '') {
      axios.get(`/api/server-providers/${provider}/${serverFormData.user_server_provider_credential_id}`).then(data => {
        const providerPlans = { ...serverProviderPlans };
        _.set(providerPlans, provider, data.data);
        setServerProviderPlans(providerPlans);
      });
    }

    setServerFormData({
      ...serverFormData,
      [event.target.name]: provider
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
          label="Select your login"
          margin="dense"
          name="user_server_provider_credential_id"
          onChange={serverChanged}
          required
          select
          SelectProps={{ native: true }}
          value={serverFormData.user_server_provider_credential_id}
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

      {serverFormData.user_server_provider_credential_id !== '' && (
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
                value={option.id}
              >
                {option.name}
              </option>
            ))}
          </TextField>
        </Grid>
      )}

      {serverFormData.server_provider_id !== '' && (
        <React.Fragment>
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
              onChange={handleChange}
              required
              select
              SelectProps={{ native: true }}
              value={serverFormData.plan}
              variant="outlined"
              helperText={hasError(formErrors, 'plan') ? getError(formErrors, 'plan') : 'Please select your plan for this provider'}
              error={hasError(formErrors, 'plan')}
            >
              <option selected>Please select</option>
              {_.get(serverProviderPlans, serverFormData.server_provider_id, []).map(option => (
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
            <FormControlLabel
              value={serverFormData.wants_php}
              control={(
                <Switch
                  color="primary"
                  onChange={(e) => {
                    handleChange({
                      target: {
                        value: e.target.value === 'false',
                        name: 'wants_php'
                      }
                    });
                  }}
                  name="wants_php"
                />
              )}
              label="Install PHP"
              labelPlacement="start"
            />
          </Grid>

          {serverFormData.wants_php && (
            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                fullWidth
                label="Select PHP version"
                margin="dense"
                name="php_version"
                onChange={handleChange}
                required
                select
                SelectProps={{ native: true }}
                value={serverFormData.php_version}
                variant="outlined"
                helperText={hasError(formErrors, 'php_version') ? getError(formErrors, 'php_version') : 'Please select your required PHP version'}
                error={hasError(formErrors, 'php_version')}
              >
                <option selected>Please select</option>
                {[
                  '7.0',
                  '7.1',
                  '7.2',
                  '7.3'
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
          )}
        </React.Fragment>
      )}
    </Grid>
  );
};

ServerForm.propTypes = {
  formErrors: PropTypes.object,
  serverFormData: PropTypes.object.isRequired,
  setServerFormData: PropTypes.func.isRequired
};

export default ServerForm;
