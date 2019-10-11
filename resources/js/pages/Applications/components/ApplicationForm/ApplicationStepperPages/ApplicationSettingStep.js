import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  TextField
} from '@material-ui/core';

// Components
import { hasError, getError } from '../../../../../helpers/error';

const ApplicationSettingStep = (props) => {
  const {
    formErrors,
    applicationFormData,
    handleChange
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
            'Static HTML',
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
          required
          type="text"
          margin="dense"
          variant="outlined"
          name="domain"
          onChange={handleChange}
          defaultValue={applicationFormData.domain}
          error={hasError(formErrors, 'domain')}
          label="Enter domain for this application"
          helperText={hasError(formErrors, 'domain') ? getError(formErrors, 'domain') : 'The domain which the application will be accessed on'}
        />
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
          name="directory"
          onChange={handleChange}
          defaultValue={applicationFormData.directory}
          error={hasError(formErrors, 'directory')}
          label="Enter directory the application should be served from"
          helperText={hasError(formErrors, 'directory') ? getError(formErrors, 'directory') : 'The directory which the application will be accessed on'}
        />
      </Grid>
    </React.Fragment>
  );
};

ApplicationSettingStep.propTypes = {
  formErrors: PropTypes.object,
  handleChange: PropTypes.func,
  applicationFormData: PropTypes.object
};

export default ApplicationSettingStep;
