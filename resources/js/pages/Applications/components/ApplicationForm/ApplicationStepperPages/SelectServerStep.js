import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  TextField
} from '@material-ui/core';

// Components
import { hasError, getError } from '../../../../../helpers/error';

const SelectServerStep = (props) => {
  const {
    servers,
    formErrors,
    handleChange,
    userSourceProviders,
    applicationFormData,
    sourceProviderChanged
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
          label="What server would you like to deploy to?"
          margin="dense"
          name="server_id"
          required
          select
          onChange={handleChange}
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
          label="What type of application do you want to deploy"
          margin="dense"
          name="type"
          onChange={(e) => {
            e.target.value === 'Laravel' && handleChange({
              target: {
                value: 'public',
                name: 'directory'
              }
            });
            handleChange(e);
          }}
          required
          select
          SelectProps={{ native: true }}
          defaultValue={applicationFormData.type}
          variant="outlined"
          helperText={hasError(formErrors, 'type') ? getError(formErrors, 'type') : 'Please select your app type'}
          error={hasError(formErrors, 'type')}
        >
          <option selected>Please select</option>
          {[
            'Laravel',
            'Adonis JS',
            'WordPress',
            'Static HTML'
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

      {applicationFormData.type !== 'WordPress' && (
        <React.Fragment>
          <Grid
            item
            md={12}
            xs={12}
          >
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
              name="respository"
              onChange={handleChange}
              defaultValue={applicationFormData.respository}
              error={hasError(formErrors, 'respository')}
              placeholder="you_github_user/repository_name"
              label="Enter your GitHub repository that you would like to deploy"
              helperText={hasError(formErrors, 'respository') ? getError(formErrors, 'respository') : 'The GitHub repository of the application'}
            />
          </Grid>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

SelectServerStep.propTypes = {
  servers: PropTypes.array,
  formErrors: PropTypes.object,
  handleChange: PropTypes.func,
  userSourceProviders: PropTypes.array,
  applicationFormData: PropTypes.object,
  sourceProviderChanged: PropTypes.func
};

export default SelectServerStep;
