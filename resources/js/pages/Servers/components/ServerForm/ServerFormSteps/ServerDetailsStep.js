import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  TextField
} from '@material-ui/core';
import _ from 'lodash';
import ClipLoader from 'react-spinners/ClipLoader';

// Components
import { hasError, getError } from '../.././../../../helpers/error';

const ServerDetailsStep = (props) => {
  const {
    formData,
    formErrors,
    handleChange,
    serverChanged,
    userServerCreds,
    serverProviders,
    loadingProviderPlan,
    serverProviderPlans
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

      {formData.user_server_provider_credential_id !== '' && (
        <React.Fragment>
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
              value={formData.server_provider_id}
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
            <ClipLoader
              sizeUnit={'px'}
              size={20}
              color={'#123abc'}
              loading={loadingProviderPlan}
            />
            {!loadingProviderPlan ? <TextField
              fullWidth
              label="Select your plan"
              margin="dense"
              name="plan"
              onChange={handleChange}
              required
              select
              SelectProps={{ native: true }}
              value={formData.plan}
              variant="outlined"
              helperText={hasError(formErrors, 'plan') ? getError(formErrors, 'plan') : 'Please select your plan for this provider'}
              error={hasError(formErrors, 'plan')}
            >
              <option selected>Please select</option>
              {_.get(serverProviderPlans, formData.server_provider_id, []).map(option => (
                <option
                  key={option.name}
                  value={option.name}
                >
                  {option.label}
                </option>
              ))}
            </TextField>
              : ''}
          </Grid>
        </React.Fragment>
      )}

      {/* Regions */}
      {formData.plan !== null && (
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
            value={formData.provider_server_region}
            variant="outlined"
            helperText={hasError(formErrors, 'provider_server_region') ? getError(formErrors, 'provider_server_region') : 'Please select your region for this plan'}
            error={hasError(formErrors, 'provider_server_region')}
          >
            <option selected>Please select</option>
            {
              _.get(_.find(_.get(serverProviderPlans, `${formData.server_provider_id}`, []), (o) => {
                return o.name === formData.plan;
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
    </React.Fragment>
  );
};

ServerDetailsStep.propTypes = {
  formData: PropTypes.object,
  formErrors: PropTypes.object,
  handleChange: PropTypes.func,
  serverChanged: PropTypes.func,
  userServerCreds: PropTypes.array,
  serverProviders: PropTypes.array,
  loadingProviderPlan: PropTypes.bool,
  serverProviderPlans: PropTypes.array
};

export default ServerDetailsStep;
