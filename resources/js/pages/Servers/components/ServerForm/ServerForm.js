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
import VerticalStepper from '../../../../components/VerticalStepper';

// Stepper pages
import ServerDetailsStep from './ServerFormSteps/ServerDetailsStep';

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
      <VerticalStepper
        steps={[
          {
            title: 'Server details',
            content: (
              <ServerDetailsStep
                formErrors={formErrors}
                handleChange={handleChange}
                serverChanged={serverChanged}
                formData={serverFormData}
                userServerCreds={userServerCreds}
              />
            ),
            error: () => {
              let fields = ['name', 'user_server_provider_credential_id'];
              return fields.map((field) => {
                if (hasError(formErrors, field) === true) {
                  return true;
                }
                return false;
              })[0];
            }
          },
        ]}
      />
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

          {/* Regions */}
          {serverFormData.plan !== null && (
            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                fullWidth
                label="Select your region"
                margin="dense"
                name="provider_server_region"
                onChange={handleChange}
                required
                select
                SelectProps={{ native: true }}
                value={serverFormData.provider_server_region}
                variant="outlined"
                helperText={hasError(formErrors, 'provider_server_region') ? getError(formErrors, 'provider_server_region') : 'Please select your region for this plan'}
                error={hasError(formErrors, 'provider_server_region')}
              >
                <option selected>Please select</option>
                {
                  _.get(_.find(_.get(serverProviderPlans, `${serverFormData.server_provider_id}`, []), (o) => {
                    return o.name === serverFormData.plan;
                  }), 'regions', []).map(option => (
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
                  '7.2'
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

          <Grid
            item
            md={12}
            xs={12}
          >
            <FormControlLabel
              value={serverFormData.wants_mysql}
              control={(
                <Switch
                  color="primary"
                  onChange={(e) => {
                    handleChange({
                      target: {
                        value: e.target.value === 'false',
                        name: 'wants_mysql'
                      }
                    });
                  }}
                  name="wants_mysql"
                />
              )}
              label="Install MySQL"
              labelPlacement="start"
            />
          </Grid>

          {serverFormData.wants_mysql && (
            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                fullWidth
                label="Select a MySQL version"
                margin="dense"
                name="mysql_version"
                onChange={handleChange}
                required
                select
                SelectProps={{ native: true }}
                value={serverFormData.mysql_version}
                variant="outlined"
                helperText={hasError(formErrors, 'mysql_version') ? getError(formErrors, 'mysql_version') : 'Please select your required MySQL version'}
                error={hasError(formErrors, 'mysql_version')}
              >
                <option selected>Please select</option>
                {[
                  '5.7'
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
